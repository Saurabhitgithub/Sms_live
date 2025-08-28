import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import style from "./SubscriberManagement.module.css";
import { Table } from "reactstrap";
import SearchInput from "../../../components/commonComponent/searchInput/SearchInput";
import { FiEdit } from "react-icons/fi";
import AddSubscriber from "./AddSubscriberOther";
import { BsTrash } from "react-icons/bs";
import Loader from "../../../components/commonComponent/loader/Loader";
import {
  addSubscriber,
  deleteSubscriber,
  getAllSubscriber,
  updateStatusSubscriber,
  uploadDocument,
  getBngData,
  getAllSubscriberOther
} from "../../../service/admin";
import moment from "moment";
import { CiFilter } from "react-icons/ci";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";
import PaginationComponent from "../../../components/pagination/Pagination";
import { paginateData } from "../../../utils/Utils";
import { permisionsTab, userInfo } from "../../../assets/userLoginInfo";
import { useDispatch } from "react-redux";
import { error, success } from "../../../Store/Slices/SnackbarSlice";
import DeleteModal from "../../../components/commonComponent/Deletemodel/Deletemodel";
import Error403 from "../../../components/error/error403";
import ViewOther from "./ViewOther";

export default function SubscriberOther() {
  const dispatch = useDispatch();
  const [subPermission, setSubPermission] = useState([]);
  const [loader, setLoader] = useState(false);
  const [permissionAccess, setPermissionAccess] = useState(true);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState({ mode: "", status: false });
  const [openTwo, setOpenTwo] = useState(false);
  const [planData, setplanData] = useState([]);
  const [fileForDelete, setFileFordelete] = useState([]);
  const [planFullData, setPlanFullData] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [planId, setPlanId] = useState("");
  const [viewData, setViewData] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [idFile, setIdFile] = useState({});
  const [AddressFile, setAddressFile] = useState({});
  const [backUp, setBackUp] = useState([]);
  let itemPerPage = 8;
  let [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    creator_id: "",
    full_name: "",
    mobile_number: null,
    userType: "user",
    generateInvoice: false,
    connection_status: "",
    userName: "",
    password: "",
    // billing_type: "",
    deleted_file: [],
    nas: "",
    current_plan: {
      plan: "",
      start_date: "",
      end_date: ""
    },
    ipAddress: "",
    alter_mobile_number: null,
    email: "",
    gst_no: "",
    billing_address: {
      address_line1: "",
      address_line2: "",
      state: "",
      city: "",
      pin_code: "",
      flat_number: ""
    },
    installation_address: {
      address_line1: "",
      address_line2: "",
      state: "",
      city: "",
      pin_code: "",
      flat_number: ""
    },
    identity_verify: {
      id_proof: "",
      id_proof_no: "",
      attachment: {
        file_name: "",
        file_url: ""
      }
    },
    address_verify: {
      address_proof: "",
      address_proof_no: "",
      attachment: {
        file_name: "",
        file_url: ""
      }
    },
    replyAttributes: {},
    checkAttributes: {}
  });
  const [nameErr, setnameErr] = useState(false);
  const [emailErr, setemailErr] = useState("");
  const [phoneErr, setphoneErr] = useState("");

  const [bHouseErr, setbHouseErr] = useState(false);
  const [bStateErr, setbStateErr] = useState(false);
  const [bCityErr, setbCityErr] = useState(false);
  const [bCodeErr, setbCodeErr] = useState(false);

  const [iHouseErr, setiHouseErr] = useState(false);
  const [iStateErr, setiStateErr] = useState(false);
  const [iCityErr, setiCityErr] = useState(false);
  const [iCodeErr, setiCodeErr] = useState(false);

  const [idTypeErr, setidTypeErr] = useState(false);
  const [idNoErr, setidNoErr] = useState(false);

  const [addTypeErr, setaddTypeErr] = useState(false);
  const [addNoErr, setaddNoErr] = useState(false);

  const [file1Err, setFile1Err] = useState(false);
  const [file2Err, setFile2Err] = useState(false);

  const [uNameErr, setUNameErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [IPErr, setIpErr] = useState(false);
  const [planErr, setPlanErr] = useState(false);
  const [getDataBng, setGetDatabng] = useState({});

  const getDataBngFunction = async () => {
    try {
      let response = await getBngData();
      setGetDatabng(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInutAttributes = (field, type, check, value) => {
    let attributeFull = { ...formData };
    if (check) {
      if (type == "reply") {
        attributeFull.replyAttributes = { ...attributeFull.replyAttributes, [field]: value };
      } else {
        attributeFull.checkAttributes = { ...attributeFull.checkAttributes, [field]: value };
      }
    } else {
      if (type == "reply") {
        delete attributeFull.replyAttributes[field];
      } else {
        delete attributeFull.checkAttributes[field];
      }
    }
    setFormData(attributeFull);
  };
  const [otherPermission, setOtherPermission] = useState([]);

  async function permissionFunction() {
    const res = await permisionsTab();

    const permissions = res.filter(s => s.tab_name === "Subscriber Management");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0].is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setSubPermission(permissionArr);
    }

    setOtherPermission(
      res.filter(s => {
        if (
          s.tab_name === "Subscriber Management" ||
          s.tab_name === "Inventory Management" ||
          s.tab_name === "Invoices" ||
          s.tab_name === "Help Desk" ||
          s.tab_name === "Service Management"
        ) {
          return s.is_show;
        } else {
          return false;
        }
      }).map(es=>es.tab_name)
    );
  }

  function handleChangeInput(e, key) {
    let { name, value } = e.target;

    switch (key) {
      case "current_plan":
        let newObj1 = { ...formData.current_plan, [name]: value };
        setFormData(pre => {
          return {
            ...pre,
            current_plan: newObj1
          };
        });
        break;
      case "billing_address":
        let newObj3 = { ...formData.billing_address, [name]: value };
        setFormData(pre => {
          return {
            ...pre,
            billing_address: newObj3
          };
        });
        if (name == "flat_number") {
          setbHouseErr(false);
        }
        if (name == "state") {
          setbStateErr(false);
        }
        if (name == "city") {
          setbCityErr(false);
        }
        if (name == "pin_code") {
          setbCodeErr(false);
        }

        break;
      case "installation_address":
        let newObj4 = { ...formData.installation_address, [name]: value };
        setFormData(pre => {
          return {
            ...pre,
            installation_address: newObj4
          };
        });

        if (name == "flat_number") {
          setiHouseErr(false);
        }
        if (name == "state") {
          setiStateErr(false);
        }
        if (name == "city") {
          setiCityErr(false);
        }
        if (name == "pin_code") {
          setiCodeErr(false);
        }

        break;

      case "identity_verify":
        let newObj5 = { ...formData.identity_verify, [name]: value };
        setFormData(pre => {
          return {
            ...pre,
            identity_verify: newObj5
          };
        });
        if (name == "id_proof") {
          setidTypeErr(false);
        }
        if (name == "id_proof_no") {
          setidNoErr(false);
        }
        break;
      case "address_verify":
        let newObj6 = { ...formData.address_verify, [name]: value };
        setFormData(pre => {
          return {
            ...pre,
            address_verify: newObj6
          };
        });
        if (name == "address_proof") {
          setaddTypeErr(false);
        }
        if (name == "address_proof_no") {
          setaddNoErr(false);
        }
        break;

      default:
        setFormData(pre => {
          return {
            ...pre,
            [name]: value
          };
        });
        if (name == "full_name") {
          setnameErr(false);
        }
        if (name == "email") {
          setemailErr("");
        }
        if (name == "mobile_number") {
          setphoneErr("");
        }

        if (name == "userName") {
          setUNameErr(false);
        }
        if (name == "password") {
          setPassErr(false);
        }
        if (name == "ipAddress") {
          setIpErr(false);
        }
        if (name == "current_plan") {
          setPlanErr(false);
        }
        break;
    }

    setFormData(pre => {
      return {
        ...pre,
        [name]: value
      };
    });
  }

  function checkValidationFunction() {
    if (formData.full_name == "") {
      setnameErr(true);
      return false;
    }
    if (formData.email == "") {
      setemailErr("Required");
      return false;
    }
    if (formData.mobile_number == "") {
      setphoneErr("Required");
      return false;
    } else if (!/^\d{10}$/.test(formData.mobile_number)) {
      setphoneErr("Mobile number must be exactly 10 digits");
      return false;
    }
    if (formData.billing_address.flat_number == "") {
      setbHouseErr(true);
      return false;
    }
    if (formData.billing_address.state == "") {
      setbStateErr(true);
      return false;
    }
    if (formData.billing_address.city == "") {
      setbCityErr(true);
      return false;
    }
    if (formData.billing_address.pin_code == "") {
      setbCodeErr(true);
      return false;
    }
    if (formData.installation_address.flat_number == "") {
      setiHouseErr(true);
      return false;
    }
    if (formData.installation_address.state == "") {
      setiStateErr(true);
      return false;
    }
    if (formData.installation_address.city == "") {
      setiCityErr(true);
      return false;
    }
    if (formData.installation_address.pin_code == "") {
      setiCodeErr(true);
      return false;
    }
    if (formData.identity_verify.id_proof == "") {
      setidTypeErr(true);
      return false;
    }
    if (formData.identity_verify.id_proof_no == "") {
      setidNoErr(true);
      return false;
    }
    if (formData.address_verify.address_proof == "") {
      setaddTypeErr(true);
      return false;
    }
    if (formData.address_verify.address_proof_no == "") {
      setaddNoErr(true);
      return false;
    }

    return true;
  }

  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, planFullData);
    setplanData(ddd);
  }, [page]);

  const getAllData = async () => {
    try {
      setSkeletonLoading(true);
      const response = await getAllSubscriberOther(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id);
      await permissionFunction();

      const plans = response?.data?.data.reverse();
      console.log(plans, "check data")
      setPlanFullData(plans);
      setBackUp(plans);
      if (viewData?._id) {
        setViewData(plans.find(es => es._id === viewData._id));
      }
      const data = paginateData(page, itemPerPage, plans);
      setplanData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setSkeletonLoading(false);
    }
  };

  const deleteSubscriberData = async () => {
    setLoader(true);
    try {
      await deleteSubscriber(planId);
    } catch (err) {
      console.log(err);
    } finally {
      await getAllData();
      setDeleteModal(false);
      setPlanId("");
      setLoader(false);
      dispatch(
        success({
          show: true,
          msg: `Subscriber deleted successfully`,
          severity: "success"
        })
      );
    }
  };
  useEffect(() => {
    getAllData();
    getDataBngFunction();
  }, []);

  function checkValidationFunction2() {
    if (formData.userName == "") {
      setUNameErr("Required");
      return false;
    }
    if (formData.password == "") {
      setPassErr(true);
      return false;
    }
    if (formData.ipAddress == "") {
      setIpErr(true);
      return false;
    }

    if (formData.current_plan.plan == "") {
      setPlanErr(true);
      return false;
    }

    return true;
  }

  // function checkValidationFunction() {
  //   // Reset all error states initially
  //   setUNameErr(false);
  //   setPassErr([]);
  //   setIpErr(false);
  //   setPlanErr(false);

  //   let isValid = true;

  //   if (formData.userName === "") {
  //     setUNameErr(true);
  //     isValid = false;
  //   }

  //   if (formData.password === "") {
  //     setPassErr(["Field is required"]);
  //     isValid = false;
  //   } else {
  //     const password = formData.password;
  //     const errors = [];
  //     if (password.length < 8) {
  //       errors.push("Password must be at least 8 characters long");
  //     }
  //     if (!/[a-z]/.test(password)) {
  //       errors.push("Password must include at least one lowercase letter");
  //     }
  //     if (!/[A-Z]/.test(password)) {
  //       errors.push("Password must include at least one uppercase letter");
  //     }
  //     if (!/\d/.test(password)) {
  //       errors.push("Password must include at least one number");
  //     }
  //     if (!/[@$!%*?&]/.test(password)) {
  //       errors.push("Password must include at least one special character");
  //     }
  //     if (errors.length > 0) {
  //       setPassErr(errors);
  //       isValid = false;
  //     }
  //   }

  //   if (formData.ipAddress === "") {
  //     setIpErr(true);
  //     isValid = false;
  //   }

  //   if (formData.current_plan.plan === "") {
  //     setPlanErr(true);
  //     isValid = false;
  //   }

  //   return isValid;
  // }

  function nextButton(e,tab) {
    e.preventDefault();
    let valid = checkValidationFunction2();
    if (!valid) {
      return;
    }

    setActiveTab(tab);
  }

  const handleSearchClick = e => {
    let val = e?.trim()?.toLowerCase();

    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, planFullData);
      setplanData(ddd);
    } else {
      if (Array.isArray(planFullData)) {
        let searchName = planFullData.filter(res => {
          if (
            res?.full_name?.toLowerCase().includes(val) ||
            res?.connectionStatus?.toLowerCase().includes(val) ||
            res?.planInfo?.plan_name?.toLowerCase().includes(val) ||
            // res?.planInfo?.amount?.includes(val) ||
            res?.createdAt?.toLowerCase().includes(val) ||
            res?.planInfo?.type?.toLowerCase().includes(val) ||
            res?.planInfo?.category?.toLowerCase().includes(val) ||
            res?.mobile_number?.toString()?.includes(val) 
          ) {
            return true;
          } else {
            return false;
          }
        });
        setplanData(searchName);
      }
    }
  };

  async function submitForm(e) {
    e.preventDefault();

    let valid = checkValidationFunction();
    if (!valid) {
      return;
    }
  

    const payload = {
      ...formData,
      creator_id: userInfo()._id,
      connectionStatus: "dashboard",
      org_id: userInfo().org_id,
      isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
    };
    console.log(payload,"payload of my subscriber management")

    if (idFile?.name == undefined && payload?.identity_verify?.attachment?.file_name == "") {
      setFile1Err(true);
      return;
    }

    if (AddressFile?.name == undefined && payload?.address_verify?.attachment?.file_name == "") {
      setFile2Err(true);
      return;
    }
    setLoader(true);
    let delFile = [];

    if (idFile?.name !== undefined) {
      let fileForm = new FormData();
      fileForm.append("upload", idFile);
      let res = await uploadDocument(fileForm);
      delFile.push(formData?.identity_verify?.attachment?.file_name);
      // setFileFordelete(pre=>{
      //   return [...pre,formData?.identity_verify?.attachment?.file_name]
      // })
      payload.identity_verify.attachment = res?.data?.data[0];
    }

    if (AddressFile?.name !== undefined) {
      let fileForm2 = new FormData();
      fileForm2.append("upload", AddressFile);
      let res = await uploadDocument(fileForm2);
      delFile.push(formData?.address_verify?.attachment?.file_name);
      // setFileFordelete(pre=>{
      //   return [...pre,formData?.address_verify?.attachment?.file_name]
      // })
      payload.address_verify.attachment = res?.data?.data[0];
    }

    payload.deleted_file = [...fileForDelete, ...delFile];

    try {
      await addSubscriber(payload);
      dispatch(
        success({
          show: true,
          msg: `${open.mode == "edit" ? "Subscriber" : "New subscriber"} ${
            open.mode == "edit" ? "edited" : "created"
          } successfully`,
          severity: "success"
        })
      );

      setIdFile({});
      setAddressFile({});
      setFileFordelete([]);
      setOpen({ mode: "", status: false });
      setLoader(false);
      setActiveTab("1");
      await getAllData();
      setFormData({
        creator_id: "",
        full_name: "",
        mobile_number: null,
        userType: "user",
        generateInvoice: false,
        connection_status: "",
        userName: "",
        password: "",
        // billing_type: "",
        deleted_file: [],
        nas: "",
        current_plan: {
          plan: "",
          start_date: "",
          end_date: ""
        },
        ipAddress: "",
        alter_mobile_number: null,
        email: "",
        gst_no: "",
        billing_address: {
          address_line1: "",
          address_line2: "",
          state: "",
          city: "",
          pin_code: "",
          flat_number: ""
        },
        installation_address: {
          address_line1: "",
          address_line2: "",
          state: "",
          city: "",
          pin_code: "",
          flat_number: ""
        },
        identity_verify: {
          id_proof: "",
          id_proof_no: "",
          attachment: {
            file_name: "",
            file_url: ""
          }
        },
        address_verify: {
          address_proof: "",
          address_proof_no: "",
          attachment: {
            file_name: "",
            file_url: ""
          }
        }
      });
    } catch (err) {
      console.log(err);

      if (err.response.data.errormessage == "Phone number already exists.") {
        setphoneErr(err.response.data.errormessage);
      }
      if (err.response.data.errormessage == "User name already exist.") {
        setUNameErr("User name already exist.");
      }
      if (err.response.data.errormessage == "Email already exists.") {
        setemailErr(err.response.data.errormessage);
      }
      setLoader(false);
      dispatch(
        error({
          show: true,
          msg: err.response.data.errormessage,
          severity: "error"
        })
      );
    }
  }

  function openAddModal() {
    setOpen({ mode: "add", status: true });
    setFileFordelete([]);
    removeErr3();
    setFormData({
      creator_id: "",
      full_name: "",
      mobile_number: null,
      userType: "user",
      generateInvoice: false,
      connection_status: "",
      userName: "",
      // billing_type: "",
      password: "",
      // "zone": "",
      nas: "",
      current_plan: {
        plan: "",
        start_date: "",
        end_date: ""
      },
      ipAddress: "",
      alter_mobile_number: null,
      email: "",
      gst_no: "",
      billing_address: {
        address_line1: "",
        address_line2: "",
        state: "",
        city: "",
        pin_code: "",
        flat_number: ""
      },
      installation_address: {
        address_line1: "",
        address_line2: "",
        state: "",
        city: "",
        pin_code: "",
        flat_number: ""
      },
      identity_verify: {
        id_proof: "",
        id_proof_no: "",
        attachment: {
          file_name: "",
          file_url: ""
        }
      },
      address_verify: {
        address_proof: "",
        address_proof_no: "",
        attachment: {
          file_name: "",
          file_url: ""
        }
      }
    });
  }

  function removeErr1() {
    setiHouseErr(false);
    setiStateErr(false);
    setiCityErr(false);
    setiCodeErr(false);
  }
  function removeErr2() {
    setaddTypeErr(false);
    setaddNoErr(false);
    setFile2Err(false);
  }
  function removeErr3() {
    setUNameErr("");
    setPassErr(false);
    setIpErr(false);
  }

  function FilterData(e) {
    let type = e.target.value;
    setFilter(type);
    if (type == "All") {
      setPlanFullData(backUp);
      const data = paginateData(page, itemPerPage, backUp);
      setplanData(data);
    } else {
      let arr = [...backUp];
      let newArr = arr.filter(res => res.status == type);
      setPlanFullData(newArr);
      const data = paginateData(page, itemPerPage, newArr);
      setplanData(data);
    }
  }

  async function updateUserCategory(id) {
    setLoader(true);
    try {
      let payload = { ...viewData };
      await addSubscriber(payload);
      await getAllData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  }
  async function updateStatus(id) {
    await updateStatusSubscriber(id);
    await getAllData();
  }

  return (
    <Content>
      {permissionAccess ? (
        <>
          <ViewOther
            open={openTwo}
            setOpen={setOpenTwo}
            planData={viewData}
            setplanData={setViewData}
            updateUserCategory={updateUserCategory}
            getAllData={getAllData}
            otherPermission={otherPermission}
            
          />
          <DeleteModal
            isOpen={deleteModal}
            toggle={() => {
              setDeleteModal(!deleteModal);
              setPlanId("");
            }}
            user="Subscriber"
            onConfirm={deleteSubscriberData}
          />
          {loader ? <Loader /> : ""}
          <AddSubscriber
            open={open.status}
            setOpen={setOpen}
            mode={open.mode}
            handleChangeInput={handleChangeInput}
            formData={formData}
            setLoader={setLoader}
            setFormData={setFormData}
            handleSubmit={submitForm}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            setIdFile={setIdFile}
            setAddressFile={setAddressFile}
            idFile={idFile}
            addressFile={AddressFile}
            setFile1Err={setFile1Err}
            setFile2Err={setFile2Err}
            removeErr1={removeErr1}
            removeErr2={removeErr2}
            removeErr3={removeErr3}
            setFileFordelete={setFileFordelete}
            setbStateErr={setbStateErr}
            setiStateErr={setiStateErr}
            nextButton={nextButton}
            errors={{
              full_name: nameErr,
              email: emailErr,
              mobile_number: phoneErr,
              bFlatNo: bHouseErr,
              bState: bStateErr,
              bCity: bCityErr,
              bCode: bCodeErr,
              iFlatNo: iHouseErr,
              iState: iStateErr,
              iCity: iCityErr,
              iCode: iCodeErr,
              idType: idTypeErr,
              idNo: idNoErr,
              addType: addTypeErr,
              addNo: addNoErr,
              file1: file1Err,
              file2: file2Err,
              userName: uNameErr,
              password: passErr,
              ipAddress: IPErr,
              current_plan: planErr
            }}
            setPlanErr={setPlanErr}
            setGetDatabng={setGetDatabng}
            getDataBng={getDataBng}
            getDataBngFunction={getDataBngFunction}
            handleInutAttributes={handleInutAttributes}
          />
          <div className="card_container p-md-4 p-sm-3 p-2 user_section">
            <div className="topContainer">
              <div className="head_min w-100">Subscriber Management (Other)</div>
              <div className={`${style.subscriber_head} d-flex align-items-center w-100 justify-content-end`}>
                {/* {subPermission.includes("Add Subscriber") && (
                  <> */}
                    <button className="btn btn-primary" type="button" onClick={openAddModal}>
                      Add Subscriber Other
                    </button>
                  {/* </>
                )} */}
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between mt-md-4 mt-sm-4">
              <div className="col-lg-3 col-md-3 col-sm-3 col-6 mb-md-0 p-0 ">
                <SearchInput
                  placeholder={"Enter a name "}
                  onChange={e => {
                    if (e.target.value === " ") {
                      e.target.value = "";
                    } else {
                      handleSearchClick(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="mt-md-0 mt-sm-0 mt-2">
                <select className="btn border" value={filter} onChange={FilterData}>
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* <div className="d-flex align-items-center justify-content-between mt-md-5 mt-sm-4 mt-3">
              <SearchInput
                placeholder={"Enter a name "}
                onChange={(e) => {
                  if (e.target.value == " ") {
                    e.target.value = "";
                  } else {
                    handleSearchClick(e.target.value);
                  }
                }}
              />
              <select className="btn border" value={filter} onChange={FilterData}>
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button className={`btn border`}>
                <span> Filter</span>
                <CiFilter size="20px" style={{ fontSize: "1.5rem", color: "#0E1073" }} />
              </button>
            </div> */}
            {skeletonLoading ? (
              <div className="mt-md-5 mt-sm-4 mt-3">
                <TableSkeleton rows={4} columns={6} />
              </div>
            ) : (
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Subscriber Name</th>
                      {/* <th>Plan Type/Category</th> */}
                      <th>Mobile Number</th>
                      <th>Source</th>
                      {/* <th>Plan Name</th>
                      <th>Bill Amount</th> */}
                      <th>Created on</th>
                      <th>Status</th>
                      {(subPermission.includes("Edit Subscriber") || subPermission.includes("Delete Subscriber")) && (
                        <>
                          <th>Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {planData.map(plan => (
                      <tr key={plan.id}>
                        <td
                          className={subPermission.includes("View Subscriber") ? "pointer" : ""}
                          onClick={() => {
                            if (subPermission?.includes("View Subscriber")) {
                              setOpenTwo(true);
                              setViewData(plan);
                            }
                          }}
                          // style={subPermission.includes("View Subscriber") ? { cursor: "pointer" } : {}}
                        >
                          {plan?.full_name.charAt(0).toUpperCase() + plan?.full_name.slice(1)}
                        </td>
                        <td>{plan?.mobile_number}</td>
                        {/* <td>
                          {plan?.planInfo?.category?.charAt(0).toUpperCase() + plan?.planInfo?.category?.slice(1) &&
                          plan?.planInfo?.type?.charAt(0).toUpperCase() + plan?.planInfo?.type?.slice(1) ? (
                            <>
                              {plan?.planInfo?.category?.charAt(0).toUpperCase() + plan?.planInfo?.category?.slice(1)}/
                              {plan?.planInfo?.type?.charAt(0).toUpperCase() + plan?.planInfo?.type?.slice(1)}
                            </>
                          ) : (
                            "--"
                          )}
                        </td> */}
                        <td>
                          {plan?.connectionStatus
                            ? plan?.connectionStatus?.charAt(0).toUpperCase() + plan?.connectionStatus?.slice(1)
                            : ""}
                        </td>
                        {/* <td>{plan?.planInfo?.plan_name ? plan?.planInfo?.plan_name : "--"}</td>

                        <td>{plan?.planInfo?.amount ? plan?.planInfo?.amount : "--"}</td> */}

                        <td>{moment(plan?.createdAt).format("DD-MM-YYYY")}</td>
                        {plan?.status === "Active" ? (
                          <>
                            {" "}
                            <td style={{ color: "green", cursor: "pointer" }} onClick={() => updateStatus(plan._id)}>
                              Active
                            </td>
                          </>
                        ) : (
                          <>
                            {" "}
                            <td style={{ color: "#F06565", cursor: "pointer" }} onClick={() => updateStatus(plan._id)}>
                              Inactive
                            </td>
                          </>
                        )}
                        {(subPermission.includes("Edit Subscriber") || subPermission.includes("Delete Subscriber")) && (
                          <>
                            <td className="d-flex  align-items-center">
                              {subPermission.includes("Edit Subscriber") && (
                                <>
                                  <FiEdit
                                    className="f-20 pointer parimary-color"
                                    color="#0E1073"
                                    onClick={e => {
                                      setFormData(plan);
                                      setOpen({ mode: "edit", status: true });
                                    }}
                                  />
                                </>
                              )}
                              <div className="line mx-3"></div>
                              {subPermission.includes("Delete Subscriber") && (
                                <>
                                  <BsTrash
                                    className="f-20 pointer parimary-color"
                                    color="#0E1073"
                                    onClick={() => {
                                      setPlanId(plan._id);
                                      setDeleteModal(true);
                                    }}
                                  />
                                </>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            <div class="d-flex justify-content-center mt-3">
              <PaginationComponent
                currentPage={page}
                itemPerPage={itemPerPage}
                paginate={d => {
                  setPage(d);
                }}
                totalItems={planFullData.length}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <Error403 />
        </>
      )}
    </Content>
  );
}

