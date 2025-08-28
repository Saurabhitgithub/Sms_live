import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import style from "./Plans.module.css";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Table } from "reactstrap";
import { FiEdit } from "react-icons/fi";
import AddPlan from "./AddPlan";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import {
  bulkInsertPlan,
  deletePlan,
  getAllBandWidthData,
  getPlanByCreator,
  planStatusChanges
} from "../../service/admin";
import ViewPage from "./ViewPage";
import { csvToJsons, exportCsv } from "../../assets/commonFunction";
import { Modal, ModalBody } from "reactstrap";
import { BsTrash } from "react-icons/bs";
import PaginationComponent from "../../components/pagination/Pagination";
import { paginateData } from "../../utils/Utils";
import Loader from "../../components/commonComponent/loader/Loader";
import { useDispatch } from "react-redux";
import { error, success } from "../../Store/Slices/SnackbarSlice";
import DeleteModal from "../../components/commonComponent/Deletemodel/Deletemodel";
import { IoClose } from "react-icons/io5";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { permisionsTab, userInfo } from "../../assets/userLoginInfo";
import Error403 from "../../components/error/error403";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";

export default function SubscriptionPlans() {
  const [planPermission, setPlanPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  const [planData, setPlanData] = useState([]);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState("");
  const [fileErr, setFileErr] = useState(false);
  const [open, setOpen] = useState({ mode: "", status: false, data: {} });
  const [allPlanData, setAllPlanData] = useState([]);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter(s => s.tab_name === "Subscription Plan");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0].is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setPlanPermission(permissionArr);
    }
  }
  let simpleData = [
    {
      "type*": "data",
      "category*": "postpaid",
      "plan_name*": "Basic Plan",
      "amount*": 499,
      "billingCycleType*": "Month",
      "billingCycleDate*": "1",
      "shortDescription*": "Affordable option with essential connectivity",
      "ideal_for*": "Affordable option with essential connectivity",
      "features*": "Essential, Standard, Limited data usage, Basic customer support",
      "active_status*": true,
      "popular_plan*": false,
      bandwidth_code: "JHJB2312",
      bandwidth_option: "Download Doesn’t Exceed",
      bandwidth_data: "100",
      bandwidth_data_unit: "mbps",
      bandwidth_reset_every: "yearly"
    }
  ];
  const [exportPlan, setExportPlan] = useState([]);
  const [modal, setModal] = useState(false);
  const [disable, setDisable] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [errorImport, setErrorImport] = useState([]);
  const [openTwo, setOpenTwo] = useState({ status: false });
  const [fullData, setFullData] = useState({});
  const [allBandWidth, setAllBandWidth] = useState([]);

  const getAllBandWidthFunction = async () => {
    await getAllBandWidthData()
      .then(res => {
        let reverseData = [...res.data.data];
        setAllBandWidth(reverseData);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const statusPlanChnage = async id => {
    try {
      setLoader(true);
      await planStatusChanges(id);
      await getAllPlan();
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
      dispatch(
        success({
          show: true,
          msg: "Subscription plan status changed",
          severity: "success"
        })
      );
    }
  };
  const getAllPlan = async () => {
    setSkeletonLoading(true);
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
      await permissionFunction();

      if (res && res?.data && res?.data?.data) {
        const plans = res?.data?.data?.reverse();

        setAllPlanData(plans);

        const data = paginateData(page, itemPerPage, plans);

        setPlanData(data);

        const exportdata = plans.map(e => {
          // let data = { ...e };

          // if (e.features) {
          //   data.features = e.features.join(", ");
          // }
          // if (e.burst_limit) {
          //   data.burst_limit_download = e.burst_limit.download;
          //   data.burst_limit_upload = e.burst_limit.upload;
          //   data.burst_limit_threshold_download = e.burst_limit.threshold_download;
          //   data.burst_limit_threshold_upload = e.burst_limit.threshold_upload;
          //   data.burst_limit_download_time = e.burst_limit.download_time;
          //   data.burst_limit_upload_time = e.burst_limit.upload_time;
          //   delete data.burst_limit;
          // }

          // delete data.attributes;
          // delete data.created_by;
          // delete data.created_at;
          // delete data.updated_at;
          // delete data.__v;
          // delete data._id;

          // return data;
          return {
            "Plan Name": e?.plan_name,
            "Plan Type/ Category":
              e?.type?.charAt(0).toUpperCase() +
              e?.type?.slice(1) / e?.category?.charAt(0).toUpperCase() +
              e?.category?.slice(1),
            Bandwidth: e?.bandwidth_info?.name ? e?.bandwidth_info?.name : "---",
            "Override Bandwidth": e?.restrict_day_time ? "Enable" : "Disable",
            Status: e.active_status ? "Active" : "Inactive"
          };
        });

        setExportPlan(exportdata);
      } else {
        console.error("Unexpected response structure:", res);
      }
    } catch (err) {
    } finally {
      setSkeletonLoading(false);
    }
  };
  const deletePlanData = async () => {
    setLoader(true);
    try {
      await deletePlan(deletePlanId);
      dispatch(
        success({
          show: true,
          msg: "Subscription plan Deleted successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        error({
          show: true,
          msg: "Can't delete plan try again",
          severity: "error"
        })
      );
    } finally {
      setDeletePlanId("");
      await getAllPlan();
      setDeleteModal(false);
      setLoader(false);
    }
  };
  useEffect(() => {
    getAllPlan();
    getAllBandWidthFunction();
  }, []);

  const toggle = () => {
    setErrorImport([]);
    setFileData([]);
    setModal(false);
  };

  const validationImport = data => {
    const error = [];
    const res = [];

    const requiredKeys1 = [
      "type*",
      "category*",
      "active_status*",
      "popular_plan*",
      "plan_name*",
      "amount*",
      "billingCycleType*",
      "billingCycleDate*",
      "shortDescription*",
      "ideal_for*",
      "features*",
      "bandwidth_code",
      "bandwidth_option",
      "bandwidth_data",
      "bandwidth_data_unit",
      "bandwidth_reset_every"
    ];

    const booleanFields1 = ["active_status*", "popular_plan*"];

    const validBandwidthOptions = {
      data: ["Download Doesn’t Exceed"],
      unlimited: ["Download Doesn’t Exceed", "FUP Limit Doesn't Exceed", "Upload doesn't exceed"]
    };

    const validBandwidthUnits = ["gbps", "mbps", "kbps"];
    const validResetEvery = ["Day", "Week", "Month", "Year"];

    function check(type) {
      return requiredKeys1;
    }

    function checkBooleanFields(type) {
      return booleanFields1;
    }

    data.forEach((element, index) => {
      // Validate required fields
      check(element["type*"])?.forEach(key => {
        if (element[key] === undefined || element[key] === "") {
          error.push({
            row: index + 2,
            key: key,
            message: "This field is required"
          });
        } else {
          if (typeof element[key] !== "boolean" && typeof element[key] !== "number") {
            element[key] = element[key].trim();
          }
        }
      });

      // Validate type and category
      const type = element["type*"]?.toLowerCase();
      if (type && type !== "unlimited" && type !== "data") {
        error.push({
          row: index + 2,
          key: "type*",
          message: "Enter Value (unlimited or data)"
        });
      }

      const category = element["category*"]?.toLowerCase();
      if (category && category !== "postpaid" && category !== "prepaid") {
        error.push({
          row: index + 2,
          key: "category*",
          message: "Enter Value (postpaid or prepaid)"
        });
      }

      // Validate boolean fields
      checkBooleanFields(element["type*"])?.forEach(field => {
        if (element[field] !== undefined && typeof element[field] !== "boolean") {
          error.push({
            row: index + 2,
            key: field,
            message: "Must be Boolean"
          });
        }
      });

      // Validate bandwidth_option based on type
      // if (element["bandwidth_option"]) {
      //   const validOptions = validBandwidthOptions[type] || [];
      //   if (!validOptions.includes(element["bandwidth_option"])) {
      //     error.push({
      //       row: index + 2,
      //       key: "bandwidth_option",
      //       message: `Invalid value. Allowed: ${validOptions.join(", ")}`
      //     });
      //   }
      // }

      // Validate bandwidth_data_unit enum
      if (
        element["bandwidth_data_unit"] &&
        !validBandwidthUnits.includes(element["bandwidth_data_unit"].toLowerCase())
      ) {
        error.push({
          row: index + 2,
          key: "bandwidth_data_unit",
          message: `Invalid value. Allowed: ${validBandwidthUnits.join(", ")}`
        });
      }

      // Validate bandwidth_reset_every enum
      if (element["bandwidth_reset_every"] && !validResetEvery.includes(element["bandwidth_reset_every"])) {
        error.push({
          row: index + 2,
          key: "bandwidth_reset_every",
          message: `Invalid value. Allowed: ${validResetEvery.join(", ")}`
        });
      }

      res.push(element);
    });

    setErrorImport(error);
    return { error, res };
  };

  const importPlan = async sheet => {
    if (sheet?.target?.value == undefined) {
      setFileErr(true);
      return;
    }
    setDisable(true);
    const data = await csvToJsons(sheet);
    let validata = validationImport(data);
    if (validata.error.length !== 0) {
      return;
    }
    let errorss = [];
    const bulk = validata.res.map((s, index) => {
      const features = s["features*"];
      let arr = features.split(",");
      let dd = {};
      let bandwidthInfo = allBandWidth.find(es => es.temp_code === s["bandwidth_code"]?.trim());
      //
      if (!bandwidthInfo) {
        errorss.push(index);
      }

      // if (s["type*"] == "data") {
      dd = {
        features: [...arr],
        created_by: "664645a80522c3d5bc318cd2",
        bandwidth: {
          id: bandwidthInfo?._id,
          option: s["bandwidth_option"]
        },
        data: {
          quantity: s["bandwidth_data"],
          unit: s["bandwidth_data_unit"],
          reset_every: s["bandwidth_reset_every"]
        },
        type: s["type*"],
        category: s["category*"],
        plan_name: s["plan_name*"],
        amount: s["amount*"],
        billingCycleType: s["billingCycleType*"],
        billingCycleDate: s["billingCycleDate*"],
        shortDescription: s["shortDescription*"],
        ideal_for: s["ideal_for*"],
        popular_plan: s["popular_plan*"],
        active_status: s["active_status*"],
        org_id: userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id
      };
      // }
      // else {
      //   dd = {
      //     // ...rest,
      //     features: [...arr],
      //     created_by: "664645a80522c3d5bc318cd2",

      //     type: s["type*"],
      //     category: s["category*"],
      //     plan_name: s["plan_name*"],
      //     amount: s["amount*"],
      //     billingCycleType: s["billingCycleType*"],
      //     billingCycleDate: s["billingCycleDate*"],
      //     shortDescription: s["shortDescription*"],
      //     ideal_for: s["ideal_for*"],
      //     popular_plan: s["popular_plan*"],
      //     active_status: s["active_status*"]
      //   };
      // }
      return dd;
    });

    if (errorss.length !== 0) {
      let errorInfo = errorss.map(s => {
        return {
          row: s + 2,
          key: "bandwidth_code",
          message: "Must Add Correct bandwidth code "
        };
      });
      setErrorImport(errorInfo);
      return;
    }

    try {
      setLoader(true);
      await bulkInsertPlan({ data: bulk });
      dispatch(
        success({
          show: true,
          msg: "Data Imported Successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        error({
          show: true,
          msg: "File format is not correct",
          severity: "error"
        })
      );
    } finally {
      setDisable(true);
      setModal(false);
      setErrorImport([]);
      setFileData({});
      await getAllPlan();
      setLoader(false);
    }
  };

  const handleSearchClick = e => {
    let val = e?.trim()?.toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, allPlanData);
      setPlanData(ddd);
    } else {
      if (Array.isArray(allPlanData)) {
        let searchName = allPlanData.filter(res => {
          if (
            res?.plan_name?.toLowerCase().includes(val) ||
            res?.category?.toLowerCase().includes(val) ||
            res?.type?.toLowerCase().includes(val) ||
            res?.download_speed?.toLowerCase().includes(val) ||
            res?.upload_speed?.toLowerCase().includes(val) ||
            res?.download_bandwidth?.toLowerCase().includes(val)
          ) {
            return true;
          } else {
            return false;
          }
        });
        setPlanData(searchName);
      }
    }
  };

  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanData);
    setPlanData(ddd);
  }, [page]);

  const inVoiceRef1 = useRef(null);

  async function convertToImg() {
    // setLoader(true);
    let arr = [inVoiceRef1.current];
    let photoArr = [];
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let index = 0; index < arr.length; index++) {
      const res = arr[index];
      await htmlToImage
        .toPng(res, { quality: 0.5 }) // Reduced quality to 0.5
        .then(function(dataUrl) {
          photoArr.push(dataUrl);
          const imgProps = pdf.getImageProperties(dataUrl);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // Scale image to fit within PDF dimensions
          const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
          const scaledWidth = imgProps.width * scaleFactor;
          const scaledHeight = imgProps.height * scaleFactor;

          pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST"); // Added compression option
          if (index !== arr.length - 1) {
            pdf.addPage();
          }
        })
        .catch(function(error) {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (index === arr.length - 1) {
            // setLoader(false);
          }
        });
    }

    pdf.save("Subcription Plan.pdf");
  }
  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      // background: "linear-gradient(251.07deg, #FFFFFF 35.06%, #E8F9FA 95.96%)",
      // margin:'0 auto'
      background: "white"
    }
  };

  return (
    <Content>
      <div style={{ width: "1000px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>Subcription Plan</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Plan name</th>
                  <th>Plan Type/ Category</th>
                  {/* <th>Speed Download/ Upload</th> */}
                  <th>Bandwidth</th>
                  <th>Override Bandwidth</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {planData.map(plan => (
                  <tr className={`align-items-center `} key={plan.id}>
                    <td
                      className={planPermission.includes("View Plan") ? "pointer" : ""}
                      onClick={() => {
                        if (planPermission.includes("View Plan"))
                          setOpenTwo({ status: true, id: plan?._id, fullData: plan });
                      }}
                    >
                      {plan.plan_name}
                    </td>
                    <td>
                      {plan?.type?.charAt(0).toUpperCase() + plan?.type?.slice(1)}/
                      {plan?.category?.charAt(0).toUpperCase() + plan?.category?.slice(1)}
                    </td>
                    {/* <td>
                            {plan.download_speed}/{plan.upload_speed}
                          </td> */}
                    <td>{plan?.bandwidth_info?.name ? plan?.bandwidth_info?.name : "---"}</td>
                    <td className={`${plan?.restrict_day_time ? "statusActive" : "statusExpire"}`}>
                      {plan?.restrict_day_time ? "Enable" : "Disable"}
                    </td>

                    {plan.active_status ? (
                      <>
                        {" "}
                        <td style={{ color: "green" }} className="pointer" onClick={() => statusPlanChnage(plan._id)}>
                          Active
                        </td>
                      </>
                    ) : (
                      <>
                        {" "}
                        <td style={{ color: "#F06565" }} className="pointer" onClick={() => statusPlanChnage(plan._id)}>
                          Inactive
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {permissionAccess ? (
        <>
          {" "}
          <ViewPage open={openTwo?.status} id={openTwo?.id} setOpen={setOpenTwo} fullData={openTwo?.fullData} />
          {loader ? <Loader /> : ""}
          <DeleteModal
            isOpen={deleteModal}
            toggle={() => {
              setDeleteModal(!deleteModal);
              setDeletePlanId("");
            }}
            user="Plan"
            onConfirm={deletePlanData}
          />
          <Modal scrollable={true} isOpen={modal} toggle={toggle} size="lg">
            <ModalBody>
              <div className="d-flex justify-content-between align-items-center">
                <div className="f-26 fw-500">Import Data</div>
                <IoClose className="f-20 pointer" onClick={toggle} />
              </div>
              <div className="mt-4">
                <label for="fileInput" className="f-18 text-black">
                  Select File
                </label>
                <Input
                  id="fileInput"
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  // className={style.fileInput}
                  className={`form-control ${fileErr ? "border border-danger" : ""}`}
                  onChange={e => {
                    setFileData(e);
                    setErrorImport([]);
                    setFileErr(false);
                  }}
                />
                {fileErr ? <div className="text-danger">Required</div> : ""}
              </div>

              {errorImport.length !== 0 && (
                <>
                  <hr style={{ width: "100%" }} />
                  <div className="ml-2">
                    <h6>Errors Table</h6>
                  </div>
                  <div className="mt-3">
                    <div className="table-container">
                      <Table hover responsive>
                        <thead style={{ backgroundColor: "#F5F6FA" }}>
                          <tr className="table-heading-size">
                            <th>Row</th>
                            <th>column</th>
                            <th>Message</th>
                          </tr>
                        </thead>
                        <tbody>
                          {errorImport.map(error => (
                            <tr className={`align-items-center h7 `}>
                              <th>{error.row}</th>

                              <td>{error.key}</td>
                              <td>{error.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </>
              )}
              <div className={style.buttonContainer}>
                <button className={`btn btn-primary`} onClick={() => exportCsv(simpleData, "Subscription Plan Simple")}>
                  Download Sample
                </button>
                <button
                  className={`btn bg-gray text-white`}
                  onClick={() => {
                    setModal(false);
                    setErrorImport([]);
                    setFileData([]);
                  }}
                >
                  Cancel
                </button>
                <button className={`btn btn-primary`} onClick={() => importPlan(fileData)}>
                  Import
                </button>
              </div>
            </ModalBody>
          </Modal>
          <div className="card_container p-md-4 p-sm-3 p-3">
            <div className="topContainer">
              <div className="f-28">Subscription Plans</div>
              <div className=" d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                {planPermission.includes("Import Plan") && (
                  <>
                    <button className="btn export" onClick={() => setModal(true)}>
                      Import
                    </button>
                  </>
                )}
                {planPermission.includes("Export Plan") && (
                  <>
                    <div className="line ml-2 mr-2"></div>
                    {/* <button className="btn export" onClick={() => exportCsv(exportPlan, "Subscription Plans")}>
                      Export
                    </button> */}
                    <div className="dropdown_logs ">
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                          Export
                          <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>
                            <ExportCsv exportData={exportPlan} filName={"Subscription Plan"} />
                          </DropdownItem>
                          <DropdownItem>
                            {" "}
                            <div onClick={convertToImg}>PDF</div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </>
                )}
                {planPermission.includes("Add Plan") && (
                  <>
                    <div className="line ml-2 mr-2"></div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setOpen({ mode: "add", status: true, data: {} });
                        setFullData({});
                      }}
                    >
                      Create Plan
                    </button>
                  </>
                )}
                <AddPlan
                  open={open.status}
                  setOpen={setOpen}
                  mode={open.mode}
                  reload={getAllPlan}
                  fullData={fullData}
                  setLoader={setLoader}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-8 col-12">
                <SearchInput
                  placeholder={"Search by plan name"}
                  onChange={e => {
                    if (e.target.value == " ") {
                      e.target.value = "";
                    }
                    {
                      handleSearchClick(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            {skeletonLoading ? (
              <>
                <div className="mt-5">
                  <TableSkeleton rows={7} columns={5} />
                </div>
              </>
            ) : (
              <>
                <div className="table-container mt-5">
                  <Table hover>
                    <thead style={{ backgroundColor: "#F5F6FA" }}>
                      <tr className="table-heading-size">
                        <th>Plan name</th>
                        <th>Plan Type/ Category</th>
                        {/* <th>Speed Download/ Upload</th> */}
                        <th>Bandwidth</th>
                        <th>Override Bandwidth</th>
                        <th>Status</th>
                        {(planPermission.includes("Edit Plan") || planPermission.includes("Delete Plan")) && (
                          <>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {planData.map(plan => (
                        <tr className={`align-items-center `} key={plan.id}>
                          <td
                            className={planPermission.includes("View Plan") ? "pointer" : ""}
                            onClick={() => {
                              if (planPermission.includes("View Plan"))
                                setOpenTwo({ status: true, id: plan?._id, fullData: plan });
                            }}
                          >
                            {plan.plan_name}
                          </td>
                          <td>
                            {plan?.type?.charAt(0).toUpperCase() + plan?.type?.slice(1)}/
                            {plan?.category?.charAt(0).toUpperCase() + plan?.category?.slice(1)}
                          </td>
                          {/* <td>
                            {plan.download_speed}/{plan.upload_speed}
                          </td> */}
                          <td>{plan?.bandwidth_info?.name ? plan?.bandwidth_info?.name : "---"}</td>
                          <td className={`${plan?.restrict_day_time ? "statusActive" : "statusExpire"}`}>
                            {plan?.restrict_day_time ? "Enable" : "Disable"}
                          </td>

                          {plan.active_status ? (
                            <>
                              {" "}
                              <td
                                style={{ color: "green" }}
                                className="pointer"
                                onClick={() => statusPlanChnage(plan._id)}
                              >
                                Active
                              </td>
                            </>
                          ) : (
                            <>
                              {" "}
                              <td
                                style={{ color: "#F06565" }}
                                className="pointer"
                                onClick={() => statusPlanChnage(plan._id)}
                              >
                                Inactive
                              </td>
                            </>
                          )}
                          {(planPermission.includes("Edit Plan") || planPermission.includes("Delete Plan")) && (
                            <>
                              <td>
                                <div className="d-flex">
                                  {planPermission.includes("Edit Plan") && (
                                    <>
                                      <FiEdit
                                        className="f-20 fw-300 pointer parimary-color"
                                        color="#0E1073"
                                        onClick={e => {
                                          e.stopPropagation();
                                          setOpen({ mode: "edit", status: true });
                                          setFullData(plan);
                                        }}
                                      />
                                      <div className="line mx-3"></div>
                                    </>
                                  )}
                                  {planPermission.includes("Delete Plan") && (
                                    <>
                                      <BsTrash
                                        className="f-20 fw-300 pointer parimary-color"
                                        color="#0E1073"
                                        onClick={e => {
                                          e.stopPropagation();
                                          setDeletePlanId(plan._id);
                                          setDeleteModal(true);
                                        }}
                                      />
                                    </>
                                  )}
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div class="d-flex justify-content-center mt-1">
                  <PaginationComponent
                    currentPage={page}
                    itemPerPage={itemPerPage}
                    paginate={d => {
                      setPage(d);
                    }}
                    totalItems={allPlanData.length}
                  />
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {" "}
          <Error403 />
        </>
      )}
    </Content>
  );
}
