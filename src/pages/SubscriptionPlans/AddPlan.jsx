import React, { useEffect, useState } from "react";
import { Modal, ModalBody, Row, Col, ModalHeader } from "reactstrap";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import PlanPage from "./PlanPage";
import { addPlan, getAllBandWidthData } from "../../service/admin";
import { IoClose } from "react-icons/io5";
import { error, success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { userInfo } from "../../assets/userLoginInfo";

function AddPlan({ open, setOpen, mode, reload, fullData, setLoader }) {
  const [activeTab, setActiveTab] = useState("1");
  const dispatch = useDispatch();

  // let emptydata = {
  //   category: "prepaid",
  //   type: "unlimited",
  //   active_status: true,
  //   popular_plan: false,
  //   plan_name: "",
  //   amount: "",
  //   billingCycleType: null,
  //   billingCycleDate: null,
  //   shortDescription: "",
  //   limit_download_speed: "",
  //   limit_download_speed_unit: "",
  //   download_speed: "",
  //   download_speed_unit: "",
  //   upload_speed: "",
  //   upload_speed_unit: "",
  //   ideal_for: "",
  //   features: [""],
  //   attributes: [],
  //   burst_limit: {
  //     download: "",
  //     download_unit: "",
  //     upload: "",
  //     upload_unit: "",
  //     threshold_download: "",
  //     threshold_download_unit: "",
  //     threshold_upload: "",
  //     threshold_upload_unit: "",
  //     download_time: "",
  //     upload_time: "",
  //   },
  // };

  let emptydata = {
    type: "unlimited",
    category: "prepaid",
    popular_plan: false,
    active_status: true,
    plan_name: "",
    shortDescription: "",
    billingCycleType: null,
    billingCycleDate: null,
    amount: "",
    cgst: "",
    sgst: "",
    service_tax: "",
    bandwidth: {
      id: "",
      option: ""
    },
    data: {
      quantity: "",
      unit: "",
      reset_every: ""
    },

    optional_bandwidth: {
      id: "",
      option: ""
    },
    override_bandwidth: "",
    if_data_exceeds_override_bandwidth: false,
    optional_override_bandwidth: "",
    time_to_override: [
      {
        day: "",
        do_not_override_for_entire_day: false,
        from: "",
        to: ""
      }
    ],
    on_first_login_auto_bind_mac: false,
    restrict_day_time: false,
    mac_restriction: false,
    no_mac_bind: "",
    ideal_for: "",
    features: [],
    attributes: []
  };

  let EmptyValid = {
    category: false,
    type: false,
    active_status: false,
    popular_plan: false,
    plan_name: false,
    amount: false,
    billingCycleType: false,
    billingCycleDate: false,
    shortDescription: false,
    ideal_for: false,
    bandwidth_id: false,
    bandwidth_option: false,
    data_quantity: false,
    data_unit: false,
    data_reset_every: false,
    optional_bandwidth_id: false,
    optional_bandwidth_option: false,
    override_bandwidth: false,
    optional_override_bandwidth: false,
    from: false,
    to: false,
    no_mac_bind: false
  };
  const [formData, setFormData] = useState(emptydata);
  const [vaildData, setValidData] = useState(EmptyValid);
  const [getAllBandwidth, setGetAllBandwidth] = useState([]);
  const [bandwidthData, setBandwidthData] = useState({});

  const getAllDataOfBandwidth = async () => {
    setLoader(true);
    await getAllBandWidthData(userInfo().org_id)
      .then(res => {
        setGetAllBandwidth(res.data.data);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };
  useEffect(() => {
    getAllDataOfBandwidth();
  }, []);

  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const handleInput = (event, key) => {
    const { name, value } = event;
    switch (key) {  
      case "bandwidth":
        setFormData(prev => ({
          ...prev,
          bandwidth: { ...prev.bandwidth, [name]: value }
        }));
        if (name === "id") {
          setBandwidthData(getAllBandwidth.find(e => e._id === value));
          console.log(getAllBandwidth.find(e => e._id === value));
        }
        break;
      case "data":
        setFormData(prev => ({
          ...prev,
          data: { ...prev.data, [name]: value }
        }));
        break;
      case "optional_bandwidth":
        setFormData(prev => ({
          ...prev,
          optional_bandwidth: { ...prev.optional_bandwidth, [name]: value }
        }));
        break;
      default:
        setValidData({ ...vaildData, [name]: false });
        setFormData({ ...formData, [name]: value });
    }
  };

  const [tableData, setTableData] = useState([
    { day: "Monday", do_not_override_for_entire_day: true, from: "", to: "" },
    { day: "Tuesday", do_not_override_for_entire_day: true, from: "", to: "" },
    { day: "Wednesday", do_not_override_for_entire_day: true, from: "", to: "" },
    { day: "Thursday", do_not_override_for_entire_day: true, from: "", to: "" },
    { day: "Friday", do_not_override_for_entire_day: true, from: "", to: "" },
    { day: "Saturday", do_not_override_for_entire_day: true, from: "", to: "" },
    { day: "Sunday", do_not_override_for_entire_day: true, from: "", to: "" }
  ]);

  const handleTimeChange = (index, field, value) => {
    setTableData(prevTimes => {
      const updatedTimes = [...prevTimes];
      updatedTimes[index] = { ...updatedTimes[index], [field]: value };

      return updatedTimes;
    });
  };
  const handleInputburst = event => {
    const { name, value } = event;

    let burst = { ...formData?.burst_limit, [name]: value };
    setFormData({ ...formData, burst_limit: burst });
  };
  const handleSubmit = async () => {
    let errors = validate(formData);

    if (errors === 0) {
      let formatePlanData = joinAndRemoveUnitValues(formData);
      formatePlanData = {
        ...formatePlanData,
        org_id: userInfo().org_id,
        isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
        time_to_override: tableData
      };

      try {
        // setLoader(true);

        if (formatePlanData?.override_bandwidth?.length === 0) {
          delete formatePlanData?.override_bandwidth;
        }
        if (formatePlanData?.optional_override_bandwidth?.length === 0) {
          delete formatePlanData.optional_override_bandwidth;
        }

        formatePlanData = {
          ...formatePlanData,
          org_id:
            userInfo().role === "isp admin" || userInfo().role === "super admin" ? userInfo()._id : userInfo().org_id,
          isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
          assignBng_id: bandwidthData?.assignBng_id ? bandwidthData?.assignBng_id : null
        };

        await addPlan(formatePlanData);
        await reload();
        setOpen({ mode: mode, status: false, data: {} });
        setLoader(false);
        dispatch(
          success({
            show: true,
            msg: `${mode == "edit" ? "Subscription" : "New subscription"} plan ${
              mode == "edit" ? "edited" : "created"
            } successfully`,
            severity: "success"
          })
        );
      } catch (err) {
        console.log(err);
        await reload();
        setLoader(false);
        dispatch(
          error({
            show: true,
            msg: `Some error occupied while ${mode == "edit" ? "edit" : "create"} subscription plan`,
            severity: "error"
          })
        );
      } finally {
      }
      // setFormData({});
    } else {
    }
  };

  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function joinAndRemoveUnitValues(obj) {
    let result = deepCopy(obj);
    (function recurse(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key.endsWith("_unit")) {
            let baseKey = key.replace("_unit", "");
            if (obj.hasOwnProperty(baseKey)) {
              obj[baseKey] = `${obj[baseKey].trim()} ${obj[key]}`;
            }
            delete obj[key];
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            recurse(obj[key]);
          }
        }
      }
    })(result);
    result?.attributes?.forEach(e => {
      delete e._id;
      return e;
    });
    return result;
  }
  function validate(objectData) {
    let error = {};
    for (let key in objectData) {
      const notIncludes = ["category", "attributes", "features", "bandwidth", "data", "optional_bandwidth"];

      if (key === "category") {
        if (objectData[key] === "data") {
        }
      }
      if (!notIncludes.includes(key)) {
        if (objectData.hasOwnProperty(key) && objectData[key] && objectData[key]?.toString().length !== 0) {
          error[key] = false;
        } else {
          error[key] = true;
        }
      } else {
        if (key === "features") {
          let datas = objectData[key].filter(e => e.trim().length === 0);
          if (datas.length !== 0) {
            error[key] = true;
          } else {
            error[key] = false;
          }
        }
        if (key === "attributes") {
          let datas = objectData[key].filter(e => e?.field_value?.trim().length === 0);
          if (datas.length !== 0) {
            error[key] = true;
          } else {
            error[key] = false;
          }
        }

        if (key === "bandwidth") {
          if (objectData[key].id.length === 0) {
            error["bandwidth_id"] = true;
          }
          if (objectData[key].option.length === 0) {
            error["bandwidth_option"] = true;
          }
        }
        if (key === "data") {
          if (objectData[key].quantity.length === 0) {
            error["data_quantity"] = true;
          }
          if (objectData[key].unit.length === 0) {
            error["data_unit"] = true;
          }
          if (objectData[key].reset_every.length === 0) {
            error["data_reset_every"] = true;
          }
        }
        if (key === "optional_bandwidth") {
          if (objectData[key].id.length === 0) {
            error["optional_bandwidth_id"] = true;
          }
          if (objectData[key].option.length === 0) {
            error["optional_bandwidth_option"] = true;
          }
        }
      }
    }
    delete error.active_status;
    delete error.type;
    delete error.popular_plan;
    delete error.limitation;
    delete error.__v;
    delete error.isDeleted;
    delete error.cgst;
    delete error.sgst;
    delete error.service_tax;
    delete error.if_data_exceeds;
    delete error.mac_restriction;
    delete error.no_mac_bind;
    delete error.override_bandwidth;
    delete error.if_data_exceeds_override_bandwidth;
    delete error.optional_override_bandwidth;
    delete error.on_first_login_auto_bind_mac;
    delete error.restrict_day_time;

    let errorNum = Object.keys(error).filter(key => error[key]);

    setValidData(error);
    return errorNum.length;
  }

  function splitAndAddUnitValues(obj) {
    let result = deepCopy(obj);

    function recurse(obj) {
      for (let key in obj) {
        if (key !== "features" && key !== "upload_time" && key !== "download_time") {
          if (
            obj.hasOwnProperty(key) &&
            typeof obj[key] === "string" &&
            !["shortDescription", "plan_name", "limit_download_speed_unit"].includes(key)
          ) {
            let parts = obj[key].split(" ");
            if (parts.length === 2) {
              let [baseValue, unit] = parts;
              obj[key] = baseValue;
              obj[`${key}_unit`] = unit;
            }
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            recurse(obj[key]);
          }
        }
      }
    }

    recurse(result);
    return result;
  }

  function getPlandata() {
    if (fullData) {
      let planData = splitAndAddUnitValues(fullData);
      setFormData(planData);
    }
  }
  useEffect(() => {
    if (mode === "edit") {
      getPlandata();
    } else {
      setFormData(emptydata);
    }
    setValidData(EmptyValid);
  }, [fullData, mode]);
  return (
    <>
      <Modal scrollable={true} isOpen={open} toggle={() => {}} className="" size="lg">
        <ModalHeader toggle={() => setOpen(!open)} className="d flex align-items-center justify-content-between">
          <div className="flex">
            <span className="f-28">{mode === "edit" ? "Edit" : "Create New"} Plan</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="mt-md-4 mt-sm-3 mt-3">
            <Nav>
              <NavItem>
                <NavLink
                  className="labelsHeading mt-2"
                  onClick={() => toggleTab("1")}
                  style={{ color: "var(--label-color)" }}
                >
                  <span className="text-black fw-400 f-18">Plan Prefrences</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    {/* some tag */}
                    <PlanPage
                      handleInput={handleInput}
                      handleInputburst={handleInputburst}
                      formData={formData}
                      mode={mode}
                      vaildData={vaildData}
                      setFormData={setFormData}
                      getAllBandwidth={getAllBandwidth}
                      tableData={tableData}
                      setTableData={setTableData}
                      handleTimeChange={handleTimeChange}
                    />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </div>
          {/* button  */}
          <div className="col-md-12 d-flex  justify-content-end mt-5 p-0">
            <button className="btn mr-2" onClick={() => setOpen({ mode: mode, status: false, data: {} })}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => handleSubmit()}>
              {mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default AddPlan;
