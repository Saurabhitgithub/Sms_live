import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp, FaCalendarAlt } from "react-icons/fa";
import { Col, RSelect } from "../../components/Component";
import DatePicker from "react-datepicker";
import { UserManagementReportChart } from "./UserReportChart";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { generateHelpDeskReport, getAllIssueType } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import moment from "moment";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import jsPDF from "jspdf";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import * as htmlToImage from "html-to-image";
export default function HelpDeskReport({ management }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectTicketType, setSelectTicketType] = useState("");
  const [selectIssueType, setSelectIssueType] = useState([]);
  const [loader, setLoader] = useState(false);
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState({});
  const [exportData, setExportData] = useState([]);
  const [selectYearData, setSelectYearData] = useState({});
  const [selectCut, setSelectCut] = useState("");
  const [genarateReportData, setGenerateReportData] = useState(false);
  const [requiredPlan, setRequiredPlan] = useState("");
  const [requiredInvoiceType, setRequiredInvoiceType] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [valid, setValid] = useState(false);
  const [getAllIssue, setGetAllIssue] = useState([])
  const [helpTable, setHelpTable] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);
  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };
  const ticketData = [
    { value: "resolve", label: "Resolved" },
    { value: "new", label: "All" },
    { value: "unresolve", label: "Unresolve" },
  ];

  const issueType = [
    { value: "all", label: "All" },
    { value: "payment", label: "Payment" },
    { value: "billing", label: "Billing" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
  ];

  // In your getAllDataIssueFunction:
const getAllDataIssueFunction = async () => {
  await getAllIssueType().then((res) => {
    // Add "All" option at the beginning
    setGetAllIssue([{ issue_type: 'all', name: 'All' }, ...res.data.data]);
  }).catch((err) => {
    console.log(err);
  });
};

  const monthData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function groupDataByYear(data) {
    return data.reduce((acc, item) => {
      const { year, ...rest } = item;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(rest);
      return acc;
    }, {});
  }

  const generateReportFunction = async () => {
    setLoader(true);
    let PayloadData = {
      issueStatus: selectTicketType,
      issueType: selectIssueType.map((e) => e.value),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    try {
      const res = await generateHelpDeskReport(PayloadData);
      setLoader(false);
      let statesticData = [...res.data.data.statistics].reverse();

      let tableData = [...res.data.data.tabelData].reverse();
      // let reverseData = res.data.data.reverse();

      setHelpTable(tableData)
      setExportData(tableData.map((issueType) => {
        return {
          "Ticket Id No": issueType?.ticket_id,
          "Source": issueType?.issue_from_website,
          "Status": issueType?.status,
          "Issue Type": issueType?.name,
          "Name": issueType?.already_subscriber,
          "User Type": issueType?.desc.slice(0, 10),
          "Assigned To": issueType?.assignee_name,
          "Priority": issueType?.priority,
          "Created At": moment(issueType?.createdAt)?.format("DD/MMM/YYYY")
        }
      }));
      let filterYearData = groupDataByYear(statesticData);
      let currentYear = new Date().getFullYear()

      setSelectYearData(filterYearData);
      processGraphData(filterYearData[currentYear]);
      setSelectCut(currentYear);
      processTableData(filterYearData[currentYear]);
      setButtonDisable(true)
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
    setGenerateReportData(true);
  };

  const processGraphData = (data) => {
    prepareGraphData(data);
  };

  const prepareGraphData = (data) => {
    const processedGroupedData = data.reduce((acc, item) => {
      if (!acc[item.issue_type]) {
        acc[item.issue_type] = {};
      }
      if (!acc[item.issue_type][item.month]) {
        acc[item.issue_type][item.month] = 0;
      }
      acc[item.issue_type][item.month] += item.count;
      return acc;
    }, {});

    const monthsWithData = new Set();
    Object.values(processedGroupedData).forEach((monthCounts) => {
      Object.keys(monthCounts).forEach((month) => {
        monthsWithData.add(parseInt(month));
      });
    });

    const filteredMonths = monthData.filter((_, index) => monthsWithData.has(index + 1));

    const datasets = Object.keys(processedGroupedData).map((issueType) => {
      const data = new Array(12).fill(0);
      Object.keys(processedGroupedData[issueType]).forEach((month) => {
        data[month - 1] = processedGroupedData[issueType][month];
      });
      return {
        label: issueType.charAt(0).toUpperCase() + issueType.slice(1),
        backgroundColor: getRandomColor(),
        data: data.filter((_, index) => monthsWithData.has(index + 1)),
      };
    });



    setGraphData({
      labels: filteredMonths,
      datasets: datasets,
    });
  };

  const processTableData = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      if (!groupedData[item.issue_type]) {
        groupedData[item.issue_type] = Array(12).fill(0); // initialize array with 12 zeros for each month
      }
      groupedData[item.issue_type][item.month - 1] = item.count;
    });

    setTableData(groupedData);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  function resetData() {
    setStartDate("");
    setEndDate("");
    setGenerateReportData(false);
    setSelectIssueType([]);
    setRequiredInvoiceType("");
    setRequiredPlan("");
    setButtonDisable(false)
    setSelectTicketType("")
  }

  useEffect(() => {
    getAllDataIssueFunction()
  }, [])
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

  //   pdf.save("Help Desk Management Report.pdf");
  // }

  async function convertToImg() {
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add logo and title to first page
    pdf.addImage(logo, 'PNG', pdfWidth - 80, 5, 70, 15);
    pdf.setFontSize(20);
    pdf.text("Help Desk Management Report", 14, 20);
    
    // Calculate how many rows fit per page
    const rowsPerPage = 30;
    const totalPages = Math.ceil(helpTable.length / rowsPerPage);
    
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
        pdf.addImage(logo, 'PNG', pdfWidth - 80, 5, 70, 15);
        pdf.setFontSize(20);
        pdf.text("Help Desk Management Report", 14, 20);
      }
      
      // Create HTML for current page's rows
      const startIdx = page * rowsPerPage;
      const endIdx = Math.min(startIdx + rowsPerPage, helpTable.length);
      const currentPageRows = helpTable.slice(startIdx, endIdx);
      
      // Create temporary div for this page's table
      const tempDiv = document.createElement('div');
      tempDiv.style.width = "1200px";
      tempDiv.style.padding = "25px";
      tempDiv.style.background = "white";
      
      // Create table HTML
      let tableHtml = `
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color:#f8f9fa; font-weight:bold; border:1px solid #dee2e6;">
              <th style="border:1px solid #dee2e6; padding:8px;">Ticket Id No.</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Source</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Status</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Issue Type</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Name</th>
              <th style="border:1px solid #dee2e6; padding:8px;">User Type</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Description</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Assigned To</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Priority</th>
              <th style="border:1px solid #dee2e6; padding:8px;">Created At</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      currentPageRows.forEach(issueType => {
        tableHtml += `
          <tr style="border:1px solid #dee2e6;">
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.ticket_id || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.issue_from_website ? "Website" : "Offline"}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.status || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.issue_type || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.name || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.already_subscriber || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.desc?.slice(0, 10) || ''}${issueType?.desc?.length > 10 ? "..." : ""}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.assignee_name || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.priority || ''}</td>
            <td style="border:1px solid #dee2e6; padding:8px;">${issueType?.createdAt ? moment(issueType.createdAt).format("DD MMM YYYY") : ''}</td>
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
    
    pdf.save("Help Desk Management Report.pdf");
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
      {/* <div style={{ width: "1200px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>Help Desk Management Report</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>
            <table className="table table-bordered">
              <thead className="border">
                <tr className="table-heading-size">
                  <th>Ticket Id No.</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Issue Type</th>
                  <th>Name</th>
                  <th>User Type</th>
                  <th>Description</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody className="border">
                {helpTable.map((issueType, issueIndex) => (
                  <tr key={issueIndex}>
                    <td className="text-capitalize">{issueType?.ticket_id}</td>
                    <td>{issueType?.issue_from_website ? "Website" : "Offline"}</td>
                    <td>{issueType?.status}</td>
                    <td>{issueType?.issue_type}</td>
                    <td>{issueType?.name}</td>
                    <td>{issueType?.already_subscriber}</td>
                    <td> {issueType?.desc.slice(0, 10)}
                      {issueType?.desc.length > 10 ? "..." : ""}</td>
                    <td className="">{issueType?.assignee_name}</td>
                    <td>{issueType?.priority}</td>
                    <td className="">{moment(issueType?.createdAt)?.format("DD MMM YYYY")}</td>
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
        <div className="form_heading fw-600 f-18 mt-5">Report Metrics</div>
        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
            <label>Ticket Type</label>
            <RSelect options={ticketData} placeholder="Select Role" value={selectTicketType} onChange={(e) => { setRequiredInvoiceType(); setSelectTicketType(e); setButtonDisable(false) }} />
            {valid && requiredInvoiceType === "" && (
              <p className="text-danger">Please Select Ticket Type</p>
            )}
          </div>
         
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
  <label>Issue Type</label>
  <RSelect
    options={getAllIssue.map((ee) => ({
      value: ee.issue_type,
      label: ee.name || ee.issue_type
    }))}
    value={selectIssueType}
    placeholder="Select Issue Type"
    isMulti
    onChange={(selectedOptions) => {
      setRequiredPlan();
      setButtonDisable(false);
      
      // Handle "All" selection
      if (selectedOptions && selectedOptions.some(opt => opt.value === 'all')) {
        // Select all options except "All"
        setSelectIssueType(
          getAllIssue
            .filter(issue => issue.issue_type !== 'all')
            .map(issue => ({
              value: issue.issue_type,
              label: issue.name || issue.issue_type
            }))
        );
      } else if (selectedOptions && selectedOptions.length === getAllIssue.length - 1) {
        // All options selected (except "All"), so add "All"
        setSelectIssueType([
          { value: 'all', label: 'All' },
          ...selectedOptions
        ]);
      } else {
        // Normal selection
        setSelectIssueType(selectedOptions);
      }
    }}
    closeMenuOnSelect={false}
  />
  {valid && requiredPlan === "" && (
    <p className="text-danger">Please Select Issue Type</p>
  )}
</div>

        </div>
        <div className="form_heading fw-600 f-18 mt-5">Data Range</div>
        <div className="row mt-4">
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
            <label>From</label>
            <div className="input-group">
              {/* <DatePicker
                selected={startDate}
                onChange={(date) => {setStartDate(date);setButtonDisable(false)}}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="form-control"
                placeholderText="Select Date"
              /> */}
              <input type="date" className="form-control" onChange={(e) => { setStartDate(e.target.value); setButtonDisable(false) }} />
              {/* <div className="input-group-append">
                <span className="input-group-text">
                  <FaCalendarAlt style={{ cursor: "pointer" }} />
                </span>
              </div> */}
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
            <label>To</label>
            <div className="input-group">
              {/* <DatePicker
                selected={endDate}
                onChange={(date) => {  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                  setEndDate(lastDayOfMonth);;setButtonDisable(false)}}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="form-control"
                placeholderText="Select Date"
              /> */}
              <input type="date" className="form-control" onChange={(e) => {
                setEndDate(e.target.value); setButtonDisable(false)
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
            <button className="btn" type="button" onClick={() => { resetData() }}>
              Reset
            </button>
            <button className="btn btn-primary ml-3" disabled={buttonDisable} onClick={() => {
              if (requiredInvoiceType === "" || requiredPlan === "") {
                setValid(true)
              } else {
                setValid(false)
                generateReportFunction();
              }
            }}>
              Generate Report
            </button>
          </div>
        </div>
        {genarateReportData && (
          <>
            <div className="d-flex justify-content-between mt-5">
              <div className="d-flex align-items-center justify-content-between">
                <div className="f-20 fw-600 mr-2">Report</div>
                <div>
                  <SingleSelect
                    placeItem="Year"
                    value={selectCut}
                    options={Object.keys(selectYearData).map((es) => {
                      return { value: es, label: es };
                    })}
                    onChange={(e) => {
                      processGraphData(selectYearData[e.target.value]);
                      processTableData(selectYearData[e.target.value]);
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
                      <ExportCsv exportData={exportData} filName={"Invoice Management Report"} />
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
                <UserManagementReportChart stacked data={graphData} />
              </Col>
            </div>
            <div className="mt-5 d-flex align-items-center justify-content-between">
              <div className="f-20 fw-600">Table</div>
            </div>
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="border">
                    <tr className="table-heading-size">
                      <th>Ticket Id No.</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Issue Type</th>
                      <th>Name</th>
                      <th>User Type</th>
                      <th>Description</th>
                      <th>Assigned To</th>
                      <th>Priority</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {helpTable.map((issueType, issueIndex) => (
                      <tr key={issueIndex}>
                        <td className="text-capitalize">{issueType?.ticket_id}</td>
                        <td>{issueType?.issue_from_website ? "Website" : "Offline"}</td>
                        <td>{issueType?.status}</td>
                        <td>{issueType?.issue_type}</td>
                        <td>{issueType?.name}</td>
                        <td>{issueType?.already_subscriber}</td>
                        <td> {issueType?.desc.slice(0, 10)}
                          {issueType?.desc.length > 10 ? "..." : ""}</td>
                        <td className="">{issueType?.assignee_name}</td>
                        <td>{issueType?.priority}</td>
                        <td className="">{moment(issueType?.createdAt)?.format("DD MMM YYYY")}</td>
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
