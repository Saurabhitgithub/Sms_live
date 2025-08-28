import React, { useState } from "react";
import { FormGroup, Label } from "reactstrap";
import { City, Country, State } from "country-state-city";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";

export default function AddressDetails({ toggleTab, handleObjectInput, handleInput, formData, setFormData,handleState }) {
  let india = Country.getAllCountries().filter((e) => e.name === "India")[0];
  let stateList = State.getStatesOfCountry(india.isoCode);
  const [cityList, setCityList] = useState([]);
  const [cityList1, setCityList1] = useState([]);

  const [selectState, setSelectState] = useState("");
  const [selectState1, setSelectState1] = useState("");
  const [selectCity, setSelectCity] = useState("");
  const [selectCity1, setSelectCity1] = useState("");
  const [checkbox2, setCheckbox2] = useState(false);

  let a = {
    billing_address: {
      address_line1: "",
      address_line2: "",
      state: "",
      city: "",
      pin_code: "",
      flat_number: "",
    },
    installation_address: {
      address_line1: "",
      address_line2: "",
      state: "",
      city: "",
      pin_code: "",
      flat_number: "",
    },
  };
  const listCity = (state, key) => {
    let cities = City.getCitiesOfState(india?.isoCode, state?.isoCode);
    if (key) {

      handleState(state.name, "billing_address");
    }

    setCityList(cities);
  };
  const listCity1 = (state, key) => {
    // 
    if (key) {
      // handleObjectInput({ name: "state", value: state.name }, "billing_address");
      handleState(state.name, "installation_address");
    }
    let cities = City.getCitiesOfState(india?.isoCode, state?.isoCode);


    setCityList1(cities);
    // 
  };
  const valuess = (data) => {
    let asData = stateList.filter((e) => e.name === data)[0];
    // 
    return asData;
  };
  async function onSubmit(e) {
    e.preventDefault();

    toggleTab("3");
    
  }
  function copyDetails(e) {
    setCheckbox2(e.target.checked);
    setFormData((pre) => ({
      ...pre,
      sameAs: e.target.checked,
    }));
    if (e.target.checked) {
     
      let address = formData?.installation_address;
      setFormData((pre) => ({
        ...pre,
        billing_address: address,
      }));
      listCity(valuess(formData?.installation_address?.state, false));
      
    } else {
     
      setFormData((pre) => ({
        ...pre,
        billing_address: {
          state: "",
          city: "",
          pin_code: "",
          flat_number: "",
        },
      }));
    }

    
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="f-18 fw-500 mt-4">Installation Address</div>
        <hr />
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <lable className="form-label mb-1">House/ Flat No.</lable>

            <input
              className="form-control mt-1"
              placeholder="Enter House/ Flat No."
              name="flat_number"
              value={formData?.installation_address?.flat_number}
              onChange={(e) => handleObjectInput(e.target, "installation_address")}
              
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <label className="form-label mb-1">State</label>
            <SingleSelect
              options={stateList?.map((e) => {
                return { label: e.name, value: JSON.stringify(e) };
              })}
              placeItem={"State"}
              onChange={(e) => {
                setSelectState1(JSON.parse(e.target.value).name);

                listCity1(JSON.parse(e.target.value),true);
              }}
              name="state"
              value={JSON.stringify(valuess(formData?.installation_address?.state))}
              
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label mb-1">City</label>
            <SingleSelect
              options={cityList1?.map((e) => {
                return { label: e.name, value: e.name };
              })}
              placeItem={"City"}
              onChange={(e) => {
                setSelectCity1(e.target.value);
                handleObjectInput(e.target, "installation_address");
              }}
              name="city"
              value={formData?.installation_address?.city}
              
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label mb-1">Pin Code</lable>
            <input
              className="form-control mt-1"
              placeholder="Enter address pin code"
              name="pin_code"
              value={formData?.installation_address?.pin_code}
              onChange={(e) => handleObjectInput(e.target, "installation_address")}
              
            />
          </div>
        </div>
        <div className="f-18 fw-500 mt-4">Billing Address</div>
        <hr />
        <div className="check_box mt-4">
          <FormGroup check className="d-flex align-items-center">
            <input
              class="form-check-input input"
              type="checkbox"
              value=""
              id="checkbox123"
              checked={formData.sameAs}
              onChange={copyDetails}
              // onChange={copyAddress1}
            />
            <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
              Use Installation address as Billing address
            </Label>
          </FormGroup>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <lable className="form-label mb-1">House/ Flat No.</lable>
            <input
              className="form-control mt-1"
              placeholder="Enter House/ Flat No."
              name="flat_number"
              value={formData?.billing_address?.flat_number}
              onChange={(e) => {handleObjectInput(e.target, "billing_address");}}
              
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <label className="form-label mb-1">State</label>
            {/* <select className="form-control">
              <option value="">Select State</option>
            </select> */}
            <SingleSelect
              placeItem={"State"}
              options={stateList?.map((e) => {
                return { label: e.name, value: JSON.stringify(e) };
              })}
             
              value={JSON.stringify(valuess(formData?.billing_address?.state)) !== undefined ? JSON.stringify(valuess(formData?.billing_address?.state)):''}
              onChange={(e) => {
                setSelectState(JSON.parse(e.target.value).name);
                listCity(JSON.parse(e.target.value),true);
              
              }}
              name="state"
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label mb-1">City</label>
            <SingleSelect
              placeItem={"city"}
              options={cityList?.map((e) => {
                return { label: e.name, value: e.name };
              })}
              onChange={(e) => {
                setSelectCity(e.target.value);
                handleObjectInput(e.target, "billing_address");
                
              }}
              name="city"
              value={formData?.billing_address?.city}
              
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label mb-1">Pin Code</lable>
            <input
              className="form-control mt-1"
              placeholder="Enter address pin code"
              name="pin_code"
              value={formData?.billing_address?.pin_code}
              onChange={(e) => {handleObjectInput(e.target, "billing_address")}}
              
            />
          </div>
        </div>
        <div className="w-100 d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn text-primary mr-3"
            onClick={() => {
              toggleTab("1");
            }}
          >
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </>
  );
}
