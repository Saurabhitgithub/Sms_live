import React, { useEffect, useState } from "react";
import moment from "moment";
import style from "./SubscriberManagement.module.css";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { FaRegEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { getPlanByCreator, PayAndRenew, getfranchiseebyId, ToggleBlock } from "../../service/admin";
import { userInfo } from "../../assets/userLoginInfo";
import { error, success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Loader from "../../components/commonComponent/loader/Loader";

function AccountView({ planData, setplanData, updateUserCategory,getAllData, }) {
  const [showMoreOne, setShowMoreOne] = useState(false);
  const [showMoreTwo, setShowMoreTwo] = useState(false);
  const [update, setUpdate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [getPlanData, setPlanData] = useState([]);
  const [selectPlan, setSlectPlan] = useState();
  const [addMount, setAddAmount] = useState([]);
  const [paymentMethod, setPaymentmethod] = useState();
  const [ckeckedImme, setCkeckedImme] = useState(false);
  const [franchiseeData, setFranchiseeData] = useState();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  

  const toggleShowMoreOne = () => {
    setShowMoreOne(!showMoreOne);
  };
  const toggleShowMoreTwo = () => {
    setShowMoreTwo(!showMoreTwo);
  };

  async function updateData(e) {
    e.preventDefault();
    await updateUserCategory(planData?._id);
    setUpdate(false);
  }

  function toggle() {
    setVisible(!visible);
    setSlectPlan("");
  }

  const getAllPlan = async () => {
    try {
      let Payload;
      if (userInfo().role === "isp admin" || userInfo().role === "admin") {
        Payload = {
          org_id: userInfo()._id
        };
      } else {
        Payload = {
          org_id: userInfo().org_id,
          isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
        };
      }

      const res = await getPlanByCreator(Payload);
      let planss = res?.data?.data?.map(e => {
        return {
          value: e?._id,
          label: e?.plan_name
        };
      });
      setPlanData(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getFrenchiseeById = async () => {
    try {
      let res = await getfranchiseebyId(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id);

      setFranchiseeData(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  async function checkFranchiseeBalance(e) {
    let amountData = getPlanData.find(e => e?._id === selectPlan)?.amount;
    let amountTax = (amountData * franchiseeData?.taxPercentage) / 100;
    let amountTds = (amountData * franchiseeData?.tdsPercentage) / 100;
    let totalAmount = amountData + amountTax + amountTds;
    if (franchiseeData?.balance >= totalAmount) {
      return true;
    } else {
      return false;
    }
  }

  const addPayAndRenew = async e => {
    setLoader(true);
    e.preventDefault();
    try {
      let amountData = getPlanData.find(e => e?._id === selectPlan)?.amount;
      let amountTax = (amountData * franchiseeData?.taxPercentage) / 100;
      let amountTds = (amountData * franchiseeData?.tdsPercentage) / 100;
      let totalAmount = amountData + amountTax + amountTds;
      let Payload = {
        planId: selectPlan,
        subscriberId: planData?._id,
        planAmount: amountData,
        totalAmount: totalAmount,
        isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo()?.isp_id,
        org_id: planData?.org_id,
        isImmediateApply: ckeckedImme
      };
      if (await checkFranchiseeBalance(e)) {
        let res = await PayAndRenew(Payload);
        setVisible(false);

        setSlectPlan("");
        dispatch(
          success({
            show: true,
            msg: `Subscriber Plan Change Successfully`,
            severity: "success"
          })
        );
      } else {
        dispatch(
          error({
            show: true,
            msg: `Your Amount is Insufficient`,
            severity: "error"
          })
        );
      }

      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  const blockSubscriber = async () => {
    setLoader(true);
    try {
      let Payload = {
        user_id: userInfo().role === "franchise" ? userInfo()._id : userInfo()?.isp_id,
        user_role: userInfo().role ,
        user_name: userInfo().name,
        id: planData?._id
      };
      let res = await ToggleBlock(Payload);
      setLoader(false)
    } catch (err) {
      console.log(err);
      setLoader(false);
    }finally{
      getAllData()
      setLoader(false)
    }
  };
  useEffect(() => {
    getAllPlan();
    getFrenchiseeById();
   
  }, []);

  return (
    <>
      
      <Modal centered scrollable size="md" isOpen={visible}>
        <ModalHeader toggle={toggle}>
          <div className="f-24">Pay & Renew</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={e => addPayAndRenew(e)}>
            <div className="row">
              <div className="col-md-12">
                <label>Plan</label>
                <SingleSelect
                  placeItem="Select Plan"
                  options={getPlanData?.map(e => {
                    return {
                      value: e?._id,
                      label: e?.plan_name
                    };
                  })}
                  onChange={e => {
                    setSlectPlan(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label>Amount</label>
                <input
                  type="text"
                  className="form-control"
                  value={getPlanData.find(e => e?._id === selectPlan)?.amount}
                  placeholder="Enter Amount"
                  disabled
                  required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label>Payment Method</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cash"
                  disabled
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <span>Note: If amount collected click on continue</span>
              </div>
            </div>
            <div className="check_box mt-3">
              <FormGroup check className="d-flex align-items-center">
                <input
                  class="form-check-input input"
                  type="checkbox"
                  id="checkbox123"
                  name="restrict_day_time"
                  onChange={e => {
                    setCkeckedImme(e.target.checked);
                  }}
                />
                <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                  Immediate Apply
                </Label>
              </FormGroup>
            </div>
            <div className="mt-4 d-flex justify-content-end">
              {loader ? <Loader/>:<button className="btn btn-primary" type="submit">
                Continue
              </button>}
              
            </div>
          </form>
        </ModalBody>
      </Modal>
      <div className="mt-md-5 mt-sm-4 mt-3">
        <span className={style.labelsHeading} style={{ fontSize: "15px" }}>
          Created On: {moment(planData?.createdAt).format("DD MMM YYYY")}
        </span>
      </div>
      <div className="flex between align-items-center mt-1">
        <span
          style={{ whiteSpace: "pre-wrap", lineHeight: "15px" }}
          className={`${style.labelsHeading} text-capitalize`}
        >
          {planData?.full_name}
        </span>
        {planData?.status === "Active" ? (
          <button className={style.activeBtn}>Active</button>
        ) : (
          <button className={style.inactiveBtn}>Inactive</button>
        )}
      </div>
      <div className={style.labelsHeading} style={{ fontSize: "15px" }}>
        <div className="d-md-inline">
          <div className="d-block d-md-inline mt-1">{planData?.email}</div>
          <span className="d-none d-md-inline mx-2">|</span>
          <div className="d-block d-md-inline mt-2">{moment(planData?.updatedAt).format("DD MMM YYYY")}</div>
        </div>
      </div>

      <div className="mt-4">
        <label className="fw-600 mb-3 d-flex align-items-center">
          User Category{" "}
          {update ? (
            <IoClose className="f-18 text-primary fw-600 ml-3" onClick={() => setUpdate(false)} />
          ) : (
            <FaRegEdit className="f-18 text-primary fw-600 ml-3" onClick={() => setUpdate(true)} />
          )}
        </label>
        <div className="">
          <form className="w-100" onSubmit={updateData}>
            <div className="d-flex gap-3 ml-1">
              <FormGroup check>
                <Input
                  name="category"
                  type="radio"
                  className="radioButton"
                  value="postpaid"
                  // disabled={!update}
                  checked={planData?.billing_type === "postpaid"}
                  onChange={e => {
                    if (update) {
                      setplanData(pre => {
                        return {
                          ...pre,
                          billing_type: e.target.value
                        };
                      });
                    }
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
                  // disabled={!update}
                  checked={planData?.billing_type === "prepaid"}
                  onChange={e => {
                    if (update) {
                      setplanData(pre => {
                        return {
                          ...pre,
                          billing_type: e.target.value
                        };
                      });
                    }
                  }}
                />
                <Label className="labels ml-1 f-16 text-black" check>
                  Prepaid
                </Label>
              </FormGroup>
            </div>
            {update ? (
              <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-sm btn-primary" type="submit">
                  Submit
                </button>
              </div>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>

      <div className={`${style.accountTopContainer} mt-md-5 mt-sm-4 mt-4`}>
        <div className="statusBox">
          <span className="statusLabel">{planData?.planInfo?.plan_name}</span>
          <span className="viewLabels">Plan Name</span>
        </div>
        <div className="statusBox">
          <span className="statusLabel text-capitalize">{planData?.planInfo?.category}</span>
          <span className="viewLabels">Category</span>
        </div>
        <div className="statusBox">
          <span className="statusLabel text-capitalize">{planData?.planInfo?.type}</span>
          <span className="viewLabels">Type</span>
        </div>
        <div className="statusBox">
          <span className="statusLabel">Rs. {planData?.planInfo?.amount}</span>
          <span className="viewLabels">Amount</span>
        </div>
        <div className="statusBox">
          <span className="statusLabel">
            {planData?.current_plan?.end_date ? moment(planData?.current_plan?.end_date).format("DD MMM YYYY") : ""}
          </span>
          <span className="viewLabels">Expiry Date</span>
        </div>
      </div>

      {/* Pay & Renew and block */}
      {userInfo().role === "franchise" ? (
        <div className="d-flex justify-content-between mt-4">
          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              Pay & Renew
            </button>
          </div>
          <div>
            {loader? <Loader/> :
            <button className="btn text-primary" onClick={(e)=>{blockSubscriber(e)}}>{planData?.isBlocked ? "Unblock" : "Block"}</button>
            
            }
            
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Network account  */}
      <div className="dark_heading mt-md-5 mt-sm-4 mt-4 mb-2">Network Account</div>
      <div className={style.horizontal}>
        <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
      </div>

      <div className="row">
        <div className="col-md-6 mt-2">
          <label className={`${style.labels} mb-2`}>Username</label>

          <div className={style.boxBackground}>
            <span className={style.labels}>{planData?.userName}</span>
          </div>
        </div>
        <div className="col-md-6 mt-2">
          <label className={`${style.labels} mb-2`}>Password</label>
          <div className={style.boxBackground}>
            <span className={style.labels}>{planData?.password}</span>
          </div>
        </div>
      </div>

      {/* netwrok  */}
      {/* <div className="dark_heading mt-5 mb-2">Network</div>
      <div className={style.horizontal}>
        <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
      </div>
      <div className="row ">
        <div className="col-md-6">
          <label className={`${style.labels} mb-2`}>Zone</label>

          <div className={style.boxBackground}>
            <span className={style.labels}>Aarav_1223</span>
          </div>

        </div>
      </div> */}

      {/* plan details  */}
      <div className="col-md-12 mt-md-5 mt-sm-4 mt-4 p-0 flex justify-content-between " onClick={toggleShowMoreOne}>
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
          <div className="row ">
            <div className="col-md-6 mt-2">
              <label className={`${style.labels} mb-2`}>Plan Name</label>

              <div className={style.boxBackground}>
                <span className={style.labels}>{planData?.planInfo?.plan_name}</span>
              </div>
            </div>
            <div className="col-md-6 mt-2">
              <label className={`${style.labels} mb-2`}>Plan Rate</label>
              <div className={style.boxBackground}>
                <span className={style.labels}>Rs. {planData?.planInfo?.amount}</span>
              </div>
            </div>
          </div>
          <div className="row ">
            <div className="col-md-12 ">
              <label className={`${style.labels} mb-2 mt-2`}>Billing Cycle</label>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-8">
                  <div className={`${style.boxBackground} `}>
                    <span className={style.labels}>{planData?.planInfo?.billingCycleType}</span>
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-4">
                  <div className={`${style.boxBackground} `}>
                    <span className={style.labels}>{planData?.planInfo?.billingCycleDate}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-md-6 ">
          <label className={`${style.labels} mb-2`}></label>
          <div className={style.boxBackground}>
            <span className={style.labels}>Aarav_1223</span>
          </div>
        </div> */}
          </div>
        </>
      )}

      {/* internet speed  */}
      <div className="col-md-12 mt-md-5 mt-sm-4 mt-4 p-0 flex justify-content-between " onClick={toggleShowMoreTwo}>
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
          <div className="row ">
            <div className="col-md-6 mt-2">
              <label className={`${style.labels} mb-2`}>Download Speed</label>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-8">
                  <div className={style.boxBackground}>
                    <span className={style.labels}>{planData?.planInfo?.bandwidth_info?.max_download?.speed}</span>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-4">
                  <div className={style.boxBackground}>
                    <span className={style.labels}>{planData?.planInfo?.bandwidth_info?.max_download?.unit}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-2">
              <label className={`${style.labels} mb-2`}>Upload Speed</label>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-8">
                  <div className={style.boxBackground}>
                    <span className={style.labels}>{planData?.planInfo?.bandwidth_info?.max_upload?.speed}</span>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-4">
                  <div className={style.boxBackground}>
                    <span className={style.labels}>{planData?.planInfo?.bandwidth_info?.max_upload?.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AccountView;
