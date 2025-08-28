import React, { useRef, useState } from "react";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { Col, RSelect } from "../../components/Component";
import { UserManagementReportChart } from "./UserReportChart";
import { UserbarChartStacked } from "./UserReportChartData";
import DatePicker from "react-datepicker";
import { FaAngleDown, FaAngleUp, FaCalendarAlt } from "react-icons/fa";
import { getUserReport, getRoleUserData } from "../../service/admin";
import moment from "moment";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import Loader from "../../components/commonComponent/loader/Loader";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import jsPDF from "jspdf";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import * as htmlToImage from "html-to-image";
const UserManagementReports = ({ management }) => {
  const overlayRef = useRef(null);

  let roleData = [
    { value: "isp admin", label: "ISP Admin" },
    // { value: "admin", label: "Admin" },
    { value: "franchisee", label: "Franchisee" },

  ];

  const [selectUserRoleData, setSelectUserRoleData] = useState([]);
  const [tableDataInfromation, setTableDataInfromation] = useState();

  const [selectUserRole, setSelectUserRole] = useState([]);
  const [selectUserList, setSelectUserList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userRole, setUserRole] = useState();
  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [genarateReportData, setGenerateReportData] = useState(false);
  const [cutDataset, setCutDataSet] = useState({});
  const [selectCut, setSelectCut] = useState("");
  const [roleRequired, setRoleRequired] = useState("");
  const [userRequired, setUserRequired] = useState("");
  const [valid, setValid] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false)

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);
  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };
  const selectRoleFunction = async (roleData1) => {
    if (roleData1 === "") {
      setValid(true);
    } else {
      setLoader(true);
      let payloadData = {
        role: roleData1,
      };
      await getRoleUserData(payloadData)
        .then((res) => {
          let responseData = res.data.data;
          responseData?.push({ name: "All", _id: "all" });

          setSelectUserRole(responseData?.reverse());
          setUserRole(roleData1);
          setSelectUserList([]); // Clear the user list
          setLoader(false);
          setValid(false);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });
    }
  };

  const generateReportFunction = async () => {
    setLoader(true);
    let payloadData = {
      role: userRole,
      users: selectUserList.map((eee) => eee.value),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
    await getUserReport(payloadData)
      .then((res) => {


        let reverseData = [...res.data.data];
        let dataReverse = reverseData.reverse();
        let cutData = distributeArray(dataReverse, 10);
        let tableInfo = {
          createUser: [],
          updateUser: [],
          deleteUser: []
        }
        dataReverse.forEach(es => {
          tableInfo.createUser = [...tableInfo.createUser, ...es.userCreate];
          tableInfo.updateUser = [...tableInfo.updateUser, ...es.userModify];
          tableInfo.deleteUser = [...tableInfo.deleteUser, ...es.userDelete];

        })
        setTableDataInfromation(tableInfo);
        setExportData(formatCsvData(tableInfo))
        setCutDataSet(cutData);
        datacutall(cutData[Object.keys(cutData)[0]]);
        setSelectCut(Object.keys(cutData)[0]);
        // setRoleRequired("");
        // setUserRequired("");
        setLoader(false);
        setButtonDisable(true)
      })
      .catch((res) => {

        setLoader(false);
      });
    setGenerateReportData(true);
  };

  function distributeArray(arr, chunkSize) {
    let result = {};
    for (let i = 0; i < arr.length; i += chunkSize) {
      let chunk = arr.slice(i, i + chunkSize);
      let start = i + 1;
      let end = i + chunkSize > arr.length ? arr.length : i + chunkSize;
      result[`${start}-${end}`] = chunk;
    }
    return result;
  }
  function formatCsvData(userData) {
    let csvData = [];

    // Account Creation
    userData.createUser.forEach(user => {
      csvData.push({
        "Member Id": user.member_id,
        "Name": user.name,
        "Role": user.role,
        "Email": user.email,
        "Phone Number": user.phone_number,
        "Last Action": moment(user?.updateAt).format("DD/MM/YYYY"),
        "Action": "Account Creation"
      });
    });

    // Account Modification
    userData.updateUser.forEach(user => {
      csvData.push({
        "Member Id": user.member_id,
        "Name": user.name,
        "Role": user.role,
        "Email": user.email,
        "Phone Number": user.phone_number,
        "Last Action": moment(user?.updateAt).format("DD/MM/YYYY"),
        "Action": "Account Modification"

      });
    });

    // Account Deletion
    userData.deleteUser.forEach(user => {
      csvData.push({
        "Member Id": user.member_id,
        "Name": user.name,
        "Role": user.role,
        "Email": user.email,
        "Phone Number": user.phone_number,
        "Last Action": moment(user?.updateAt).format("DD/MM/YYYY"),
        "Action": "Account Deletion"

      });
    });

    return csvData;
  }
  function datacutall(dataReverse) {
    setTableData(dataReverse);

    let response = dataReverse;
    let respossGraph = {
      labels: response?.map((e) => e.name),
      stacked: true,
      dataUnit: "USD",
      datasets: [
        {
          label: "Account Creation",
          backgroundColor: "#3760F0",
          data: response?.map((e) => e.createUser),
        },
        {
          label: "Account Modification",
          backgroundColor: "#FEC556",
          data: response?.map((e) => e.modifyUser),
        },
        {
          label: "Account Deletion",
          backgroundColor: "#F03737",
          data: response?.map((e) => e.deleteUser),
        },
      ],
    };
    setGraphData(respossGraph);
  }

  function resetuserReport() {
    setGraphData({
      labels: [],
      datasets: [
        {
          label: "Account Creation",
          backgroundColor: "#3760F0",
          data: [],
        },
        {
          label: "Account Modification",
          backgroundColor: "#FEC556",
          data: [],
        },
        {
          label: "Account Deletion",
          backgroundColor: "#F03737",
          data: [],
        },
      ],
    });
    setTableData([]);
    setSelectUserList([]);
    setSelectUserRole([]);
    setStartDate("");
    setEndDate("");
    setSelectUserRoleData([]);
    setGenerateReportData(false);
    setRoleRequired("");
    setUserRequired("");
    setButtonDisable(false)
  }

  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: "Account Creation",
        backgroundColor: "#3760F0",
        data: [],
      },
      {
        label: "Account Modification",
        backgroundColor: "#FEC556",
        data: [],
      },
      {
        label: "Account Deletion",
        backgroundColor: "#F03737",
        data: [],
      },
    ],
  });
  const inVoiceRef1 = useRef(null);

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
    
    // Constants for pagination
    const rowsPerPage = 10; // Adjust this based on your row height
    const tableTypes = ['createUser', 'updateUser', 'deleteUser'];
    
    // Add logo and title to first page
    pdf.addImage(logo, 'PNG', pdfWidth - 80, 5, 70, 15);
    pdf.setFontSize(20);
    pdf.text("User Management Report", 14, 20);
    
    let currentPage = 0;
    
    // Process each table type (Creation, Modification, Deletion)
    for (const tableType of tableTypes) {
      const data = tableDataInfromation?.[tableType] || [];
      const totalPages = Math.ceil(data.length / rowsPerPage);
      
      // Add section header
      pdf.setFontSize(16);
      pdf.text(`${tableType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`, 14, 40);
      
      // Process each page for this table type
      for (let page = 0; page < totalPages; page++) {
        if (page > 0 || (tableType !== 'createUser' && page === 0)) {
          pdf.addPage();
          pdf.addImage(logo, 'PNG', pdfWidth - 80, 5, 70, 15);
          pdf.setFontSize(20);
    pdf.text("User Management Report", 14, 20);
          currentPage++;
        }
        
        const startIdx = page * rowsPerPage;
        const endIdx = Math.min(startIdx + rowsPerPage, data.length);
        const pageData = data.slice(startIdx, endIdx);
        
        // Create temporary div for this page's table
        const tempDiv = document.createElement('div');
        tempDiv.style.width = "905px";
        tempDiv.style.padding = "25px";
        tempDiv.style.background = "white";
        
        // Create table HTML
        let tableHtml = `
          <table style="width:100%; border-collapse: collapse; ">
            <thead>
              <tr style="background-color:#f8f9fa; font-weight:bold; border:1px solid #dee2e6;">
                <th style="border:1px solid #dee2e6; padding:8px;">Member Id</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Name</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Role</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Email</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Phone Number</th>
                <th style="border:1px solid #dee2e6; padding:8px;">Last Action</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        pageData.forEach(item => {
          tableHtml += `
            <tr style="border:1px solid #dee2e6;">
              <td style="border:1px solid #dee2e6; padding:8px;">${item?.member_id || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${item?.name || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${item?.role || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${item?.email || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${item?.phone_number || ''}</td>
              <td style="border:1px solid #dee2e6; padding:8px;">${item?.updateAt ? moment(item.updateAt).format("DD-MM-YYYY") : ''}</td>
            </tr>
          `;
        });
        
        tableHtml += `</tbody></table>`;
        tempDiv.innerHTML = tableHtml;
        document.body.appendChild(tempDiv);
        
        try {
          const dataUrl = await htmlToImage.toPng(tempDiv, { quality: 0.5 });
          const imgProps = pdf.getImageProperties(dataUrl);
          const scaleFactor = Math.min(pdfWidth / imgProps.width, (pdfHeight - 60) / imgProps.height);
          const scaledWidth = imgProps.width * scaleFactor;
          const scaledHeight = imgProps.height * scaleFactor;
          
          pdf.addImage(dataUrl, 'PNG', 0, 60, scaledWidth, scaledHeight, undefined, 'FAST');
          
          // Add page number footer
          pdf.setFontSize(10);
          pdf.text(`Page ${currentPage + 1}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
          
        } catch (error) {
          console.error("Error generating PDF:", error);
        } finally {
          document.body.removeChild(tempDiv);
        }
      }
    }
    
    pdf.save("User Management Report.pdf");
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

      {/* <div style={{ width: "905px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>User Management Report</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>

            <div className="mt-2 d-flex align-items-center justify-content-center">
              <div className="f-20 fw-600">Account Creation</div>
            </div>
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="border">
                    <tr>
                      <th>Member Id</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Last Action</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {tableDataInfromation?.createUser?.map((item) => (
                      <tr>
                        <td>{item?.member_id} </td>
                        <td>{item?.name}</td>
                        <td>{item?.role}</td>
                        <td> {item?.email}</td>
                        <td> {item?.phone_number}</td>
                        <td>{moment(item?.updateAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-2 d-flex align-items-center justify-content-center">
              <div className="f-20 fw-600">Account Modification</div>
            </div>
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="border">
                    <tr>
                      <th>Member Id</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Last Action</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {tableDataInfromation?.updateUser?.map((item) => (
                      <tr>
                        <td>{item?.member_id} </td>
                        <td>{item?.name}</td>
                        <td>{item?.role}</td>
                        <td> {item?.email}</td>
                        <td> {item?.phone_number}</td>
                        <td>{moment(item?.updateAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-2 d-flex align-items-center justify-content-center">
              <div className="f-20 fw-600">Account Deletion</div>
            </div>
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="border">
                    <tr>
                      <th>Member Id</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Last Action</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {tableDataInfromation?.deleteUser?.map((item) => (
                      <tr>
                        <td>{item?.member_id} </td>
                        <td>{item?.name}</td>
                        <td>{item?.role}</td>
                        <td> {item?.email}</td>
                        <td> {item?.phone_number}</td>
                        <td>{moment(item?.updateAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div> */}
      {loader && <Loader />}
      <div className="reports_child">
        <h2 className="fw-600">{management} Reports</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (roleRequired === "" || userRequired === "") {
              setValid(true);
            } else {
              generateReportFunction(e);
              setValid(false);
            }
          }}
        >
          <div className="form_heading fw-600 f-18 mt-5">User Selection</div>
          <div className="row mt-4">
            <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
              <label>Role</label>
              <RSelect
                required
                placeholder="Select Role"
                options={roleData}
                onChange={(e) => {
                  setRoleRequired(e.value);
                  selectRoleFunction(e.value);
                  setUserRequired("")
                  setButtonDisable(false)
                }}
              />
              {valid && roleRequired === "" && (
                <p className="text-danger">Please Select Role</p>
              )}
            </div>

            <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-3">
              <label>User</label>
              <RSelect
                placeholder="Select User"
                options={selectUserRole?.map((e) => {
                  return { value: e._id, label: e.name ? e.name : e.admin_name };
                })}
                required
                value={selectUserList}
                onChange={(e) => {
                  let getAll = e.filter((s) => s.value === "all");
                  if (getAll.length !== 0) {
                    setSelectUserList(
                      selectUserRole
                        .filter((ess) => ess._id !== "all")
                        .map((ss) => {
                          return {
                            value: ss._id,
                            label: ss.name ? ss.name : ss.admin_name,
                          };
                        })
                    );
                  } else {
                    setSelectUserList(e);
                  }
                  setUserRequired(e.length > 0 ? "selected" : "");
                  setButtonDisable(false)
                }}
                isMulti
              />
              {valid && userRequired === "" && (
                <p className="text-danger">Please Select User</p>
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
                  onChange={(date) => { setStartDate(date); setButtonDisable(false) }}
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  className="form-control"
                  placeholderText="Select Date"
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <FaCalendarAlt style={{ cursor: "pointer" }} />
                  </span>
                </div> */}
                <input
                  type="date"
                  className="form-control"
                  onChange={e => {
                    setStartDate(e.target.value);
                    setButtonDisable(false);
                  }}
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-3">
              <label>To</label>
              <div className="input-group">
                {/* <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    setEndDate(lastDayOfMonth); setButtonDisable(false)
                  }}
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  className="form-control"
                  placeholderText="Select Date"
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <FaCalendarAlt style={{ cursor: "pointer" }} />
                  </span>
                </div> */}
                <input
                  type="date"
                  className="form-control"
                  onChange={e => {
                    // Set the end date to the last day of the selected month

                    setEndDate(e.target.value);
                    setButtonDisable(false);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-mt-end justify-content-sm-end justify-content-start mt-5">
            <div className="d-flex">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  resetuserReport();
                }}
              >
                Reset
              </button>
              <button className="btn btn-primary ml-3" type="submit" disabled={buttonDisable}>
                Generate Report
              </button>
            </div>
          </div>
        </form>
        {genarateReportData && (
          <>
            <div className="d-flex justify-content-between mt-5">
              <div className="d-flex align-items-center justify-content-between">
                <div className="f-20 fw-600 mr-2">Report</div>
                <div>
                  <SingleSelect
                    placeItem="number"
                    value={selectCut}
                    options={Object.keys(cutDataset).map((es) => {
                      return { value: es, label: es };
                    })}
                    onChange={(e) => {
                      datacutall(cutDataset[e.target.value]);
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
            <div className="mt-2 d-flex align-items-center justify-content-center">
              <div className="f-20 fw-600">Account Creation</div>
            </div>
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="border">
                    <tr>
                      <th>Member Id</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Last Action</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {tableDataInfromation?.createUser?.map((item) => (
                      <tr>
                        <td>{item?.member_id} </td>
                        <td>{item?.name}</td>
                        <td>{item?.role}</td>
                        <td> {item?.email}</td>
                        <td> {item?.phone_number}</td>
                        <td>{moment(item?.updateAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-2 d-flex align-items-center justify-content-center">
              <div className="f-20 fw-600">Account Modification</div>
            </div>
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="border">
                    <tr>
                      <th>Member Id</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Last Action</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {tableDataInfromation?.updateUser?.map((item) => (
                      <tr>
                        <td>{item?.member_id} </td>
                        <td>{item?.name}</td>
                        <td>{item?.role}</td>
                        <td> {item?.email}</td>
                        <td> {item?.phone_number}</td>
                        <td>{moment(item?.updateAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-2 d-flex align-items-center justify-content-center">
              <div className="f-20 fw-600">Account Deletion</div>
            </div>
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="border">
                    <tr>
                      <th>Member Id</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Last Action</th>
                    </tr>
                  </thead>
                  <tbody className="border">
                    {tableDataInfromation?.deleteUser?.map((item) => (
                      <tr>
                        <td>{item?.member_id} </td>
                        <td>{item?.name}</td>
                        <td>{item?.role}</td>
                        <td> {item?.email}</td>
                        <td> {item?.phone_number}</td>
                        <td>{moment(item?.updateAt).format("DD-MM-YYYY")}</td>
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
};

export default UserManagementReports;

const TextSlider = ({ texts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? texts.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === texts.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <button onClick={handlePrevClick} className="arrow left-arrow">
        &lt;
      </button>
      <div className="text-container f-20">
        <p>{texts[currentIndex]}</p>
      </div>
      <button onClick={handleNextClick} className="arrow right-arrow">
        &gt;
      </button>
    </div>
  );
};
