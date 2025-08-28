import { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import InvoiceModal from "./InvoiceModal";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Modal,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  Table,
  TabPane
} from "reactstrap";
import { MdOutlinePayments } from "react-icons/md";
import { convertstoPaid, convertToCredit, getInvoiceDataById, nextSeq, getAdminById } from "../../service/admin";
import moment from "moment";
import DropDown from "./DropDown";
import InvoiceViewDetailed from "./InvoiceViewDetailed";
import PaginationComponent from "../../components/pagination/Pagination";
import { exportCsv } from "../../assets/commonFunction";
import { permisionsTab, userInfo } from "../../assets/userLoginInfo";
import { paginateData } from "../../utils/Utils";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import Error403 from "../../components/error/error403";
import { CiFilter } from "react-icons/ci";
import InovoiceFilterModal from "./InovoiceFilterModal";
import InovoiceFilterModal1 from "./InovoiceFilterModal";
import { useDispatch } from "react-redux";
import { error, success } from "../../Store/Slices/SnackbarSlice";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import PartialPayment from "./PartialPayment";

export default function PaymentsAndBillings() {
  const handlePartialPayment = invoice => {
    if (!invoice) {
      console.error("Cannot open partial payment modal - invoice is null");
      return;
    }

    setPartialPaymentModal({
      isOpen: true,
      invoice: {
        ...invoice,
        partialPayments: invoice.partialPayments || [] // Ensure partialPayments exists
      }
    });
  };
  const items = ["All", "Option 1", "Option 2", "Option 3"];
  const items1 = ["All", "To be paid", "Overdue", "Paid"];
  const dispatch = useDispatch();
  const [invoicePermission, setInvoicePermission] = useState([]);
  const [makeSure, setMakeSure] = useState({ status: false, id: "" });
  const [makeSure1, setMakeSure1] = useState({ status: false, id: "" });
  const history = useHistory();
  const [openFilter, setOpenFilter] = useState(false);
  const [openFilter1, setOpenFilter1] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [perfomaData, setPerfomaData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [ViewOpen, setViewOpen] = useState({ status: false });
  const [rowData, setRowData] = useState([]);
  let [page, setPage] = useState(1);
  let [page1, setPage1] = useState(1);
  let itemPerPage = 8;
  let itemPerPage1 = 8;
  const [allPlanData, setAllPlanData] = useState([]);
  const [allPlanData1, setAllPlanData1] = useState([]);
  const [exportData, setExportData] = useState([]);

  const [exportData1, setExportData1] = useState([]);
  const [exportData12, setExportData2] = useState([]);
  const [loader, setLoader] = useState(true);
  const [permissionAccess, setPermissionAccess] = useState(true);
  const [allPlan, setAllPlan] = useState([]);
  const [allPlan1, setAllPlan1] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const [getLogoData, setGetLogoData] = useState({});

  const getLogoFunction = async () => {
    // setLoader(true);
    try {
      let response = await getAdminById().then(res => {
        return res.data.data;
      });
      setGetLogoData(response);
    } catch (err) {
      console.log(err);
    } finally {
      // setLoader(false);
    }
  };

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };
  async function changetoPaid(ids, type) {
    // setLoader(true);
    try {
      let response = await convertstoPaid(ids, {
        paid: "paid",
        tds: InvoiceInfo.current.tds,
        payment_status: type === "credit" ? "credit" : "paid"
      });
      if (type === "credit") {
        await convertToCredit(response.data.data._id);
      }
      await getData();
    } catch (err) {
      console.log(err);
    }
    // setLoader(false);
  }

  function exportDatacsv(exportss) {
    let exportInfo = exportss.map(e => {
      return {
        "Invoice No": e?.invoice_no,
        "Created On": moment(e.createdAt).format("DD-MM-YYYY"),
        // "Plan Name": e?.planInfo?.plan_name,
        Amount: e?.grand_total?.toFixed(2),
        "Customer Name": e?.subscriberInfo?.full_name,
        Email: e?.subscriberInfo?.email,
        "Mobile Number": e?.subscriberInfo?.mobile_number,
        Status: e?.payment_status ? e?.payment_status?.charAt(0)?.toUpperCase() + e?.payment_status?.slice(1) : "Paid"
      };
    });
    return exportInfo;
  }
  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter(s => s.tab_name === "Invoices");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0].is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setInvoicePermission(permissionArr);
    }
  }
  const [invoiceCodeExist, setInvoiceCodeExist] = useState(false);

  const convertToCreditNumber = async id => {
    try {
      let result = await convertToCredit(id);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = () => {
    if (invoiceCodeExist) {
      dispatch(
        error({
          show: true,
          msg: "First fill information in Invoice Setting",
          severity: "error"
        })
      );
    } else {
      setIsOpen(true);
    }
  };
  const seqId = async () => {
    const res = await nextSeq({
      paid: "perfoma"
    });
    let response = res.data.data;
    if (Object.keys(response).length !== 0) {
      setInvoiceCodeExist(false);
    } else {
      setInvoiceCodeExist(true);
    }
  };
  const handleFilter = () => {
    setOpenFilter(true);
  };
  const filteringData = ReverseData => {
    if (activeTab === "0") {
      setAllPlan1(ReverseData);
      const datas1 = paginateData(page1, itemPerPage1, ReverseData);
      setPerfomaData(datas1);
    } else {
      setAllPlan(ReverseData);
      const datas = paginateData(page, itemPerPage, ReverseData);
      setData(datas);
    }
  };
  
  const getData = async () => {
    try {
      setLoader(true);
      let Payload;
      if (userInfo().role === "isp admin" || userInfo().role === "admin") {
        Payload = {
          org_id: userInfo()._id
        };
      } else {
        Payload = {
          org_id: userInfo().org_id,
          isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
        };
      }
      const res = await getInvoiceDataById(Payload);
      await permissionFunction();
      let ReverseData = res?.data?.data?.invoice?.reverse();
      //
      let ReversePerfomaData = res?.data?.data?.perfoma?.reverse();
      setAllPlanData(ReverseData);
      setAllPlan(ReverseData);
      setAllPlanData1(ReversePerfomaData);
      setAllPlan1(ReversePerfomaData);
      const datas = paginateData(page, itemPerPage, ReverseData);
      setData(datas);
      const datas1 = paginateData(page1, itemPerPage1, ReversePerfomaData);
      setPerfomaData(datas1);

      let exportInfo2 = ReverseData.map(e => {
        return {};
      });
      let exportInfo3 = ReversePerfomaData.map(e => {
        return {};
      });

      setExportData1(exportInfo2);
      setExportData2(exportInfo3);
      setExportData(exportInfo);
      setSearchData(res.data.data);
      setLoader(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  const handleSearchClick = e => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, allPlanData);
      setAllPlan(allPlanData);
      setData(ddd);
    } else {
      if (Array.isArray(allPlanData)) {
        const filteredData = allPlanData.filter(res => {
          const Invoice = res?.invoice_no?.toLowerCase() || "";
          // const PlanInfo = res?.planInfo?.plan_name?.toLowerCase() || "";
          const Amount = res?.planInfo?.amount?.toString().toLowerCase() || "";
          const paymentStatus = res?.payment_status?.toString().toLowerCase() || "";
          const customerName = res?.subscriberInfo?.full_name?.toLowerCase() || "";

          return (
            Invoice.includes(val) || Amount.includes(val) || paymentStatus.includes(val) || customerName.includes(val)
          );
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setData(ddd);
      } else {
      }
    }
  };
  let InvoiceInfo = useRef({ tds: 0 });
  const handleSearchClick1 = e => {
    const val = e.target.value?.trim().toLowerCase();

    if (!val) {
      let ddd = paginateData(page1, itemPerPage1, allPlanData1);
      setAllPlan1(allPlanData1);
      setPerfomaData(ddd);
      return;
    }
    if (Array.isArray(allPlanData1)) {
      const filteredData = allPlanData1.filter(res => {
        const invoiceNo = res?.invoice_no?.toLowerCase() || "";
        const planName = res?.invoice_table?.payment_name?.toLowerCase() || "";
        const amount = res?.invoice_table?.amount?.toString().toLowerCase() || "";
        const paymentStatus = res?.payment_status?.toString().toLowerCase() || "";
        const customerName = res?.subscriberInfo?.full_name?.toLowerCase() || "";

        return (
          invoiceNo.includes(val) ||
          planName.includes(val) ||
          amount.includes(val) ||
          paymentStatus.includes(val) ||
          customerName.includes(val)
        );
      });

      let ddd = paginateData(page1, itemPerPage1, filteredData);
      setAllPlan1(filteredData);
      setPerfomaData(ddd);
    }
  };

  useEffect(() => {
    //
    let ddd = paginateData(page, itemPerPage, allPlan);

    //
    setData(ddd);
  }, [page]);
  useEffect(() => {
    //

    let ddd1 = paginateData(page1, itemPerPage1, allPlan1);
    //

    setPerfomaData(ddd1);
  }, [page1]);

  useEffect(() => {
    getData();
    seqId();
    getLogoFunction();
  }, []);

  const inVoiceRef1 = useRef(null);

  async function convertToImg() {
    // setLoader(true);
    let arr = [inVoiceRef1.current];
    let photoArr = [];
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let index = 0; index < arr.length; index++) {
      const res = arr[index];
      await htmlToImage
        .toPng(res, { quality: 0.5 }) // Reduced quality to 0.5
        .then(function(dataUrl) {
          photoArr.push(dataUrl);
          const imgProps = pdf.getImageProperties(dataUrl);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // Scale image to fit within PDF dimensions
          const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
          const scaledWidth = imgProps.width * scaleFactor;
          const scaledHeight = imgProps.height * scaleFactor;

          pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST"); // Added compression option
          if (index !== arr.length - 1) {
            pdf.addPage();
          }
        })
        .catch(function(error) {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (index === arr.length - 1) {
            // setLoader(false);
          }
        });
    }

    pdf.save("Invoice Management.pdf");
  }
  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      // background: "linear-gradient(251.07deg, #FFFFFF 35.06%, #E8F9FA 95.96%)",
      // margin:'0 auto'
      background: "white"
    }
  };

  const [activeTab, toggleTab] = useState("0");
  function toggle() {
    // setOpen(!open);
    // setFormData({});
    toggleTab("1");
  }
  const [partialPaymentModal, setPartialPaymentModal] = useState({
    isOpen: false,
    invoice: null
  });
  const handleSavePartialPayments = updatedInvoice => {
    if (activeTab === "0") {
      setAllPlan1(prev => prev.map(inv => (inv._id === updatedInvoice._id ? updatedInvoice : inv)));
      const datas1 = paginateData(
        page1,
        itemPerPage1,
        allPlan1.map(inv => (inv._id === updatedInvoice._id ? updatedInvoice : inv))
      );
      setPerfomaData(datas1);
    } else {
      setAllPlan(prev => prev.map(inv => (inv._id === updatedInvoice._id ? updatedInvoice : inv)));
      const datas = paginateData(
        page,
        itemPerPage,
        allPlan.map(inv => (inv._id === updatedInvoice._id ? updatedInvoice : inv))
      );
      setData(datas);
    }
    setPartialPaymentModal({ isOpen: false, invoice: null });
  };
  // console.log(data,"paid invoice data")
  return (
    <Content>
      <PartialPayment
        isOpen={partialPaymentModal.isOpen}
        toggle={() => setPartialPaymentModal({ isOpen: false, invoice: null })}
        invoice={partialPaymentModal.invoice}
        onSave={handleSavePartialPayments}
        getData={getData}
        setMakeSure={setMakeSure}
      />
      <div style={{ width: "2000px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>Invoice Management</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Invoice No.</th>
                  <th>Created On</th>
                  <th>Amount</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map(res => (
                  <tr key={res.id}>
                    <td
                      className={invoicePermission.includes("View Invoice") ? "pointer" : ""}
                      onClick={() => {
                        if (invoicePermission.includes("View Invoice")) {
                          setViewOpen({ status: true, data: res });
                          setRowData(res);
                        }
                      }}
                    >
                      {res.invoice_no}
                               

                    </td>
                    <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
                    <td>{res?.invoice_table?.total_amount}</td>
                    <td>{res?.subscriberInfo?.full_name}</td>
                    <td>{res?.subscriberInfo?.email ? res?.subscriberInfo?.email : "---"}</td>

                    <td>{res?.subscriberInfo?.mobile_number}</td>
                    <td>
                      {res?.payment_status === "paid" || res?.payment_status === "credit" ? (
                        res?.payment_status.charAt(0).toUpperCase() + res?.payment_status.slice(1)
                      ) : (
                        <>
                          {invoicePermission.includes("Change Invoice Status") ? (
                            <>
                              {" "}
                              <SingleSelect
                                options={[
                                  { label: "Pending", value: "pending" },
                                  { label: "Paid", value: "paid" },
                                  { label: "Credit Note", value: "credit" }
                                ]}
                                placeItem={"Status"}
                                value={res?.payment_status}
                                onChange={e => {
                                  if (e.target.value === "paid") {
                                    setMakeSure({ status: true, id: res._id , type: "paid"});
                                  }
                                  if (e.target.value === "credit") {
                                    setMakeSure({ status: true, id: res._id, type: "credit" });
                                  }
                                }}
                              />
                            </>
                          ) : (
                            res?.payment_status.charAt(0).toUpperCase() + res?.payment_status.slice(1)
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <InovoiceFilterModal
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        filteringData={filteringData}
        allPlanData={activeTab === "0" ? allPlanData1 : allPlanData}
        activeTab={activeTab}
      />
      <InovoiceFilterModal1
        openFilter={openFilter1}
        setOpenFilter={setOpenFilter1}
        filteringData={filteringData}
        allPlanData={activeTab === "0" ? allPlanData1 : allPlanData}
        activeTab={activeTab}
      />
      <Modal size="md" isOpen={makeSure.status} toggle={() => setMakeSure({ status: false, id: "" })}>
        <div className="p-4">
          <h3>Convert to {makeSure?.type === "paid" ? "Paid Invoice" : "Credit Note"}</h3>
          <div className="d-flex align-items-center mt-2 h5_delete">
            Are you sure you want to convert performa invoice to{" "}
            {makeSure?.type === "paid" ? " paid invoice" : "Credit Note"} ?
          </div>
          {makeSure?.type === "paid" && (
            <>
              <div className="mt-3">
                <Label>TDS (in %) </Label>
                <Input
                  type="number"
                  name="tds"
                  className="ms-4 w-25  form-control"
                  onChange={e => {
                    InvoiceInfo.current.tds = +e.target.value;
                  }}
                />
              </div>
            </>
          )}
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex">
              <button
                type="button"
                className="btn mr-2"
                onClick={() => {
                  setMakeSure({ status: false, id: "" });
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  changetoPaid(makeSure.id, makeSure?.type);
                  setMakeSure({ status: false, id: "" });
                }}
              >
                {makeSure?.type === "paid" ? "Paid" : "Credit Note"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal size="md" isOpen={makeSure1.status} toggle={() => setMakeSure1({ status: false, id: "" })}>
        <div className="p-4">
          <h3>Convert to Credit Invoice</h3>
          <div className="d-flex align-items-center mt-2 h5_delete">
            Are you sure you want to convert invoice to credit Invoice ?
          </div>
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex">
              <button
                type="button"
                className="btn mr-2"
                onClick={() => {
                  setMakeSure1({ status: false, id: "" });
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  convertToCreditNumber(makeSure1.id);
                  setMakeSure1({ status: false, id: "" });
                }}
              >
                Sure
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {loader ? (
        <>
          <TableSkeleton columns={5} />
        </>
      ) : (
        <>
          {permissionAccess && invoicePermission.includes("Invoice Management Tab") ? (
            <>
              {" "}
              {/* <PreviewCard> */}
              <div className="card_container p-md-4 p-sm-3 p-3">
                <div className="topContainer">
                  <div className="f-28">Invoice Management</div>
                  <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                    {invoicePermission.includes("Export Invoice") && (
                      <>
                        {/* <div>
                          <button
                            className="btn export"
                            onClick={() => {
                              exportCsv(exportDatacsv(allPlan), "Invoice");
                            }}
                          >
                            Export
                          </button>
                        </div> */}
                        {activeTab == "0" ? (
                          <div className="dropdown_logs ">
                            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                              <DropdownToggle
                                caret
                                className="parimary-background text-wrap text-capitalize"
                                type="button"
                              >
                                Export
                                <span className="ml-2">
                                  {icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}{" "}
                                </span>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>
                                  <ExportCsv
                                    exportData={exportDatacsv(allPlan1)}
                                    filName={"Perfoma Invoice Management"}
                                  />
                                </DropdownItem>
                                <DropdownItem>
                                  {" "}
                                  <div onClick={convertToImg}>PDF</div>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        ) : (
                          <div className="dropdown_logs ">
                            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                              <DropdownToggle
                                caret
                                className="parimary-background text-wrap text-capitalize"
                                type="button"
                              >
                                Export
                                <span className="ml-2">
                                  {icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}{" "}
                                </span>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>
                                  <ExportCsv exportData={exportDatacsv(allPlan)} filName={"Paid Invoice Management"} />
                                </DropdownItem>
                                <DropdownItem>
                                  {" "}
                                  <div onClick={convertToImg}>PDF</div>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        )}
                        {/* <div className="dropdown_logs ">
                          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle
                              caret
                              className="parimary-background text-wrap text-capitalize"
                              type="button"
                            >
                              Export
                              <span className="ml-2">
                                {icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}{" "}
                              </span>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem>
                                <ExportCsv exportData={exportDatacsv(allPlan)} filName={"Invoice Management"} />
                              </DropdownItem>
                              <DropdownItem>
                                {" "}
                                <div onClick={convertToImg}>PDF</div>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div> */}
                        <div className="line ml-4 mr-4"></div>
                      </>
                    )}

                    <div>
                      {invoicePermission.includes("Add Invoice") && (
                        <>
                          <button className="btn btn-primary" type="button" onClick={handleOpen}>
                            Subcriber Invoice
                          </button>
                        </>
                      )}
                    </div>
                    <div className="line ml-4 mr-4"></div>
                    <div>
                      {invoicePermission.includes("Add Invoice") && (
                        <>
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => {
                              history.push("/paymentsAndBillings/newInvoice/new");
                            }}
                          >
                            New Invoice
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 d-flex flex-row justify-content-between">
                  <div>
                    {activeTab == "0" ? (
                      <SearchInput placeholder={"Enter Invoice No., Plan Name"} onChange={handleSearchClick1} />
                    ) : (
                      <SearchInput placeholder={"Enter Invoice No., Plan Name"} onChange={handleSearchClick} />
                    )}
                  </div>
                  <div className="d-flex align-items-center jsutify-content-between ml-md-0 ml-sm-0 ml-1">
                    {/* <CiFilter  size={30}/>
                <div className="line ml-4 mr-4"></div> */}
                    {activeTab === "0" ? (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setOpenFilter(true);
                        }}
                      >
                        Filter
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setOpenFilter1(true);
                        }}
                      >
                        Filter
                      </button>
                    )}
                  </div>
                </div>
                <Nav className="mx-md-3 mx-sm-2 mx-1 mt-4 border-bottom">
                  <NavItem className="pr-0">
                    <NavLink
                      className={`text-secondary f-r-16 fw-500 ${
                        activeTab == "0" ? "activeTab2" : ""
                      } px-md-4 px-sm-3 px-2 pointer`}
                      onClick={() => toggleTab("0")}
                    >
                      Perfoma Invoice
                    </NavLink>
                    <NavLink
                      className={`text-secondary f-r-16 fw-500 ${
                        activeTab == "1" ? "activeTab2" : ""
                      } px-md-4 px-sm-3 px-2 pointer`}
                      onClick={() => toggleTab("1")}
                    >
                      Paid Invoice
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent className="px-md-4 px-sm-2 px-1" activeTab={activeTab}>
                  <TabPane tabId="0">
                    <div className="mt-5">
                      <div className="mt-5 table-container">
                        <Table hover>
                          <thead style={{ backgroundColor: "#F5F6FA" }}>
                            <tr className="table-heading-size">
                              <th>Invoice No.</th>
                              <th>Created On</th>
                              <th>Amount</th>
                              <th>Customer Name</th>
                              <th>Email</th>
                              <th>Mobile Number</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {perfomaData?.map(res => (
                              <tr key={res.id}>
                                <td
                                  className={invoicePermission.includes("View Invoice") ? "pointer" : ""}
                                  onClick={() => {
                                    if (invoicePermission.includes("View Invoice")) {
                                      setViewOpen({ status: true, data: { ...res, inVoiceType: "perfoma" } });
                                      setRowData({ ...res, inVoiceType: "perfoma" });
                                    }
                                  }}
                                >
                                  {res.invoice_no}
                               
                                </td>
                                <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
                                <td>
                                  {res.grand_total ? res.grand_total?.toFixed(2) : res?.invoice_table?.total_amount}
                                </td>
                                <td>{res?.subscriberInfo?.full_name}</td>
                                <td>{res?.subscriberInfo?.email ? res?.subscriberInfo?.email : "---"}</td>

                                <td>{res?.subscriberInfo?.mobile_number}</td>
                                <td>
                                  <div>
                                    {res?.payment_status !== "pending"  ? (
                                     <div className="text-capitalize">
                                      {res?.payment_status}
                                      </div>
                                    ) : (
                                      <>
                                        {invoicePermission.includes("Change Invoice Status") ? (
                                          <>
                                            {" "}
                                            <SingleSelect
                                              options={[
                                                { label: "Pending", value: "pending" },
                                                { label: "Paid", value: "paid" },
                                                { label: "Credit Note", value: "credit" }
                                              ]}
                                              placeItem={"Status"}
                                              value={res?.payment_status}
                                              onChange={e => {
                                                if (e.target.value === "paid") {
                                                  setMakeSure({ status: true, id: res._id, type: "paid" });
                                                }
                                                if (e.target.value === "credit") {
                                                  setMakeSure({ status: true, id: res._id, type: "credit" });
                                                }
                                              }}
                                            />
                                          </>
                                        ) : (
                                          res?.payment_status.charAt(0).toUpperCase() + res?.payment_status.slice(1)
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td style={{ width: "5%" }}>
                                  <div className="d-flex align-items-center">
                                  {res?.payment_status === "pending"  && (
                                    <>
                                    
                                        <FiEdit
                                          className="f-20 pointer parimary-color mr-2"
                                          color="#0E1073"
                                          onClick={() => {
                                            history.push(`/paymentsAndBillings/newInvoice/${res._id}`);
                                          }}
                                        />
                                        {}
                                        <MdOutlinePayments
                                          className="f-20 pointer parimary-color mr-2"
                                          onClick={() => handlePartialPayment(res)}
                                        />
                                    </>
                                  )}
                                   { res?.payment_status === "partial paid"   && (
                                    <>
                                    
                                      
                                        <MdOutlinePayments
                                          className="f-20 pointer parimary-color mr-2"
                                          onClick={() => handlePartialPayment(res)}
                                        />
                                    </>
                                  )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                    <div class="d-flex justify-content-center mt-1">
                      <PaginationComponent
                        currentPage={page1}
                        itemPerPage={itemPerPage1}
                        paginate={d => {
                          setPage1(d);
                        }}
                        totalItems={allPlan1.length}
                      />
                    </div>
                  </TabPane>
                </TabContent>
                <TabContent className="px-md-4 px-sm-2 px-1" activeTab={activeTab}>
                  <TabPane tabId="1">
                    <div className="mt-5">
                      <div className="mt-5 table-container">
                        <Table hover>
                          <thead style={{ backgroundColor: "#F5F6FA" }}>
                            <tr className="table-heading-size">
                              <th>Invoice No.</th>
                              <th>Credit Note</th>

                              <th>Created On</th>
                              <th>Amount</th>
                              <th>Customer Name</th>
                              <th>Email</th>
                              <th>Mobile Number</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.map(res => (
                              <tr key={res.id}>
                                <td
                                  className={invoicePermission.includes("View Invoice") ? "pointer" : ""}
                                  onClick={() => {
                                    if (invoicePermission.includes("View Invoice")) {
                                      setViewOpen({ status: true, data: { ...res, inVoiceType: "paid" } });
                                      setRowData({ ...res, inVoiceType: "paid" });
                                    }
                                  }}
                                >
                                  {res.invoice_no}
                               
                                </td>
                                <td>{res?.credit_note ? res?.credit_note : "---"}</td>
                                <td>{moment(res?.createdAt).format("DD-MM-YYYY")}</td>
                                <td>
                                  {res?.grand_total ? res?.grand_total?.toFixed(2) : res?.invoice_table?.total_amount}
                                </td>
                                <td>{res?.subscriberInfo?.full_name}</td>
                                <td>{res?.subscriberInfo?.email ? res?.subscriberInfo?.email : "---"}</td>

                                <td>{res?.subscriberInfo?.mobile_number}</td>
                                <td className="text-capitalize">
                                  {res?.payment_status ? res?.payment_status : "Paid"}
                                </td>
                                <td style={{ width: "5%" }}>
                                  {res?.payment_status !== "credit" && (
                                    <div className="d-flex align-items-center">
                                      <BsTrash
                                        className="f-20 fw-500 pointer parimary-color"
                                        color="#0E1073"
                                        onClick={() => {
                                          setMakeSure1({ status: true, id: res._id });
                                        }}
                                      />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                    <div class="d-flex justify-content-center mt-1">
                      <PaginationComponent
                        currentPage={page}
                        itemPerPage={itemPerPage}
                        paginate={d => {
                          setPage(d);
                        }}
                        totalItems={allPlan.length}
                      />
                    </div>
                  </TabPane>
                </TabContent>
              </div>
              {/* </PreviewCard> */}
              <InvoiceModal isOpen={isOpen} setIsOpen={setIsOpen} getData={getData} />
              <InvoiceViewDetailed
                ViewOpen={ViewOpen}
                setViewOpen={setViewOpen}
                rowData={rowData}
                exportData1={exportData1}
              />
            </>
          ) : (
            <>
              <Error403 />
            </>
          )}
        </>
      )}
    </Content>
  );
}
