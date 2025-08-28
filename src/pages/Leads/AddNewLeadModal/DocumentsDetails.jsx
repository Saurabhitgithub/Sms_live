import React, { useState } from "react";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { TbUpload } from "react-icons/tb";
import { updateLeadsData, uploadDocument } from "../../../service/admin";
import style from "../DetailsTabs/style.module.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../components/commonComponent/loader/Loader";
import { FormGroup, Label } from "reactstrap";
import { userId, userInfo } from "../../../assets/userLoginInfo";



export default function DocumentsDetails({
  setOpen,
  open,
  toggleTab,
  handleObjectInput,
  formData,
  setFormData,
  allLeadsData,
  handleInput,
  setAddressFile,
  AddressFile,
  checkbox2,
  setCheckbox2
}) {
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

  
  const [fileForDelete, setFileFordelete] = useState([]);

  const [idFile, setIdFile] = useState({});
  const [file1Err, setFile1Err] = useState(false);
  const [file2Err, setFile2Err] = useState(false);
  const [file3Err, setFile3Err] = useState(false);
  const [photoFile, setPhotoFile] = useState({});
  const [loader, setLoader] = useState(false);
  const paramsData = useParams();
  
  async function onSubmit(e) {
    e.preventDefault();
    setLoader(true);
    let delFile = [];
    const payload = {
      ...formData,
      id: paramsData.id,
      sameAsDocument: checkbox2,
      user_role:userInfo().role,
      user_name:userInfo().name,
      user_id:userId(),
    };


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
      await updateLeadsData({ ...payload, creator_id:userInfo()._id });
      setIdFile({});
      setAddressFile({});
      setPhotoFile({});
      setOpen(false);
      setLoader(false);
      setFormData({})
      toggleTab("1")
      await allLeadsData()
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
    setLoader(false);
  }
  function copyDetails(e) {
    setCheckbox2(e.target.checked);
    handleInput({name:"sameAsDocument",value:e.target.checked})
    if (e.target.checked) {
      let address = formData.identity_verify;
      setFormData((pre) => {
        return {
          ...pre,
          address_verify: {
            address_proof: address.id_proof,
            address_proof_no: address.id_proof_no,
            attachment: {
              file_name: "",
              file_url: "",
            },
          },
        };
      });
      setAddressFile(idFile);
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

  }

 
  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <form onSubmit={onSubmit}>
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
        />

        <div className="f-18 fw-500 mt-4">Identity Verification</div>
        <div className="row mt-1">
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label mb-1">Identity Verification</label>
            <SingleSelect
             
              options={idVerification}
              placeItem={"Identity Verification"}
              name="id_proof"
              value={formData?.identity_verify?.id_proof}
              onChange={(e) => handleObjectInput(e.target, "identity_verify")}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label mb-1">ID Proof No.</lable>
            <input
             
              className="form-control mt-1"
              placeholder="Enter ID proof No."
              name="id_proof_no"
              value={formData?.identity_verify?.id_proof_no}
              onChange={(e) => handleObjectInput(e.target, "identity_verify")}
            />
          </div>
        </div>
        <div className="row">
          {idFile?.name !== undefined || formData?.identity_verify?.attachment?.file_name !== "" ? (
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
            setFormData((pre) => ({
              ...pre,
              address_verify: {
                address_proof: "",
                address_proof_no: "",
                attachment: {
                  file_name: "",
                  file_url: "",
                },
              },
              sameAsDocument:false,
            }));
            setAddressFile({});
            setCheckbox2(false)
          }}
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
            />
            <Label className="labels ml-3 pt-1" check>
              Use ID Card as Address Verification
            </Label>
          </FormGroup>
        </div>
        <div className="f-18 fw-500 mt-4">Address Verification</div>
        <div className="row mt-1">
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label mb-1">Address Verification</label>
            <SingleSelect
           
              options={addressVerify}
              placeItem={"Identity Verification"}
              name="address_proof"
              value={formData?.address_verify?.address_proof}
              onChange={(e) =>{  setCheckbox2(false);handleObjectInput(e.target, "address_verify")}}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label mb-1">Address Proof No.</lable>
            <input
              
              className="form-control mt-1"
              placeholder="Enter ID proof No."
              name="address_proof_no"
              value={formData?.address_verify?.address_proof_no}
              onChange={(e) => {setCheckbox2(false);handleObjectInput(e.target, "address_verify")}}
            />
          </div>
        </div>
        <div className="row">
          {AddressFile?.name !== undefined || formData?.address_verify?.attachment?.file_name !== "" ? (
            <div className="col-md-6 mt-3  ">
              <label className={`${style.labels} mb-1`}>Attachment File</label>
              <div className="form-control w-100" style={{ overflow: "hidden" }}>
                {AddressFile?.name !== undefined ? AddressFile?.name : formData?.address_verify?.attachment?.file_name}
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
            // setCheckbox2(false);
          }}
        />
        {file2Err ? <div className="text-danger mt-1">Required</div> : ""}
        <div className="w-100 d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn text-primary mr-3"
            onClick={() => {
              toggleTab("3");
            }}
          >
            Back
          </button>

          <button type="submit" className="btn btn-primary">
            Create Lead
          </button>
        </div>
      </form>
    </>
  );
}
