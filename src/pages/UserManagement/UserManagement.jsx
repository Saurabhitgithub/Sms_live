import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import { CiExport, CiFilter } from "react-icons/ci";
import DropDown from "../../components/commonComponent/dropDown/Dropdown";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Modal, Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import AddUser from "./AddUser";
import { FiEdit } from "react-icons/fi";
import Dropdown from "../../components/commonComponent/dropDown/Dropdown";
import { useHistory, useLocation } from "react-router-dom";

import { RiDeleteBinLine } from "react-icons/ri";
import { BorderedTable } from "../../components/commonComponent/Bordertable/BorderedTable";
import DeleteModal from "../../components/commonComponent/Deletemodel/Deletemodel";
import style from "./UserManagement.module.css";
import {
  deleteUser,
  getAllRole,
  getAlluser,
  getAllUserbyIspId,
  getFilterUser,
  updateMemberStatus,
} from "../../service/admin";
import moment from "moment";
import ToastNotification from "../../components/commonComponent/store/ToastNotification";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";

import { Input, TabContent } from "reactstrap";
import { Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PaginationComponent from "../../components/pagination/Pagination";
import { paginateData } from "../../utils/Utils";
import Loader from "../../components/commonComponent/loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { success } from "../../Store/Slices/SnackbarSlice";
import { permisionsTab, userInfo } from "../../assets/userLoginInfo";
import Error403 from "../../components/error/error403";

export default function UserManagement() {
  const [userPermission, setUserPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);

  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [Idpass, setIdpass] = useState("");
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const overlayRef = useRef(null);
  const toggle = () => setModal(!modal);
  const location = useLocation();
  const [planData, setPlanData] = useState([]);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const dispatch = useDispatch();
  const [allPlan, setAllPlan] = useState([]);

  let history = useHistory();
  const [toast, setToast] = useState({
    mgs: "",
    header: "",
    icon: "",
    show: false,
  });
  const [roles, setRoles] = useState([]);
  async function permissionFunction() {
    const res = await permisionsTab();
    

    const permissions = res.filter((s) => s.tab_name === "User Management");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
      setUserPermission(permissionArr);
    }
  }

  const getRoleData = async () => {
    try {
      let res = await getAllRole();
      
      let roleData = res.data.data.map((e) => {
        return {
          value: e.role,
          label: e.role,
        };
      });
      setRoles(roleData);
    } catch (err) {
      console.log(err);
    }
  };
  function onClose() {
    setToast({
      mgs: "",
      header: "",
      icon: "",
      show: false,
    });
  }
  async function handleStatus(id) {
    let userData = userInfo();
    let payload = {
      user_name: userData?.name,
      user_role: userData?.role,
      user_id: userData?._id,
    };
    try {
      setLoader(true);
      await updateMemberStatus(id, payload);
      await getAllUserData();
    } catch (err) {
      console.log(err.message);
      setLoader(false);
    } finally {
      setLoader(false);
      dispatch(
        success({
          show: true,
          msg: "User status changed",
          severity: "success",
        })
      );
    }
  }

  function createclick() {
    history.push("/adduser");
  }

  function handeledit(planId) {
    history.push(`./edituser/${planId}`);
  }

  const handleDelete = (id) => {
    setIdpass(id);
    toggle();
  };

  const [userData, setUserData] = useState([]);
  const [userAllData, setUserAllData] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (overlayVisible) {
        // setOverlayVisible(false);
      }
    };

    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setOverlayVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [overlayVisible]);

  const filterToggle = (e) => {
    // e.stoppropagation()
    
    setOverlayVisible(!overlayVisible);
    // overlayRef.current.hide()
  };

  const getAllUserData = async () => {
    try {
      let Payload;
      if (userInfo().role === "isp admin" || userInfo().role === "admin") {
        Payload = {
          org_id: userInfo()._id,
        };
      } else {
        Payload = {
          org_id: userInfo().org_id,
          isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
        };
      }
      const res = await getAllUserbyIspId(Payload);
      let userInfolist = res.data.data.reverse();
      await permissionFunction();
      setUserData(userInfolist);
      setUserAllData(userInfolist);
      setAllPlan(userInfolist);

      const data = paginateData(page, itemPerPage, userInfolist);

      setUserData(data);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    } finally {
      setSkeletonLoading(false);
    }
  };
  const handleSearchClick = (e) => {
    let val = e?.trim()?.toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, userAllData);
      setAllPlan(userAllData);
      setUserData(ddd);
    } else {
      if (Array.isArray(userAllData)) {
        let searchName = userAllData.filter((res) => {
          if (
            res?.name?.toLowerCase().includes(val) ||
            res?.role?.toLowerCase().includes(val) ||
            res?.email?.toLowerCase().includes(val) ||
            res?.phone_number?.toLowerCase().includes(val) ||
            res?.createdAt?.toLowerCase().includes(val)
            // res?.status?.toLowerCase().includes(val)
          ) {
            return true;
          } else {
            return false;
          }
        });
        let ddd = paginateData(page, itemPerPage, searchName);
        setAllPlan(searchName);
        setUserData(ddd);
      } else {
      }
    }
  };
  const deleteUserData = async () => {
    try {
      const res = await deleteUser(Idpass);
      dispatch(
        success({
          show: true,
          msg: "User Deleted Successfully",
          severity: "error",
        })
      );
      getAllUserData();
      toggle();
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
          let aa = roleFilter.filter((e) => e !== "all");
          fill = [...aa, roleValue.toLowerCase()];
        } else {
          fill = fill.filter((e) => e !== "all");
          fill = [roleValue.toLowerCase()];
        }
      }
    } else {
      fill = fill.filter((e) => e !== roleValue.toLowerCase());
    }
    if (fill.length === 0) {
      fill = ["all"];
    }
    setRoleFilter(fill);

    let fillData;
    if (roleValue === "All" || fill.includes("all")) {
      fillData = userAllData;
    } else {
      fillData = userAllData.filter((e) => fill.includes(e.role.toLowerCase()));
    }
    let ddd = paginateData(page, itemPerPage, fillData);
    setAllPlan(fillData);
    setUserData(ddd);
  };

  useEffect(() => {
    getAllUserData();
    getRoleData();
    if (location?.state === "add") {
      dispatch(
        success({
          show: true,
          msg: "User Added Successfully",
          severity: "success",
        })
      );
    }
    if (location?.state === "edit") {
      dispatch(
        success({
          show: true,
          msg: "User Updated Successfully",
          severity: "info",
        })
      );
    }
  }, []);

  const [rowmodal, setrowModal] = useState({ status: false, fullData: {} });

  const rowtoggle = (data) => {
    if (userPermission.includes("View User")) {
      setrowModal({ status: !rowmodal.status, fullData: data });
    }
  };

  const [activeTab, setActiveTab] = useState("1");

  const handleInput = (event) => {
    const { name, value } = event;

    setFormData({ ...formData, [name]: value });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    member_id: "",
    phone_number: "",
    personal_address: {
      address: "",
      state: "",
      city: "",
      pin_code: 0,
    },
    office_address: {
      address: "",
      state: "",
      city: "",
      pin_code: 0,
    },
    isp_id: "664645a80522c3d5bc318cd2",
  });

  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, userAllData);
    setUserData(ddd);
  }, [page]);

  return (
    <>
      <Content>
        {loader ? <Loader /> : ""}
        <ToastNotification
          msg={toast.mgs}
          icon={toast.icon}
          header={toast.header}
          show={toast.show}
          onClose={onClose}
        />
        {permissionAccess ? (
          <>
            {" "}
            <div className="card_container p-md-4 p-sm-3 p-3 user_section">
              <div className="topContainer ">
                <div className="head_min">User Management</div>
                <div className={`d-flex align-items-center justify-content-start`}>
                  <div className={style.filterbtn}>
                    <div className={`btn border`} onClick={() => filterToggle()}>
                      <span> Filter</span>
                      <CiFilter style={{ fontSize: "1.5rem", color: "#0E1073" }} />
                    </div>
                    {overlayVisible && (
                      <div className={style.overlay} ref={overlayRef}>
                        <div className="d-flex align-items-center g-1 p-2">
                          <input
                            type="checkbox"
                            checked={roleFilter[0] === "all" ? true : false}
                            onChange={(e) => filterAllUserData("All", e.target.checked)}
                            className="input"
                          />
                          <span>All</span>
                        </div>
                        {roles.map((ress) => (
                          <div className="d-flex align-items-center g-1 p-2">
                            <input
                              type="checkbox"
                              checked={roleFilter.includes(ress.value)}
                              onChange={(e) => filterAllUserData(ress.value, e.target.checked)}
                              className="input"
                            />
                            <span className="text-capitalize">{ress.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="line ml-2 mr-2"></div>

                  {userPermission.includes("Add User") && (
                    <>
                      <button className="btn btn-primary" type="button" onClick={createclick}>
                        Add User
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="row mt-4 mb-5">
                <div className="col-xl-3 col-lg- col-md-4 col-sm-7 col-12 mt-2">
                  <SearchInput placeholder={"Search"} onChange={(e) => handleSearchClick(e.target.value)} />
                </div>
              </div>

              {skeletonLoading ? (
                <div className="mt-5">
                  {/* <BorderedTable> */}
                  <TableSkeleton rows={4} columns={6} />

                  {/* </BorderedTable> */}
                </div>
              ) : (
                <div className="table-container mt-5">
                  <Table hover={true} responsive>
                    <thead style={{ backgroundColor: "#F5F6FA" }}>
                      <tr className="table-heading-size">
                        <th scope="row">Name</th>
                        <th scope="row">Role</th>
                        <th scope="row">Email</th>
                        <th scope="row">Phone No.</th>
                        {/* <th scope="row">Office Address</th> */}
                        <th scope="row">Created on</th>
                        <th scope="row">Status</th>
                        {(userPermission.includes("Edit User") || userPermission.includes("Delete User")) && (
                          <>
                            <th scope="row">Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {userData?.map((response) => (
                        <tr key={response.member_id}>
                          <td
                            className={`text-nowrap text-capitalize ${
                              userPermission.includes("View User") ? "pointer" : ""
                            }`}
                            onClick={() => rowtoggle(response)}
                          >
                            {response.name}
                          </td>
                          <td className="text-capitalize">{response.role}</td>
                          <td className="text-nowrap">{response.email}</td>
                          <td className="text-nowrap">{response.phone_number}</td>

                          <td className="text-nowrap">{moment(response.createdAt).format("DD-MM-YYYY")}</td>
                          <td>
                            <div
                              className={` pointer ${response.status === "Active" ? "statusActive" : "statusExpire"}`}
                              onClick={() => handleStatus(response?._id)}
                            >
                              {response.status}
                            </div>
                          </td>
                          {(userPermission.includes("Edit User") || userPermission.includes("Delete User")) && (
                            <>
                              <td>
                                <div className="d-flex wrap-nowrap" style={{ width: "100px" }}>
                                  {userPermission.includes("Edit User") && (
                                    <>
                                      <FiEdit
                                        style={{ fontSize: "1.3rem", cursor: "pointer" }}
                                        color="#0E1073"
                                        onClick={() => handeledit(response._id)}
                                        className="parimary-color"
                                      />
                                    </>
                                  )}
                                  {userPermission.includes("Delete User") && (
                                    <>
                                      <RiDeleteBinLine
                                        style={{ fontSize: "1.4rem", marginLeft: "1.5rem" }}
                                        onClick={() => handleDelete(response._id)}
                                        color="#0E1073"
                                        className="pointer parimary-color"
                                      />
                                    </>
                                  )}
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              <div class="d-flex justify-content-center mt-3">
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
            <DeleteModal isOpen={modal} toggle={toggle} user="user" onConfirm={deleteUserData} />
            <Modal isOpen={rowmodal.status} toggle={rowtoggle} size="lg">
              <ModalHeader toggle={rowtoggle}>
                <div className={`${style.header_but} w-100`}>
                  <div className="flex ">
                    <span className={style.top_hed}>View Details</span>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                <div>
                  <div className={`${style.min_header} `}>
                    <div className={`${style.se_header} `}>
                      <div className={`mt-1 ${style.name_head}`}>{rowmodal?.fullData?.name}</div>
                      <div className={`${style.sec_head}`}>
                        Role: {rowmodal?.fullData?.role} | ID: {rowmodal?.fullData?.member_id}
                      </div>
                      <div className={`${style.th_head}`}>
                        Created on: {moment(rowmodal?.fullData?.createdAt).format("DD/MM/YYYY")} | Last Login:
                        {rowmodal?.fullData?.last_login
                          ? moment(rowmodal?.fullData?.last_login).format("DD/MM/YYYY")
                          : "--/--/----"}
                      </div>
                    </div>
                    <div className={`${style.button_hd}`}>
                      <div className={`${style.viewActive}`}>{rowmodal?.fullData?.status}</div>
                    </div>
                  </div>

                  <TabContent activeTab={activeTab}>
                    <div>
                      <div className="mt-4 h5_delete">Personal Details</div>
                      <hr className="mt-0"></hr>
                      <div class="row mt-4" style={{ rowGap: "3px" }}>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>Name</div>

                          <div className={style.boxxBackground} id={style.boxxBackgroundID}>
                            <span className={style.labelss} data-full-email={rowmodal?.fullData?.name}>
                              {rowmodal?.fullData?.name}
                            </span>
                          </div>
                        </div>

                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>Email Id</div>
                          <div className={style.boxxBackground} id={style.boxxBackgroundID}>
                            <span className={style.labelss} data-full-email={rowmodal?.fullData?.email}>
                              {rowmodal?.fullData?.email}
                            </span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>Phone Number</div>
                          <div className={style.boxxBackground} id={style.boxxBackgroundID}>
                            <span className={style.labelss} data-full-email={rowmodal?.fullData?.phone_number}>
                              {`+91 ${rowmodal?.fullData?.phone_number}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mt-4 h5_delete">Address</div>
                      <hr className="mt-0"></hr>

                      <div class="row mt-4" style={{ rowGap: "3px" }}>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>Address</div>

                          <div className={style.boxxBackground} id={style.boxxBackgroundAdd}>
                            <span
                              className={style.labelss}
                              data-full-address={rowmodal?.fullData?.personal_address?.address}
                            >
                              {rowmodal?.fullData?.personal_address?.address}
                            </span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>State</div>

                          <div className={style.boxxBackground}>
                            <span className={style.labelss}> {rowmodal?.fullData?.personal_address?.state}</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>City</div>

                          <div className={style.boxxBackground}>
                            <span className={style.labelss}> {rowmodal?.fullData?.personal_address?.city}</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>Pin Code</div>
                          <div className={style.boxxBackground}>
                            <span className={style.labelss}>{rowmodal?.fullData?.personal_address?.pin_code}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mt-4  h5_delete">Office Address</div>
                      <hr className="mt-0"></hr>

                      <div class="row mt-4" style={{ rowGap: "3px" }}>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>Address</div>
                          <div className={style.boxxBackground} id={style.boxxBackgroundAdd}>
                            <span
                              className={style.labelss}
                              data-full-address={rowmodal?.fullData?.office_address?.address}
                            >
                              {rowmodal?.fullData?.office_address?.address}
                            </span>
                          </div>
                          {/* <div className={style.boxxBackground}>
                            <span className={style.labelss}>{rowmodal?.fullData?.office_address?.address}</span>
                          </div> */}
                        </div>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>State</div>
                          <div className={style.boxxBackground}>
                            <span className={style.labelss}> {rowmodal?.fullData?.office_address?.state}</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>City</div>
                          <div className={style.boxxBackground}>
                            <span className={style.labelss}> {rowmodal?.fullData?.office_address?.city}</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div className={`${style.input_txt}`}>Pin Code</div>

                          <div className={style.boxxBackground}>
                            <span className={style.labelss}> {rowmodal?.fullData?.office_address?.pin_code}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {rowmodal?.fullData?.attributes && rowmodal?.fullData?.attributes.length !== 0 && (
                        <>
                          <div className="mt-4  h5_delete">Other Details</div>
                        </>
                      )}

                      <div class="row mt-4" style={{ rowGap: "3px" }}>
                        {rowmodal?.fullData?.attributes?.map((responseAttr) => (
                          <div class="col-6 col-md-4">
                            <div className={`${style.input_txt}`}>{responseAttr?.field_name}</div>
                            <div className={style.boxxBackground}>
                              <span className={style.labelss}>{responseAttr?.field_value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabContent>
                </div>
              </ModalBody>
            </Modal>
          </>
        ) : (
          <>
            <Error403 />
          </>
        )}
      </Content>
    </>
  );
}
