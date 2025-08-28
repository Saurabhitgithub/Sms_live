import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { CiExport } from "react-icons/ci";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { Input, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { City, Country, State } from "country-state-city";
import { addUser, getAllRole } from "../../service/admin";
import { uid } from "uid";
import { IoMdAdd } from "react-icons/io";
import style from "./UserManagement.module.css";
import { ImCross } from "react-icons/im";
import Loader from "../../components/commonComponent/loader/Loader";
import { userInfo } from "../../assets/userLoginInfo";
function AddUser() {
  const [userId, setUserId] = useState(uid().substring(0, 5));
  let india = Country.getAllCountries().filter((e) => e.name === "India")[0];
  const [sameAs, setSameAs] = useState(false);
  const [num, setNum] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [attributesData, setAttributesData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    member_id: "",
    phone_number: "",
    personal_address: {
      address: "",
      state: "",
      city: "",
      pin_code: null,
    },
    office_address: {
      address: "",
      state: "",
      city: "",
      pin_code: null,
    },
    isp_id: "664645a80522c3d5bc318cd2",
  });
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [offcityList, setoffCityList] = useState([]);
  const [valid, setValid] = useState(false);

  const listState = () => {
    let states = State.getStatesOfCountry(india.isoCode);
    setStateList(states);
  };
  const listCity = (state, key) => {
    let cities = City.getCitiesOfState(india.isoCode, state.isoCode);
    if (key === "personal_address") {
      setCityList(cities);
    } else {
      setoffCityList(cities);
    }
  };
  const valuess = (data) => {
    let asData = stateList.filter((e) => e.name === data)[0];
    return asData;
  };
  const [roles, setRoles] = useState([]);

  const getRoleData = async () => {
    try {
      let res = await getAllRole(userInfo().role === "isp admin" ? userInfo()._id : userInfo().orgId);
      let roleData = res.data.data
        .filter((es) => es.role !== "franchise")
        .map((e) => {
          return {
            value: e.role,
            label: e.role.charAt(0).toUpperCase() + e.role.slice(1),
          };
        });
      setRoles(roleData);
    } catch (err) {
      console.log(err);
    }
  };

  let history = useHistory();

  function hancelcancel() {
    history.push("/userManagement");
  }
  const handleInput = (event) => {
    const { name, value } = event;
    setValid(false);

    setFormData({ ...formData, [name]: value });
  };
  const handleInputObject = (event, key) => {
    let { name, value } = event;
    setValid(false);
    if (name === "state") {
      let stateValue = JSON.parse(value);
      listCity(stateValue, key);

      value = stateValue.name;
      if (key === "personal_address") {
        // setStatePer(value);
        setFormData({
          ...formData,
          personal_address: {
            address: formData.personal_address.address,
            state: value,
            city: "",
            pin_code: formData.personal_address.pin_code,
          },
        });
        if (sameAs) {
          setFormData({
            ...formData,
            office_address: {
              address: "",
              state: "",
              city: "",
              pin_code: null,
            },
          });
          setSameAs(false);
        }
      } else {
        // setStateoff(value);
        setFormData({
          ...formData,
          office_address: {
            address: formData.office_address.address,
            state: value,
            city: "",
            pin_code: formData.office_address.pin_code,
          },
        });
      }
    } else {
      const parsedValue = name === "pin_code" && value.length !== 0 ? parseInt(value) : value;
      let burst = { ...formData[key], [name]: parsedValue };
      setFormData({ ...formData, [key]: burst });
    }
  };

  function validate(obj) {
    const isValidValue = (value) => value !== "" && value !== null;

    function checkObjectValues(object) {
      for (let key in object) {
        if (object.hasOwnProperty(key)) {
          const value = object[key];
          if (typeof value === "object" && value !== null) {
            if (!checkObjectValues(value)) {
              return false;
            }
          } else if (!isValidValue(value)) {
            return false;
          }
        }
      }
      return true;
    }
    return checkObjectValues(obj);
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      let payload = {
        ...formData,
        member_id: userId,
        sameAs: sameAs,
      };

      let attribute = attributesData.filter((e) => e.field_value.trim().length === 0);
      if (validate(payload) && num.length === 10 && attribute.length === 0) {
        console.log({
          org_id:
            userInfo().role === "isp admin" || userInfo().role === "super admin" ? userInfo()._id : userInfo().org_id,
          isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
        });
        payload = {
          ...payload,
          org_id:
            userInfo().role === "isp admin" || userInfo().role === "super admin" ? userInfo()._id : userInfo().org_id,
          isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
        };
        await addUser(payload).then((res) => {
          history.push({ pathname: "/userManagement", state: "add" });
        });
      } else {
        setValid(true);
        
      }
    } catch (err) {
      console.log(err);
      if (err.response.data.errormessage.includes("email_1 dup key")) {
        setError("Email Already Exist");
      }
    } finally {
      setLoader(false);
    }
  };

  const addvalueAttribute = (index, value) => {
    let valueData = attributesData;
    valueData[index].field_value = value;
    setAttributesData(valueData);
    handleInput({
      name: "attributes",
      value: valueData,
    });
  };
  const removeAttribute = (ind, main) => {
    if (main) {
      let del = attributes.filter((feature, index) => index !== ind);

      setAttributes(del);
    } else {
      let del = attributesData.filter((feature, index) => index !== ind);
      setAttributesData(del);
      handleInput({ name: "attributes", value: del });
    }
  };
  const addAttribute = () => {
    setAttributes([...attributes, ""]);
  };

  useEffect(() => {
    listState();
    getRoleData();
  }, []);
  return (
    <Content>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <div className="card_container p-4 user_section">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2 align-items-center  text-dark">
            <span className="f-24 fw-500 p-0" onClick={hancelcancel}>
              <IoArrowBack className="mb-1" /> Add User
            </span>
          </div>
        </div>
        <form onSubmit={handleAdd}>
          <div class=" mt-5 p-0">
            <div class="row d-flex justify-content-between p-0">
              <div class="col-md-6">
                <div></div>
                <h5>
                  Role<span className="text-danger">*</span>
                </h5>
                <div className="mt-2 boarder-danger">
                  <SingleSelect
                    placeItem={"User Role"}
                    options={roles}
                    name="role"
                    className={valid && formData.role.length === 0 ? "border border-danger" : ""}
                    placeholder={"Select User Role"}
                    onChange={(e) => {
                      handleInput(e.target);
                      let sid = userId.split("-");

                      let test = e.target.value.split("_");
                      if (test.length === 2) {
                        setUserId(`${test[0].charAt(0) + test[1].charAt(0)}-${sid[sid.length - 1]}`);
                      } else {
                        setUserId(`${e.target.value}-${sid[sid.length - 1]}`);
                      }
                    }}
                  />
                  {valid && formData.role.length === 0 && (
                    <>
                      <p className="text-danger">Required</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-4 col-sm-6 col-12 pt-md-0 pt-3">
                <h5 className="">Id</h5>
                <Input
                  className="mt-2"
                  disabled
                  name="member_id"
                  value={userId}
                  onChange={(e) => {
                    handleInput(e.target);
                  }}
                  type="text"
                  placeholder="Id wil be generated"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="h3_input">Personal Details</div>

            <div class="row mt-3">
              <div class="col-md-4 col-sm-6 col-12">
                <h5>
                  Name<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${valid && formData.name.length === 0 ? "border border-danger" : ""}`}
                  onChange={(e) => {
                    handleInput(e.target);
                  }}
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                />
                {valid && formData.name.length === 0 && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  Email Id<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${valid && formData.email.length === 0 ? "border border-danger" : ""}`}
                  onChange={(e) => {
                    handleInput(e.target);
                    setError("");
                  }}
                  name="email"
                  type="email"
                  placeholder="Enter your Email Id"
                />
                {valid && formData.email.length === 0 && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
                <div className="text-danger">{error}</div>
              </div>
              <div class="col-md-4 col-sm-6 col-12 mt-3 mt-md-0">
                <h5>
                  Phone Number<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${valid && num.length == 10 ? "border border-danger" : ""}`}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      handleInput(e.target);
                      setNum(e.target.value);
                    }
                  }}
                  value={num}
                  name="phone_number"
                  type="number"
                  placeholder="Enter Your Phone Number"
                />
                {valid && !num.length !== 10 && (
                  <>
                    <p className="text-danger">Please enter 10 digit number</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="h3_input">Address</div>

            <div class="row mt-3">
              <div class="col-md-4 col-sm-6 col-12">
                <h5>
                  Address<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${
                    valid && formData.personal_address.address.length === 0 ? "border border-danger" : ""
                  }`}
                  type="text"
                  placeholder="Enter Your Address"
                  name="address"
                  onChange={(e) => {
                    handleInputObject(e.target, "personal_address");
                  }}
                />
                {valid && formData.personal_address.address.length === 0 && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  State<span className="text-danger">*</span>
                </h5>

                <SingleSelect
                  className={` mt-2 ${
                    valid && formData.personal_address.state.length === 0 ? "border border-danger" : ""
                  }`}
                  placeItem={"State"}
                  options={stateList?.map((e) => {
                    return { label: e.name, value: JSON.stringify(e) };
                  })}
                  name="state"
                  placeholder={"Select State"}
                  onChange={(e) => {
                    handleInputObject(e.target, "personal_address");
                  }}
                />
                {valid && formData.personal_address.state.length === 0 && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 mt-3 mt-md-0">
                <h5>
                  City<span className="text-danger">*</span>
                </h5>

                <SingleSelect
                  placeItem={"city"}
                  options={cityList?.map((e) => {
                    return { label: e.name, value: e.name };
                  })}
                  name="city"
                  className={`parimary-hover mt-2 ${
                    valid && formData.personal_address.city.length === 0 ? "border border-danger" : ""
                  }`}
                  value={formData?.personal_address?.city}
                  placeholder={"Select city"}
                  onChange={(e) => {
                    handleInputObject(e.target, "personal_address");
                  }}
                />
                {valid && formData.personal_address.city.length === 0 && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-xxl-0 pt-3">
                <h5>
                  Pin Code<span className="text-danger">*</span>
                </h5>
                <Input
                  name="pin_code"
                  onChange={(e) => {
                    handleInputObject(e.target, "personal_address");
                  }}
                  className={` mt-2 ${valid && !formData.personal_address.pin_code ? "border border-danger" : ""}`}
                  type="number"
                  placeholder="Enter Your Code"
                />
                {valid && !formData.personal_address.pin_code && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="h3_input">Office Address</div>

            <div class=" form-check d-flex align-items-center mt-1">
              <input
                class="form-check-input input"
                type="checkbox"
                value=""
                checked={sameAs}
                id="flexCheckIndeterminate"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, office_address: formData.personal_address });

                    listCity(stateList.filter((e) => e.name === formData.personal_address.state)[0], "office_address");
                  } else {
                    setFormData({ ...formData, office_address: { address: "", state: "", city: "", pin_code: null } });
                  }
                  setSameAs(e.target.checked);
                }}
              />
              <label class="form-check-label ml-2 h7" for="flexCheckIndeterminate">
                Same as above
              </label>
            </div>

            <div class="row mt-4">
              <div class="col-md-4 col-sm-6 col-12">
                <h5>
                  Address<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${
                    valid && formData.office_address.address.length === 0 ? "border border-danger" : ""
                  }`}
                  name="address"
                  value={formData.office_address.address}
                  onChange={(e) => {
                    handleInputObject(e.target, "office_address");
                  }}
                  type="text"
                  disabled={sameAs}
                  placeholder="Enter Your Address"
                />
                {valid && formData.office_address.address.length === 0 && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  State<span className="text-danger">*</span>
                </h5>
                <SingleSelect
                  placeItem={"State"}
                  disabled={sameAs}
                  value={
                    formData.office_address.state.length !== 0
                      ? JSON.stringify(valuess(formData.office_address.state))
                      : ""
                  }
                  options={stateList?.map((e) => {
                    return { label: e.name, value: JSON.stringify(e) };
                  })}
                  className={` mt-2 ${
                    valid && formData.office_address.state.length === 0 ? "border border-danger" : ""
                  }`}
                  name="state"
                  placeholder={"Select State"}
                  onChange={(e) => {
                    handleInputObject(e.target, "office_address");
                  }}
                />
                {valid && formData.office_address.state.length === 0 && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 mt-3 mt-md-0">
                <h5>
                  City<span className="text-danger">*</span>
                </h5>

                <SingleSelect
                  placeItem={"city"}
                  disabled={sameAs}
                  value={formData.office_address.city}
                  options={offcityList?.map((e) => {
                    return { label: e.name, value: e.name };
                  })}
                  className={` mt-2 ${
                    valid && formData.office_address.city.length === 0 ? "border border-danger" : ""
                  }`}
                  name="city"
                  placeholder={"Select city"}
                  onChange={(e) => {
                    handleInputObject(e.target, "office_address");
                  }}
                />
                {valid && formData.office_address.city.length === 0 && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-xxl-0 pt-3">
                <h5>
                  Pin Code<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${valid && !formData.office_address.pin_code ? "border border-danger" : ""}`}
                  name="pin_code"
                  value={formData.office_address.pin_code ? Number(formData.office_address.pin_code) : ""}
                  onChange={(e) => {
                    handleInputObject(e.target, "office_address");
                  }}
                  disabled={sameAs}
                  type="number"
                  placeholder="Enter Your Code"
                />
                {valid && !formData.office_address.pin_code && (
                  <>
                    <p className="text-danger">Required</p>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* other details  */}
          {attributesData.length > 0 && (
            <>
              <h5 className="mt-5">Other Details</h5>
              {attributesData.map((res, index) => (
                <div className="mt-4 p-0" key={index}>
                  <Label className="labels">{res.field_name}</Label>
                  <div className="d-flex">
                    <div className="p-0">
                      <Input
                        // className="w-100 mr-2"
                        className={`${
                          valid && attributesData[index]?.field_value?.length === 0 ? "border border-danger" : ""
                        }`}
                        placeholder="Enter Details"
                        defaultValue={res.field_value}
                        onChange={(e) => addvalueAttribute(index, e.target.value)}
                      />
                      {valid && attributesData[index]?.field_value?.length === 0 && (
                        <>
                          <p className="text-danger">Field is Required</p>
                        </>
                      )}
                    </div>
                    <span
                      onClick={() => removeAttribute(index, false)}
                      style={{ fontSize: "15px", marginLeft: "17px", cursor: "pointer" }}
                    >
                      <ImCross />
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* attribute button  */}
          <h5 className="mt-5">Attributes</h5>
          {attributes.map((attribute, index) => (
            <div className="mt-4 p-0 d-flex" key={index}>
              <div className={`p-0 ${style.inputContainer} col-md-4`}>
                <div className={style.inputWrapper}>
                  <Input
                    onChange={(e) => {
                      const newAttributes = [...attributes];
                      newAttributes[index] = e.target.value;
                      setAttributes(newAttributes);
                    }}
                    placeholder="Enter Detail"
                    className={style.inputWithText}
                    value={attributes[index]}
                    style={{ width: "100%" }}
                  />
                  <span
                    className={`${style.actionText} ${style.addText}`}
                    onClick={() => {
                      if (attribute[index] !== undefined) {
                        setAttributesData((prev) => [
                          ...prev,
                          {
                            field_name: attributes[index],
                            field_value: "",
                          },
                        ]);

                        removeAttribute(index, true);
                      }
                    }}
                  >
                    Add
                  </span>
                  <span
                    className={`${style.actionText} ${style.deleteText}`}
                    onClick={() => removeAttribute(index, true)}
                  >
                    Delete
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <button
              type="button"
              className="btn parimary lighterColor d-flex align-items-center parimary-color"
              onClick={addAttribute}
            >
              {" "}
              <IoMdAdd />
              Add Attribute
            </button>
          </div>

          <div className="flex end mt-3">
            <div className="btn mr-2" onClick={hancelcancel}>
              Cancel
            </div>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </div>
        </form>
      </div>
    </Content>
  );
}

export default AddUser;
