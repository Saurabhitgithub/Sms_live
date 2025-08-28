import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody, FormGroup } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
} from "../../../components/Component";

import { City, Country, State } from "country-state-city";
import { userId, userInfo } from "../../../assets/userLoginInfo";
import { franchiseeConfigurationAdd, getAdmin, getUserById, updateAdmin, updateUser } from "../../../service/admin";
import Loader from "../../../components/commonComponent/loader/Loader";
const UserProfileRegularPage = ({ sm, updateSm, setProfileName }) => {
  const [modalTab, setModalTab] = useState("1");
  const [userData, setUserData] = useState();
  const [loader, setLoader] = useState(true);
  let india = Country.getAllCountries().filter((e) => e.name === "India")[0];
  const [formData, setFormData] = useState();
  const getProfileData = async () => {
    try {
      let response;
      setLoader(true);
      if (showVaild(userInfo().role)) {
        response = await getAdmin(userId());
        setUserData({
          name: response.data.data.admin_name,
          phone_number: response.data.data.admin_contact,
          email: response.data.data.admin_email,
          gstNo: response.data.data.gstNo,
          address: response.data.data.address,
        });
        setFormData({
          name: response.data.data.admin_name,
          phone_number: response.data.data.admin_contact,
          email: response.data.data.admin_email,
          gstNo: response.data.data.gstNo,
          address: response.data.data.address,
        });
      } else {
        response = await getUserById(userId()).then((res) => {
          return res.data.data;
        });
        setUserData({
          ...response,
          phone_number: response.mobileNumber ? response.mobileNumber : response.phone_number,
          office_address: response.office_address
            ? response.office_address
            : {
                address: response.commercialAddress.address_line,

                state: response.commercialAddress.state,

                city: response.commercialAddress.city,

                pin_code: response.commercialAddress.pinCode,
              },
          personal_address: response.personal_address
            ? response.personal_address
            : {
                address: response.billingAddress.address_line,

                state: response.billingAddress.state,

                city: response.billingAddress.city,

                pin_code: response.billingAddress.pinCode,
              },
        });
        setFormData({
          ...response,
          phone_number: response.mobileNumber ? response.mobileNumber : response.phone_number,
          office_address: response.office_address
            ? response.office_address
            : {
                address: response.commercialAddress.address_line,

                state: response.commercialAddress.state,

                city: response.commercialAddress.city,

                pin_code: response.commercialAddress.pinCode,
              },
          personal_address: response.personal_address
            ? response.personal_address
            : {
                address: response.billingAddress.address_line,

                state: response.billingAddress.state,

                city: response.billingAddress.city,

                pin_code: response.billingAddress.pinCode,
              },
        });
        let personalState = valuess(response.personal_address.state);
        let officeState = valuess(response.office_address.state);

        // setSelectedState(jSON.stringify(personalState));
        // setSelectedStateoff(JSON.stringify(officeState));
        setSameAs(response.sameAs);
        getCities(JSON.stringify(officeState), "office_address", true);
        getCities(JSON.stringify(personalState), "personal_address", true);
      }
    } catch (err) {}
    setLoader(false);
  };

  const stateList = State.getStatesOfCountry(india.isoCode);
  const [offCityList, setOffCitylist] = useState([]);
  const [perCityList, setPerCitylist] = useState([]);
  const [sameAs, setSameAs] = useState(false);

  const [selectedState, setSelectedState] = useState();
  const [selectedStateOff, setSelectedStateoff] = useState();

  const valuess = (data) => {
    let asData = stateList.filter((e) => e.name === data)[0];

    return asData;
  };
  useEffect(() => {
    getProfileData();
  }, []);
  const showVaild = (role) => {
    if (role === "super admin") {
      return true;
    } else if (role === "isp admin") {
      return true;
    } else {
      return false;
    }
  };

  function getCities(state, type, same) {
    let obj = JSON.parse(state);
    
    let cities = City.getCitiesOfState(india.isoCode, obj.isoCode);

    if (type === "personal_address") {
      setPerCitylist(cities);
      setSelectedState(state);
      onInputChange({ target: { name: "state", value: obj.name } }, "personal_address");
    } else {
      setOffCitylist(cities);
      setSelectedStateoff(state);
      if (!same) {
        onInputChange({ target: { name: "state", value: obj.name } }, "office_address");
      }
    }
  }

  const [modal, setModal] = useState(false);

  useEffect(() => {
    setProfileName(formData);
  }, [formData, setProfileName]);

  // const onInputChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const onInputChange = (e, key) => {
    setVaild(false);
    const { name, value } = e.target;
    if (key === "personal_address") {
      let newObj = { ...formData.personal_address, [name]: value };

      setFormData((pre) => {
        return {
          ...pre,
          personal_address: newObj,
        };
      });
      if (sameAs) {
        setFormData((pre) => {
          return {
            ...pre,
            office_address: { address: "", state: "", city: "", pin_code: "" },
          };
        });

        setSelectedStateoff("");
        setSameAs(false);
      }
    } else if (key === "office_address") {
      let newObj = { ...formData.office_address, [name]: value };
      setFormData((pre) => {
        return {
          ...pre,
          office_address: newObj,
        };
      });
      setSameAs(false);
    } else {
      setFormData((pre) => {
        return {
          ...pre,
          [name]: value,
        };
      });
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
  const [vaild, setVaild] = useState(false);
  const submitForm = async () => {
    try {
      let submitData = {
        ...formData,
      };

      if (validate(submitData) && submitData.phone_number.toString() !== 0) {
        if (showVaild(userInfo().role)) {
          await updateAdmin(userId(), submitData);
        } else {
          if (userInfo().role === "franchise") {
            let payload = {
              ...response,
              mobileNumber: response.phone_number,
              commercialAddress: {
                address: response.office_address.address_line,

                state: response.office_address.state,

                city: response.office_address.city,

                pin_code: response.office_address.pinCode,
              },
              billingAddress: {
                address: response.personal_address.address_line,

                state: response.personal_address.state,

                city: response.personal_address.city,

                pin_code: response.billingAddress.pinCode,
              },
              _id: userId(),
            };
            await franchiseeConfigurationAdd(payload);
          } else {
            let payload = { ...submitData, sameAs: sameAs };
            await updateUser(userId(), payload);
          }
        }
        setUserData(submitData);
        setModal(false);
        setModalTab("1");
      } else {
        setVaild(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Head title="User List - Profile"></Head>
      <BlockHead size="lg">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle tag="h4">Personal Information</BlockTitle>
            <BlockDes>
              <p>Basic info, like your name and address, that you use on SMS Platform.</p>
            </BlockDes>
          </BlockHeadContent>
          <BlockHeadContent className="align-self-start d-lg-none">
            <Button
              className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
              onClick={() => updateSm(!sm)}
            >
              <Icon name="menu-alt-r"></Icon>
            </Button>
          </BlockHeadContent>
        </BlockBetween>
      </BlockHead>

      <Block>
        <div className="nk-data data-list">
          <div className="data-head">
            <h6 className="overline-title">Basics</h6>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Full Name</span>
              <span className="data-value">{userData?.name}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>

          <div className="data-item">
            <div className="data-col">
              <span className="data-label">Email</span>
              <span className="data-value">{userData?.email}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more disable">
                <Icon name="lock-alt"></Icon>
              </span>
            </div>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Phone Number</span>
              <span className="data-value text-soft">{userData?.phone_number}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Gst Number</span>
              <span className="data-value text-soft">{userData?.gstNo}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Address</span>
              <span className="data-value text-soft">{userData?.address}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>

          {!showVaild(userInfo().role) && (
            <>
              <div className="data-item" onClick={() => setModal(true)}>
                <div className="data-col">
                  <span className="data-label">Personal Address</span>
                  <span className="data-value">
                    {userData?.personal_address?.address},
                    <br />
                    {userData?.personal_address?.state},{userData?.personal_address?.city},{" "}
                    {userData?.personal_address?.pin_code}
                  </span>
                </div>
                <div className="data-col data-col-end">
                  <span className="data-more">
                    <Icon name="forward-ios"></Icon>
                  </span>
                </div>
              </div>
              <div className="data-item" onClick={() => setModal(true)}>
                <div className="data-col">
                  <span className="data-label">Office Address</span>
                  <span className="data-value">
                    {userData?.office_address?.address},
                    <br />
                    {userData?.office_address?.state},{userData?.office_address?.city},{" "}
                    {userData?.office_address?.pin_code}
                  </span>
                </div>
                <div className="data-col data-col-end">
                  <span className="data-more">
                    <Icon name="forward-ios"></Icon>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </Block>

      <Modal isOpen={modal} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a
            href="#dropdownitem"
            onClick={(ev) => {
              ev.preventDefault();
              setModal(false);
              setFormData(userData);
              setModalTab("1");
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Update Profile</h5>
            <ul className="nk-nav nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${modalTab === "1" && "active"}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalTab("1");
                  }}
                  href="#personal"
                >
                  Personal
                </a>
              </li>
              {!showVaild(userInfo().role) && (
                <>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${modalTab === "2" && "active"}`}
                      onClick={(ev) => {
                        ev.preventDefault();
                        setModalTab("2");
                      }}
                      href="#address"
                    >
                      Address
                    </a>
                  </li>
                </>
              )}
            </ul>
            <div className="tab-content">
              <div className={`tab-pane ${modalTab === "1" ? "active" : ""}`} id="personal">
                <Row className="gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="full-name">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        id="full-name"
                        className="form-control"
                        name="name"
                        onChange={(e) => onInputChange(e)}
                        value={formData?.name}
                        placeholder="Enter Full name"
                      />
                      {formData?.name?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="phone-no">
                        Phone Number
                      </label>
                      <input
                        required
                        type="number"
                        id="phone-no"
                        className="form-control"
                        name="phone_number"
                        onChange={(e) => {
                          
                          if (e?.target?.value && e?.target?.value?.toString()?.length <= 10) {
                            onInputChange(e);
                          }
                        }}
                        value={formData?.phone_number}
                        placeholder="Phone Number"
                      />
                      {}
                      {formData?.phone_number?.toString()?.length !== 10 && vaild && (
                        <>
                          <p className="text-danger">Required min 10 digit</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="phone-no">
                       Gst Number
                      </label>
                      <input
                        required
                        type="text"
                        id="phone-no"
                        className="form-control"
                        name="gstNo"
                        onChange={(e) => {
                          
                       
                            onInputChange(e);
                         
                        }}
                        value={formData?.gstNo}
                        placeholder="Gst Number"
                      />
                      {}
                      {formData?.gstNo?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required </p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="phone-no">
                       Address
                      </label>
                      <input
                        required
                        type="text"
                        id="phone-no"
                        className="form-control"
                        name="address"
                        onChange={(e) => {
                          
                       
                            onInputChange(e);
                         
                        }}
                        value={formData?.address}
                        placeholder="Enter Address"
                      />
                      {}
                      {formData?.address?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required </p>
                        </>
                      )}
                    </FormGroup>
                  </Col>

                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button
                          color="primary"
                          size="lg"
                          onClick={(ev) => {
                            ev.preventDefault();
                            submitForm();
                          }}
                        >
                          Update Profile
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal(false);
                            setFormData(userData);
                            setModalTab("1");
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
              <div className={`tab-pane ${modalTab === "2" ? "active" : ""}`} id="address">
                <div className="h3_input">Address</div>
                <Row className="gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l1">
                        Address
                      </label>
                      <input
                        type="text"
                        required
                        id="address-l1"
                        name="address"
                        onChange={(e) => onInputChange(e, "personal_address")}
                        defaultValue={formData?.personal_address?.address}
                        className="form-control"
                      />
                      {formData?.personal_address?.address?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l2">
                        PinCode
                      </label>
                      <input
                        type="number"
                        required
                        name="pin_code"
                        value={formData?.personal_address?.pin_code}
                        onChange={(e) => onInputChange(e, "personal_address")}
                        className="form-control"
                      />
                      {formData?.personal_address?.pin_code?.toString().length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-st">
                        State
                      </label>
                      <select
                        className="form-select py-2 border border-gainsboro rounded"
                        required
                        value={selectedState}
                        name="state"
                        onChange={(e) => getCities(e.target.value, "personal_address")}
                      >
                        <option value="">Select State</option>
                        {stateList?.map((res, index) => (
                          <option key={index} value={JSON.stringify(res)}>
                            {res?.name}
                          </option>
                        ))}
                      </select>
                      {formData?.personal_address?.state?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-county">
                        City
                      </label>
                      <select
                        className="form-select py-2 w-100 border border-gainsboro rounded"
                        required
                        name="city"
                        value={formData?.personal_address?.city}
                        onChange={(e) => onInputChange(e, "personal_address")}
                      >
                        <option value="">Select City</option>
                        {perCityList?.map((res, index) => (
                          <option key={index} value={res?.name}>
                            {res?.name}
                          </option>
                        ))}
                      </select>
                      {formData?.personal_address?.city?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <div className="h3_input">Office Address</div>
                <div class=" form-check d-flex align-items-center mt-1">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    checked={sameAs}
                    id="flexCheckIndeterminate"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((pre) => {
                          return { ...pre, office_address: formData?.personal_address };
                        });

                        getCities(JSON.stringify(valuess(formData?.personal_address.state)), "office_address", true);
                      } else {
                        setFormData({
                          ...formData,
                          office_address: { address: "", state: "", city: "", pin_code: "" },
                        });
                        setSelectedStateoff("");
                      }
                      setSameAs(e.target.checked);
                    }}
                  />
                  <label class="form-check-label ml-2 h6" for="flexCheckIndeterminate">
                    Same as above
                  </label>
                </div>

                <Row className="gy-4 mt-2">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l1">
                        Address
                      </label>
                      <input
                        type="text"
                        required
                        id="address-l1"
                        name="address"
                        onChange={(e) => onInputChange(e, "office_address")}
                        value={formData?.office_address?.address}
                        className="form-control"
                      />
                      {formData?.office_address?.address?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l2">
                        PinCode
                      </label>
                      <input
                        type="number"
                        required
                        id="address-l2"
                        name="pin_code"
                        onChange={(e) => onInputChange(e, "office_address")}
                        value={formData?.office_address?.pin_code}
                        className="form-control"
                      />
                      {formData?.office_address?.pin_code?.toString().length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-st">
                        State
                      </label>
                      <select
                        className="form-select py-2 border border-gainsboro rounded"
                        required
                        name="state"
                        value={selectedStateOff}
                        onChange={(e) => getCities(e.target.value, "office_address")}
                      >
                        <option value="">Select State</option>
                        {stateList?.map((res, index) => (
                          <option key={index} value={JSON.stringify(res)}>
                            {res?.name}
                          </option>
                        ))}
                      </select>
                      {formData?.office_address?.state?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-county">
                        City
                      </label>
                      <select
                        className="form-select py-2 w-100 border border-gainsboro rounded"
                        required
                        name="city"
                        value={formData?.office_address?.city}
                        onChange={(e) => onInputChange(e, "office_address")}
                      >
                        <option value="">Select City</option>
                        {offCityList?.map((res, index) => (
                          <option key={index} value={res?.name}>
                            {res?.name}
                          </option>
                        ))}
                      </select>
                      {formData?.office_address?.city?.length === 0 && vaild && (
                        <>
                          <p className="text-danger">Required</p>
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="lg" onClick={() => submitForm()}>
                          Update Address
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal(false);
                            setFormData(userData);
                            setModalTab("1");
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default UserProfileRegularPage;
