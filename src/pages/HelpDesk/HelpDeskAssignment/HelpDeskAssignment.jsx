import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import { Table } from "reactstrap";
import { changeMethod, getCurrentMethod } from "../../../service/admin";
import Loader from "../../../components/commonComponent/loader/Loader";
import { useDispatch } from "react-redux";
import { error, success } from "../../../Store/Slices/SnackbarSlice";
import { permisionsTab, userId, userInfo } from "../../../assets/userLoginInfo";
import Error403 from "../../../components/error/error403";

export default function HelpDeskAssignment() {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState();
  const [helpPermission, setHelpPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
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
  }
  async function getDate() {
    setLoader(true);
    try {
      await permissionFunction();
      let res = await getCurrentMethod();
      let data = res.data.data;
      setData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  }

  async function updateData(type, value) {
    setLoader(true);
    try {
      let payload = {};
      if (type == "method") {
        payload = {
          id: data?._id,
          arrangement_system: value,
          view_setting: data?.view_setting,
          user_role: userInfo().role,
          user_name: userInfo().name,
          user_id: userId(),
          arrangement_for: "help_desk",
        };
      } else {
        payload = {
          id: data?._id,
          view_setting: value,
          arrangement_system: data?.arrangement_system,
          user_role: userInfo().role,
          user_name: userInfo().name,
          user_id: userId(),
          arrangement_for: "help_desk",
        };
      }

      await changeMethod(payload);
      await getDate();
      if (type == "method") {
        dispatch(
          success({
            show: true,
            msg: "Method change successfully",
            severity: "success",
          })
        );
      } else {
        dispatch(
          success({
            show: true,
            msg: "View Details change successfully",
            severity: "success",
          })
        );
      }
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
    }
  }

  useEffect(() => {
    getDate();
  }, []);

  return (
    <>
      <Content>
        {loader ? (
          <Loader />
        ) : (
          <>
            {permissionAccess && helpPermission.includes("Help Desk Assignment Tab") ? (
              <>
                <div className="card_container p-md-4 p-sm-3 p-3">
                  <div className="f-28">Help Desk Assignment</div>
                  <div className="mt-md-5 mt-sm-4 mt-4 f-20">
                    This section allows you to configure how Tickets are assigned to administrators. You can choose
                    between two allocation methods:
                  </div>

                  <div className="fw-600 f-20 mt-4">Round-Robin System :</div>
                  <div>Assign leads in a sequential manner, distributing them evenly among all administrators.</div>

                  <div className="fw-600 f-20 mt-4">Admin with Lesser Tickets :</div>
                  <div>
                    Assign tickets to administrators with fewer tickets currently assigned to them, ensuring a balanced
                    workload.
                  </div>
                  <Table hover className="mt-4">
                    <thead>
                      <tr>
                        <th>Tickets</th>
                        <th>Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="">All Ticket Stages</td>
                        <td className="style_change_select">
                          {helpPermission.includes("Select Stages ( Help Desk Assignment )") ? (
                            <>
                              {" "}
                              <select
                                className="form-control  pl-0 w-50"
                                value={data?.arrangement_system}
                                onChange={(e) => {
                                  updateData("method", e.target.value);
                                  setData((pre) => {
                                    return {
                                      ...pre,
                                      arrangement_system: e.target.value,
                                    };
                                  });
                                }}
                              >
                                <option value="round robin">Round-Robin System</option>
                                <option value="least assign">Admin with Lesser Tickets</option>
                              </select>
                            </>
                          ) : data?.arrangement_system === "round robin" ? (
                            "Round-Robin System"
                          ) : (
                            "Admin with Lesser Tickets"
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="f-18 fw-500 mt-4">Ticket owner can view tickets:</div>
                  <div className="d-flex align-items-center">
                    <div className="mr-3 text-secondary">
                      Ticket owner can view only the tickets assigned to him/her?
                    </div>
                    <div className="custom-control custom-control-sm custom-switch mt-2">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customSwitch1"
                        name="active_status"
                        defaultChecked={data?.view_setting}
                        onChange={(e) => {
                          setData((pre) => {
                            return {
                              ...pre,
                              view_setting: e.target.checked,
                            };
                          });
                          updateData("view", e.target.checked);
                        }}
                        disabled={!helpPermission.includes("Ticket  owner can view Ticket  ( Help Desk Assignment )")}
                      />
                      <label className="custom-control-label f-16 text-black" htmlFor="customSwitch1"></label>
                    </div>
                  </div>
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
