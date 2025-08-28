import React, { useEffect, useState } from "react";
import { FiPercent } from "react-icons/fi";
import { FormGroup, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { addInventoryCategory } from "../../service/admin";
import { userId, userInfo } from "../../assets/userLoginInfo";
import Loader from "../../components/commonComponent/loader/Loader";
import { useDispatch } from "react-redux";
import { error, success } from "../../Store/Slices/SnackbarSlice";

export default function InventoryManagementCreateAndUpdate({
  open,
  setOpen,
  editData,
  mode,
  getAllData,
  category_codeList
}) {
  let emptyData = {
    hsc_sac: "",
    category_name: "",
    category_description: "",
    need_length: false,
    cgst: "",
    scgst: "",
    service_tax: "",
    category_id: "",
    isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
    org_id: userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id
  };
  let id = editData._id;
  
  const [formData, setFormData] = useState(mode === "edit" ? editData : emptyData);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  // const handleInput = (event, key) => {
  //   const { name, value } = event;
  //   setFormData({ ...formData, [name]: value });
  // };
  const handleInput = (event, key) => {
    const { name, value, type, checked } = event.target;
    if (name === "category_code_id") {
      let info = category_codeList.find(re => re._id.toString() === value.toString());
      setFormData({
        ...formData,
        category_name: info.category_name,
        category_id: info.category_code,
        category_code_id: info._id
      });
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const AddCateggory = async e => {
    e.preventDefault();
    setLoader(true);

    try {
      let payload = { ...formData };
      if (mode === "edit") {
        payload.id = id;
      }
      let res = await addInventoryCategory(payload);
      
      setLoader(false);
      setOpen({ mode: "", status: false, data: {} });
      getAllData();
      if (mode === "edit") {
        dispatch(
          success({
            show: true,
            msg: "Updated Category successfully",
            severity: "success"
          })
        );
      } else {
        dispatch(
          success({
            show: true,
            msg: "Category Created successfully",
            severity: "success"
          })
        );
      }

      setFormData({});
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.errormessage);
      if (err?.response?.data?.errormessage?.includes("HSN")) {
        dispatch(
          error({
            show: true,
            msg: "HSN Code already exist",
            severity: "error"
          })
        );
      }
      if (err?.response?.data?.errormessage?.includes("This Category already exist")) {
        dispatch(
          error({
            show: true,
            msg: "This Category already exist",
            severity: "error"
          })
        );
      }
      if (err?.response?.data?.errormessage?.includes("This Category code already exist")) {
        dispatch(
          error({
            show: true,
            msg: "This Category Code already exist",
            severity: "error"
          })
        );
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setFormData(mode === "edit" ? editData : emptyData);
    
  }, [open]);
  function toggle() {
    setOpen(!open);
  }
  return (
    <div>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal centered scrollable isOpen={open} size="xl">
        <ModalHeader toggle={() => setOpen({ mode: "", status: false, data: {} })}>
          <div className="f-24">{mode === "edit" ? "Edit" : "Create"} Item Category</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={AddCateggory}>
            <div className="row">
              <div className="col-md-12">
                <label className="form-label">
                  Select Category Name <span className="text-danger">*</span>
                </label>

                <select
                  className={`form-control w-75  pl-0 text-capitalize pt-0 `}
                  name="category_code_id"
                  value={formData?.category_code_id}
                  onChange={event => {
                    if (event.target.value === " ") {
                      event.target.value = "";
                    } else {
                      handleInput(event);
                    }
                  }}
                >
                  {" "}
                  <option className={`text-capitalize`} selected disabled>
                    Select Category
                  </option>
                  {category_codeList?.map((res, index) => (
                    <option key={index} className={`text-capitalize`} value={res._id}>
                      {res.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="form-label">
                  Model Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Enter Category Name"
                  value={formData?.model_name}
                  name="model_name"
                  required
                  onChange={event => {
                    if (event.target.value === " ") {
                      event.target.value = "";
                    } else {
                      handleInput(event);
                    }
                  }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="form-label">Model Description</label>
                <textarea
                  className="form-control"
                  placeholder="Enter Category Descrption"
                  value={formData?.category_description}
                  name="category_description"
                  onChange={event => {
                    if (event.target.value === " ") {
                      event.target.value = "";
                    } else {
                      handleInput(event);
                    }
                  }}
                />
              </div>
            </div>
            <div className="check_box mt-3">
              <FormGroup check className="d-flex align-items-center">
                <input
                  class="form-check-input input"
                  type="checkbox"
                  id="checkbox123"
                  name="need_length"
                  checked={formData?.need_length}
                  onChange={handleInput}
                />
                <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                  Need Length
                </Label>
              </FormGroup>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">
                  HSN Code <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  required
                  className="form-control"
                  placeholder="Enter HSN Code"
                  name="hsc_sac"
                  value={formData?.hsc_sac}
                  onChange={handleInput}
                />
              </div>
              <div className="col-md-6 percent_Icon_Set_main">
                <label className="form-label">Service Tax (If Applicable)</label>
                <input
                  type="number"
                  placeholder="Enter Discount in percent"
                  className="form-control"
                  name="service_tax"
                  value={formData?.service_tax}
                  onChange={event => {
                    if (event.target.value === " ") {
                      event.target.value = "";
                    } else {
                      handleInput(event);
                    }
                  }}
                />
                <FiPercent className="percent_Icon_Set_child1" />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6 percent_Icon_Set_main">
                <label className="form-label">CGST (If Applicable)</label>
                <input
                  type="number"
                  placeholder="Enter CGST in percent"
                  className="form-control"
                  name="cgst"
                  value={formData?.cgst}
                  onChange={event => {
                    if (event.target.value === " ") {
                      event.target.value = "";
                    } else {
                      handleInput(event);
                    }
                  }}
                />
                <FiPercent className="percent_Icon_Set_child1" />
              </div>
              <div className="col-md-6 percent_Icon_Set_main">
                <label className="form-label">SGST (If Applicable)</label>
                <input
                  type="number"
                  placeholder="Enter SGST in percent"
                  className="form-control"
                  name="scgst"
                  value={formData?.scgst}
                  onChange={event => {
                    if (event.target.value === " ") {
                      event.target.value = "";
                    } else {
                      handleInput(event);
                    }
                  }}
                />
                <FiPercent className="percent_Icon_Set_child1" />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn text-primary mr-3"
                type="button"
                onClick={() => {
                  setOpen({ mode: "", status: false, data: {} });
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                {mode === "edit" ? "Update" : "Create "}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
