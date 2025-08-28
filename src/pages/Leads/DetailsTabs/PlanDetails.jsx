import React, { useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import {
  getPlanByCreator,
  updateLeadsData,
  getHsnandSacCode,
  AddInventorySubscriber,
  getListOfInventoryCategory,
  getListofInventory,
  getDataLeadOfInvrntory
} from "../../../service/admin";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import Loader from "../../../components/commonComponent/loader/Loader";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../../assets/images/jsTree/PdfLogo.png";
import moment from "moment";
import { nextSeq, addPropsal } from "../../../service/admin";
import { userId, userInfo } from "../../../assets/userLoginInfo";
import { sendPdfbyEmail } from "../../../assets/commonFunction";
import { FiPercent } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { error, success } from "../../../Store/Slices/SnackbarSlice";
import { Table } from "reactstrap";
import { PaginationComponent } from "../../../components/Component";

export default function PlanDetails({ getDataById, getdataLeads, undoData }) {
  const [disable, setDisable] = useState(true);
  const [selectCategory, setSelectCategory] = useState(getDataById?.planInfo?.category);
  const [connectType, setConnectType] = useState(getDataById?.planInfo?.type);
  const [selectPlan, setSelectPlan] = useState(getDataById?.planInfo?._id);
  const [allPlans, setAllPlans] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterDetail, setFilterDetail] = useState([]);
  const [checkDiscount, setCheckDiscount] = useState(false);
  const paramsData = useParams();
  const inVoiceRef1 = useRef(null);
  const [invoceIds, setInvoiceIds] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [percentageData, setPercentageData] = useState();
  const dispatch = useDispatch();
  const [originalData, setOriginalData] = useState({});
  const [hsndata, setHsnData] = useState();

  const [getcategory, setGetCategory] = useState([]);
  const [getItemList, setGetItemList] = useState([]);
  const [selectCategoryData, seTSelectCategoryData] = useState("");
  const [quantityData, setQuantityData] = useState("");
  const [selectItem, setSelectItem] = useState("");
  const [tableData, setTableData] = useState([]);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;

  let orGId = userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id;

  const getDataOfCategory = async () => {
    try {
      let res = await getListOfInventoryCategory(orGId);
      let AllDatas = Array.isArray(res?.data?.data)
        ? res.data.data.map(res => ({
            value: res?._id,
            label: res?.category_name
          }))
        : []; // Return an empty array if it's not an array
      
      setGetCategory(AllDatas);
    } catch (err) {
      
    }
  };

  const getItemData = async () => {
    try {
      let res = await getListofInventory(selectCategoryData);
      let AllDataItem = Array.isArray(res?.data?.data)
        ? res.data.data.map(resss => ({
            value: resss?._id,
            label: resss?.item_name
          }))
        : []; // Return an empty array if it's not an array
      
      setGetItemList(AllDataItem);
    } catch (err) {
      
    }
  };
  

  // const addSubscriberInventory = async e => {
  //   e.preventDefault();
  //   setLoader(true);
  //   let payload = {
  //     lead_id: paramsData.id,
  //     inventory_id: selectItem,
  //     inventoryCategory_id: selectCategoryData,
  //     qty: quantityData,
  //     isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
  //     org_id: userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id
  //   };
  //   try {
  //     let res = await AddInventorySubscriber(payload);
  //     dispatch(
  //       success({
  //         show: true,
  //         msg: "Item Created Successfully",
  //         severity: "success"
  //       })
  //     );
  //     getAllInventoryOfSubscriber();
  //     setQuantityData("")
  //     seTSelectCategoryData("")
  //     setSelectItem("")
  //   } catch (err) {
  //     console.log(err);
  //     if(err?.response?.data?.errormessage?.includes("this Item have 0 quantity")){
  //       dispatch(
  //         error({
  //           show: true,
  //           msg: "this Item have 0 quantity",
  //           severity: "error"
  //         })
  //       );
  //     }
  //   } finally {
  //     // setVisible(false);
  //     setLoader(false);

  //   }
  // };

  const addSubscriberInventory = async e => {
    e.preventDefault();
    setLoader(true);

    let payload = {
      lead_id: paramsData.id,
      inventory_id: selectItem,
      inventoryCategory_id: selectCategoryData,
      qty: quantityData,
      isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
      org_id: userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id
    };

    try {
      let res = await AddInventorySubscriber(payload);

      // Display success message
      dispatch(
        success({
          show: true,
          msg: "Item Created Successfully",
          severity: "success"
        })
      );

      // Refresh inventory list
      await getAllInventoryOfSubscriber();

      // Clear form fields only after successful operation
      setQuantityData("");
      seTSelectCategoryData(""); // Fixed the typo
      setSelectItem("");
    } catch (err) {
      console.log(err);

      // Handle specific error condition
      if (err?.response?.data?.errormessage?.includes("this Item have 0 quantity")) {
        dispatch(
          error({
            show: true,
            msg: "This item has 0 quantity",
            severity: "error"
          })
        );
      }
    } finally {
      // Reset loader state
      setLoader(false);
    }
  };

  const getAllInventoryOfSubscriber = async () => {
    setLoader(true);
    try {
      let res = await getDataLeadOfInvrntory(paramsData.id);
      
      let dataReverse = res?.data?.data?.reverse();
      setTableData(dataReverse);
      let exportInfo = dataReverse.map(e => {
        const price = e?.inventoryInfo?.item_price || 0;
        const qty = e?.qty || 0;
        const cgst = e?.inventorycategorie?.cgst || 0;
        const sgst = e?.inventorycategorie?.scgst || 0;

        const total = price * qty + (cgst / 100) * (price * qty) + (sgst / 100) * (price * qty);
        return {
          Item: e?.inventoryInfo?.item_name,
          Price: e?.inventoryInfo?.item_price,
          CGST: e?.inventorycategorie?.cgst ? e?.inventorycategorie?.cgst : "---",
          SGST: e?.inventorycategorie?.scgst ? e?.inventorycategorie?.scgst : "---",
          Quantity: e?.qty,
          Total: total.toFixed(2)
        };
      });
      // setExportData(exportInfo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getAllInventoryOfSubscriber();
    getDataOfCategory();
    if (selectCategoryData) {
      getItemData();
    }
  }, [selectCategoryData]);

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

  const getAllData = async () => {
    let data = await getPlanByCreator(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id);
    let AllPlan = data.data.data;
    filterDetaileData(getDataById?.planInfo?._id, AllPlan);
    setAllPlans(AllPlan);
  };

  const filterDataplan = async (types, categorys) => {
    setBillingCycle(categorys);
    if (types && categorys) {
      let alldata = allPlans.filter(e => e.type === types && e.category === categorys);
      setFilterData(alldata);
    }
  };

  const filterDetaileData = async (id, allPlanss, discount) => {
    let discountData;
    let alldetaildata = allPlanss.filter(e => e._id === id);
    if (discount) {
      discountData = (alldetaildata[0]?.amount * Number(discount)) / 100;
    }

    let amountData = discountData ? alldetaildata[0]?.amount - discountData : alldetaildata[0]?.amount;
    let cgst = alldetaildata[0]?.cgst ? (amountData * (alldetaildata[0]?.cgst / 100)).toFixed(2) : 0;
    let sgst = alldetaildata[0]?.sgst ? (amountData * (alldetaildata[0]?.sgst / 100)).toFixed(2) : 0;
    let serviceTax = alldetaildata[0]?.service_tax
      ? (amountData * (alldetaildata[0]?.service_tax / 100)).toFixed(2)
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
    getAllData();
    setSelectCategory(getDataById?.planInfo?.category);
    setConnectType(getDataById?.planInfo?.type);
    setSelectPlan(getDataById?.planInfo?._id);
    filterDataplan(getDataById?.planInfo?.type, getDataById?.planInfo?.category);
    setOriginalData({
      category: getDataById?.planInfo?.category,
      type: getDataById?.planInfo?.type,
      _id: getDataById?.planInfo?._id,
      category: getDataById?.planInfo?.category,
      type: getDataById?.planInfo?.type
    });
  }, [getDataById]);

  async function onSubmit(e) {
    setLoader(true);
    e.preventDefault();
    let PayLoadData = {
      current_plan: {
        plan: selectPlan
      },
      billing_type: billingCycle,
      id: paramsData.id,
      user_role: userInfo().role,
      user_name: userInfo().name,
      user_id: userId()
    };
    await updateLeadsData(PayLoadData)
      .then(res => {
        setBillingCycle("");
        setLoader(false);
        setDisable(true);
        getdataLeads();
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  }

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

  useEffect(() => {
    seqId();
    getHsnCode();
  }, []);

  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      background: "white"
    }
  };

  function handleCancel() {
    setSelectCategory(originalData?.category);
    setConnectType(originalData?.type);
    setSelectPlan(originalData?._id);
    filterDataplan(originalData?.type, originalData?.category);
    setDisable(true);
  }
  const adddProposalSubmit = async e => {
    e.preventDefault();
    setLoader(true);
    let payloadDatas = {
      invoice_no: `${invoceIds.code}-${invoceIds.nextSeq}`,
      invoice_table: {
        cgst: filterDetail?.cgst,
        sgst: filterDetail?.sgst,
        payment_name: getDataById?.planInfo?.plan_name,
        description: getDataById?.planInfo?.shortDescription,
        total_amount: filterDetail?.total_amount?.toFixed(2),
        amount: filterDetail?.amount,
        service_tax: filterDetail?.serviceTax,
        discount: percentageData,
        discount_amount: filterDetail?.discount
      },
      plan_id: getDataById?.planInfo?._id,
      invoiceNo_id: invoceIds?.id,
      user_id: paramsData.id,
      created_by: userId(),
      user_name: userInfo().name,
      user_role: userInfo().role
    };
    await addPropsal(payloadDatas)
      .then(async res => {
        await convertToImg(getDataById?.email, res?.data?.data?._id);
        setLoader(false);
        setPercentageData("");
        seqId();
        dispatch(
          success({
            show: true,
            msg: "Proposal send on lead email",
            severity: "success"
          })
        );
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  async function convertToImg(emailsend, pid) {
    setLoader(true);
    let arr = [inVoiceRef1.current];
    let photoArr = [];
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let index = 0; index < arr.length; index++) {
      const res = arr[index];
      try {
        const dataUrl = await htmlToImage.toPng(res, { quality: 0.5 });
        photoArr.push(dataUrl);
        const imgProps = pdf.getImageProperties(dataUrl);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
        const scaledWidth = imgProps.width * scaleFactor;
        const scaledHeight = imgProps.height * scaleFactor;

        pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST");
        if (index !== arr.length - 1) {
          pdf.addPage();
        }
      } catch (error) {
        console.error("oops, something went wrong!", error);
      }
    }

    setLoader(false);

    const pdfBlob = pdf.output("blob");
    if (emailsend) {
      let res = await sendPdfbyEmail(
        pdfBlob,
        getDataById?.email,
        getDataById?.full_name,
        filterDetail?.total_amount?.toFixed(2),
        new Date(),
        `${invoceIds.code}-${invoceIds.nextSeq}`,
        "proposal",
        `https://main.d26qjdzv5chp7x.amplifyapp.com/proposalAcknoledge/${pid}/${hsndata?.code}`
      );
    } else {
      const pdfURL = URL.createObjectURL(pdfBlob);
      window.open(pdfURL);
    }
  }
  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <div style={{ width: "905px" }} className="pdf_table_style_wrap">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-center">
              <div className="f-26">Proposal </div>
            </div>
            <div className="d-flex justify-content-between  align-items-center">
              <div>
                <img src={logo} width={100} alt="" />
              </div>
              <div className="flex-direction-column mt-4">
                <div>Address: "Abc pvt. lmt pune maharastra"</div>
                <div className="mt-2">Mobile No: "9878675434"</div>
                <div className="mt-2">Email: "abc@gmail.com"</div>
                <div className="mt-2">GSTIN: "20ABGFHTRD123YG"</div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4 w-100">
              <div className="flex-direction-column">
                <div>
                  <b>Name</b> : {getDataById?.full_name}
                </div>
                <div className="mt-2">
                  <b>Email</b> : {getDataById?.email}
                </div>
                <div className="mt-2">
                  <b>Billing Address</b> : {getDataById?.billing_address?.pin_code},
                  {getDataById?.billing_address?.flat_number}, {getDataById?.billing_address?.city},{" "}
                  {getDataById?.billing_address?.state},
                </div>
                <div className="mt-2">
                  <b>Installation Address</b> : {getDataById?.installation_address?.pin_code},
                  {getDataById?.installation_address?.flat_number}, {getDataById?.installation_address?.city},{" "}
                  {getDataById?.installation_address?.state},
                </div>
                <div className="mt-2">
                  <b>Phone</b> : {getDataById?.mobile_number}
                </div>
              </div>
              <div className="flex-direction-column">
                <div>
                  <b>Invoice No</b> : {`${invoceIds.code}-${invoceIds.nextSeq}`}
                </div>
                <div className="mt-2">
                  <b>Date</b> : {moment().format("YYYY-MM-DD")}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <table>
                <thead className="ps-5">
                  <tr>
                    <th style={{ width: "60%" }} className="pl-3">
                      Description
                    </th>
                    <th style={{ width: "10%" }} className="pl-3">
                      HSN/SAC Code
                    </th>
                    <th style={{ width: "10%" }} className="pl-3">
                      Qty
                    </th>
                    <th style={{ width: "20%" }} className="pl-3">
                      Rate (Rs)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pl-2 pt-3">
                      <div>
                        <b>Plan Name : </b> {getDataById?.planInfo?.plan_name}
                      </div>
                      <div className="mt-2">
                        <b>Plan Category :</b> {getDataById?.planInfo?.category}
                      </div>
                      <div className="mt-2">
                        <b>Description :</b> {getDataById?.planInfo?.shortDescription}
                      </div>
                    </td>
                    <td className="pl-2">
                      <>{hsndata?.code}</>
                    </td>
                    <td className="pl-2">1</td>

                    <td className="pl-2">{getDataById?.invoice_table?.amount}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right pr-2 pt-2">
                      <div>
                        <b>Price :</b>
                      </div>
                      {percentageData ? (
                        <div className="mt-3">
                          <b>Discount :</b>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="mt-3">
                        <b>SGST :</b>
                      </div>
                      <div className="mt-3">
                        <b> CGST :</b>
                      </div>
                      <div className="mt-3">
                        <b> Service Tax :</b>
                      </div>
                    </td>
                    <td className="pl-2 pt-2">
                      <div className="">{getDataById?.planInfo?.amount}</div>
                      {percentageData ? (
                        <div className="mt-3"> {`${filterDetail?.discount} (${filterDetail?.percentageData}%)`}</div>
                      ) : (
                        ""
                      )}
                      <div className="mt-3">{filterDetail?.sgst}</div>
                      <div className="mt-3">{filterDetail?.cgst}</div>
                      <div className="mt-3">{filterDetail?.serviceTax}</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right pr-2 ">
                      <div>
                        <b>Total:</b>
                      </div>
                    </td>
                    <td className="pl-2">{filterDetail?.total_amount?.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <b className="f-14">Term</b>
              <div>1. Total payment due in 10 days</div>
              <div>2. After due date you will pay Rs.50 extra.T&C APPLY*</div>
              <div>3. Cheque Payable to PHP Radius.</div>
              <div>Company's Bank details:</div>
              <div>Bank Name:</div>
              <div>Bank Account No.:</div>
              <div>Bank IFSC code:</div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <div className="mr-3 fw-600 f-18">Plan Details</div>
            {disable ? (
              <>
                {getDataById?.lead_status === "converted" ? (
                  <></>
                ) : (
                  <FaRegEdit className="f-20 text-primary pointer" onClick={() => setDisable(false)} />
                )}
              </>
            ) : (
              <IoCloseSharp
                className="f-20 text-primary pointer"
                onClick={() => {
                  handleCancel();
                }}
              />
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
      </form>

      <div className="f-18 fw-500 mt-4">Connection Type</div>
      <hr />
      <div className="row mt-4">
        <div className="col-md-6 col-sm-6 col-12">
          <label className="form-label mb-1">Connection Category</label>
          {/* {} */}
          <select
            className="form-control"
            disabled={disable}
            value={selectCategory ? selectCategory : ""}
            onChange={e => {
              setSelectCategory(e.target.value);
              filterDataplan(connectType, e.target.value);
              setSelectPlan("");
              setFilterDetail({});
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
            disabled={disable}
            onChange={e => {
              setConnectType(e.target.value);
              filterDataplan(e.target.value, selectCategory);
              setSelectPlan("");
              setFilterDetail({});
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

      <div className="row mt-2">
        <div className="col-md-6 col-sm-6 col-12">
          <label className="form-label mb-1">Plan Name</label>

          <SingleSelect
            disabled={disable}
            placeItem="Plan"
            value={selectPlan}
            options={filterData.map(e => {
              return { value: e._id, label: e.plan_name };
            })}
            onChange={e => {
              setSelectPlan(e.target.value);
              filterDetaileData(e.target.value, allPlans);
            }}
          />
        </div>
      </div>
      {getDataById?.planInfo?._id && (
        <>
          <div className="f-18 fw-500 mt-4">Plan Details {filterDetail?.plan_name}</div>
          <hr />
          <div className="row mt-4">
            <div className="col-md-6">
              <label className="form-label mb-1">Plan Name</label>
              <input className="form-control" disabled value={filterDetail?.plan_name} />
            </div>
            <div className="col-md-6">
              <label className="form-label mb-1">Plan Rate</label>
              <input className="form-control" disabled value={filterDetail?.amount} />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <label className="form-label mb-1">Billing Cycle</label>
              <input className="form-control" disabled value={filterDetail?.billingCycleDate} />
            </div>
            <div className="col-md-6">
              <label className="form-label mb-1"></label>
              <input className="form-control mt-1" disabled value={filterDetail?.billingCycleType} />
            </div>
          </div>
          <div className="f-18 fw-500 mt-4">Internet Speed</div>
          <hr />
          <div className="row mt-2">
            <div className="col-md-3">
              <label className="form-label mb-1">DownLoad Speed</label>
              <input
                type=""
                className="form-control"
                disabled
                value={filterDetail?.bandwidth_info?.max_download?.speed}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label mb-1"></label>
              <input
                type=""
                className="form-control mt-1"
                disabled
                value={filterDetail?.bandwidth_info?.max_download?.unit}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label mb-1">Upload Speed</label>
              <input
                type=""
                className="form-control"
                disabled
                value={filterDetail?.bandwidth_info?.max_upload?.speed}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label mb-1"></label>
              <input
                type=""
                className="form-control mt-1"
                disabled
                value={filterDetail?.bandwidth_info?.max_upload?.unit}
              />
            </div>
          </div>
          {/* <div className="f-18 fw-500 mt-4">Add Inventory</div>
          <form onSubmit={addSubscriberInventory}>
            <div className="row mt-3">
              <div className="col-md-6 col-sm-6 col-12">
                <label className="form-label">
                  Category<span className="text-danger">*</span>
                </label>
                <SingleSelect
                  disabled={disable}
                  required
                  options={getcategory}
                  placeItem="Category"
                  onChange={e => {
                    seTSelectCategoryData(e.target.value);
                  }}
                />
              </div>
              <div className="col-md-6 col-sm-6 col-12">
                <label className="form-label">
                  Item<span className="text-danger">*</span>
                </label>
                <SingleSelect
                  disabled={disable}
                  required
                  placeItem="Item"
                  options={getItemList}
                  onChange={e => {
                    setSelectItem(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <label>Quantity</label>
                <input
                  disabled={disable}
                  type="number"
                  required
                  className="form-control"
                  onChange={e => {
                    setQuantityData(e.target.value);
                  }}
                  placeholder="Enter Quantity"
                />
              </div>
            </div>

            <button disabled={disable} className="btn btn-primary mt-4" type="submit">
              Create Inventory
            </button>
          </form>
          <div className="mt-3">
            <div className="table-container mt-5">
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Item</th>
                    <th>Price</th>
                    <th>CGST(%)</th>
                    <th>SGST(%)</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res, index) => {
                    const price = res?.inventoryInfo?.item_price || 0;
                    const qty = res?.qty || 0;
                    const cgst = res?.inventorycategorie?.cgst || 0;
                    const sgst = res?.inventorycategorie?.scgst || 0;

                    const total = price * qty + (cgst / 100) * (price * qty) + (sgst / 100) * (price * qty);
                    return (
                      <tr>
                        <td>{res?.inventoryInfo?.item_name}</td>
                        <td>{res?.inventoryInfo?.item_price}</td>
                        <td>{res?.inventorycategorie?.cgst ? res?.inventorycategorie?.cgst : "---"}</td>
                        <td>{res?.inventorycategorie?.scgst ? res?.inventorycategorie?.scgst : "---"}</td>
                        <td>{res?.qty}</td>
                        <td>{total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div class="d-flex justify-content-center mt-1">
              <PaginationComponent
                currentPage={page}
                itemPerPage={itemPerPage}
                paginate={d => {
                  setPage(d);
                }}
                totalItems={tableData.length}
              />
            </div>
          </div>

          {getDataById?.lead_status === "converted" ? (
            ""
          ) : (
            <>
              <div className="mt-4">
                <div className="fw-500 f-18">Do you want to enable Discount?</div>
                <div className="custom-control  custom-control-sm custom-switch mt-2">
                  <input
                    type="checkbox"
                    className="custom-control-input w-100"
                    id="customSwitch1"
                    name="active_status"
                    checked={checkDiscount}
                    onChange={e => {
                      setCheckDiscount(e.target.checked);
                      setPercentageData("");
                      if (e.target.checked === false) {
                        filterDetaileData(selectPlan, allPlans, 0);
                      }
                    }}
                  />
                  <label className="custom-control-label f-16 text-black" htmlFor="customSwitch1"></label>
                </div>
              </div>
              {checkDiscount === true ? (
                <div className="row mt-4">
                  <div className="col-md-3 percent_Icon_Set_main">
                    <label className="form-label mb-1">Discount (on base amount)</label>
                    <input
                      className="form-control"
                      placeholder="Percentage"
                      type="number"
                      onChange={e => {
                        setPercentageData(e.target.value);
                        filterDetaileData(selectPlan, allPlans, e.target.value);
                      }}
                    />
                    <FiPercent className="percent_Icon_Set_child" />
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="mt-4 d-flex">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    convertToImg();
                  }}
                >
                  Preview
                </button>
                <button
                  className="btn btn-sm btn-primary ml-3"
                  type="button"
                  onClick={e => {
                    adddProposalSubmit(e);
                  }}
                >
                  Send Proposal
                </button>
              </div>
            </>
          )} */}
        </>
      )}
    </>
  );
}
