import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { getLeadsData, getAllLeadsData } from "../../service/admin";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { paginateData } from "../../utils/Utils";
import { PaginationComponent } from "../../components/Component";
import { exportCsv } from "../../assets/commonFunction";
import { permisionsTab, userId, userInfo } from "../../assets/userLoginInfo";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { updateLeadStatusData } from "../../service/admin";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import AddNewLead from "./AddNewLeadModal/AddNewLead";
import moment from "moment";
import { getAllAssigned, addAssignUser, leadsDeleteById } from "../../service/admin";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Error403 from "../../components/error/error403";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png"

export default function Leads() {
  const history = useHistory();
  const [allPlan, setAllPlan] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [allPlanData, setAllPlanData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLeads, setDeleteLeads] = useState("");
  const toggleDelete = () => setOpenDeleteModal(false);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  let OptionLabel = [
    { value: "prospect", label: "Prospect", color: "#0046B0" },
    { value: "contacted", label: "Contacted", color: "#50AD97" },
    { value: "not contacted", label: "Not Contacted", color: "#50AD97" },
    { value: "schedule", label: "Installation: Scheduled", color: "#AD5088" },
    { value: "re-schedule", label: "Installation: Re-Scheduled", color: "#3570A6" },
    { value: "compatible", label: "Feasibility Check: Compatible", color: "#1CA098" },
    { value: "not compatible", label: "Feasibility Check: Not Compatible", color: "#F88E12" },
    { value: "lost", label: "Lost", color: "#F06565" },
  ];
  const [manualAssigned, setManualAssigned] = useState([]);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const allLeadsData = async () => {
    let Payload;
    if (userInfo().role === "isp admin") {
      Payload = {
        org_id: userInfo()._id,
      };
    } else {
      Payload = {
        org_id: userInfo().org_id,
        // isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
      };
    }
    let payLoadData = {
      // assignee_id: userId(),
      // role: userInfo()?.role,
      role:"isp admin",

      
    };
    try {
      setLoader(true);
      permissionFunction();
      let res = await getAllLeadsData({ ...payLoadData, ...Payload });
      let ReverseData = res?.data?.data?.reverse();
      setAllPlan(ReverseData);
      setAllPlanData(ReverseData);
      const datas = paginateData(page, itemPerPage, ReverseData);
      setLeadsData(datas);
      let exportInfo = ReverseData.map((e) => {
        return {
          Source: e.connectionStatus,
          "Lead Name": e.full_name,
          "Mobile Number": e.mobile_number,
          "Account Type": e.account_type,
          "Installation Address": e.installation_address?.city + e.installation_address?.state,
          Status: e.lead_status,
          "Assigned To": e.assignee_name,
          "Created At": e.createdAt,
        };
      });
      setExportData(exportInfo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };
  const updateUserAssigned = async (leadId, assignId) => {
    setLoader(true);
    let payloadData = {
      leadId: leadId,
      assignedTo: assignId,
      user_name: userInfo().name,
      user_role: userInfo().role,
      user_id: userId(),
    };
    await addAssignUser(payloadData)
      .then((res) => {
        setLoader(false);
        allLeadsData();
      })
      .catch((err) => {
        console.log(err);
        
      });
  };

  const getAllAssingedData = async () => {
    try {
      let res = await getAllAssigned();
      setManualAssigned(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const updateLeadsData = async (id, status) => {
    let updatPayload = {
      user_name: userInfo().name,
      user_role: userInfo().role,
      user_id: userId(),
      status: status,
    };

    await updateLeadStatusData(id, updatPayload).then(async (res) => {
      await allLeadsData();
    });
  };

  const handleSearchClick = (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, allPlanData);
      setAllPlan(allPlanData);
      setLeadsData(ddd);
    } else {
      if (Array.isArray(allPlanData)) {
        const filteredData = allPlanData.filter((res) => {
          const fullname = res?.full_name?.toLowerCase() || "";
          const mobileNumber = (res?.mobile_number?.toString() || "").toLowerCase();
          const pinCode = (res?.installation_address?.pin_code?.toString() || "").toLowerCase();
          return fullname.includes(val) || mobileNumber.includes(val) || pinCode.includes(val);
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setLeadsData(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  const [leadPermission, setLeadPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();
    

    const permissions = res.filter((s) => s.tab_name === "Leads");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
      setLeadPermission(permissionArr);
    }
  }
  const deletLeadsFunction = async () => {
    setLoader(true);
    let payloadData = {
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId(),
    };
    await leadsDeleteById(deleteLeads._id, payloadData)
      .then((res) => {
        
        setLoader(false);
        allLeadsData();
        setOpenDeleteModal(false);
        dispatch(
          success({
            show: true,
            msg: "Lead deleted successfully",
            severity: "success",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanData);
    setLeadsData(ddd);
  }, [page]);

  useEffect(() => {
    allLeadsData();
    getAllAssingedData();
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
        .then(function (dataUrl) {
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
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (index === arr.length - 1) {
            // setLoader(false);
          }
        });
    }

    pdf.save("Lead Management.pdf");
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
      <div style={{ width: "1800px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>Leads Management</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>
            <Table hover>
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
              <tbody>
                {leadsData.map((res, index) => {
                  return (
                    <tr key={index}>
                      <td
                        className="pointer text-capitalize"
                        onClick={() => history.push(`/leads/viewLeads/${res._id}`)}
                      >
                        {res?.connectionStatus ? res?.connectionStatus : "---"}
                      </td>
                      <td className="text-capitalize">{res?.full_name}</td>
                      <td>{res?.mobile_number}</td>
                      <td className="text-capitalize">{res?.account_type ? res?.account_type : "---"}</td>
                      {/* <td>{res?.installation_address?.pin_code}</td> */}
                      <td className="text-capitalize">
                        {res?.installation_address?.city
                          ? `${res.installation_address.city}, ${res.installation_address.state}`
                          : "---"}
                      </td>
                      {/* <td>{res?.installation_address?.flat_number}</td> */}
                      <td>
                        {leadPermission.includes("Status") ? (
                          <>
                            {res?.lead_status === "converted" ? (
                              <div className="pl-3 text-capitalize">{res?.lead_status}</div>
                            ) : (
                              <div className="style_change_select w-75">
                                <SingleSelect
                                  placeItem={"status"}
                                  options={OptionLabel}
                                  defaultValue={res?.lead_status}
                                  onChange={(e) => {
                                    updateLeadsData(res._id, e.target.value);
                                  }}
                                  className=""
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <>{OptionLabel.find((ress) => ress.value === res?.lead_status)?.label}</>
                        )}
                      </td>


                      <td>
                        {leadPermission.includes("Assigned To") ? (
                          <>
                            {res?.lead_status === "converted" ? (
                              <div className="pl-3 text-capitalize">{res?.assignee_name}</div>
                            ) : (
                              <div className="style_change_select 75">
                                <SingleSelect
                                  placeItem=""
                                  value={res?.assigned_to}
                                  options={manualAssigned[res?.lead_status]?.map((e) => {
                                    return {
                                      value: e._id,
                                      label: e.name,
                                    };
                                  })}
                                  onChange={(e) => {
                                    updateUserAssigned(res._id, e.target.value);
                                  }}
                                />
                              </div>
                            )}
                          </>
                        ) : (<>{manualAssigned[res?.lead_status]?.find(ds => ds._id === res?.assigned_to)?.name}</>)}
                      </td>

                      <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>

                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {loader ? (
        <>
          <div className="table-container mt-5">
            <TableSkeleton columns={6} />
          </div>
        </>
      ) : (
        <>
          {permissionAccess && leadPermission.includes("Leads Management Tab") ? (
            <>
              {" "}
              <Modal size="md" isOpen={openDeleteModal}>
                <ModalBody>
                  <div>Are you sure you want to delete this lead?</div>
                  <div className="d-flex justify-content-end mt-3">
                    <div className="d-flex">
                      <button
                        type="button"
                        className="cancel_btn mr-2"
                        onClick={() => {
                          setOpenDeleteModal(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          deletLeadsFunction();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
              <AddNewLead open={openModal} setOpen={setOpenModal} allLeadsData={allLeadsData} />
              <div className="card_container p-md-4 p-sm-3 p-3">
                <div className="topContainer">
                  <div className="f-28">Lead Management</div>
                  <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                    {leadPermission.includes("Export Leads") && (
                      <>
                        {/* <div>
                          <ExportCsv exportData={exportData} filName={"Leads"} />
                        </div> */}
                        <div className="dropdown_logs ">

                          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                              Export
                              <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem>
                                <ExportCsv exportData={exportData} filName={"Leads Management"} />
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
                    <div className="line ml-2 mr-2"></div>
                    {leadPermission.includes("New Leads") && (
                      <>
                        <button className="btn btn-primary" onClick={() => setOpenModal(true)}>
                          New Lead
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-8 col-12">
                    <SearchInput placeholder={"Enter Name, Mobile No..."} onChange={handleSearchClick} />
                  </div>
                </div>

                <div className="table-container mt-5">
                  <Table hover>
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
                        {(leadPermission.includes("Edit Leads") || leadPermission.includes("Delete Leads")) && (
                          <>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {leadsData.map((res, index) => {
                        return (
                          <tr key={index}>
                            <td
                              className="pointer text-capitalize"
                              onClick={() => history.push(`/leads/viewLeads/${res._id}`)}
                            >
                              {res?.connectionStatus ? res?.connectionStatus : "---"}
                            </td>
                            <td className="pointer text-capitalize" onClick={() => history.push(`/leads/viewLeads/${res._id}`)}>{res?.full_name}</td>
                            <td className="pointer" onClick={() => history.push(`/leads/viewLeads/${res._id}`)}>{res?.mobile_number}</td>
                            <td className="pointer text-capitalize" onClick={() => history.push(`/leads/viewLeads/${res._id}`)}>{res?.account_type ? res?.account_type : "---"}</td>
                            {/* <td>{res?.installation_address?.pin_code}</td> */}
                            <td className="pointer text-capitalize" onClick={() => history.push(`/leads/viewLeads/${res._id}`)}>
                              {res?.installation_address?.city
                                ? `${res.installation_address.city}, ${res.installation_address.state}`
                                : "---"}
                            </td>
                            {/* <td>{res?.installation_address?.flat_number}</td> */}
                            <td>
                              {leadPermission.includes("Status") ? (
                                <>
                                  {res?.lead_status === "converted" ? (
                                    <div className="pl-3 text-capitalize">{res?.lead_status}</div>
                                  ) : (
                                    <div className="style_change_select w-75">
                                      <SingleSelect
                                        placeItem={"status"}
                                        options={OptionLabel}
                                        defaultValue={res?.lead_status}
                                        onChange={(e) => {
                                          updateLeadsData(res._id, e.target.value);
                                        }}
                                        className="border"
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>{OptionLabel.find((ress) => ress.value === res?.lead_status)?.label}</>
                              )}
                            </td>
                            {/* <td>{res?.engagement_level}</td> */}
                            {/* <td>
                          <SingleSelect 
                          options={EnagagementLavel}
                          placeItem={"Level"}
                          defaultValue={res?.engagement_level}
                          onChange={(e)=>{updataEngageDta(res._id,e.target.value)}}
                          />
                        </td> */}
                            {/* <td>{res?.assignee_name ? res?.assignee_name : "---"}</td> */}
                            <td>
                              {leadPermission.includes("Assigned To") ? (
                                <>
                                  {res?.lead_status === "converted" ? (
                                    <div className="pl-3 text-capitalize">{res?.assignee_name}</div>
                                  ) : (
                                    <div className="style_change_select 75">
                                      <SingleSelect
                                        placeItem=""
                                        value={res?.assigned_to}
                                        options={manualAssigned[res?.lead_status]?.map((e) => {
                                          return {
                                            value: e._id,
                                            label: e.name,
                                          };
                                        })}
                                        onChange={(e) => {
                                          updateUserAssigned(res._id, e.target.value);
                                        }}
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (<>{manualAssigned[res?.lead_status]?.find(ds => ds._id === res?.assigned_to)?.name}</>)}
                            </td>
                            {/* <td className="align-items-center">
                          {res?.lead_status === "converted" ? (
                            <>---</>
                          ) : (
                            <>
                              <button
                                className="convert_subscriber"
                                type="button"
                                onClick={() => {
                                  leadsDataConvert(res._id);
                                }}
                              >
                                Convert To Subscriber
                              </button>
                            </>
                          )}
                        </td> */}
                            <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
                            {(leadPermission.includes("Edit Leads") || leadPermission.includes("Delete Leads")) && (
                              <>
                                <td style={{ width: "5%" }}>
                                  <div className="d-flex align-items-center">
                                    {leadPermission.includes("Edit Leads") && (
                                      <>
                                        <FiEdit
                                          className="f-20 pointer parimary-color mr-2"
                                          color="#0E1073"
                                          onClick={() => history.push(`/leads/viewLeads/${res._id}`)}
                                        />
                                      </>
                                    )}
                                    {leadPermission.includes("Delete Leads") && (
                                      <>
                                        <BsTrash
                                          className="f-20 fw-500 pointer parimary-color"
                                          color="#0E1073"
                                          onClick={() => {
                                            setOpenDeleteModal(true);
                                            setDeleteLeads(res);
                                          }}
                                        />
                                      </>
                                    )}
                                  </div>
                                </td>
                              </>
                            )}
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
                    paginate={(d) => {
                      setPage(d);
                    }}
                    totalItems={allPlan.length}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {" "}
              <Error403 />
            </>
          )}
        </>
      )}
    </Content>
  );
}
