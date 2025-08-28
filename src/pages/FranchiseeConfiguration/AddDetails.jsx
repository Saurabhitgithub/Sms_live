import React, { useEffect, useState } from "react";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { FormGroup, Label } from "reactstrap";
import { City, Country, State } from "country-state-city";
import { emailAndNumberCheck } from "../../service/admin";
import { error } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";


export default function AddDetails({ toggleTab, open, setOpen, mode, setFormData, formData, handleInput }) {
  let india = Country.getAllCountries().filter(e => e.name === "India")[0];
  const [BACity, setBACities] = useState([]);
  const [IACity, setIACities] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [editCity, setEditCity] = useState();

  const [checkbox1, setCheckbox1] = useState(false);
  const [BAState, setBAState] = useState("");
  const [IAState, setIAState] = useState("");
  const dispatch = useDispatch();
  const [num, setNum] = useState("");
  const [valid, setValid] = useState(false);



  const listState = () => {
    let states = State.getStatesOfCountry(india.isoCode);
    setStateList(states);
    return states;
  };

  function getCities(state, key) {
    const obj = state?JSON?.parse(state):state;
    setCheckbox1(false);
    let cities = City.getCitiesOfState(india.isoCode, obj.isoCode);

    if (key === "commercialAddress") {
      setBAState(state);
      let newObj3 = { ...formData.commercialAddress, state: obj?.name, city: "" };
      setFormData(pre => {
        return {
          ...pre,
          commercialAddress: newObj3
        };
      });
      setBACities(cities);
    } else {
      setIAState(state);
      let newObj4 = { ...formData.billingAddress, state: obj?.name, city: "" };
      setFormData(pre => {
        return {
          ...pre,
          billingAddress: newObj4
        };
      });
      setIACities(cities);
    }
  }
  function setStateCity() {
    let statesData = listState().filter(e => e.name === formData.billingAddress.state)[0];
    let statesData2 = listState().filter(e => e.name === formData.commercialAddress.state)[0];
    getCities(JSON.stringify(statesData), "billingAddress");
    getCities(JSON.stringify(statesData), "commercialAddress");

    setEditCity({ billCity: formData.billingAddress.city, commCity: formData.commercialAddress.state });
  }
  function copyAddress1(check) {
    setCheckbox1(check);

    if (check) {
      setIACities(BACity);
      setIAState(BAState);
      let address = formData.commercialAddress;
      setFormData(pre => {
        return {
          ...pre,
          billingAddress: address
        };
      });
    } else {
      setIACities([]);
      setIAState("");
      setFormData(pre => {
        return {
          ...pre,
          billingAddress: {
            address_line: "",
            state: "",
            city: "",
            pin_code: ""
          }
        };
      });
    }
  }
  useEffect(() => {
    listState();

    if (mode === "edit") {
      setStateCity();
    }
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (num.length === 10 || formData?.mobileNumber?.length === 10) {

      let payloadData = {
        mobile_number: formData.mobile_number,
        email: formData?.email,
      };
      toggleTab("1");
      // await emailAndNumberCheck(payloadData)
      // .then((res) => {
        
      //   toggleTab("1");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     if(err.response.data.errormessage.includes("Phone number already exists.")){
      //       dispatch(error({
      //           show: true,
      //           msg: "This Mobile Number alreday exist.",
      //           severity: "error",
      //         })
      //       );
      //       // setLoader(false)
      //     }else if(err.response.data.errormessage.includes("Email already exists.")){
      //       dispatch(error({
      //           show: true,
      //           msg: "This email alreday exist.",
      //           severity: "error",
      //         })
      //       );
      //       // setLoader(false)
      //     }
      //   });
    }else{
      setValid(true);

    }
    
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="f-18 fw-500">Personal Details</div>
        <hr />
        <div className="row mt-3">
          <div className="col-md-12">
            <label>Franchisee Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              required
              value={formData?.name}
              onChange={e => handleInput(e.target)}
              placeholder="Enter Franchisee Name"
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12 ">
            <label>LCO Name</label>
            <input
              className="form-control"
              type="text"
              name="lcoName"
              required
              value={formData?.lcoName}
              onChange={e => {
                handleInput(e.target);
              }}
              placeholder="Enter LCO Name"
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>Email (POC)</label>
            <input
              className="form-control"
              name="email"
              value={formData?.email}
              required
              onChange={e => {
                handleInput(e.target);
              }}
              type="email"
              placeholder="Enter POC Email"
            />
          </div>
          <div className="col-md-6">
            <label>Phone No. (POC)</label>
            <input
              className="form-control"
              type="number"
              name="mobileNumber"
              required
              value={formData?.mobileNumber}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                handleInput(e.target);
                setNum(e.target.value);

                }
              }}
              placeholder="Enter POC Phone No."
            />
            {valid && formData?.mobileNumber!== 10  && (
              <>
                <p className="text-danger">Please enter 10 digit number</p>
              </>
            )}
          </div>
        </div>
        <div className="f-18 fw-500 mt-4">Office Address</div>
        <hr />
        <div className="row mt-3">
          <div className="col-md-6">
            <label>House/Flat No.</label>
            <input
              className="form-control"
              type="text"
              placeholder="House/Flat No."
              required
              name="address_line"
              value={formData?.commercialAddress?.address_line}
              onChange={e => {
                handleInput(e.target, "commercialAddress");
                copyAddress1(false);
              }}
            />
          </div>
          <div className="col-md-6">
            <label>State</label>
            <SingleSelect
              placeItem={"State"}
              value={BAState}
              name="state"
              required
              options={stateList?.map(e => {
                return { label: e.name, value: JSON.stringify(e) };
              })}
              onChange={e => {
                getCities(e.target.value, "commercialAddress");
                copyAddress1(false);
              }}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>City</label>
            {/* {}
            <SingleSelect
              placeItem={"City"}
              options={BACity?.map((e) => {
                return { label: e.name, value: e.name };
              })}
              required
              value={formData?.commercialAddress?.city}
              name="city"
              onChange={(e) => {
                handleInput(e.target, 
              }}
            /> */}
            <SingleSelect
              placeItem={"City"}
              options={BACity?.map(e => {
                return { label: e.name, value: e.name };
              })}
              required
              value={editCity ? editCity.commCity : formData?.commercialAddress?.city}
              name="city"
              onChange={e => {
                handleInput(e.target, "commercialAddress");
                setEditCity(pre => ({ billCity: pre?.billCity, commCity: e.target.value }));
                copyAddress1(false);
              }}
            />
          </div>
          <div className="col-md-6">
            <label>Pin Code</label>
            <input
              className="form-control"
              type="number"
              placeholder="Enter Pin Code"
              name="pinCode"
              value={formData?.commercialAddress?.pinCode}
              onChange={e => {
                handleInput(e.target, "commercialAddress");
                copyAddress1(false);
              }}
            />
          </div>
        </div>
        <div className="f-18 fw-500 mt-4">Billing Address</div>
        <hr />
        <div className="check_box mt-3">
          <FormGroup check className="d-flex align-items-center">
            <input
              class="form-check-input input"
              type="checkbox"
              checked={checkbox1}
              onChange={e => copyAddress1(e.target.checked)}
              id="checkbox123"
            />
            <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
              Use Installation address as Billing address
            </Label>
          </FormGroup>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>House/Flat No.</label>
            <input
              className="form-control"
              name="address_line"
              value={formData?.billingAddress?.address_line}
              onChange={e => {
                handleInput(e.target, "billingAddress");
              }}
              type="text"
              placeholder="House/Flat No."
              disabled={checkbox1}
            />
          </div>
          <div className="col-md-6">
            <label>State</label>
            {/* <SingleSelect
              placeItem={"State"}
              options={stateList?.map((e) => {
                return { label: e.name, value: JSON.stringify(e) };
              })}
              name="state"
              value={IAState}
              onChange={(e) => getCities(e.target, "billingAddress")}
            /> */}
            <SingleSelect
              placeItem={"State"}
              options={stateList?.map(e => {
                return { label: e.name, value: JSON.stringify(e) };
              })}
              name="state"
              value={IAState}
              onChange={e => getCities(e.target.value, "billingAddress")}
              disabled={checkbox1}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>City</label>
            <SingleSelect
              placeItem={"City"}
              options={IACity?.map(e => {
                return { label: e.name, value: e.name };
              })}
              name="city"
              value={editCity?.billCity ? editCity?.billCity : formData?.billingAddress?.city}
              onChange={e => {
                setCheckbox1(false);
                handleInput(e.target, "billingAddress");
                setEditCity(pre => ({ commCity: pre.commCity, billCity: e.target.value }));
              }}
              disabled={checkbox1}
            />
          </div>
          <div className="col-md-6">
            {}

            <label>Pin Code</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter Pin Code"
              name="pinCode"
              value={formData?.billingAddress?.pinCode ? formData?.billingAddress?.pinCode : ""}
              onChange={e => {
                handleInput(e.target, "billingAddress");
              }}
              disabled={checkbox1}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <div className="d-flex">
            <button
              type="button"
              className="btn text-primary mr-3"
              onClick={() => {
                setOpen({ mode: "", status: false, data: {} });
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Next
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
