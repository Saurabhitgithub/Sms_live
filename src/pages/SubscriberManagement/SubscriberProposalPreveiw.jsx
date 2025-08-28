import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import { useDispatch } from "react-redux";
import { addPropsal, getAdminById, getTemplateData, nextSeq } from "../../service/admin";
import { Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
// import logo from "../../../assets/images/jsTree/PdfLogo.png";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import moment from "moment";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { userId, userInfo } from "../../assets/userLoginInfo";
import { sendPdfbyEmail } from "../../assets/commonFunction";
import { success } from "../../Store/Slices/SnackbarSlice";
import Loader from "../../components/commonComponent/loader/Loader";
import { toWords } from "number-to-words";
export default function SubscriberProposalPreveiw({
  open,
  toggle,
  serviceInfo,
  inventeryInfo,
  formData,
  checkInventery,
  checkPlan,
  checkService,
  getTotalAmount,
  invoceIds,
  addTaxesinPrice,
  planData,
  hsndata,
  // setLoader,
  setDisbalebyOneClick,
  disbalebyOneClick,
  setInvoiceIds
}) {
  const [loader, setLoader] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState();

  const [discountCheck, setDiscountCheck] = useState(false);

  const [discountPer, setDiscountper] = useState(0);
  const paramsData = useParams();
  const dispatch = useDispatch();
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
  const adddProposalSubmit = async e => {
    setLoader(true);
    let payloadDatas = {
      invoice_no: `${invoceIds?.code}-${invoceIds?.nextSeq}`,
      invoiceNo_id: invoceIds?.id,
      user_id: planData._id,
      created_by: userId(),
      user_name: userInfo().name,
      user_role: userInfo().role,
      invoice_discount: discountPer,
      grand_total: getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer),
      proposal_for: "subscriber"
    };

    if (formData?.plan_name && checkPlan) {
      payloadDatas.invoice_table = {
        cgst: formData?.cgst,
        sgst: formData?.sgst,
        payment_name: formData?.plan_name,
        description: formData?.shortDescription,
        total_amount: formData?.total,
        amount: formData?.amount,
        service_tax: formData?.serviceTax,
        discount: formData?.discount,
        plan_id: formData?._id,
        discount_amount: (Number(formData?.amount) / 100) * Number(formData?.discount)
      };
    }
    if (inventeryInfo.length !== 0 && checkInventery) {
      payloadDatas.inventory_table = inventeryInfo.map(res => {
        return {
          cgst: res?.cgst,
          sgst: res?.sgst,
          inventory_name: res.label,
          category_name: res.category,
          total_amount: res?.total,
          quantity: res.qty,
          amount: res.price,
          discount_amount: (Number(res.price) / 100) * Number(res.discount),
          discount: res.discount,
          inventory_id: res.value
        };
      });
    }

    if (serviceInfo.length !== 0 && checkService) {
      payloadDatas.service_table = serviceInfo.map(res => {
        return {
          cgst: res?.cgst,
          sgst: res?.sgst,
          service_name: res?.label,
          total_amount: res.total,
          amount: res?.price,
          duration: `${res?.qty} Months`,
          discount: res?.discount,
          discount_amount: (Number(res.price) / 100) * Number(res.discount),
          service_id: res.value
        };
      });
    }
    await addPropsal(payloadDatas)
      .then(async res => {
        await convertToImg(planData?.email, res?.data?.data?._id);
        toggle();
        seqId();
        dispatch(
          success({
            show: true,
            msg: "Proposal send on subscriber email",
            severity: "success"
          })
        );
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };
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
  const [getLogoData, setGetLogoData] = useState({});
  const getLogoFunction = async () => {
    setLoader(true);
    try {
      let response = await getAdminById().then(res => {
        return res.data.data;
      });
      console.log(response, "check logo data");
      setGetLogoData(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getLogoFunction();
    getallTemplate();
  }, []);
  const inVoiceRef1 = useRef(null);
  const inVoiceRef2 = useRef(null);
  const [fullTempInfo, setFullTempInfo] = useState(false);

  async function convertToImg(emailsend, pid) {
    setLoader(true);
    let arr = [inVoiceRef1.current, inVoiceRef2.current];
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
        planData?.email,
        planData?.full_name,
        (getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer)).toFixed(2),
        new Date(),
        `${invoceIds?.code}-${invoceIds?.nextSeq}`,
        "proposal",
        `https://main.d26qjdzv5chp7x.amplifyapp.com/proposalAcknoledge/${pid}/${hsndata?.code}`
      );
    } else {
      const pdfURL = URL.createObjectURL(pdfBlob);
      window.open(pdfURL);
    }
  }
  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      background: "white"
    }
  };

  const getAmountInWords = amount => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "";

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let words = toWords(rupees) + " Rupees";
    if (paise > 0) {
      words += " and " + toWords(paise) + " Paise";
    }
    return words + " only";
  };

  // Calculate the discounted amount
  const calculateDiscountedAmount = () => {
    const total = getTotalAmount();
    const discount = (total / 100) * Number(discountPer || 0);
    return total - discount;
  };

  return (
    <div>
      <Modal isOpen={open} size="xl" centered scrollable>
        <ModalHeader toggle={toggle}>
          <div className={`head_min  bandWidthHeader`}>Proposal</div>
        </ModalHeader>
        <ModalBody>
          <div style={{ width: "930px" }} className="">
            <div
              style={{
                height: "0px",
                overflow: "hidden"
              }}
            >
              <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className=" ">
                <div className="d-flex justify-content-between align-items-center">
                  <img
                    className=""
                    crossOrigin="anonymous"
                    src={
                      fullTempInfo?.logo?.file_url ? fullTempInfo?.logo?.file_url : getLogoData?.profile_image?.file_url
                    }
                    width="150px"
                    alt=""
                  />
                  <h1 className="">Proposal</h1>
                  <div className="">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <div className="flex-direction-column f-18">
                    <div className="fw-600">User Details :</div>
                    <div className="mt-1">
                      <span className="fw-600">Name</span> : {planData?.full_name}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Email</span> : {planData?.email}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Shipping Address</span> : {planData?.installation_address?.pin_code},
                      {planData?.installation_address?.flat_number}, {planData?.installation_address?.city},{" "}
                      {planData?.installation_address?.state}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Billing Address</span> : {planData?.billing_address?.pin_code},
                      {planData?.billing_address?.flat_number}, {planData?.billing_address?.city},{" "}
                      {planData?.billing_address?.state}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Mobile No.</span> : {planData?.mobile_number}
                    </div>
                  </div>
                  <div className="flex-direction-column f-18">
                    <div className="mt-1">
                      <span className="fw-600">Invoice No</span> : {`${invoceIds?.code}-${invoceIds?.nextSeq}`}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Date</span> : {moment().format("DD-MM-YYYY")}
                    </div>
                    <div className="fw-600 mt-4">Sender Details :</div>
                    <div className="mt-1">
                      <span className="fw-600">Name</span> : {userInfo().name}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Address</span> : {userInfo().address}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Mobile No.</span> : {userInfo()?.admin_contact}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Email</span> : {userInfo()?.email}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">GSTIN</span> : {userInfo()?.gstNo}
                    </div>
                  </div>
                </div>
                {formData?.plan_name && checkPlan && (
                  <>
                    <div className="mt-4">
                      <div className="mt-3">
                        <h2>Plan Details</h2>
                        <hr />
                      </div>
                      <table>
                        <thead>
                          <th>Plan Name</th>
                          <th>Category</th>

                          <th>Price</th>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{formData?.plan_name}</td>
                            <td>{formData?.category}</td>

                            <td>Rs{formData?.amount}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="fw-500 mt-3">Description : Plan Description here</div>
                      <hr />
                      <div className="mt-3">
                        <table>
                          <thead>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Discount%</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            <th>HSN/SAC Code</th>
                            <th>Total</th>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{formData?.plan_name}</td>
                              <td>Rs{formData?.amount}</td>
                              <td>{formData?.discount}%</td>

                              <td>
                                Rs.
                                {formData?.cgst
                                  ? `${(Number(formData?.amount) * (Number(formData?.cgst) / 100)).toFixed(2)} (${
                                      formData?.cgst
                                    }%) `
                                  : 0}
                              </td>
                              <td>
                                Rs.
                                {formData?.sgst
                                  ? `${(Number(formData?.amount) * (Number(formData?.sgst) / 100)).toFixed(2)} (${
                                      formData?.sgst
                                    }%)`
                                  : 0}
                              </td>
                              <td>{hsndata?.code}</td>
                              <td>
                                Rs.
                                {addTaxesinPrice(
                                  Number(formData?.amount) -
                                    (Number(formData?.amount) / 100) * Number(formData?.discount),
                                  formData?.cgst,
                                  formData?.sgst
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {inventeryInfo.length !== 0 && checkInventery && (
                  <>
                    <div className="mt-4">
                      <div className="mt-3">
                        <h2>Inventory Details</h2>
                        <hr />
                      </div>
                      <div className="mt-3">
                        <table>
                          <thead>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Discount%</th>
                            <th>SGST</th>
                            <th>CGST</th>
                            <th>Quantity</th>
                            <th>Total</th>
                          </thead>
                          <tbody>
                            {inventeryInfo?.map(res => (
                              <>
                                <tr>
                                  <td>{res.label}</td>
                                  <td>{res.category}</td>
                                  <td>{res.price}</td>
                                  <td>{res.discount}%</td>
                                  <td>
                                    Rs.
                                    {res?.cgst
                                      ? `${(Number(res?.price) * (Number(res?.cgst) / 100)).toFixed(2)} (${res?.cgst}%)`
                                      : 0}
                                  </td>
                                  <td>
                                    Rs.
                                    {res?.scgst
                                      ? `${(Number(res?.price) * (Number(res?.scgst) / 100)).toFixed(2)} (${
                                          res?.scgst
                                        }%)`
                                      : 0}
                                  </td>
                                  <td>{res.qty}</td>
                                  <td>{res?.totalWithTax.toFixed(2)}</td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
                {serviceInfo.length !== 0 && checkService && (
                  <>
                    <div className="mt-4">
                      <div className="mt-3">
                        <h2>Service Details</h2>
                        <hr />
                      </div>
                      <div className="mt-3">
                        <table>
                          <thead>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Discount%</th>
                            <th>SGST</th>
                            <th>CGST</th>
                            <th>Duration</th>
                            <th>Total</th>
                          </thead>
                          <tbody>
                            {serviceInfo.map(res => (
                              <>
                                <tr>
                                  <td>{res?.label}</td>
                                  <td>{res?.price}</td>
                                  <td>{res?.discount}%</td>
                                  <td>
                                    Rs.
                                    {res?.cgst
                                      ? `${(Number(res?.price) * (Number(res?.cgst) / 100)).toFixed(2)} (${res?.cgst}%)`
                                      : 0}
                                  </td>
                                  <td>
                                    Rs.
                                    {res?.sgst
                                      ? `${(Number(res?.price) * (Number(res?.sgst) / 100)).toFixed(2)} (${res?.sgst}%)`
                                      : 0}
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">{res?.qty}Months</div>
                                  </td>
                                  <td>{res?.totalWithTax.toFixed(2)}</td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* <div className="mt-5 pt-5 text-center">
                  Page 1
                </div> */}
              </div>
              <div style={styleSheet.maincontainer} ref={inVoiceRef2} id="print2" className=" ">
                <div className="d-flex justify-content-between align-items-center">
                  <img
                    className=""
                    crossOrigin="anonymous"
                    src={
                      fullTempInfo?.logo?.file_url ? fullTempInfo?.logo?.file_url : getLogoData?.profile_image?.file_url
                    }
                    width="150px"
                    alt=""
                  />
                  <h1 className="">Proposal</h1>
                  <div className="">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  </div>
                </div>

                <div className="mt-5">
                  <h2>Grand Total</h2>
                  <hr />
                </div>
                <div className="mt-3">
                  <table>
                    <thead>
                      <th>Plan Total</th>
                      <th>Inventory Total</th>
                      <th>Service Total</th>
                      <th>Total</th>
                      <th>Discount%</th>
                      <th>Grand Total</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          Rs.
                          {addTaxesinPrice(
                            Number(formData?.amount) - (Number(formData?.amount) / 100) * Number(formData?.discount),
                            formData?.cgst,
                            formData?.sgst
                          )}
                        </td>
                        <td>
                          Rs
                          {inventeryInfo.reduce((accumulator, object) => {
                            return accumulator + Number(object.price);
                          }, 0)}
                        </td>
                        <td>
                          Rs
                          {serviceInfo.reduce((accumulator, object) => {
                            return accumulator + Number(object.price);
                          }, 0)}
                        </td>
                        <td>{getTotalAmount().toFixed(2)}</td>
                        <td>{discountPer}%</td>
                        {/* <td>Rs.{(getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer)).toFixed(2)}</td> */}
                        <td> Rs. {calculateDiscountedAmount().toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-2">
                    <div style={{ fontWeight: "bold" }}>Grand Total (Words)</div>
                    <div style={{ fontSize: "0.9em" }}>({getAmountInWords(calculateDiscountedAmount())})</div>
                  </div>
                </div>
                <div className="mt-3 mb-3 d-flex justify-content-end">
                  <div> Authorized Signature</div>
                </div>
                <div className="mt-5 f-18">
                  <b className="">Terms & Conditions :</b>
                  {}
                  {fullTempInfo?.plan && fullTempInfo?.plan.trim().length !== 0 && (
                    <>
                      <div className="mt-4">
                        <div className="fw-600">Plan</div>{" "}
                        <div dangerouslySetInnerHTML={{ __html: fullTempInfo?.plan }} />
                      </div>
                    </>
                  )}
                  {fullTempInfo?.inventory && fullTempInfo?.inventory.trim().length !== 0 && (
                    <>
                      <div className="mt-4">
                        <div className="fw-600">Inventory</div>{" "}
                        <div dangerouslySetInnerHTML={{ __html: fullTempInfo?.inventory }} />
                      </div>
                    </>
                  )}
                  {fullTempInfo?.service && fullTempInfo?.service.trim().length !== 0 && (
                    <>
                      <div className="mt-4">
                        <div className="fw-600">Service</div>{" "}
                        <div dangerouslySetInnerHTML={{ __html: fullTempInfo?.service }} />
                      </div>
                    </>
                  )}
                </div>
                {/* <div className="mt-5 pt-5 text-center">
                  Page 2
                </div> */}
              </div>
            </div>
          </div>
          <div className="f-18 fw-600"> Template</div>

          <select
            className="form-control"
            onChange={e => {
              setSelectedTemp(e.target.value);
              setFullTempInfo(templateInfo.find(res => res?._id?.toString() === e?.target?.value?.toString()));
            }}
            value={selectedTemp}
          >
            <option selected disabled>
              Select Template
            </option>
            {templateInfo.map(res => (
              <>
                <option className="text-capitalize" value={res._id}>
                  {res.name}
                </option>
              </>
            ))}
          </select>
          {}
          {formData?.plan_name && checkPlan && (
            <>
              <div className="f-18 fw-600">Plan Details</div>
              <Table hover className="mt-3">
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Price</th>
                    <th>Billing Cycle</th>
                    <th>Discount %</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formData?.plan_name}</td>
                    <td>{formData?.amount}</td>
                    <td>{`${formData?.billingCycleDate} ${formData?.billingCycleType}`}</td>
                    <td>{formData?.discount}%</td>
                    <td>
                      {Number(formData?.amount) - (Number(formData?.amount) / 100) * Number(formData?.discount || 0)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
          {inventeryInfo.length !== 0 && checkInventery && (
            <>
              <div className="f-18 fw-600 mt-4">Inventory</div>
              <Table hover className="mt-3">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    {/* <th>CGST</th>
                <th>SGST</th> */}
                    <th>Quantity</th>
                    <th>Discount %</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inventeryInfo?.map(res => (
                    <>
                      <tr>
                        <td>{res.label}</td>
                        <td>{res.category}</td>
                        <td>{res.price}</td>
                        {/* <td>RS9</td>
                    <td>RS9</td> */}
                        <td>{res.qty}</td>
                        <td>{res.discount}%</td>
                        <td>{res?.total}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            </>
          )}
          {serviceInfo.length !== 0 && checkService && (
            <>
              <div className="f-18 fw-600 mt-4">Services</div>
              <Table hover className="mt-3">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    {/* <th>CGST</th>
                <th>SGST</th> */}
                    <th>Duration</th>
                    <th>Discount %</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {}
                  {}

                  {serviceInfo.map(res => (
                    <>
                      <tr>
                        <td>{res?.label}</td>

                        <td>{res?.price}</td>
                        {/* <td>RS9</td>
                    <td>RS9</td> */}
                        <td>
                          <div className="d-flex align-items-center">{res?.qty}Months</div>
                        </td>
                        <td>{res?.discount}%</td>
                        <td>{res?.total}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          <div className="row">
            <div className="col-md-6">
              <label>Do you want to enable Discount?</label>
              <div className="custom-control custom-control-sm custom-switch mt-2">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="discountSwitch"
                  name="active_status"
                  onChange={e => {
                    setDiscountCheck(e.target.checked);
                  }}

                  // defaultChecked={data?.view_setting}
                  // onChange={(e) => {
                  //     setData((pre) => {
                  //         return {
                  //             ...pre,
                  //             view_setting: e.target.checked,
                  //         };
                  //     });
                  //     updateData("view", e.target.checked);
                  // }}
                  // disabled={!helpPermission.includes("Ticket  owner can view Ticket  ( Help Desk Assignment )")}
                />
                <label className="custom-control-label f-16 text-black" htmlFor="discountSwitch">
                  Yes
                </label>
              </div>
            </div>
            {discountCheck && (
              <>
                <div className="col-md-6">
                  <label>Discount (In %)</label>
                  <input
                    placeholder="Enter Discount in percent"
                    value={discountPer}
                    type="number"
                    onChange={e => {
                      if (e?.target?.value?.length <= 2) {
                        setDiscountper(e.target.value);
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <div className="fw-600 f-20">Grand Total</div>
            <div className="text-primary fw-500 f-18">
              {(getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer)).toFixed(2)}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
            <button className="btn border" onClick={() => convertToImg()}>
              Preview
            </button>
            {loader ? (
              <Loader />
            ) : (
              <button
                className="btn btn-primary ml-3"
                disabled={!disbalebyOneClick && !selectedTemp}
                onClick={() => {
                  adddProposalSubmit();
                  setDisbalebyOneClick(true);
                }}
              >
                Send Proposal
              </button>
            )}
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
