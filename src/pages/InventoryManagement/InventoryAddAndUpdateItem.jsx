import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { City, Country, State } from "country-state-city";
import { addItemsOfCategoryInventory, getDataParticularCategory, getInventoryById } from "../../service/admin";
import { userId, userInfo } from "../../assets/userLoginInfo";
import Loader from "../../components/commonComponent/loader/Loader";
import { error, success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Content from "../../layout/content/Content";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from "react-router-dom/cjs/react-router-dom";

export default function InventoryAddAndUpdateItem() {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [prticularData, setParticularData] = useState({});
  const [editData, setEditData] = useState({});

  const getAllInvntoryDataById = async () => {
    setLoader(true)
    try {
      let res = await getInventoryById(eid);
      setEditData(res?.data?.data);
      setMacSerialInputs(res?.data?.data?.mac_serial)
    } catch (err) {
      console.log(err);
      
    }finally{
      setLoader(false)
    }
  };

  const history = useHistory();
  const { id, eid } = useParams();
  const mode = eid ? "edit" : "add";

  const handleInput = (event, key) => {
    const { name, value } = event;
    setFormData(prop => {
      return { ...prop, [name]: value };
    });
  };

  let ConditionData = [
    { value: "New", label: "New" },
    { value: "Used", label: "Used" },
    { value: "Refurbished", label: "Refurbished" }
  ];

  let Scaless = [
    { value: "Centi Meter", label: "Centi Meter" },
    { value: "inche", label: "Inche" },
    { value: "Feet", label: "Feet" },
    { value: "Meter", label: "Meter" },
    { value: "Yard", label: "Yard" }
  ];

  const [stateList, setStateList] = useState([]);
  const [BAState, setBAState] = useState("");
  const [IAState, setIAState] = useState("");

  const listState = () => {
    let states = State.getStatesOfCountry(india.isoCode);
    setStateList(states);
    return states;
  };

  let india = Country.getAllCountries().filter(e => e.name === "India")[0];
  const [BACity, setBACities] = useState([]);
  const [IACity, setIACities] = useState([]);

  const getParticularCategoryData = async () => {
    try {
      let res = await getDataParticularCategory(id);

      setParticularData(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  function getCities(stateObjString, key) {
    try {
      const stateObj = JSON.parse(stateObjString);
      let cities = City.getCitiesOfState(india.isoCode, stateObj.isoCode);
      setBACities(cities);

      // For edit mode, set the city if it exists
      if (mode === "edit" && editData.city) {
        setFormData(prev => ({
          ...prev,
          city: cities.find(c => c.name === editData.city)?.name || ""
        }));
      }
    } catch (error) {
      console.error("Error parsing state object:", error);
    }
  }

  let emptyData = {
    item_name: "",
    item_description: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    item_price: "",
    item_quantity: 0,
    mac: "",
    serial: "",
    item_id: "",
    purchase_date: "",
    condition: "",
    category_id: id,
    length: "",
    scale: "",
    isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
    org_id: userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id
  };

  const [formData, setFormData] = useState(mode === "edit" ? editData : emptyData);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const SubmitItems = async e => {
    e.preventDefault();
    setLoader(true);

    try {
      let payload = {
        ...formData,

        mac_serial: macSerialInputs
      };

      if (mode === "edit") {
        payload.id = eid;
      }

      let res = await addItemsOfCategoryInventory(payload);

      // Handle success response
      if (mode === "edit") {
        dispatch(
          success({
            show: true,
            msg: "Item Updated successfully",
            severity: "success"
          })
        );
      } else {
        dispatch(
          success({
            show: true,
            msg: "Item Created successfully",
            severity: "success"
          })
        );
      }

      // Redirect or refresh data as needed
      history.push(`/inventoryManagement/viewInventoryCategory/${id}`);
    } catch (err) {
      console.error(err);
      dispatch(
        error({
          show: true,
          msg: err.response?.data?.errormessage || "Failed to save item",
          severity: "error"
        })
      );
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (mode === "edit" && Object.keys(editData).length > 0) {
      // Initialize form data with editData
      const initializedData = {
        ...editData,
        // Ensure purchase_date is in correct format if it exists
        purchase_date: editData.purchase_date ? new Date(editData.purchase_date).toISOString().substring(0, 10) : ""
      };

      setFormData(initializedData);

      // Handle state/city initialization
      if (editData.state) {
        try {
          // Try to parse state if it's stored as JSON string
          const stateObj = typeof editData.state === "string" ? JSON.parse(editData.state) : editData.state;

          // Find matching state in stateList
          const matchingState = stateList.find(s => s.name === stateObj.name || s.name === editData.state);

          if (matchingState) {
            // Load cities for this state
            getCities(JSON.stringify(matchingState), "commercialAddress");

            // Update formData with just the state name
            setFormData(prev => ({
              ...prev,
              state: matchingState.name
            }));
          }
        } catch (e) {
          // If state is already just the name
          const matchingState = stateList.find(s => s.name === editData.state);
          if (matchingState) {
            getCities(JSON.stringify(matchingState), "commercialAddress");
          }
        }
      }

      // Initialize MAC/serial inputs if they exist
      if (editData.mac && editData.serial) {
        const macArray = editData.mac.split(",");
        const serialArray = editData.serial.split(",");
        const macSerialData = macArray.map((mac, index) => ({
          mac: mac.trim(),
          serial: serialArray[index]?.trim() || ""
        }));
        setMacSerialInputs(macSerialData);
      }
    }
  }, [editData, stateList]);

  useEffect(() => {
    listState();
    getParticularCategoryData();
  }, []);
  useEffect(() => {
    if (mode === "edit") {
      getAllInvntoryDataById();
    }
  }, [eid]);

  const [macSerialInputs, setMacSerialInputs] = useState([]);
  const [additionalQuantity, setAdditionalQuantity] = useState(0);
  console.log(macSerialInputs, "macSerialInputs");
  const handleAddQuantity = () => {
    // Initialize input fields based on current item_quantity value
    const quantity = parseInt(formData.item_quantity) || 1;
    if (quantity > macSerialInputs.length) {
      let gap = quantity - macSerialInputs.length;

      setMacSerialInputs([...macSerialInputs, ...Array(gap).fill({ mac: "", serial: "" })]);
    }
    if (quantity < macSerialInputs.length) {
      let gap = macSerialInputs.length - quantity;
      setMacSerialInputs(macSerialInputs.slice(0, macSerialInputs.length - gap));
    }
    setAdditionalQuantity(quantity);
    setAddModalOpen(true);
  };

  const handleMacSerialChange = (index, field, value) => {
    setMacSerialInputs(prev => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [field]: value
      };
      return newData;
    });
  };

  return (
    <Content>
      <div>
        {loader && <Loader />}
        <div className="card_container p-md-4 p-sm-3 p-3">
          <div toggle={() => setOpen({ mode: "", status: false, data: {} })}>
            <div className="f-24">{mode === "edit" ? "Edit" : "Create New"} Item</div>
          </div>
          <div>
            <form onSubmit={SubmitItems}>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    required
                    className="form-control"
                    placeholder="Enter Name"
                    name="item_name"
                    value={formData?.item_name}
                    onChange={e => {
                      if (e.target.value === " ") {
                        e.target.value = "";
                      }
                      handleInput(e.target);
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Item Code <span className="text-danger">*</span>
                  </label>
                  <input
                    required
                    className="form-control"
                    placeholder="Enter Item Code"
                    name="item_id"
                    value={formData?.item_id}
                    onChange={e => {
                      if (e.target.value === " ") {
                        e.target.value = "";
                      }
                      handleInput(e.target);
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label className="form-label">Item Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Item Descrption"
                    name="item_description"
                    value={formData?.item_description}
                    onChange={e => {
                      if (e.target.value === " ") {
                        e.target.value = "";
                      }
                      handleInput(e.target);
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    placeholder="Enter Address"
                    name="address"
                    value={formData?.address}
                    onChange={e => {
                      if (e.target.value === " ") {
                        e.target.value = "";
                      }
                      handleInput(e.target);
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <SingleSelect
                    placeItem={"State"}
                    name="state"
                    options={stateList?.map(e => {
                      return { label: e.name, value: e.name }; // Store just the name
                    })}
                    value={formData?.state}
                    onChange={e => {
                      const selectedStateName = e.target.value;
                      const selectedStateObj = stateList.find(s => s.name === selectedStateName);

                      if (selectedStateObj) {
                        getCities(JSON.stringify(selectedStateObj), "commercialAddress");
                      }

                      setFormData(prev => ({
                        ...prev,
                        state: selectedStateName // Store just the state name
                      }));
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <SingleSelect
                    name="city"
                    placeItem={"City"}
                    options={BACity?.map(e => {
                      return { label: e.name, value: e.name };
                    })}
                    value={formData?.city}
                    onChange={e => handleInput(e.target)}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label className="form-label">Pin Code</label>
                  <input
                    className="form-control"
                    placeholder="Enter Pin Code"
                    name="pincode"
                    type="number"
                    value={formData?.pincode}
                    onChange={e => {
                      if (e.target.value === " ") {
                        e.target.value = "";
                      }
                      handleInput(e.target);
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Item Quantity <span className="text-danger">*</span>
                  </label>
                  <input
                    required
                    className="form-control"
                    placeholder="Enter Quantity"
                    type="number"
                    name="item_quantity"
                    value={formData?.item_quantity}
                    onChange={e => {
                      if (e.target.value === " ") {
                        e.target.value = "";
                      }
                      handleInput(e.target);
                    }}
                  />
                </div>
                <div className="col-md-3" style={{ marginTop: "6px" }}>
                  <button className="btn btn-primary ml-3 mt-4" type="button" onClick={handleAddQuantity}>
                    Add Mac/Serial
                  </button>
                </div>
                <div className="col-md-5">
                  <label className="form-label">
                    Item Price <span className="text-danger">*</span>
                  </label>
                  <input
                    required
                    className="form-control"
                    placeholder="Enter Price"
                    type="number"
                    name="item_price"
                    value={formData?.item_price}
                    onChange={e => {
                      if (e.target.value === " ") {
                        e.target.value = "";
                      }

                      handleInput(e.target);
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label">Condition</label>
                  <SingleSelect
                    placeItem={"Condition"}
                    options={ConditionData}
                    name="condition"
                    value={formData?.condition}
                    onChange={e => handleInput(e.target)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Purchase Date</label>
                  <input
                    className="form-control"
                    type="date"
                    placeholder="Enter Purchase Date"
                    name="purchase_date"
                    defaultValue={formData?.purchase_date}
                    onChange={e => handleInput(e.target)}
                  />
                </div>
              </div>
              {prticularData?.need_length === true ? (
                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="form-label">Length</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Length"
                      name="length"
                      value={formData?.length}
                      onChange={e => handleInput(e.target)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Scale</label>
                    <SingleSelect
                      placeItem={"Scale"}
                      options={Scaless}
                      name="scale"
                      value={formData?.scale}
                      onChange={e => handleInput(e.target)}
                    />
                  </div>
                </div>
              ) : null}

              <div className="d-flex justify-content-end mt-4">
                <button
                  className="btn text-primary mr-3"
                  type="button"
                  onClick={() => history.push(`/inventoryManagement/viewInventoryCategory/${id}`)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  {mode === "edit" ? "Update" : "Save"}
                </button>
              </div>
            </form>

            <Modal isOpen={addModalOpen} toggle={() => setAddModalOpen(false)} size="xl">
              <ModalHeader toggle={() => setAddModalOpen(false)}>
                <h4>Enter MAC/Serial for {additionalQuantity} Items</h4>
              </ModalHeader>
              <ModalBody style={{ padding: "20px", maxHeight: "60vh", overflowY: "auto" }}>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th width="10%">#</th>
                        <th width="45%">MAC Address</th>
                        <th width="45%">Serial Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {macSerialInputs.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.mac || ""}
                              onChange={e => handleMacSerialChange(index, "mac", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.serial || ""}
                              onChange={e => handleMacSerialChange(index, "serial", e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const macs = macSerialInputs.map(item => item.mac.trim()).filter(Boolean);
                    const serials = macSerialInputs.map(item => item.serial.trim()).filter(Boolean);

                    setFormData(prev => ({
                      ...prev,
                      mac: macs.join(","),
                      serial: serials.join(",")
                    }));

                    setAddModalOpen(false);
                  }}
                >
                  Save
                </button>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      </div>
    </Content>
  );
}
