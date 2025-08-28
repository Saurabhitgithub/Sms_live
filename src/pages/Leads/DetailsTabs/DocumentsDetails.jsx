import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { TbUpload } from "react-icons/tb";
import { FormGroup, Label } from "reactstrap";
import { uploadDocument, updateLeadsData } from "../../../service/admin";
import style from "./style.module.css";
import Loader from "../../../components/commonComponent/loader/Loader";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { userId, userInfo } from "../../../assets/userLoginInfo";

export default function DocumentsDetails({ getDataById, getdataLeads }) {
  const [disable, setDisable] = useState(true);
  const [initialData, setInitialData] = useState({});
  const idVerification = [
    { value: "Aadhar Card", label: "Aadhar card" },
    { value: "PAN Card", label: "PAN Card" },
    { value: "Driving License", label: "Driving License" },
    { value: "Voter Card", label: "Voter Card" },
    { value: "Passport", label: "Passport" },
  ];
  const addressVerify = [
    { value: "Aadhar Card", label: "Aadhar card" },
    { value: "PAN Card", label: "PAN Card" },
    { value: "Driving License", label: "Driving License" },
    { value: "Voter Card", label: "Voter Card" },
    { value: "Passport", label: "Passport" },
  ];

  const [formData, setFormData] = useState({
    identity_verify: {
      id_proof: "",
      id_proof_no: "",
      attachment: {
        file_name: "",
        file_url: "",
      },
    },
    address_verify: {
      address_proof: "",
      address_proof_no: "",
      attachment: {
        file_name: "",
        file_url: "",
      },
    },
    photograph: {
      file_name: "",
      file_url: "",
    },
  });
  const [fileForDelete, setFileFordelete] = useState([]);
  const [checkbox2, setCheckbox2] = useState(getDataById?.sameAsDocument);
  const [idFile, setIdFile] = useState();
  const [file1Err, setFile1Err] = useState(false);
  const [file2Err, setFile2Err] = useState(false);
  const [file3Err, setFile3Err] = useState(false);

  const [AddressFile, setAddressFile] = useState({});
  const [photoFile, setPhotoFile] = useState({});
  const [open, setOpen] = useState({ mode: "", status: false });
  const [idTypeErr, setidTypeErr] = useState(false);
  const [idNoErr, setidNoErr] = useState(false);
  const [addTypeErr, setaddTypeErr] = useState(false);
  const [addNoErr, setaddNoErr] = useState(false);
  const [loader, setLoader] = useState(false);

  const paramsData = useParams();

  function removeErr2() {
    setaddTypeErr(false);
    setaddNoErr(false);
    setFile2Err(false);
  }

  function handleChangeInput(e, key) {
    let { name, value } = e.target;
    // 
    switch (key) {
      case "identity_verify":
        let newObj5 = { ...formData.identity_verify, [name]: value };
   
        // 
        if(checkbox2){
          setFormData((pre) => {
            return {
              ...pre,
              address_verify:{
                address_proof:"",
                address_proof_no:""
              },
              identity_verify: newObj5,
            };
            
          });
          setAddressFile()
          setCheckbox2(false)
        }else{
          setFormData((pre) => {
            return {
              ...pre,
              identity_verify: newObj5,
            };
          });
        }
        if (name == "id_proof") {
          setidTypeErr(false);
        }
        if (name == "id_proof_no") {
          setidNoErr(false);
        }
        break;
      case "address_verify":
        let newObj6 = { ...formData.address_verify, [name]: value };
        setFormData((pre) => {
          return {
            ...pre,
            address_verify: newObj6,
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
        setFormData((pre) => {
          return {
            ...pre,
            [name]: value,
          };
        });
    }
  }

  useEffect(() => {
    // 
    setFormData(getDataById);
    setInitialData(getDataById); 
    setCheckbox2(getDataById?.sameAsDocument)
  }, [getDataById]);

  function errorShow(){
  
  }

  async function onSubmit(e) {
    setLoader(true);
    e.preventDefault();
    let delFile = [];
    const payload = {
      ...formData,
      id: paramsData.id,
      sameAsDocument: checkbox2,
      user_role:userInfo().role,
      user_name:userInfo().name,
      user_id:userId(),
    };
    // if (photoFile?.name == undefined && payload?.photograph?.file_name == undefined) {
    //     setFile3Err(true);
    //     return setLoader(false);
    //   }
    //   if (idFile?.name == undefined && payload?.identity_verify?.attachment?.file_name == undefined) {
    //     setFile1Err(true);
    //     return setLoader(false);
    //   }
  
    //   if (AddressFile?.name == undefined && payload?.address_verify?.attachment?.file_name == undefined) {
    //     setFile2Err(true);
    //     return setLoader(false);
    //   }
   
    try {

      if (idFile?.name !== undefined) {
        let fileForm = new FormData();
        fileForm.append("upload", idFile);
        let res = await uploadDocument(fileForm);
        delFile.push(formData?.identity_verify?.attachment?.file_name);

        payload.identity_verify.attachment = res?.data?.data[0];
      }

      if (AddressFile?.name !== undefined) {
        let fileForm2 = new FormData();
        fileForm2.append("upload", AddressFile);
        let res = await uploadDocument(fileForm2);
        delFile.push(formData?.address_verify?.attachment?.file_name);

        payload.address_verify.attachment = res?.data?.data[0];
      }
      if (photoFile?.name !== undefined) {
        let fileForm = new FormData();
        fileForm.append("upload", photoFile);
        let res = await uploadDocument(fileForm);
        delFile.push(formData?.photograph?.file_name);

        payload.photograph = res?.data?.data[0];
      }
      payload.deleted_file = [...fileForDelete, ...delFile];
      await updateLeadsData(payload);
      setIdFile({});
      setAddressFile({});
      setPhotoFile({});
      setLoader(false);
      setDisable(true);
      setOpen({ mode: "", status: false });
      setInitialData(payload);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
    setLoader(false);
  }

  // async function onSubmit(e) {
  //     e.preventDefault();
  //     setLoader(true);

  //     let hasError = false;

  //     // Check ID file error

  //     let delFile = [];
  //     const payload = {
  //       ...formData,
  //       id: paramsData.id,
  //       sameAs: checkbox2,
  //     };

  //     try {
  //         if (idFile?.name === undefined && formData?.identity_verify?.attachment?.file_name === "") {
  //             setFile1Err(true);
  //             hasError = true;
  //           } else {
  //             setFile1Err(false);
  //           }

  //           // Check Address file error
  //           if (AddressFile?.name === undefined && formData?.address_verify?.attachment?.file_name === "") {
  //             setFile2Err(true);
  //             hasError = true;
  //           } else {
  //             setFile2Err(false);
  //           }

  //           // Check Photograph file error
  //           if (photoFile?.name === undefined && formData?.photograph?.file_name === "") {
  //             setFile3Err(true);
  //             hasError = true;
  //           } else {
  //             setFile3Err(false);
  //           }

  //           if (hasError) {
  //             setLoader(false);
  //             return;
  //           }
  //       if (idFile?.name !== undefined) {
  //         let fileForm = new FormData();
  //         fileForm.append("upload", idFile);
  //         let res = await uploadDocument(fileForm);
  //         delFile.push(formData?.identity_verify?.attachment?.file_name);
  //         payload.identity_verify.attachment = res?.data?.data[0];
  //       }

  //       if (AddressFile?.name !== undefined) {
  //         let fileForm2 = new FormData();
  //         fileForm2.append("upload", AddressFile);
  //         let res = await uploadDocument(fileForm2);
  //         delFile.push(formData?.address_verify?.attachment?.file_name);
  //         payload.address_verify.attachment = res?.data?.data[0];
  //       }

  //       if (photoFile?.name !== undefined) {
  //         let fileForm = new FormData();
  //         fileForm.append("upload", photoFile);
  //         let res = await uploadDocument(fileForm);
  //         delFile.push(formData?.photograph?.file_name);
  //         payload.photograph = res?.data?.data[0];
  //       }

  //       payload.deleted_file = [...fileForDelete, ...delFile];
  //       await updateLeadsData(payload);
  //       setIdFile({});
  //       setAddressFile({});
  //       setPhotoFile({});
  //       setLoader(false);
  //       setDisable(true);
  //       setOpen({ mode: "", status: false });
  //     } catch (err) {
  //       console.log(err);
  //       setLoader(false);
  //     }
  //   }

  function copyDetails(e) {
    setCheckbox2(e.target.checked);
    if (e.target.checked) {
      let address = formData.identity_verify;
      setFormData((pre) => {
        return {
          ...pre,
          address_verify: {
            address_proof: address?.id_proof,
            address_proof_no: address?.id_proof_no,
            attachment: {
              file_name: "",
              file_url: "",
            },
          },
        };
      });
      setAddressFile(idFile?idFile:{name:address?.attachment?.file_name});
      
    } else {
      setAddressFile({});
      setFormData((pre) => {
        return {
          ...pre,
          address_verify: {
            address_proof: "",
            address_proof_no: "",
            attachment: {
              file_name: "",
              file_url: "",
            },
          },
        };
      });
    }
   

    removeErr2();
  }
  function handleDisable() {
    if (!disable) {
      setFormData(initialData); // Reset to initial data
      // setCheckbox2(initialData?.sameAsDocument);
      setPhotoFile({});
      setIdFile({});
      setAddressFile({});
    }
    setDisable(!disable);
  }

  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <form onSubmit={onSubmit}>
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <div className="mr-3 fw-600 f-18">Document Details</div>
            {disable ? (
              <>
              {getDataById?.lead_status === "converted" ? (
                <></>
              ) : (
                <FaRegEdit className="f-20 text-primary pointer" onClick={() => setDisable(false)} />
              )}
            </>
            ) : (
              <IoCloseSharp className="f-20 text-primary pointer" onClick={() => handleDisable()} />
            )}
          </div>
          {disable ? (
            ""
          ) : (
            <button className="btn btn-sm btn-primary" type="submit">
              Save
            </button>
          )}
        </div>
        
        <div className="row">
          {photoFile?.name !== undefined || formData?.photograph?.file_name !== undefined ? (
            <div className="col-md-6 mt-3">
              <label className={`${style.labels} mb-1`}>Attachment File</label>
              <div className="form-control w-100" style={{ overflow: "hidden" }}>
                {photoFile?.name !== undefined ? photoFile?.name : formData?.photograph?.file_name}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="f-18 fw-500 mt-4">Photograph Proof (Optional)</div>
        <label className="btn btn-light text-primary mt-2" htmlFor="profileupload">
          <TbUpload /> Upload image
        </label>
        <input
          type="file"
          hidden
          id="profileupload"
          onChange={(e) => {
            setPhotoFile(e.target.files[0]);
            setFile3Err(false);
          }}
          disabled={disable}
        />
        {file3Err ? <div className="text-danger mt-1">Required</div> : ""}

        <div className="f-18 fw-500 mt-4">Identity Verification</div>
        <div className="row mt-1">
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label mb-1">Identity Verification</label>
            <SingleSelect
              disabled={disable}
              options={idVerification}
              name="id_proof"
              placeItem={"Identity Verification"}
              value={formData?.identity_verify?.id_proof}
              onChange={(e) => handleChangeInput(e, "identity_verify")}
              
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label mb-1">ID Proof No.</lable>
            <input
              className="form-control mt-1"
              placeholder="Enter your ID proof No."
              disabled={disable}
              name="id_proof_no"
              value={formData?.identity_verify?.id_proof_no}
              onChange={(e) => handleChangeInput(e, "identity_verify")}
          
            />
          </div>
        </div>
        <div className="row">
          {idFile?.name !== undefined || formData?.identity_verify?.attachment?.file_name !== undefined ? (
            <div className="col-md-6 mt-3">
              <label className={`${style.labels} mb-2`}>Attachment File</label>
              <div className="form-control w-100" style={{ overflow: "hidden" }}>
                {idFile?.name !== undefined ? idFile?.name : formData?.identity_verify?.attachment?.file_name}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <label className="btn btn-light text-primary mt-3" htmlFor="doc1">
          <TbUpload /> Upload Document
        </label>
        <input
          type="file"
          hidden
          id="doc1"
          onChange={(e) => {
            setIdFile(e.target.files[0]);
            setFile1Err(false);
            setFormData((pre) => {
              return {
                ...pre,
                address_verify:{
                  address_proof:"",
                  address_proof_no:""
                }
              };
              
            });
            setAddressFile()
            setCheckbox2(false)
          }}
          disabled={disable}
        />
        {file1Err ? <div className="text-danger mt-1">Required</div> : ""}
        <div className="f-18 fw-500 mt-4">Address Verification</div>
        <div className="check_box mt-4">
          <FormGroup check className="flex align-items-center">
            <input
              class="form-check-input input"
              type="checkbox"
              value=""
              id="flexCheckIndeterminate"
              checked={checkbox2}
              onChange={copyDetails}
              disabled={disable}
            />
            <Label className="labels ml-3 pt-1" check>
              Use ID Card as Address Verification
            </Label>
          </FormGroup>
        </div>
        <div className="row mt-1">
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label mb-1">Address Verification</label>
            <SingleSelect
              disabled={disable}
              options={addressVerify}
              name="address_proof"
              placeItem={"Identity Verification"}
              value={formData?.address_verify?.address_proof}
              onChange={(e) => {
                setCheckbox2(false);
                handleChangeInput(e, "address_verify");
              }}
              
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label mb-1">Address Proof No.</lable>
            <input
              name="address_proof_no"
              className="form-control mt-1"
              placeholder="Enter your ID proof No."
              disabled={disable}
              value={formData?.address_verify?.address_proof_no}
              onChange={(e) => {
                setCheckbox2(false);
                handleChangeInput(e, "address_verify");
              }}
             
            />
          </div>
        </div>
        <div className="row">
          
          {AddressFile?.name !== undefined || formData?.address_verify?.attachment?.file_name !== undefined ? (
            <div className="col-md-6 mt-3  ">
              <label className={`${style.labels} mb-1`}>Attachment File</label>
              <div className="form-control w-100" style={{ overflow: "hidden" }}>
                {AddressFile?.name ? AddressFile?.name : formData?.address_verify?.attachment?.file_name}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <label className="btn btn-light text-primary mt-3" htmlFor="doc2">
          <TbUpload /> Upload Document
        </label>
        <input
          type="file"
          hidden
          id="doc2"
          
          onChange={(e) => {
            setAddressFile(e.target.files[0]);
            setFile2Err(false);
            setCheckbox2(false);
          }}
          disabled={disable}
        />
        {file2Err ? <div className="text-danger mt-1">Required</div> : ""}
      </form>
    </>
  );
}
