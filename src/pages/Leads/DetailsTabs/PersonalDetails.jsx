import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { updateLeadsData } from "../../../service/admin";
import Loader from "../../../components/commonComponent/loader/Loader";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { emailAndNumberCheck } from "../../../service/admin";
import { useDispatch } from "react-redux";
import { error } from "../../../Store/Slices/SnackbarSlice";
import { userId, userInfo } from "../../../assets/userLoginInfo";

export default function PersonalDetails({ getDataById, getdataLeads, }) {
  const [disable, setDisable] = useState(true);
  const [editType, setEditType] = useState(getDataById?.account_type);
  const [addNumber, setAddNumber] = useState(getDataById?.alter_mobile_number);
  const [mobileNumber, setMobileNumber] = useState(getDataById?.mobile_number);
  const [loader, setLoader] = useState(false);
  const paramsData = useParams();
  const [num, setNum] = useState("");
  const [num1, setNum1] = useState("");
  const [valid, setValid] = useState(false);
  const dispatch = useDispatch();
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    setEditType(getDataById?.account_type);
    setAddNumber(getDataById?.alter_mobile_number);
    setMobileNumber(getDataById?.mobile_number);
    setOriginalData({
      account_type: getDataById?.account_type,
      alter_mobile_number: getDataById?.alter_mobile_number,
      mobile_number: getDataById?.mobile_number,
    });
  }, [getDataById]);

  async function onSubmit(e) {
    e.preventDefault();

    let payload = {
      alter_mobile_number: addNumber,
      account_type: editType,
      id: paramsData.id,
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId(),
    };

    setLoader(true);
    await updateLeadsData(payload)
      .then((res) => {
        setLoader(false);
        setDisable(true);
        getdataLeads();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });

    setValid(false);
  }

  function handleCancel() {
    setEditType(originalData.account_type);
    setAddNumber(originalData.alter_mobile_number);
    setMobileNumber(originalData.mobile_number);
    setDisable(true);
  }

  return (
    <>
      {loader && <Loader />}
      <form onSubmit={onSubmit}>
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <div className="mr-3 fw-600 f-18">Personal Details</div>
            {disable ? (
              getDataById?.lead_status !== "converted" && (
                <FaRegEdit className="f-20 text-primary pointer" onClick={() => setDisable(false)} />
              )
            ) : (
              <IoCloseSharp className="f-20 text-primary pointer" onClick={handleCancel} />
            )}
          </div>
          {!disable && (
            <button className="btn btn-sm btn-primary" type="submit">
              Save
            </button>
          )}
        </div>
        <div className="row mt-4">
          <div className="col-md-6 col-sm-6 col-12">
            <label className="form-label mb-1">Account Type</label>
            <select
              className="form-control"
              value={editType}
              disabled={disable}
              onChange={(e) => setEditType(e.target.value)}
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control text-capitalize"
              placeholder="Enter Full Name"
              disabled
              value={getDataById?.full_name}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <label className="form-label">Email</label>
            <input
            type="email"
              className="form-control"
              placeholder="Enter your Email ID"
              disabled
              value={getDataById?.email}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              disabled
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  setMobileNumber(e.target.value);
                  setNum(e.target.value);
                }
              }}
            />
            {valid && num.length !== 10 && (
              <p className="text-danger">Please enter 10 digit number</p>
            )}
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label">Alternate Mobile Number</label>
            <input
              className="form-control"
              placeholder="Enter your alternate mobile number"
              type="number"
              disabled={disable}
              value={addNumber}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  setAddNumber(e.target.value);
                  setNum1(e.target.value);
                }
              }}
            />
          </div>
        </div>
      </form>
    </>
  );
}
