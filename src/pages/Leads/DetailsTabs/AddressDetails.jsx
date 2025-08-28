import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FormGroup, Label } from "reactstrap";
import { City, Country, State } from "country-state-city";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { updateLeadsData } from "../../../service/admin";
import Loader from "../../../components/commonComponent/loader/Loader";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { userId, userInfo } from "../../../assets/userLoginInfo";

export default function AddressDetails({ getDataById, getdataLeads }) {
  const [disable, setDisable] = useState(true);
  const [initialData, setInitialData] = useState(null);

  let india = Country.getAllCountries().filter((e) => e.name === "India")[0];
  let stateList = State.getStatesOfCountry(india.isoCode);

  const [cityList, setCityList] = useState([]);
  const [cityList1, setCityList1] = useState([]);
  const [selectState, setSelectState] = useState(getDataById?.installation_address?.state);
  const [selectState1, setSelectState1] = useState(getDataById?.billing_address?.state);
  const [pinCodeData, setPinCodeData] = useState(getDataById?.installation_address?.pin_code);
  const [pinCodeData1, setPinCodeData1] = useState(getDataById?.billing_address?.pin_code);
  const [flatNumber, setFlatNumber] = useState(getDataById?.installation_address?.flat_number);
  const [flatNumber1, setFlatNumber1] = useState(getDataById?.billing_address?.flat_number);
  const [loader, setLoader] = useState(false);
  const [sameAs, setSameAs] = useState(false);

  const [selectCity, setSelectCity] = useState(getDataById?.installation_address?.city);
  const [selectCity1, setSelectCity1] = useState(getDataById?.billing_address?.city);
  const paramsData = useParams();

  useEffect(() => {
    setFlatNumber(getDataById?.installation_address?.flat_number);
    setPinCodeData(getDataById?.installation_address?.pin_code);
    setPinCodeData1(getDataById?.billing_address?.pin_code);
    setFlatNumber1(getDataById?.billing_address?.flat_number);
    setSelectCity(getDataById?.installation_address?.city);
    setSelectCity1(getDataById?.billing_address?.city);
    setSelectState1(getDataById?.billing_address?.state);
    setSelectState(getDataById?.installation_address?.state);
    setSameAs(getDataById?.sameAs);
    setInitialData(getDataById);
    if (getDataById.installation_address) {
      listCity(valuess(getDataById?.installation_address?.state));
    }
    if (getDataById.billing_address) {
      listCity1(valuess(getDataById?.billing_address?.state));
    }
  }, [getDataById]);

  const listCity = (state) => {
    let cities = City.getCitiesOfState(india?.isoCode, state?.isoCode);
    setCityList(cities);
  };

  const listCity1 = (state) => {
    let cities = City.getCitiesOfState(india?.isoCode, state?.isoCode);
    setCityList1(cities);
  };

  async function onSubmit(e) {
    e.preventDefault();
    let payloadData = {
      installation_address: {
        state: selectState,
        city: selectCity,
        pin_code: pinCodeData,
        flat_number: flatNumber,
      },
      billing_address: {
        state: selectState1,
        city: selectCity1,
        pin_code: pinCodeData1,
        flat_number: flatNumber1,
      },
      id: paramsData.id,
      sameAs: sameAs,
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId(),
    };

    setLoader(true);
    try {
      await updateLeadsData(payloadData);
      setLoader(false);
      getdataLeads();
      setDisable(true);
      setInitialData(payloadData);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  }

  function resetForm() {
    setFlatNumber(initialData.installation_address.flat_number);
    setPinCodeData(initialData.installation_address.pin_code);
    setPinCodeData1(initialData.billing_address.pin_code);
    setFlatNumber1(initialData.billing_address.flat_number);
    setSelectCity(initialData.installation_address.city);
    setSelectCity1(initialData.billing_address.city);
    setSelectState(initialData.installation_address.state);
    setSelectState1(initialData.billing_address.state);
    setSameAs(initialData.sameAs);
    listCity(valuess(initialData.installation_address.state));
    listCity1(valuess(initialData.billing_address.state));
  }

  function emptyData() {
    setSelectState1("");
    setSelectCity1("");
    setPinCodeData1("");
    setFlatNumber1("");
    setSameAs(false);
  }

  const valuess = (data) => {
    let asData = stateList.filter((e) => e.name === data)[0];
    return asData;
  };
  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <form onSubmit={onSubmit}>
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <div className="mr-3 fw-600 f-18">Address Details</div>
            {disable ? (
              <>
                {getDataById?.lead_status === "converted" ? (
                  <></>
                ) : (
                  <FaRegEdit className="f-20 text-primary pointer" onClick={() => setDisable(false)} />
                )}
              </>
            ) : (
              <IoCloseSharp className="f-20 text-primary pointer" onClick={() => {setDisable(true);resetForm()}} />
            )}
          </div>
          {disable ? (
            ""
          ) : (
            <button className="btn btn-sm btn-primary" type="submit">
              Save
            </button>
          )}
        </div>
        <div className="f-18 fw-500 mt-4">Installation Address</div>
        <hr />
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <lable className="form-label mb-1">House/ Flat No.</lable>
            <input
              className="form-control mt-1"
              placeholder="Enter Your House/ Flat No."
              value={flatNumber}
              disabled={disable}
              
              onChange={(e) => {setFlatNumber(e.target.value);emptyData()}}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <label className="form-label mb-1">State</label>

            <SingleSelect
              placeItem={"State"}
              disabled={disable}
              value={JSON.stringify(valuess(selectState))}
              options={stateList?.map((e) => {
                return { label: e.name, value: JSON.stringify(e) };
              })}
            
              onChange={(e) => {
                setSelectState(JSON.parse(e.target.value).name);
                listCity(JSON.parse(e.target.value));
                emptyData()
              }}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label mb-1">City</label>

            <SingleSelect
              placeItem={"city"}
              value={selectCity}
              options={cityList?.map((e) => {
                return { label: e.name, value: e.name };
              })}
              disabled={disable}
              onChange={(e)=>{setSelectCity(e.target.value);emptyData()}}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label mb-1">Pin Code</lable>
            <input
              className="form-control mt-1"
              placeholder="Enter your address pin code"
              value={pinCodeData}
              disabled={disable}
              onChange={(e)=>{setPinCodeData(e.target.value);emptyData()}}
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
              checked={sameAs}
              id="checkbox123"
              onChange={(e)=>{

                if(e.target.checked){
                  setPinCodeData1(pinCodeData);
                  setFlatNumber1(flatNumber);
                  setSelectCity1(selectCity);
                  setSelectState1(selectState);
                  listCity1(valuess(selectState));

                }else{
                  setPinCodeData1("");
                  setFlatNumber1("");
                  setSelectCity1();
                  setSelectState1();
                  setCityList1([])
                }
                setSameAs(e.target.checked)
              }}
              disabled={disable}

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
              placeholder="Enter Your House/ Flat No."
              disabled={disable}
              value={flatNumber1}
              onChange={(e)=>{setFlatNumber1(e.target.value);setSameAs(false)}}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-md-4 mt-sm-4 mt-3">
            <label className="form-label mb-1">State</label>

            <SingleSelect
              value={selectState1?JSON.stringify(valuess(selectState1)):""}
              options={stateList?.map((e) => {
                return { label: e.name, value: JSON.stringify(e) };
              })}
              placeItem={"State"}
              disabled={disable}
              onChange={(e) => {
                setSelectState1(JSON.parse(e.target.value).name);

                listCity1(JSON.parse(e.target.value));
                setSameAs(false)
              }}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <label className="form-label mb-1">City</label>

            <SingleSelect
              value={selectCity1}
              options={cityList1?.map((e) => {
                return { label: e.name, value: e.name };
              })}
              placeItem={"City"}
              disabled={disable}
              onChange={(e)=>{setSelectCity1(e.target.value);setSameAs(false)}}
            />
          </div>
          <div className="col-md-6 col-sm-6 col-12 mt-3">
            <lable className="form-label mb-1">Pin Code</lable>
            <input
              className="form-control mt-1"
              value={pinCodeData1}
              placeholder="Enter your address pin code"
              disabled={disable}
              onChange={(e)=>{setPinCodeData1(e.target.value);setSameAs(false)}}
            />
          </div>
        </div>
      </form>
    </>
  );
}
