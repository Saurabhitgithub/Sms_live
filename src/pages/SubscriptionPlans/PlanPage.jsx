import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, Label, Table } from "reactstrap";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import { IoMdAdd } from "react-icons/io";
import style from "./Plans.module.css";
import { ImCross } from "react-icons/im";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { FiPercent } from "react-icons/fi";

function PlanPage({
  handleInput,
  handleInputburst,
  formData,
  vaildData,
  mode,
  setFormData,
  getAllBandwidth,
  tableData,
  setTableData,
  handleTimeChange,
}) {
  const [showMoreOne, setShowMoreOne] = useState(true);
  const [showMoreTwo, setShowMoreTwo] = useState(true);
  const [showMoreThree, setShowMoreThree] = useState(true);
  const [showMoreFour, setShowMoreFour] = useState(true);
  const [showMoreFive, setShowMoreFive] = useState(true);
  const [showMoreSix, setShowMoreSix] = useState(true);
  const [showMoreSeven, setShowMoreSeven] = useState(true);
  const [showMoreEight, setShowMoreEight] = useState(false);
  const [showMoreNine, setShowMoreNine] = useState(false);
  const [showMoreTen, setShowMoreTen] = useState(false);

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [billCycle, setBillCycle] = useState("Billing Option");
  const [isChecked, setIsChecked] = useState(false);
  const [billingOptions, setBillingOptions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [features, setFeatures] = useState([""]);
  const [isPlanActivated, setIsPlanActivated] = useState(false);
  const [isPopularPlan, setIsPopularPlan] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [attributesData, setAttributesData] = useState([]);
  const [ckeckedRes, setCkeckedRes] = useState(false);
  const [checkedLogin, setCheckedLogin] = useState(false);

  useEffect(() => {
    
  }, [getAllBandwidth]);

  const billingCycle = [
    { value: "Year", label: "Yearly" },
    { value: "Month", label: "Monthly" },
    { value: "Day", label: "Daily" },
  ];
  const billingCycle1 = [
    { value: "always", label: "Always" },
  ];
  const speed = [
    { value: "kbps", label: "Kb" },
    { value: "mbps", label: "Mb" },
    { value: "gbps", label: "Gb" },
  ];
  const dataSpeed = [
    { value: "MB", label: "MB" },
    { value: "KB", label: "KB" },
    { value: "GB", label: "GB" },
    { value: "TB", label: "TB" },
    { value: "PB", label: "PB" },
    { value: "EB", label: "EB" },
    { value: "ZB", label: "ZB" },
    { value: "YB", label: "YB" },
  ];
  const downloadOption = [{ value: "Download Doesn’t Exceed", label: "Download Doesn’t Exceed" },
    { value: "FUP Limit Doesn't Exceed", label: "FUP Limit Doesn't Exceed" },
    { value: "Upload doesn't exceed", label: "Upload doesn't exceed" },
  ];
  const downloadOption1 = [{ value: "Download Doesn’t Exceed", label: "Download Doesn’t Exceed" },
  ];
  const handlePlanActivationChange = () => {
    setIsPlanActivated(!isPlanActivated);
  };

  const handlePopularPlanChange = () => {
    setIsPopularPlan(!isPopularPlan);
  };

  const handleBillOption = (e) => {
    const value = e;
    if (value === "Yearly") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

      setBillingOptions(months.map((month, index) => ({ label: month, value: index + 1 })));
      setIsDisabled(false);
      setBillCycle("Month");
    } else if (value === "Weekly") {
      setBillingOptions(Array.from({ length: 4 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 })));
      setIsDisabled(false);
      setBillCycle("Week");
    } else if (value === "Monthly") {
      setBillingOptions(Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 })));
      setIsDisabled(false);
      setBillCycle("Day");
    } else if (value === "Daily") {
      setBillingOptions([]);
      setIsDisabled(true);
      setBillCycle("none");
    }
  };

  const toggleShowMoreOne = () => {
    setShowMoreOne(!showMoreOne);
  };
  const toggleShowMoreTwo = () => {
    setShowMoreTwo(!showMoreTwo);
  };
  const toggleShowMoreThree = () => {
    setShowMoreThree(!showMoreThree);
  };
  const toggleShowMoreFour = () => {
    setShowMoreFour(!showMoreFour);
  };
  const toggleShowMoreFive = () => {
    setShowMoreFive(!showMoreFive);
  };

  const toggleShowMoreSix = () => {
    setShowMoreSix(!showMoreSix);
  };
  const toggleShowMoreSeven = () => {
    setShowMoreSeven(!showMoreSeven);
  };
  const toggleShowMoreEight = () => {
    setShowMoreEight(!showMoreEight);
  };
  const toggleShowMoreNine = () => {
    setShowMoreNine(!showMoreNine);
  };
  const toggleShowMoreTen = () => {
    setShowMoreTen(!showMoreTen);
  };
  const addFeature = () => {
    let feature = [...features, ""];
    setFeatures(feature);
  };
  const addvalueAttribute = (index, value) => {
    let valueData = [...attributesData];
    valueData[index].field_value = value;
    setAttributesData(valueData);
    handleInput({
      name: "attributes",
      value: valueData,
    });
  };
  const removeFeature = (ind) => {
    let del = features.filter((feature, index) => index !== ind);
    setFeatures(del);
    handleInput({ name: "features", value: del });
  };

  const removeAttribute = (ind, main) => {
    if (main) {
      let del = attributes.filter((feature, index) => index !== ind);
      setAttributes(del);
    } else {
      let del = attributesData.filter((feature, index) => index !== ind);
      setAttributesData(del);
      handleInput({ name: "attributes", value: del });
    }
  };
  const addAttribute = () => {
    setAttributes([...attributes, ""]);
  };
  useEffect(() => {
    if (formData) {
      setCategory(formData.category);
      setType(formData.type);
      setFeatures(formData.features ? formData.features : [""]);
      setAttributesData(formData.attributes ? formData.attributes : []);
      handleBillOption(formData.billingCycleType);
    }
  }, [formData]);

  return (
    <>
      <div className="plan_page">
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
                          defaultChecked={formData.category === "postpaid"}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            handleInput(e.target);
                          }}
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
                          defaultChecked={formData.category === "prepaid"}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            handleInput(e.target);
                          }}
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
                          defaultChecked={formData.type === "unlimited"}
                          onChange={(e) => {
                            setType(e.target.value);
                            handleInput(e.target);
                          }}
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
                          defaultChecked={formData.type === "data"}
                          onChange={(e) => {
                            setType(e.target.value);
                            handleInput(e.target);
                          }}
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

          {/* toggle  */}
          <div className="mt-3 col-md-12">
            <div className="labels mb-4">Do you want to activate this plan?</div>
            <div className="custom-control  custom-control-sm custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customSwitch1"
                defaultChecked={formData.active_status}
                name="active_status"
                onChange={(e) => {
                  handleInput({ name: e.target.name, value: e.target.checked });
                  handlePlanActivationChange(e);
                }}
              />
              <label className="custom-control-label f-16 text-black" htmlFor="customSwitch1">
                {isPlanActivated ? "No" : "Yes"}
              </label>
            </div>
          </div>
          <div className="mt-3 col-md-12">
            <div className="labels mb-4">
              Make this plan <span style={{ fontWeight: "bolder" }}>"Popular Plan"</span>
            </div>
            <div className="custom-control  custom-control-sm custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customSwitch2"
                name="popular_plan"
                defaultChecked={formData.popular_plan}
                onChange={(e) => {
                  handleInput({ name: e.target.name, value: e.target.checked });
                  handlePopularPlanChange(e);
                }}
              />
              <label className="custom-control-label f-16 text-black" htmlFor="customSwitch2">
                {isPopularPlan ? "On" : "Off"}
              </label>
            </div>
          </div>

          {/* plan Name */}

          <div className="col-md-12 mt-5 flex justify-content-between " onClick={toggleShowMoreFour}>
            <div className="labelsHeading">Plan Details</div>
            <div className="labelsHeading" style={{ cursor: "pointer" }}>
              {showMoreFour ? "show less" : "show more"}
              {showMoreFour ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className={style.horizontal}>
            <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
          </div>

          {showMoreFour && (
            <>
              <Label className="labels mt-2 px-3">
                Plan Name<span className="text-danger">*</span>
              </Label>

              <div className={`${style.main_grid_container} px-3`}>
                <div>
                  <Input
                    placeholder="Enter Plan Name"
                    name="plan_name"
                    defaultValue={formData?.plan_name}
                    className={vaildData?.plan_name ? "border border-danger" : ""}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.plan_name && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
                {/* <div>
                  <Input
                    placeholder="Rs."
                    type="number"
                    name="amount"
                    className={vaildData?.amount ? "border border-danger" : ""}
                    value={formData?.amount}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.amount && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div> */}
              </div>

              {/* <Label className="labels mt-4 px-3">
                Billing Cycle <span className="text-danger">*</span>
              </Label>

              <div className={`${style.main_grid_container} px-3`}>
                <div>
                  <SingleSelect
                    options={billingCycle}
                    placeItem="Billing Cycle"
                    name="billingCycleType"
                    className={vaildData?.billingCycleType ? "border border-danger" : ""}
                    value={formData?.billingCycleType}
                    onChange={(e) => {
                      handleBillOption(e.target.value);
                      handleInput(e.target);
                    }}
                  />{" "}
                  {vaildData?.billingCycleType && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    className={`form-control ${vaildData?.billingCycleDate ? "border border-danger" : ""}`}
                    placeholder="Time Period"
                    value={formData?.billingCycleDate}
                    name="billingCycleDate"
                    onChange={(e) => {
                      handleInput(e.target);
                    }}
                    disabled={isDisabled}
                  />
                  {vaildData?.billingCycleDate && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div> */}

              <div className="col-md-12 mt-4 ">
                <Label className="labels">
                  Short Description<span className="text-danger">*</span>
                </Label>
                <div className="w-100">
                  <textarea
                    placeholder="Enter Short Description"
                    name="shortDescription"
                    className={`form-control ${vaildData?.shortDescription ? "mb-2 border border-danger" : "mb-2"}`}
                    defaultValue={formData?.shortDescription}
                    onChange={(e) => {
                      handleInput(e.target);
                    }}
                  />
                  {vaildData?.shortDescription && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              {/* {((category === "postpaid" && type === "data") || (category === "prepaid" && type === "data")) && (
                <>
                  <Label className="labels mt-2 px-3">
                    Data Limit<span className="text-danger">*</span>
                  </Label>

                  <div className={`${style.main_grid_container} px-3`}>
                    <div>
                      <Input
                        type="number"
                        placeholder="Enter Max Data Value"
                        name="limit_download_speed"
                        className={vaildData?.limit_download_speed ? "border border-danger" : ""}
                        defaultValue={formData?.limit_download_speed}
                        onChange={(e) => handleInput(e.target)}
                      />
                      {vaildData?.limit_download_speed && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </div>
                    <div>
                      <SingleSelect
                        options={dataSpeed}
                        placeItem="Download Speed"
                        name="limit_download_speed_unit"
                        className={vaildData?.limit_download_speed_unit ? "border border-danger" : ""}
                        value={formData?.limit_download_speed_unit}
                        onChange={(e) => handleInput(e.target)}
                      />
                      {vaildData?.limit_download_speed_unit && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {((category === "prepaid" && type === "data") || (category === "postpaid" && type === "data")) && (
                    <div className="col-md-12">
                      <div className="mt-3">
                        <span className="light_heading">Limitation:</span>
                        <div className="mt-2 mb-1 col-md-6 p-0">
                          <div className="custom-control  custom-control-sm custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customSwitch34"
                              name="limitation"
                              defaultChecked={formData?.limitation}
                              onChange={(e) => handleInput({ name: e.target.name, value: e.target.checked })}
                            />
                            <label className="custom-control-label f-16 text-black" htmlFor="customSwitch34">
                              Daily
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )} */}
            </>
          )}

          {/* Billing cycle */}

          <div className="col-md-12 mt-3 flex justify-content-between " onClick={toggleShowMoreSix}>
            <div className="labelsHeading">Billing</div>
            <div className="labelsHeading" style={{ cursor: "pointer" }}>
              {showMoreSix ? "show less" : "show more"}
              {showMoreSix ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className={style.horizontal}>
            <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
          </div>

          {showMoreSix && (
            <>
              <Label className="labels mt-2 px-3">
                Plan Price<span className="text-danger">*</span>
              </Label>

              <div className={`${style.main_grid_container3} px-3`}>
                <div>
                  <Input
                    placeholder="Rs."
                    type="number"
                    name="amount"
                    className={vaildData?.amount ? "border border-danger" : ""}
                    value={formData?.amount}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.amount && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
                {/* <div>
                  <Input
                    placeholder="Rs."
                    type="number"
                    name="amount"
                    className={vaildData?.amount ? "border border-danger" : ""}
                    value={formData?.amount}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.amount && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div> */}
              </div>

              <Label className="labels mt-4 px-3">
                Billing Cycle <span className="text-danger">*</span>
              </Label>

              <div className={`${style.main_grid_container3} px-3`}>
                <div>
                  <SingleSelect
                    options={billingCycle}
                    placeItem="Billing Cycle"
                    name="billingCycleType"
                    className={vaildData?.billingCycleType ? "border border-danger" : ""}
                    value={formData?.billingCycleType}
                    onChange={(e) => {
                      handleBillOption(e.target.value);
                      handleInput(e.target);
                    }}
                  />{" "}
                  {vaildData?.billingCycleType && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    className={`form-control ${vaildData?.billingCycleDate ? "border border-danger" : ""}`}
                    placeholder="Time Period"
                    value={formData?.billingCycleDate}
                    name="billingCycleDate"
                    onChange={(e) => {
                      handleInput(e.target);
                    }}
                    disabled={isDisabled}
                  />
                  {vaildData?.billingCycleDate && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>

              {/* <div className="row mt-4 border col-md-12"> */}
              <div className="col-md-6 percent_Icon_Set_main">
                <Label className="labels mt-4 ">CGST (If Applicable)</Label>
                <input
                  type="number"
                  placeholder="Enter CGST in percent"
                  className="form-control"
                  value={formData?.cgst}
                  name="cgst"
                  onChange={(e) => {
                    handleInput(e.target);
                  }}
                />
                <FiPercent className="percent_Icon_Set_child1" />
              </div>
              <div className="col-md-6 percent_Icon_Set_main">
                <Label className="labels mt-4">SGST (If Applicable)</Label>
                <input
                  type="number"
                  placeholder="Enter SGST in percent"
                  className="form-control"
                  value={formData?.sgst}
                  name="sgst"
                  onChange={(e) => {
                    handleInput(e.target);
                  }}
                />
                <FiPercent className="percent_Icon_Set_child1" />
              </div>

              {/* </div> */}
              <div className="col-md-6 percent_Icon_Set_main">
                <Label className="labels mt-4">Service Tax (If Applicable)</Label>
                <input
                  type="number"
                  placeholder="Enter Discount in percent"
                  className="form-control"
                  value={formData?.service_tax}
                  name="service_tax"
                  onChange={(e) => {
                    handleInput(e.target);
                  }}
                />
                <FiPercent className="percent_Icon_Set_child1" />
              </div>
             
            </>
          )}

          {/* Bandwidth */}

          <div className="col-md-12 mt-3 flex justify-content-between " onClick={toggleShowMoreSeven}>
            <div className="labelsHeading">Bandwidth</div>
            <div className="labelsHeading" style={{ cursor: "pointer" }}>
              {showMoreSeven ? "show less" : "show more"}
              {showMoreSeven ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className={style.horizontal}>
            <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
          </div>
          {showMoreSeven && (
            <>
              <Label className="labels mt-2 px-3">
                Choose Bandwidth Template<span className="text-danger">*</span>
              </Label>

              <div className={`${style.main_grid_container4} px-3`}>
                <SingleSelect
                  className={`${vaildData?.bandwidth_id? "border border-danger" : ""}`}
                  placeItem="Bandwidth template"
                  options={getAllBandwidth.map((res) => {
                    return {
                      value: res._id,
                      label: res.name,
                    };
                  })}
                  name="id"
                  value={formData?.bandwidth?.id}
                  onChange={(e) => {
                    handleInput(e.target, "bandwidth");
                  }}
                />
                {vaildData?.bandwidth_id && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>

              

              <div className={`col-md-6 mt-2`}>
              <label className="">
                Select Option <span className="text-danger">*</span>
              </label>
                  <SingleSelect
                  className={`${vaildData?.bandwidth_option? "border border-danger" : ""}`}
                    options={type === "data"?downloadOption1:downloadOption}
                    placeItem="option"
                    name="option"
                    value={formData?.bandwidth?.option}
                    onChange={(e) => {
                      handleInput(e.target, "bandwidth");
                    }}
                  />
                  {vaildData?.bandwidth_option && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
                
              </div>

              <div className="col-md-3 mt-2">
                <label>
                  Data <span className="text-danger">*</span>
                </label>
                <input
                 className={`form-control ${vaildData?.data_quantity? "border border-danger" : ""}`}
                  type="number"
                  placeholder="Enter Data"
                  name="quantity"
                  value={formData?.data?.quantity}
                  onChange={(e) => {
                    handleInput(e.target, "data");
                  }}
                />
                {vaildData?.data_quantity && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div className="col-md-3 mt-3">
                <label htmlFor=""></label>
                <SingleSelect
                  placeItem="unit"
                  className={`form-control ${vaildData?.data_unit? "border border-danger" : ""}`}
                  options={speed}
                  name="unit"
                  value={formData?.data?.unit}
                  onChange={(e) => {
                    handleInput(e.target, "data");
                  }}
                />
                {vaildData?.data_unit && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div className="col-md-6 mt-2">
                <label>Reset Every</label>
                <SingleSelect
                  placeItem=""
                  className={`form-control ${vaildData?.data_reset_every? "border border-danger" : ""}`}
                  options={billingCycle}
                  name="reset_every"
                  value={formData?.data?.reset_every}
                  onChange={(e) => {
                    handleInput(e.target, "data");
                  }}
                />
                {vaildData?.data_reset_every && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div className="mt-3 col-md-12 px-3">
                <div className="if_Exceed">If Exceed</div>
              </div>

              <div className={`col-md-6 px-3 mt-3`}>
                <Label className="labels ">
                  Select Option <span className="text-danger">*</span>
                </Label>
                <div>
                  <SingleSelect
                    options={billingCycle1}
                    placeItem="option"
                    name="option"
                    className={`${vaildData?.optional_bandwidth_option? "border border-danger" : ""}`}
                    value={formData?.optional_bandwidth?.option}
                    onChange={(e) => {
                      handleInput(e.target, "optional_bandwidth");
                    }}
                  />
                  {vaildData?.optional_bandwidth_option && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
                </div>
              </div>

              <div className={`col-md-6 mt-3 px-3`}>
                <Label className="labels">
                  Choose Bandwidth Template<span className="text-danger">*</span>
                </Label>
                <SingleSelect
                  placeItem="Bandwidth template"
                  className={`${vaildData?.optional_bandwidth_id? "border border-danger" : ""}`}
                  options={getAllBandwidth.map((res) => {
                    return {
                      value: res._id,
                      label: res.name,
                    };
                  })}
                  name="id"
                  value={formData?.optional_bandwidth?.id}
                  onChange={(e) => {
                    handleInput(e.target, "optional_bandwidth");
                  }}
                />
                {vaildData?.optional_bandwidth_id && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
            </>
          )}

          {/* OverRide Bandwidth */}

          <div className="col-md-12 mt-3 flex justify-content-between " onClick={toggleShowMoreEight}>
            <div className="labelsHeading">Override Bandwidth</div>
            <div className="labelsHeading" style={{ cursor: "pointer" }}>
              {showMoreEight ? "show less" : "show more"}
              {showMoreEight ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className={style.horizontal}>
            <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
          </div>
          {showMoreEight && (
            <>
              <div className="check_box mt-3 px-3">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    defaultChecked={formData?.restrict_day_time}
                    id="checkbox123"
                    name="restrict_day_time"
                    onChange={(e) => {
                      handleInput({ value: e.target.checked, name: "restrict_day_time" }, "restrict_day_time");
                      setCkeckedRes(e.target.checked);
                      
                    }}
                  />
                  <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                    Restrict the time of the day when internet is used?
                  </Label>
                </FormGroup>
              </div>
              {formData?.restrict_day_time === true ? (
                <>
                  <div className={`${style.main_grid_container4} mt-3 px-3`}>
                    <Label className="labels mt-2">
                      Choose Bandwidth Template
                    </Label>
                    <SingleSelect
                      placeItem="Bandwidth template"
                      options={getAllBandwidth.map((res) => {
                        return {
                          value: res._id,
                          label: res.name,
                        };
                      })}
                      value={formData?.override_bandwidth}
                      name="override_bandwidth"
                      onChange={(e) => {
                        handleInput(e.target, "override_bandwidth");
                      }}
                    />
                  </div>
                  <div className="check_box mt-4 px-3 col-md-12">
                    <FormGroup check className="d-flex align-items-center">
                      <input
                        class="form-check-input input"
                        type="checkbox"
                        defaultChecked={formData?.if_data_exceeds_override_bandwidth}
                        name="if_data_exceeds_override_bandwidth"
                        id="checkbox123"
                        onChange={(e) => {
                          handleInput(
                            { value: e.target.checked, name: "if_data_exceeds_override_bandwidth" },
                            "if_data_exceeds_override_bandwidth"
                          );
                        }}
                      />
                      <div className="if_Exceed ml-3">If Exceed</div>
                    </FormGroup>
                  </div>
                  {formData?.if_data_exceeds_override_bandwidth === true ? (
                    <>
                      <div className={`${style.main_grid_container4} mt-4 px-3`}>
                        <Label className="labels mt-2">
                          Choose Bandwidth Template
                        </Label>
                        <SingleSelect
                          placeItem="Bandwidth template"
                          options={getAllBandwidth.map((res) => {
                            return {
                              value: res._id,
                              label: res.name,
                            };
                          })}
                          name="optional_override_bandwidth"
                          value={formData?.optional_override_bandwidth}
                          onChange={(e) => {
                            handleInput(e.target, "optional_override_bandwidth");
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  <div className="mt-4 px-3 col-md-12">Select timings when bandwidth has to be overidden?</div>
                  <div className="mt-3 px-3 ">
                    <table className="table table-bordered">
                      <thead>
                        <tr className="table-heading-size">
                          <th>Day of Week</th>
                          <th>Don't Override for Entire Day?</th>
                          <th>From Time</th>
                          <th>To Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((res, index) => (
                          <tr key={index}>
                            <td>{res.day}</td>
                            <td className="">
                              <FormGroup check className="mt-1 ml-2 align-items-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`checkbox-${index}`}
                                  checked={res?.do_not_override_for_entire_day}
                                  onChange={(e) => {
                                    handleTimeChange(index, "do_not_override_for_entire_day", e.target.checked);
                                    if (e.target.checked) {
                                      handleTimeChange(index, "from", "");
                                      handleTimeChange(index, "to", "");
                                    }
                                  }}
                                />
                              </FormGroup>
                            </td>
                            <td>
                              <TimePicker
                                value={tableData[index].from}
                                onChange={(value) => handleTimeChange(index, "from", value)}
                                showSecond={false}
                                use12Hours
                                inputReadOnly
                                disabled={tableData[index].do_not_override_for_entire_day}
                                // className="form-control"
                              />
                            </td>
                            <td>
                              <TimePicker
                                value={tableData[index].to}
                                onChange={(value) => handleTimeChange(index, "to", value)}
                                showSecond={false}
                                use12Hours
                                inputReadOnly
                                disabled={tableData[index].do_not_override_for_entire_day}

                                // className="form-control"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}

          {/* Auto bind mac */}

          <div className="col-md-12 mt-3 flex justify-content-between " onClick={toggleShowMoreNine}>
            <div className="labelsHeading">Auto Bind Mac</div>
            <div className="labelsHeading" style={{ cursor: "pointer" }}>
              {showMoreNine ? "show less" : "show more"}
              {showMoreNine ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className={style.horizontal}>
            <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
          </div>
          {showMoreNine && (
            <>
              <div className="check_box mt-3 px-3">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    defaultChecked={formData?.on_first_login_auto_bind_mac}
                    name="on_first_login_auto_bind_mac"
                    id="checkbox123"
                    onChange={(e) => {
                      handleInput(
                        { value: e.target.checked, name: "on_first_login_auto_bind_mac" },
                        "on_first_login_auto_bind_mac"
                      );
                      setCheckedLogin(e.target.checked);
                    }}
                  />
                  <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                    Auto bind MAC to the user on first login?
                  </Label>
                </FormGroup>
              </div>
              {formData?.on_first_login_auto_bind_mac === true ? (
                <>
                  <div className={`${style.main_grid_container4} mt-3 px-3`}>
                    <Label className="labels mt-2">
                      Number of MAC's to bind 
                    </Label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Enter number mac's"
                      name="no_mac_bind"
                      value={formData?.no_mac_bind}
                      onChange={(e) => {
                        handleInput(e.target, "no_mac_bind");
                      }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}

          {/* Mac restriction */}

          <div className="col-md-12 mt-3 flex justify-content-between " onClick={toggleShowMoreTen}>
            <div className="labelsHeading">MAC Restriction</div>
            <div className="labelsHeading" style={{ cursor: "pointer" }}>
              {showMoreTen ? "show less" : "show more"}
              {showMoreTen ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className={style.horizontal}>
            <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
          </div>
          {showMoreTen && (
            <>
            <div className="align-items-center">
              <div className="check_box mt-3 px-3">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    defaultChecked={formData?.mac_restriction}
                    name="mac_restriction"
                    id="checkbox123"
                    onChange={(e) => {
                      handleInput({ value: e.target.checked, name: "mac_restriction" }, "mac_restriction");
                    }}
                  />
                  <Label className="ml-2 pt-3 f-14" for="checkbox123" check>
                    Allow only devices whose MAC addresses are configured in each user to login with the corresponding
                    user name? if MAC address is not specified for the user, then login wil be permitted.
                  </Label>
                </FormGroup>
              </div>
              </div>
            </>
          )}

          {/* Internet speed  */}
          {/* <div className="col-md-12 mt-3 flex justify-content-between" onClick={toggleShowMoreOne}>
            <div className="labelsHeading">Internet Speed</div>
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
            <hr />
          </div>
          {showMoreOne && (
            <>
              <Label className="labels mt-2 px-3">
                Download Speed<span className="text-danger">*</span>
              </Label>

              <div className={`${style.main_grid_container2} px-3`}>
                <div>
                  <Input
                    type="number"
                    placeholder="Enter Download Speed"
                    name="download_speed"
                    className={`pl-3 ${vaildData?.download_speed ? "border border-danger" : ""}`}
                    defaultValue={formData?.download_speed}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.download_speed && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
                <div>
                  <SingleSelect
                    options={speed}
                    placeItem="Download Speed"
                    name="download_speed_unit"
                    className={vaildData?.download_speed_unit ? "border border-danger" : ""}
                    value={formData?.download_speed_unit}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.download_speed_unit && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <Label className="labels mt-4 px-3">
                Upload Speed<span className="text-danger">*</span>
              </Label>

              <div className={`${style.main_grid_container2} px-3 mb-4 ml-md-0 ml-sm-0 ml-1`}>
                <div>
                  <Input
                    type="number"
                    placeholder="Enter upload Speed"
                    name="upload_speed"
                    className={`pl-3 ${vaildData?.upload_speed ? "border border-danger" : ""}`}
                    defaultValue={formData?.upload_speed}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.upload_speed && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
                <div>
                  <SingleSelect
                    options={speed}
                    placeItem="Upload Speed"
                    className={vaildData?.upload_speed_unit ? "border border-danger" : ""}
                    name="upload_speed_unit"
                    value={formData?.upload_speed_unit}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.upload_speed_unit && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
            </>
          )} */}

          {/* Burst Limit  */}
          {/* <div className="col-md-12 mt-3 flex justify-content-between" onClick={toggleShowMoreThree}>
            <div className="labelsHeading">Burst Limit(Optional)</div>
            <div className="labelsHeading d-flex" style={{ cursor: "pointer" }}>
              {showMoreThree ? "show less" : "show more"}
              {showMoreThree ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className={style.horizontal}>
            <hr />
          </div>
          {showMoreThree && (
            <>
              <div className={`${style.main_grid_container2} px-3 mt-2`}>
                <div>
                  <Input
                    className="pl-3"
                    type="number"
                    placeholder="Burst Download"
                    name="download"
                    defaultValue={formData?.burst_limit?.download}
                    onChange={(e) => handleInputburst(e.target)}
                  />
                </div>
                <div>
                  <SingleSelect
                    options={speed}
                    placeItem="Download Unit"
                    name="download_unit"
                    value={formData?.burst_limit?.download_unit}
                    onChange={(e) => handleInputburst(e.target)}
                  />
                </div>
              </div>
              <div className={`${style.main_grid_container2} px-3 mt-4`}>
                <div>
                  <Input
                    className="pl-3"
                    type="number"
                    placeholder="Burst upload"
                    name="upload"
                    defaultValue={formData?.burst_limit?.upload}
                    onChange={(e) => handleInputburst(e.target)}
                  />
                </div>
                <div>
                  <SingleSelect
                    options={speed}
                    name="upload_unit"
                    value={formData?.burst_limit?.upload_unit}
                    placeItem="Download Unit"
                    onChange={(e) => handleInputburst(e.target)}
                  />
                </div>
              </div>
              <div className={`${style.main_grid_container2} px-3 mt-4`}>
                <div>
                  <Input
                    className="pl-3"
                    type="number"
                    placeholder="Burst Threshold (Download)"
                    name="threshold_download"
                    defaultValue={formData?.burst_limit?.threshold_download}
                    onChange={(e) => handleInputburst(e.target)}
                  />
                </div>
                <div>
                  <SingleSelect
                    options={dataSpeed}
                    name="threshold_download_unit"
                    placeItem="Download Unit"
                    value={formData?.burst_limit?.threshold_download_unit}
                    onChange={(e) => handleInputburst(e.target)}
                  />
                </div>
              </div>
              <div className={`${style.main_grid_container2} px-3 mt-4`}>
                <div>
                  <Input
                    className="pl-3"
                    type="number"
                    placeholder="Burst Threshold (Upload)"
                    name="threshold_upload"
                    defaultValue={formData?.burst_limit?.threshold_upload}
                    onChange={(e) => handleInputburst(e.target)}
                  />
                </div>
                <div>
                  <SingleSelect
                    options={dataSpeed}
                    placeItem="Download Unit"
                    name="threshold_upload_unit"
                    value={formData?.burst_limit?.threshold_upload_unit}
                    onChange={(e) => handleInputburst(e.target)}
                  />
                </div>
              </div>
             
              <div className="col-md-12 mt-4">
                <Input
                  type="text"
                  placeholder="Burst Time(Download)"
                  name="download_time"
                  defaultValue={formData?.burst_limit?.download_time}
                  onChange={(e) => handleInputburst(e.target)}
                />
              </div>

              <div className="col-md-12 mt-4 mb-4">
                <Input
                  type="text"
                  placeholder="Burst Time(Upload)"
                  name="upload_time"
                  defaultValue={formData?.burst_limit?.upload_time}
                  onChange={(e) => handleInputburst(e.target)}
                />
              </div>
            </>
          )} */}

          {/* other Details  */}
          <div className="col-md-12 mt-3 flex justify-content-between" onClick={toggleShowMoreFive}>
            <div className="labelsHeading">Other Details</div>
            <div className="labelsHeading" style={{ cursor: "pointer" }}>
              {showMoreFive ? "show less" : "show more"}
              {showMoreFive ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className={style.horizontal}>
            <hr />
          </div>
          {showMoreFive && (
            <>
              <div className="col-md-12 mt-2 ">
                <Label className="labels">
                  Ideal For<span className="text-danger">*</span>
                </Label>
                <div className="col-md-12 p-0">
                  <textarea
                    placeholder="Enter Details"
                    name="ideal_for"
                    className={`form-control ${vaildData?.ideal_for ? "border border-danger" : ""}`}
                    defaultValue={`${formData?.ideal_for}${
                      formData?.ideal_for_unit !== undefined ? ` ${formData?.ideal_for_unit}` : ""
                    }`}
                    onChange={(e) => handleInput(e.target)}
                  />
                  {vaildData?.ideal_for && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-12 mt-4 ">
                <Label className="labels">
                  Features<span className="text-danger">*</span>
                </Label>
              </div>
              <div className={`${style.featureInput} col-md-12`}>
                {features.map((feature, index) => (
                  <div className="">
                    <div className="w-100 p-0">
                      <textarea
                        placeholder="Enter Detail"
                        name=""
                        value={feature}
                        className={`form-control ${
                          vaildData?.features && feature.trim().length === 0 ? "border border-danger" : ""
                        }`}
                        onChange={(e) => {
                          let keyData = features;
                          keyData[index] = e.target.value;
                          setFeatures(keyData);
                          handleInput({ name: "features", value: keyData });
                        }}
                      />
                      {vaildData?.features && feature.trim().length === 0 && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </div>
                    {features.length > 1 && index !== 0 ? (
                      <>
                        <div
                          className="text-danger f-14 fw-500 mt-2 text-right pointer"
                          onClick={() => removeFeature(index)}
                        >
                          Delete
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
              <div className="col-md-12 mt-4" onClick={addFeature} style={{ cursor: "pointer" }}>
                <IoMdAdd /> Add Features
              </div>
              <div className="row pl-3 w-100">
                {attributesData.map((res, index) => (
                  <>
                    <div className="col-md-8 mt-4">
                      <Label className="labels ">{`${res.field_name} ${
                        res.field_name_unit ? res.field_name_unit : ""
                      }`}</Label>
                      <div className="d-flex align-items-center">
                        <div className="p-0 w-100">
                          <Input
                            className={`w-100 ${res.field_value.length !== 0 ? "" : "border border-danger"}`}
                            placeholder="Enter Details"
                            defaultValue={res.field_value}
                            onChange={(e) => addvalueAttribute(index, e.target.value)}
                          />
                        </div>

                        <span
                          onClick={() => removeAttribute(index, false)}
                          style={{ fontSize: "15px", marginLeft: "17px", cursor: "pointer" }}
                          className=""
                        >
                          <ImCross />
                        </span>
                      </div>
                      {res.field_value.length == 0 && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </div>
                  </>
                ))}
              </div>
              <div className="labels col-md-12 mt-5">Attributes</div>
              {attributes.map((attribute, index) => (
                <div className="col-md-12 mt-4 d-flex" key={index}>
                  <div className={`col-md-8 p-0 ${style.inputContainer}`}>
                    <>
                      <Input
                        onChange={(e) => {
                          const newAttributes = [...attributes];
                          newAttributes[index] = e.target.value;
                          setAttributes(newAttributes);
                        }}
                        placeholder="Enter Detail"
                        className={style.inputWithText}
                        value={attributes[index]}
                      />

                      <span
                        className={`${style.actionText} ${style.addText}`}
                        onClick={() => {
                          if (attributes[index] == "") {
                            return;
                          }
                          setAttributesData((pre) => [
                            ...pre,
                            {
                              field_name: attributes[index],
                              field_value: "",
                            },
                          ]);
                          // if(attributesData == 0){
                          let ff = [...formData.attributes];
                          let newFF = [
                            ...ff,
                            {
                              field_name: attributes[index],
                              field_value: "",
                            },
                          ];
                          setFormData((pre) => {
                            return {
                              ...pre,
                              attributes: newFF,
                            };
                          });
                          // }
                          removeAttribute(index, true);
                        }}
                      >
                        Add
                      </span>
                      <span
                        className={`${style.actionText} ${style.deleteText}`}
                        onClick={() => removeAttribute(index, true)}
                      >
                        Delete
                      </span>
                    </>
                  </div>
                </div>
              ))}

              <div className="col-md-12 mt-4">
                <button className="btn parimary-color lighterColor d-flex align-items-center" onClick={addAttribute}>
                  {" "}
                  <IoMdAdd />
                  Add Attribute
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PlanPage;
