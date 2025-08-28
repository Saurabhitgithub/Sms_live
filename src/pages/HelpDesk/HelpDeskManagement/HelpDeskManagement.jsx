import React, { useEffect, useRef, useState } from "react";
import Content from "../../../layout/content/Content";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from "reactstrap";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";
import SearchInput from "../../../components/commonComponent/searchInput/SearchInput";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import CreateNewTicket from "./CreateNewTicket";
import { permisionsTab, userInfo } from "../../../assets/userLoginInfo";
import Loader from "../../../components/commonComponent/loader/Loader";
import { createTicket, getAllTickets, updateTicket } from "../../../service/admin";
import moment from "moment";
import { paginateData } from "../../../utils/Utils";
import { PaginationComponent } from "../../../components/Component";
import { exportCsv } from "../../../assets/commonFunction";
import { useDispatch } from "react-redux";
import { error, success } from "../../../Store/Slices/SnackbarSlice";
import Error403 from "../../../components/error/error403";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../../assets/images/jsTree/PdfLogo.png"
import ExportCsv from "../../../components/commonComponent/ExportButton/ExportCsv";

export default function HelpDeskManagement() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [exportedData, setExportedData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [state1, setState1] = useState("");
  const [state2, setState2] = useState("");
  let priorityOptions = ["low", "medium", "high", "urgent"];
  let statusOptions = ["new", "ongoing", "overdue", "resolved"];
  let itemPerPage = 8;
  let [page, setPage] = useState(1);
  let userId = userInfo()._id;
  
  const [formData, setFormData] = useState({
    ticket_id: "",
    already_subscriber: true,
    subscriber_id: "",
    status: "new",
    priority: "high",
    issue_type: "payment",
    desc: "",
    title: "",
    name: "",
    email: "",
    mobile_number: "",
  });
  const [helpPermission, setHelpPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  async function permissionFunction() {
    const res = await permisionsTab();

    const permissions = res.filter((s) => s.tab_name === "Help Desk");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
      setHelpPermission(permissionArr);
      
    }

    setSkeletonLoading(false);
  }
  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, fullData);
    setAllData(ddd);
  }, [page]);

  async function getAllTicketsData() {
    setSkeletonLoading(true);
   
    let payload = {
      role: userInfo()?.role,
      assignee_id: userId,
    };
    try {
      let res = await getAllTickets(payload);
      let data = res?.data?.data?.reverse();
      if (data.length == 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }
      setFullData(data);
      let ddd = paginateData(page, itemPerPage, data);
      setAllData(ddd);
      let dataForExport = data?.map((res) => {
        return {
          ticket_id: res?.ticket_id,
          source: res?.issue_from_website ? "Website" : "Offline",
          user_type: res?.already_subscriber ? "Already a subscriber" : "Not a subscriber",
          title: res?.title,
          name: res?.name,
          mobile_number: res?.mobile_number,
          email: res?.email,
          description: res?.desc,
          status: res?.status,
          priority: res?.priority,
          assignee_name: res?.assignee_name,
          createdAt: moment(res?.createdAt).format("DD MMM YYYY"),
        };
      });
      setExportedData(dataForExport);
      await permissionFunction()
    } catch (err) {
      console.log(err);
    } finally {
      // setSkeletonLoading(false);
    }
  }

  useEffect(() => {
    getAllTicketsData();
  }, []);

  function handleChange(e) {
    let { name, value } = e.target;

    if (value == " ") {
      e.target.value = "";
    } else {
      if (name == "already_subscriber") {
        setFormData((pre) => {
          return {
            ...pre,
            [name]: JSON.parse(value),
          };
        });
        setFormData((pre) => {
          return {
            ...pre,
            name: "",
            email: "",
            mobile_number: "",
            subscriber_id: "",
          };
        });
      } else {
        setFormData((pre) => {
          return {
            ...pre,
            [name]: value,
          };
        });
      }
    }
  }

  function generateTicketId() {
    const year = new Date().getFullYear();
    const staticPart = "CS";
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const milliseconds = new Date().getMilliseconds();
    return `${year}-${staticPart}${randomNumber}${milliseconds}`;
  }

  useEffect(() => {
    setFormData((pre) => {
      return {
        ...pre,
        ticket_id: generateTicketId(),
      };
    });
  }, [open]);

  function searchData(e) {
    let value = e.target.value;
    setSearchState(value);
    let arr = [...fullData];
    if (value == "") {
      let ddd = paginateData(page, itemPerPage, fullData);
      setAllData(ddd);
    } else {
      let newArr = arr?.filter(
        (res) => res?.ticket_id?.toLowerCase()?.includes(value) || res?.name?.toLowerCase()?.includes(value)
      );
      let ddd = paginateData(page, itemPerPage, newArr);
      setAllData(ddd);
    }
    setState1("");
    setState2("");
  }

  function filterData(type, value) {
    let arr = [...fullData];
    if (type == "status") {
      setState1(value);
      setState2("");
      if (value == "all") {
        let ddd = paginateData(page, itemPerPage, fullData);
        setAllData(ddd);
        let dataForExport = fullData?.map((res) => {
          return {
            ticket_id: res?.ticket_id,
            source: res?.issue_from_website ? "Website" : "Offline",
            user_type: res?.already_subscriber ? "Already a subscriber" : "Not a subscriber",
            title: res?.title,
            name: res?.name,
            mobile_number: res?.mobile_number,
            email: res?.email,
            description: res?.desc,
            status: res?.status,
            priority: res?.priority,
            assignee_name: res?.assignee_name,
            createdAt: moment(res?.createdAt).format("DD MMM YYYY"),
          };
        });
        setExportedData(dataForExport);
      } else {
        let newArr = arr?.filter((res) => res?.status == value);
        let dataForExport = newArr?.map((res) => {
          return {
            ticket_id: res?.ticket_id,
            source: res?.issue_from_website ? "Website" : "Offline",
            user_type: res?.already_subscriber ? "Already a subscriber" : "Not a subscriber",
            title: res?.title,
            name: res?.name,
            mobile_number: res?.mobile_number,
            email: res?.email,
            description: res?.desc,
            status: res?.status,
            priority: res?.priority,
            assignee_name: res?.assignee_name,
            createdAt: moment(res?.createdAt).format("DD MMM YYYY"),
          };
        });
        setExportedData(dataForExport);
        let ddd = paginateData(page, itemPerPage, newArr);
        setAllData(ddd);
      }
    } else {
      setState2(value);
      setState1("");
      if (value == "all") {
        let ddd = paginateData(page, itemPerPage, fullData);
        setAllData(ddd);
      } else {
        let newArr = arr?.filter((res) => res?.priority == value);
        let dataForExport = newArr?.map((res) => {
          return {
            ticket_id: res?.ticket_id,
            source: res?.issue_from_website ? "Website" : "Offline",
            user_type: res?.already_subscriber ? "Already a subscriber" : "Not a subscriber",
            title: res?.title,
            name: res?.name,
            mobile_number: res?.mobile_number,
            email: res?.email,
            description: res?.desc,
            status: res?.status,
            priority: res?.priority,
            assignee_name: res?.assignee_name,
            createdAt: moment(res?.createdAt).format("DD MMM YYYY"),
          };
        });
        setExportedData(dataForExport);
        let ddd = paginateData(page, itemPerPage, newArr);
        setAllData(ddd);
      }
    }
    setSearchState("");
  }

  function checkStatus(type) {
    switch (type) {
      case "new":
        return "new";
        break;
      case "ongoing":
        return "ongoing";
        break;
      case "overdue":
        return "overdue";
        break;
      case "resolved":
        return "resolved";
        break;
    }
  }

  function checkPriority(type) {
    switch (type) {
      case "high":
        return "High";
        break;
      case "medium":
        return "Medium";
        break;
      case "low":
        return "Low";
        break;
      case "urgent":
        return "Urgent";
        break;
    }
  }

  async function submitData(e) {
    e.preventDefault();
    setLoader(true);
    try {
      let payload = {};
      if (formData.already_subscriber) {
        payload = {
          ...formData,
          created_by: userId,
          issue_from_website: false,
          user_role: userInfo().role,
          user_name: userInfo().name,
        };
      } else {
        payload = {
          ...formData,
          created_by: userId,
          issue_from_website: false,
          user_role: userInfo().role,
          user_name: userInfo().name,
        };
        delete payload.subscriber_id;
      }
      await createTicket(payload);
      dispatch(
        success({
          show: true,
          msg: "New ticket added successfully",
          severity: "success",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        error({
          show: true,
          msg: "There are some error occupied",
          severity: "error",
        })
      );
    } finally {
      setLoader(false);
      setOpen(false);
      await getAllTicketsData();
    }
  }

  async function updateStatus(id, priority, index) {
    setLoader(true);

    let payload = {
      priority: priority,
      id: id,
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId,
    };
    try {
      await updateTicket(payload);
      setLoader(false);
      let arr = [...allData];
      arr[index].priority = priority;
      setAllData(arr);
      dispatch(
        success({
          show: true,
          msg: "Status change successfully",
          severity: "success",
        })
      );
    } catch (err) {
      console.log(err);
      setLoader(false);
      dispatch(
        error({
          show: true,
          msg: "There are some error occupied",
          severity: "error",
        })
      );
    } finally {
      setState1("");
      setState2("");
      let ddd = paginateData(page, itemPerPage, fullData);
      setAllData(ddd);
      setSearchState("");
    }
  }

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

    pdf.save("Help Desk.pdf");
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
      <Content>
      <div style={{ width: "2200px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Help Desk</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
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
                  <tbody>
                    {allData?.map((res, index) => (
                      <tr key={index}>
                        <td className={helpPermission.includes("View Ticket")?"pointer":""} onClick={() =>{ if(helpPermission.includes("View Ticket"))history.push(`/helpDeskManagement/view/${res._id}`)}}>
                          {res?.ticket_id}
                        </td>
                        <td>{res?.issue_from_website ? "Website" : "Offline"}</td>
                        <td className=" d-flex align-items-center text-capitalize">
                          <div className={checkStatus(res?.status)} />
                          &nbsp;{res?.status}
                        </td>
                        <td className="text-capitalize">{res?.issue_type}</td>
                        <td className="text-capitalize">{res?.name}</td>
                        <td className="" title={res?.already_subscriber ? "Already a subscriber" : "Not a subscriber"}>
                          {res?.already_subscriber ? "Already a..." : "Not a sub..."}
                        </td>
                        <td className="" title={res?.desc}>
                          {res?.desc.slice(0, 10)}
                          {res?.desc.length > 10 ? "..." : ""}
                        </td>
                        <td className="">{res?.assignee_name}</td>
                        <td className="style_change_select">
                          {helpPermission.includes("Raise Ticket") ? (
                            <>
                              {" "}
                              <select
                                className={`form-control w-75  pl-0 text-capitalize pt-0 ${checkPriority(
                                  res?.priority
                                )}`}
                                value={res?.priority}
                                onChange={(e) => updateStatus(res?._id, e.target.value, index)}
                              >
                                {priorityOptions?.map((res, index) => (
                                  <option key={index} className={`${checkPriority(res)} text-capitalize`} value={res}>
                                    {res}
                                  </option>
                                ))}
                              </select>
                            </>
                          ) : (
                            <div className={` text-capitalize`}>{res?.priority}</div>
                          )}
                        </td>
                        <td className="">{moment(res?.createdAt)?.format("DD MMM YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
            </div>
          </div>
        </div>
        {loader ? <Loader /> : ""}
        <CreateNewTicket
          open={open}
          setOpen={setOpen}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          setLoader={setLoader}
          submitData={submitData}
        />
  {skeletonLoading ? (
            <>
              <div className="mt-5">
                <TableSkeleton rows={6} columns={10} />
              </div>
            </>
          ) : (
            <>
        {permissionAccess && helpPermission.includes("Help Desk Management Tab")?(<> <div className="card_container p-md-4 p-sm-3 p-3">
          <div className="topContainer">
            <div className="f-28">Help Desk</div>
            <div className="d-flex align-items-center justify-content-start">
              {true && (
                <>
                  {helpPermission.includes("Export Ticket") && (
                    <>
                      {/* <button
                        className="btn export"
                        onClick={() => {
                          exportCsv(exportedData, "Help Desk Tickets");
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
                          <ExportCsv exportData={exportedData} filName={"Help Desk"} />
                        </DropdownItem>
                        <DropdownItem>
                          {" "}
                          <div onClick={convertToImg}>PDF</div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
                    </>
                  )}
                </>
              )}
              {true && (
                <>
                  {helpPermission.includes("Raise Ticket") && (
                    <>
                      <div className="line ml-2 mr-2"></div>
                      <button className="btn btn-primary" onClick={() => setOpen(true)}>
                        Raise Ticket
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="row justify-content-between mt-4">
            <div className="col-xl-3 col-lg- col-md-4 col-sm-7 col-12 mt-2">
              <SearchInput
                placeholder={"Enter a name here to search"}
                value={searchState}
                onChange={(e) => {
                  if (e.target.value == " ") {
                    e.target.value = "";
                  }
                  {
                    searchData(e);
                  }
                }}
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-4 col-sm-5 col-12 mt-2 d-flex">
              <select
                className="form-control text-capitalize mr-2"
                value={state1}
                onChange={(e) => filterData("status", e.target.value)}
              >
                <option value="" disabled>
                  Status
                </option>
                <option value="all">All</option>
                {statusOptions?.map((res, index) => (
                  <option className="text-capitalize" key={index} value={res}>
                    {res}
                  </option>
                ))}
              </select>
              <select
                className="form-control text-capitalize"
                value={state2}
                onChange={(e) => filterData("priority", e.target.value)}
              >
                <option value="" disabled>
                  Priority
                </option>
                <option value="all">All</option>
                {priorityOptions?.map((res, index) => (
                  <option className="text-capitalize" key={index} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>
          </div>
        
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
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
                  <tbody>
                    {allData?.map((res, index) => (
                      <tr key={index}>
                        <td className={helpPermission.includes("View Ticket")?"pointer":""} onClick={() =>{ if(helpPermission.includes("View Ticket"))history.push(`/helpDeskManagement/view/${res._id}`)}}>
                          {res?.ticket_id}
                        </td>
                        <td>{res?.issue_from_website ? "Website" : "Offline"}</td>
                        <td className=" d-flex align-items-center text-capitalize">
                          <div className={checkStatus(res?.status)} />
                          &nbsp;{res?.status}
                        </td>
                        <td className="text-capitalize">{res?.issue_type}</td>
                        <td className="text-capitalize">{res?.name}</td>
                        <td className="" title={res?.already_subscriber ? "Already a subscriber" : "Not a subscriber"}>
                          {res?.already_subscriber ? "Already a..." : "Not a sub..."}
                        </td>
                        <td className="" title={res?.desc}>
                          {res?.desc.slice(0, 10)}
                          {res?.desc.length > 10 ? "..." : ""}
                        </td>
                        <td className="">{res?.assignee_name}</td>
                        <td className="style_change_select">
                          {helpPermission.includes("Raise Ticket") ? (
                            <>
                              {" "}
                              <select
                                className={`form-control w-75  pl-0 text-capitalize pt-0 ${checkPriority(
                                  res?.priority
                                )}`}
                                value={res?.priority}
                                onChange={(e) => updateStatus(res?._id, e.target.value, index)}
                              >
                                {priorityOptions?.map((res, index) => (
                                  <option key={index} className={`${checkPriority(res)} text-capitalize`} value={res}>
                                    {res}
                                  </option>
                                ))}
                              </select>
                            </>
                          ) : (
                            <div className={` text-capitalize`}>{res?.priority}</div>
                          )}
                        </td>
                        <td className="">{moment(res?.createdAt)?.format("DD MMM YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div class="d-flex justify-content-center mt-1">
                <PaginationComponent
                  currentPage={page}
                  itemPerPage={itemPerPage}
                  paginate={(d) => {
                    setPage(d);
                  }}
                  totalItems={fullData.length}
                />
              </div>
              {noData ? <div className="w-100 text-center text-secondary fw-600">No Data Added</div> : ""}
      
        </div></>):(<><Error403/></>)}
        </>
          )}
      </Content>
    </>
  );
}
