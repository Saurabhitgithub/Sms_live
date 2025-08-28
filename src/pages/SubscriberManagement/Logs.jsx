import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from "reactstrap";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { planHistorySubscriberId, getEventLogsById, getPaymentLogById } from "../../service/admin";
import moment from "moment";
import { PaginationComponent } from "../../components/Component";
// import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png"

export default function Logs({ planData }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);
  const [status, setStatus] = useState("Subscriber Logs");
  const [tableData, setTableData] = useState([
    {
      type: "Login",
      date: "Connection",
      status: "Failed",
      activity: "Created New Admin",
      role: "admin",
      name: "Rahul",
      details: "New network engineer added by Admin",
      sms: "1 Mbps_20 GB_512 Kbps",
      sbt: "Prepaid/Unlimited",
      sb: "Auto Generated",
      plan: "999 Rs",
      phone: "9090909090",
      email: "asd@gmail.com",
      mode: "phone pay",
      trasaction: "1234321",
      comment: "Lorem ipsum dolor sit amet consectetur. Mattis tortor id cursus pharetra orci lacus quis."
    },
    {
      type: "Login",
      date: "Connection",
      status: "Failed",
      activity: "Created New Admin",
      role: "admin",
      name: "Rahul",
      details: "New network engineer added by Admin",
      sms: "1 Mbps_20 GB_512 Kbps",
      sbt: "Prepaid/Unlimited",
      sb: "Auto Generated",
      plan: "999 Rs",
      phone: "9090909090",
      email: "asd@gmail.com",
      mode: "phone pay",
      trasaction: "1234321",
      comment: "Lorem ipsum dolor sit amet consectetur. Mattis tortor id cursus pharetra orci lacus quis."
    },
    {
      type: "Login",
      date: "Connection",
      status: "Failed",
      activity: "Created New Admin",
      role: "admin",
      name: "Rahul",
      details: "New network engineer added by Admin",
      sms: "1 Mbps_20 GB_512 Kbps",
      sbt: "Prepaid/Unlimited",
      sb: "Auto Generated",
      plan: "999 Rs",
      phone: "9090909090",
      email: "asd@gmail.com",
      mode: "phone pay",
      trasaction: "1234321",
      comment: "Lorem ipsum dolor sit amet consectetur. Mattis tortor id cursus pharetra orci lacus quis."
    }
  ]);

  const statusArr = [
    { value: "Subscriber", label: "Subscriber Logs", color: "#0046B0" },
    { value: "Event", label: "Event Logs", color: "#50AD97" },
    { value: "Sms", label: "SMS Logs", color: "#50AD97" },
    { value: "Email", label: "Email Logs", color: "#50AD97" },
    { value: "Payment", label: "Payment Logs", color: "#50AD97" },
    { value: "Plan", label: "Plan History", color: "#50AD97" }
  ];

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

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

  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  const [icon3, setIcon3] = useState(true);

  const toggleDropdown3 = () => {
    setIcon3(prevState => !prevState);
    setDropdownOpen3(prevState => !prevState);
  };

  const sessionChange = status => {
    setStatus(status); // Set the status to the clicked item's label
  };

  const [planTable, setPlanTable] = useState([]);
  const [eventTable, setEventTable] = useState([]);
  const [paymentTable,setPaymentTable] = useState([])
  const [exportDataHistory, setExportDataHistory] = useState([]);
  const [exportDataEvent, setExportDataEvent] = useState([]);
  const [exportPayment,setExportPayment] = useState([])

  let [page, setPage] = useState(1);
  let itemPerPage = 8;

  

  const planHistoryData = async () => {
    try {
      let res = await planHistorySubscriberId(planData?._id);
      
      let revrseData = res?.data?.data?.plan_history?.reverse();
      setPlanTable(revrseData);
      let exportInfo = revrseData.map(e => {
        return {
          Date: e?.start_date,
          "Plan Name": e?.plan_name,
          "Plan Category/ Type": e?.category,
          "Bandwidth Template": e?.name,
          "Plan Amount": e?.amount
        };
      });
      setExportDataHistory(exportInfo);
    } catch (err) {
      console.log(err);
    }
  };

  const eventLogData = async () => {
    try {
      let response = await getEventLogsById(planData?._id);
      let revrseData = response.data.data.reverse();
      
      setEventTable(revrseData);
      let exportInfo = revrseData.map(e => {
        return {
          Role: e?.role,
          Name: e?.name,
          Activity: e?.activity,
          Details: e?.detail,
          Date: e?.createdAt
        };
      });
      setExportDataEvent(exportInfo);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const paymentData = async() =>{
    try{
      let res = await getPaymentLogById(planData?._id)
      let revrseData = res.data.data.reverse();
      

      setPaymentTable(revrseData)
      let exportInfo = revrseData.map((e)=>{
        return {
          "Plan Name":e?.planData[0]?.plan_name,
          "Name":e?.subscriberData[0]?.full_name,
          "Phone No.":e?.subscriberData[0]?.mobile_number,
          "Email ID":e?.subscriberData[0]?.email,
          "Amount":e?.paymentDetails?.amount,
          "Mode":e?.paymentMode,
          "Transaction ID":e?.paymentDetails?.paymentId ? e?.paymentDetails?.paymentId :"N/A",
          "Status":e?.paymentDetails?.paymentStatus,
          "Date/Time":e?.createdAt
        }
      })
      
      setExportPayment(exportInfo)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    planHistoryData();
    eventLogData();
    paymentData();
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

    pdf.save("Event Log.pdf");
  }
  const inVoiceRef2 = useRef(null);

  async function convertToImg2() {
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

  async function convertToImg3() {
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

    pdf.save("Plan History.pdf");
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
     <div style={{ width: "1000px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Event Logs</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Role</th>
                      <th>Name</th>
                      <th>Activity</th>
                      <th>Details</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventTable.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td>{res?.role}</td>
                          <td>{res?.name}</td>
                          <td>{res?.activity}</td>
                          <td>{res?.detail}</td>
                          <td>{moment(res?.createdAt).format("DD-MM-YYYY")}</td>
                        </tr>
                      );
                    })}
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
                <h3>Payment Logs</h3>
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
                  {paymentTable.map((res, index) => {
                    return (
                      <tr key={index}>
                        <td>{res?.planData[0]?.plan_name}</td>
                        <td>{res?.subscriberData[0]?.full_name}</td>
                        <td>{res?.subscriberData[0]?.mobile_number}</td>
                        <td>{res?.subscriberData[0]?.email}</td>
                        <td>{res?.paymentDetails?.amount}</td>
                        <td>{res?.paymentMode}</td>
                        <td>{res?.paymentDetails?.paymentId ? res?.paymentDetails?.paymentId :"N/A"}</td>
                        <td>{res?.paymentDetails?.paymentStatus}</td>
                        <td>{moment(res?.createdAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    );
                  })}
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
                <h3>Plan History</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Date</th>
                      <th>Plan Name</th>
                      <th>Plan Category/Type</th>
                      <th>Bandwidth Template</th>
                      <th>Plan Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planTable?.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td>{res?.start_date ? moment(res?.start_date).format("DD-MM-YYYY") : "---"}</td>
                          <td>{res?.plan_name}</td>
                          <td>{res?.category}</td>
                          <td>{res?.name}</td>
                          <td>{res?.amount}Rs</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
            </div>
          </div>
        </div>
      <div className="mt-md-5 mt-sm-4 mt-3">
        <div>
          <div className="dropdown_logs">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret className="primary-background text-wrap text-capitalize" type="button">
                {status || "Select Logs"}{" "}
                <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}</span>
              </DropdownToggle>
              <DropdownMenu>
                {statusArr.map((res, index) => (
                  <DropdownItem
                    key={index}
                    className="text-capitalize"
                    onClick={() => sessionChange(res.label)} // Pass the label to sessionChange
                  >
                    {res.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-between">
          <div>
            {/* Conditionally render content based on the selected status */}
            {status === "Subscriber Logs" && <div className="fs-24 fw-500">Subscriber Logs</div>}
            {status === "Event Logs" && <div className="fs-24 fw-500">Event Logs</div>}
            {status === "SMS Logs" && <div className="fs-24 fw-500">SMS Logs</div>}
            {status === "Email Logs" && <div className="fs-24 fw-500">Email Logs</div>}
            {status === "Payment Logs" && <div className="fs-24 fw-500">Payment Logs</div>}
            {status === "Plan History" && <div className="fs-24 fw-500">Plan History</div>}
          </div>
          <div className="">
            {status === "Subscriber Logs" }
            {status === "Event Logs" && 
            // <ExportCsv exportData={exportDataEvent} filName={"Event Logs"} />
            <div className="dropdown_logs ">

            <Dropdown isOpen={dropdownOpen1} toggle={toggleDropdown1}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon1 ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportDataEvent} filName={"Event Logs"} />
                        </DropdownItem>
                        <DropdownItem>
                          {" "}
                          <div onClick={convertToImg}>PDF</div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
            }
            {status === "SMS Logs"}
            {status === "Email Logs"}
            {status === "Payment Logs" && 
            // <ExportCsv exportData={exportPayment} filName={"Payment Logs"} />
            <div className="dropdown_logs ">

            <Dropdown isOpen={dropdownOpen2} toggle={toggleDropdown2}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon2 ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportPayment} filName={"Payment Logs"} />
                        </DropdownItem>
                        <DropdownItem>
                          {" "}
                          <div onClick={convertToImg2}>PDF</div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
            }
            {status === "Plan History" && 
            // <ExportCsv exportData={exportDataHistory} filName={"Plan History"} />
            <div className="dropdown_logs ">

            <Dropdown isOpen={dropdownOpen3} toggle={toggleDropdown3}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon3 ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportDataHistory} filName={"Plan History"} />
                        </DropdownItem>
                        <DropdownItem>
                          {" "}
                          <div onClick={convertToImg3}>PDF</div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
            }
          </div>
        </div>
        <div className="mt-3">
          {status === "Subscriber Logs" && (
            <div className="table-container mt-5">
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Type</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res, index) => {
                    return (
                      <tr key={index}>
                        <td>{res?.type}</td>
                        <td>{res?.date}</td>
                        <td>{res?.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
          {status === "Event Logs" && (
            <>
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Role</th>
                      <th>Name</th>
                      <th>Activity</th>
                      <th>Details</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventTable.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td>{res?.role}</td>
                          <td>{res?.name}</td>
                          <td>{res?.activity}</td>
                          <td>{res?.detail}</td>
                          <td>{moment(res?.createdAt).format("DD-MM-YYYY")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div class="d-flex justify-content-center mt-1">
                <PaginationComponent
                  currentPage={page}
                  itemPerPage={itemPerPage}
                  paginate={d => {
                    setPage(d);
                  }}
                  totalItems={eventTable.length}
                />
              </div>
            </>
          )}
          {status === "SMS Logs" && (
            <div className="table-container mt-5">
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Date</th>
                    <th>SMS</th>
                    <th>Sent By Type</th>
                    <th>Sent By</th>
                    <th>Plan Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res, index) => {
                    return (
                      <tr key={index}>
                        <td>{res?.date}</td>
                        <td>{res?.sms}</td>
                        <td>{res?.sbt}</td>
                        <td>{res?.sb}</td>
                        <td>{res?.plan}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
          {status === "Email Logs" && (
            <div className="table-container mt-5">
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Date</th>
                    <th>Comment</th>
                    <th>Sent By Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res, index) => {
                    return (
                      <tr key={index}>
                        <td>{res?.date}</td>
                        <td>{res?.comment}</td>
                        <td>{res?.sb}</td>
                        <td>{res?.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
          {status === "Payment Logs" && (
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
                    <th>Status</th>
                    <th>Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentTable.map((res, index) => {
                    return (
                      <tr key={index}>
                        <td>{res?.planData[0]?.plan_name}</td>
                        <td>{res?.subscriberData[0]?.full_name}</td>
                        <td>{res?.subscriberData[0]?.mobile_number}</td>
                        <td>{res?.subscriberData[0]?.email}</td>
                        <td>{res?.paymentDetails?.amount}</td>
                        <td>{res?.paymentMode}</td>
                        <td>{res?.paymentDetails?.paymentId ? res?.paymentDetails?.paymentId :"N/A"}</td>
                        <td>{res?.paymentDetails?.paymentStatus}</td>
                        <td>{moment(res?.createdAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div class="d-flex justify-content-center mt-1">
                <PaginationComponent
                  currentPage={page}
                  itemPerPage={itemPerPage}
                  paginate={d => {
                    setPage(d);
                  }}
                  totalItems={paymentTable.length}
                />
              </div>
            </>
          )}
          {status === "Plan History" && (
            <>
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Date</th>
                      <th>Plan Name</th>
                      <th>Plan Category/Type</th>
                      <th>Bandwidth Template</th>
                      <th>Plan Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planTable?.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td>{res?.start_date ? moment(res?.start_date).format("DD-MM-YYYY") : "---"}</td>
                          <td>{res?.plan_name}</td>
                          <td>{res?.category}</td>
                          <td>{res?.name}</td>
                          <td>{res?.amount}Rs</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div class="d-flex justify-content-center mt-1">
                <PaginationComponent
                  currentPage={page}
                  itemPerPage={itemPerPage}
                  paginate={d => {
                    setPage(d);
                  }}
                  totalItems={planTable.length}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
