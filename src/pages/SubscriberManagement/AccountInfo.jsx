import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import style from "./SubscriberManagement.module.css";
import { getPlanByCreator } from "../../service/admin";
import moment from "moment";
import { Icon } from "../../components/Component";
import { userInfo } from "../../assets/userLoginInfo";

function AccountInfo({
  setOpen,
  toggleTab,
  formData,
  handleChangeInput,
  setFormData,
  mode,
  errors,
  nextButton,
  setPlanErr,
  setLoader,
}) {
  const [getData, setGetData] = useState([]);
  const [allPlans, setAllPlans] = useState([])
  const [fullData, setFullData] = useState([]);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [showMoreOneDrop, setShowMoreOneDrop] = useState(false);
  const [showMoreOne, setShowMoreOne] = useState(false);
  const [showMoreTwo, setShowMoreTwo] = useState(false);
  const [planVisible, setPlanVisible] = useState(false);
  const [eye, setEye] = useState(false);

  const getAllPlan = async () => {
    setLoader(true)
    const res = await getPlanByCreator(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id);
    const entireData = res?.data?.data;
    setFullData(entireData);

    const formattedData = entireData.map((plan) => ({
      value: plan?._id,
      label: plan?.plan_name,
      category: plan?.category
    }));

    setAllPlans(formattedData);
    setLoader(false)
  };

  function getEndDate(type, validity) {
    let endDate;

    switch (type) {
      case "Year":
        endDate = moment().add(validity, "years")._d;
        break;
      case "Month":
        endDate = moment().add(validity, "months")._d;
        break;
      case "Day":
        endDate = moment().add(validity, "days")._d;
        break;
      default:
        throw new Error("Invalid type");
    }

    return endDate;
  }

  const handlePlanChange = (selectedOption) => {
    setPlanErr(false);
    const planId = selectedOption.target.value;
    const selectedPlan = fullData.find((plan) => plan?._id === planId);
    setSelectedPlanDetails(selectedPlan);
    setFormData((prev) => ({
      ...prev,
      current_plan: {
        plan: planId,
        // start_date: new Date(),
        // end_date: getEndDate(selectedPlan?.billingCycleType, selectedPlan?.billingCycleDate),
      },
    }));
    setPlanVisible(true);
  };

  useEffect(() => {
    getAllPlan();
  }, []);

  const toggleShowMoreOne = () => {
    setShowMoreOne(!showMoreOne);
  };
  const toggleShowMoreTwo = () => {
    setShowMoreTwo(!showMoreTwo);
  };


  function filterPlans(type) {
    setFormData((prev) => ({
      ...prev,
      current_plan: {
        plan: '',
        start_date: '',
        end_date: '',
      },
    }));
    setPlanVisible(false)
    let arr = [...allPlans]
    let newArr = arr?.filter(res => res?.category == type)
    setGetData(newArr)
  }
  function filterPlansEdit(type) {
    let arr = [...allPlans]
    let newArr = arr?.filter(res => res?.category == type)

    if (formData?.current_plan?.plan !== undefined) {
      if (formData?.planInfo?.category !== formData?.billing_type) {
        let obj = {
          label: formData?.planInfo?.plan_name,
          value: formData?.planInfo?._id,
          category: formData?.planInfo?.category
        }
        setGetData([...newArr, obj])
      } else {
        setGetData(newArr)
      }
    } else {
      setGetData(newArr)
    }
  }

  useEffect(() => {
    if (mode == "edit") {
      
      setPlanVisible(true);
      let pp = fullData?.find((res) => res._id == formData.current_plan.plan);
      setSelectedPlanDetails(pp);
      filterPlansEdit(formData?.billing_type)
    }
  }, [mode, fullData, allPlans]);

  return (
    <>
      <form onSubmit={(e)=>nextButton(e,"2")}>
        <div className="add_subscriber">
          <div className="col-md-12">
            <div className="mt-4">
              <span className="light_heading">Select User Type</span>
              <div className=" flex justify-content-start mt-3">
                <div className="flex flex-wrap gap-5">
                  <div className="flex align-items-center gap-2">
                    <div className="d-flex  gap-3 ml-md-1 ml-sm-1 ml-0">
                      <FormGroup check>
                        <Input
                          name="userType"
                          type="radio"
                          className="radioButton"
                          value="user"
                          checked={formData.userType === "user"}
                          onChange={handleChangeInput}
                        />
                        <Label className="labels  ml-md-1 ml-sm-1 ml-0" check>
                          User
                        </Label>
                      </FormGroup>

                      <FormGroup check>
                        <Input
                          name="userType"
                          type="radio"
                          className="radioButton"
                          checked={formData.userType === "mac/static ip"}
                          value="mac/static ip"
                          onChange={handleChangeInput}
                        />
                        <Label className="labels  ml-md-1 ml-sm-1 ml-0" check>
                          Mac / Static IP
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          name="userType"
                          type="radio"
                          className="radioButton"
                          value="multi static Ip"
                          checked={formData.userType === "multi static Ip"}
                          onChange={handleChangeInput}
                        />
                        <Label className="labels  ml-md-1 ml-sm-1 ml-0 mr-2" check>
                          Multiple Static IP
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* check box */}

          <div className="col-md-12">
            <div className="mt-4">
              <span className="light_heading">Receipt</span>
              <div className=" flex justify-content-start mt-3">
                <div className="flex flex-wrap gap-5">
                  <div className="flex align-items-center gap-2">
                    <div className="d-flex gap-3 ml-1">
                      <FormGroup check>
                        <Input
                          name="generateInvoice"
                          type="checkbox"
                          className="checkbox input"
                          checked={formData?.generateInvoice}
                          onChange={(e) => {
                            setFormData((pre) => {
                              return {
                                ...pre,
                                generateInvoice: e.target.checked,
                              };
                            });
                          }}
                        />
                        <Label className="labels ml-1 mt-1" check>
                          Generate Receipt
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Account */}
          <div className="col-md-12">
            <div className="h5_deletee fw-bolder">Network Account </div>
            <hr></hr>

            <div className="row mt-1">
              <div class="col-md-6 col-sm-6 col-12 mt-3">
                <h5>
                  Username<span className="text-danger">*</span>
                </h5>
                <Input
                  placeholder="Enter Username"
                  name="userName"
                  value={formData?.userName}
                  onChange={handleChangeInput}
                  className={` ${errors?.userName ? "border border-danger" : ""}`}
                />
                {errors.userName !== "" ? (
                  <>
                    <p className="text-danger">{errors?.userName}</p>
                  </>
                ) : (
                  ""
                )}
              </div>

              <div class="col-md-6 col-sm-6 col-12 mt-3">
                <h5>
                  Password<span className="text-danger">*</span>
                </h5>
                <a
                  href="#password"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setEye(!eye);
                  }}
                  className={`mt-4 mr-2 form-icon lg form-icon-right passcode-switch ${eye ? "is-hidden" : "is-shown"}`}
                >
                  <Icon name="eye" className="passcode-icon icon-show"></Icon>

                  <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                </a>
                <Input
                  className={`mt-2 p-2 ${errors?.password ? "border border-danger" : ""}`}
                  name="password"
                  value={formData?.password}
                  type={eye ? "text" : "Password"}
                  placeholder="Enter  Password"
                  onChange={handleChangeInput}
                />

                {errors.password && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="row ">
              <div className="col-md-6 col-sm-6 col-12 mt-3">
                <h5>
                  IP Address<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-1 ${errors?.ipAddress ? "border border-danger" : ""}`}
                  name="ipAddress"
                  type="text"
                  value={formData?.ipAddress}
                  placeholder="Enter IP Address"
                  onChange={handleChangeInput}
                />
                {errors.ipAddress && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              {mode == "edit" ? '' :
                <div className="col-md-6 col-sm-6 col-12 mt-3">
                  <h5>
                    Plan Category<span className="text-danger">*</span>
                  </h5>
                  <select className="form-control" required name="billing_type" value={formData?.billing_type} onChange={(e) => {
                    handleChangeInput(e)
                    filterPlans(e.target.value)
                  }}>
                    <option value=''>Select Plan Category</option>
                    <option value='prepaid'>Prepaid</option>
                    <option value='postpaid'>Postpaid</option>
                  </select>
                </div>
              }
              <div className="col-md-6 col-sm-6 col-12 mt-3">
                <h5>
                  Plans<span className="text-danger">*</span>
                </h5>
                <SingleSelect
                  options={getData}
                  placeItem={"plan"}
                  name="plan"
                  value={formData?.current_plan?.plan}
                  className={`${errors?.current_plan ? "border border-danger" : ""}`}
                  onChange={handlePlanChange}
                />
                {errors.current_plan && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {planVisible ? (
            <>
              <div className="border mt-4 pl-1 ml-3 mr-3" style={{ borderRadius: "5px" }}>
                <div
                  className="col-md-12 flex between align-items-center p-3"
                  onClick={() => setShowMoreOneDrop(!showMoreOneDrop)}
                >
                  <div className="labelsHeading text-muted">{selectedPlanDetails?.plan_name}</div>
                  <div className=" ml-2">
                    <div className="labelsHeading" style={{ cursor: "pointer" }}>
                      {showMoreOneDrop ? "View more Details" : "View more Details"}
                      {showMoreOneDrop ? (
                        <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                      ) : (
                        <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                      )}
                    </div>
                  </div>
                </div>
                {showMoreOneDrop && (
                  <>
                    <div>
                      {/* Plan Dropdown */}

                      <div className="col-12">
                        <div className="row">
                          <span className="f-18 text-black mt-4 ml-3 ">Plan Prefrences </span>
                          <div className="col-md-12">
                            <div className="ms-5 mt-3">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mt-3">
                                    <span className="light_heading">Category:</span>
                                    <div className=" flex justify-content-start mt-3">
                                      <div className="flex flex-wrap gap-5">
                                        <div className="flex align-items-center gap-1">
                                          <Form className="d-flex gap-3 ml-1">
                                            <FormGroup check>
                                              <Input
                                                name="category"
                                                type="radio"
                                                className="radioButton"
                                                value="postpaid"
                                                checked={selectedPlanDetails?.category === "postpaid"}
                                              // disabled
                                              />
                                              <Label className="labels ml-1 f-16 text-black" check>
                                                Postpaid
                                              </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                              <Input
                                                name="category"
                                                type="radio"
                                                className="radioButton"
                                                value="prepaid"
                                                checked={selectedPlanDetails?.category === "prepaid"}
                                              // disabled
                                              />
                                              <Label className="labels ml-1 f-16 text-black" check>
                                                Prepaid
                                              </Label>
                                            </FormGroup>
                                          </Form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6 mt-3">
                                  <div className="">
                                    <span className="light_heading">Type:</span>
                                    <div className=" flex justify-content-start mt-3">
                                      <div className="flex flex-wrap gap-5">
                                        <div className="flex align-items-center gap-1">
                                          <Form className="d-flex gap-3 ml-1">
                                            <FormGroup check>
                                              <Input
                                                name="type"
                                                type="radio"
                                                className="radioButton"
                                                value="unlimited"
                                                checked={selectedPlanDetails?.type === "unlimited"}
                                              // disabled
                                              />
                                              <Label className="labels ml-1 f-16 text-black" check>
                                                Unlimited
                                              </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                              <Input
                                                name="type"
                                                type="radio"
                                                className="radioButton"
                                                value="data"
                                                checked={selectedPlanDetails?.type === "data"}
                                              // disabled
                                              />
                                              <Label className="labels ml-1 f-16 text-black" check>
                                                Data
                                              </Label>
                                            </FormGroup>
                                          </Form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <div className=" flex justify-content-start mt-3">
                    <div className="flex flex-wrap gap-5">
                      <div className="flex align-items-center gap-1">
                        <Form className="d-flex gap-3 ml-1">
                          <FormGroup check>
                            <Input
                              name="category"
                              type="radio"
                              className="radioButton"
                              checked
                            />
                            <Label className="labels ml-1" check>
                              {selectedPlanDetails?.category}
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Input name="type" type="radio" className="radioButton" checked/>
                            <Label className="labels ml-1" check>
                              {selectedPlanDetails?.type}
                            </Label>
                          </FormGroup>
                        </Form>
                      </div>
                    </div>
                  </div> */}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* plan details  */}
                      <div className="col-md-12 mt-3 flex justify-content-between " onClick={toggleShowMoreOne}>
                        <div className="labelsHeading">Plan Details</div>
                        <div className="labelsHeading" style={{ cursor: "pointer" }}>
                          {showMoreOne ? "show less" : "show more"}
                          {showMoreOne ? (
                            <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                          ) : (
                            <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                          )}
                        </div>
                      </div>
                      <div className={style.horizontal}>
                        <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
                      </div>
                      {showMoreOne && (
                        <>
                          <div className="row p-3">
                            <div className="col-md-6">
                              <label className={`${style.labels} mb-2`}>Plan Name</label>

                              <div className={style.boxBackground}>
                                <span className={style.labels}>{selectedPlanDetails?.plan_name}</span>
                              </div>
                            </div>
                            <div className="col-md-6 ">
                              <label className={`${style.labels} mb-2`}>Plan Rate</label>
                              <div className={style.boxBackground}>
                                <span className={style.labels}>{selectedPlanDetails?.amount}</span>
                              </div>
                            </div>
                          </div>
                          <div className="row p-3">
                            <div className="col-md-12">
                              <label className={`${style.labels} mb-2 `}>Billing Cycle</label>

                              <div className="row">
                                <div className="col-md-6">
                                  <div className={`${style.boxBackground} `}>
                                    <span className={style.labels}>{selectedPlanDetails?.billingCycleType}</span>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className={`${style.boxBackground} `}>
                                    <span className={style.labels}>{selectedPlanDetails?.billingCycleDate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* internet speed  */}
                      <div className="col-md-12 mt-4  flex justify-content-between " onClick={toggleShowMoreTwo}>
                        <div className="labelsHeading">Internet Speed</div>
                        <div className="labelsHeading" style={{ cursor: "pointer" }}>
                          {showMoreTwo ? "show less" : "show more"}
                          {showMoreTwo ? (
                            <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                          ) : (
                            <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                          )}
                        </div>
                      </div>
                      <div className={style.horizontal}>
                        <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
                      </div>
                      {showMoreTwo && (
                        <>
                          <div className="row p-3">
                            <div className="col-md-12">
                              <label className={`${style.labels} mb-2`}>Download Speed</label>

                              <div className="row">
                                <div className="col-md-6">
                                  <div className={`${style.boxBackground} `}>
                                    <span className={style.labels}>
                                      {" "}
                                      {selectedPlanDetails?.bandwidth_info?.max_download?.speed}
                                    </span>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className={`${style.boxBackground} `}>
                                    <span className={style.labels}>
                                      {" "}
                                      {selectedPlanDetails?.bandwidth_info?.max_download?.unit}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row p-3">
                            <div className="col-md-12">
                              <label className={`${style.labels} mb-2`}>Upload Speed</label>

                              <div className="row">
                                <div className="col-md-6">
                                  <div className={`${style.boxBackground} `}>
                                    <span className={style.labels}>
                                      {" "}
                                      {selectedPlanDetails?.bandwidth_info?.max_upload?.speed}
                                    </span>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className={`${style.boxBackground} `}>
                                    <span className={style.labels}>
                                      {" "}
                                      {selectedPlanDetails?.bandwidth_info?.max_upload?.unit}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* {category != "Mac" && (
  <div className="col-md-12">
    <div className="row">
      <div className="col-6 col-md-6 mt-4">
        <div className="mt-4">
          <h5>IP Address<span className="text-danger">*</span></h5>
          <div className="d-flex justify-content-between w-100">
            <Input
              className=" mt-1 col-12"
              type="text"
              placeholder="Enter IP Address"

              // name={ipAddress?.ip}
              onChange={(e) => handleInput(e.target)}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{category === "Mac" && (
  <>
    <div className="col-md-12">
      <div className="row">
        <div className="col-6 col-md-6 mt-4">
          <div>
            <h5>Mac/Static IP Address <span className="text-danger">*</span></h5>
            <div className="d-flex justify-content-between w-100">
              <Input
                className=" mt-1 col-12"
                type="text"
                placeholder="Enter Mac/Static IP Address"

                name="name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)} */}
          <div className="w-100 d-flex justify-content-end mt-4 p-1">
            <button type="button" className="btn mr-2" onClick={() => setOpen(!open)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default AccountInfo;
