import React, { useEffect, useRef, useState } from "react";
import { FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { userId, userInfo } from "../../assets/userLoginInfo";
import {
  addInvoiceData,
  addPropsal,
  getAdminById,
  nextSeq,
  sendWhatsappWithLink,
  updateInvoiceById,
  uploadDocument,
  getHsnandSacCode,
  phonePePayment
} from "../../service/admin";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import moment from "moment";
import { useDispatch } from "react-redux";
import { sendPdfbyEmail } from "../../assets/commonFunction";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { gstStateCodes, url } from "../../utils/Utils";
import { toWords } from "number-to-words";
export default function InvoicePreview({
  open,
  toggle,
  serviceInfo,
  inventeryInfo,
  planInfo,
  checkInventery,
  checkPlan,
  checkService,
  getTotalAmount,
  invoceIds,
  addTaxesinPrice,
  hsndata,
  setLoader,
  setDisbalebyOneClick,
  disbalebyOneClick,
  templateInfo,
  selectedTemp,
  setSelectedTemp,
  subcriberId,
  markPaid,
  id,
  tds
}) {
  const calculateAmountAfterTDS = total => {
    if (markPaid) {
      let amountTds = (total * (tds / 100)).toFixed(2);
      return total - amountTds;
    } else {
      return total;
    }
  };
  const [discountCheck, setDiscountCheck] = useState(false);
  const [fullTempInfo, setFullTempInfo] = useState(false);
  const [email, setEmail] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const [getLogoData, setGetLogoData] = useState({});
  const [getHnsAndSac, setGetHsnAndSac] = useState([]);

  const getData = async () => {
    setLoader(true);
    await getHsnandSacCode()
      .then(res => {
        let dataReverse = [...res.data.data];
        let reverseData = dataReverse.reverse();

        setGetHsnAndSac(reverseData);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const getLogoFunction = async () => {
    setLoader(true);
    try {
      let response = await getAdminById().then(res => {
        return res.data.data;
      });
      // console.log(response, "check logo data");
      setGetLogoData(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getLogoFunction();
    getData();
  }, []);
  let history = useHistory();
  const [discountPer, setDiscountper] = useState(0);
  const dispatch = useDispatch();
  const addInvoicePreviewSubmit = async e => {
    setLoader(true);
    let payloadDatas = {
      invoice_no: `${invoceIds.code}-${invoceIds.nextSeq}`,
      invoiceNo_id: invoceIds?.id,
      user_id: subcriberId?._id,
      created_by: userId(),
      user_name: userInfo()?.name,
      user_role: userInfo()?.role,
      invoice_discount: discountPer,
      tds: tds,
      grand_total: calculateAmountAfterTDS(
        getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer)?.toFixed(2)
      ),
      template_id: fullTempInfo?._id
    };

    if (planInfo?.plan_name && checkPlan) {
      payloadDatas.invoice_table = {
        cgst: planInfo?.cgst,
        sgst: planInfo?.sgst,
        payment_name: planInfo.plan_name,
        description: planInfo.shortDescription,
        total_amount: planInfo?.total,
        amount: planInfo?.amount,
        service_tax: planInfo?.serviceTax,
        discount: planInfo.discount,
        plan_id: planInfo._id,
        discount_amount: (Number(planInfo?.amount) / 100) * Number(planInfo?.discount)
      };
    }
    if (inventeryInfo.length !== 0 && checkInventery) {
      payloadDatas.inventory_table = inventeryInfo.map(res => {
        return {
          cgst: res?.cgst,
          sgst: res?.sgst,
          inventory_name: res.label,
          category_name: res.category,
          total_amount: res?.totalWithTax,
          quantity: res.qty,
          hsc_sac: res.hsc_sac,
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
          total_amount: res.totalWithTax,
          amount: res?.price,
          hsc_sac: res.hsc_sac,
          duration: `${res?.qty} Months`,
          discount: res?.discount,
          discount_amount: (Number(res.price) / 100) * Number(res.discount),
          service_id: res.value
        };
      });
    }
    if (userInfo().role === "isp admin") {
      payloadDatas.org_id = userInfo()._id;
    } else {
      payloadDatas.org_id = userInfo().org_id;
      payloadDatas.isp_id = userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id;
    }
    if (markPaid) {
      payloadDatas.paymentStatus = "paid";
    }
    if (id === "new") {
      await addInvoiceData(payloadDatas)
        .then(async res => {
          await convertToImg(subcriberId?.email, res?.data?.data?._id);
          toggle();
          seqId();
          dispatch(
            success({
              show: true,
              msg: "Invoice send on lead email",
              severity: "success"
            })
          );
          history.push("/paymentsAndBillings");
          setLoader(false);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    } else {
      await updateInvoiceById(id, payloadDatas)
        .then(async res => {
          await convertToImg(subcriberId?.email, res?.data?.data?._id);
          toggle();
          seqId();
          dispatch(
            success({
              show: true,
              msg: "Invoice send on lead email",
              severity: "success"
            })
          );
          history.push("/paymentsAndBillings");
          setLoader(false);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  };
  const seqId = async () => {
    let payloadData = { paid: "perfoma" };
    try {
      const res = await nextSeq(payloadData).then(res => {
        return res.data.data;
      });
    } catch (err) {
      console.log(err);
    }
  };
  const inVoiceRef1 = useRef(null);
  const inVoiceRef2 = useRef(null);

  async function convertToImg(emailsend, Invoice_id) {
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
      if (email) {
        let payloadPhonepe = {
          name: subcriberId?.full_name,
          mobile_number: subcriberId.mobile_number,
          amount: Math?.round((getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer))?.toFixed(2) * 100),
          userID: subcriberId._id,
          planId: planInfo._id,
          invoiceId: Invoice_id
        };
        let phonepe = {
          url: ""
        };
        if (!markPaid) {
          phonepe = await phonePePayment(payloadPhonepe).then(res => {
            return res.data.data;
          });
        }

        console.log(phonepe.url , "phonepe Url data");

        await sendPdfbyEmail(
          pdfBlob,
          subcriberId?.email,
          subcriberId?.full_name,
          (getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer))?.toFixed(2),
          new Date(),
          `${invoceIds.code}-${invoceIds.nextSeq}`,
          "invoice",
          phonepe.url
        );
      }
      if (whatsapp) {
        let fileForm = new FormData();
        fileForm.append("upload", pdfBlob);
        let uploadResponse = await uploadDocument(fileForm).then(res => res?.data?.data[0]);
        await sendWhatsappWithLink({
          to: subcriberId.mobile_number,
          templateid: "753209",
          placeholders: [
            "paid",
            `${invoceIds.code}-${invoceIds.nextSeq}`,
            `Rs.${calculateAmountAfterTDS(
              (getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer))?.toFixed(2)
            )}`,
            uploadResponse?.file_url
          ],
          url: uploadResponse?.file_url,
          filename: "Invoice"
        });
      }
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
  const gstCode = subcriberId?.gst_no?.slice(-2)?.trim();
  // console.log(gstCode);
  const totalAmount = Number(getTotalAmount()) || 0;
  const discount = Number(discountPer) || 0;

  const discountedAmount = totalAmount - (totalAmount * discount) / 100;
  const finalAmountAfterTDS = calculateAmountAfterTDS(Number(discountedAmount.toFixed(2))) || 0;

  //  Calculate GSTs before render (inside your component)
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;

  //  PLAN
  if (planInfo?.amount) {
    const planAmount = Number(planInfo.amount || 0);
    const planDiscount = Number(planInfo.discount || 0);
    const taxable = planAmount - (planAmount * planDiscount) / 100;

    totalCGST += (taxable * Number(planInfo.cgst || 0)) / 100;
    totalSGST += (taxable * Number(planInfo.sgst || 0)) / 100;
    totalIGST += (taxable * Number(planInfo.igst || 0)) / 100;
  }

  //  INVENTORY
  inventeryInfo?.forEach(item => {
    const price = Number(item.price || 0);
    const discount = Number(item.discount || 0);
    const qty = Number(item.qty || 1);
    const taxable = (price - (price * discount) / 100) * qty;

    totalCGST += (taxable * Number(item.cgst || 0)) / 100;
    totalSGST += (taxable * Number(item.sgst || 0)) / 100;
    totalIGST += (taxable * Number(item.igst || 0)) / 100;
  });

  //  SERVICE
  serviceInfo?.forEach(item => {
    const price = Number(item.price || 0);
    const discount = Number(item.discount || 0);
    const qty = Number(item.qty || 1);
    const taxable = (price - (price * discount) / 100) * qty;

    totalCGST += (taxable * Number(item.cgst || 0)) / 100;
    totalSGST += (taxable * Number(item.sgst || 0)) / 100;
    totalIGST += (taxable * Number(item.igst || 0)) / 100;
  });


  const getPlaceOfSupply = gst_no => {
  if (!gst_no || gst_no.length < 2) return "N/A";
  const code =gst_no.slice(0, 2);
  return gstStateCodeMap[code] || "Unknown";
};

const gstStateCodeMap = {
  "01": "Jammu and Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra and Nagar Haveli and Daman and Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman and Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh (Newly Added)",
  "97": "Other Territory",
  "99": "Centre Jurisdiction"
};
  return (
    <>
      <Modal isOpen={open} size="xl" centered scrollable>
        <ModalHeader toggle={toggle}>
          <div className={`head_min  bandWidthHeader`}>{markPaid ? "Invoice" : "Perfoma Invoice"}</div>
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
                  <h1  style={{ marginRight: "50px" }} className="">{markPaid ? "Invoice" : "Perfoma Invoice"}</h1>
                  {/* <div className="">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  </div> */}
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <div className="flex-direction-column f-18">
                    <div className="fw-600">User Details :</div>
                    <div className="mt-1">
                      <span className="fw-600">Name</span> : {String(subcriberId?.full_name).replace(/\s*\(.*?\)/, '')}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Email</span> : {subcriberId?.email}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Shipping Address</span> : {subcriberId?.installation_address?.pin_code},
                      {subcriberId?.installation_address?.flat_number}, {subcriberId?.installation_address?.city},{" "}
                      {subcriberId?.installation_address?.state}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Billing Address</span> : {subcriberId?.billing_address?.pin_code},
                      {subcriberId?.billing_address?.flat_number}, {subcriberId?.billing_address?.city},{" "}
                      {subcriberId?.billing_address?.state}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Mobile No.</span> : {subcriberId?.mobile_number}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Gst No.</span> : {subcriberId?.gst_no}
                    </div>
                 <div className="mt-1">
                   <span className="fw-600">Place of Supply</span> : {getPlaceOfSupply(subcriberId?.gst_no  )}
                 </div>
                  </div>
                  <div className="flex-direction-column f-18">
                    <div className="mt-1">
                      <span className="fw-600">Invoice No</span> : {`${invoceIds.code}-${invoceIds.nextSeq}`}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Invoice Date</span> : {moment().format("DD-MM-YYYY")}
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
                {/* {planInfo?.plan_name && checkPlan && (
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
                            <td>{planInfo?.plan_name}</td>
                            <td>{planInfo?.category}</td>

                            <td>Rs{planInfo?.amount}</td>
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
                            <th>HSN/SAC Code</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            {/* <th>Quantity</th> 
                            <th>Total</th>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{planInfo?.plan_name}</td>
                              <td>Rs{planInfo?.amount}</td>
                              <td>{planInfo?.discount}%</td>
                              <td>{getHnsAndSac?.[0]?.code}</td>
                              <td>
                                Rs.
                                {planInfo?.cgst
                                  ? `${(Number(planInfo?.amount) * (Number(planInfo?.cgst) / 100))?.toFixed(2)} (${
                                      planInfo?.cgst
                                    }%) `
                                  : 0}
                              </td>
                              <td>
                                Rs.
                                {planInfo?.sgst
                                  ? `${(Number(planInfo?.amount) * (Number(planInfo?.sgst) / 100))?.toFixed(2)} (${
                                      planInfo?.sgst
                                    }%)`
                                  : 0}
                              </td>
                              {/* <td>1</td> 
                              <td>
                                Rs.
                                {addTaxesinPrice(
                                  Number(planInfo?.amount) -
                                    (Number(planInfo?.amount) / 100) * Number(planInfo?.discount),
                                  planInfo?.cgst,
                                  planInfo?.sgst
                                )?.toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )} */}

  {planInfo?.plan_name && checkPlan && (
                  <>
                    <div className="mt-4">
                      <div className="mt-3">
                        <h2>Plan Details</h2>
                        <hr />
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th>Plan Name</th>
                            <th>Category</th>
                            <th>Taxable</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{planInfo?.plan_name}</td>
                            <td>{planInfo?.category}</td>
                            <td>Rs {planInfo?.amount}</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="fw-500 mt-3">Description : Plan Description here</div>
                      <hr />

                      {/* Calculations */}
                      {(() => {
                        const price = Number(planInfo?.amount || 0);
                        const discount = Number(planInfo?.discount || 0);
                        const taxable = price - (price * discount) / 100;

                        const cgstRate = Number(planInfo?.cgst || 0);
                        const sgstRate = Number(planInfo?.sgst || 0);
                        const igstRate = Number(planInfo?.igst || 0);

                        const cgstAmt = (taxable * cgstRate) / 100;
                        const sgstAmt = (taxable * sgstRate) / 100;
                        const igstAmt = (taxable * igstRate) / 100;

                        const totalWithTax = taxable + cgstAmt + sgstAmt + igstAmt;

                        return (
                          <div className="mt-3">
                            <table>
                              <thead>
                                <tr>
                                  <th>Item</th>
                                  <th>Taxable</th>
                                  <th>Discount%</th>
                                  <th>HSN/SAC Code</th>
                                  <th>CGST</th>
                                  <th>SGST</th>
                                  <th>IGST</th>
                                  <th>Total Taxable</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{planInfo?.plan_name}</td>
                                  <td>Rs {price.toFixed(2)}</td>
                                  <td>{discount}%</td>
                                  <td>{getHnsAndSac?.[0]?.code}</td>

                                  <td>
                                    {cgstRate}%<br />
                                    Rs. {cgstAmt.toFixed(2)}
                                  </td>
                                  <td>
                                    {sgstRate}%<br />
                                    Rs. {sgstAmt.toFixed(2)}
                                  </td>
                                  <td>
                                    {igstRate}%<br />
                                    Rs. {igstAmt.toFixed(2)}
                                  </td>
                                  <td>Rs. {totalWithTax.toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </div>
                  </>
                )}


                {/* {inventeryInfo.length !== 0 && checkInventery && (
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
                            <th>HSN/SAC Code</th>
                            <th>Price</th>
                            <th>Discount%</th>
                            <th>SGST</th>
                            <th>CGST</th>
                            <th>Quantity</th>
                            <th>Total</th>
                          </thead>
                          <tbody>
                            {/* {console.log(inventeryInfo, "hello")} 
                            {inventeryInfo?.map(res => (
                              <>
                                <tr>
                                  <td>{res.label}</td>
                                  <td>{res.category}</td>

                                  <td>{res.hsc_sac}</td>
                                  <td>{res.price}</td>
                                  <td>{res.discount}%</td>
                                  <td>
                                    Rs.
                                    {res?.cgst
                                      ? `${(Number(res?.price) * (Number(res?.cgst) / 100))?.toFixed(2)} (${
                                          res?.cgst
                                        }%)`
                                      : 0}
                                  </td>
                                  <td>
                                    Rs.
                                    {res?.scgst
                                      ? `${(Number(res?.price) * (Number(res?.scgst) / 100))?.toFixed(2)} (${
                                          res?.scgst
                                        }%)`
                                      : 0}
                                  </td>
                                  <td>{res.qty}</td>
                                  <td>{res?.totalWithTax?.toFixed(2)}</td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )} */}


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
                            <tr>
                              <th>Item</th>
                              <th>Category</th>
                              <th>HSN/SAC Code</th>
                              <th>Taxable</th>
                              <th>Discount%</th>
                              <th>CGST</th>
                              <th>SGST</th>
                              <th>IGST</th>
                              <th>Quantity</th>
                              <th>Total Taxable</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventeryInfo?.map((res, index) => {
                              const price = Number(res?.price || 0);
                              const discount = Number(res?.discount || 0);
                              const qty = Number(res?.qty || 1);
                              const taxable = (price - (price * discount) / 100) * qty;

                              const cgstRate = Number(res?.cgst || 0);
                              const sgstRate = Number(res?.sgst || 0);
                              const igstRate = Number(res?.igst || 0);

                              const cgstAmt = (taxable * cgstRate) / 100;
                              const sgstAmt = (taxable * sgstRate) / 100;
                              const igstAmt = (taxable * igstRate) / 100;

                              const totalWithTax = taxable + cgstAmt + sgstAmt + igstAmt;

                              return (
                                <tr key={index}>
                                  <td>{res.label}</td>
                                  <td>{res.category}</td>
                                  <td>{res.hsc_sac}</td>
                                  <td>Rs. {price.toFixed(2)}</td>
                                  <td>{discount}%</td>

                                  <td>
                                    {cgstRate}%<br />
                                    Rs. {cgstAmt.toFixed(2)}
                                  </td>
                                  <td>
                                    {sgstRate}%<br />
                                    Rs. {sgstAmt.toFixed(2)}
                                  </td>
                                  <td>
                                    {igstRate}%<br />
                                    Rs. {igstAmt.toFixed(2)}
                                  </td>

                                  <td>{qty}</td>
                                  <td>Rs. {totalWithTax.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* {serviceInfo.length !== 0 && checkService && (
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
                            <th>HSN/SAC Code</th>
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
                                  <td>{res.hsc_sac}</td>
                                  <td>
                                    Rs.
                                    {res?.cgst
                                      ? `${(Number(res?.price) * (Number(res?.cgst) / 100))?.toFixed(2)} (${
                                          res?.cgst
                                        }%)`
                                      : 0}
                                  </td>
                                  <td>
                                    Rs.
                                    {res?.sgst
                                      ? `${(Number(res?.price) * (Number(res?.sgst) / 100))?.toFixed(2)} (${
                                          res?.sgst
                                        }%)`
                                      : 0}
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">{res?.qty}Months</div>
                                  </td>
                                  <td>{res?.totalWithTax?.toFixed(2)}</td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )} */}


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
                            <tr>
                              <th>Item</th>
                              <th>Taxable</th>
                              <th>Discount%</th>
                              <th>HSN/SAC Code</th>
                              <th>CGST</th>
                              <th>SGST</th>
                              <th>IGST</th>
                              <th>Quantity</th>
                              <th>Total Taxable</th>
                            </tr>
                          </thead>
                          <tbody>
                            {serviceInfo.map((res, index) => {
                              const price = Number(res?.price || 0);
                              const discount = Number(res?.discount || 0);
                              const qty = Number(res?.qty || 1); // duration in months
                              const taxable = (price - (price * discount) / 100) * qty;

                              const cgstRate = Number(res?.cgst || 0);
                              const sgstRate = Number(res?.sgst || 0);
                              const igstRate = Number(res?.igst || 0);

                              const cgstAmt = (taxable * cgstRate) / 100;
                              const sgstAmt = (taxable * sgstRate) / 100;
                              const igstAmt = (taxable * igstRate) / 100;

                              const totalWithTax = taxable + cgstAmt + sgstAmt + igstAmt;

                              return (
                                <tr key={index}>
                                  <td>{res?.label}</td>
                                  <td>Rs. {price.toFixed(2)}</td>
                                  <td>{discount}%</td>
                                  <td>{res?.hsc_sac}</td>

                                  <td>
                                    {cgstRate}%<br />
                                    Rs. {cgstAmt.toFixed(2)}
                                  </td>
                                  <td>
                                    {sgstRate}%<br />
                                    Rs. {sgstAmt.toFixed(2)}
                                  </td>
                                  <td>
                                    {igstRate}%<br />
                                    Rs. {igstAmt.toFixed(2)}
                                  </td>

                                  <td>{qty}</td>
                                  <td>Rs. {totalWithTax.toFixed(2)}</td>
                                </tr>
                              );
                            })}
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
                  <h1 style={{ marginRight: "50px" }} className="">{markPaid ? "Invoice" : "Perfoma Invoice"}</h1>
                  {/* <div className="">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  </div> */}
                </div>

                <div className="mt-5">
                  <h2>Total Invoice Value</h2>
                  <hr />
                </div>
                <div className="mt-3">
                  <table>
                    <thead>
                      <th>Plan Total Taxable</th>
                      <th>Inventory Total Taxable</th>
                      <th>Service Total Taxable</th>
                       <th>Total Taxable</th> 
                      {/* <th>TDS</th>  */}
                      <th>Discount%</th>
                                             <th>CGST</th>
        <th>SGST</th>
        <th>IGST</th>

                      <th>Total Invoice Value</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
  Rs.
  {addTaxesinPrice(
    Number(planInfo?.amount || 0) - (Number(planInfo?.amount || 0) / 100) * Number(planInfo?.discount || 0),
    Number(planInfo?.cgst || 0),
    Number(planInfo?.sgst || 0)
  )?.toFixed(2)}
</td>
{/* <td>
  Rs
  {inventeryInfo?.reduce((accumulator, object) => {

    console.log(object, "object in inventory preview");
    const price = Number(object?.price || 0);
    const total = Number(object?.total || 0);
    const cgst = Number(object?.cgst || 0);
    const sgst = Number(object?.sgst || 0);

    const gst = price * (cgst / 100) + price * (sgst / 100);

    return accumulator + total + gst;
  }, 0).toFixed(2)}
</td> */}

{/* <td>
  Rs
  {inventeryInfo?.reduce((accumulator, object) => {
    console.log(object, "object in inventory preview on edit");
    const price = Number(object?.price || 0);
    const qty = Number(object?.qty || 0);
    const total = Number(object?.total || 0);
    const cgst = Number(object?.cgst || 0);
    const sgst = Number(object?.sgst || 0);

    const cgstAmount = (price * cgst / 100) * qty;
    const sgstAmount = (price * sgst / 100) * qty;

    return accumulator + total + cgstAmount + sgstAmount;
  }, 0).toFixed(2)}
</td> */}


<td>
  Rs
  {inventeryInfo?.reduce((accumulator, object) => {
    const price = Number(object?.price || 0);
    const qty = Number(object?.qty || 0);
    const cgst = Number(object?.cgst || 0);
    const sgst = Number(object?.sgst || 0);

    // Prefer totalWithTax if available (Edit Mode)
    const totalWithTax = Number(object?.totalWithTax || 0);
    if (totalWithTax) {
      return accumulator + totalWithTax;
    }

    // Fallback: Calculate total with tax (Create Mode or when totalWithTax missing)
    const base = price * qty;
    const cgstAmount = base * (cgst / 100);
    const sgstAmount = base * (sgst / 100);

    return accumulator + base + cgstAmount + sgstAmount;
  }, 0).toFixed(2)}
</td>

                      {/* <td>
  Rs
  {Array.isArray(serviceInfo)
    ? serviceInfo.reduce((accumulator, object) => {
      console.log(object, "object in invoice preview service");
        const price = Number(object?.price || 0);
        const total = Number(object?.total || 0);
        const cgst = Number(object?.cgst || 0);
        const sgst = Number(object?.sgst || 0);

        const gst = price * (cgst / 100) + price * (sgst / 100);

        return accumulator + total + gst;
      }, 0).toFixed(2)
    : "0.00"}
</td> */}

<td>
  Rs
  {Array.isArray(serviceInfo)
    ? serviceInfo.reduce((accumulator, object) => {
        const price = Number(object?.price || 0);
        const qty = Number(object?.qty || 0);
        const total = Number(object?.total || 0);
        const cgst = Number(object?.cgst || 0);
        const sgst = Number(object?.sgst || 0);

        const cgstAmount = (price * cgst / 100) * qty;
        const sgstAmount = (price * sgst / 100) * qty;

        return accumulator + total + cgstAmount + sgstAmount;
      }, 0).toFixed(2)
    : "0.00"}
</td>

                        <td>{getTotalAmount()?.toFixed(2)}</td>
                        {/* <td>{getTotalAmount()?.toFixed(2) * (tds / 100)}</td> */}
                        <td>{discountPer}%</td>
                       

                                             
                                            <td>Rs. {totalCGST?.toFixed(2)}</td>
                        <td>Rs. {totalSGST?.toFixed(2)}</td>
                        <td>Rs. {totalIGST?.toFixed(2)}</td>
                        <td>
                          Rs.
                          {calculateAmountAfterTDS(
                            (getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer))?.toFixed(2)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-2">
                    <div style={{ fontWeight: "bold" }}>Total Invoice Value (Words)</div>
                    <div style={{ fontSize: "0.9em" }}>({toWords(Math.floor(finalAmountAfterTDS))} Rupees Only)</div>
                  </div>
                </div>
                <div className="mt-3 mb-3 d-flex justify-content-end">
                  <div> Authorized Signature</div>
                </div>
                <div className="mt-5 f-18">
                  <b className="">Terms & Conditions :</b>

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
          <div className="f-18 fw-600 mt-2">Send On</div>
          <div className="d-flex mb-2">
            <FormGroup check className="d-flex align-items-center">
              <input
                class="form-check-input input"
                type="checkbox"
                checked={email}
                id="checkbox120"
                onChange={e => {
                  setEmail(e.target.checked);
                }}
              />
              <Label className="ml-2 pt-1 f-14 pr-2 " for="checkbox120" check>
                <b>Email</b>
              </Label>
            </FormGroup>
            <FormGroup check className="d-flex align-items-center">
              <input
                class="form-check-input input"
                type="checkbox"
                checked={whatsapp}
                id="checkbox120"
                onChange={e => {
                  setWhatsapp(e.target.checked);
                }}
              />
              <Label className="ml-2 pt-1 f-14 " for="checkbox120" check>
                <b>Whatsapp</b>
              </Label>
            </FormGroup>
          </div>
          {/* {planInfo?.plan_name && checkPlan && (
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
                    <td>{planInfo?.plan_name}</td>
                    <td>{planInfo?.amount}</td>
                    <td>{`${planInfo?.billingCycleDate} ${planInfo?.billingCycleType}`}</td>
                    <td>{planInfo?.discount}%</td>
                    {/* <td>{Number(planInfo?.amount) - (Number(planInfo?.amount) / 100) * Number(planInfo?.discount)}</td> 
                       <td>
                      {(
                        parseFloat(planInfo?.amount || 0) -
                        (parseFloat(planInfo?.amount || 0) * parseFloat(planInfo?.discount || 0)) / 100
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )} */}

          {/* {inventeryInfo.length !== 0 && checkInventery && (
            <>
              <div className="f-18 fw-600 mt-4">Inventory</div>
              <Table hover className="mt-3">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    {/* <th>CGST</th>
                <th>SGST</th>
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
                    <td>RS9</td> 
                        <td>{res.qty}</td>
                        <td>{res.discount}%</td>
                        <td>{res?.total}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            </>
          )} */}
          {/* {serviceInfo.length !== 0 && checkService && (
            <>
              <div className="f-18 fw-600 mt-4">Services</div>
              <Table hover className="mt-3">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    {/* <th>CGST</th>
                <th>SGST</th> 
                    <th>Duration</th>
                    <th>Discount %</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceInfo.map(res => (
                    <>
                      <tr>
                        <td>{res?.label}</td>

                        <td>{res?.price}</td>
                        {/* <td>RS9</td>
                    <td>RS9</td> 
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
          )} */}

                 {planInfo?.plan_name && checkPlan && (
  <>
    <div className="f-18 fw-600 mt-4">Plan Details</div>
    <Table hover className="mt-3">
      <thead>
        <tr>
          <th>Plan Name</th>
          <th>Taxable</th>
          <th>Billing Cycle</th>
          <th>Discount %</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>Total Taxable</th>
        </tr>
      </thead>
      <tbody>
        {(() => {
          const price = Number(planInfo?.amount || 0);
          const discount = Number(planInfo?.discount || 0);
          const taxable = price - (price * discount) / 100;

          const cgstRate = Number(planInfo?.cgst || 0);
          const sgstRate = Number(planInfo?.sgst || 0);
          const igstRate = Number(planInfo?.igst || 0);

          const cgstAmt = (taxable * cgstRate) / 100;
          const sgstAmt = (taxable * sgstRate) / 100;
          const igstAmt = (taxable * igstRate) / 100;

          const total = taxable + cgstAmt + sgstAmt + igstAmt;

          return (
            <tr>
              <td>{planInfo?.plan_name}</td>
              <td>₹{price.toFixed(2)}</td>
              <td>{`${planInfo?.billingCycleDate} ${planInfo?.billingCycleType}`}</td>
              <td>{discount}%</td>
              <td>
                {cgstRate}%<br />
                <small>₹{cgstAmt.toFixed(2)}</small>
              </td>
              <td>
                {sgstRate}%<br />
                <small>₹{sgstAmt.toFixed(2)}</small>
              </td>
              <td>
                {igstRate}%<br />
                <small>₹{igstAmt.toFixed(2)}</small>
              </td>
              <td>₹{total.toFixed(2)}</td>
            </tr>
          );
        })()}
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
          <th>Taxable</th>
          <th>Quantity</th>
          <th>Discount %</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>Total Taxable</th>
        </tr>
      </thead>
      <tbody>
        {inventeryInfo?.map((res, index) => {
          const price = Number(res?.price || 0);
          const qty = Number(res?.qty || 1);
          const discount = Number(res?.discount || 0);

          const discountedPrice = price - (price * discount) / 100;
          const taxable = discountedPrice * qty;

          const cgstRate = Number(res?.cgst || 0);
          const sgstRate = Number(res?.sgst || 0);
          const igstRate = Number(res?.igst || 0);

          const cgstAmt = (taxable * cgstRate) / 100;
          const sgstAmt = (taxable * sgstRate) / 100;
          const igstAmt = (taxable * igstRate) / 100;

          const total = taxable + cgstAmt + sgstAmt + igstAmt;

          return (
            <tr key={index}>
              <td>{res.label}</td>
              <td>{res.category}</td>
              <td>₹{price.toFixed(2)}</td>
              <td>{qty}</td>
              <td>{discount}%</td>
              <td>
                {cgstRate}%<br />
                <small>₹{cgstAmt.toFixed(2)}</small>
              </td>
              <td>
                {sgstRate}%<br />
                <small>₹{sgstAmt.toFixed(2)}</small>
              </td>
              <td>
                {igstRate}%<br />
                <small>₹{igstAmt.toFixed(2)}</small>
              </td>
              <td>₹{total.toFixed(2)}</td>
            </tr>
          );
        })}
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
          <th>Taxable</th>
          <th>Quantity</th>
          <th>Discount %</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>Total Taxable</th>
        </tr>
      </thead>
      <tbody>
        {/* {serviceInfo.map((res, index) => {
          const price = Number(res?.price || 0);
          const discount = Number(res?.discount || 0);
          const qty = Number(res?.qty || 1); // Duration in months
          const discountedPrice = price - (price * discount) / 100;
          const taxable = discountedPrice * qty;

          const cgstRate = Number(res?.cgst || 0);
          const sgstRate = Number(res?.sgst || 0);
          const igstRate = Number(res?.igst || 0);

          const cgstAmt = (taxable * cgstRate) / 100;
          const sgstAmt = (taxable * sgstRate) / 100;
          const igstAmt = (taxable * igstRate) / 100;

          const total = taxable + cgstAmt + sgstAmt + igstAmt;

          return (
            <tr key={index}>
              <td>{res?.label}</td>
              <td>₹{price.toFixed(2)}</td>
              <td>{qty} Months</td>
              <td>{discount}%</td>
              <td>
                {cgstRate}% <br />
                <small>₹{cgstAmt.toFixed(2)}</small>
              </td>
              <td>
                {sgstRate}% <br />
                <small>₹{sgstAmt.toFixed(2)}</small>
              </td>
              <td>
                {igstRate}% <br />
                <small>₹{igstAmt.toFixed(2)}</small>
              </td>
              <td>₹{total.toFixed(2)}</td>
            </tr>
          );
        })} */}
{serviceInfo.map((res, index) => {
  console.log(res, "serviceInfo in invoice preview before pdf");

  const price = Number(res?.price) || 0;
  const discount = Number(res?.discount) || 0;

  const qty = Number(res?.qty) || 1;

  const discountedPrice = price - (price * discount) / 100;
  const taxable = discountedPrice * qty;

  const cgstRate = Number(res?.cgst) || 0;
  const sgstRate = Number(res?.sgst) || 0;
  const igstRate = Number(res?.igst) || 0;

  const cgstAmt = (taxable * cgstRate) / 100;
  const sgstAmt = (taxable * sgstRate) / 100;
  const igstAmt = (taxable * igstRate) / 100;

  const total = taxable + cgstAmt + sgstAmt + igstAmt;

  return (
    <tr key={index}>
      <td>{res?.label || "-"}</td>
      <td>₹{price.toFixed(2)}</td>
      <td>{qty}</td>
      <td>{discount}%</td>
      <td>
        {cgstRate}% <br />
        <small>₹{cgstAmt.toFixed(2)}</small>
      </td>
      <td>
        {sgstRate}% <br />
        <small>₹{sgstAmt.toFixed(2)}</small>
      </td>
      <td>
        {igstRate}% <br />
        <small>₹{igstAmt.toFixed(2)}</small>
      </td>
      <td>₹{total.toFixed(2)}</td>
    </tr>
  );
})}


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
                  <Input
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
            <div className="fw-600 f-20">Total Invoice Value</div>
            <div className="text-primary fw-500 f-18">
              {/* {calculateAmountAfterTDS((getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer))?.toFixed(2))} */}


{calculateAmountAfterTDS(
  Number(
    (
      (Number(getTotalAmount()) || 0) -
      ((Number(getTotalAmount()) || 0) * (Number(discountPer) || 0)) / 100
    ).toFixed(2)
  )
)}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
            <button className="btn border" onClick={() => convertToImg()} disabled={!selectedTemp}>
              Preview
            </button>
            <button
              className="btn btn-primary ml-3"
              disabled={disbalebyOneClick && !selectedTemp}
              onClick={() => {
                addInvoicePreviewSubmit();
                setDisbalebyOneClick(true);
              }}
            >
              Send Invoice
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}
