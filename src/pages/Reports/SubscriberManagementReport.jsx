import React, { useEffect, useRef, useState } from "react";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { Col, RSelect } from "../../components/Component";
import { UserManagementReportChart, UserSubcriptionReportChart } from "./UserReportChart";
import { SubscriberbarChartStacked } from "./UserReportChartData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaAngleDown, FaAngleUp, FaCalendarAlt } from "react-icons/fa";
import { getPlanByCreator, generateReportSubscriber } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import moment from "moment";
import { userInfo } from "../../assets/userLoginInfo";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import jsPDF from "jspdf";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import * as htmlToImage from "html-to-image";
export default function SubscriberManagementReport({ management }) {
  const overlayRef = useRef(null);
  let userType = [
    { value: "all", label: "All" },
    { value: "postpaid", label: "Postpaid Subscriber" },
    { value: "prepaid", label: "Prepaid Subscriber" }
  ];

  let activityData = [
    { value: "deleted", label: "Deleted Subscriber" },
    { value: "new", label: "New Subscriber" },
    { value: "status", label: "Active/Inactive" }
  ];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);
  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };
  const [selectUserType, setSelectUserType] = useState();
  const [subscriberType, setSubscriberTYpe] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userPlan, setUserPlan] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [planName, setPlanName] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [genarateReportData, setGenerateReportData] = useState(false);
  const [selectYearData, setSelectYearData] = useState({});
  const [selectCut, setSelectCut] = useState("");
  const [requiredUserType, setRequiredUserType] = useState("");
  const [requiredType, setRequiredType] = useState("");
  const [requiredPlan, setRequiredPlan] = useState("");
  const [valid, setValid] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);

  let monthData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [tableSubscriber, setTableSubscriber] = useState([]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const prepareGraphData = data => {
    const groupedData = data?.reduce((acc, item) => {
      if (!acc[item.planName]) {
        acc[item.planName] = {};
      }
      if (!acc[item.planName][item.month]) {
        acc[item.planName][item.month] = 0;
      }
      acc[item.planName][item.month] += item.count;
      return acc;
    }, {});

    const planNames = Object.keys(groupedData);

    const monthsWithData = new Set();
    Object.values(groupedData).forEach(monthCounts => {
      Object.keys(monthCounts).forEach(month => {
        monthsWithData.add(parseInt(month));
      });
    });

    const filteredMonths = monthData.filter((_, index) => monthsWithData.has(index + 1));

    const datasets = planNames.map(planName => {
      const data = new Array(12).fill(0);
      Object.keys(groupedData[planName]).forEach(month => {
        data[month - 1] = groupedData[planName][month];
      });
      return {
        label: planName,
        backgroundColor: getRandomColor(),
        data: data.filter((_, index) => monthsWithData.has(index + 1))
      };
    });
    setGraphData({
      labels: filteredMonths,
      stacked: true,
      dataUnit: "USD",
      datasets: datasets
    });
  };

  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: []
  });
  //

  // In your getPlanData function:
const getPlanData = async () => {
  await getPlanByCreator(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id)
    .then(res => {
      // Add "All" option at the beginning
      setPlanName([{ _id: 'all', plan_name: 'All' }, ...res.data.data]);
    })
    .catch(err => {
      console.log(err);
    });
};

