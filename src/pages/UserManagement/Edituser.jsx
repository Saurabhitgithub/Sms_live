import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { CiExport } from "react-icons/ci";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { Input, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { getAllRole, getUserById, updateUser } from "../../service/admin";
import { useParams } from "react-router-dom";
import { uid } from "uid";
import { IoArrowBack } from "react-icons/io5";
import { City, Country, State } from "country-state-city";
import { IoMdAdd } from "react-icons/io";
import style from "./UserManagement.module.css";
import Loader from "../../components/commonComponent/loader/Loader";

import { ImCross } from "react-icons/im";
function Edituser() {
  let { id } = useParams();
  const [userData, setUserData] = useState();
  let india = Country.getAllCountries().filter((e) => e.name === "India")[0];
  const [sameAs, setSameAs] = useState(false);
  const [num, setNum] = useState("");
  const [office, setOffice] = useState({ address: "", state: "", city: "", pin_code: null });
  const [loader, setLoader] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [offcityList, setoffCityList] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributesData, setAttributesData] = useState([]);
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
      pin_code: "",
    },
    isp_id: "664645a80522c3d5bc318cd2",
  });

  const [userId, setUserId] = useState(uid().substring(0, 5));
  const [Ids, setIds] = useState(uid().substring(0, 5));
  const [valid, setValid] = useState(false);
  const listState = () => {
    let states = State.getStatesOfCountry(india.isoCode);
    setStateList(states);
    return states;
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
  const billingCycle = [
    { value: "admin", label: "Admin" },
    { value: "Installation_Engineer", label: "Installation Engineer" },
    { value: "Network_Engineer", label: "Network Engineer" },
    { value: "Customer_support ", label: "Customer support " },
  ];
  let history = useHistory();

  function hancelcancel() {
    history.push("/userManagement");
  }
  function getCityListData(data, states) {
    let statePerss = states.filter((e) => e.name === data.personal_address.state)[0];
    let stateOfficess = states.filter((e) => e.name === data.office_address.state)[0];

    if (statePerss?.name) {
      listCity(statePerss, "personal_address");
    }
    if (stateOfficess.name) {
      listCity(stateOfficess, "office_address");
    }
  }
  const getDataUserById = async (id) => {
    try {
      const res = await getUserById(id);
      setFormData(res.data.data);
      setSameAs(res.data.data.sameAs);
      setNum(Number(res?.data.data.phone_number));
      let stateListData = listState();
      getCityListData(res.data.data, stateListData);
      setUserId(res?.data.data.member_id);
      setAttributesData(res.data.data.attributes);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInput = (event) => {
    const { name, value } = event;
    setValid(false);

    setFormData({ ...formData, [name]: value });
  };
  const [stateOff, setStateoff] = useState();
  const [statePer, setStatePer] = useState();

  const handleInputObject = (event, key) => {
    let { name, value } = event;
    setValid(false);
    if (name === "state") {
      let stateValue = JSON.parse(value);
      listCity(stateValue, key);

      value = stateValue.name;
      if (key === "personal_address") {
        setStatePer(value);
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
        setStateoff(value);
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
      const parsedValue = value && name === "pin_code" ? parseInt(value) : value;
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

  const [roles, setRoles] = useState([]);

  const getRoleData = async () => {
    try {
      let res = await getAllRole();
      
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

  const UpdateUserData = async (e) => {
    setLoader(true);
    try {
      e.preventDefault();

      const payload = {
        ...formData,
        member_id: userId,
        sameAs: sameAs,
      };

      // Make the API call to update user data
      let attribute = attributesData.filter((e) => e.field_value.trim().length === 0);
      if (validate(payload) && num.toString().length === 10 && attribute.length === 0) {
        const response = await updateUser(id, payload);

        // Navigate to "/userManagement" after successful update
        history.push({ pathname: "/userManagement", state: "edit" });
      } else {
        setValid(true);
        
      }
    } catch (err) {
      // Handle errors from the API call
      // Optionally, display an error message to the user
    }
    setLoader(false);
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
    getDataUserById(id);
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
          <div className="d-flex align-items-center  text-dark gap-2">
            <span className="f-24 fw-500 p-0" onClick={hancelcancel}>
              <IoArrowBack className="mb-1" /> Edit User
            </span>
          </div>
          {/* <div className="filter_btn ">
            <span>
              {" "}
              <CiExport style={{ fontSize: "1rem" }} /> Export
            </span>
          </div> */}
        </div>

        <form onSubmit={UpdateUserData}>
          <div class=" mt-5 p-0">
            <div class="row justify-content-between p-0">
              <div class="col-md-6">
                <div></div>
                <h5>
                  Role<span className="text-danger">*</span>
                </h5>
                <div className="mt-2">
                  <SingleSelect
                    value={formData?.role}
                    name="role"
                    placeItem={"User Role"}
                    className={valid && formData.role.length === 0 ? "border border-danger" : ""}
                    options={roles}
                    placeholder={"Select User Role"}
                    onChange={(e) => {
                      handleInput(e.target);
                      let sid = userId.split("-");
                      let test = e.target.value.split("_");
                      let idd = Ids;
                      if (test.length === 2) {
                        setUserId(`${test[0].charAt(0) + test[1].charAt(0)}-${idd}`);
                      } else {
                        setUserId(`${e.target.value}-${idd}`);
                      }
                    }}
                  />
                  {valid && formData.role.length === 0 && (
                    <>
                      <p className="text-danger">Field is Required</p>
                    </>
                  )}
                </div>
              </div>
              <div class="col-md-6 mt-3 mt-md-0">
                <h5>Id</h5>
                <Input
                  className=" mt-2"
                  type="text"
                  disabled
                  name="member_id"
                  onChange={(e) => {
                    handleInput(e.target);
                  }}
                  value={userId}
                  placeholder="Id wil be generated"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mt-4 h3_input">Personal Details</div>

            <div class="row mt-4">
              <div class="col-md-4 col-sm-6 col-12">
                <h5>
                  Name<span className="text-danger">*</span>
                </h5>
                <Input
                  onInput={(e) => {
                    handleInput(e.target);
                  }}
                  className={` mt-2 ${valid && formData.name.length === 0 ? "border border-danger" : ""}`}
                  type="text"
                  name="name"
                  defaultValue={formData?.name}
                  placeholder="Enter your name"
                />
                {valid && formData.name.length === 0 && (
                  <>
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  Email Id<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${valid && formData.email.length === 0 ? "border border-danger" : ""}`}
                  type="email"
                  onInput={(e) => {
                    handleInput(e.target);
                  }}
                  name="email"
                  defaultValue={formData?.email}
                  placeholder="Enter your Email Id"
                  // disabled
                />
                {valid && formData.email.length === 0 && (
                  <>
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  Phone Number<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${valid && num.toString().length !== 10 ? "border border-danger" : ""}`}
                  type="number"
                  onInput={(e) => {
                    if (e.target.value.length <= 10) {
                      handleInput(e.target);
                      setNum(e.target.value);
                    }
                  }}
                  value={num}
                  name="phone_number"
                  placeholder="Enter Your Phone Number"
                />
             
                {valid && num.toString().length !== 10 && (
                  <>
                    <p className="text-danger">Please enter 10 digit number</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mt-4 h3_input">Address</div>

            <div class="row mt-4">
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  Address<span className="text-danger">*</span>
                </h5>
                <Input
                  className={` mt-2 ${
                    valid && formData.personal_address.address.length === 0 ? "border border-danger" : ""
                  }`}
                  type="text"
                  name="address"
                  onInput={(e) => {
                    handleInputObject(e.target, "personal_address");
                  }}
                  defaultValue={formData?.personal_address?.address}
                  placeholder="Enter Your Address"
                />
                {valid && formData.personal_address.address.length === 0 && (
                  <>
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  State<span className="text-danger">*</span>
                </h5>

                <SingleSelect
                  value={JSON.stringify(valuess(statePer ? statePer : formData.personal_address?.state))}
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
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  City<span className="text-danger">*</span>
                </h5>

                <SingleSelect
                  placeItem={"city"}
                  options={cityList?.map((e) => {
                    return { label: e.name, value: e.name };
                  })}
                  name="city"
                  className={` mt-2 ${
                    valid && formData.personal_address?.city.length === 0 ? "border border-danger" : ""
                  }`}
                  value={formData?.personal_address?.city}
                  placeholder={"Select city"}
                  onChange={(e) => {
                    handleInputObject(e.target, "personal_address");
                  }}
                />
                {valid && formData.personal_address?.city.length === 0 && (
                  <>
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3 pt-md-3">
                <h5>
                  Pin Code<span className="text-danger">*</span>
                </h5>
                <Input
                  value={Number(formData?.personal_address?.pin_code)}
                  type="number"
                  name="pin_code"
                  className={` mt-2 ${valid && !formData.personal_address?.pin_code ? "border border-danger" : ""}`}
                  onInput={(e) => {
                    handleInputObject(e.target, "personal_address");
                  }}
                  placeholder="Enter Your Code"
                />
                {valid && !formData.personal_address?.pin_code && (
                  <>
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mt-4 h3_input">Office Address</div>

            <div class="form-check d-flex align-items-center mt-2">
              <input
                class="form-check-input input parimary-background"
                type="checkbox"
                value=""
                checked={sameAs}
                id="flexCheckIndeterminate"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, office_address: formData.personal_address });
                    listCity(stateList.filter((e) => e.name === formData.personal_address.state)[0], "office_address");
                    setOffice(formData.office_address);
                  } else {
                    setOffice(formData.office_address);
                    setFormData({ ...formData, office_address: { address: "", state: "", city: "", pin_code: null } });
                  }
                  setSameAs(e.target.checked);
                }}
              />{" "}
              <label class="form-check-label ml-2 h7 text-dark pt-1 " for="flexCheckIndeterminate">
                Same as above
              </label>
            </div>

            <div class="row mt-4">
              <div class="col-md-4 col-sm-6 col-12">
                <h5>
                  Address<span className="text-danger">*</span>
                </h5>
                <Input
                  name="address"
                  disabled={sameAs}
                  onChange={(e) => {
                    handleInputObject(e.target, "office_address");
                  }}
                  className={` mt-2 ${
                    valid && formData.office_address.address.length === 0 ? "border border-danger" : ""
                  }`}
                  value={formData?.office_address?.address}
                  type="text"
                  placeholder="Enter Your Address"
                />
                {valid && formData.office_address.address.length === 0 && (
                  <>
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  State<span className="text-danger">*</span>
                </h5>

                <SingleSelect
                  placeItem={"State"}
                  value={
                    formData.office_address?.state.length !== 0
                      ? JSON.stringify(valuess(formData.office_address?.state))
                      : ""
                  }
                  disabled={sameAs}
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
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3">
                <h5>
                  City<span className="text-danger">*</span>
                </h5>
                <SingleSelect
                  placeItem={"city"}
                  disabled={sameAs}
                  value={formData.office_address?.city}
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
                    <p className="text-danger">Field is Required</p>
                  </>
                )}
              </div>
              <div class="col-md-4 col-sm-6 col-12 pt-sm-0 pt-3 pt-md-3">
                <h5>
                  Pin Code<span className="text-danger">*</span>
                </h5>

                <Input
                  className={` mt-2 ${
                    valid &&
                    (!formData.office_address.pin_code || typeof formData?.office_address?.pin_code === "string")
                      ? "border border-danger"
                      : ""
                  }`}
                  type="number"
                  name="pin_code"
                  disabled={sameAs}
                  onChange={(e) => {
                    handleInputObject(e.target, "office_address");
                  }}
                  value={formData.office_address.pin_code ? Number(formData?.office_address?.pin_code) : ""}
                  placeholder="Enter Your Code"
                />
                {}
                {valid &&
                  (!formData?.office_address?.pin_code || typeof formData?.office_address?.pin_code === "string") && (
                    <>
                      <p className="text-danger">Field is Required</p>
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
                  <Label className="labels">{res?.field_name}</Label>
                  <div className="d-flex">
                    <div className="p-0 ">
                      <Input
                        // className="w-100 mr-2"
                        className={`${valid && res?.field_value.length === 0 ? "border border-danger" : ""}`}
                        placeholder="Enter Details"
                        defaultValue={res?.field_value}
                        onChange={(e) => addvalueAttribute(index, e.target.value)}
                      />
                      {valid && res?.field_value.length === 0 && (
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
                    style={{ width: "100%" }} // Ensure the input takes the full width of its container
                  />
                  <span
                    className={`${style.actionText} ${style.addText}`}
                    onClick={() => {
                      if (attributes[index] !== "") {
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
              className="BackGroundLight d-flex align-items-center parimary-color"
              onClick={addAttribute}
            >
              {" "}
              <IoMdAdd />
              Add Attribute
            </button>
          </div>
          <div className="flex end mt-3">
            <div className="btn mr-2 pointer" onClick={hancelcancel}>
              Cancel
            </div>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </Content>
  );
}

export default Edituser;
