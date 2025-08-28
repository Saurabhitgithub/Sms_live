import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { addOrSubBalance, getAllDataByOrg } from "../../service/admin";
import { permisionsTab, userId } from "../../assets/userLoginInfo";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import Error403 from "../../components/error/error403";
import Select from "react-dropdown-select";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";

export default function FranchiseeManagement() {
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [visible, setVisible] = useState({ status: false });
  const [fund, setfund] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [fundError, setFundError] = useState(false);
  const [skeleton, setSkeleton] = useState(true);
  const [franchiseePermission, setFranchiseePermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter(s => s.tab_name === "Franchisee");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0].is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setFranchiseePermission(permissionArr);
    }
  }
  const GetAllDataFunction = async () => {
    try {
      await permissionFunction();
      let resonpse = await getAllDataByOrg(userId())
        .then(res => {
          return res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
      setTableData(resonpse.reverse());
      setAllData(resonpse.reverse());
      setExportData(
        resonpse.reverse().map(res => {
          return {
            Name: res.name,
            "Revenue Sharing": `${res.revenueShare}%`,
            "This Month Revenue": res.current_month_revenue,
            "Last Month Revenue": res.last_month_revenue,
            Balance: res.balance ? res.balance : 0,
            "Payment Status": res.paymentStatus ? res.status : "Pending"
          };
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setSkeleton(false);
    }
  };
  const searchData = text => {
    if (text?.length !== 0) {
      let responsedata = allData.filter(es => {
        if (es.name.includes(text)) {
          return true;
        } else {
          return false;
        }
      });
      setTableData(responsedata);
    } else {
      setTableData(allData);
    }
  };
  const handelFund = async (type, id) => {
    try {
      if (Number(fund) > 0) {
        let payload = {
          balance: Number(fund),
          id: id,
          status: type
        };
        await addOrSubBalance(payload).catch(err => console.log(err));
        setVisible({ status: false });
        setfund(0);
        GetAllDataFunction();
      } else {
        setFundError(true);
      }
    } catch (error) {
      
    }
  };
  function limitValidation(type, resData) {
    if (type === "add") {
      let amount = Number(resData?.balance) + Number(fund);
      return amount > Number(resData?.maxCreditLimit);
    } else {
      let amount = Number(resData?.balance) - Number(fund);
      
      // return amount > Number(resData?.minLimitAmount);

      return amount < 0;
    }
  }
  useEffect(() => {
    GetAllDataFunction();
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

    pdf.save("Franchisee Management.pdf");
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
    <>
      <Modal scrollable={true} isOpen={visible.status} size="lg">
        <ModalHeader toggle={() => setVisible({ status: !visible.status })}>
          {visible?.type === "add" ? "Add" : "Reduce"} Funds
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="f-18 fw-500">
              {visible?.type === "add"
                ? "Increase the account balance to enable more prepaid transactions or manage additional customer accounts."
                : "Decrease the account balance to adjust funds or reflect reduced financial needs"}
            </div>
            <div className="mt-4">
              <label>
                {visible?.type === "add" ? "Add" : "Reduce"} Funds <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder={visible?.type === "add" ? "Add Fund" : "Reduce Fund"}
                onChange={e => {
                  setFundError(false);
                  setfund(e.target.value);
                }}
              />
              {limitValidation(visible?.type, visible?.id) && visible?.type === "add" && (
                <>
                  <p>Maximum Balance Limit : {visible?.id?.maxCreditLimit} </p>
                </>
              )}
              {Number(visible?.id?.balance) <= Number(fund) && visible?.type === "subtract" && (
                <>
                  <p>Please Enter Minimum Amount : {visible?.id?.maxCreditLimit} </p>
                </>
              )}
              {}
              {Number(visible?.id?.minLimitAmount) >= Number(fund) && visible?.type === "add" && (
                <>
                  <p>Minimum Balance Limit : {visible?.id?.minLimitAmount} </p>
                </>
              )}

              {fundError && <div className="text-danger">Enter Number more then 0</div>}
            </div>
            <div className="d-flex justify-content-end mt-5">
              <button className="btn text-primary" onClick={() => setVisible({ status: !visible.status })}>
                Cancel
              </button>
              <button
                className="btn btn-primary ms-3"
                disabled={
                  limitValidation(visible?.type, visible?.id) ||
                  Number(fund) === 0 ||
                  (Number(visible?.id?.minLimitAmount) >= Number(fund) && visible?.type === "add")
                }
                onClick={() => handelFund(visible?.type, visible?.id?._id)}
              >
                Submit
              </button>
              {}
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Content>
        <div style={{ width: "905px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Franchisee Management</h3>
                <div>
                  <img src={logo} width={100} alt="" />
                </div>
              </div>
              <Table>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Name</th>
                    <th>Revenue Sharing</th>
                    <th>This Month Revenue</th>
                    <th>Last Month Revenue</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(res => {
                    return (
                      <tr>
                        <td>{res.name}</td>
                        <td>{res.revenueShare}%</td>
                        <td>{res.current_month_revenue}</td>
                        <td>{res.last_month_revenue}</td>
                        <td>{res.balance ? res.balance : 0}</td>
                        {/* <td>{res.paymentStatus ? res.status : "Pending"}</td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        {skeleton ? (
          <>
            <TableSkeleton columns={5} />
          </>
        ) : (
          <>
            {" "}
            {permissionAccess && franchiseePermission.includes("Franchisee Management Tab") ? (
              <>
                {" "}
                <div className="card_container p-md-4 p-sm-3 p-3">
                  <div className="topContainer">
                    <div className="f-28">Franchisee Management</div>
                    <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                      {franchiseePermission.includes("Export Csv (Franchisee Management)") && (
                        <>
                          <div>
                            {/* <ExportCsv exportData={exportData} filName={"Franchisee Management Table"} /> */}
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
                                  <ExportCsv exportData={exportData} filName={"Franchisee Management Table"} />
                                </DropdownItem>
                                <DropdownItem>
                                  {" "}
                                  <div onClick={convertToImg}>PDF</div>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                            </div>
                          </div>
                        </>
                      )}
                      {/* <div className="line ml-2 mr-2"></div>
                        <button className="btn btn-primary">Create Franchisee</button> */}
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-8 col-12">
                      <SearchInput placeholder={"Enter Name"} onChange={e => searchData(e.target.value)} />
                    </div>
                  </div>
                  <div className="table-container mt-5">
                    <>
                      <Table>
                        <thead style={{ backgroundColor: "#F5F6FA" }}>
                          <tr className="table-heading-size">
                            <th>Name</th>
                            <th>Revenue Sharing</th>
                            <th>This Month Revenue</th>
                            <th>Last Month Revenue</th>
                            <th>Balance</th>
                            {/* <th>Payment Status</th> */}
                            {(franchiseePermission.includes("Add Balance (Franchisee Management)") ||
                              franchiseePermission.includes("Reduce Balance (Franchisee Management))")) && (
                              <>
                                <th>Action</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map(res => {
                            return (
                              <tr>
                                <td>{res.name}</td>
                                <td>{res.revenueShare}%</td>
                                <td>{res.current_month_revenue}</td>
                                <td>{res.last_month_revenue}</td>
                                <td>{res.balance ? res.balance : 0}</td>
                                {/* <td>{res.paymentStatus ? res.status : "Pending"}</td> */}
                                {(franchiseePermission.includes("Add Balance (Franchisee Management)") ||
                                  franchiseePermission.includes("Reduce Balance (Franchisee Management))")) && (
                                  <>
                                    <td style={{ width: "30%" }}>
                                      <div className="d-flex">
                                        {franchiseePermission.includes("Add Balance (Franchisee Management)") && (
                                          <>
                                            <div className="d-flex align-tems-center">
                                              {/* <button className="btn btn-primary"> */}

                                              <CiSquarePlus
                                                style={{ fontSize: "35px", cursor: "pointer" }}
                                                onClick={() => setVisible({ status: true, type: "add", id: res })}
                                              />
                                              {/* </button> */}
                                              <span className="ms-2 mt-2">Add Balance</span>
                                            </div>
                                          </>
                                        )}
                                        {franchiseePermission.includes("Reduce Balance (Franchisee Management)") && (
                                          <>
                                            <div className="d-flex align-tems-center ms-2">
                                              <CiSquareMinus
                                                style={{ fontSize: "35px", cursor: "pointer" }}
                                                onClick={() => setVisible({ status: true, type: "subtract", id: res })}
                                              />
                                              <span className="ms-2 mt-2">Reduce Balance</span>
                                            </div>
                                          </>
                                        )}
                                        <div></div>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Error403 />
              </>
            )}
          </>
        )}
      </Content>
    </>
  );
}
