import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, Table } from "reactstrap";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { getallTransactionData } from "../../service/admin";
import moment from "moment";
import { paginateData } from "../../utils/Utils";
import { PaginationComponent } from "../../components/Component";
import { exportCsv } from "../../assets/commonFunction";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png"
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
export default function PaymentStatementListing() {
  const [getAllTransaction, setGetAllTransaction] = useState([]);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const [allPlanData, setAllPlanData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [open, setOpen] = useState({status:false});

  const [allPlan, setAllPlan] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const getAllData = async () => {
    try {
      setLoader(true);
      let res = await getallTransactionData();
      // 
      let ReverseData = res?.data?.data;
      setAllPlanData(ReverseData);
      setAllPlan(ReverseData);
      const datas = paginateData(page, itemPerPage, ReverseData);
      setGetAllTransaction(datas);
      let exportInfo = ReverseData.map((e) => {
        return {
          createdAt: e.createdAt,
          full_name: e.subscriberData[0]?.full_name,
          plan_name: e.planData[0]?.plan_name,
          mobile_number: e.subscriberData[0]?.mobile_number,
          email: e.subscriberData[0]?.email,
          amount: e.paymentDetails?.amount,
          paymentMode: e.paymentMode,
          paymentId: e.paymentDetails?.paymentId,
          invoiceId: e.invoiceData[0]?.invoice_no,
          paymentStatus: e.paymentDetails?.paymentStatus,
        };
      });
      setExportData(exportInfo);
    } catch (err) {
      console.error("Error fetching transaction data:", err);
    } finally {
      setLoader(false);
    }
  };

  const handleSearchClick = (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, allPlanData);
      setAllPlan(allPlanData);
      setGetAllTransaction(ddd);
    } else {
      if (Array.isArray(allPlanData)) {
        const filteredData = allPlanData.filter((res) => {
          const fullname = res?.subscriberData[0]?.full_name?.toLowerCase() || "";
          const mobileNumber = (res?.subscriberData[0]?.mobile_number?.toString() || "").toLowerCase();
          const planName = res?.planData[0]?.plan_name?.toLowerCase() || "";
          const Amount = res?.paymentDetails?.amount?.toString() || "";
          const paymentMode = res?.paymentMode?.toLowerCase() || "";
          const paymentStatus = res?.paymentDetails?.paymentStatus?.toLowerCase() || "";
          const invoiceId = res?.invoiceData[0]?.invoice_no?.toString() || "";
          const email = res?.subscriberData[0]?.email?.toLowerCase() || "";

          return (
            fullname.includes(val) ||
            mobileNumber.includes(val) ||
            planName.includes(val) ||
            Amount.includes(val) ||
            paymentMode.includes(val) ||
            paymentStatus.includes(val) ||
            invoiceId.includes(val) ||
            email.includes(val)
          );
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setGetAllTransaction(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanData);
    setGetAllTransaction(ddd);
  }, [page]);

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

    pdf.save("Payment Tarnsaction.pdf");
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

  return (
    <Content>
      <div style={{ width: "1700px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Payment Transaction</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Plan Name</th>
                    <th>Name</th>
                    <th>Phone No.</th>
                    <th>Email ID</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Transaction ID</th>
                    <th>Invoice Id</th>
                    <th>Status</th>
                    <th>Date/Time</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {getAllTransaction.map((res, index) => (
                    <tr key={index}>
                      <td>{res?.planData[0]?.plan_name ? res?.planData[0]?.plan_name : "---"}</td>
                      <td>{res?.subscriberData[0]?.full_name ? res?.subscriberData[0]?.full_name : "---"}</td>

                      <td>{res?.subscriberData[0]?.mobile_number ? res?.subscriberData[0]?.mobile_number : "---"}</td>

                      <td>{res?.subscriberData[0]?.email ? res?.subscriberData[0]?.email : "---"}</td>

                      <td>{res?.paymentDetails?.amount ? res?.paymentDetails?.amount : "---"}</td>

                      <td>{res?.paymentMode ? res?.paymentMode : "---"}</td>

                      <td>{res?.paymentDetails?.paymentId ? res?.paymentDetails?.paymentId : "---"}</td>

                      <td>{res?.invoiceData[0]?.invoice_no ? res?.invoiceData[0]?.invoice_no : "N/A"}</td>

                      <td>{res?.paymentDetails?.paymentStatus ? res?.paymentDetails?.paymentStatus : "---"}</td>
                      <td>{moment(res.createdAt).format("DD-MM-YYYY / HH:mm:ss")}</td>

                      
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      <Modal size="md" isOpen={open.status} toggle={() =>  setOpen({status:false})}>
        <div className="p-4">
          <h3>{`Refund to ${open?.data?.subscriberData[0]?.full_name}`}</h3>
          <div className="d-flex align-items-center mt-2 h5_delete">
            <div>{"Amount : "}</div>
            <div>
              <input type="number" className="form-control" onChange={(e) => {}} />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex">
              <button
                type="button"
                className="btn mr-2"
                onClick={() => {
                  setOpen({status:false})
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                // onClick={() => {
                //   changetoPaid(makeSure.id);
                //   setMakeSure({ status: false, id: "" });
                // }}
              >
                Refund
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <div className="card_container p-md-4 p-sm-3 p-2 pt-md-0 pt-sm-0 pt-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="head_min">Payment Transaction</div>
          {/* <button
            className="btn export pointer"
            onClick={() => {
              exportCsv(exportData, "Payment Transaction");
            }}
          >
            Export
          </button> */}
              <div className="dropdown_logs ">

           <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportData} filName={"Payment Transaction"} />
                        </DropdownItem>
                        <DropdownItem>
                          {" "}
                          <div onClick={convertToImg}>PDF</div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
        </div>
        <div className="mt-5 d-flex flex-row justify-content-between">
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-8 col-12">
            <SearchInput placeholder={"Enter Name, Plan Name ..."} onChange={handleSearchClick} />
          </div>
        </div>
        {loader ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="table-container mt-5">
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Plan Name</th>
                    <th>Name</th>
                    <th>Phone No.</th>
                    <th>Email ID</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Transaction ID</th>
                    <th>Invoice Id</th>
                    <th>Status</th>
                    <th>Date/Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllTransaction.map((res, index) => (
                    <tr key={index}>
                      <td>{res?.planData[0]?.plan_name ? res?.planData[0]?.plan_name : "---"}</td>
                      <td>{res?.subscriberData[0]?.full_name ? res?.subscriberData[0]?.full_name : "---"}</td>

                      <td>{res?.subscriberData[0]?.mobile_number ? res?.subscriberData[0]?.mobile_number : "---"}</td>

                      <td>{res?.subscriberData[0]?.email ? res?.subscriberData[0]?.email : "---"}</td>

                      <td>{res?.paymentDetails?.amount ? res?.paymentDetails?.amount : "---"}</td>

                      <td>{res?.paymentMode ? res?.paymentMode : "---"}</td>

                      <td>{res?.paymentDetails?.paymentId ? res?.paymentDetails?.paymentId : "---"}</td>

                      <td>{res?.invoiceData[0]?.invoice_no ? res?.invoiceData[0]?.invoice_no : "N/A"}</td>

                      <td>{res?.paymentDetails?.paymentStatus ? res?.paymentDetails?.paymentStatus : "---"}</td>
                      <td>{moment(res.createdAt).format("DD-MM-YYYY / HH:mm:ss")}</td>

                      <td>
                        {res?.paymentDetails?.paymentStatus === "success" && (
                          <>
                            <button
                              className="btn export pointer"
                              onClick={() => {
                                setOpen({status:true,data:res});
                              }}
                            >
                              Refund
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}

        <div className="d-flex justify-content-center mt-1">
          <PaginationComponent
            currentPage={page}
            itemPerPage={itemPerPage}
            paginate={setPage}
            totalItems={allPlan.length}
          />
        </div>
      </div>
    </Content>
  );
}
