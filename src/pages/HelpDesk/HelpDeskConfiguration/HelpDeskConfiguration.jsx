import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { useDispatch } from "react-redux";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";
import { RiDeleteBin6Line } from "react-icons/ri";
import CreateNew from "./CreateNew";
import Loader from "../../../components/commonComponent/loader/Loader";
import {
  addUpdateHelpDeskConfigurationItem,
  deleteHelpDeskConfigurationItem,
  getAllHelpDeskConfigurationData,
  addIssueType,
  getIssueTypeByCreatorId,
  DeleteDataIssueType,
  getAllIssueType
} from "../../../service/admin";
import DeleteModal from "../../../components/commonComponent/Deletemodel/Deletemodel";
import { error, success } from "../../../Store/Slices/SnackbarSlice";
import { permisionsTab, userId, userInfo } from "../../../assets/userLoginInfo";
import Error403 from "../../../components/error/error403";

export default function HelpDeskConfiguration() {
  const dispatch = useDispatch();
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openModal, setOpen] = useState(false);
  const [itemId, setItemId] = useState("");
  const [deleteModal, setdeleteModal] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    role: "",
    issue_type: ""
  });

  const [modalIssue, setModalIssue] = useState(false);
  const [addIssueTypes, setIssueTypes] = useState("");
  const [getAllissueType, setGetAllIssueType] = useState([]);
  const [DeleteId, setDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [existData, setExistData] = useState("");
  const [existData1, setExistData1] = useState([]);
  const [getAllIssues, setGetAllIssues] = useState([]);

  const getAllDataIssue = async () => {
    setLoader(true);
    await getAllIssueType()
      .then(res => {
        let dataReverse = [...res.data.data];
        let reverData = dataReverse.reverse();
        setGetAllIssues(reverData);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const toggel = () => setModalIssue(!modalIssue);

  async function getAllData() {
    setSkeletonLoading(true);
    try {
      let res = await getAllHelpDeskConfigurationData();
      let data = res?.data?.data?.reverse();
      if (data?.length == 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }
      setData(data);
      setExistData1(data.map(e => e.issue_type));

      permissionFunction();
    } catch (err) {
      console.log(err);
    } finally {
    }
  }

  useEffect(() => {
    getAllData();
    getAllFunction();
    getAllDataIssue();
  }, []);

  async function submitData() {
    // e.preventDefault();
    setLoader(true);
    try {
      let payload = { ...formData, user_role: userInfo().role, user_name: userInfo().name, user_id: userId() };
      await addUpdateHelpDeskConfigurationItem(payload);
      dispatch(
        success({
          show: true,
          msg: "Configuration added successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        error({
          show: true,
          msg: "There are some error occupied",
          severity: "error"
        })
      );
      return;
    } finally {
      setLoader(false);
      setOpen(false);
      setFormData({
        role: "",
        issue_type: ""
      });
      getAllData();
    }
  }

  async function deleteData() {
    setLoader(true);
    let payloadData = {
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId()
    };
    try {
      await deleteHelpDeskConfigurationItem(itemId, payloadData);
      dispatch(
        success({
          show: true,
          msg: "Configuration Deleted successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        error({
          show: true,
          msg: "There are some error occupied",
          severity: "error"
        })
      );
      return;
    } finally {
      setdeleteModal(false);
      setLoader(false);
      setItemId("");
      await getAllData();
    }
  }
  const [helpPermission, setHelpPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();

    const permissions = res.filter(s => s.tab_name === "Help Desk");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setHelpPermission(permissionArr);
    }
    setSkeletonLoading(false);
  }

  const addIssueTypeFunction = async e => {
    setLoader(true);
    let payloadData = {
      issue_type: addIssueTypes,
      user_role: userInfo().role,
      user_id: userId(),
      user_name: userInfo().name
    };
    await addIssueType(payloadData)
      .then(res => {
        setLoader(false);
        getAllFunction();
        setIssueTypes("");
        getAllDataIssue();
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const getAllFunction = async () => {
    setLoader(true);
    await getIssueTypeByCreatorId()
      .then(res => {
        let dataReverse = [...res.data.data];
        let reverData = dataReverse.reverse();
        setExistData(reverData.map(e => e.issue_type));

        setGetAllIssueType(reverData);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const deleteIssue = async () => {
    setLoader(true);
    let PayloadData = {
      id: DeleteId._id,
      user_role: userInfo().role,
      user_id: userId(),
      user_name: userInfo().name
    };
    await DeleteDataIssueType(PayloadData)
      .then(res => {
        setOpenDelete(false);
        setLoader(false);
        getAllFunction();
        getAllDataIssue();
      })
      .catch(err => {
        console.log(err);
        setOpenDelete(false);
        setLoader(false);
      });
  };
  return (
    <>
      <Modal size="lg" isOpen={modalIssue}>
        <ModalHeader toggle={toggel}>Add Issue Type</ModalHeader>
        <ModalBody>
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                {
                  existData.includes(addIssueTypes) ? <></> : addIssueTypeFunction();
                }
              }}
            >
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Issue Type</label>
                  <input
                    className="form-control"
                    placeholder="Enter Issue Type"
                    value={addIssueTypes}
                    onChange={e => {
                      setIssueTypes(e.target.value);
                    }}
                    required
                  />
                  {existData.includes(addIssueTypes) && (
                    <>
                      <p className="text-danger">This issue type already exist</p>
                    </>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-primary f-16" type="submit">
                  Add Issue Type
                </button>
              </div>
            </form>
            <div className="mt-4">
              <table className="table table-bordered">
                <thead>
                  <tr className="table-heading-size">
                    <th>Issue Type</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllissueType.map(res => {
                    return (
                      <tr>
                        <td>{res.issue_type}</td>
                        <td>
                          <RiDeleteBin6Line
                            className="pointer parimary-color"
                            onClick={() => {
                              if (data.find(es => es.issue_type === res.issue_type)) {
                                dispatch(
                                  error({
                                    show: true,
                                    msg: "Remove the assigned role before deleting.",
                                    severity: "error"
                                  })
                                );
                              } else {
                                setOpenDelete(true);
                                setDeleteId(res);
                              }
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Delete Modal */}

      <Modal size="md" isOpen={openDelete}>
        <ModalBody>
          <div>Are you sure you want to delete this Issue Type?</div>
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex">
              <button
                className="btn text-primary"
                type="button"
                onClick={() => {
                  setOpenDelete(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  deleteIssue();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* delete Modal */}
      <Content>
        <DeleteModal
          isOpen={deleteModal}
          toggle={() => setdeleteModal(!deleteModal)}
          user="Item"
          onConfirm={deleteData}
        />
        <CreateNew
          open={openModal}
          setOpen={setOpen}
          setLoader={setLoader}
          submitData={submitData}
          formData={formData}
          setFormData={setFormData}
          data={data}
          existData1={existData1}
          getAllIssues={getAllIssues}
        />
        {loader && <Loader />}
        {skeletonLoading ? (
          <>
            <div className="mt-5">
              <TableSkeleton rows={4} columns={3} />
            </div>
          </>
        ) : (
          <>
            {permissionAccess && helpPermission.includes("Help Desk Configuration Tab") ? (
              <>
                <div className="card_container p-md-4 p-sm-3 p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="f-28">Help Desk</div>
                    <div className="d-flex">
                      <button
                        className="btn btn-primary f-16 mr-3"
                        onClick={() => {
                          setModalIssue(true);
                        }}
                      >
                        Add Issue Type
                      </button>
                      {true && (
                        <div className="d-flex justify-content-end">
                          {helpPermission.includes("New Help Desk Configuration") && (
                            <>
                              <button className="btn btn-primary f-16" onClick={() => setOpen(true)}>
                                Create New
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="table-container mt-5">
                    <Table hover>
                      <thead style={{ backgroundColor: "#F5F6FA" }}>
                        <tr className="table-heading-size">
                          <th>Issue Type</th>
                          <th>Admin Role</th>
                          {helpPermission.includes("Delete Help Desk Configuration") && (
                            <>
                              <th style={{ width: "10%" }}>Actions</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      {noData ? (
                        ""
                      ) : (
                        <tbody>
                          {console.log(data)}
                          {data?.map((res, index) => (
                            <tr key={index}>
                              <td className="text-capitalize">{res?.issue_type}</td>
                              <td className="text-capitalize">{res?.role}</td>
                              {helpPermission.includes("Delete Help Desk Configuration") && (
                                <>
                                  <td className="">
                                    <RiDeleteBin6Line
                                      className="pointer parimary-color"
                                      onClick={() => {
                                        setdeleteModal(!deleteModal);
                                        setItemId(res?._id);
                                      }}
                                    />
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </Table>
                  </div>
                  {noData ? <div className="w-100 text-center text-secondary fw-600">No Data Added</div> : ""}
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
    </>
  );
}
