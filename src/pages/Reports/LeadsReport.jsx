import React, { useRef, useState } from "react";
import { Col, RSelect } from "../../components/Component";
import DatePicker from "react-datepicker";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { UserManagementReportChart } from "./UserReportChart";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { generateLeadsReport } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import moment from "moment";
import { tr } from "date-fns/locale";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { FaAngleDown, FaAngleUp, FaCalendarAlt } from "react-icons/fa";
import jsPDF from "jspdf";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import * as htmlToImage from "html-to-image";
export default function LeadsReport({ management }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  let leadsType = [
    { value: "lost", label: "Lost" },
    { value: "converted", label: "Converted" },
    { value: "new", label: "New" }
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);
  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const [valid, setValid] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [requiredType, setRequiredType] = useState("");
  const [requiredPlan, setRequiredPlan] = useState("");
  const [genarateReportData, setGenerateReportData] = useState(false);
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
  const [selectYearData, setSelectYearData] = useState({});
  const [selectCut, setSelectCut] = useState("");
  const [selectLeadsType, setSelectLeadsType] = useState([]);
  const [leadsTable, setLeadsTable] = useState([]);

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
    // setLoader(true);
    let payloadData = {
      type: selectLeadsType?.map(e => e.value),
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };

    await generateLeadsReport(payloadData)
      .then(res => {
        let statesticData = [...res.data.data.statistics].reverse();

        let tableData = [...res.data.data.tabelData].reverse();
        setLeadsTable(tableData);
        setExportData(
          tableData.map(res => {
            return {
              "Source ": res?.connectionStatus ? res?.connectionStatus : "---",
              "Lead Name": res?.full_name,
              "Mobile Number": res?.mobile_number,
              "Account Type": res?.account_type ? res?.account_type : "---",
              "Installation Address": res?.installation_address?.city
                ? `${res.installation_address.city}, ${res.installation_address.state}`
                : "---",
              Status: res?.lead_status,
              "Assigned To": res?.assignee_name,
              "Created on": moment(res?.createdAt).format("DD/MM/YYYY")
            };
          })
        );
        // let dataReverse = res.data.data;
        // let reverseData = dataReverse.reverse();
        let filterYearData = groupDataByYear(statesticData);
        let currentYear = new Date().getFullYear();
        if (filterYearData[currentYear]) {
          setSelectYearData(filterYearData);
          processGraphData(filterYearData[currentYear]);
          processTableData(filterYearData[currentYear]);
        }

        setSelectCut(currentYear);

        setButtonDisable(true);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
    setGenerateReportData(true);
  };

  const processGraphData = data => {
    prepareGraphData(data);
  };

  const prepareGraphData = data => {
    const processedGroupedData = data.reduce((acc, item) => {
      if (!acc[item.lead_status]) {
        acc[item.lead_status] = {};
      }
      if (!acc[item.lead_status][item.month]) {
        acc[item.lead_status][item.month] = 0;
      }
      acc[item.lead_status][item.month] += item.count;
      return acc;
    }, {});

    const monthsWithData = new Set();
    Object.values(processedGroupedData).forEach(monthCounts => {
      Object.keys(monthCounts).forEach(month => {
        monthsWithData.add(parseInt(month));
      });
    });

    const filteredMonths = monthData.filter((_, index) => monthsWithData.has(index + 1));

    const datasets = Object.keys(processedGroupedData).map(issueType => {
      const data = new Array(12).fill(0);
      Object.keys(processedGroupedData[issueType]).forEach(month => {
        data[month - 1] = processedGroupedData[issueType][month];
      });
      return {
        label: issueType.charAt(0).toUpperCase() + issueType.slice(1),
        backgroundColor: getRandomColor(),
        data: data.filter((_, index) => monthsWithData.has(index + 1))
      };
    });

    // const exportCSV = datasets.map((es, index) => {
    //   let datass = {};
    //   filteredMonths.forEach((ds, i) => {
    //     datass = { ...datass, [ds]: es.data[i] };
    //   });
    //   let csvDAta = {
    //     issueType: es.label
    //   };
    //   return { ...csvDAta, ...datass };
    // });

    setGraphData({
      labels: filteredMonths,
      datasets: datasets
    });
  };

  const processTableData = data => {
    const groupedData = {};

    data.forEach(item => {
      if (!groupedData[item.lead_status]) {
        groupedData[item.lead_status] = Array(12).fill(0); // initialize array with 12 zeros for each month
      }
      groupedData[item.lead_status][item.month - 1] = item.count;
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
    setSelectLeadsType([]);
    setRequiredPlan("");
    setRequiredType("");
    setGenerateReportData(false);
    setButtonDisable(false);
    setStartDate("");
    setEndDate("");
  }

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
  
    //   pdf.save("Leads Management Report.pdf");
    // }


    async function convertToImg() {
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate how many rows fit per page
      const rowsPerPage = 15;
      const totalPages = Math.ceil(leadsTable.length / rowsPerPage);
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        // Add header to each page
        pdf.addImage(logo, 'PNG', pdfWidth - 80, 5, 70, 15);
        pdf.setFontSize(20);
        pdf.text("Leads Management Report", 14, 20);
        
        // Add date range
        // pdf.setFontSize(12);
        // const dateRange = `${startDate ? moment(startDate).format("MMMM YYYY") : ""} - ${endDate ? moment(endDate).format("MMMM YYYY") : ""}`;
        // pdf.text(dateRange, pdfWidth - 14, 30, { align: 'right' });
        
        // Create HTML for current page's rows
        const startIdx = page * rowsPerPage;
        const endIdx = Math.min(startIdx + rowsPerPage, leadsTable.length);
        const currentPageRows = leadsTable.slice(startIdx, endIdx);
        
        // Create temporary div for this page's table
        const tempDiv = document.createElement('div');
        tempDiv.style.width = "905px";
        tempDiv.style.padding = "25px";
        tempDiv.style.background = "white";
        
        // Create table HTML
        let tableHtml = `
          <table style="width:100%; border-collapse: collapse; margin-bottom: 40px;">
            <thead>
              <tr style="background-color:#f8f9fa; font-weight:bold; border:1px solid #dee2e6;">
                <th style="border:1px solid #dee2e6; padding:8px;">Source</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Lead Name</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Mobile Number</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Account Type</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Installation Address</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Status</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Assigned To</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Created At</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        currentPageRows.forEach(res => {
          tableHtml += `
            <tr style="border:1px solid #dee2e6;">
              <td style="border:1px solid #dee2e6; padding:8px;">${res?.connectionStatus || '---'}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${res?.full_name || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${res?.mobile_number || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${res?.account_type || '---'}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">
                ${res?.installation_address?.city ? `${res.installation_address.city}, ${res.installation_address.state}` : '---'}
              </td>
              <td style="border:1px solid #dee2e6; padding:8px;">${res?.lead_status || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${res?.assignee_name || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${res?.createdAt ? moment(res.createdAt).format("DD-MM-YYYY") : ''}</td>
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
      
      pdf.save("Leads Management Report.pdf");
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
              <h3>Leads Management Report</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>

            <table className="table table-bordered">
              <thead className="border">
                <tr className="table-heading-size">
                <th>Source</th>
                  <th>Lead Name</th>
                  <th>Mobile Number</th>
                  <th>Account Type</th>
                  <th>Installation Address</th>
                  <th className="pl-3">Status</th>
                  <th>Assigned To</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody className="border">
              {leadsTable.map((res, issueIndex) => (
                  <tr key={issueIndex}>
                    <td>{res?.connectionStatus ? res?.connectionStatus : "---"}</td>
                    <td className="text-capitalize">{res?.full_name}</td>
                    <td>{res?.mobile_number}</td>
                    <td>{res?.account_type ? res?.account_type : "---"}</td>
                    <td>
                      {" "}
                      {res?.installation_address?.city
                        ? `${res.installation_address.city}, ${res.installation_address.state}`
                        : "---"}
                    </td>
                    <td>{res?.lead_status}</td>
                    <td>{res?.assignee_name}</td>
                    <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
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
            <label>Leads Type</label>
            <RSelect
              options={leadsType}
              placeholder="Select Role"
              value={selectLeadsType}
              onChange={selectedOptions => {
                setSelectLeadsType(selectedOptions);
                setRequiredType();
                setButtonDisable(false);
              }}
              isMulti
            />
            {valid && requiredType === "" && <p className="text-danger">Please Select Leads Type</p>}
          </div>
        </div>
        <div className="form_heading fw-600 f-18 mt-5">Data Range</div>
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
              <input
                type="date"
                className="form-control"
                onChange={e => {
                  setStartDate(e.target.value);
                  setButtonDisable(false);
                }}
              />
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
                onChange={(date) => {
                  setEndDate(date);
                  setButtonDisable(false)
                  
                }}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="form-control"
                placeholderText="Select Date"
              /> */}
              {/* <DatePicker
                selected={endDate}
                onChange={date => {
                  // Set the end date to the last day of the selected month
                  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                  setEndDate(lastDayOfMonth);
                  setButtonDisable(false);
                }}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="form-control"
                placeholderText="Select Date"
              /> */}

              <input
                type="date"
                className="form-control"
                onChange={e => {
                  // Set the end date to the last day of the selected month

                  setEndDate(e.target.value);
                  setButtonDisable(false);
                }}
              />
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
              type="button"
              onClick={() => {
                resetData();
              }}
            >
              Reset
            </button>
            <button
              className="btn btn-primary ml-3"
              disabled={buttonDisable}
              onClick={() => {
                if (requiredType === "") {
                  setValid(true);
                } else {
                  setValid(false);
                  generateReportFunction();
                }
              }}
            >
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
                    options={Object.keys(selectYearData).map(es => {
                      return { value: es, label: es };
                    })}
                    onChange={e => {
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
                  <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                    Export
                    <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <ExportCsv exportData={exportData} filName={"Leads Management Report"} />
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
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Source</th>
                      <th>Lead Name</th>
                      <th>Mobile Number</th>
                      <th>Account Type</th>
                      <th>Installation Address</th>
                      <th className="pl-3">Status</th>
                      <th>Assigned To</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {leadsTable.map((res, issueIndex) => (
                      <tr key={issueIndex}>
                        <td>{res?.connectionStatus ? res?.connectionStatus : "---"}</td>
                        <td className="text-capitalize">{res?.full_name}</td>
                        <td>{res?.mobile_number}</td>
                        <td>{res?.account_type ? res?.account_type : "---"}</td>
                        <td>
                          {" "}
                          {res?.installation_address?.city
                            ? `${res.installation_address.city}, ${res.installation_address.state}`
                            : "---"}
                        </td>
                        <td>{res?.lead_status}</td>
                        <td>{res?.assignee_name}</td>
                        <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
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
