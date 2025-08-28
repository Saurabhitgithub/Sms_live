import React, { useState, useEffect } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FormGroup, Input, Label } from "reactstrap";
import style from "./SubscriberManagement.module.css";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { TbCapture } from "react-icons/tb";
import { TbUpload } from "react-icons/tb";
import { City, Country, State } from "country-state-city";



const UserInfoOther = ({
  mode,
  setOpen,
  handleChangeInput,
  formData,
  setFormData,
  handleSubmit,
  errors,
  toggleTab,
  setAddressFile,
  setIdFile,
  idFile,
  addressFile,
  setFile1Err,
  setFile2Err,
  removeErr1,
  removeErr2,
  setFileFordelete,
  setbStateErr,
  setiStateErr,
  nextButton
}) => {
  let india = Country.getAllCountries().filter((e) => e.name === "India")[0];
  const [showMoreOne, setShowMoreOne] = useState(false);
  const [showMoreTwo, setShowMoreTwo] = useState(false);
  const [showMoreThree, setShowMoreThree] = useState(false);
  const [showMoreFour, setShowMoreFour] = useState(false);
  const [BAState, setBAState] = useState('');
  const [IAState, setIAState] = useState('');
  const [BACity, setBACities] = useState([]);
  const [IACity, setIACities] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [checkbox1, setCheckbox1] = useState(false)
  const [checkbox2, setCheckbox2] = useState(false)

  const toggleShowMoreOne = () => {
    setShowMoreOne(!showMoreOne);
  };
  const toggleShowMoreTwo = () => {
    setShowMoreTwo(!showMoreTwo);
  };
  const toggleShowMoreThree = () => {
    setShowMoreThree(!showMoreThree);
  };
  const toggleShowMoreFour = () => {
    setShowMoreFour(!showMoreFour);
  };
  const idVerification = [
    { value: "Aadhar Card", label: "Aadhar card" },
    { value: "PAN Card", label: "PAN Card" },
    { value: "Driving License", label: "Driving License" },
    { value: "Voter Card", label: "Voter Card" },
    { value: "Passport", label: "Passport" }

  ];
  const addressVerify = [
    { value: "Aadhar Card", label: "Aadhar card" },
    { value: "PAN Card", label: "PAN Card" },
    { value: "Driving License", label: "Driving License" },
    { value: "Voter Card", label: "Voter Card" },
    { value: "Passport", label: "Passport" }
  ]



  const listState = () => {
    let states = State.getStatesOfCountry(india.isoCode);
    setStateList(states);
  };

  function getCities(state, key) {
    const obj = JSON.parse(state)
    setCheckbox1(false)
    let cities = City.getCitiesOfState(india.isoCode, obj.isoCode);
    if (key === "billing_address") {
      setBAState(state)
      let newObj3 = { ...formData.billing_address, state: obj?.name,city:'' }
      setFormData(pre => {
        return {
          ...pre,
          billing_address: newObj3
        }
      })
      setBACities(cities);
      setbStateErr(false)
    } else {
      setIAState(state)
      let newObj4 = { ...formData.installation_address, state: obj?.name,city:'' }
      setFormData(pre => {
        return {
          ...pre,
          installation_address: newObj4
        }
      })
      setIACities(cities);
      setiStateErr(false)
    }
  }


  useEffect(() => {
    listState();
  }, []);


  function copyAddress1(e) {
    setCheckbox1(e.target.checked)
    if (e.target.checked) {
      setIACities(BACity)
      setIAState(BAState)
      let address = formData.billing_address
      setFormData(pre => {
        return {
          ...pre,
          installation_address: address
        }
      })

    } else {
      setIACities([])
      setIAState('')
      setFormData(pre => {
        return {
          ...pre,
          installation_address: {
            "address_line1": "",
            "address_line2": "",
            "state": "",
            "city": "",
            "pin_code": '',
            "flat_number": ""
          }
        }
      })
    }
    removeErr1()
  }

  function copyDetails(e) {
    setCheckbox2(e.target.checked)
    if (e.target.checked) {
      let address = formData.identity_verify
      setFormData(pre => {
        return {
          ...pre,
          address_verify: {
            address_proof: address.id_proof,
            address_proof_no: address.id_proof_no,
            attachment: {
              file_name: "",
              file_url: ""
            }
          }
        }
      })
      setAddressFile(idFile)
      if (mode == 'edit') {
        setFileFordelete(pre => {
          return [...pre, formData?.address_verify?.attachment?.file_name]
        })
        setFormData(pre => {
          return {
            ...pre,
            address_verify: {
              address_proof: address.id_proof,
              address_proof_no: address.id_proof_no,
              attachment: {
                file_name: address?.attachment?.file_name,
                file_url: address?.attachment?.file_url
              }
            }
          }
        })
      }
    } else {
      setAddressFile({})
      setFormData(pre => {
        return {
          ...pre,
          address_verify: {
            "address_proof": "",
            "address_proof_no": "",
            "attachment": {
              "file_name": "",
              "file_url": ""
            }
          }
        }
      })
    }

    removeErr2()


  }


  useEffect(() => {
    if (mode == 'edit') {
      let ss = State.getStatesOfCountry(india.isoCode)
      let state1 = ss?.find(res => res.name == formData?.billing_address?.state)
      let state2 = ss?.find(res => res.name == formData?.installation_address?.state)
      if (state1 !== undefined) {
        setBAState(JSON.stringify(state1))
        getCities(JSON.stringify(state1, 'billing_address'))
      }
      if (state2 !== undefined) {
        setIAState(JSON.stringify(state2))
        getCities(JSON.stringify(state2, 'installation_address'))
      }

      let cc1 = City?.getCitiesOfState(india?.isoCode, state1?.isoCode)
      let cc2 = City?.getCitiesOfState(india?.isoCode, state1?.isoCode)
      setBACities(cc1)
      setIACities(cc2)

    }

  }, [mode, stateList])


  return (
    <>
      <form onSubmit={handleSubmit} className="">
      {/* <form onSubmit={(e)=>nextButton(e,"3")}> */}
        {/* Personal Details  */}
        <div className="col-md-12 mt-5 p-0 flex justify-content-between " onClick={toggleShowMoreOne}>
          <div className="labelsHeading">Personal Details</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreOne ? "show less" : "show more"}
            {showMoreOne ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div className={style.horizontal}>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreOne && (
          <>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Full Name</label><span className="text-danger">*</span>
                <div>
                  <Input
                    placeholder="Enter Full Name"
                    name="full_name"
                    value={formData?.full_name}
                    className={` ${errors.full_name ? "border border-danger" : ""}`}
                    onChange={handleChangeInput}

                  />
                  {errors.full_name && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Email</label><span className="text-danger">*</span>
                <div>
                  <Input placeholder="Enter Your Email ID"
                    name="email"
                    className={` ${errors.email !== '' ? "border border-danger" : ""}`}
                    type="email"
                    value={formData?.email}
                    onChange={handleChangeInput}

                  />
                  {errors.email !== '' ? (
                    <>
                      <p className="text-danger">{errors.email}</p>
                    </>
                  ) : ''}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>Mobile Number</label><span className="text-danger">*</span>
                <div>
                  <Input placeholder="Enter Your Mobile Number"
                    name="mobile_number"
                    type="number"
                    className={` mt-1 ${errors.mobile_number !== '' ? "border border-danger" : ""}`}
                    value={formData?.mobile_number}
                    onChange={handleChangeInput}
                    onInput={(e) =>
                      (e.target.value = e.target.value.slice(0, 10))
                    }

                  />
                  {errors.mobile_number !== '' ? (
                    <>
                      <p className="text-danger">{errors.mobile_number}</p>
                    </>
                  ) : ''}
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>Alternate Mobile Number</label>
                <div>
                  <Input
                    placeholder="Enter Your Aternate Mobile NUmber"
                    name="alter_mobile_number"
                    type="number"
                    className={` mt-1 `}

                    value={formData?.alter_mobile_number}
                    onChange={handleChangeInput}
                    onInput={(e) =>
                      (e.target.value = e.target.value.slice(0, 10))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>GST No.</label>
                <div>
                  <Input
                    placeholder="Enter GST Number"
                    name="gst_no"
                    className={` `}

                    value={formData?.gst_no}
                    onChange={handleChangeInput}
                  />

                </div>
              </div>
            </div>
          </>
        )}
        {/* Billing address  */}
        <div className="col-md-12 mt-5 p-0 flex justify-content-between " onClick={toggleShowMoreTwo}>
          <div className="labelsHeading">Billing Address</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreTwo ? "show less" : "show more"}
            {showMoreTwo ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div className={style.horizontal}>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreTwo && (
          <>
            <div className="row ">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>House Flat No.</label><span className="text-danger">*</span>
                <div>
                  <Input placeholder="Enter House No." name="flat_number"
                    className={` mt-1 ${errors.bFlatNo ? "border border-danger" : ""}`}

                    value={formData?.billing_address?.flat_number}
                    onChange={(e) => handleChangeInput(e, 'billing_address')}

                  />
                  {errors.bFlatNo && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>State</label><span className="text-danger">*</span>
                <div>
                  <SingleSelect
                    className={` mt-1 ${errors.bState ? "border border-danger" : ""}`}

                    placeItem={"State"}
                    options={stateList?.map((e) => {
                      return { label: e.name, value: JSON.stringify(e) };
                    })}
                    name="state"
                    value={BAState}
                    placeholder={"Select State"}
                    onChange={(e) => getCities(e.target.value, 'billing_address')}
                  />
                  {errors.bState && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>City</label><span className="text-danger">*</span>
                <div>
                  <SingleSelect
                    placeItem={"city"}
                    options={BACity?.map((e) => {
                      return { label: e.name, value: e.name };
                    })}
                    value={formData?.billing_address?.city}
                    name="city"
                    className={` mt-1 ${errors.bCity ? "border border-danger" : ""}`}

                    placeholder={"Select city"}
                    onChange={(e) => handleChangeInput(e, 'billing_address')}

                  />
                  {errors.bCity && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>Pin Code</label><span className="text-danger">*</span>
                <div>
                  <Input
                    placeholder="Enter Pin Code"
                    className={` mt-1 ${errors.bCode ? "border border-danger" : ""}`}
                    type="number"
                    name="pin_code"
                    value={formData?.billing_address?.pin_code}
                    onChange={(e) => handleChangeInput(e, 'billing_address')}

                  />
                  {errors.bCode && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* installation Address  */}
        <div className="col-md-12 mt-5 p-0 flex justify-content-between " onClick={toggleShowMoreThree}>
          <div className="labelsHeading">Installation Address</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreThree ? "show less" : "show more"}
            {showMoreThree ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div className={style.horizontal}>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreThree && (
          <>
            <div className="check_box mt-4 d-flex align-items-center">
              <FormGroup check className="flex align-items-center">
                <input
                  class="form-check-input input"
                  type="checkbox"
                  value=""
                  id="checkbox123"
                  checked={checkbox1}
                  onChange={copyAddress1}
                />
                <Label className="labels ml-3 pt-1" for="checkbox123" check>
                  Use Billing address as installation address
                </Label>
              </FormGroup>
            </div>

            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>House Flat No.</label><span className="text-danger">*</span>
                <div>
                  <Input
                    placeholder="Enter House No."
                    name="flat_number"
                    className={`${errors.iFlatNo ? "border border-danger" : ""}`}
                    value={formData?.installation_address?.flat_number}
                    onChange={(e) => {
                      setCheckbox1(false)
                      handleChangeInput(e, 'installation_address')
                    }}
                  />
                  {errors.iFlatNo && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>State</label><span className="text-danger">*</span>
                <div>
                  <SingleSelect
                    className={`${errors.iState ? "border border-danger" : ""}`}
                    placeItem={"State"}
                    options={stateList?.map((e) => {
                      return { label: e.name, value: JSON.stringify(e) };
                    })}
                    name="state"
                    value={IAState}
                    placeholder={"Select State"}
                    onChange={(e) => getCities(e.target.value, 'installation_address')}
                  />
                  {errors.iState && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>City</label><span className="text-danger">*</span>
                <div>
                  <SingleSelect
                    placeItem={"city"}
                    options={IACity?.map((e) => {
                      return { label: e.name, value: e.name };
                    })}
                    name="city"
                    value={formData?.installation_address?.city}
                    className={`${errors.iCity ? "border border-danger" : ""}`}

                    placeholder={"Select city"}
                    onChange={(e) => {
                      setCheckbox1(false)
                      handleChangeInput(e, 'installation_address')
                    }}
                  />
                  {errors.iCity && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>Pin Code</label><span className="text-danger">*</span>
                <div>
                  <Input type="number" placeholder="Enter Pin Code" name="pin_code"
                    className={`${errors.iCode ? "border border-danger" : ""}`}

                    value={formData?.installation_address?.pin_code}
                    onChange={(e) => {
                      setCheckbox1(false)
                      handleChangeInput(e, 'installation_address')
                    }}

                  />
                  {errors.iCode && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Document Details  */}
        <div className="col-md-12 mt-5 p-0 flex justify-content-between " onClick={toggleShowMoreFour}>
          <div className="labelsHeading">Document Details</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreFour ? "show less" : "show more"}
            {showMoreFour ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div className={style.horizontal}>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreFour && (
          <>
            <div className="light_heading mt-4">Identity Verification</div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Identity Verification</label><span className="text-danger">*</span>
                <div>
                  <SingleSelect name="id_proof" options={idVerification}
                    className={`${errors.idType ? "border border-danger" : ""}`}
                    value={formData?.identity_verify?.id_proof}
                    placeItem={"Identity Verification"}
                    onChange={(e) => handleChangeInput(e, 'identity_verify')}

                  />
                  {errors.idType && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>ID Proof No.</label><span className="text-danger">*</span>
                <div>
                  <Input placeholder="ID Proof No." name="id_proof_no"
                    className={`${errors.idNo ? "border border-danger" : ""}`}

                    value={formData?.identity_verify?.id_proof_no}
                    onChange={(e) => handleChangeInput(e, 'identity_verify')}

                  />
                  {errors.idNo && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              {idFile?.name !== undefined || formData?.identity_verify?.attachment?.file_name !== '' ?
                <div className="col-md-6 mt-3">
                  <label className={`${style.labels} mb-2`}>Attachment File</label>
                  <div className="form-control w-100" style={{ overflow: 'hidden' }}>
                    {idFile?.name !== undefined ? idFile?.name : formData?.identity_verify?.attachment?.file_name}
                  </div>
                </div> : ''}
            </div>
            <div className="row mt-4">

              <div className="col-lg-4 col-md-6 d-md-block d-sm-none d-none">
                <input type="file" id="file" hidden accept="image/jpeg,image/png,application/pdf,image/x-eps" onChange={(e) => {
                  setIdFile(e.target.files[0])
                  setFile1Err(false)
                }} />

                <label className={`${style.boxBackground} flex center ${errors.file1 ? 'border border-danger' : ''}`} style={{ cursor: "pointer" }} htmlFor="file">
                  <TbUpload style={{ fontSize: "20px" }} />
                  <span className={`${style.labels} ml-2`} style={{ color: "#0E1073" }}>
                    Upload Document
                  </span>
                </label>
              </div>
              <div className="col-md-4 col-sm-6 col-6 d-md-none d-sm-block d-block">
                <label className={`${style.boxBackground} flex center ${errors.file1 ? 'border border-danger' : ''}`} style={{ cursor: "pointer" }} htmlFor="file">
                  <TbUpload style={{ fontSize: "20px" }} />
                  <span className={`${style.labels} ml-2`} style={{ color: "#0E1073" }}>
                    Upload
                  </span>
                </label>
              </div>
              <div className="col-md-4 col-sm-6 col-6 d-md-none d-sm-block d-block">
                <input type="file" id="file23" hidden accept="image/*" capture="camera" onChange={(e) => {
                  setIdFile(e.target.files[0])
                  setFile1Err(false)
                }} />

                <label className={`${style.boxBackground} flex center ${errors.file1 ? 'border border-danger' : ''}`} style={{ cursor: "pointer" }} htmlFor="file23">
                  <TbCapture style={{ fontSize: "20px" }} />
                  <span className={`${style.labels} ml-2`} style={{ color: "#0E1073" }}>
                    capture
                  </span>
                </label>
              </div>
              {errors.file1 ? <div className="text-danger mt-1">Required</div> : ''}
            </div>
            <div className="light_heading mt-4">Address Verification</div>
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
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>Address Verification</label><span className="text-danger">*</span>
                <div>
                  <SingleSelect name="address_proof" options={addressVerify}
                    className={`${errors.addType ? "border border-danger" : ""}`}

                    placeItem={'Address Verification'}
                    value={formData?.address_verify?.address_proof}
                    onChange={(e) => {
                      setCheckbox2(false)
                      handleChangeInput(e, 'address_verify')
                    }}
                  />
                  {errors.addType && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-1`}>Address Proof No.</label><span className="text-danger">*</span>
                <div>
                  <Input placeholder="Address Proof No." name="address_proof_no"
                    className={`${errors.addNo ? "border border-danger" : ""}`}

                    value={formData?.address_verify?.address_proof_no}
                    onChange={(e) => {
                      setCheckbox2(false)
                      handleChangeInput(e, 'address_verify')
                    }}
                  />
                  {errors.addNo && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              {addressFile?.name !== undefined || formData?.address_verify?.attachment?.file_name !== '' ?
                <div className="col-md-6 mt-3">
                  <label className={`${style.labels} mb-1`}>Attachment File</label>
                  <div className="form-control w-100" style={{ overflow: 'hidden' }}>
                    {addressFile?.name !== undefined ? addressFile?.name : formData?.address_verify?.attachment?.file_name}
                  </div>
                </div> : ''}
            </div>
            <div className="row mt-4 ">
              <div className="col-lg-4 col-md-6 d-md-block d-sm-none d-none">
                <input type="file" id="file2" hidden accept="image/jpeg,image/png,application/pdf,image/x-eps" onChange={(e) => {
                  setAddressFile(e.target.files[0])
                  setFile2Err(false)
                  setCheckbox2(false)
                }} />

                <label className={`${style.boxBackground} flex center`} style={{ cursor: "pointer" }} htmlFor="file2">
                  <TbUpload style={{ fontSize: "20px" }} />
                  <span className={`${style.labels} ml-2`} style={{ color: "#0E1073" }}>
                    Upload Document
                  </span>
                </label>
              </div>
              <div className="col-md-4 col-sm-6 col-6 d-md-none d-sm-block d-block">

                <label className={`${style.boxBackground} flex center`} style={{ cursor: "pointer" }} htmlFor="file2">
                  <TbUpload style={{ fontSize: "20px" }} />
                  <span className={`${style.labels} ml-2`} style={{ color: "#0E1073" }}>
                    Upload
                  </span>
                </label>
              </div>
              <div className="col-md-4 col-sm-6 col-6 d-md-none d-sm-block d-block">
                <input type="file" id="file134" hidden accept="image/*" capture="camera" onChange={(e) => {
                  setAddressFile(e.target.files[0])
                  setFile2Err(false)
                  setCheckbox2(false)
                }} />

                <label className={`${style.boxBackground} flex center`} style={{ cursor: "pointer" }} htmlFor="file134">
                  <TbCapture style={{ fontSize: "20px" }} />
                  <span className={`${style.labels} ml-2`} style={{ color: "#0E1073" }}>
                    capture
                  </span>
                </label>
              </div>
              {errors.file2 ? <div className="text-danger mt-1">Required</div> : ''}
            </div>
          </>
        )}

        <div className="w-100 d-flex justify-content-end mt-4 p-0">
          {/* <button type="button" className="btn border mr-2" onClick={() => toggleTab("1")} >
            Back
          </button> */}
          {/* <button type="button" className="btn mr-2" onClick={() => {
            setOpen(!open)
            toggleTab("1")
          }} >
            Cancel
          </button> */}
          <div className="w-100 d-flex justify-content-end mt-4 p-1">
            <button type="button" className="btn mr-2" onClick={() => setOpen(!open)}>
              Cancel
            </button>
            {/* <button type="submit" className="btn btn-primary" onClick={(e) => {toggleTab("2");handleSubmit(e)}} >
              Next
            </button> */}
          </div>
        <button type="submit" className="btn btn-primary" >
          {mode == "edit" ? "Edit" : "Create"}
          </button>
        </div>
      </form>
    </>
  );
};

export default UserInfoOther;
