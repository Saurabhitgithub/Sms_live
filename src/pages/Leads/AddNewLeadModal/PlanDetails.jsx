import React, { useEffect, useState } from "react";
import { getPlanByCreator } from "../../../service/admin";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { userInfo } from "../../../assets/userLoginInfo";

export default function PlanDetails({ toggleTab, handleObjectInput, handleInput, formData, setFormData }) {
  const [selectCategory, setSelectCategory] = useState();
  const [connectType, setConnectType] = useState();
  const [allPlans, setAllPlans] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const getAllData = async () => {
    let data = await getPlanByCreator().then(
      (res) => {
        return res.data.data;
      }
    );

    let AllPlan = data;
    setAllPlans(AllPlan);
    // 
  };
  const filterDataplan = async (types, categorys) => {
    setFormData((pre) => {
      return {
        ...pre,
        billing_type: categorys,
      };
    });
    if (types && categorys) {
      let alldata = allPlans.filter((e) => e.type === types && e.category === categorys);
      setFilterData(alldata);
      handleObjectInput({ name: "plan", value: "" }, "current_plan");
      // 
    }
  };

  useEffect(() => {
    getAllData();
  }, []);
  async function onSubmit(e) {
    e.preventDefault();
    toggleTab("4");
    // 
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="f-18 fw-500 mt-4">Connection Type</div>
        <hr />
        <div className="row mt-4">
          <div className="col-md-6 col-sm-6 col-12">
            <label className="form-label mb-1">Connection Category</label>
            <select
              className="form-control"
              value={selectCategory}
              onChange={(e) => {
                setSelectCategory(e.target.value);
                filterDataplan(connectType, e.target.value);
              }}
            >
              <option value="" selected disabled>
                Select Category
              </option>
              <option value="prepaid">Prepaid</option>
              <option value="postpaid">Postpaid</option>
            </select>
          </div>
          <div className="col-md-6 col-sm-6 col-12">
            <label className="form-label mb-1">Connection Type</label>
            <select
              className="form-control"
              value={connectType}
              onChange={(e) => {
                setConnectType(e.target.value);
                filterDataplan(e.target.value, selectCategory);
              }}
            >
              <option value="" selected disabled>
                Select Type
              </option>
              <option value="unlimited">Unlimited</option>
              <option value="data">Data</option>
            </select>
          </div>
        </div>
        <div className="f-18 fw-500 mt-4">Plan Details</div>
        <hr />
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12">
            <label className="form-label mb-1">Plan Name</label>
            <SingleSelect
              placeItem="Plan"
              value={formData?.current_plan?.plan}
              name="plan"
              options={filterData.map((e) => {
                return { value: e._id, label: e.plan_name };
              })}
              onChange={(e) => handleObjectInput(e.target, "current_plan")}
            />
          </div>
        </div>
        <div className="w-100 d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn text-primary mr-3"
            onClick={() => {
              toggleTab("2");
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
