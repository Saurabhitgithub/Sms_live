import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalHeader, Label, ModalBody, Input } from "reactstrap";
import { GoArrowRight } from "react-icons/go";
import { FaHashtag } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";

import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import style from "./style.module.css";
import Icon from "../../components/icon/Icon";
import { getAllSubscriber, getHsnandSacCode, nextSeq, phonePePayment } from "../../service/admin";
import { getPlanById } from "../../service/admin";
import { uid } from "uid";
import moment from "moment";
import { addInvoiceData } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { getPdfInvoiceId } from "../../service/admin";
import { userId, userInfo } from "../../assets/userLoginInfo";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import { sendPdfbyEmail } from "../../assets/commonFunction";
import SearchableDropdown from "../../AppComponents/SearchableDropdown/SearchableDropdown";

const InvoiceModal = ({ isOpen, setIsOpen, getData }) => {
  const toggle = () => setIsOpen(false);
  const [createdBy, setCreatedBy] = useState();
  const [zoneData, setZoneData] = useState();
  const [userName, setUserName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loader, setLoader] = useState(false);

  const [next, setNext] = useState(1);
  const [showData1, setShowData1] = useState(false);
  const [showData2, setShowData2] = useState(false);
  const [showData3, setShowData3] = useState(false);
  const [showData4, setShowData4] = useState(false);
  const [subcribrData, setSubcribrData] = useState([]);
  const [planId, setPlanId] = useState();
  const [planData, setplanData] = useState([]);
  const [userDataName, setUserDataName] = useState();
  const [userIdInvoice, setUserIdInvoice] = useState();
  const [invoiceNo_id, setInvoiceNo_id] = useState();

  const inVoiceRef1 = useRef(null);
  const inVoiceRef2 = useRef(null);
  const [allData, setAlldata] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hsndata, setHsnData] = useState([]);

  const getHsnCode = async () => {
    await getHsnandSacCode()
      .then(res => {
        let dataitem = [...res.data.data];
        let filterData = dataitem.filter(e => e.item === "internet service");

        setHsnData(filterData);
      })
      .catch(err => {
        console.log(err);
      });
  };
  //
  const seqId = async () => {
    const res = await nextSeq({
      paid: "perfoma"
    });
    let response = res.data.data;
    setUserIdInvoice(`${response.code}-${response.nextSeq}`);
    setInvoiceNo_id(response.id);
  };
  const handleSubmit1 = async e => {
    e.preventDefault();
    let PlanIdData = userDataName;

    await getPlanById(PlanIdData?.current_plan?.plan).then(res => {
      setplanData({
        ...res.data.data,
        full_name: PlanIdData.full_name,
        email: PlanIdData.email,
        userName: PlanIdData?.userName,
        mobile_number: PlanIdData?.mobile_number
      });
    });

    setNext(2);
  };

  const getPdfDataByid = async () => {
    await getPdfInvoiceId()
      .then(res => {
        setAlldata(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleSubmit2 = e => {
    e.preventDefault();

    setNext(3);
  };

  const handleSubmit3 = async e => {
    e.preventDefault();

    // let PayloadData = {
    //   invoice_no: userIdInvoice,
    //   payment_mode: "UPI",
    //   zone: zoneData,
    //   date_from: startDate,
    //   date_to: endDate,
    //   plan_id: planData._id,
    //   user_id: planId,
    //   created_by: userId(),
    //   user_name: userInfo().name,
    //   user_role: userInfo().role,
    //   invoiceNo_id: invoiceNo_id,
    //   org_id: userInfo().org_id,
    //   isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
    // };

    const amount = planData.amount; // 699
    const cgst = (amount * (planData.cgst || 0)) / 100; // 699 * 3% = 20.97
    const sgst = (amount * (planData.sgst || 0)) / 100; // 699 * 3% = 20.97
    const totalTax = cgst + sgst; // 41.94

    const grandTotal = amount + totalTax - 0;

    const PayloadData = {
      invoice_no: userIdInvoice, // Replace dynamically as needed
      invoiceNo_id: invoiceNo_id, // your value
      user_id: planData._id,
      created_by: userId(),
      user_name: planData.full_name,
      user_role: "isp admin", // or dynamic from userInfo().role
      invoice_discount: 0,
      tds: 0,
      grand_total: grandTotal, // 699 + 41.94 = 740.94
      template_id: "675045a2d251f9bba94b9f6f", // optional if used
      user_id: planId,
      invoice_table: {
        cgst: planData.cgst || 0, // 3
        sgst: planData.sgst || 0, // 3
        payment_name: planData.plan_name, // "super plan"
        description: planData.shortDescription, // "Plan Description"
        amount: amount,
        discount: 0,
        plan_id: planData._id,
        discount_amount: 0
      },
      role: userInfo().role,
      user_name: userInfo().name,
      user_role: userInfo().role,
      org_id: userInfo().org_id,
      isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
    };
    console.log(PayloadData, planData);

    // return;
    let Payload;
    if (userInfo().role === "isp admin") {
      Payload = {
        org_id: userInfo()._id
      };
    } else {
      Payload = {
        org_id: userInfo().org_id,
        isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
      };
    }

    setLoader(true);

    await addInvoiceData({ ...PayloadData, ...Payload })
      .then(async res => {
        await convertToImg(userDataName?.email,res?.data?.data?._id);
        setIsOpen(false);
        setLoader(false);
        seqId();
        getData();
        setNext(1);
        setPlanId();
        setUserDataName();
        setplanData();
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const getSubcriberData = async () => {
    await getAllSubscriber(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id)
      .then(res => {
        setSubcribrData(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let zonedata = [
    { value: "Sector 62", label: "sector 62" },
    { value: "Sector 61", label: "Sector 61" },
    { value: "Sector 59", label: "Sector 59" }
  ];
  useEffect(() => {
    seqId();
    getSubcriberData();
    getPdfDataByid();
    getHsnCode();
  }, []);

  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      // background: "linear-gradient(251.07deg, #FFFFFF 35.06%, #E8F9FA 95.96%)",
      // margin:'0 auto'
      background: "white"
    }
  };
  async function convertToImg(emailsend,Invoice_id) {
    setLoader(true);
    let arr = [inVoiceRef1.current];
    let photoArr = [];
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let index = 0; index < arr.length; index++) {
      const res = arr[index];
      try {
        const dataUrl = await htmlToImage.toPng(res, { quality: 0.5 }); // Reduced quality to 0.5
        photoArr.push(dataUrl);
        const imgProps = pdf.getImageProperties(dataUrl);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Scale image to fit within PDF dimensions
        const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
        const scaledWidth = imgProps.width * scaleFactor;
        const scaledHeight = imgProps.height * scaleFactor;

        pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST"); // Added compression option
        if (index !== arr.length - 1) {
          pdf.addPage();
        }
      } catch (error) {
        console.error("oops, something went wrong!", error);
      }
    }

    setLoader(false);

    // Convert the jsPDF object to a Blob and create a preview URL
    const pdfBlob = pdf.output("blob");
    if (emailsend) {
      let payloadPhonepe = {
        name: userDataName?.full_name,
        mobile_number: userDataName.mobile_number,
        amount: Math?.round(userDataName?.total_amount * 100),
        userID: userDataName._id,
        planId: planData._id,
        invoiceId: Invoice_id
      };

      let phonepe = await phonePePayment(payloadPhonepe).then(res => {
        return res.data.data;
      });
       await sendPdfbyEmail(
        pdfBlob,
        userDataName?.email,
        userDataName?.full_name,
        userDataName?.total_amount,
        new Date(),
        userIdInvoice,
        "invoice",
        phonepe.url
      );
    } else {
      const pdfURL = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new window/tab
      window.open(pdfURL);
    }
  }

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function searchAndSelect(e) {
    let [obj] = e;
    setPlanId(obj?._id);
    let PlanIdData = subcribrData.find(res => res._id === obj?._id);
    let cgst = (PlanIdData?.planInfo?.amount * 0.09).toFixed(2);
    let sgst = (PlanIdData?.planInfo?.amount * 0.09).toFixed(2);

    let fullData = {
      ...PlanIdData,
      cgst,
      sgst,
      total_amount: Number(PlanIdData?.planInfo?.amount) + Number(sgst) + Number(cgst)
    };

    setUserDataName(fullData);
  }

  return (
    <React.Fragment>
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
              <div className="f-26">Tax Invoice</div>
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
                  <b>Name</b> : {userDataName?.full_name}
                </div>
                <div className="mt-2">
                  <b>Email</b> : {userDataName?.email}
                </div>
                <div className="mt-2">
                  <b>Billing Address</b> : {userDataName?.billing_address?.pin_code},
                  {userDataName?.billing_address?.flat_number}, {userDataName?.billing_address?.city},{" "}
                  {userDataName?.billing_address?.state},
                </div>
                <div className="mt-2">
                  <b>Installation Address</b> : {userDataName?.installation_address?.pin_code},
                  {userDataName?.installation_address?.flat_number}, {userDataName?.installation_address?.city},{" "}
                  {userDataName?.installation_address?.state},
                </div>
                <div className="mt-2">
                  <b>Phone</b> : {userDataName?.mobile_number}
                </div>
              </div>
              <div className="flex-direction-column">
                <div>
                  <b>Invoice No</b> : {userIdInvoice}
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
                    <th style={{ width: "70%" }} className="pl-3">
                      Description
                    </th>
                    <th style={{ width: "10%" }} className="pl-3">
                      HSN/SAC Code
                    </th>
                    <th style={{ width: "10%" }} className="pl-3">
                      Qty
                    </th>
                    <th style={{ width: "10%" }} className="pl-3">
                      Rate (Rs)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pl-2 pt-3">
                      <div>
                        <b>Plan Name : </b> {userDataName?.planInfo?.plan_name}
                      </div>
                      <div className="mt-2">
                        <b>Plan Category :</b> {userDataName?.planInfo?.category}
                      </div>
                      <div className="mt-2">
                        <b>Description :</b> {userDataName?.planInfo?.shortDescription}
                      </div>
                    </td>
                    <td className="pl-2">
                      {hsndata.map(res => {
                        return <>{res?.code}</>;
                      })}
                    </td>
                    <td className="pl-2">1</td>

                    <td className="pl-2">{userDataName?.invoice_table?.amount}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right pr-2 pt-2">
                      <div>
                        <b>Taxable :</b>
                      </div>
                      <div className="mt-3">
                        <b>SGST :</b>
                      </div>
                      <div className="mt-3">
                        <b> CGST :</b>
                      </div>
                    </td>
                    <td className="pl-2 pt-2">
                      {/* {} */}
                      <div className="">{userDataName?.planInfo?.amount}</div>
                      <div className="mt-3">{userDataName?.sgst}</div>
                      <div className="mt-3">{userDataName?.cgst}</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right pr-2 ">
                      <div>
                        <b>Total:</b>
                      </div>
                    </td>
                    <td className="pl-2">{userDataName?.total_amount?.toFixed(2)}</td>
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

      <Modal isOpen={isOpen} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle} className="d flex align-items-center justify-content-between pop_up">
          <div className="head_min">New Invoice</div>
        </ModalHeader>
        <ModalBody>
          <div className={`${style.Grid_Style_template}`}>
            <div className={`${style.child_container}`}>
              <div>
                <FaHashtag size={28} color="gray" />
              </div>
              <div>
                <div className="f-14 fw-600">Invoice Number:</div>
                <div className="f-14" style={{ marginTop: "8px" }}>
                  {userIdInvoice}
                </div>
              </div>
              {windowWidth < 420 ? <div></div> : ""}
              <div>
                <div className="f-14 fw-600">Created on:</div>
                <div className="f-14" style={{ marginTop: "8px" }}>
                  {moment().format("YYYY-MM-DD")}
                </div>
              </div>
            </div>
            <div className={`${style.verticle_line} d-md-block d-sm-none d-none`}></div>
            <div className={`${style.child_container}`}>
              <div class="">
                <IoPersonSharp size={28} color="gray" />
              </div>
              <div>
                <div className="f-14 fw-600">User Name:</div>

                <div className="f-14" style={{ marginTop: "8px" }}>
                  {planData?.userName ? planData?.userName : "---"}
                </div>
              </div>
              {windowWidth < 420 ? <div></div> : ""}
              <div>
                <div className="f-14 fw-600">Phone Number:</div>
                <div className="f-14" style={{ marginTop: "8px" }}>
                  {planData?.mobile_number ? planData?.mobile_number : "---"}
                </div>
              </div>
            </div>
          </div>

          {next === 1 && (
            <>
              <div className="mt-5">
                <span className={`${style.para_headings} `}>Invoice Settings</span>
                <hr />
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSubmit1(e);
                  }}
                >
                  <div class="container">
                    <div class="row">
                      <div class="col-md-6">
                        <Label className="labels mt-2">Created By</Label>
                        <Input
                          required
                          name="user_name"
                          className="mt-2"
                          placeholder="Created By"
                          value={userInfo().name}
                          disabled
                          // onChange={(e) => {
                          //   setCreatedBy(e.target.value);
                          // }}
                        />
                      </div>
                      {/* <div class="col-md-6">
                        <Label className="labels mt-2 ">Zone</Label>
                        <SingleSelect
                          placeholder={"Select Zone"}
                          name={""}
                          required
                          placeItem="Zone"
                          options={zonedata}
                          className="mt-2"
                          value={zoneData}
                          onChange={(e) => {
                            setZoneData(e.target.value);
                          }}
                        />
                      </div> */}
                    </div>
                  </div>
                  <p className={`${style.para_headings} mt-5`}>Subscriber Selection</p>
                  <hr />
                  <div class="container">
                    <div class="row">
                      <div class="col-md-6">
                        <Label className="labels mt-2 ">Phone Number</Label>
                        <SearchableDropdown
                          required
                          options={subcribrData
                            ?.filter(res => res.current_plan?.plan)
                            ?.map(res => {
                              return {
                                ...res,
                                value: `${res?.full_name}${res?.mobile_number}`,
                                label: `${res?.full_name} (${res?.mobile_number})`
                              };
                            })}
                          searchBy="value"
                          labelField="label"
                          valueField="_id"
                          searchable={true}
                          placeholder="Search & select user by name or phone number"
                          onChange={e => searchAndSelect(e)}
                          // onChange={(e) => {
                          //   setPlanId(e.target.value);
                          //   let PlanIdData = subcribrData.filter((res) => res._id === e.target.value)[0];
                          //   let cgst = (PlanIdData?.planInfo?.amount * 0.09).toFixed(2);
                          //   let sgst = (PlanIdData?.planInfo?.amount * 0.09).toFixed(2);
                          //   let fullData = {
                          //     ...PlanIdData,
                          //     cgst,
                          //     sgst,
                          //     total_amount: Number(PlanIdData?.planInfo?.amount) + Number(sgst) + Number(cgst),
                          //   };
                          //   //

                          //   setUserDataName(fullData);
                          // }}
                          // value={planId}

                          // name={""}
                          // placeItem="Phone Number"
                        />
                      </div>
                      <div class="col-md-6">
                        <Label className="labels mt-2">User Name</Label>

                        <Input
                          required
                          placeholder="Enter the user name"
                          name="user_name"
                          value={userDataName?.userName ? userDataName?.userName : ""}
                          // onChange={(e) => {
                          //   setUserName(e.target.value);
                          // }}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 d-flex  justify-content-end mt-5 p-0">
                    <button
                      type="button"
                      className="btn mr-2"
                      onClick={() => {
                        setIsOpen(false);
                        // setNext(1)
                        setPlanId();
                        setUserDataName();
                        setplanData();
                      }}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-primary mr-3" type="submit">
                      Next <GoArrowRight size={24} />
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          {next === 2 && (
            <>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit3(e);
                }}
              >
                <div className="d-flex justify-content-between  align-items-center mt-5">
                  <div className={`${style.para_headings} `}>Subscriber Personal Details</div>
                  {showData1 === true ? (
                    <>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => {
                          setShowData1(false);
                        }}
                      >
                        <span className={`${style.show_less}`}>Show less</span>
                        <span className="ml-3">
                          <Icon name="chevron-up"></Icon>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => {
                          setShowData1(true);
                        }}
                      >
                        <span className={`${style.show_less}`}>Show More</span>
                        <span className="ml-3">
                          <Icon name="chevron-down"></Icon>
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <hr />
                {showData1 === true ? (
                  <div className="row">
                    <div className="col-md-6">
                      <Label className="labels mt-2">Full Name</Label>
                      <Input placeholder="" disabled name="" value={planData.full_name} className="mt-2" />
                    </div>

                    <div className="col-md-6">
                      <Label className="labels mt-4"></Label>
                      <Input placeholder="" disabled name="" value={planData.email} className="mt-2" />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="d-flex justify-content-between  align-items-center mt-5">
                  <div className={`${style.para_headings} `}>Plan Details</div>
                  {showData2 === true ? (
                    <>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => {
                          setShowData2(false);
                        }}
                      >
                        <span className={`${style.show_less}`}>Show less</span>
                        <span className="ml-3">
                          <Icon name="chevron-up"></Icon>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => {
                          setShowData2(true);
                        }}
                      >
                        <span className={`${style.show_less}`}>Show More</span>
                        <span className="ml-3">
                          <Icon name="chevron-down"></Icon>
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <hr />

                {showData2 === true ? (
                  <>
                    <div className="row ">
                      <div className="col-md-6">
                        <Label className="labels mt-2">Plan Name</Label>
                        <Input placeholder="" disabled name="" value={planData.plan_name} className="mt-2" />
                      </div>

                      <div className="col-md-6">
                        <Label className="labels mt-2">Plan Rate</Label>
                        <Input placeholder="" disabled name="" value={planData.amount} className="mt-2" />
                      </div>
                    </div>
                    <div className="row mt-3 ">
                      <div className="col-md-6">
                        <Label className="labels mt-2">Billing Cycle</Label>
                        <Input placeholder="" disabled name="" value={planData.billingCycleType} className="mt-2" />
                      </div>

                      <div className="col-md-6">
                        <Label className="labels mt-2"></Label>
                        <Input
                          placeholder=""
                          disabled
                          name=""
                          value={planData.billingCycleDate}
                          className="mt-4 mb-0"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="d-flex justify-content-between  align-items-center mt-5">
                  <div className={`${style.para_headings} `}>Internet Speed</div>
                  {showData3 === true ? (
                    <>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => {
                          setShowData3(false);
                        }}
                      >
                        <span className={`${style.show_less}`}>Show less</span>
                        <span className="ml-3">
                          <Icon name="chevron-up"></Icon>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => {
                          setShowData3(true);
                        }}
                      >
                        <span className={`${style.show_less}`}>Show More</span>
                        <span className="ml-3">
                          <Icon name="chevron-down"></Icon>
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <hr />
                {showData3 === true ? (
                  <div className="row">
                    <div className="col-xl-3 col-md-6">
                      <Label className="labels mt-2">Download Speed</Label>
                      <Input
                        placeholder=""
                        disabled
                        name=""
                        value={planData?.download_speed?.split(" ")[0]}
                        className="mt-2"
                      />
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <Label className="labels mt-4"></Label>
                      <Input
                        placeholder=""
                        disabled
                        name=""
                        value={planData?.download_speed?.split(" ")[1]}
                        className="mt-2"
                      />
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <Label className="labels mt-2">Upload Speed</Label>
                      <Input
                        placeholder=""
                        disabled
                        name=""
                        value={planData?.upload_speed?.split(" ")[0]}
                        className="mt-2"
                      />
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <Label className="labels mt-4"></Label>
                      <Input
                        placeholder=""
                        disabled
                        name=""
                        value={planData?.upload_speed?.split(" ")[1]}
                        className="mt-2"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {/* <div className="d-flex justify-content-between  align-items-center mt-5">
                  <div className={`${style.para_headings} `}>Bandwidth Details</div>
                  
                  {showData4 === true ? (
                    <>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => {
                          setShowData4(false);
                        }}
                      >
                        <span className={`${style.show_less}`}>Show less</span>
                        <span className="ml-3">
                          <Icon name="chevron-up"></Icon>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => {
                          setShowData4(true);
                        }}
                      >
                        <span className={`${style.show_less}`}>Show More</span>
                        <span className="ml-3">
                          <Icon name="chevron-down"></Icon>
                        </span>
                      </div>
                    </>
                  )}
                  
                </div>
                <hr />
                {showData4 === true ? (
                  <div className="row">
                    <div className="col-md-3">
                      <Label className="labels mt-2">Download Bandwidth</Label>
                      <Input
                        bsSize="lg"
                        placeholder=""
                        disabled
                        value={planData?.download_bandwidth?.split(" ")[0]}
                        name=""
                        className="mt-2"
                      />
                    </div>

                    <div className="col-md-3">
                      <Label className="labels mt-2"></Label>
                      <Input
                        bsSize="lg"
                        placeholder=""
                        disabled
                        name=""
                        value={planData?.download_bandwidth?.split(" ")[1]}
                        className="mt-4"
                      />
                    </div>
                    <div className="col-md-3">
                      <Label className="labels mt-2">Upload Bandwidth</Label>
                      <Input
                        bsSize="lg"
                        placeholder=""
                        disabled
                        name=""
                        value={planData?.upload_bandwidth?.split(" ")[0]}
                        className="mt-2"
                      />
                    </div>
                    <div className="col-md-3">
                      <Label className="labels mt-2"></Label>
                      <Input
                        bsSize="lg"
                        placeholder=""
                        disabled
                        name=""
                        value={planData?.upload_bandwidth?.split(" ")[1]}
                        className="mt-4"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )} */}

                <div className="col-md-12 d-flex  justify-content-end mt-5 p-0">
                  <button
                    className="btn mr-md-2 mr-sm-2 mr-0"
                    onClick={e => {
                      e.preventDefault();
                      setNext(1);
                    }}
                  >
                    Back
                  </button>
                  <button type="button" className="btn btn-primary mr-md-3 mr-sm-3 mr-1" onClick={() => convertToImg()}>
                    Preview
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Create & Send Email
                  </button>
                </div>
              </form>
            </>
          )}
          {next === 3 && (
            <>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit3(e);
                }}
              >
                <div className="mt-5">
                  <span className={`${style.para_headings} mt-5`}>Invoice Date Selection</span>
                  <div className={`${style.spanStyle}`}>
                    Please select dates to generate an invoice according to the time period selected.
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <Label className="labels mt-2">From</Label>

                      <Input
                        bsSize="lg"
                        placeholder=""
                        type="date"
                        name=""
                        required
                        className="mt-2"
                        onChange={e => {
                          setStartDate(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <Label className="labels mt-2">To</Label>

                      <Input
                        bsSize="lg"
                        placeholder=""
                        type="date"
                        name=""
                        required
                        className="mt-2"
                        onChange={e => {
                          setEndDate(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="mt-4">
                  <button className="btn_genrate_invoice" type="button" onClick={convertToImg}>Genrated Invoice</button>
                </div> */}
                <div className="col-md-12 d-flex  justify-content-end mt-5 p-0">
                  <button
                    className="btn mr-5"
                    onClick={e => {
                      e.preventDefault();
                      setNext(2);
                    }}
                  >
                    Back
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Done
                  </button>
                </div>
              </form>
            </>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default InvoiceModal;
