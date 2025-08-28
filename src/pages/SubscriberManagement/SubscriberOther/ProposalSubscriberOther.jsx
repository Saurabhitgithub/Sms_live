import React, { useEffect, useState } from "react";
import Select from "react-dropdown-select";
import { FormGroup, Input, Label, Table } from "reactstrap";
import {
  getAllServices,
  getHsnandSacCode,
  getListofInventory,
  getListOfInventoryCategory,
  getPlanByCreator,
  nextSeq
} from "../../../service/admin";
import { userInfo } from "../../../assets/userLoginInfo";
import Loader from "../../../components/commonComponent/loader/Loader";
import { FiEdit } from "react-icons/fi";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import SubscriberProposalPreveiwOther from "./SubscriberProposalPreveiwOther";

export default function ProposalSubscriberOther({ planData, inventoryPermission, servicesPermission }) {
  const [checkPlan, setCheckPlan] = useState(false);
  const [checkInventery, setCheckInventery] = useState(false);
  const [checkService, setCheckService] = useState(false);
  const [disbalebyOneClick, setDisbalebyOneClick] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [addOptions, setAddOptions] = useState([]);

  const [isEdit, setIsEdit] = useState([]);
  const [allService, setAllService] = useState([]);
  const [selectedOptions2, setSelectedOptions2] = useState([]);
  const [isEdit1, setIsEdit1] = useState([]);
  const [filterDetail, setFilterDetail] = useState([]);

  const [selectCategory, setSelectCategory] = useState();
  const [connectType, setConnectType] = useState();
  const [allPlans, setAllPlans] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [formData, setFormData] = useState();
  const [open, setopen] = useState(false);
  const [invoceIds, setInvoiceIds] = useState("");
  const [planDiscount, setPlanDiscount] = useState(0);

  const seqId = async () => {
    let payloadData = { paid: "proposal" };
    try {
      const res = await nextSeq(payloadData).then(res => {
        return res.data.data;
      });
      setInvoiceIds(res);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllData = async () => {
    let data = await getPlanByCreator().then(res => {
      return res.data.data;
    });

    let AllPlan = data.map(resss => {
      resss.discount = 0;
      return resss;
    });

    setAllPlans(AllPlan);
    //
  };

  const filterDataplan = async (types, categorys) => {
    setFormData(pre => {
      return {
        ...pre,
        billing_type: categorys
      };
    });
    if (types && categorys) {
      let alldata = allPlans.filter(e => e.type === types && e.category === categorys);
      setFilterData(alldata);
      setFormData({ name: "plan", value: "" }, "current_plan");
      //
    }
  };

  useEffect(() => {
    getAllData();
    seqId();
  }, []);

  function addTaxesinPrice(price, cgst, sgst, serviceTax) {
    let amount = Number(price);

    if (cgst && cgst !== null) {
      amount = amount + Number(price) * (Number(cgst) / 100);
    }

    if (sgst && sgst !== null) {
      amount = amount + Number(price) * (Number(sgst) / 100);
    }

    if (serviceTax) {
      amount = amount + Number(price) * (Number(serviceTax) / 100);
    }
    return amount;
  }
  const getAllItem = async id => {
    setLoader(true);
    try {
      let res = await getListofInventory(id);

      let reverseData = res?.data?.data?.reverse();

      setAllItems(
        reverseData.map(es => {
          return {
            value: es._id,
            qty: 1,
            label: es.item_name,
            category: es.categories.category_name,
            price: es.item_price,
            priceWithtax: addTaxesinPrice(es.item_price, es.categories?.cgst, es.categories?.scgst),

            total: es.item_price,
            discount: 0,
            cgst: es.categories?.cgst,
            sgst: es.categories?.scgst,
            totalWithTax: addTaxesinPrice(es.item_price, es.categories?.cgst, es.categories?.scgst)
          };
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const getAllCategory = async () => {
    setLoader(true);
    try {
      let orGId = userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id;
      let res = await getListOfInventoryCategory(orGId);

      let reverseData = res?.data?.data?.reverse();
      setAllCategory(reverseData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const getAllServicesData = async () => {
    setLoader(true);

    await getAllServices()
      .then(res => {
        let reverseData = [...res.data.data];
        let dataReverse = reverseData.reverse();
        setAllService(
          dataReverse.map(es => {
            return {
              value: es._id,
              qty: 1,
              label: es.service_name,
              price: es.cost,
              total: es.cost,
              discount: 0,
              cgst: es?.cgst,
              sgst: es?.sgst,
              priceWithtax: addTaxesinPrice(es.cost, es?.cgst, es.sgst),
              totalWithTax: addTaxesinPrice(es.cost, es?.cgst, es.sgst)
            };
          })
        );
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
      });
    setLoader(false);
  };

  function qtySection(data, index) {
    function addOne() {
      let arr = [...addOptions];
      arr[index].qty = arr[index].qty + 1;
      setAddOptions(arr);
    }

    function removeOne() {
      if (data > 0) {
        let arr = [...addOptions];

        arr[index].qty = arr[index].qty - 1;
        setAddOptions(arr);
      }
    }

    return (
      <>
        <div className="d-flex align-items-center">
          {isEdit.includes(index) && (
            <>
              <button className="btn border p-2 fw-600 text-primary" onClick={removeOne}>
                -
              </button>
            </>
          )}
          <div className="px-3">{data}</div>
          {isEdit.includes(index) && (
            <>
              <button className="btn border p-2 fw-600 text-primary" onClick={addOne}>
                +
              </button>
            </>
          )}
        </div>
      </>
    );
  }

  function qtySection2(data, index) {
    function addOne() {
      let arr = [...selectedOptions2];
      arr[index].qty = arr[index].qty + 1;
      setSelectedOptions2(arr);
    }

    function removeOne() {
      if (data > 0) {
        let arr = [...selectedOptions2];
        arr[index].qty = arr[index].qty - 1;
        setSelectedOptions2(arr);
      }
    }

    return (
      <>
        <div className="d-flex align-items-center">
          {isEdit1.includes(index) && (
            <>
              <button className="btn border p-2 fw-600 text-primary" onClick={removeOne}>
                -
              </button>
            </>
          )}
          <div className="px-3">{data}</div>
          {isEdit1.includes(index) && (
            <>
              <button className="btn border p-2 fw-600 text-primary" onClick={addOne}>
                +
              </button>
            </>
          )}
        </div>
      </>
    );
  }
  const getTotalAmount = () => {
    let totalAmount = 0;
    if (selectedOptions2.length !== 0 && checkService) {
      selectedOptions2.forEach(es => {
        totalAmount = totalAmount + Number(es.total);
      });
    }
    if (addOptions.length !== 0 && checkInventery) {
      addOptions.forEach(es => {
        totalAmount = totalAmount + Number(es.total);
      });
    }
    if (formData?.plan_name && checkPlan) {
      totalAmount =
        totalAmount + (Number(formData?.amount) - (Number(formData?.amount) / 100) * Number(formData?.discount));
    }

    return totalAmount;
  };

  const [hsndata, setHsnData] = useState();
  const getHsnCode = async () => {
    await getHsnandSacCode()
      .then(res => {
        let dataitem = [...res.data.data];
        let filterData = dataitem.filter(e => e.item === "internet service");

        setHsnData(filterData.length !== 0 ? filterData[0] : {});
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllCategory();
    getAllServicesData();
    getHsnCode();
  }, []);
  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}

      <SubscriberProposalPreveiwOther
        open={open}
        toggle={() => setopen(!open)}
        serviceInfo={selectedOptions2}
        inventeryInfo={addOptions}
        formData={formData}
        checkInventery={checkInventery}
        checkPlan={checkPlan}
        checkService={checkService}
        getTotalAmount={getTotalAmount}
        invoceIds={invoceIds}
        setInvoiceIds={setInvoiceIds}
        addTaxesinPrice={addTaxesinPrice}
        planData={planData}
        hsndata={hsndata}
        setLoader={setLoader}
        setDisbalebyOneClick={setDisbalebyOneClick}
        disbalebyOneClick={disbalebyOneClick}
      />
      <div className="d-flex justify-content-between mt-3">
        <div className="d-flex">
          <div className="check_box">
            {/* <FormGroup check className="d-flex align-items-center">
              <input
                class="form-check-input input"
                type="checkbox"
                value=""
                id="checkbox123"
                onChange={e => {
                  setCheckPlan(e.target.checked);
                  setDisbalebyOneClick(false);
                }}
              />
              <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                Plan
              </Label>
            </FormGroup> */}
          </div>
          {inventoryPermission && (
            <div className="check_box ml-3">
              <FormGroup check className="d-flex align-items-center">
                <input
                  class="form-check-input input"
                  type="checkbox"
                  value=""
                  id="checkbox123"
                  onChange={e => {
                    setCheckInventery(e.target.checked);
                    setDisbalebyOneClick(false);
                  }}
                />
                <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                  Inventory
                </Label>
              </FormGroup>
            </div>
          )}
          {servicesPermission && (
            <div className="check_box ml-3">
              <FormGroup check className="d-flex align-items-center">
                <input
                  class="form-check-input input"
                  type="checkbox"
                  value=""
                  id="checkbox123"
                  onChange={e => {
                    setCheckService(e.target.checked);
                    setDisbalebyOneClick(false);
                  }}
                />
                <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                  Services
                </Label>
              </FormGroup>
            </div>
          )}
        </div>
      </div>
      {checkPlan && (
        <>
          <div className="fw-500 f-18 mt-2">Connection Type</div>
          <hr />
          <div className="row ">
            <div className="col-md-6 mt-3">
              <Label>Connection Category</Label>
              <select
                className="form-control"
                value={selectCategory}
                onChange={e => {
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
            <div className="col-md-6 mt-3">
              <Label>Connection Type</Label>
              <select
                className="form-control"
                value={connectType}
                onChange={e => {
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
            <div className="col-md-6 mt-3">
              <Label>Plan Name</Label>
              <SingleSelect
                placeItem="Plan"
                value={formData?.current_plan?.plan}
                name="plan"
                options={filterData.map(e => {
                  return { value: e._id, label: e.plan_name };
                })}
                onChange={e => {
                  const selectedPlanId = e.target.value;
                  const selectedPlan = filterData.find(plan => plan._id === selectedPlanId); // Find the current plan
                  setFormData(selectedPlan, "current_plan"); // Update formData with the full plan object
                  // Log the selected plan object
                }}
              />
            </div>
            <div className="col-md-6 mt-3">
              <Label>Plan Discount (%)</Label>
              <input
                type="number"
                className="form-control"
                value={planDiscount}
                onChange={e => {
                  if (e?.target?.value?.length <= 2) {
                    let info = formData;
                    info.discount = e.target.value;
                    setPlanDiscount(e.target.value);
                    setFormData(info);
                    setDisbalebyOneClick(false);
                  }
                }}
              />
            </div>
          </div>

          <div className="fw-600 f-20 mt-4">Plan Details</div>
          <hr />
          <div className="row">
            <div className="col-md-4 mt-3">
              <Label>Plan Name</Label>
              <Input disabled value={formData?.plan_name} />
            </div>
            <div className="col-md-4 mt-3">
              <Label>Plan Rate</Label>
              <Input disabled value={formData?.amount} />
            </div>

            <div className="col-md-6 mt-3">
              <Label>Billing Cycle</Label>
              <Input disabled value={formData?.billingCycleDate} />
            </div>
            <div className="col-md-6 mt-3">
              <Label>&nbsp;</Label>
              <Input disabled value={formData?.billingCycleType} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mt-3">
              <Label>Download Speed</Label>
              <div className="row">
                <div className="col-6">
                  <Input disabled value={formData?.bandwidth_info?.max_download?.speed} />
                </div>
                <div className="col-6">
                  <Input disabled value={formData?.bandwidth_info?.max_download?.unit} />
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <Label>Upload Speed</Label>
              <div className="row">
                <div className="col-6">
                  <Input disabled value={formData?.bandwidth_info?.max_upload?.speed} />
                </div>
                <div className="col-6">
                  <Input disabled value={formData?.bandwidth_info?.max_upload?.unit} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {checkInventery && (
        <>
          <div className="fw-600 f-18 mt-4">Add Inventory</div>
          <div className="w-100">
            <div className="row">
              <div className="col-md-6">
                <Label>Category</Label>

                <select
                  className="form-control"
                  onChange={e => {
                    getAllItem(e.target.value);
                  }}
                >
                  <option value={""}>Select Category</option>
                  {allCategory.map(ss => (
                    <>
                      <option value={ss._id} className="text-capitalize">
                        {ss.category_name}
                      </option>
                    </>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <Label>Item</Label>

                <Select
                  options={allItems}
                  className="text-capitalize"
                  onChange={values => setSelectedOptions(values)}
                  values={selectedOptions}
                  multi
                />
              </div>
              <div className="d-flex justify-content-end w-100 mt-3 mr-3">
                <button
                  className="btn border"
                  onClick={() => {
                    if (selectedOptions.length !== 0) {
                      setAddOptions(prop => [...selectedOptions, ...prop]);
                      // setSelectCategory([]);
                      setSelectedOptions([]);
                      // setSelectCategory();
                      setDisbalebyOneClick(false);
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="mt-3">
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>

                    <th>Quantity</th>
                    <th>Discount %</th>
                    <th>TOTAL</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {addOptions?.map((res, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-capitalize">{res?.label}</td>
                          <td>{res?.category}</td>
                          <td>{res?.price}</td>
                          {/* <td></td>
                      <td></td> */}
                          <td>{qtySection(res?.qty, index)}</td>
                          <td>
                            {}
                            {isEdit.includes(index) ? (
                              <>
                                {" "}
                                <input
                                  type="number"
                                  defaultValue={res.discount}
                                  onChange={e => {
                                    if (e?.target?.value?.length <= 2) {
                                      let info = [...addOptions];
                                      info[index].discount = e.target.value;

                                      setAddOptions(info);
                                    }
                                  }}
                                ></input>
                                %
                              </>
                            ) : (
                              <>{res?.discount}%</>
                            )}
                          </td>
                          <td>{res?.total}</td>
                          <td>
                            {" "}
                            {isEdit.includes(index) ? (
                              <>
                                <button
                                  className="btn border"
                                  onClick={() => {
                                    let info = [...addOptions];
                                    info[index].total =
                                      Number(info[index].price) * info[index].qty -
                                      (Number(info[index].price) / 100) * Number(info[index].discount);

                                    info[index].totalWithTax =
                                      Number(info[index].priceWithtax) * info[index].qty -
                                      (Number(info[index].price) / 100) * Number(info[index].discount);
                                    setAddOptions(info);
                                    setIsEdit(isEdit.filter(se => se !== index));
                                    setDisbalebyOneClick(false);
                                  }}
                                >
                                  Save
                                </button>
                              </>
                            ) : (
                              <>
                                <FiEdit
                                  className="f-20 pointer parimary-color mr-2"
                                  color="#0E1073"
                                  onClick={() => setIsEdit(prop => [...prop, index])}
                                />
                              </>
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}
      {checkService && (
        <>
          <div className="fw-600 f-18 mt-4">Add Services</div>
          <div className="w-100 mt-3">
            <div className="row">
              <div className="col-md-12">
                <Label>Select Service</Label>

                <Select
                  options={allService}
                  onChange={values => {
                    setSelectedOptions2(values);
                    setDisbalebyOneClick(false);
                  }}
                  values={selectedOptions2}
                  className="text-capitalize"
                  multi
                />
              </div>
            </div>
            <div className="mt-3">
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Item</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Discount %</th>
                    <th>TOTAL</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOptions2?.map((res, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{res?.label}</td>

                          <td>{res?.price}</td>
                          {/* <td></td>
                      <td></td> */}
                          <td>
                            <div className="d-flex align-items-center">
                              {qtySection2(res?.qty, index)} <div className="ml-2">Months</div>
                            </div>
                          </td>
                          <td>
                            {}
                            {isEdit1.includes(index) ? (
                              <>
                                {" "}
                                <input
                                  type="number"
                                  defaultValue={res.discount}
                                  onChange={e => {
                                    if (e?.target?.value?.length <= 2) {
                                      let info = [...selectedOptions2];
                                      info[index].discount = e.target.value;

                                      setSelectedOptions2(info);
                                    }
                                  }}
                                ></input>
                                %
                              </>
                            ) : (
                              <>{res?.discount}%</>
                            )}
                          </td>
                          <td>{res?.total}</td>

                          <td>
                            {" "}
                            {isEdit1.includes(index) ? (
                              <>
                                <button
                                  className="btn border"
                                  onClick={() => {
                                    let info = [...selectedOptions2];
                                    info[index].total =
                                      Number(info[index].price) -
                                      (Number(info[index].price) / 100) * Number(info[index].discount);
                                    info[index].totalWithTax =
                                      Number(info[index].priceWithtax) * info[index].qty -
                                      (Number(info[index].price) / 100) * Number(info[index].discount);
                                    setSelectedOptions2(info);
                                    setIsEdit1(isEdit1.filter(se => se !== index));
                                    setDisbalebyOneClick(false);
                                  }}
                                >
                                  Save
                                </button>
                              </>
                            ) : (
                              <>
                                <FiEdit
                                  className="f-20 pointer parimary-color mr-2"
                                  color="#0E1073"
                                  onClick={() => setIsEdit1(prop => [...prop, index])}
                                />
                              </>
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}
      {(checkInventery || checkPlan || checkService) && (
        <>
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setopen(true);
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </>
  );
}
