import React, { useEffect, useRef, useState } from "react";
import Select from "react-dropdown-select";
import { FormGroup, Input, Label, Table } from "reactstrap";
import InvoicePreview from "./InvoicePreview";
import { FiEdit } from "react-icons/fi";
import {
  getAllServices,
  getAllSubscriber,
  getHsnandSacCode,
  getListofInventory,
  getListOfInventoryCategory,
  getPlanByCreator,
  getTemplateData,
  nextSeq,
  updateLeadsData,
  getInvoiceDataBYId,
  updateInvoiceById
} from "../../service/admin";
import { userInfo, userId, permisionsTab } from "../../assets/userLoginInfo";
import Loader from "../../components/commonComponent/loader/Loader";
import Content from "../../layout/content/Content";
import SearchableDropdown from "../../AppComponents/SearchableDropdown/SearchableDropdown";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { RiDeleteBinLine } from "react-icons/ri";
export default function NewInvoice({ getDataById }) {
  const { id } = useParams();

  const [open, setopen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [addOptions, setAddOptions] = useState([]);
  const [isEdit, setIsEdit] = useState([]);
  const [isEdit1, setIsEdit1] = useState([]);
  const [planInfo, serPlanInfo] = useState(getDataById?.planInfo);
  const [selectedOptions2, setSelectedOptions2] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [selectCategory, setSelectCategory] = useState(getDataById?.planInfo?.categories);
  const [connectType, setConnectType] = useState(getDataById?.planInfo?.type);
  const [filterDetail, setFilterDetail] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [billingCycle, setBillingCycle] = useState("");
  const [selectPlan, setSelectPlan] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [allService, setAllService] = useState([]);
  const [checkPlan, setCheckPlan] = useState(false);
  const [checkInventery, setCheckInventery] = useState(false);
  const [checkService, setCheckService] = useState(false);
  const [planDiscount, setPlanDiscount] = useState(0);
  const [invoceIds, setInvoiceIds] = useState("");
  const [disbalebyOneClick, setDisbalebyOneClick] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState();
  const [subcribrData, setSubcribrData] = useState([]);
  const [markPaid, setMarkPaid] = useState(false);
  let InvoiceInfo = useRef({ tds: 0 });
  const [otherPermission, setOtherPermission] = useState([]);
  async function permissionFunction() {
    const res = await permisionsTab();

    setOtherPermission(
      res
        .filter(s => {
          if (
            s.tab_name === "Subscriber Management" ||
            s.tab_name === "Inventory Management" ||
            s.tab_name === "Invoices" ||
            s.tab_name === "Help Desk" ||
            s.tab_name === "Service Management"
          ) {
            return s.is_show;
          } else {
            return false;
          }
        })
        .map(es => es.tab_name)
    );
  }

    const getSubcriberData = async () => {
    await getAllSubscriber(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id, true)
      .then(res => {
        let finalData = res.data.data?.map(res => {
          if (res.subcriberType === "plan") {
            res.full_name = res.full_name + " (Plan)";
          } else {
            res.full_name = res.full_name + " (Other)";
          }
          return res;
        });
        setSubcribrData(finalData);
      })
      .catch(err => {
        console.log(err);
      });
  };
  // console.log(subcribrData, "subcribrData");
//   const getInvoiceDataFunction = async planList => {
//     setLoader(true);
//     try {
//       let response = await getInvoiceDataBYId(id).then(res => res.data.data);

//       // Set state values from response
//       setCheckInventery(response?.inventory_table?.length !== 0);
//       setCheckPlan(response?.invoice_table ? true : false);
//       setCheckService(response?.service_table?.length !== 0);
//       let planInfo = planList?.find(res => res._id?.toString() === response?.invoice_table?.plan_id.toString());
//       filterDataplan(planInfo?.type, planInfo?.category, planList);
//       setSelectCategory(response);
//       setConnectType(planInfo?.type);
//       setSelectPlan(planInfo?._id);
//       serPlanInfo(planInfo || {});

//       setAddOptions(
//         response?.inventory_table?.map(res => {
//           return {
//             label: res.inventory_name,
//             category: res.category_name,
//             discount: res.discount,
//             total: res.total_amount?.toFixed(2),
//             price: res.amount?.toFixed(2),
//             qty: res.quantity
//           };
//         }) || []
//       );
//       console.log( response?.service_table," response?.service_table")
//       setSelectedOptions2(
//         response?.service_table.map(res => {
//           return {
//             value: res.service_id || res._id, //  Unique ID required
//             label: res.service_name,
//             discount: res.discount,
//             total: res.total_amount?.toFixed(2),
//             price: res.amount?.toFixed(2),
//             qty: res.duration
//           };
//         }) || []
//       );

//       setPlanDiscount(response?.planInfo?.discount || 0);
//       setBillingCycle(response?.planInfo?.billingCycleDate || "");
//       // setSubcriberId({
//       //   ...response?.subscriberInfo,
//       //   label: response?.subscriberInfo.full_name,
//       //   value: response?.subscriberInfo.full_name + response?.subscriberInfo.mobile_number
//       // });
//       const matchedSubscriber = subcribrData.find(
//   user => user._id === response?.subscriberInfo?._id
// );
// console.log(matchedSubscriber, "matchedSubscriber");
// if (matchedSubscriber) {
//   setSubcriberId(matchedSubscriber);
// }
//     } catch (err) {
//       console.log("Error fetching invoice data:", err);
//     } finally {
//       setLoader(false);
//     }
//   };
const getInvoiceDataFunction = async planList => {
  setLoader(true);
  try {
    let response = await getInvoiceDataBYId(id).then(res => res.data.data);

    // Set state values from response
    setCheckInventery(response?.inventory_table?.length !== 0);
    setCheckPlan(!!response?.invoice_table);
    setCheckService(response?.service_table?.length !== 0);

    let planInfo = planList?.find(res => res._id?.toString() === response?.invoice_table?.plan_id?.toString());

    filterDataplan(planInfo?.type, planInfo?.category, planList);
    setSelectCategory(response);
    setConnectType(planInfo?.type);
    setSelectPlan(planInfo?._id);
    serPlanInfo(planInfo || {});

    // Updated: Ensure 'total' is always calculated if missing
    setAddOptions(
      (response?.inventory_table || []).map(res => ({
        label: res.inventory_name,
        category: res.category_name,
        discount: res.discount || 0,
        qty: res.quantity || 1,
        price: Number(res.amount || 0),
        cgst: res?.cgst || 0,
        sgst: res?.sgst || 0,
        total: res.total_amount !== undefined
          ? Number(res.total_amount).toFixed(2)
          : (Number(res.amount || 0) * (res.quantity || 1)).toFixed(2),
      }))
    );

    // Updated: Ensure 'total' is always calculated if missing
 setSelectedOptions2(
  (response?.service_table || []).map(res => {
    const qtyStr = res?.duration?.toString();
    const qty = Number(qtyStr.replace(/\D/g, ""));
    const price = Number(res.amount || 0);
    const discount = Number(res.discount || 0);

    const discountedPrice = price - (price * discount) / 100;
    const total = discountedPrice * qty;

    return {
      value: res.service_id || res._id,
      label: res.service_name,
      discount,
      qty,
      price,
      cgst: res?.cgst || 0,
      sgst: res?.sgst || 0,
      total: total.toFixed(2),
    };
  })
);


    setPlanDiscount(response?.planInfo?.discount || 0);
    setBillingCycle(response?.planInfo?.billingCycleDate || "");

    // Match subscriber
    const matchedSubscriber = subcribrData.find(
      user => user._id === response?.subscriberInfo?._id
    );
    console.log("matchedSubscriber", matchedSubscriber);
    if (matchedSubscriber) {
      setSubcriberId(matchedSubscriber);
    }
  } catch (err) {
    console.log("Error fetching invoice data:", err);
  } finally {
    setLoader(false);
  }
};


  
useEffect(() => {
  if (subcribrData.length && allPlans.length && id !== "new") {
    // Defer until subcribrData is populated
    getInvoiceDataFunction(allPlans);
  }
}, [subcribrData.length, allPlans.length, id]);

  const seqId = async () => {
    let payloadData;
    if (markPaid) {
      payloadData = { paid: "paid" };
    } else {
      payloadData = { paid: "perfoma" };
    }
    try {
      const res = await nextSeq(payloadData).then(res => {
        return res.data.data;
      });
      // console.log(res);
      setInvoiceIds(res);
    } catch (err) {
      console.log(err);
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
  const [templateInfo, setTemplateInfo] = useState([]);
  const getallTemplate = async () => {
    try {
      let templateInfo = await getTemplateData().then(res => res.data.data);
      let infoActive = templateInfo.filter(res => res.is_active);
      setTemplateInfo(infoActive);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };


  // const getTotalAmount = () => {
  //   let totalAmount = 0;
  //   if (selectedOptions2.length !== 0 && checkService) {
  //     selectedOptions2.forEach(es => {
  //       console.log(es, "es in getTotalAmount");
  //       let gst = Number(es?.price) * (Number(es?.cgst || 0) / 100) + Number(es?.price) * (Number(es?.sgst || 0) / 100);
  //       totalAmount = totalAmount + Number(es.total) + gst;
  //     });
  //   }

  //   if (addOptions.length !== 0 && checkInventery) {
  //     addOptions.forEach(es => {
  //       let gst = Number(es?.price) * (Number(es?.cgst || 0) / 100) + Number(es?.price) * (Number(es?.sgst || 0) / 100);
  //       totalAmount = totalAmount + Number(es.total) + gst;
  //     });
  //   }

  //   if (planInfo?.plan_name && checkPlan) {
  //     let gst =
  //       Number(planInfo?.amount || 0) * (Number(planInfo?.cgst || 0) / 100) +
  //       Number(planInfo?.amount || 0) * (Number(planInfo?.sgst || 0) / 100);

  //     totalAmount =
  //       totalAmount +
  //       (Number(planInfo?.amount || 0) - (Number(planInfo?.amount || 0) / 100) * Number(planInfo?.discount || 0)) +
  //       gst;
  //   }

  //   return totalAmount;
  // };
  const getTotalAmount = () => {
  let totalAmount = 0;

  if (selectedOptions2.length !== 0 && checkService) {
    selectedOptions2.forEach(es => {
      const qty = Number(es.qty || 0);
      const price = Number(es.price || 0);
      const discount = Number(es.discount || 0);

      const discountedPrice = price - (price * discount) / 100;
      const gstPerUnit = discountedPrice * (Number(es?.cgst || 0) / 100) + discountedPrice * (Number(es?.sgst || 0) / 100);
      const gstTotal = gstPerUnit * qty;

      const total = discountedPrice * qty;

      totalAmount += total + gstTotal;
    });
  }

  if (addOptions.length !== 0 && checkInventery) {
    addOptions.forEach(es => {
      const qty = Number(es.qty || 0);
      const price = Number(es.price || 0);
      const discount = Number(es.discount || 0);

      const discountedPrice = price - (price * discount) / 100;
      const gstPerUnit = discountedPrice * (Number(es?.cgst || 0) / 100) + discountedPrice * (Number(es?.sgst || 0) / 100);
      const gstTotal = gstPerUnit * qty;

      const total = discountedPrice * qty;

      totalAmount += total + gstTotal;
    });
  }

  if (planInfo?.plan_name && checkPlan) {
    const amount = Number(planInfo?.amount || 0);
    const discount = Number(planInfo?.discount || 0);
    const discountedPrice = amount - (amount * discount) / 100;

    const gst =
      discountedPrice * (Number(planInfo?.cgst || 0) / 100) +
      discountedPrice * (Number(planInfo?.sgst || 0) / 100);

    totalAmount += discountedPrice + gst;
  }

  return totalAmount;
};

  
  
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
  const getAllItem = async id => {
    setLoader(true);
    try {
      let res = await getListofInventory(id);
      let categoryInfo = allCategory.find(re => re._id === id);
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
            hsc_sac: categoryInfo.hsc_sac,
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
              hsc_sac: es.hsc_sac,
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
  useEffect(() => {
    if (getDataById) {
      filterDataplan(getDataById?.planInfo?.type, getDataById?.planInfo?.category);
      let planInfoData = allPlans.find(res => res._id.toString() === getDataById?.planInfo?._id.toString());
      if (planInfoData) {
        planInfoData.discount = 0;
      }
      setSelectCategory(getDataById?.planInfo?.category);
      setConnectType(getDataById?.planInfo?.type);
      setSelectPlan(getDataById?.planInfo?._id);
      getAllData();
      getHsnCode();
      serPlanInfo(planInfoData);
    }

    // setOriginalData({
    //   category: getDataById?.planInfo?.category,
    //   type: getDataById?.planInfo?.type,
    //   _id: getDataById?.planInfo?._id,
    //   category: getDataById?.planInfo?.category,
    //   type: getDataById?.planInfo?.type,
    // });
  }, [getDataById]);

  const [subcriberId, setSubcriberId] = useState({});


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

  // function qtySection2(data, index) {
  //   function addOne() {
  //     let arr = [...selectedOptions2];
  //     console.log(arr)
  //     arr[index].qty = arr[index].qty + 1;
  //     setSelectedOptions2(arr);
  //   }

  //   function removeOne() {
  //     if (data > 0) {
  //       let arr = [...selectedOptions2];
  //       arr[index].qty = arr[index].qty - 1;
  //       setSelectedOptions2(arr);
  //     }
  //   }

   function qtySection2(data, index) {
  function addOne() {
    let arr = [...selectedOptions2];
    let currentQty = Number(arr[index].qty) || 0;
    arr[index].qty = currentQty + 1;
    setSelectedOptions2(arr);
  }

  function removeOne() {
    let arr = [...selectedOptions2];
    let currentQty = Number(arr[index].qty) || 0;

    if (currentQty > 0) {
      arr[index].qty = currentQty - 1;
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

  const filterDataplan = async (types, categorys, planList) => {
    let planInfoData = planList ? planList : allPlans;
    setBillingCycle(categorys);
    if (types && categorys) {
      let alldata = planInfoData.filter(e => e.type === types && e.category === categorys);
      setFilterData(alldata);
    }
  };
  const getAllData = async () => {
    let data = await getPlanByCreator(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id);
    let AllPlan = data.data.data;
    filterDetaileData(getDataById?.planInfo?._id, AllPlan);
    if (id !== "new") {
      getInvoiceDataFunction(AllPlan);
    }
    setAllPlans(AllPlan);
  };
  const filterDetaileData = async (id, allPlanss, discount) => {
    let discountData;
    let alldetaildata = allPlanss.filter(e => e._id === id);
    if (discount) {
      discountData = (alldetaildata[0]?.amount * Number(discount)) / 100;
    }

    let amountData = discountData ? alldetaildata[0]?.amount - discountData : alldetaildata[0]?.amount;
    let cgst = alldetaildata[0]?.cgst ? (amountData * (alldetaildata[0]?.cgst / 100))?.toFixed(2) : 0;
    let sgst = alldetaildata[0]?.sgst ? (amountData * (alldetaildata[0]?.sgst / 100))?.toFixed(2) : 0;
    let serviceTax = alldetaildata[0]?.service_tax
      ? (amountData * (alldetaildata[0]?.service_tax / 100))?.toFixed(2)
      : 0;
    let total_amount = Number(amountData) + Number(sgst) + Number(cgst) + Number(serviceTax);

    let fullDatas = {
      ...alldetaildata[0],
      cgst,
      sgst,
      total_amount,
      serviceTax,
      discount: discountData ? discountData : 0,
      percentageData: discount ? discount : 0
    };

    setFilterDetail(fullDatas);
  };
  useEffect(() => {
    permissionFunction();
    getSubcriberData();
    getallTemplate();

    getAllData();
    getAllCategory();
    getAllServicesData();
  }, []);
  useEffect(() => {
    seqId();
  }, [markPaid]);
  // async function onSubmit(planId) {
  //   setLoader(true);
  //   let PayLoadData = {
  //     current_plan: {
  //       plan: planId
  //     },
  //     billing_type: billingCycle,
  //     id: subcriberId._id,
  //     user_role: userInfo().role,
  //     user_name: userInfo().name,
  //     user_id: userId()
  //   };
  //   if(id === "new"){

  //     await updateLeadsData(PayLoadData)
  //       .then(res => {
  //         setBillingCycle("");
  //         setLoader(false);
  //         setDisable(true);
  //         getdataLeads();
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         setLoader(false);
  //       });
  //   }else{
  //     await updateInvoiceById(id,PayloadData)
  //     .then(res => {
  //       setBillingCycle("");
  //       setLoader(false);
  //       setDisable(true);
  //       getdataLeads();
  //     }) .catch(err => {
  //       console.log(err);
  //       setLoader(false);
  //     });
  //   }
  // }
  function searchAndSelect(e) {
    let [obj] = e;
    setSubcriberId(obj);
  }





  return (
    <Content>
      <div className="card_container p-md-4 p-sm-3 p-3">
        {loader && (
          <>
            <Loader />
          </>
        )}
        <InvoicePreview
          open={open}
          subcriberId={subcriberId}
          toggle={() => setopen(!open)}
          serviceInfo={selectedOptions2}
          inventeryInfo={addOptions}
          planInfo={planInfo}
          checkInventery={checkInventery}
          checkPlan={checkPlan}
          checkService={checkService}
          getTotalAmount={getTotalAmount}
          invoceIds={invoceIds}
          addTaxesinPrice={addTaxesinPrice}
          hsndata={hsndata}
          setLoader={setLoader}
          setDisbalebyOneClick={setDisbalebyOneClick}
          disbalebyOneClick={disbalebyOneClick}
          templateInfo={templateInfo}
          setSelectedTemp={setSelectedTemp}
          selectedTemp={selectedTemp}
          markPaid={markPaid}
          id={id}
          tds={InvoiceInfo.current.tds}
        />

        <label className="fw-600 f-20">{id === "new" ? "Create New " : "Update"} Invoice</label>
        <div>
          <Label className="labels mt-2 ">Select Subscriber</Label>
          {/* <SearchableDropdown
            required
            options={subcribrData?.map(res => {
              return { ...res, value: res._id, label: res?.full_name };
            })}
            value={subcriberId ? [subcriberId] : []}
            key={subcriberId}
            searchBy="label"
            labelField="label"
            valueField="_id"
            searchable={true}
            placeholder="Search & select user by name or phone number"
            onChange={e => searchAndSelect(e)}
          /> */}
<Select
  options={subcribrData.map(res => ({
    ...res,
    value: res._id,
   label: `${res.full_name.split(' (')[0]}`
  }))}
  values={
    subcriberId && subcriberId._id
      ? [{
          ...subcriberId,
          value: subcriberId._id,
          label: `${subcriberId.full_name.split(' (')[0]}`,
        }]
      : []
  }
  onChange={(e) => setSubcriberId(e[0])} // Use `e[0]` since it returns an array
  searchable={true}
  placeholder="Search & select user by name or phone"
  labelField="label"
  valueField="value"
  clearable
/>
        </div>
        {id === "new" && (
          <div className="mt-3">
            <FormGroup check className="d-flex align-items-center">
              <input
                class="form-check-input input"
                type="checkbox"
                value=""
                id="checkbox120"
                onChange={e => {
                  setMarkPaid(e.target.checked);
                }}
              />
              <Label className="ml-2 pt-1 f-14 " for="checkbox120" check>
                <b>Mark as Paid Invoice</b>
              </Label>
            </FormGroup>
          </div>
        )}

        <div className="d-flex justify-content-between mt-4">
          <div className="d-flex">
            <div className="check_box">
              <FormGroup check className="d-flex align-items-center">
                <input
                  class="form-check-input input"
                  type="checkbox"
                  checked={checkPlan}
                  id="checkbox123"
                  onChange={e => {
                    setCheckPlan(e.target.checked);
                    setDisbalebyOneClick(false);
                  }}
                />
                <Label className="ml-2 pt-1 f-14" for="checkbox123" check>
                  Plan
                </Label>
              </FormGroup>
            </div>

            {otherPermission.includes("Inventory Management") && (
              <div className="check_box ml-3">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    checked={checkInventery}
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
            {otherPermission.includes("Service Management") && (
              <div className="check_box ml-3">
                <FormGroup check className="d-flex align-items-center">
                  <input
                    class="form-check-input input"
                    type="checkbox"
                    checked={checkService}
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
        {}
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
                {}
                <select
                  className="form-control"
                  value={selectPlan}
                  onChange={e => {
                    let info = filterData.find(es => es?._id?.toString() === e?.target?.value?.toString());

                    info.discount = 0;
                    serPlanInfo(info);
                    setSelectPlan(e.target.value);
                    // onSubmit(e.target.value);
                    setDisbalebyOneClick(false);
                  }}
                >
                  <option value={""} disabled selected>
                    Select
                  </option>
                  {filterData.map(es => (
                    <>
                      <option value={es._id} className="text-capitalize">
                        {es?.plan_name}
                      </option>
                    </>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mt-3">
                <Label>Plan Discount (%)</Label>
                <input
                  type="number"
                  className="form-control"
                  value={planDiscount}
                  onChange={e => {
                    if (e?.target?.value?.length <= 2) {
                      let info = planInfo;
                      info.discount = e.target.value;
                      setPlanDiscount(e.target.value);
                      serPlanInfo(info);
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
                <Input disabled value={planInfo?.plan_name} />
              </div>
              <div className="col-md-4 mt-3">
                <Label>Plan Rate</Label>
                <Input disabled value={planInfo?.amount} />
              </div>
              {/* <div className="col-md-4 mt-3">
          <Label>Discount %</Label>
          <Input disabled value={564} />
        </div> */}
              <div className="col-md-6 mt-3">
                <Label>Billing Cycle</Label>
                <Input disabled value={planInfo?.billingCycleDate} />
              </div>
              <div className="col-md-6 mt-3">
                <Label>&nbsp;</Label>
                <Input disabled value={planInfo?.billingCycleType} />
              </div>
            </div>
            {/* <div className="fw-500 f-18 mt-3">Internet Speed</div>
      <hr /> */}
            <div className="row">
              <div className="col-md-6 mt-3">
                <Label>Download Speed</Label>
                <div className="row">
                  <div className="col-6">
                    <Input disabled value={planInfo?.bandwidth_info?.max_download?.speed} />
                  </div>
                  <div className="col-6">
                    <Input disabled value={planInfo?.bandwidth_info?.max_download?.unit} />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <Label>Upload Speed</Label>
                <div className="row">
                  <div className="col-6">
                    <Input disabled value={planInfo?.bandwidth_info?.max_upload?.speed} />
                  </div>
                  <div className="col-6">
                    <Input disabled value={planInfo?.bandwidth_info?.max_upload?.unit} />
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
                    options={[...allItems]}
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
                        setSelectCategory([]);
                        setSelectedOptions([]);
                        setSelectCategory();
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
                      {/* <th>Price</th> */}
                            <th>Taxable</th>
                      {/* <th>CGST</th>
                <th>SGST</th> */}
                      <th>Quantity</th>
                      <th>Discount %</th>
                      {/* <th>TOTAL</th> */}
                          <th>Total Taxable</th>
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
                                    // onClick={() => {
                                    //   let info = [...addOptions];
                                    //   if (info[index].qty === 0) {
                                    //     setAddOptions(info.filter((res, ind) => ind !== index));
                                    //     setAllItems(
                                    //       allItems.map(ress => {
                                    //         ress.qty = 1;
                                    //         return ress;
                                    //       })
                                    //     );
                                    //     setIsEdit(isEdit.filter(se => se !== index));
                                    //     setDisbalebyOneClick(false);
                                    //   } else {
                                    //     info[index].total =
                                    //       Number(info[index].price) * info[index].qty -
                                    //       (Number(info[index].price) / 100) * Number(info[index].discount);

                                    //     info[index].totalWithTax =
                                    //       Number(info[index].priceWithtax) * info[index].qty -
                                    //       (Number(info[index].price) / 100) * Number(info[index].discount);
                                    //     setAddOptions(info);
                                    //     setIsEdit(isEdit.filter(se => se !== index));
                                    //     setDisbalebyOneClick(false);
                                    //   }
                                    // }}
                                    //        onClick={() => {
                                    //   let info = [...addOptions];

                                    //   if (info[index].qty === 0) {
                                      
                                    //     info.splice(index, 1);
                                    //   } else {
                                        
                                    //     info[index].total =
                                    //       Number(info[index].price) * info[index].qty -
                                    //       (Number(info[index].price) / 100) * Number(info[index].discount);

                                    //     info[index].totalWithTax =
                                    //       Number(info[index].priceWithtax) * info[index].qty -
                                    //       (Number(info[index].price) / 100) * Number(info[index].discount);
                                    //   }

                                    //   setAddOptions(info);
                                    //   setIsEdit(isEdit.filter(se => se !== index));
                                    //   setDisbalebyOneClick(false);
                                    // }}

                                    onClick={() => {
  let info = [...addOptions];

  const qty = Number(info[index].qty) || 0;
  const price = Number(info[index].price) || 0;
  const discount = Number(info[index].discount) || 0;
  const cgst = Number(info[index].cgst) || 0;
  const sgst = Number(info[index].sgst) || 0;

  const gstTotal = cgst + sgst;

  if (qty === 0) {
    info.splice(index, 1);
  } else {
    // Step 1: Price after discount per unit
    const discountedPrice = price - (price * discount) / 100;

    // Step 2: Tax per unit on discounted price
    const taxAmount = (discountedPrice * gstTotal) / 100;

    // Step 3: Final per unit with tax
    const priceWithTax = discountedPrice + taxAmount;

    // Step 4: Total calculation
    info[index].total = discountedPrice * qty;
    info[index].totalWithTax = priceWithTax * qty;
  }

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
                                  <RiDeleteBinLine
                                    className="f-20 pointer parimary-color mr-2"
                                    color="#0E1073"
                                    onClick={() => setAddOptions(addOptions.filter((res, ind) => ind !== index))}
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
            {markPaid && (
              <>
                <div className="row mt-3">
                  <div className="col-md-4">
                    <Label>TDS (in %) </Label>
                    <Input
                      type="number"
                      name="tds"
                      className="ms-4 form-control"
                      onChange={e => {
                        InvoiceInfo.current.tds = +e.target.value;
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label>Fixed</Label>

                    <SingleSelect
                      options={[
                        { label: "Fixed", value: "Fixed" },
                        { label: "Percentage", value: "Percentage" }
                      ]}
                      placeItem={""}
                    />
                  </div>
                </div>
              </>
            )}
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

                      {/* <th>Price</th> */}
                        <th>Taxable</th>
                      {/* <th>CGST</th>
                <th>SGST</th> */}
                      {/* <th>Duration</th> */}
                       <th> Quantity </th>
                      <th>Discount %</th>
                      {/* <th>TOTAL</th> */}
                          <th> Total Taxable</th>
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
                                {/* {qtySection2(res?.qty, index)}{" "}
                                <div className="ml-2">{id !== "new" ? "" : "Months"}</div> */}
                                          {qtySection2(Number(res?.qty?.toString().replace(/\D/g, "")), index)}
                                {/* <div className="ml-2">{id !== "new" ? "" : "Months"}</div> */}
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
                                  {/* <button
                                    className="btn border"
                                    onClick={() => {
                                      let info = [...selectedOptions2];
                                      if (info[index].qty === 0) {
                                        setSelectedOptions2(info.filter((res, ind) => ind !== index));
                                        setIsEdit1(isEdit1.filter(se => se !== index));
                                        setDisbalebyOneClick(false);
                                      } else {
                                        info[index].total =
                                          Number(info[index].price) -
                                          (Number(info[index].price) / 100) * Number(info[index].discount);
                                        info[index].totalWithTax =
                                          Number(info[index].priceWithtax) * info[index].qty -
                                          (Number(info[index].price) / 100) * Number(info[index].discount);
                                        setSelectedOptions2(info);
                                        setIsEdit1(isEdit1.filter(se => se !== index));
                                        setDisbalebyOneClick(false);
                                      }
                                    }}
                                  >
                                    Save
                                  </button> */}

{/* <button
  className="btn border"
  onClick={() => {
    let info = [...selectedOptions2];
    const qty = Number(info[index].qty) || 0;
    const price = Number(info[index].price) || 0;
    const discount = Number(info[index].discount) || 0;
    const priceWithTax = Number(info[index].priceWithtax) || 0;

    if (qty === 0) {
      info.splice(index, 1);
    } else {
      const discountedPrice = price - (price * discount) / 100;

      //  total = discounted price × quantity
      info[index].total = discountedPrice * qty;

      //  totalWithTax = priceWithTax × quantity - total discount
      info[index].totalWithTax =
        priceWithTax * qty - (price * discount * qty) / 100;
    }

    setSelectedOptions2(info);
    setIsEdit1(isEdit1.filter(se => se !== index));
    setDisbalebyOneClick(false);
  }}
>
  Save
</button> */}

<button
  className="btn border"
  onClick={() => {
    let info = [...selectedOptions2];

    const qty = Number(info[index].qty) || 0;
    const price = Number(info[index].price) || 0;
    const discount = Number(info[index].discount) || 0;
    const cgst = Number(info[index].cgst) || 0;
    const sgst = Number(info[index].sgst) || 0;
    const gstTotal = cgst + sgst;

    if (qty === 0) {
      info.splice(index, 1);
    } else {
      // Step 1: Apply discount per unit
      const discountedPrice = price - (price * discount) / 100;

      // Step 2: Apply tax per unit on discounted price
      const taxPerUnit = (discountedPrice * gstTotal) / 100;

      // Step 3: Final price per unit with tax
      const priceWithTax = discountedPrice + taxPerUnit;

      // Step 4: Multiply by quantity
      info[index].total = discountedPrice * qty;
      info[index].totalWithTax = priceWithTax * qty;
    }

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
                {id === "new" ? "Submit" : "Update"}
              </button>
            </div>
          </>
        )}
      </div>
    </Content>
  );
}
