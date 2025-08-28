import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { bngAddAndUpdate } from "../../service/admin";
import { BsTrash } from "react-icons/bs";
import Loader from "../../components/commonComponent/loader/Loader";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";

export default function AddAndUpdateBng({ open, setOpen, mode, editData,getAllDataFunction }) {
  const [bngData, setBngData] = useState("");
  const [attributeInfo, setAttributeInfo] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  // Populate form fields when edit mode is enabled
  useEffect(() => {
    if (mode === "edit" && editData) {
      setBngData(editData.bng_name || "");
      setAttributes(editData.attributes || []);
    } else {
      setBngData("");
      setAttributes([]);
    }
  }, [editData, mode]);

  const addAttribute = () => {
    if (attributeInfo.trim()) {
      setAttributes([...attributes, attributeInfo]);
      setAttributeInfo("");
    }
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const addBngFunction = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      let payload = { bng_name: bngData, attributes };
      if (mode === "edit") {
        payload.id = editData._id;
      }
      let response = await bngAddAndUpdate(payload);
      setOpen({ mode: "", status: false, data: {} });
      dispatch(
        success({
          show: true,
          msg: `Bng ${mode === "edit" ? "Updated" : "Created"} Successfully`,
          severity: "success",
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
      setBngData("");
      setAttributeInfo("");
      getAllDataFunction()
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Modal centered scrollable isOpen={open} size="md">
        <ModalHeader toggle={() => {setOpen({ mode: "", status: false, data: {} }),setBngData(""),setAttributeInfo("")}}>
          <div className="f-24">{mode === "edit" ? "Edit" : "Create New"} Bng</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={addBngFunction}>
          <div className="row mt-3">
            <div className="col-md-12">
              <label>Bng</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter bng"
                required
                value={bngData}
                onChange={(e) => {
                  if (e.target.value === " "){
                    e.target.value = "";
                   
                  }else{
                    setBngData(e.target.value)
                  }
                }}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-8">
              <label>Attribute</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter attributes"
                value={attributeInfo}
                onChange={(e) => setAttributeInfo(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary" type="button" onClick={addAttribute}>
                Add Attribute
              </button>
            </div>
          </div>

          {attributes.length > 0 && (
            <Table hover className="mt-3">
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Attribute</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attributes.map((attr, index) => (
                  <tr key={index}>
                    <td>{attr}</td>
                    <td>
                      <div onClick={() => removeAttribute(index)}>
                        <BsTrash className="f-20 fw-500 pointer parimary-color" color="#0E1073" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-secondary m-2" type="button" onClick={() => {setOpen({ mode: "", status: false, data: {} }),setBngData(""),setAttributeInfo("")}}>
              Cancel
            </button>
            <button className="btn btn-primary m-2" type="submit">
              {mode === "edit" ? "Update" : "Save"}
            </button>
          </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
