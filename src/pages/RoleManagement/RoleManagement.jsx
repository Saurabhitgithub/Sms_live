import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { BorderedTable } from "../../components/commonComponent/Bordertable/BorderedTable";
import { Modal, ModalBody, Table } from "reactstrap";
import PaginationComponent from "../../components/pagination/Pagination";
import AddRole from "./AddRole";
import { useHistory } from "react-router-dom";
import { deleteRole, getAllRole } from "../../service/admin";
import ToastNotification from "../../components/commonComponent/store/ToastNotification";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { paginateData } from "../../utils/Utils";
import { permisionsTab, userInfo } from "../../assets/userLoginInfo";
import Error403 from "../../components/error/error403";
import { BsTrash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { error, success } from "../../Store/Slices/SnackbarSlice";
export default function RoleManagement() {
  const [rolePermission, setRolePermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  const [open1, setOpen1] = useState({ status: false });

  const dispatch = useDispatch();
  const role = [
    {
      name: "Installation Engineer",
    },
    {
      name: "Network Engineer",
    },
    {
      name: "Customer Support",
    },
  ];
  const handleClick = (id) => {
    history.push(`/updateAccess/${id}`);
  };
  const [toast, setToast] = useState({
    mgs: "",
    header: "",
    icon: "",
    show: false,
  });
  const [open, setOpen] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [pageData, setPageData] = useState([]);

  const [skeletonLoading, setSkeletonLoading] = useState(true);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const getRoleData = async () => {
    try {
      let orgId;
      if ((userInfo().role = "isp admin")) {
        orgId = userInfo()._id;
      } else if ((userInfo().role = "super admin")) {
        orgId = "all";
      } else {
        orgId = userInfo().org_id;
      }
      let res = await getAllRole(orgId);
      await permissionFunction();

      setRoleData(res.data.data);
      const data = paginateData(page, itemPerPage, res.data.data);
      setPageData(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setSkeletonLoading(false);
    }
  };

  const deleteRoleData = async (ids, roleName) => {
    try {
      setSkeletonLoading(true);
      setOpen1({ status: false });
      let res = await deleteRole(ids);
      dispatch(
        success({
          show: true,
          msg: `${roleName} role is delete successfully`,
          severity: "success",
        })
      );
      getRoleData();
    } catch (err) {
      console.log(err.message);
    } finally {
      // setSkeletonLoading(false);
    }
  };
  useEffect(() => {
    getRoleData();
  }, []);

  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter((s) => s.tab_name === "Role Management");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
      setRolePermission(permissionArr);
    }
  }
  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, roleData);
    setPageData(ddd);
  }, [page]);

  const history = useHistory();
  function onClose() {
    setToast({
      mgs: "",
      header: "",
      icon: "",
      show: false,
    });
  }
  return (
    <Content>
      <Modal isOpen={open1.status} size="md">
        <ModalBody>
          <div className="d-flex justify-content-center">
            <div className="fw-500 f-24 ">Are you sure want to delete this Role? </div>
          </div>
          <div className="d-flex justify-content-end mt-5">
            <div className="d-flex">
              <button
                type="button"
                onClick={() => {
                  setOpen1({ status: false });
                }}
                className="cancel_btn mr-2"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  deleteRoleData(open1.data.id, open1.data.role);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {permissionAccess ? (
        <>
          <ToastNotification
            msg={toast.mgs}
            icon={toast.icon}
            header={toast.header}
            show={toast.show}
            onClose={onClose}
          />
          <div className="card_container p-md-4 p-sm-3 p-3">
            <div className="d-flex flex-column flex-sm-row justify-content-start justify-content-sm-between align-items-start align-items-sm-center">
              <div className="f-28">Role Management</div>
              <div className="md-mt-0 mt-sm-0 mt-2">
                {rolePermission.includes("Add Role") && (
                  <>
                    <button className="btn-primary btn" onClick={() => setOpen(!open)}>
                      Create Role
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5">
              {skeletonLoading ? (
                <TableSkeleton rows={6} columns={2} />
              ) : (
                <div className="table-container mt-5">
                  <Table hover>
                    <thead style={{ backgroundColor: "#F5F6FA" }}>
                      <tr className="table-heading-size">
                        <th>Role Name</th>
                        {rolePermission.includes("Update Access") && (
                          <>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.map((item, index) => (
                        <tr key={index} className="table-heading-size">
                          <td className="text-capitalize">{item.role}</td>
                          {rolePermission.includes("Update Access") && (
                            <>
                              <td>
                                <a
                                  className="pointer"
                                  onClick={() => handleClick(item._id)}
                                  style={{ color: "#0E1073" }}
                                >
                                  Update Access{" "}
                                </a>
                                <BsTrash
                                  className="f-20 pointer parimary-color ml-2"
                                  color="#0E1073"
                                  onClick={() => {
                                    if (item.numberOfAssign !== 0) {
                                      dispatch(
                                        error({
                                          show: true,
                                          msg: `${item.role} role Assign to ${item.numberOfAssign} Users`,
                                          severity: "error",
                                        })
                                      );
                                    } else {
                                      setOpen1({ status: true, data: { id: item._id, role: item.role } });
                                    }
                                  }}
                                />
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-content-center mt-3">
            <PaginationComponent
              currentPage={page}
              itemPerPage={itemPerPage}
              paginate={(d) => {
                setPage(d);
              }}
              totalItems={roleData.length}
            />
          </div>

          <AddRole open={open} setOpen={setOpen} reload={getRoleData} setToast={setToast} />
        </>
      ) : (
        <>
          <Error403 />
        </>
      )}
    </Content>
  );
}
