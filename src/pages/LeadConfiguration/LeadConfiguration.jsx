import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { Table } from "reactstrap";
import { BsTrash } from "react-icons/bs";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import {
  addLeadsConfigurationData,
  getAllRole,
  getLeadsConfiguration,
  leadConfigurationDelete,
} from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { permisionsTab, userId, userInfo } from "../../assets/userLoginInfo";
import Error403 from "../../components/error/error403";

export default function LeadConfiguration() {
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

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(false);
    setSelectRole();
    setSelectLeadStatus();
  };
  const [roles, setRoles] = useState([]);
  const [selectLeadStatus, setSelectLeadStatus] = useState();
  const [selectRole, setSelectRole] = useState();
  const [loader, setLoader] = useState(false);
  const [getallConfiguration, setgetAllConfiguration] = useState([]);
  const [TableLoader, setTableLoader] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDelete = () => setDeleteModal(false);
  const [deleteData, setDeleteData] = useState();
  const [existData, setExistData] = useState("");
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
      setTableLoader(false);
    }
  }
  const deleteConfiguration = async () => {
    setLoader(true);
    let payloadsData = {
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId(),
    };
    await leadConfigurationDelete(deleteData._id, payloadsData)
      .then((res) => {
        setLoader(false);
        setDeleteModal(false);
        getallLeadsConfiguration();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  const getRoleData = async () => {
    try {
      let res = await getAllRole();

      let roleData = res.data.data.map((e) => {
        return {
          value: e.role,
          label: e.role.charAt(0).toUpperCase() + e.role.slice(1),
        };
      });
      setRoles(roleData);
    } catch (err) {
      console.log(err);
    }
  };

  const getallLeadsConfiguration = async () => {
    await getLeadsConfiguration()
      .then((res) => {
        // 
        let dataReverse = [...res.data.data];
        let reverData = dataReverse.reverse();
        setExistData(reverData.map((e) => e.status));
        setgetAllConfiguration(reverData);
        // setTableLoader(false);
      })
      .catch((err) => {
        console.log(err);
        // setTableLoader(false);
      });
    permissionFunction();
  };

  useEffect(() => {
    getRoleData();
    getallLeadsConfiguration();
  }, []);

  const addLeadsConfigurationFunction = async () => {
    setLoader(true);
    const paylodData = {
      role: selectRole,
      status: selectLeadStatus,
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId(),
    };
    await addLeadsConfigurationData(paylodData)
      .then((res) => {
        setIsOpen(false);
        setLoader(false);
        getallLeadsConfiguration();
        setSelectRole();
        setSelectLeadStatus();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };
  return (
    <Content>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal size="md" isOpen={deleteModal} toggle={toggleDelete}>
        <div className="p-4">
          <h3>Delete {deleteData?.role}</h3>
          <div className="d-flex align-items-center mt-2 h5_delete">
            Are you sure you want to delete this {deleteData?.role}?
          </div>
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex">
              <button
                type="button"
                className="cancel_btn mr-2"
                onClick={() => {
                  setDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  deleteConfiguration();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader toggle={toggle} style={{ font: "200px" }}>
          <div className="head_min">Create New Lead Configuration</div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              {
                existData.includes(selectLeadStatus) ? <>""</> : addLeadsConfigurationFunction();
              }
            }}
          >
            <div className="row">
              <div className="col-md-12">
                This page allows you to configure automatic lead assignment by selecting a lead status and assigning an
                admin role to that status.
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="fw-600 f-18">Choose Lead Status: </div>
                <label className="f-18">Select the current status of the lead in the sales process</label>
                <SingleSelect
                  className="form-control"
                  placeItem="Lead Status"
                  options={OptionLabel}
                  required
                  onChange={(e) => {
                    setSelectLeadStatus(e.target.value);
                  }}
                />
                {existData.includes(selectLeadStatus) && (
                  <>
                    <p className="text-danger">This status already exist</p>
                  </>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="fw-600 f-18">Assign Admin Role: </div>
                <label className="f-18">
                  Choose the admin role responsible for managing leads with the selected status
                </label>
                <SingleSelect
                  className="form-control"
                  placeItem="Admin Role"
                  options={roles}
                  required
                  onChange={(e) => {
                    setSelectRole(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn mr-2"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectRole();
                    setSelectLeadStatus();
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Create
                </button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
      {TableLoader ? (
        <>
          <TableSkeleton columns={8} rows={3} />
        </>
      ) : (
        <>
          {permissionAccess && leadPermission.includes("Leads Configuration Tab") ? (
            <>
              <div className="card_container p-md-4 p-sm-3 p-3">
                <div className="topContainer">
                  <div className="head_min">Leads Configuration</div>
                  <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                    {leadPermission.includes("New Leads Configuration") && (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        >
                          Create New
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="table-container mt-5">
                  <Table hover>
                    <thead style={{ backgroundColor: "#F5F6FA" }}>
                      <tr className="table-heading-size">
                        <th>Lead Status</th>
                        <th>Admin Role</th>
                        {leadPermission.includes("Delete Leads Configuration") && (
                          <>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getallConfiguration.map((res, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-capitalize">{res.status}</td>
                            <td className="text-capitalize">{res.role}</td>
                            {leadPermission.includes("Delete Leads Configuration") && (
                              <>
                                <td>
                                  <BsTrash
                                    className="f-20 pointer parimary-color"
                                    color="#0E1073"
                                    onClick={() => {
                                      setDeleteModal(true);
                                      setDeleteData(res);
                                    }}
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
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
