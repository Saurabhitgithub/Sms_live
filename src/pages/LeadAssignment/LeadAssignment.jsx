import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { leadAssessmentByAdmin } from "../../service/admin";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import Loader from "../../components/commonComponent/loader/Loader";
import { getleadAssessmentData } from "../../service/admin";
import { permisionsTab, userId, userInfo } from "../../assets/userLoginInfo";
import Error403 from "../../components/error/error403";

export default function LeadAssignment() {
  let OptionLabel = [
    { value: "round robin", label: "Round-Robin System " },
    { value: "least assign", label: "Admin with Lesser Leads" },
  ];

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [leadOwner, setLeadOwner] = useState(false);
  const [leadSave, setLeadSave] = useState({});
  

  const [selectArrangement, setSelectArragement] = useState();
  const [leadPermission, setLeadPermission] = useState(["Leads Assignment Tab"]);
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
  const getAssessmentFunction = async () => {
    setLoader(true);
    permissionFunction();
    await getleadAssessmentData()
      .then((res) => {
        
        setLoader(false);
        setSelectArragement(res.data.data.arrangement_system);
        setLeadOwner(res.data.data.view_setting);
        setLeadSave(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    getAssessmentFunction();
  }, []);

  const assyMentSubmit = async () => {
    setLoader(true);
    let payLoadData = {
      arrangement_system: selectArrangement,
      view_setting: leadOwner,
      isp_id: "6617ec1f0fae0dccadb779ba",
      arrangement_for: "lead",
      id: leadSave?._id,
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId(),
    };
    await leadAssessmentByAdmin(payLoadData)
      .then((res) => {
        
        setLoader(false);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };
  const toggle = () => setOpen(false);
  return (
    <Content>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal isOpen={open} size="md">
        <ModalBody>
          <div className="d-flex justify-content-center">
            <div className="fw-500 f-24 ">Are you sure want to Change the status of Leads </div>
          </div>
          <div className="d-flex justify-content-end mt-5">
            <div className="d-flex">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setLeadOwner(leadSave?.view_setting);
                  setSelectArragement(leadSave?.arrangement_system);
                }}
                className="cancel_btn mr-2"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  assyMentSubmit();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {permissionAccess && leadPermission.includes("Leads Assignment Tab") ? (
     
            <> <div className="card_container p-4 user_section">
            <div className="d-flex justify-content-between align-items-center">
              <div className="head_min">Lead Assignment</div>
            </div>
            <div className="mt-3 f-18">
              This section allows you to configure how leads are assigned to administrators. You can choose between two
              allocation methods:
            </div>
            <div className="mt-4">
              <div className="f-18 fw-600">Round-Robin System : </div>
              <div className="f-18">
                Assign leads in a sequential manner, distributing them evenly among all administrators.
              </div>
            </div>
            <div className="mt-3">
              <div className="f-18 fw-600">Admin with Lesser Leads : </div>
              <div className="f-18">
                Assign leads to administrators with fewer leads currently assigned to them, ensuring a balanced workload.
              </div>
            </div>
            <div className="mt-5">
              {/* <div className="row border align-items-center">
                <div className="col-md-6 ">
                  <label className="fw-500 f-18">Leads</label>
                  <div>
                    <input placeholder="All Leads Stages" className="form-control w-50" disabled />
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 mt-sm-3">
                  <label className="fw-500 f-18">Options</label>
                  <div className="style_change_select">
                    <SingleSelect
                      placeItem="Lead"
                      value={selectArrangement}
                      options={OptionLabel}
                      onChange={(e) => {
                        setSelectArragement(e.target.value);
                        setOpen(true);
                      }}
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <Table hover className="mt-4">
              <thead>
                <tr>
                  <th>Leads</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                <td className="">All Leads Stages</td>
                <td className="style_change_select ">
                  {leadPermission.includes("Select Stages ( Leads Assignment )") ? (
                    <>
                      {" "}
                      <SingleSelect
                        placeItem="Lead"
                        value={selectArrangement}
                        options={OptionLabel}
                        onChange={(e) => {
                          setSelectArragement(e.target.value);
                          setOpen(true);
                        }}
                        className="w-50"
                      />
                    </>
                  ) : (
                    <>{OptionLabel.find((e) => e.value === selectArrangement)?.label}</>
                  )}
                </td>
              </tbody>
            </Table>
            <div className="mt-4">
              <div className="fw-600 f-18">Lead owner can view leads:</div>
              <div className="row">
                <div className="col-md-6 col-sm-6">Lead owner can view only the leads assigned to him/her?</div>
                <div className="col-md-2 col-sm-6">
                  <div className="custom-control  custom-control-sm custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input w-100"
                      id="customSwitch1"
                      name="active_status"
                      checked={leadOwner}
                      onChange={(e) => {
                        setLeadOwner(e.target.checked);
                        setOpen(true);
                      }}
                      disabled={!leadPermission.includes("Lead owner can view leads ( Leads Assignment )")}
                    />
                    <label className="custom-control-label f-16 text-black" htmlFor="customSwitch1"></label>
                  </div>
                </div>
              </div>
            </div>
          </div></>):(<>    <Error403 /></>)}
    </Content>
  );
}
