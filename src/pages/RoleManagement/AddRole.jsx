import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { addRole } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { success } from "../../Store/Slices/SnackbarSlice";
import { userId, userInfo } from "../../assets/userLoginInfo";
const AddRole = ({ open, setOpen, reload, setToast }) => {
  const toggle = () => {
    
    setOpen(!open);
  };
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [vaild, setValid] = useState(false);
  const [loader, setLoader] = useState(false);

  const addRoleData = async () => {
    try {
      if (role.length !== 0) {
        setLoader(true);

        const payload = {
          role,
          user_name: userInfo().name,
          user_role: userInfo().role,
          user_id: userId(),
          org_id: userInfo().role === "isp admin" ? userId() : userInfo().org_id,
        };
        await addRole(payload);
        await reload();
        dispatch(
          success({
            show: true,
            msg: "Role Added Successfully",
            severity: "success",
          })
        );

        toggle();
        setLoader(false);
      } else {
        setValid(true);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };
  return (
    <div>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal scrollable={true} isOpen={open} toggle={open} className="pop_up" size="sm">
        {/* <ModalHeader className="pop_up" toggle={toggle}>
          <div className="flex pop_up ">
            <span className="head_min">  Plan</span>
          </div>
        </ModalHeader> */}

        <ModalBody>
          <div>
            <label>Role Name</label>
            <span className="text-danger">*</span>

            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                setRole(e.target.value);
                setValid(false);
              }}
            />

            {vaild && <p className="text-danger">Field is required</p>}
            <div className="mt-3 flex between">
              <button className="cancel_btn" onClick={() => toggle()}>
                Cancel
              </button>
              <button className="btn-primary btn" onClick={() => addRoleData()}>
                Save
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AddRole;
