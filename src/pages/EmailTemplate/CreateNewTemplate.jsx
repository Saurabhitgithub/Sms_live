import React, { useEffect, useRef, useState } from "react";
import { Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Editor } from "@tinymce/tinymce-react";
import { uploadDocument, createNewTemplate,updateTemplateData } from "../../service/admin";
import { IoShareOutline } from "react-icons/io5";
import Style from "./style.module.css";
import ReactQuill from "react-quill";
import Loader from "../../components/commonComponent/loader/Loader";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";

export default function CreateNewTemplate({ open, setOpen, getData , editData,
  mode, }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFileURL, setSelectedFileURL] = useState(null);
  const [fileError, setFileError] = useState("");
  const [preFile, setPreFiles] = useState();
  const [planvalue, setPlanValue] = useState("");
  const [inventoryValue, setInventoryValue] = useState("");
  const [serviceValue, setServiceValue] = useState("");
  const [loader, setLoader] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const dispatch = useDispatch();

  let id = editData?._id;
  

  useEffect(()=>{
if(editData){
  setInventoryValue(editData?.inventory);
  setServiceValue(editData?.service);
  setPlanValue(editData?.plan)
  setTemplateName(editData?.name)
  
}
  },[editData])
  const HandleSubmit = async e => {
    e.preventDefault();
    setLoader(true);
    try {
      let uploadResponse = editData.logo
      if (selectedFile) {
        let fileForm = new FormData();
        fileForm.append("upload", selectedFile);
         uploadResponse = await uploadDocument(fileForm);
        
  
      



      }
      let updatedFormData = {
        logo: {
          file_name: uploadResponse?.data?.data[0]?.file_name,
          file_url: uploadResponse?.data?.data[0]?.file_url
        },
        plan: planvalue,
        inventory: inventoryValue,
        service: serviceValue,
        name: templateName
      };
      

      if (mode === "edit") {
        updatedFormData.id = editData?._id;
        await updateTemplateData(updatedFormData)
        setOpen(false);
        dispatch(
          success({
            show: true,
            msg: "Update Template successfully",
            severity: "success"
          })
        );
      }else{
       await createNewTemplate(updatedFormData);
       setLoader(false);
       setInventoryValue("");
       setPlanValue("");
       setServiceValue("");
       setTemplateName("");
       setOpen(false);
       setSelectedFile(null)
       dispatch(
        success({
          show: true,
          msg: "Create Template successfully",
          severity: "success"
        })
      );
      }
      getData();

    } catch (error) {
      
    }
    setLoader(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileURL(URL.createObjectURL(file));
  };

  function toggle() {
    setOpen(!open);
  }
  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal centered scrollable isOpen={open} size="xl">
        <ModalHeader toggle={toggle}>
          <div className="f-24">{mode === "edit" ? "Edit" : "Create New"} Template</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={HandleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className={Style.LogoCustom}>
                  <input type="file" id="fileInput" hidden ref={fileInputRef} onChange={handleFileChange} />

                  {selectedFile ? (
                    <p className={`py-2 text-center ${Style.selectedColortext}`}>Selected file: {selectedFile.name}</p>
                  ) : (
                    <p className={`py-2 text-center ${Style.selectedColortext}`}>
                      Selected file: {editData?.logo?.file_name}
                    </p>
                  )}
                  <button className={Style.btn_color} type="button" onClick={handleButtonClick}>
                    {" "}
                    <IoShareOutline className="mb-1" /> Upload File
                  </button>
                  {fileError && <p className={Style.errorText}>{fileError}</p>}
                </div>
              </div>
              <div className="col-md-6">
                <Label>Template Name</Label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={templateName}
                  required
                  onChange={e => {
                    if (e.target.value === " ") {
                      e.target.value = "";
                    } else {
                      setTemplateName(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <Label>Plan</Label>
                <ReactQuill theme="snow" value={planvalue} onChange={setPlanValue} className="editor" />
              </div>
              <div className="col-md-12 mt-3">
                <Label>Inventory</Label>
                <ReactQuill theme="snow" value={inventoryValue} onChange={setInventoryValue} className="editor" />
              </div>
              <div className="col-md-12 mt-3">
                <Label>Services</Label>
                <ReactQuill theme="snow" value={serviceValue} onChange={setServiceValue} className="editor" />
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn border" type="button" onClick={() => toggle()}>
                Cancel
              </button>

              <button className="btn btn-primary ml-3" type="submit">
              {mode === "edit" ? "Edit" : "Create"} Template
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
