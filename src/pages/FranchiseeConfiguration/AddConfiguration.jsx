import React from "react";
import { FiPercent } from "react-icons/fi";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { FormGroup, Label } from "reactstrap";
import { RSelect } from "../../components/Component";

export default function AddConfiguration({
  toggleTab,
  open,
  setOpen,
  mode,
  setFormData,
  formData,
  handleInput,
  handlePaymentType,
  allPlanData,
}) {
  function onSubmit(e) {
    e.preventDefault();
    toggleTab("2");
  }

    const selectAllOption = { value: "*", label: "Select All" };
const planOptions = [selectAllOption, ...allPlanData.map((es) => ({
  value: es._id,
  label: es.plan_name,
}))];

const selectedPlans =
  formData?.assignsPlan?.length === allPlanData.length
    ? [selectAllOption, ...allPlanData.map((es) => ({
        value: es._id,
        label: es.plan_name,
      }))]
    : formData?.assignsPlan?.map((res) => {
        const data = allPlanData.find((es) => es._id === res);
        return { value: res, label: data?.plan_name };
      });
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="row mt-3">
          <div className="col-md-6 percent_Icon_Set_main">
            <label>Revenue Sharing</label>
            <input
              className="form-control"
              type="number"
              required
              name="revenueShare"
              value={formData?.revenueShare}
              onChange={(e) => {
                handleInput(e.target);
              }}
              placeholder="Enter Revenue in Percentage"
            />
            <FiPercent className="percent_Icon_Set_child3" />
          </div>
          {/* <div className="col-md-6 percent_Icon_Set_main">
            <label>Revenue Tax</label>
            <input
              className="form-control"
              type="number"
              required
              name="revenueShare"
              value={formData?.revenueShare}
              onChange={(e) => {
                handleInput(e.target);
              }}
              placeholder="Enter Revenue Tax in Percentage"
            />
            <FiPercent className="percent_Icon_Set_child3" />
          </div> */}
          {/* <div className="col-md-6">
          <label>Plans</label>
          <SingleSelect placeItem={"Subcription Plans to Add"} />
        </div> */}
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>Plans</label>
            {/* <RSelect
              options={allPlanData.map((es) => {
                return { value: es._id, label: es.plan_name };
              })}
              value={formData?.assignsPlan?.map((res) => {
                let data = allPlanData?.find((es) => es?._id === res);
                return { value: res, label: data?.plan_name };
              })}
              placeholder="Select Plan"
              onChange={(e) => {
           
                setFormData({ ...formData, assignsPlan: e.map((es) => es.value) });
              }}
              isMulti
            /> */}
                        <RSelect
  options={planOptions}
  value={selectedPlans}
  placeholder="Select Plan"
 onChange={(selectedOptions) => {
  if (!selectedOptions || selectedOptions.length === 0) {
    // Clear all
    setFormData({ ...formData, assignsPlan: [] });
    return;
  }

  const isSelectAllSelected = selectedOptions.some((opt) => opt.value === "*");
  const allPlanIds = allPlanData.map((plan) => plan._id);

  // CASE 1: User just selected "Select All"
  if (isSelectAllSelected && selectedOptions.length === 1) {
    setFormData({ ...formData, assignsPlan: allPlanIds });
    return;
  }

  // CASE 2: All options (except "Select All") are selected
  const selectedWithoutAll = selectedOptions.filter((opt) => opt.value !== "*");
  const selectedIds = selectedWithoutAll.map((opt) => opt.value);

  setFormData({ ...formData, assignsPlan: selectedIds });
}}
  isMulti
/>
          </div>
        </div>
        <div className="f-18 fw-500 mt-3">More Settings</div>
        <hr />
        <div className="check_box mt-3">
          <FormGroup check className="d-flex align-items-center">
            <input
              class="form-check-input input"
              type="checkbox"
              defaultChecked={formData?.allowLimitAddition}
              onChange={(e) => {
                handleInput({ value: e.target.checked, name: "allowLimitAddition" }, "allowLimitAddition");
              }}
              id="checkbox123"
            />
            <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
              Allow Franchisee to Add Limit
            </Label>
          </FormGroup>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 percent_Icon_Set_main">
            <label>Tax %</label>
            <input
              className="form-control"
              type="number"
              name="taxPercentage"
              required
              value={formData?.taxPercentage}
              onChange={(e) => {
                handleInput(e.target);
              }}
              placeholder="Enter Tax in Percentage"
            />
            <FiPercent className="percent_Icon_Set_child3" />
          </div>
          <div className="col-md-6 percent_Icon_Set_main">
            <label>TDS</label>
            <input
              className="form-control"
              type="number"
              name="tdsPercentage"
              required
              value={formData?.tdsPercentage}
              onChange={(e) => {
                handleInput(e.target);
              }}
              placeholder="Enter TDS in Percentage"
            />
            <FiPercent className="percent_Icon_Set_child3" />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 ">
            <label>Minimum Add Limit Amount</label>
            <input
              className="form-control"
              type="number"
              name="minLimitAmount"
              required
              value={formData?.minLimitAmount}
              onChange={(e) => {
                handleInput(e.target);
              }}
              placeholder="Enter Minimum Add Limit Amount"
            />
          </div>
          <div className="col-md-6 ">
            <label>Maximum Credit Limit Amount</label>
            <input
              className="form-control"
              type="number"
              required
              placeholder="Enter Maximum Credit Limit Amount"
              name="maxCreditLimit"
              value={formData?.maxCreditLimit}
              onChange={(e) => {
                handleInput(e.target);
              }}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>Payment Method</label>
            <input type="text" className="form-control" disabled value={formData?.paymentType?.join(",")} />
          </div>
          <div className="col-md-6 row ">
            <div className="col-md-2">
              <div className="check_box">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    id="checkbox123"
                    checked={formData?.paymentType?.includes("cash")}
                    onClick={(e) => handlePaymentType("cash", e.target.checked)}
                  />

                  <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                    Cash
                  </Label>
                </FormGroup>
              </div>
            </div>
            <div className="col-md-2">
              <div className="check_box">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    id="checkbox123"
                    checked={formData?.paymentType?.includes("card")}
                    onClick={(e) => handlePaymentType("card", e.target.checked)}
                  />
                  <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                    Card
                  </Label>
                </FormGroup>
              </div>
            </div>
            <div className="col-md-2">
              <div className="check_box">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    id="checkbox123"
                    checked={formData?.paymentType?.includes("upi")}
                    onClick={(e) => handlePaymentType("upi", e.target.checked)}
                  />
                  <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                    UPI
                  </Label>
                </FormGroup>
              </div>
            </div>
            <div className="col-md-4">
              <div className="check_box">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    id="checkbox123"
                    checked={formData?.paymentType?.includes("internet banking")}
                    onClick={(e) => handlePaymentType("internet banking", e.target.checked)}
                  />
                  <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                    Internet Banking
                  </Label>
                </FormGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <div className="d-flex">
            <button
              type="button"
              className="btn text-primary mr-3"
              onClick={() => {
                toggleTab("0");
              }}
            >
              Back
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
