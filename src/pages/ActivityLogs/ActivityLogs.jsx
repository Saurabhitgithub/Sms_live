import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import AddSubscriber from "../SubscriberManagement/AddSubscriber";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import style1 from "../UserManagement/UserManagement.module.css";
import style from "./ActivityLog.module.css";
import { CiFilter } from "react-icons/ci";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { Table } from "reactstrap";
import PaginationComponent from "../../components/pagination/Pagination";
import ViewPageActivity from "./ViewPageActivity";
import ViewPagePayments from "./ViewPagePayments";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { getAllActivelogs, getallTransactionData, getIpUserLog } from "../../service/admin";

import { getAllRole } from "../../service/admin";
import { permisionsTab } from "../../assets/userLoginInfo";
import moment from "moment";
import { paginateData } from "../../utils/Utils";
import { exportCsv } from "../../assets/commonFunction";
import Error403 from "../../components/error/error403";
import { DataTablePagination } from "../../components/Component";
// import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";

export default function ActivityLogs() {
  const [logPermission, setLogPermission] = useState([]);

  const [openTwo, setOpenTwo] = useState({ status: false });
  const [openThree, setOpenThree] = useState({ status: false });
  const [permissionAccess, setPermissionAccess] = useState(true);
  const [getAllTransaction, setGetAllTransaction] = useState([]);
  let [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [icon, setIcon] = useState(true);
  const [iconFilter, setIconFilter] = useState(true);
  const [fullData, setFullData] = useState({});
  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayRef = useRef(null);
  let itemPerPage = 8;
  const [action, setAction] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // State to hold selected option
  const [allPlanData, setAllPlanData] = useState([]);
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanPay, setAllPlanPay] = useState([]);

  const [allPlanData1, setAllPlanData1] = useState([]);

  const [rowData, setRowData] = useState([]);
  const [rowPayment, setRowPayment] = useState();

  let [page1, setPage1] = useState(1);
  let itemPerPage1 = 8;
  const [exportData, setExportData] = useState([]);
  const [exportData1, setExportData1] = useState([]);
  const [exportData2, setExportData2] = useState([]);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [icon1, setIcon1] = useState(true);

  const toggleDropdown1 = () => {
    setIcon1(prevState => !prevState);
    setDropdownOpen1(prevState => !prevState);
  };

  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [icon2, setIcon2] = useState(true);

  const toggleDropdown2 = () => {
    setIcon2(prevState => !prevState);
    setDropdownOpen2(prevState => !prevState);
  };
  const getAllData = async () => {
    try {
      setLoader(true);
      let res = await getallTransactionData();

      let ReverseData = res?.data?.data?.reverse();
      setAllPlanData1(ReverseData);
      setAllPlanPay(ReverseData);
      const datas = paginateData(page, itemPerPage, ReverseData);
      setGetAllTransaction(datas);
      let exportInfo1 = ReverseData.map(e => {
        return {
          createdAt: e.createdAt,
          full_name: e.subscriberData[0]?.full_name,
          plan_name: e.planData[0]?.plan_name,
          mobile_number: e.subscriberData[0]?.mobile_number,
          email: e.subscriberData[0]?.email,
          amount: e.paymentDetails?.amount,
          paymentMode: e.paymentMode,
          paymentId: e.paymentDetails?.paymentId,
          paymentStatus: e.paymentDetails?.paymentStatus
        };
      });
      setExportData1(exportInfo1);
    } catch (err) {
      console.error("Error fetching transaction data:", err);
    } finally {
      setLoader(false);
    }
  };

  async function permissionFunction() {
    const res = await permisionsTab();

    const permissions = res.filter(s => s.tab_name === "Activity Logs");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0].is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setLogPermission(permissionArr);
      setSelectedOption(permissionArr.includes("Event Log") ? "Event Log" : "Payment Logs");
      handleSelect(permissionArr.includes("Event Log") ? "Event Logs" : "Payment Logs");
    }
  }
  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const handleSelect = (option = "Event Logs") => {
    //
    setSelectedOption(option);
    setAction(option === "Event Logs" ? true : false);
  };

  const [getAllActiveLog, setGetAllActiveLog] = useState([]);
  const [userIpLog, setUserIpLog] = useState([]);

  const getAllActiveData = async () => {
    try {
      const res = await getAllActivelogs();
      const resIpLog = await getIpUserLog().then(ress => Array.isArray(ress?.data?.data) ? ress.data.data : []);
      setUserIpLog(resIpLog);
      let ReverseData = res?.data?.data?.reverse();
      setAllPlanData(ReverseData);
      setAllPlan(ReverseData);
      const datas = paginateData(page1, itemPerPage1, ReverseData);

      setGetAllActiveLog(datas);
      let exportInfo = ReverseData.map(e => {
        return {
          role: e.role,
          name: e.name,
          activity: e.activity,
          detail: e.detail,
          createdAt: moment(e.createdAt).format("YYYY-MM-DD")
        };
      });

      setExportData2(
        resIpLog.map(row => {
          return {
            Username: row.username,
            "IP Address": row.framedipaddress,
            "Start Time": moment(row.acctstarttime).format("YYYY-MM-DD HH:mm:ss"),
            "Stop Time": row.acctstoptime ? moment(row.acctstoptime).format("YYYY-MM-DD HH:mm:ss") : 0,
            "Upload (Bytes)": row.acctinputoctets !== 0 ? formatBytes(row.acctinputoctets) : row.acctinputoctets,
            "Download (Bytes)": row.acctoutputoctets !== 0 ? formatBytes(row.acctoutputoctets) : row.acctoutputoctets,
            Termination: row?.acctterminatecause,
            "Nas IP Address": row.nasipaddress
          };
        })
      );
      setExportData(exportInfo);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    permissionFunction();
    getAllActiveData();
    getAllData();
  }, []);
  useEffect(() => {
    let ddd = paginateData(page1, itemPerPage1, allPlan);
    setGetAllActiveLog(ddd);
  }, [page1]);
  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanPay);

    setGetAllTransaction(ddd);
  }, [page]);

  const handleSearchClick1 = e => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, allPlanData1);
      setAllPlanPay(allPlanData1);
      setGetAllTransaction(ddd);
    } else {
      if (Array.isArray(allPlanData1)) {
        const filteredData = allPlanData1.filter(res => {
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
        setAllPlanPay(filteredData);
        setGetAllTransaction(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  const handleSearchClick = e => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page1, itemPerPage, allPlanData);
      setAllPlan(allPlanData);
      setGetAllActiveLog(ddd);
    } else {
      if (Array.isArray(allPlanData)) {
        const filteredData = allPlanData.filter(res => {
          const Invoice = res?.role ? res.role.toLowerCase() : ""; // Check if 'role' exists and is not null
          const PlanInfo = res?.name ? res.name.toLowerCase() : ""; // Check if 'name' exists and is not null
          const Amount = res?.activity ? res.activity.toString().toLowerCase() : ""; // Check if 'activity' exists and is not null

          return Invoice.includes(val) || PlanInfo.includes(val) || Amount.includes(val);
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setGetAllActiveLog(ddd);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        // setOverlayVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [overlayVisible]);

  const filterToggle = () => {
    setOverlayVisible(prevState => !prevState);
    setIconFilter(prevState => !prevState);
  };

  const [roles, setRoles] = useState([]);

  const getRoleData = async () => {
    try {
      let res = await getAllRole();
      //
      let roleData = res.data.data.map(e => {
        return {
          value: e.role,
          label: e.role
        };
      });
      setRoles(roleData);
    } catch (err) {
      console.log(err);
    }
  };

  const [roleFilter, setRoleFilter] = useState(["all"]);

  const filterAllUserData = async (roleValue, check) => {
    let fill = roleFilter;

    if (check) {
      if (roleValue === "All") {
        fill = ["all"];
      } else {
        if (roleFilter[0] !== "All") {
          let aa = roleFilter.filter(e => e !== "all");
          fill = [...aa, roleValue.toLowerCase()];
        } else {
          fill = fill.filter(e => e !== "all");
          fill = [roleValue.toLowerCase()];
        }
      }
    } else {
      fill = fill.filter(e => e !== roleValue.toLowerCase());
    }
    if (fill.length === 0) {
      fill = ["all"];
    }

    setRoleFilter(fill);

    let fillData;
    if (roleValue === "All" || fill.includes("all")) {
      fillData = allPlanData;
    } else {
      fillData = allPlanData.filter(e => e.role && fill.includes(e.role));
    }

    let ddd = paginateData(page, itemPerPage, fillData);

    setAllPlan(fillData);
    setPage1(1);
    setGetAllActiveLog(ddd);
  };

  const [filterPayment, setpayment] = useState(["all"]);
  //
  const filterDataPaymentLog = async (roleValue, check) => {
    let fill = filterPayment;
    if (check) {
      if (roleValue === "all") {
        fill = ["all"];
      } else {
        if (filterPayment[0] !== "all") {
          let aa = filterPayment.filter(e => e !== "all");
          fill = [...aa, roleValue.toLowerCase()];
        } else {
          fill = fill.filter(e => e !== "all");
          fill = [roleValue.toLowerCase()];
        }
      }
    } else {
      fill = fill.filter(e => e !== roleValue.toLowerCase());
    }
    if (fill.length === 0) {
      fill = ["all"];
    }
    setpayment(fill);

    let fillData;

    if (roleValue === "all" || fill.includes("all")) {
      fillData = allPlanData1;
    } else {
      fillData = allPlanData1.filter(
        e => e.paymentDetails?.paymentStatus && fill.includes(e.paymentDetails?.paymentStatus?.toLowerCase())
      );
    }
    let ddd = paginateData(page, itemPerPage, fillData);
    setAllPlanPay(fillData);
    setPage(1);

    setGetAllTransaction(ddd);
  };

  // useEffect(() => {
  //   getRoleData();
  //   setTimeout(() => {
  //     setLoader(false);
  //   }, 2000);
  // }, []);

  useEffect(() => {
  let isMounted = true; 
  const timeoutId = setTimeout(() => {
    if (isMounted) {
      setLoader(false);
    }
  }, 2000);

  getRoleData();

  return () => {
    isMounted = false;      
    clearTimeout(timeoutId); 
  };
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

    pdf.save("Activity Log.pdf");
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
  const inVoiceRef2 = useRef(null);

  async function convertToImg1() {
    // setLoader(true);
    let arr = [inVoiceRef2.current];
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

    pdf.save("Payment Log.pdf");
  }

  const inVoiceRef3 = useRef(null);

  async function convertToImg2() {
    // setLoader(true);
    let arr = [inVoiceRef3.current];
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

    pdf.save("IP Log.pdf");
  }
  const [activeTab, toggleTab] = useState("0");

  function formatBytes(bytes) {
    if (isNaN(bytes) || bytes < 0) {
      return "Invalid input. Please enter a positive number.";
    }

    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${bytes} Bytes`;
    }
  }
  return (
    <Content>
      <div style={{ width: "2000px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>Activity Log</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>

            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr key={""} className="table-heading-size">
                  <th>Role</th>
                  <th>Name</th>
                  <th>Activity</th>
                  <th>Details</th>
                  <th>Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {getAllActiveLog.map(res => (
                  <tr key={res.id}>
                    <td
                      onClick={() => {
                        setOpenTwo({ status: true, id: res?._id, fullData: res });
                        setRowData(res);
                      }}
                      style={{ cursor: "pointer" }}
                      className="text-capitalize"
                    >
                      {res.role}
                    </td>

                    <td className="text-primary text-capitalize">{res.name}</td>
                    <td style={{ color: "#202224" }}>{res.activity}</td>
                    <td className="">{res.detail}</td>
                    <td>{moment(res.createdAt).format("DD-MM-YYYY / HH:mm:ss")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div style={{ width: "2000px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef2} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>Payment Log</h3>
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
                  <th>Status</th>
                  <th>Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {getAllTransaction.map(res => (
                  <tr key={res.id}>
                    <td
                      className="text-primary"
                      onClick={() => {
                        setOpenThree({ status: true, id: res?._id, fullData: res });
                        setRowPayment(res);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {res?.planData[0]?.plan_name}
                    </td>

                    <td>{res?.subscriberData[0]?.full_name}</td>
                    <td>{res?.subscriberData[0]?.mobile_number}</td>
                    <td>{res?.subscriberData[0]?.email}</td>
                    <td>{res?.paymentDetails?.amount}</td>
                    <td>{res?.paymentMode}</td>
                    <td>{res?.paymentDetails?.paymentId}</td>
                    <td>{res?.paymentDetails?.paymentStatus}</td>
                    <td>{moment(res.createdAt).format("DD-MM-YYYY / HH:mm:ss")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <div style={{ width: "2000px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef3} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>IP Logs</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>

            <div className="table-container mt-5">
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Username</th>
                    <th>IP Address</th>
                    <th>Start Time</th>
                    <th>Stop Time</th>
                    <th>Upload (Bytes)</th>
                    <th>Download (Bytes)</th>
                    <th>Termination</th>
                    <th>Nas IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {userIpLog?.map((row, index) => (
                    <tr key={index}>
                      <td>{row.username}</td>
                      <td>{row.framedipaddress}</td>
                      <td>{moment(row.acctstarttime).format("YYYY-MM-DD HH:mm:ss")}</td>
                      <td>{row.acctstoptime ? moment(row.acctstoptime).format("YYYY-MM-DD HH:mm:ss") : 0}</td>
                      <td>{row.acctinputoctets !== 0 ? formatBytes(row.acctinputoctets) : row.acctinputoctets}</td>
                      <td>{row.acctoutputoctets !== 0 ? formatBytes(row.acctoutputoctets) : row.acctoutputoctets}</td>
                      <td>{row.acctterminatecause}</td>
                      <td>{row.nasipaddress}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {loader ? (
        <TableSkeleton rows={4} columns={5} />
      ) : (
        <>
          {permissionAccess && (logPermission.includes("Event Log") || logPermission.includes("Payment Log")) ? (
            <>
              <ViewPageActivity
                open={openTwo?.status}
                rowData={rowData}
                id={openTwo?.id}
                setOpen={setOpenTwo}
                fullData={openTwo?.fullData}
              />
              <ViewPagePayments
                open={openThree?.status}
                id={openThree?.id}
                setOpen={setOpenThree}
                fullData={openThree?.fullData}
                rowPayment={rowPayment}
              />
              <div className="card_container p-md-4 p-sm-3 p-3">
                <div className="topContainer">
                  <div className="f-28">
                    {activeTab === "0" ? "Event Logs" : activeTab === "1" ? "Payment Logs" : "IP Logs"}
                  </div>
                  <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                    {logPermission.includes("Export Activity") && (
                      <>
                        {/* {action ? (
                          <>
                            <div className="dropdown_logs ">
                              <Dropdown isOpen={dropdownOpen1} toggle={toggleDropdown1}>
                                <DropdownToggle caret className="btn-primary btn" type="button">
                                  Export
                                  <span className="ml-2">
                                    {icon1 ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}{" "}
                                  </span>
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem>
                                    <ExportCsv exportData={exportData} filName={"ActiveLog"} />
                                  </DropdownItem>
                                  <DropdownItem>
                                    {" "}
                                    <div onClick={convertToImg}>PDF</div>
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </>
                        ) : (
                          <div className="dropdown_logs ">
                            <Dropdown isOpen={dropdownOpen2} toggle={toggleDropdown2}>
                              <DropdownToggle caret className="btn-primary btn" type="button">
                                Export
                                <span className="ml-2">
                                  {icon2 ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}{" "}
                                </span>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>
                                  <ExportCsv exportData={exportData1} filName={"PaymentLog"} />
                                </DropdownItem>
                                <DropdownItem>
                                  <div onClick={convertToImg1}>PDF</div>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        )} */}
                        <div className="dropdown_logs">
                          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret className="btn-primary btn" type="button">
                              Export
                              <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}</span>
                            </DropdownToggle>
                            <DropdownMenu>
                              {activeTab === "0" && (
                                <>
                                  <DropdownItem>
                                    <ExportCsv exportData={exportData} filName={"ActiveLog"} />
                                  </DropdownItem>
                                  <DropdownItem>
                                    <div onClick={convertToImg}>PDF</div>
                                  </DropdownItem>
                                </>
                              )}
                              {activeTab === "1" && (
                                <>
                                  <DropdownItem>
                                    <ExportCsv exportData={exportData1} filName={"PaymentLog"} />
                                  </DropdownItem>
                                  <DropdownItem>
                                    <div onClick={convertToImg1}>PDF</div>
                                  </DropdownItem>
                                </>
                              )}
                              {activeTab === "2" && (
                                <>
                                  <DropdownItem>
                                    <ExportCsv exportData={exportData2} filName={"IpLog"} />
                                  </DropdownItem>
                                  <DropdownItem>
                                    <div onClick={convertToImg2}>PDF</div>
                                  </DropdownItem>
                                </>
                              )}
                            </DropdownMenu>
                          </Dropdown>
                        </div>

                        {/* <div className="line ml-2 mr-3"></div> */}
                      </>
                    )}

                    {/* <div className="dropdown_logs ">
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret className="btn-primary btn" type="button">
                          {selectedOption || (logPermission.includes("Event Log") ? "Event Log" : "Payment Logs")}{" "}
                          <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                        </DropdownToggle>
                        <DropdownMenu>
                          {logPermission.includes("Event Log") && (
                            <>
                              <DropdownItem onClick={() => handleSelect("Event Logs")}>Event Logs</DropdownItem>
                            </>
                          )}
                          {logPermission.includes("Payment Log") && (
                            <>
                              <DropdownItem onClick={() => handleSelect("Payment Logs")}>Payment Logs</DropdownItem>
                            </>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    </div> */}
                  </div>
                </div>

                {/* <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-6 mb-md-0 p-0">
                    {action ? (
                      <SearchInput placeholder={"Enter Role, Name, Activity"} onChange={handleSearchClick} />
                    ) : (
                      <SearchInput placeholder={"Enter Name, Plan Name..."} onChange={handleSearchClick1} />
                    )}
                  </div>
                  <div className="d-flex center g-1 ">
                    <div className={style1.filterbtn}>
                      <div className={`filter_btn pointer`} onClick={filterToggle}>
                        <span className="mr-2"> {action ? "Roles" : "Status"}</span>
                        {iconFilter ? (
                          <FaAngleDown style={{ fontSize: "1rem", color: "#53545C" }} size={15} />
                        ) : (
                          <FaAngleUp style={{ fontSize: "1rem", color: "#53545C" }} size={15} />
                        )}
                      </div>
                      {overlayVisible ? (
                        action ? (
                          <div className={style.overlay} ref={overlayRef}>
                            <div className="d-flex align-items-center g-1 p-2">
                              <input
                                type="checkbox"
                                checked={roleFilter[0] === "all" ? true : false}
                                onChange={e => filterAllUserData("All", e.target.checked)}
                                className="input"
                              />
                              <span>All</span>
                            </div>
                            {roles.map(ress => (
                              <div className="d-flex align-items-center g-1 p-2">
                                <input
                                  type="checkbox"
                                  checked={roleFilter.includes(ress.value)}
                                  onChange={e => filterAllUserData(ress.value, e.target.checked)}
                                  className="input"
                                />
                                <span className="text-capitalize">{ress.label}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={style.overlay} ref={overlayRef}>
                            <div className="d-flex align-items-center g-1 p-2">
                              <input
                                type="checkbox"
                                checked={filterPayment.includes("all")}
                                onChange={e => {
                                  filterDataPaymentLog("all", e.target.checked);
                                }}
                                className="input"
                              />
                              <span>All</span>
                            </div>
                            <div className="d-flex align-items-center g-1 p-2">
                              <input
                                type="checkbox"
                                checked={filterPayment.includes("success")}
                                onChange={e => {
                                  filterDataPaymentLog("success", e.target.checked);
                                }}
                                className="input"
                              />
                              <span>Success</span>
                            </div>
                            <div className="d-flex align-items-center g-1 p-2">
                              <input
                                type="checkbox"
                                checked={filterPayment.includes("pending")}
                                onChange={e => {
                                  filterDataPaymentLog("pending", e.target.checked);
                                }}
                                className="input"
                              />
                              <span>Pending</span>
                            </div>
                          </div>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div> */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-6 mb-md-0 p-0">
                    {activeTab === "0" ? (
                      <SearchInput placeholder={"Enter Role, Name, Activity"} onChange={handleSearchClick} />
                    ) : activeTab === "1" ? (
                      <SearchInput placeholder={"Enter Name, Plan Name..."} onChange={handleSearchClick1} />
                    ) : (
                      <SearchInput placeholder={"Enter IP Address, User..."} />
                    )}
                  </div>
                  <div className="d-flex center g-1 ">
                    <div className={style1.filterbtn}>
                      {/* <div className={`filter_btn pointer`} onClick={filterToggle}>
                        <span className="mr-2">
                          {activeTab === "0" ? "Roles" : activeTab === "1" ? "Status" : "IP"}
                        </span>
                        {iconFilter ? (
                          <FaAngleDown style={{ fontSize: "1rem", color: "#53545C" }} size={15} />
                        ) : (
                          <FaAngleUp style={{ fontSize: "1rem", color: "#53545C" }} size={15} />
                        )}
                      </div> */}
                      {overlayVisible ? (
                        activeTab === "0" ? (
                          <div className={style.overlay} ref={overlayRef}>
                            <div className="d-flex align-items-center g-1 p-2">
                              <input
                                type="checkbox"
                                checked={roleFilter[0] === "all" ? true : false}
                                onChange={e => filterAllUserData("All", e.target.checked)}
                                className="input"
                              />
                              <span>All</span>
                            </div>
                            {roles.map(ress => (
                              <div className="d-flex align-items-center g-1 p-2">
                                <input
                                  type="checkbox"
                                  checked={roleFilter.includes(ress.value)}
                                  onChange={e => filterAllUserData(ress.value, e.target.checked)}
                                  className="input"
                                />
                                <span className="text-capitalize">{ress.label}</span>
                              </div>
                            ))}
                          </div>
                        ) : activeTab === "1" ? (
                          <div className={style.overlay} ref={overlayRef}>
                            <div className="d-flex align-items-center g-1 p-2">
                              <input
                                type="checkbox"
                                checked={filterPayment.includes("all")}
                                onChange={e => filterDataPaymentLog("all", e.target.checked)}
                                className="input"
                              />
                              <span>All</span>
                            </div>
                            <div className="d-flex align-items-center g-1 p-2">
                              <input
                                type="checkbox"
                                checked={filterPayment.includes("success")}
                                onChange={e => filterDataPaymentLog("success", e.target.checked)}
                                className="input"
                              />
                              <span>Success</span>
                            </div>
                            <div className="d-flex align-items-center g-1 p-2">
                              <input
                                type="checkbox"
                                checked={filterPayment.includes("pending")}
                                onChange={e => filterDataPaymentLog("pending", e.target.checked)}
                                className="input"
                              />
                              <span>Pending</span>
                            </div>
                          </div>
                        ) : (
                          // <div className={style.overlay} ref={overlayRef}>
                          //   <div className="d-flex align-items-center g-1 p-2">
                          //     <input
                          //       type="checkbox"
                          //       checked={filterIp.includes("all")}
                          //       onChange={e => filterDataIpLog("all", e.target.checked)}
                          //       className="input"
                          //     />
                          //     <span>All</span>
                          //   </div>
                          //   <div className="d-flex align-items-center g-1 p-2">
                          //     <input
                          //       type="checkbox"
                          //       checked={filterIp.includes("static")}
                          //       onChange={e => filterDataIpLog("static", e.target.checked)}
                          //       className="input"
                          //     />
                          //     <span>Static</span>
                          //   </div>
                          //   <div className="d-flex align-items-center g-1 p-2">
                          //     <input
                          //       type="checkbox"
                          //       checked={filterIp.includes("dynamic")}
                          //       onChange={e => filterDataIpLog("dynamic", e.target.checked)}
                          //       className="input"
                          //     />
                          //     <span>Dynamic</span>
                          //   </div>
                          // </div>
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <Nav tabs>
                    <NavItem className="pr-0">
                      <NavLink
                        className={`text-secondary fw-bold ${
                          activeTab == "0" ? "activeTab1" : ""
                        } px-4  f-18 py-2 pointer`}
                        onClick={() => toggleTab("0")}
                      >
                        Event Log
                      </NavLink>
                    </NavItem>
                    <NavItem className="pr-0">
                      <NavLink
                        className={`text-secondary fw-bold ${
                          activeTab == "1" ? "activeTab1" : ""
                        } px-4  f-18 py-2 pointer`}
                        onClick={() => toggleTab("1")}
                      >
                        Payment Log
                      </NavLink>
                    </NavItem>
                    <NavItem className="pr-0">
                      <NavLink
                        className={`text-secondary fw-bold ${
                          activeTab == "2" ? "activeTab1" : ""
                        } px-4 f-18 py-2 pointer`}
                        onClick={() => toggleTab("2")}
                      >
                        Ip Log
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
                <TabContent className="px-md-4 px-sm-2 px-1" activeTab={activeTab}>
                  <TabPane tabId="0">
                    {loader ? (
                      <TableSkeleton rows={4} columns={5} />
                    ) : (
                      <div className="table-container mt-5">
                        <Table hover>
                          <thead style={{ backgroundColor: "#F5F6FA" }}>
                            <tr key={""} className="table-heading-size">
                              <th>Role</th>
                              <th>Name</th>
                              <th>Activity</th>
                              <th>Details</th>
                              <th>Date/Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getAllActiveLog.map(res => (
                              <tr key={res.id}>
                                <td
                                  onClick={() => {
                                    setOpenTwo({ status: true, id: res?._id, fullData: res });
                                    setRowData(res);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  className="text-capitalize"
                                >
                                  {res.role}
                                </td>

                                <td className="text-primary text-capitalize">{res.name}</td>
                                <td style={{ color: "#202224" }}>{res.activity}</td>
                                <td className="">{res.detail}</td>
                                <td>{moment(res.createdAt).format("DD-MM-YYYY / HH:mm:ss")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                    <div class="d-flex justify-content-center mt-1">
                      <PaginationComponent
                        currentPage={page1}
                        itemPerPage={itemPerPage1}
                        paginate={d => {
                          setPage1(d);
                        }}
                        totalItems={allPlan.length}
                      />
                    </div>
                  </TabPane>
                  <TabPane tabId="1">
                    {loader ? (
                      <TableSkeleton rows={4} columns={9} />
                    ) : (
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
                              <th>Status</th>
                              <th>Date/Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getAllTransaction.map(res => (
                              <tr key={res.id}>
                                <td
                                  className="text-primary"
                                  onClick={() => {
                                    setOpenThree({ status: true, id: res?._id, fullData: res });
                                    setRowPayment(res);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {res?.planData[0]?.plan_name}
                                </td>

                                <td>{res?.subscriberData[0]?.full_name}</td>
                                <td>{res?.subscriberData[0]?.mobile_number}</td>
                                <td>{res?.subscriberData[0]?.email}</td>
                                <td>{res?.paymentDetails?.amount}</td>
                                <td>{res?.paymentMode}</td>
                                <td>{res?.paymentDetails?.paymentId}</td>
                                <td>{res?.paymentDetails?.paymentStatus}</td>
                                <td>{moment(res.createdAt).format("DD-MM-YYYY / HH:mm:ss")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                    <div class="d-flex justify-content-center mt-1">
                      <PaginationComponent
                        currentPage={page}
                        itemPerPage={itemPerPage}
                        paginate={d => {
                          setPage(d);
                        }}
                        totalItems={allPlanPay.length}
                      />
                    </div>
                  </TabPane>
                  <TabPane tabId="2">
                    <div className="table-container mt-5">
                      <Table hover>
                        <thead style={{ backgroundColor: "#F5F6FA" }}>
                          <tr className="table-heading-size">
                            <th>Username</th>
                            <th>IP Address</th>
                            <th>Start Time</th>
                            <th>Stop Time</th>
                            <th>Upload (Bytes)</th>
                            <th>Download (Bytes)</th>
                            <th>Termination</th>
                            <th>Nas IP Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userIpLog.map((row, index) => (
                            <tr key={index}>
                              <td>{row.username}</td>
                              <td>{row.framedipaddress}</td>
                              <td>{moment(row.acctstarttime).format("YYYY-MM-DD HH:mm:ss")}</td>
                              <td>{row.acctstoptime ? moment(row.acctstoptime).format("YYYY-MM-DD HH:mm:ss") : 0}</td>
                              <td>
                                {row.acctinputoctets !== 0 ? formatBytes(row.acctinputoctets) : row.acctinputoctets}
                              </td>
                              <td>
                                {row.acctoutputoctets !== 0 ? formatBytes(row.acctoutputoctets) : row.acctoutputoctets}
                              </td>
                              <td>{row.acctterminatecause}</td>
                              <td>{row.nasipaddress}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </TabPane>
                </TabContent>
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
  );
}
