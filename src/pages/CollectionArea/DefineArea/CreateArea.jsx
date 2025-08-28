import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { addAreaOfCollection } from "../../../service/admin";
import Loader from "../../../components/commonComponent/loader/Loader";
import { userId, userInfo } from "../../../assets/userLoginInfo";
import { success } from "../../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";


export default function CreateArea({ open, setOpen,getAllAreaData }) {
  function toggle() {
    setOpen(!open);
  }

  const [area, setArea] = useState("");
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();


  const submitArea = async e => {
    e.preventDefault();
    setLoader(true);
    try {
      let payload = {
        name: area,
        role: "area",
        isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
        org_id: userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id,
        createdBy: userId()
      };
      let res = await addAreaOfCollection(payload);
      // 
      dispatch(
        success({
          show: true,
          msg: "Area Created Successfully",
          severity: "success",
        })
      );
      setArea('')
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setLoader(false);
      getAllAreaData()
    }
  };
  return (
    <div>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal centered scrollable isOpen={open} size="md">
        <ModalHeader toggle={toggle}>
          <div className="f-24">Create Area</div>
        </ModalHeader>
        <ModalBody>
          <span>Define a new collection area to organize payment collection zones</span>
          <form onSubmit={submitArea}>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="form-label">
                  Add Area Name <span className="text-danger">*</span>
                </label>
                <input
                required
                  className="form-control"
                  placeholder="Enter Area Name"
                  onChange={e => {
                    if (e.target.value === " ") {
                      e.target.value = "";
                    } else {
                      setArea(e.target.value);
                    }
                  }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="btn text-primary mr-3" type="button" onClick={toggle}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Create
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
