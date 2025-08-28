import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  addAndUpdateSetting,
  addAndUpdateSetting2,
  createIsp,
  emailAndNumberCheck,
  forgetPasswordEmailSend,
  getLogoSetting,
  updateIspById,
  uploadDocument
} from "../../service/admin";
import { success, error } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Loader from "../../components/commonComponent/loader/Loader";
import { UserAvatar } from "../../components/Component";
import { CgProfile } from "react-icons/cg";
import { updateGeneralSettings } from "../../Store/Slices/GenralSettingsSlice";
export default function IspCreateAndUpdate({ open, setOpen, mode, editData, getAllIspDataFunction }) {
  let id = editData?._id;
  const [formData, setFormData] = useState({
    admin_name: "",
    admin_email: "",
    admin_contact: "",
    profile_image: {
      file_url: "",
      file_name: "",
        color: "",
    lighterColor: "",
   
    }
  });
  const [num, setNum] = useState("");
  const [valid, setValid] = useState(false);
  const [preFiles, setPreFiles] = useState();
  const [error, setError] = useState("");
  // const emailRef = useRef();
  const [loader, setLoader] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState();
const dispatch = useDispatch();
  const [themeColor, setThemeColor] = useState("");
  const [lighterColor, setLighterColor] = useState("");






  const handleInput = e => {
    const { name, value } = e.target;
    if (value === " ") {
      e.target.value = "";
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleForgetPassword = async email => {
    // if (emailRef.current === '') {
    //   setError('Email is required');
    //   return;
    // }

    try {
      await forgetPasswordEmailSend({ email: email });
      dispatch(
        success({
          show: true,
          msg: "Reset Password link is send successfully ",
          severity: "success"
        })
      );
    } catch (error) {
      console.error("There was an error!", error.response.data.errormessage);
      setError(error.response.data.errormessage);
    }
  };
  useEffect(() => {
    if (editData) {
      setFormData({
        admin_name: editData.admin_name || "",
        admin_email: editData.admin_email || "",
        admin_contact: editData.admin_contact || "",
        profile_image: editData.profile_image || { file_name: "", file_url: "" }
      });
      setPreviewUrl(editData?.profile_image?.file_url || "");
    }
  }, [editData]);

  // const createIspFunction = async e => {
  //   e.preventDefault();
  //   setLoader(true);

  //   try {
  //     if (num.length === 10) {
  //       let payload = { ...formData };
  //       if (selectedImage) {
  //         const formDatainfo = new FormData();
  //         formDatainfo.append("upload", selectedImage);
  //         let image = await uploadDocument(formDatainfo).then(res => res.data.data[0]);
  //         payload.profile_image.file_name = image.file_name;
  //         payload.profile_image.file_url = image.file_url;
  //       }

  //       if (mode === "edit") {
  //         let response = await updateIspById(id, payload);
  //         dispatch(
  //           success({
  //             show: true,
  //             msg: "Isp updated successfully",
  //             severity: "success"
  //           })
  //         );
  //         setValid(false);
  //         setOpen({ mode: "", status: false, data: {} });
  //       } else {
  //         let response = await createIsp(payload);
  //         dispatch(
  //           success({
  //             show: true,
  //             msg: "Isp created successfully",
  //             severity: "success"
  //           })
  //         );
  //         setValid(false);
  //         setOpen({ mode: "", status: false, data: {} });
  //       }
  //       setLoader(false);
  //       getAllIspDataFunction();
  //       setFormData({});
  //     } else {
  //       setValid(true);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     if (err?.response?.data?.errormessage.includes("This Email Already Exist")) {
  //       dispatch(
  //         error({
  //           show: true,
  //           msg: "This Email Already Exist",
  //           severity: "error"
  //         })
  //       );
  //     }
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  const createIspFunction = async (e) => {
  e.preventDefault();
  setLoader(true);

  try {
    if (num.length === 10) {
      let payload = { ...formData };

      // Handle image upload
      if (selectedImage) {
        const formDatainfo = new FormData();
        formDatainfo.append("upload", selectedImage);
        let image = await uploadDocument(formDatainfo).then((res) => res.data.data[0]);
        payload.profile_image.file_name = image.file_name;
        payload.profile_image.file_url = image.file_url;
      }

      if (mode === "edit") {
        let response = await updateIspById(id, payload);
        dispatch(
          success({
            show: true,
            msg: "Isp updated successfully",
            severity: "success",
          })
        );
        setValid(false);
        setOpen({ mode: "", status: false, data: {} });
      } else {
 
        let response = await createIsp(payload);
        const newIspId = response?.data?.data?._id; 
        console.log("New ISP ID:", newIspId);

       await addAndUpdateSetting2({
  color: "#0e1073", 
  lighterColor: "#6576ff",
  org_id: newIspId,
});

     getpreviousData();


        dispatch(
          success({
            show: true,
            msg: "Isp created successfully",
            severity: "success",
          })
        );
        setValid(false);
        setOpen({ mode: "", status: false, data: {} });
      }

      setLoader(false);
      getAllIspDataFunction();
      setFormData({});
    } else {
      setValid(true);
    }
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.errormessage?.includes("This Email Already Exist")) {
      dispatch(
        error({
          show: true,
          msg: "This Email Already Exist",
          severity: "error",
        })
      );
    }
  } finally {
    setLoader(false);
  }
};

 
const getpreviousData = async () => {
  setLoader(true);
  try {
   
    let predata = await getLogoSetting();
    const settingData = predata.data.data;

    setPreFiles(settingData);
    setThemeColor(settingData.color);
    setLighterColor(settingData.lighterColor);
    setFormData(settingData);

    
    if (settingData?.color) {
      document.documentElement.style.setProperty('--primaryColor', settingData.color);
    }
    if (settingData?.lighterColor) {
      document.documentElement.style.setProperty('--primaryColorLight', settingData.lighterColor);
    }

  } catch (error) {
    console.error("Error in getpreviousData", error);
  }
  setLoader(false);
};


 useEffect(() => {

    getpreviousData();
  }, []);

  const handleImageChange = event => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profile_image: {
            file_name: file.name,
            file_url: reader.result
          }
        }));
      };
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setFormData(prev => ({
      ...prev,
      profile_image: { file_name: "", file_url: "" }
    }));
  };

  return (
    <div>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal centered scrollable isOpen={open} size="lg">
        <ModalHeader
          toggle={() => {
            setOpen({ mode: "", status: false, data: {} });
            setValid(false);
          }}
        >
          <div className="f-24">{mode === "edit" ? "Edit" : "Create"} ISP</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={createIspFunction}>
            <div className="d-flex justify-content-center">
              <label className="form-label">Upload Profile</label>
            </div>
            <div className="d-flex justify-content-center">
              {previewUrl ? (
                <div style={{ marginBottom: "24px" }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      border: "4px solid #1890ff",
                      objectFit: "cover"
                    }}
                    // className="border border-danger"
                  />
                  <br />
                  <button
                    onClick={handleRemoveImage}
                    style={{
                      marginTop: "16px",
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      boxShadow: "0px 4px 10px rgba(255, 77, 79, 0.2)",
                      transition: "background-color 0.3s"
                    }}
                    onMouseOver={e => (e.target.style.backgroundColor = "#d9363e")}
                    onMouseOut={e => (e.target.style.backgroundColor = "#ff4d4f")}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="file-input"
                    onChange={handleImageChange}
                    // onClick={() =>
                    //   setValidation((prev) => ({ ...prev, image: false }))
                    // }
                  />
                  <label
                    htmlFor="file-input"
                    style={{
                      display: "inline-block",
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      color: "#999",
                      textAlign: "center",
                      lineHeight: "150px",
                      cursor: "pointer",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      transition: "background-color 0.3s"
                    }}
                    // onMouseOver={(e) =>
                    //   (e.target.style.backgroundColor = "#e6f7ff")
                    // }
                    onMouseOut={e => (e.target.style.backgroundColor = "#f0f0f0")}
                    // className={Validation.image ? `border border-danger` : ""}
                  >
                    <CgProfile
                      style={{
                        fontSize: "30px",
                        color: "#999"
                      }}
                    />
                  </label>
                </>
              )}
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">
                  ISP Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="admin_name"
                  className="form-control"
                  placeholder="Enter ISP name"
                  required
                  value={formData.admin_name}
                  onChange={handleInput}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  ISP Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="admin_email"
                  className="form-control"
                  placeholder="Enter ISP email"
                  required
                  value={formData.admin_email}
                  onChange={handleInput}
                  // disabled={mode === "edit"}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  ISP Mobile Number <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="admin_contact"
                  className="form-control"
                  placeholder="Enter ISP mobile number"
                  value={formData.admin_contact}
                  required
                  onChange={e => {
                    if (e.target.value.length <= 10) {
                      handleInput(e);
                      setNum(e.target.value);
                    }
                  }}
                />
                {valid && !num.length !== 10 && (
                  <>
                    <p className="text-danger">Please enter 10 digit number</p>
                  </>
                )}
              </div>
              {editData && (
                <>
                  <div className="col-md-6">
                    <button
                      className="btn btn-primary mt-4"
                      type="button"
                      onClick={() => handleForgetPassword(formData.admin_email)}
                    >
                      Send Reset Password Link
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn text-primary mr-3"
                type="button"
                onClick={() => {
                  setOpen({ mode: "", status: false, data: {} });
                  setValid(false);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                {mode === "edit" ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
