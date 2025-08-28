import React, { useEffect, useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Table } from "reactstrap";
import { getByIdBandwidth, addBandWidths, getAllBngData } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import { userId, userInfo } from "../../assets/userLoginInfo";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Select from "react-dropdown-select";

export default function EditBandwidth({ editModal, setEditModal, getAllBandWidthFunction, bandwidthId }) {
  const initialFormData = {
    name: "",
    max_download: {
      speed: "",
      unit: ""
    },
    max_upload: {
      speed: "",
      unit: ""
    },
    min_download: {
      speed: "",
      unit: ""
    },
    min_upload: {
      speed: "",
      unit: ""
    },
    burst: {
      rate: "",
      rate_unit: "",
      threshold: "",
      threshold_unit: "",
      time: ""
    },
    priority: "",
    isp_id: "664645a80522c3d5bc318cd2",
    router_type: "",
    bng_attribute_id: "",
    attributes: [],
    bng_name: ""
  };

  const [loader, setLoader] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationMessageUnit, setValidationMessageUnit] = useState("");
  const dispatch = useDispatch();

  const [getAllDataBng, setGetAllDataBng] = useState([]);
  const [selectedBng, setSelectedBng] = useState("");
  const [filteredAttributes, setFilteredAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [attributeDetails, setAttributeDetails] = useState([]);
  const getAllDataBngFunction = async () => {
    try {
      let response = await getAllBngData();
    
      
        setGetAllDataBng(response.data.data);
     
    } catch (err) {
      console.error("Error fetching BNG data:", err);
     
    }
  };

  const handleBngChange = (value) => {
    const selectedBngId = value;
   
    setSelectedBng(selectedBngId);

    const selectedBngObj = getAllDataBng.find(bng => bng._id === selectedBngId);
   
    if (selectedBngObj && selectedBngObj.attributes) {
      setFilteredAttributes(
        selectedBngObj.attributes.map(attr => ({
          value: attr,
          label: attr
        }))
      );
    } else {
      setFilteredAttributes([]);
    }

    setSelectedAttributes([]);
  };

  const handleAttributeChange = selectedOptions => {
   
    setSelectedAttributes(selectedOptions || []);
  };

  useEffect(() => {
    getAllDataBngFunction();
  }, []);

  // useEffect(() => {
  //   if (selectedAttributes.length > 0) {
  //     setAttributeDetails(
  //       selectedAttributes.map(attr => ({
  //         key: attr.value,
  //         opt: "",
  //         value: ""
  //       }))
  //     );
  //   } else {
  //     setAttributeDetails([]);
  //   }
  // }, [selectedAttributes]);

  // Handler for operator changes
  const handleOperatorChange = (index, value) => {
    setAttributeDetails(prev => {
      const updated = [...prev];
      updated[index].opt = value;
      return updated;
    });
  };

  // Handler for value changes
  const handleValueChange = (index, value) => {
    setAttributeDetails(prev => {
      const updated = [...prev];
      updated[index].value = value;
      return updated;
    });
  };

  const toggle = () => {
    setEditModal(!editModal);
    // setFormData(initialFormData);
  };

  const toggleShowMoreFive = () => {
    setShowMore(!showMore);
  };

  const handleChange = (e, key) => {
    const { name, value } = e.target;
    switch (key) {
      case "max_download":
        setFormData(prev => ({
          ...prev,
          max_download: { ...prev.max_download, [name]: value }
        }));
        break;
      case "max_upload":
        setFormData(prev => ({
          ...prev,
          max_upload: { ...prev.max_upload, [name]: value }
        }));
        break;
      case "min_download":
        setFormData(prev => ({
          ...prev,
          min_download: { ...prev.min_download, [name]: value }
        }));
        break;
      case "min_upload":
        setFormData(prev => ({
          ...prev,
          min_upload: { ...prev.min_upload, [name]: value }
        }));
        break;
      case "burst":
        setFormData(prev => ({
          ...prev,
          burst: { ...prev.burst, [name]: value }
        }));
        break;
      default:
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    }
  };

  const convertToKbps = (value, unit) => {
    const units = {
      kbps: 1,
      mbps: 1000,
      gbps: 1000000
    };
    return value * units[unit];
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoader(true);

    // Convert speeds to Kbps for comparison
    const maxDownloadKbps = convertToKbps(formData.max_download.speed, formData.max_download.unit);
    const minDownloadKbps = convertToKbps(formData.min_download.speed, formData.min_download.unit);
    const maxUploadKbps = convertToKbps(formData.max_upload.speed, formData.max_upload.unit);
    const minUploadKbps = convertToKbps(formData.min_upload.speed, formData.min_upload.unit);

    if (maxDownloadKbps > minDownloadKbps && maxUploadKbps > minUploadKbps) {
      setValidationMessage(""); // Clear any previous validation message
      setValidationMessageUnit("");
      let payloadData = {
        ...formData,
        bandwidthId,
        user_role: userInfo()?.role,
        user_id: userId(),
        user_name: userInfo()?.name,
        bng_attribute_id: selectedBng,
        bng_name: getAllDataBng.find(bng => bng._id === selectedBng)?.bng_name || "",
        attributes: attributeDetails
      };

      // Ensure isp_id is present in the payload
      if (!payloadData.isp_id) {
        payloadData.isp_id = initialFormData.isp_id;
      }
      if (!payloadData.id) {
        payloadData.id = bandwidthId;
      }

      try {
        const res = await addBandWidths(payloadData);

        setLoader(false);
        toggle();
        getAllBandWidthFunction();
        dispatch(
          success({
            show: true,
            msg: "Bandwidth Updated successfully",
            severity: "success"
          })
        );
      } catch (err) {
        console.log(err);
        setLoader(false);
      }
    } else {
      setValidationMessage("");
      setValidationMessageUnit("");
      if (maxDownloadKbps <= minDownloadKbps && maxUploadKbps <= minUploadKbps) {
        setValidationMessage("Min download speed needs to be below Max.");
        setValidationMessageUnit("Min upload speed needs to be below Max.");
      } else if (maxUploadKbps <= minUploadKbps) {
        setValidationMessageUnit("Min upload speed needs to be below Max.");
      } else if (maxDownloadKbps <= minDownloadKbps) {
        setValidationMessage("Min download speed needs to be below Max.");
      }
      setLoader(false);
    }
  };

  // const getdataByIdFunction = async () => {
  //   setLoader(true);
  //   await getByIdBandwidth(bandwidthId)
  //     .then((res) => {
  //       setLoader(false);
  //       setFormData(res.data.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoader(false);
  //     });
  // };

  const getdataByIdFunction = async () => {
    setLoader(true);
    try {
      const res = await getByIdBandwidth(bandwidthId);
      const data = res.data.data;

     

      setFormData(data); // Set all form data

      // Set selected BNG
      setSelectedBng(data.assignBng_id || "");

      // Find the selected BNG object from getAllDataBng
      const selectedBngObj = getAllDataBng.find(bng => bng._id === data.assignBng_id);
      handleBngChange(data.assignattributesData.bng_attribute_id)



      // Set selected attributes based on API response
      if (data.assignattributesData?.attributes) {
      
        setSelectedAttributes(
          data.assignattributesData.attributes.map(attr => ({
            value: attr.key,
            label: attr.key
          }))
          
        );

        // Set attribute details for table
        setAttributeDetails(
          data.assignattributesData.attributes
        );
      } else {
        setSelectedAttributes([]);
        setAttributeDetails([]);
      }

      setLoader(false);
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (getAllDataBng.length > 0) {
      getdataByIdFunction();
    }
  }, [bandwidthId, getAllDataBng]);

  // useEffect(() => {
  //   getdataByIdFunction();
  // }, [bandwidthId]);

  return (
    <div>
      {loader && <Loader />}
      <Modal isOpen={editModal} size="xl">
        <ModalHeader toggle={toggle} className="d flex align-items-center justify-content-between pop_up">
          <span className={`head_min  bandWidthHeader`}>Edit Bandwidth Template</span>
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <Form onSubmit={handleSubmit} className="w-100">
              <div className=" mt-3 BandwidthHeading">Bandwidth Details</div>
              {/* <hr /> */}
              <div className="row">
                <div className="col-12">
                  <FormGroup>
                    <Label for="templateName" className="labels mt-2 ">
                      Template Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter Template Name"
                      name="name"
                      id="name"
                      value={formData?.name}
                      onChange={e => {
                        if (e.target.value === " ") {
                          e.target.value = "";
                        } else {
                          handleChange(e);
                        }
                      }}
                      required
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="planName" className="labels mt-2">
                      Max Download Bandwidth
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter value"
                      name="speed"
                      id="speed"
                      value={formData?.max_download?.speed}
                      onChange={e => handleChange(e, "max_download")}
                      required
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="status" className="labels mt-2">
                      Speed
                    </Label>
                    <Input
                      type="select"
                      name="unit"
                      id="unit"
                      value={formData?.max_download?.unit}
                      onChange={e => handleChange(e, "max_download")}
                      required
                    >
                      <option value="" disabled selected>
                        Please Select Speed
                      </option>
                      <option value="kbps">Kbps</option>
                      <option value="mbps">Mbps</option>
                      <option value="gbps">Gbps</option>
                    </Input>
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="planName" className="labels mt-2 ">
                      Min Download Bandwidth
                    </Label>
                    <Input
                      placeholder="Enter value"
                      type="number"
                      name="speed"
                      id="speed"
                      value={formData?.min_download?.speed}
                      onChange={e => handleChange(e, "min_download")}
                      required
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="status" className="labels mt-2 ">
                      Speed
                    </Label>
                    <Input
                      type="select"
                      name="unit"
                      id="unit"
                      value={formData?.min_download?.unit}
                      onChange={e => handleChange(e, "min_download")}
                      required
                    >
                      <option value="" disabled selected>
                        Please Select Speed
                      </option>
                      <option value="kbps">Kbps</option>
                      <option value="mbps">Mbps</option>
                      <option value="gbps">Gbps</option>
                    </Input>
                  </FormGroup>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* {validationMessageUnit && <div className="alert alert-danger mt-2 ">{validationMessageUnit}</div>} */}
                </div>
                <div className="col-md-6">
                  {validationMessage && <div className="alert alert-danger mt-2 ">{validationMessage}</div>}
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="customerName" className="labels mt-2">
                      Max Upload Bandwidth
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter value"
                      name="speed"
                      id="speed"
                      value={formData?.max_upload?.speed}
                      onChange={e => handleChange(e, "max_upload")}
                      required
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="status" className="labels mt-2">
                      Speed
                    </Label>
                    <Input
                      type="select"
                      name="unit"
                      id="unit"
                      value={formData?.max_upload?.unit}
                      onChange={e => handleChange(e, "max_upload")}
                      required
                    >
                      <option value="" disabled selected>
                        Please Select Speed
                      </option>
                      <option value="kbps">Kbps</option>
                      <option value="mbps">Mbps</option>
                      <option value="gbps">Gbps</option>
                    </Input>
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="customerName" className="labels mt-2 ">
                      Min Upload Bandwidth
                    </Label>
                    <Input
                      placeholder="Enter value"
                      type="number"
                      name="speed"
                      id="speed"
                      value={formData?.min_upload?.speed}
                      onChange={e => handleChange(e, "min_upload")}
                      required
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="status" className="labels mt-2 ">
                      Speed
                    </Label>
                    <Input
                      type="select"
                      name="unit"
                      id="unit"
                      value={formData?.min_upload?.unit}
                      onChange={e => handleChange(e, "min_upload")}
                      required
                    >
                      <option value="" disabled selected>
                        Please Select Speed
                      </option>
                      <option value="kbps">Kbps</option>
                      <option value="mbps">Mbps</option>
                      <option value="gbps">Gbps</option>
                    </Input>
                  </FormGroup>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12 col-md-6 col-lg-6 mb-2">
                  <FormGroup>
                    <Label for="bng" className="labels mt-2">
                      Select Bng
                    </Label>
                    <Input
                      type="select"
                      name="bng"
                      id="bng"
                      value={selectedBng} // Set default selected BNG
                      onChange={(e)=>handleBngChange(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Please Select Bng
                      </option>
                      {getAllDataBng.map(res => (
                        <option key={res._id} value={res._id}>
                          {res.bng_name || "Unnamed BNG"}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </div>

                <div className="col-12 col-md-6 col-lg-6 mb-2">
                  <FormGroup>
                    <Label for="attribute" className="labels mt-2">
                      Select Attribute
                    </Label>
                    <Select
                    key={selectedAttributes} // Key is unnecessary unless forcing re-render
                    name="attribute"
                    id="attribute"
                    options={filteredAttributes || []}
                    onChange={handleAttributeChange}
                    value={filteredAttributes?.filter(attr => 
                      selectedAttributes?.includes(attr.value)
                    )} 
                      multi
                    />
                  </FormGroup>
                </div>
              </div>

              {selectedAttributes.length > 0 && (
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="table-responsive">
                      <Table>
                        <thead style={{ backgroundColor: "#F5F6FA" }}>
                          <tr>
                            <th>BNG</th>
                            <th>Attributes</th>
                            <th>Operator</th>
                            <th>Values</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAttributes.map((attr, index) => (
                            <tr key={index}>
                              <td>{getAllDataBng.find(bng => bng._id === selectedBng)?.bng_name || "N/A"}</td>
                              <td>{attr.label}</td>
                              <td>
                          
                                <select
                                  className="form-control"
                                  value={attributeDetails[index]?.opt || ""}
                                  onChange={e => handleOperatorChange(index, e.target.value)}
                                  required
                                >
                                  <option value="" disabled>
                                    Select an operator
                                  </option>
                                  <option value="=">=</option>
                                  <option value="==">==</option>
                                  <option value=":=">:=</option>
                                  <option value="!=">!=</option>
                                  <option value="+=">+=</option>
                                  <option value=">">{">"}</option>
                                  <option value=">=">{">="}</option>
                                  <option value="<">{"<"}</option>
                                  <option value="<=">{"<="}</option>
                                  <option value="~">~</option>
                                  <option value="=~">=~</option>
                                  <option value="!~">!~</option>
                                  <option value="|*">|*</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={attributeDetails[index]?.value || ""}
                                  onChange={e => handleValueChange(index, e.target.value)}
                                  required
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-md-6">
                  {/* {validationMessage && <div className="alert alert-danger mt-2 ">{validationMessage}</div>} */}
                </div>
                <div className="col-md-6">
                  {validationMessageUnit && <div className="alert alert-danger mt-2 ">{validationMessageUnit}</div>}
                </div>
              </div>

              <div className="col-md-12 mt-5 flex justify-content-between" onClick={toggleShowMoreFive}>
                <div className="labelsHeading BandwidthToggleText">Advanced Options</div>
                <div className="labelsHeading BandwidthToggleTextRightSide" style={{ cursor: "pointer" }}>
                  {showMore ? "Show less " : "Show more"}
                  {showMore ? (
                    <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                  ) : (
                    <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                  )}
                </div>
              </div>

              {/* <hr /> */}

              {showMore ? (
                <>
                  <div className="row">
                    <div className=" col-12 col-md-12 col-lg-6 mb-2">
                      <FormGroup>
                        <Label for="status" className="labels mt-2 ">
                          Router Type
                        </Label>
                        <Input
                          type="select"
                          name="router_type"
                          id="router_type"
                          value={formData?.router_type}
                          onChange={handleChange}
                        >
                          <option value="" disabled selected>
                            Please Select Router Type
                          </option>
                          <option value="micrtik">Microtik</option>
                          <option value="cisco">Cisco</option>
                          <option value="tplink">TP-Link</option>
                          <option value="netgear">Netgear</option>
                          <option value="dlink">D-Link</option>
                        </Input>
                      </FormGroup>
                    </div>
                  </div>

                  <div className=" BandwidthHeading">Burst Limit</div>

                  <div className="row mt-4">
                    <div className="col-12 col-md-12 col-lg-6 mb-2">
                      <FormGroup>
                        <Label for="planName" className="labels mt-2 ">
                          Burst Rate
                        </Label>
                        <Input
                          type="number"
                          placeholder="Enter Burst Rate"
                          name="rate"
                          id="rate"
                          value={formData?.burst?.rate}
                          onChange={e => handleChange(e, "burst")}
                        />
                      </FormGroup>
                    </div>

                    <div className="col-12 col-md-6 mb-2">
                      <FormGroup>
                        <Label for="status" className="labels mt-2 ">
                          Speed
                        </Label>
                        <Input
                          type="select"
                          name="rate_unit"
                          id="rate_unit"
                          value={formData?.burst?.rate_unit}
                          onChange={e => handleChange(e, "burst")}
                        >
                          <option value="" disabled selected>
                            Please Select Speed
                          </option>
                          <option value="kbps">Kbps</option>
                          <option value="mbps">Mbps</option>
                          <option value="gbps">Gbps</option>
                        </Input>
                      </FormGroup>
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <FormGroup>
                        <Label for="planName" className="labels mt-2 ">
                          Burst Threshold
                        </Label>
                        <Input
                          type="number"
                          placeholder="Enter Burst Threshold"
                          name="threshold"
                          id="threshold"
                          value={formData?.burst?.threshold}
                          onChange={e => handleChange(e, "burst")}
                        />
                      </FormGroup>
                    </div>

                    <div className="col-12 col-md-6 mb-2">
                      <FormGroup>
                        <Label for="status" className="labels mt-2 ">
                          Speed
                        </Label>
                        <Input
                          type="select"
                          name="threshold_unit"
                          id="threshold_unit"
                          value={formData?.burst?.threshold_unit}
                          onChange={e => handleChange(e, "burst")}
                        >
                          <option value="" disabled selected>
                            Please Select Speed
                          </option>
                          <option value="kbps">Kbps</option>
                          <option value="mbps">Mbps</option>
                          <option value="gbps">Gbps</option>
                        </Input>
                      </FormGroup>
                    </div>

                    <div className="col-12 ">
                      <FormGroup>
                        <Label for="planName" className="labels mt-2 ">
                          Burst Time
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Burst Time"
                          name="time"
                          id="time"
                          value={formData?.burst?.time}
                          onChange={e => handleChange(e, "burst")}
                        />
                      </FormGroup>
                    </div>
                  </div>

                  <div className=" BandwidthHeading">Priority</div>

                  <div className="row">
                    <div className="col-12">
                      <FormGroup>
                        <Label for="templateName" className="labels mt-2 ">
                          Priority takes value 1 to 8 where 1 implies the highest priority, but 8 being the lowest
                        </Label>
                        <Input
                          type="select"
                          name="priority"
                          id="priority"
                          value={formData.priority}
                          onChange={handleChange}
                        >
                          <option value="" disabled selected>
                            Please Select Priority
                          </option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                        </Input>
                      </FormGroup>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}

              <ModalFooter className="mt-4">
                <Button color="btn " onClick={toggle}>
                  Cancel
                </Button>
                <Button color=" btn btn-primary" type="submit">
                  Save
                </Button>
              </ModalFooter>
            </Form>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
