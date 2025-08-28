import React, { useEffect, useState } from "react";
import {
  Col,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import moment from "moment";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import style from "./Plans.module.css";
import TimePicker from "rc-time-picker";
import { FiPercent } from "react-icons/fi";

function ViewPage({ open, setOpen, fullData }) {
  const toggle = () => setOpen({ status: !open });
  const [activeTab, setActiveTab] = useState("1");
  const [data, setData] = useState({});
  const [showMoreOne, setShowMoreOne] = useState(false);
  const [showMoreTwo, setShowMoreTwo] = useState(false);
  const [showMoreFour, setShowMoreFour] = useState(false);
  const [showMoreFive, setShowMoreFive] = useState(false);
  const [showMoreSix, setShowMoreSix] = useState(false);
  const [showMoreSeven, setShowMoreSeven] = useState(false);
  const [showMoreEight, setShowMoreEight] = useState(false);

  

  const [check, setCheck] = useState(false);

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const toggleShowMoreOne = () => {
    setShowMoreOne(!showMoreOne);
  };
  const toggleShowMoreTwo = () => {
    setShowMoreTwo(!showMoreTwo);
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

  // 

  const [splitData, setSplitData] = useState([]);
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  function splitAndAddUnitValues(obj) {
    let result = deepCopy(obj); // Create a deep copy of the original object

    function recurse(obj) {
      for (let key in obj) {
        if (key !== "features" && key !== "upload_time" && key !== "download_time") {
          if (obj.hasOwnProperty(key) && typeof obj[key] === "string") {
            let parts = obj[key].split(" ");
            if (parts.length === 2) {
              let [baseValue, unit] = parts;
              obj[key] = baseValue;
              obj[`${key}_unit`] = unit;
            }
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            recurse(obj[key]); // Recursively handle nested objects
          }
        }
      }
    }

    recurse(result);
    return result;
  }
  const getPlanData = async (data) => {
    try {
      setData(data);
      const splitSpeedData = splitAndAddUnitValues(data);

      setSplitData(splitSpeedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (fullData) {
      getPlanData(fullData);
    }
  }, [fullData]);
  const burstLimitContition = (key, unitKey) => {
    if (
      splitData.burst_limit[key] &&
      splitData.burst_limit[unitKey] &&
      splitData.burst_limit[key].length !== 0 &&
      splitData.burst_limit[unitKey].length !== 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (fullData && fullData.burst_limit) {
      const isBurstLimitEmpty = Object.values(fullData.burst_limit)?.every((value) => value?.trim()?.length === 0);
      setCheck(isBurstLimitEmpty);
      // 
    }
  }, [fullData]);

  return (
    <>
      <Modal scrollable={true} isOpen={open} toggle={open} className="" size="lg">
        <ModalHeader toggle={toggle} className="d flex align-items-center justify-content-between">
          <div className="">
            <span className="f-28">View Plan</span>
          </div>
        </ModalHeader>

        <ModalBody>
          {/* <div className="d-flex justify-content-between align-items-center">
            <div className="f-28"> View Plan</div>
            <IoClose className="f-20 pointer" onClick={() => {
              setOpen(false)
            }} />
          </div> */}
          <div>
            <Nav>
              <NavItem>
                <NavLink
                  className="labelsHeading "
                  onClick={() => toggleTab("1")}
                  style={{ color: "var(--label-color)" }}
                ></NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    {/* some tag */}

                    <>
                      <div className="flex between align-items-center">
                        <span className="labelsHeading" style={{ fontSize: "20px" }}>
                          {data?.plan_name}
                        </span>
                        <button className={data?.active_status === true ? "activeBtn" : "inactiveBtn"}>
                          {data?.active_status === true ? "Active" : "Inactive"}
                        </button>
                      </div>
                      <div className="fs-md-2">
                        <span className="labelsHeading">
                          {`Created On : ${moment(data?.createdAt).format("DD-MM-YYYY")}`}
                        </span>
                      </div>

                      <div className="row mt-md-5 mt-sm-4 mt-3">
                        <div className="col-lg-3 col-md-4 col-sm-5 col-5">
                          <div className="statusBox g-1 flex">
                            <span className="statusLabel">
                              {" "}
                              {data?.category?.charAt(0).toUpperCase() + data?.category?.slice(1)}
                            </span>
                            <span className="viewLabels">Category</span>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-5 col-5">
                          <div className="statusBox g-1 flex">
                            <span className="statusLabel">
                              {" "}
                              {data?.type?.charAt(0).toUpperCase() + data?.type?.slice(1)}
                            </span>
                            <span className="viewLabels">Type</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-md-12 mt-md-5 mt-sm-4 mt-4 p-0 flex justify-content-between"
                        onClick={toggleShowMoreOne}
                      >
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
                      <div className="horizontal">
                        <hr />
                      </div>
                      {showMoreOne && (
                        <>
                          <div className="mt-4">
                            {/* <div className="light_heading">Plan Details</div> */}
                            <div>
                              <div className="viewLabels mt-4 mb-2">Plan Name</div>
                              <div className="flex g-1">
                                <div className="boxBackground">
                                  <span className="viewLabels">{data?.plan_name}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="viewLabels mt-4 mb-2">Short Description</div>
                              <div className="mt-1 flex g-1">
                                <div className="boxBackground">
                                  <span className="viewLabels">{data?.shortDescription}</span>
                                </div>
                              </div>
                            </div>
                            {/* {data.type == "data" ? (
                              <>
                                <div>
                                  <div className="viewLabels mt-4 mb-2">Data Limit</div>
                                  <div className="mt-1 flex g-1">
                                    <div className="boxBackground">
                                      <span className="viewLabels">{data?.limit_download_speed}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="viewLabels mt-4 mb-2">Daily Limitation</div>
                                  <div className="mt-1 flex g-1">
                                    <div className="boxBackground">
                                      <span className="viewLabels">{data?.limitation ? "On" : "Off"}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              ""
                            )} */}
                          </div>
                        </>
                      )}

                      <div className="col-md-12 mt-4 p-0 flex justify-content-between" onClick={toggleShowMoreSix}>
                        <div className="labelsHeading">Billing Cycle</div>
                        <div className="labelsHeading" style={{ cursor: "pointer" }}>
                          {showMoreSix ? "show less" : "show more"}
                          {showMoreSix ? (
                            <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                          ) : (
                            <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                          )}
                        </div>
                      </div>
                      <div className="horizontal">
                        <hr />
                      </div>
                      {showMoreSix && (
                        <>
                          <div className="">
                            {/* <div className="light_heading">Plan Details</div> */}
                            <div>
                              <div className="viewLabels mt-4 mb-2">Plan Rate</div>
                              <div className="flex g-1">
                                <div className="boxBackground">
                                  <span className="viewLabels">Rs. {data?.amount}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="viewLabels mt-4 mb-2">Billing Cycle and Time Period</div>
                              <div className="mt-1 flex g-1">
                                <div className="boxBackground">
                                  <span className="viewLabels">{data?.billingCycleType}</span>
                                </div>
                                {data?.billingCycleType !== "Daily" && (
                                  <>
                                    <div className="boxBackground">
                                      <span className="viewLabels">
                                        {data.billingCycleType == "Yearly"
                                          ? months[data?.billingCycleDate]
                                          : data?.billingCycleDate}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-md-3 percent_Icon_Set_main">
                                <label>CGST</label>
                                <input type="" className="form-control" disabled value={data?.cgst} />
                                <FiPercent className="percent_Icon_Set_child2" />
                              </div>
                              <div className="col-md-3 percent_Icon_Set_main">
                                <label>SGST</label>
                                <input type="" className="form-control" disabled value={data?.sgst} />
                                <FiPercent className="percent_Icon_Set_child2" />
                              </div>
                              <div className="col-md-3 percent_Icon_Set_main">
                                <label>Service Tax</label>
                                <input type="" className="form-control" disabled value={data?.service_tax} />
                                <FiPercent className="percent_Icon_Set_child2" />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* internet speed  */}
                      <div className="col-md-12 mt-4 p-0 flex justify-content-between" onClick={toggleShowMoreTwo}>
                        <div className="labelsHeading">Bandwidth</div>
                        <div className="labelsHeading" style={{ cursor: "pointer" }}>
                          {showMoreTwo ? "show less" : "show more"}
                          {showMoreTwo ? (
                            <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                          ) : (
                            <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                          )}
                        </div>
                      </div>
                      <div className="horizontal">
                        <hr />
                      </div>
                      {showMoreTwo && (
                        <>
                          <div className="row px-3">
                            <div className="col-md-5 p-0">
                              <label className="viewLabels  mb-2">Choose Bandwidth Template</label>
                              <input type="text" className="form-control" value={data?.bandwidth_info?.name} disabled />
                            </div>
                            <div className="col-md-5 ml-2 p-0">
                              <label className="viewLabels  mb-2">Option</label>
                              <input type="text" disabled className="form-control" value={data?.bandwidth?.option} />
                            </div>
                          </div>
                          <div className="row mt-3 px-3">
                            <div className="col-md-3 p-0">
                              <label className="viewLabels  mb-2">Data</label>
                              <input type="text" className="form-control" value={data?.data?.quantity} disabled />
                            </div>
                            <div className="col-md-3 ml-2 p-0">
                              <label className="viewLabels  mb-2">Speed</label>
                              <input type="text" className="form-control" value={data?.data?.unit} disabled />
                            </div>
                            <div className="col-md-3 ml-2 p-0">
                              <label className="viewLabels  mb-2">Reset Every</label>
                              <input type="text" className="form-control" value={data?.data?.reset_every} disabled />
                            </div>
                          </div>
                          <div className="row mt-3 px-3">
                          <div className="col-md-5 mr-2 p-0">
                              <label className="viewLabels  mb-2">Option</label>
                              <input type="text" disabled className="form-control" value={data?.optional_bandwidth?.option} />
                            </div>
                          <div className="col-md-5 p-0">
                              <label className="viewLabels  mb-2">Choose Bandwidth Template</label>
                              <input type="text" className="form-control" value={data?.optional_bandwidth_info?.name} disabled />
                            </div>
                          </div>
                        </>
                      )}

                      {/* burst Limit */}

                      <>
                        <div className="col-md-12 mt-4 p-0 flex justify-content-between" onClick={toggleShowMoreFour}>
                          <div className="labelsHeading">Override Bandwidth</div>
                          <div className="labelsHeading" style={{ cursor: "pointer" }}>
                            {showMoreFour ? "show less" : "show more"}
                            {showMoreFour ? (
                              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                            ) : (
                              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                            )}
                          </div>
                        </div>
                        <div className="horizontal">
                          <hr />
                        </div>
                        {showMoreFour && (
                          <>
                            <>
                              <div className="check_box mt-3 px-3">
                                <FormGroup check className="d-flex align-items-center">
                                  <input
                                    class="form-check-input input"
                                    type="checkbox"
                                    defaultChecked={data?.restrict_day_time}
                                    id="checkbox123"
                                    name="restrict_day_time"
                                    disabled
                                  />
                                  <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                                    Restrict the time of the day when internet is used?
                                  </Label>
                                </FormGroup>
                              </div>
                              {data?.restrict_day_time === true ? (
                                <>
                                  <div className="row px-3 mt-3">
                                    <div className="col-md-6">
                                      <label>Choose Bandwidth Template</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={data?.override_bandwidth_info?.name}
                                      />
                                    </div>
                                  </div>
                                  <div className="check_box mt-4 px-3">
                                    <FormGroup check className="d-flex align-items-center">
                                      <input
                                        class="form-check-input input"
                                        type="checkbox"
                                        defaultChecked={data?.if_data_exceeds_override_bandwidth}
                                        name="if_data_exceeds_override_bandwidth"
                                        id="checkbox123"
                                        disabled
                                      />
                                      <div className="if_Exceed ml-3">If Exceed</div>
                                    </FormGroup>
                                  </div>
                                  <div className="row px-3 mt-3">
                                    <div className="col-md-6">
                                      <label>Choose Bandwidth Template</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={data?.optional_override_bandwidth_info?.name}
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-4 px-3">Select timings when bandwidth has to be overidden?</div>
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
                                        {data?.time_to_override?.map((ress) => {
                                          return (
                                            <tr>
                                              {/* {}
                                              {} */}
                                              <td>{ress?.day}</td>
                                              <td className="">
                                                <FormGroup check className="mt-1 ml-2 align-items-center">
                                                  <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={ress?.do_not_override_for_entire_day}
                                                    disabled
                                                  />
                                                </FormGroup>
                                              </td>
                                              <td >
                                                <input
                                                  className="form-control"
                                                  value={ress?.from?moment(ress?.from).format("h:mm:ss a"):""}
                                                  showSecond={false}
                                                  use12Hours
                                                  inputReadOnly
                                                  disabled
                                                  // className="form-control"
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  className="form-control"
                                                  value={ress?.to?moment(ress?.to).format("h:mm:ss a"):""}
                                                  showSecond={false}
                                                  use12Hours
                                                  inputReadOnly
                                                  disabled

                                                  // className="form-control"
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          </>
                        )}
                      </>

                      <div className="col-md-12 mt-4 p-0 flex justify-content-between" onClick={toggleShowMoreSeven}>
                        <div className="labelsHeading">Auto Bind Mac</div>
                        <div className="labelsHeading" style={{ cursor: "pointer" }}>
                          {showMoreSeven ? "show less" : "show more"}
                          {showMoreSeven ? (
                            <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                          ) : (
                            <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                          )}
                        </div>
                      </div>
                      <div className="horizontal">
                        <hr />
                      </div>
                      {showMoreSeven && (
                        <>
                          <div className="check_box mt-3 px-3">
                            <FormGroup check className="d-flex align-items-center">
                              <input
                                class="form-check-input input"
                                type="checkbox"
                                defaultChecked={data?.on_first_login_auto_bind_mac}
                                name="on_first_login_auto_bind_mac"
                                id="checkbox123"
                                disabled
                              />
                              <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                                AUto bind MAC to the user on first login?
                              </Label>
                            </FormGroup>
                          </div>
                          {data?.on_first_login_auto_bind_mac === true ? (
                            <>
                              <div className={`${style.main_grid_container4} mt-3 px-3`}>
                                <Label className="labels mt-2">
                                  Number of MAC's to bind <span className="text-danger">*</span>
                                </Label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder="Enter number mac's"
                                  name="no_mac_bind"
                                  value={data?.no_mac_bind}
                                  disabled
                                />
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}

                      <div className="col-md-12 mt-4 p-0 flex justify-content-between" onClick={toggleShowMoreEight}>
                        <div className="labelsHeading">Mac Restriction</div>
                        <div className="labelsHeading" style={{ cursor: "pointer" }}>
                          {showMoreEight ? "show less" : "show more"}
                          {showMoreEight ? (
                            <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                          ) : (
                            <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                          )}
                        </div>
                      </div>
                      <div className="horizontal">
                        <hr />
                      </div>
                      {showMoreEight && (
                        <>
                          <div className="check_box mt-3 px-3">
                            <FormGroup check className="d-flex align-items-center">
                              <input
                                class="form-check-input input"
                                type="checkbox"
                                defaultChecked={data?.mac_restriction}
                                name="mac_restriction"
                                id="checkbox123"
                                disabled
                              />
                              <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                                Allow only devices whose MAC addresses are configured in each user to login with the
                                corresponding user name? if MAC address is not specified for the user, then login wil be
                                permitted.
                              </Label>
                            </FormGroup>
                          </div>
                        </>
                      )}

                      {/* other details  */}
                      <div className="col-md-12 mt-4 p-0 flex justify-content-between" onClick={toggleShowMoreFive}>
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
                      <div className="horizontal">
                        <hr />
                      </div>
                      {showMoreFive && (
                        <>
                          <div className="flex flex-column g-1">
                            <div className="col-md-12 p-0">
                              <label className="viewLabels  mb-2">Ideal</label>
                              <div className="flex g-1 ">
                                <div className="boxBackground">
                                  <span className="viewLabels">
                                    {data?.ideal_for} {data?.ideal_for_unit !== undefined ? data?.ideal_for_unit : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 p-0">
                              <label className="viewLabels  mb-2">Features</label>

                              <div className="flex g-1 flex-column ">
                                {data?.features?.map((feature, index) => (
                                  <div key={index} className="boxBackground">
                                    <span className="viewLabels">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {data?.attributes?.map((attribute, index) => (
                              <>
                                <div className="col-md-6 p-0">
                                  <label className="viewLabels mb-3">{attribute.field_name}</label>
                                  <div className="flex g-1 flex-column ">
                                    <div key={index} className="boxBackground">
                                      <span className="viewLabels">{attribute.field_value}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default ViewPage;
