import React, { useState } from "react";
import { emailAndNumberCheck } from "../../../service/admin";
import { error } from "../../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Loader from "../../../components/commonComponent/loader/Loader";


export default function PersonalDetails({ toggleTab, handleInput, formData }) {
  const [valid, setValid] = useState(false);
  const [valid1, setValid1] = useState(false);
  const dispatch = useDispatch();

  const [num, setNum] = useState("");
  const [num1, setNum1] = useState("");
  const [loader, setLoader] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (num.length === 10) {
      setLoader(true);
      let payloadData = {
        mobile_number: formData.mobile_number,
        email: formData?.email,
      };
      // 
      await emailAndNumberCheck(payloadData)
      .then((res) => {
        
          toggleTab("2");
      setValid(false);
      setLoader(false)

        })
        .catch((err) => {
          console.log(err.response.data);
          if(err.response.data.errormessage.includes("Phone number already exists.")){
            dispatch(error({
                show: true,
                msg:err.response.data.data.type==="lead"? "Phone number already exists and Click here to see.": "Phone number already exists in Subscriber.",
                severity: "error",
                link: err.response.data.data.type==="lead"?`/leads/viewLeads/${err.response.data.data.id}`:"/subscriberManagement"
              })
            );
            setLoader(false)
          }else if(err.response.data.errormessage.includes("Email already exists.")){
            dispatch(error({
                show: true,
                msg: err.response.data.data.type==="lead"?"Email already exists and Click here to see":"Email already exists  in Subscriber.",
                severity: "error",
                link: err.response.data.data.type==="lead"?`/leads/viewLeads/${err.response.data.data.id}`:"/subscriberManagement"

              })
            );
            setLoader(false)
          }
        });
    } else {
      setValid(true);
      setValid1(true);
    }
    // 
  }

  return (
    <>
    {loader && (
        <>
          <Loader />
        </>
      )}
      <form onSubmit={onSubmit}>
        <div className="row mt-4">
          <div className="col-md-6 col-sm-6 col-12">
            <label className="form-label mb-1">Account Type</label>
            <select
              className="form-control"
              name="account_type"
              value={formData?.account_type}
              onChange={(e) => {
                handleInput(e.target);
              }}
              required
            >
              <option value="" selected disabled>
                Select Type
              </option>
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <lable className="form-label">Full Name</lable>
            <input
              className="form-control"
              placeholder="Enter Full Name"
              name="full_name"
              value={formData?.full_name}
              required
              onChange={(e) => {
                handleInput(e.target);
              }}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <lable className="form-label">Email</lable>
            <input
              className="form-control"
              placeholder="Enter Email ID"
              name="email"
              type="email"
              
              value={formData?.email}
              required
              onChange={(e) => {
                handleInput(e.target);
              }}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label">Mobile Number</lable>
            <input
              className="form-control"
              placeholder="Enter mobile number"
              name="mobile_number"
              value={formData.mobile_number}
              required
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleInput(e.target);
                  setNum(e.target.value);
                }
              }}
              type="number"
            />
            {valid && !num.length !== 10 && (
              <>
                <p className="text-danger">Please enter 10 digit number</p>
              </>
            )}
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label">Alternate Mobile Number</lable>
            <input
              className="form-control"
              placeholder="Enter alternarte mobile number"
              name="alter_mobile_number"
              value={formData?.alter_mobile_number}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleInput(e.target);
                  setNum1(e.target.value);
                }
              }}
              type="number"
            />
            {/* {valid1 && !num1.length !== 10 && (
              <>
                <p className="text-danger">Please enter 10 digit number</p>
              </>
            )} */}
          </div>
        </div>
        <div className="w-100 d-flex justify-content-end mt-4">
          {/* <button type='button' className='btn text-primary mr-3'>Cancel</button> */}
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </>
  );
}