const generateSubscriberReport = async () => {
  setLoader(true);
  let payloadData = {
    type: subscriberType.value,
    plan: userPlan.some(opt => opt.value === 'all')
      ? planName
          .filter(plan => plan._id !== 'all')
          .map(plan => plan._id)
      : userPlan.map(eeee => eeee?.value),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    category: selectUserType.value
  };
  
  await generateReportSubscriber(payloadData)
    .then(res => {
      // ... rest of your success handling
      let statesticData = [...res.data.data.statistics].reverse();

        let tableData = [...res.data.data.tabelData].reverse();

        setLoader(false);
        setTableSubscriber(tableData);


        setExportData(tableData.map(planName => {
          return {
            "Subscriber Name": planName?.full_name,
            "Plan Type/Category": `${planName?.planDetails?.type}/${planName?.planDetails?.category}`,
            "Source": planName?.connectionStatus,
            "Plan Name": planName?.planDetails?.plan_name,
            "Bill Amount": planName?.planDetails?.amount,
            "Created on": moment(planName?.createdAt).format("DD/MM/YYYY"),
            "Status": planName?.status
          }
        }));
        let filterYearData = groupDataByYear(statesticData);
        setSelectYearData(filterYearData);
        let currentYear = new Date().getFullYear();

        prepareGraphData(filterYearData[currentYear]);
        // [0])
        setSelectCut(currentYear);
        setTableData(filterYearData[currentYear]);
        // [0]])
        setButtonDisable(true);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
    setGenerateReportData(true);
  };

  function resetData() {
    setGenerateReportData(false);
    setStartDate("");
    setEndDate("");
    setSelectUserType("");
    setSubscriberTYpe("");
    setUserPlan([]);
    setRequiredPlan("");
    setRequiredUserType("");
    setRequiredType("");
    setButtonDisable(false);
  }

  function groupDataByYear(data) {
    return data?.reduce((acc, item) => {
      const { year, ...rest } = item;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(rest);
      return acc;
    }, {});
  }

  useEffect(() => {
    getPlanData();
  }, []);

  const groupedData = tableData?.reduce((acc, item) => {
    if (!acc[item.planName]) {
      acc[item.planName] = {};
    }
    if (!acc[item.planName][item.month]) {
      acc[item.planName][item.month] = 0;
    }
    acc[item.planName][item.month] += item.count;
    return acc;
  }, {});

  const planNames = Object.keys(groupedData);
  // async function convertToImg() {
  //   // setLoader(true);
  //   let arr = [inVoiceRef1.current];
  //   let photoArr = [];
  //   const pdf = new jsPDF();
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   for (let index = 0; index < arr.length; index++) {
  //     const res = arr[index];
  //     await htmlToImage
  //       .toPng(res, { quality: 0.5 }) // Reduced quality to 0.5
  //       .then(function (dataUrl) {
  //         photoArr.push(dataUrl);
  //         const imgProps = pdf.getImageProperties(dataUrl);
  //         const imgWidth = pdfWidth;
  //         const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //         // Scale image to fit within PDF dimensions
  //         const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
  //         const scaledWidth = imgProps.width * scaleFactor;
  //         const scaledHeight = imgProps.height * scaleFactor;

  //         pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST"); // Added compression option
  //         if (index !== arr.length - 1) {
  //           pdf.addPage();
  //         }
  //       })
  //       .catch(function (error) {
  //         console.error("oops, something went wrong!", error);
  //       })
  //       .finally(() => {
  //         if (index === arr.length - 1) {
  //           // setLoader(false);
  //         }
  //       });
  //   }

  //   pdf.save("Subscriber Management Report.pdf");
  // }

  async function convertToImg() {
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add logo and title to first page
    pdf.addImage(logo, 'PNG', pdfWidth - 80, 5, 70, 15);
    pdf.setFontSize(20);
    pdf.text("Subscriber Management Report", 14, 20);
    
    // Calculate how many rows fit per page
    const rowsPerPage = 20;
    const totalPages = Math.ceil(tableSubscriber.length / rowsPerPage);
    
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
        pdf.addImage(logo, 'PNG', pdfWidth - 80, 5, 70, 15);
        pdf.setFontSize(20);
        pdf.text("Subscriber Management Report", 14, 20);
      }
      
      // Create HTML for current page's rows
      const startIdx = page * rowsPerPage;
      const endIdx = Math.min(startIdx + rowsPerPage, tableSubscriber.length);
      const currentPageRows = tableSubscriber.slice(startIdx, endIdx);
      
      // Create temporary div for this page's table
      const tempDiv = document.createElement('div');
      tempDiv.style.width = "905px";
      tempDiv.style.padding = "25px";
      tempDiv.style.background = "white";
      
      // Create table HTML
      let tableHtml = `
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color:#f8f9fa; font-weight:bold; border:1px solid #dee2e6;">
              <th style="border:1px solid #dee2e6; padding:8px;">Subscriber Name</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Plan Type/Category</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Source</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Plan Name</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Bill Amount</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Created on</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Status</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      currentPageRows.forEach(planName => {
        tableHtml += `
          <tr style="border:1px solid #dee2e6;">
            <td style="border:1px solid #dee2e6; padding:8px;">${planName?.full_name || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${planName?.planDetails?.type || ''}/${planName?.planDetails?.category || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${planName?.connectionStatus || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${planName?.planDetails?.plan_name || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${planName?.planDetails?.amount || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${planName?.createdAt ? moment(planName.createdAt).format("DD-MM-YYYY") : ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px; color:${planName?.status === 'Active' ? 'green' : '#F06565'}">
              ${planName?.status === 'Active' ? 'Active' : 'Inactive'}
            </td>
          </tr>
        `;
      });
      
      tableHtml += `</tbody></table>`;
      tempDiv.innerHTML = tableHtml;
      document.body.appendChild(tempDiv);
      
      try {
        const dataUrl = await htmlToImage.toPng(tempDiv, { quality: 0.5 });
        const imgProps = pdf.getImageProperties(dataUrl);
        const scaleFactor = Math.min(pdfWidth / imgProps.width, (pdfHeight - 40) / imgProps.height);
        const scaledWidth = imgProps.width * scaleFactor;
        const scaledHeight = imgProps.height * scaleFactor;
        
        pdf.addImage(dataUrl, 'PNG', 0, 40, scaledWidth, scaledHeight, undefined, 'FAST');
        
        // Add page number footer
        pdf.setFontSize(10);
        pdf.text(`Page ${page + 1} of ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
        
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        document.body.removeChild(tempDiv);
      }
    }
    
    pdf.save("Subscriber Management Report.pdf");
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
  const inVoiceRef1 = useRef(null);
  return (
    <>


      {/* <div style={{ width: "905px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>Subscriber Management Report</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>

            <table className="table table-bordered">
              <thead className="border">
                <tr className="table-heading-size">
                  <th>Subscriber Name</th>
                  <th>Plan Type/Category</th>
                  <th>Source</th>
                  <th>Plan Name</th>
                  <th>Bill Amount</th>
                  <th>Created on</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="border">
                {tableSubscriber.map((planName, planIndex) => (
                  <tr key={planIndex}>
                   
                    <td>{planName?.full_name}</td>
                    <td>{`${planName?.planDetails?.type}/${planName?.planDetails?.category}`}</td>
                    <td>{planName?.connectionStatus}</td>
                    <td>{planName?.planDetails?.plan_name}</td>
                    <td>{planName?.planDetails?.amount}</td>
                    <td>{moment(planName?.createdAt).format("DD-MM-YYYY")}</td>
                    <td>
                      {planName?.status === "Active" ? (
                        <>
                          {" "}
                          <span style={{ color: "green" }}>Active</span>
                        </>
                      ) : (
                        <>
                          {" "}
                          <span style={{ color: "#F06565" }}>Inactive</span>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div> */}
      {loader && <Loader />}
      <div className="reports_child">
        <h2 className="fw-600">{management} Reports</h2>

        <div className="form_heading fw-600 f-18 mt-5">User Selection</div>
        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
            <label>User Type</label>
            <RSelect
              placeholder="User Type"
              options={userType}
              value={selectUserType}
              onChange={e => {
                setRequiredUserType();
                setSelectUserType(e);
                setButtonDisable(false);
                // setSubscriberTYpe("")
                // setUserPlan([])
              }}
            />
            {valid && requiredUserType === "" && <p className="text-danger">Please Select User Type</p>}
          </div>
        </div>
        <div className="form_heading fw-600 f-18 mt-4">Report Metrics</div>
        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-3">
            <label>Type</label>
            <RSelect
              placeholder="Activity"
              options={activityData}
              value={subscriberType}
              onChange={e => {
                setRequiredType();
                setSubscriberTYpe(e);
                setButtonDisable(false);
              }}
            />
            {valid && requiredType === "" && <p className="text-danger">Please Select Type</p>}
          </div>
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-3">
  <label>Plan Name</label>
  <RSelect
    placeholder="Select Plan Name"
    options={planName?.map(e => ({
      value: e._id,
      label: e.plan_name,
    }))}
    value={userPlan}
    onChange={(selectedOptions) => {
      setRequiredPlan();
      setButtonDisable(false);
      
      // Handle "All" selection
      if (selectedOptions && selectedOptions.some(opt => opt.value === 'all')) {
        // Select all options except "All"
        setUserPlan(
          planName
            .filter(plan => plan._id !== 'all')
            .map(plan => ({
              value: plan._id,
              label: plan.plan_name
            }))
        );
      } else if (selectedOptions && selectedOptions.length === planName.length - 1) {
        // All options selected (except "All"), so add "All"
        setUserPlan([
          { value: 'all', label: 'All' },
          ...selectedOptions
        ]);
      } else {
        // Normal selection
        setUserPlan(selectedOptions);
      }
    }}
    isMulti
    closeMenuOnSelect={false}
  />
  {valid && requiredPlan === "" && <p className="text-danger">Please Select Plan</p>}
</div>
        </div>

        <div className="form_heading fw-600 f-18 mt-4">Data Range</div>
        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
            <label>From</label>
            <div className="input-group">
              {/* <DatePicker
                selected={startDate}
                onChange={date => {
                  setStartDate(date);
                  setButtonDisable(false);
                }}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="form-control"
                placeholderText="Select Date"
              /> */}
              <input type="date" className="form-control" onChange={e => {
                setStartDate(e.target.value);
                setButtonDisable(false);
              }} />
              {/* <div className="input-group-append">
                <span className="input-group-text">
                  <FaCalendarAlt style={{ cursor: "pointer" }} />
                </span>
              </div> */}
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-3">
            <label>To</label>
            <div className="input-group">
              {/* <DatePicker
                selected={endDate}
                onChange={date => {
                  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                  setEndDate(lastDayOfMonth);
                  setButtonDisable(false);
                }}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="form-control"
                placeholderText="Select Date"
              /> */}
              <input type="date" className="form-control" onChange={e => {
                // const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                setEndDate(e.target.value);
                setButtonDisable(false);
              }} />
              {/* <div className="input-group-append">
                <span className="input-group-text">
                  <FaCalendarAlt style={{ cursor: "pointer" }} />
                </span>
              </div> */}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-mt-end justify-content-sm-end justify-content-start mt-5">
          <div className="d-flex">
            <button
              className="btn"
              onClick={() => {
                resetData();
              }}
            >
              Reset
            </button>
            {/* {requiredUserType  !=="" || requiredType  !=="" || requiredPlan  !==""  ? <> */}
            <button
              className="btn btn-primary ml-3"
              onClick={() => {
                if (requiredUserType === "" || requiredType === "" || requiredPlan === "") {
                  setValid(true);
                } else {
                  generateSubscriberReport();

                  setValid(false);
                }
              }}
              disabled={buttonDisable}
            >
              Generate Report
            </button>
          </div>
        </div>
        {genarateReportData && (
          <>
            <div className="d-flex justify-content-between mt-5">
              <div className="d-flex">
                <div className="f-20 fw-600 mr-2">Report</div>
                <div>
                  <SingleSelect
                    placeItem="number"
                    size="sm"
                    value={selectCut}
                    options={Object.keys(selectYearData).map(es => {
                      return { value: es, label: es };
                    })}
                    onChange={e => {
                      prepareGraphData(selectYearData[e.target.value]);
                      setTableData(selectYearData[e.target.value]);

                      setSelectCut(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="f-20 fw-600">
                {startDate ? moment(startDate).format("MMMM YYYY") : ""} -{" "}
                {endDate ? moment(endDate).format("MMMM YYYY") : ""}
              </div>
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
                      <ExportCsv exportData={exportData} filName={"Subscriber Management Report"} />
                    </DropdownItem>
                    <DropdownItem>
                      {" "}
                      <div onClick={convertToImg}>PDF</div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5">
              <Col md={12}>
                <UserSubcriptionReportChart stacked data={graphData} />
              </Col>
            </div>
            <div className="mt-5 d-flex align-items-center justify-content-between">
              <div className="f-20 fw-600">Table</div>
            </div>
            {/* {)} */}
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="border">
                    <tr className="table-heading-size">
                      <th>Subscriber Name</th>
                      <th>Plan Type/Category</th>
                      <th>Source</th>
                      <th>Plan Name</th>
                      <th>Bill Amount</th>
                      <th>Created on</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {tableSubscriber.map((planName, planIndex) => (
                      <tr key={planIndex}>
                        {/* <td>{planName}</td>
                        {monthData.map((_, monthIndex) => (
                          <td key={monthIndex}>{groupedData[planName][monthIndex + 1] || 0}</td>
                        ))} */}
                        <td>{planName?.full_name}</td>
                        <td>{`${planName?.planDetails?.type}/${planName?.planDetails?.category}`}</td>
                        <td>{planName?.connectionStatus}</td>
                        <td>{planName?.planDetails?.plan_name}</td>
                        <td>{planName?.planDetails?.amount}</td>
                        <td>{moment(planName?.createdAt).format("DD-MM-YYYY")}</td>
                        <td>
                          {planName?.status === "Active" ? (
                            <>
                              {" "}
                              <span style={{ color: "green" }}>Active</span>
                            </>
                          ) : (
                            <>
                              {" "}
                              <span style={{ color: "#F06565" }}>Inactive</span>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
