import React, { useState } from "react";
import { userInfo } from "../../../assets/userLoginInfo";
import SearchableDropdown from "../../../AppComponents/SearchableDropdown/SearchableDropdown";
import { FaArrowRight } from "react-icons/fa6";

export default function Step1({
  toggleTab,
  toggle,
  option,
  addSubscriberData,
  subscriberData,
  handleChange,
  formData,
  setSubscriberData,
  setBackBtnState,
  planData
}) {
  const [phoneErr, setPhoneErr] = useState(false);
  let userName = userInfo().name;

  function submitData(e) {
    e.preventDefault();
    
    // if (formData?.mobile_number.length < 10) {
    //   setPhoneErr(true);
    //   return;
    // }
    if (formData?.already_subscriber) {
      toggleTab("1");
      setBackBtnState("1");
    } else {
      toggleTab("2");
      setBackBtnState("0");
    }
  }
  return (
    <>
      <form onSubmit={submitData}>
        <div className="f-18 fw-500 mt-md-5 mt-sm-4 mt-4">Ticket Settings</div>
        <hr />
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12">
            <label className="form-label">
              Created By <span className="text-danger">*</span>
            </label>
            <input className="form-control" value={userName} disabled />
          </div>
          <div className="col-md-6 col-sm-6 col-12">
            {/* <label className="form-label">
              User Type <span className="text-danger">*</span>
            </label>
            <select
              required
              className="form-control"
              name="already_subscriber"
              onChange={e => {
                setSubscriberData({});
                handleChange(e);
                setPhoneErr(false);
              }}
              value={formData?.already_subscriber}
            >
              <option value="">Select user type</option>
              <option value={true}>Already a subscriber</option>
              <option value={false}>Not a subscriber</option>
            </select> */}
          </div>
        </div>
        <div className="f-18 fw-500 mt-md-5 mt-sm-4 mt-4">Subscriber Selection</div>
        <hr />
        {/* {formData?.already_subscriber ? ( */}
          <div className="row">
            {/* <div className="col-md-6 col-sm-6 col-12"> */}
              {/* <label className="form-label">
                Select User <span className="text-danger">*</span>
              </label> */}
              {/* <SearchableDropdown
                options={option}
                // filterOptions={customFilter}
                searchBy="value"
                labelField="label"
                valueField="_id"
                searchable={true}
                required
                placeholder="Search & select user by name or phone number"
                onChange={e => {
                  addSubscriberData(e);
                  setPhoneErr(false);
                }}
              /> */}
              {/* {phoneErr ? <div className='text-danger'>Invalid phone number</div> : ''} */}
            {/* </div> */}
            {/* <div className="col-md-6 col-sm-6 col-12 d-md-block d-sm-block d-none"></div> */}
            <div className="col-md-6 col-sm-6 col-12 mt-3">
              <label className="form-label">User Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder=""
                // value={subscriberData?.userName}
                value={planData?.full_name}
                disabled
              />
            </div>
            <div className="col-md-6 col-sm-6 col-12 mt-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder=""
                // value={subscriberData?.mobile_number}
                value={planData?.mobile_number}
                disabled
              />
            </div>
          </div>
        {/* ) : (
          <div className="row">
            <div className="col-12">
              <label className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="Enter full name"
                value={formData?.name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 col-sm-6 col-12 mt-3">
              <label className="form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter phone no."
                required
                value={formData?.mobile_number}
                name="mobile_number"
                onInput={e => (e.target.value = e.target.value.slice(0, 10))}
                onChange={e => {
                  handleChange(e);
                  setPhoneErr(false);
                }}
              />
              {phoneErr ? <div className="text-danger">Invalid phone number</div> : ""}
            </div>
            <div className="col-md-6 col-sm-6 col-12 mt-3">
              <label className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="Enter email id"
                value={formData?.email}
                name="email"
                onChange={handleChange}
              />
            </div>
          </div>
        )} */}
        <div className="w-100 d-flex justify-content-end mt-5">
          <button className="btn text-primary" type="button" onClick={toggle}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Next <FaArrowRight />
          </button>
        </div>
      </form>
    </>
  );
}
