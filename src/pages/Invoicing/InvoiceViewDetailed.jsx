import React, { useState, useEffect, useRef } from "react";
import style from "./style.module.css";
import {
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import { FaHashtag } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { Table } from "reactstrap";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import Loader from "../../components/commonComponent/loader/Loader";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import moment from "moment";
import { getAdminById, getHsnandSacCode, paymentInfoByInvoiceId } from "../../service/admin";
import { userInfo } from "../../assets/userLoginInfo";
import { toWords } from "number-to-words";

const InvoiceViewDetailed = ({ ViewOpen, setViewOpen, rowData, exportData1 }) => {
  console.log(ViewOpen);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [details, setDetails] = useState();
  const inVoiceRef1 = useRef(null);
  const inVoiceRef2 = useRef(null);

  const [activeTab, toggleTab] = useState("0");
  const [creditNote, setcreditNote] = useState(false);

  const [loader, setLoader] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [hsndata, setHsnData] = useState([]);


console.log(details?.pdftemplates, "details");

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

  const toggle = () => setViewOpen({ status: false });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paymentHistoryFunc = async () => {
    try {
      let data = ViewOpen?.data;
      let result = await paymentInfoByInvoiceId(data.invoiceId ? data.invoiceId : data._id).then(res => res.data.data);
      // console.log(result);
      setPaymentHistory(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setDetails(ViewOpen?.data);
    if (ViewOpen.status) {
      paymentHistoryFunc();
    }
  }, [ViewOpen]);
  const [getLogoData, setGetLogoData] = useState({});
  const getLogoFunction = async () => {
    setLoader(true);
    try {
      let response = await getAdminById().then(res => {
        return res.data.data;
      });
      setGetLogoData(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getHsnCode();
    getLogoFunction();
  }, []);

  // async function convertToImg() {
  //   setLoader(true);
  //   let arr = [inVoiceRef1.current];
  //   let photoArr = [];
  //   const pdf = new jsPDF();
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   for (let index = 0; index < arr.length; index++) {
  //     const res = arr[index];
  //     await htmlToImage
  //       .toPng(res, { quality: 0.5 }) // Reduced quality to 0.5
  //       .then(function (dataUrl) {
  //         photoArr.push(dataUrl);
  //         const imgProps = pdf.getImageProperties(dataUrl);
  //         const imgWidth = pdfWidth;
  //         const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //         // Scale image to fit within PDF dimensions
  //         const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
  //         const scaledWidth = imgProps.width * scaleFactor;
  //         const scaledHeight = imgProps.height * scaleFactor;

  //         pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST"); // Added compression option
  //         if (index !== arr.length - 1) {
  //           pdf.addPage();
  //         }
  //       })
  //       .catch(function (error) {
  //         console.error("oops, something went wrong!", error);
  //       })
  //       .finally(() => {
  //         if (index === arr.length - 1) {
  //           setLoader(false);
  //         }
  //       });
  //   }

  //   pdf.save("invoice.pdf");
  // }
  const convertToImg = async note => {
    setcreditNote(note);
    setLoader(true);
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const elements = [inVoiceRef1.current, inVoiceRef2.current];

    try {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const dataUrl = await htmlToImage.toPng(element, { quality: 0.5 });
        const imgProps = pdf.getImageProperties(dataUrl);

        const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
        const scaledWidth = imgProps.width * scaleFactor;
        const scaledHeight = imgProps.height * scaleFactor;

        pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight);
        if (i !== elements.length - 1) {
          pdf.addPage();
        }
      }

      pdf.save(note ? "Credit_Note.pdf" : "Invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoader(false);
    }
  };
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
  const TableRow = ({ label, value, className }) => (
    <tr>
      <td className={`text-nowrap  ${className}`}>{label}</td>
      <td className={`text-nowrap ${className}`}>{value}</td>
    </tr>
  );

  const bandWidthCycle = (num, cycle) => {
    if (num === "1") {
      return `${num} ${cycle}`;
    } else {
      let str = cycle + "s";
      return `${num} ${str}`;
    }
  };

  const baseAmount = Number(details?.invoice_table?.amount) || 0;
  const discount = Number(details?.invoice_table?.discount) || 0;
  const cgstPercentage = Number(details?.invoice_table?.cgst) || 0;
  const sgstPercentage = Number(details?.invoice_table?.sgst) || 0;

  // Calculate discount amount
  const amountAfterDiscount = +(baseAmount * (1 - discount / 100)).toFixed(2);

  // Calculate tax amounts
  const cgstAmount = +(amountAfterDiscount * (cgstPercentage / 100)).toFixed(2);
  const sgstAmount = +(amountAfterDiscount * (sgstPercentage / 100)).toFixed(2);

  // Calculate total amount
  const totalAmount = +(amountAfterDiscount + cgstAmount + sgstAmount).toFixed(2);

  // Logging values for debugging

  // const calculatePlanTotal = () => {
  //   return details?.planInfo?.amount
  //     ? Number(details?.planInfo.amount) * (1 - Number(details?.planInfo.discount || 0) / 100) +
  //         (Number(details?.planInfo.cgst || 0) + Number(details?.planInfo.sgst || 0))
  //     : 0;
  // };


  const calculatePlanTotal = () => {
  if (!details?.planInfo?.amount) return 0;

  const amount = Number(details.planInfo.amount);
  const discount = Number(details.planInfo.discount || 0);
  const cgstPercent = Number(details.planInfo.cgst || 0);
  const sgstPercent = Number(details.planInfo.sgst || 0);

  const discountedAmount = amount * (1 - discount / 100);
  const cgst = discountedAmount * (cgstPercent / 100);
  const sgst = discountedAmount * (sgstPercent / 100);

  const total = discountedAmount + cgst + sgst;
  return total;
};


 const calculateInventoryTotal = () => {
  return details?.inventory_table?.reduce((acc, item) => {
    const amount = Number(item?.amount || 0);
    const quantity = Number(item?.quantity || 1);
    const discount = Number(item?.discount || 0);

    // Apply discount first
    const discountedAmount = amount * (1 - discount / 100);

    // GST percentages
    const cgstPercent = Number(item?.cgst || 0);
    const sgstPercent = Number(item?.sgst || 0);

    // GST amounts
    const cgst = discountedAmount * (cgstPercent / 100);
    const sgst = discountedAmount * (sgstPercent / 100);

    // Total per item with tax
    const totalPerItem = (discountedAmount + cgst + sgst) * quantity;

    return acc + totalPerItem;
  }, 0) || 0;
};


  // const calculateInventoryTotal = () => {
  //   return details?.inventory_table
  //     ? details.inventory_table.reduce((sum, item) => {
  //       console.log(item, "item of inventory");
  //         const itemTotal =
  //           (Number(item.amount) * (1 - Number(item.discount || 0) / 100) +
  //             Number(item.cgst || 0) +
  //             Number(item.sgst || 0)) *
  //           Number(item.quantity || 1);
  //         return sum + itemTotal;
  //       }, 0)
  //     : 0;
  // };

  // const calculateServiceTotal = () => {
  //   return details?.service_table
  //     ? details.service_table.reduce((sum, item) => {
  //         const itemTotal =
  //           Number(item.amount) * (1 - Number(item.discount || 0) / 100) +
  //           (Number(item.cgst || 0) + Number(item.sgst || 0) )
  //         return sum + itemTotal;
  //       }, 0)
  //     : 0;
  // };
// const calculateServiceTotal = () => {
//   return details?.service_table
//     ? details.service_table.reduce((sum, item) => {
//       console.log(item, "item of service");
//         const itemTotal = 
//           (Number(item.amount) * (1 - Number(item.discount || 0) / 100) +
//           Number(item.cgst || 0) + Number(item.sgst || 0)) *
//           (Number(item.duration?.toString().match(/\d+(\.\d+)?/)?.[0]) || 1);
//         return sum + itemTotal;
//       }, 0)
//     : 0;
// };


const calculateServiceTotal = () => {
  return details?.service_table?.reduce((sum, item) => {
    const baseAmount = Number(item.amount || 0);
    const discount = Number(item.discount || 0);
    const qtyOrDuration = Number(item.duration?.toString().match(/\d+(\.\d+)?/)?.[0]) || 1;

    const discountedAmount = baseAmount * (1 - discount / 100);
    
    const cgstPercent = Number(item.cgst || 0);
    const sgstPercent = Number(item.sgst || 0);

    const cgst = discountedAmount * (cgstPercent / 100);
    const sgst = discountedAmount * (sgstPercent / 100);

    const total = (discountedAmount + cgst + sgst) * qtyOrDuration;

    return sum + total;
  }, 0) || 0;
};


console.log(details?.service_table,"servicetable")

  const calculateAmountAfterTDS = (total, tds) => {
    if (tds) {
      let amountTds = (total * (tds / 100)).toFixed(2);
      return total - amountTds;
    } else {
      return total;
    }
  };

  const amountInWords = amount => {
    if (!amount) return "";
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    let words = ` ${toWords(rupees)} ` + " Rupees";
    if (paise > 0) {
      words += ` and ${toWords(paise)} paise`;
    }
    return `${words} only`;
  };

  // Initialize GST totals
let totalCGST = 0;
let totalSGST = 0;
let totalIGST = 0;

// Plan CGST/SGST/IGST
if (details?.planInfo?.amount) {
  const planAmount = Number(details.planInfo.amount || 0);
  const planDiscount = Number(details.planInfo.discount || 0);
  const taxable = planAmount - (planAmount * planDiscount) / 100;

  totalCGST += (taxable * Number(details.planInfo.cgst || 0)) / 100;
  totalSGST += (taxable * Number(details.planInfo.sgst || 0)) / 100;
  totalIGST += (taxable * Number(details.planInfo.igst || 0)) / 100;
}

// Inventory GSTs
details?.inventory_table?.forEach(item => {
  const price = Number(item.amount || 0);
  const discount = Number(item.discount || 0);
  const qty = Number(item.quantity || 1);
  const taxable = (price - (price * discount) / 100) * qty;

  totalCGST += (taxable * Number(item.cgst || 0)) / 100;
  totalSGST += (taxable * Number(item.sgst || 0)) / 100;
  totalIGST += (taxable * Number(item.igst || 0)) / 100;
});

// Service GSTs
details?.service_table?.forEach(item => {
  const price = Number(item.amount || 0);
  const discount = Number(item.discount || 0);
const qty = Number(
  item.duration?.toString().match(/\d+(\.\d+)?/)?.[0] || 1
);
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
    <div>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <div style={{  marginRight: "50px" }} className="">
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
                  details?.templateInfo?.logo?.file_url
                    ? details?.templateInfo?.logo?.file_url
                    : getLogoData?.profile_image?.file_url
                }
                width="150px"
                alt=""
              />
              {/* <h1 className="">{creditNote ? "Credit Note" : "Invoice No."}</h1> */}
               <h1 style={{ marginRight: "50px" }} className="">{creditNote ? "Credit Note" : "Invoice"}</h1>
              {/* <div className="">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </div> */}
            </div>
            <div className="d-flex justify-content-between mt-3">
              <div className="flex-direction-column f-18">
                <div className="fw-600">User Details :</div>
                <div className="mt-1">
                  <span className="fw-600">Name</span> : {String(details?.subscriberInfo?.full_name).replace(/\s*\(.*?\)/, '')}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Email</span> : {details?.subscriberInfo?.email}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Shipping Address</span> :{" "}
                  {details?.subscriberInfo?.installation_address?.pin_code},
                  {details?.subscriberInfo?.installation_address?.flat_number},{" "}
                  {details?.subscriberInfo?.installation_address?.city},{" "}
                  {details?.subscriberInfo?.installation_address?.state}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Billing Address</span> : {details?.subscriberInfo?.billing_address?.pin_code}
                  ,{details?.subscriberInfo?.billing_address?.flat_number},{" "}
                  {details?.subscriberInfo?.billing_address?.city}, {details?.subscriberInfo?.billing_address?.state}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Mobile No.</span> : {details?.subscriberInfo?.mobile_number}
                </div>
                           <div className="mt-1">
                      <span className="fw-600">Gst No.</span> : {details?.subscriberInfo?.gst_no}
                    </div>
                   <div className="mt-1">
                   <span className="fw-600">Place of Supply</span> : {getPlaceOfSupply(details?.subscriberInfo?.gst_no  )}
                 </div>
              </div>
              <div className="flex-direction-column f-18">
                <div className="mt-1">
                  <span className="fw-600"> {creditNote ? "Credit Note" : "Invoice No"}</span> :{" "}
                  {creditNote ? details?.credit_note : `${details?.invoice_no}`}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Invoice Date</span> : {moment().format("DD-MM-YYYY")}
                </div>
                <div className="fw-600 mt-4">Sender Details :</div>
                <div className="mt-1">
                  <span className="fw-600">Name</span> : {userInfo()?.name}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Address</span> : {userInfo()?.address}
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
            {/* {planInfo?.plan_name && checkPlan &&( */}
            {/* {true && (
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

                      <th>Taxable</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{details?.invoice_table?.payment_name}</td>
                        <td>{details?.planInfo?.category}</td>

                        <td>Rs.{details?.planInfo?.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="fw-500 mt-3">Description : Plan Description here</div>
                  <hr />
                  <div className="mt-3">
                    <table>
                      <thead>
                        <th>Item</th>
                        <th>Taxable</th>
                        <th>Discount%</th>
                        <th>CGST</th>
                        <th>SGST</th>
                        <th>HSN/SAC Code</th>
                        <th>Quantity</th>
                        <th>Total Taxable</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{details?.invoice_table?.payment_name}</td>
                          <td>Rs.{details?.invoice_table?.amount}</td>
                          <td>{details?.invoice_table?.discount}%</td>
                          <td>
                            {details?.invoice_table?.cgst && details?.invoice_table?.amount
                              ? `${(
                                  Number(details?.invoice_table?.amount) *
                                  (Number(details?.invoice_table?.cgst) / 100)
                                ).toFixed(2)} (${details?.invoice_table?.cgst}%)`
                              : 0}
                          </td>
                          {/* <td>{details?.invoice_table?.cgst}</td> 

                          <td>
                            {details?.invoice_table?.sgst && details?.invoice_table?.amount
                              ? `${(
                                  Number(details?.invoice_table?.amount) *
                                  (Number(details?.invoice_table?.sgst) / 100)
                                ).toFixed(2)} (${details?.invoice_table?.sgst}%)`
                              : 0}
                          </td>
                          <td>{hsndata?.[0]?.code}</td>
                          <td>{details?.invoice_table?.sgst}</td>
                          {/* <td>1</td> 
                          <td>Rs.{totalAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )} */}

            {/* {planInfo?.plan_name && checkPlan && ( */}
             {true && (
  <>
    <div className="f-18 fw-600 mt-4">Plan Details</div>
    <Table hover className="mt-3">
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Taxable</th>
          <th>Discount %</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>HSN/SAC</th>
          <th>Total Taxable</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {(() => {
            const amount = Number(details?.invoice_table?.amount || 0);
            const discount = Number(details?.invoice_table?.discount || 0);
            const cgst = Number(details?.invoice_table?.cgst || 0);
            const sgst = Number(details?.invoice_table?.sgst || 0);
            const igst = Number(details?.invoice_table?.igst || 0);
            const discountedPrice = amount - (amount * discount) / 100;
            const cgstAmt = (discountedPrice * cgst) / 100;
            const sgstAmt = (discountedPrice * sgst) / 100;
            const igstAmt = (discountedPrice * igst) / 100;
            const totalTaxable = discountedPrice + cgstAmt + sgstAmt + igstAmt;

            return (
              <>
                <td>{details?.invoice_table?.payment_name || "-"}</td>
                <td>{details?.planInfo?.category || "-"}</td>
                <td>₹{amount.toFixed(2)}</td>
                <td>{discount}%</td>
                <td>
                  {cgst}%<br />
                  <small>₹{cgstAmt.toFixed(2)}</small>
                </td>
                <td>
                  {sgst}%<br />
                  <small>₹{sgstAmt.toFixed(2)}</small>
                </td>
                <td>
                  {igst}%<br />
                  <small>₹{igstAmt.toFixed(2)}</small>
                </td>
                <td>{hsndata?.[0]?.code || "-"}</td>
                <td>₹{totalTaxable.toFixed(2)}</td>
              </>
            );
          })()}
        </tr>
      </tbody>
    </Table>
    <div className="fw-500 mt-3">
      Description: {details?.invoice_table?.description || "Plan Description here"}
    </div>
  </>
)}


            {/* {details?.inventory_table?.length > 0 && (
              <>
                <div className="mt-5">
                  <div className="mt-3">
                    <h2>Inventory Details</h2>
                    <hr />
                  </div>
                  <div className="mt-3">
                    <table>
                      <thead>
                        <th>Item</th>
                        <th>Category</th>
                        <th>HSN/SAC Code</th>
                        <th>Taxable</th>
                        <th>Discount%</th>
                        <th>SGST</th>
                        <th>CGST</th>
                        <th>Quantity</th>
                        <th>Total Taxable</th>
                      </thead>
                      <tbody>
                        {details?.inventory_table?.map((res, index) => {
                          const amount = Number(res?.amount) || 0; // Default to 0 if undefined or invalid
                          const sgstPercent = Number(res?.sgst) || 0;
                          const cgstPercent = Number(res?.cgst) || 0;
                          const discountPercent = Number(res?.discount) || 0;
                          const quantity = Number(res?.quantity) || 1; // Default quantity to 1

                          // Calculations
                          const sgst = amount * (sgstPercent / 100);
                          const cgst = amount * (cgstPercent / 100);
                          const discount = amount * (discountPercent / 100);
                          const totalAmount = (amount - discount + sgst + cgst) * quantity;
                          return (
                            <tr key={index}>
                              <td>{res.inventory_name}</td>
                              <td>{res.category_name}</td>
                              <td>{res.hsc_sac}</td>
                              <td>Rs.{res.amount.toFixed(2)}</td>
                              <td>{res.discount}%</td>
                              <td>
                                Rs.{sgst.toFixed(2)} ({sgstPercent}%)
                              </td>
                              <td>
                                Rs.{cgst.toFixed(2)} ({cgstPercent}%)
                              </td>

                              <td>{res.quantity}</td>
                              <td>Rs.{totalAmount.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )} */}

            {details?.inventory_table?.length > 0 && (
  <>
    <div className="f-18 fw-600 mt-5">Inventory Details</div>
    <Table hover className="mt-3">
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
        {details?.inventory_table?.map((res, index) => {
          const price = Number(res?.amount) || 0;
          const qty = Number(res?.quantity) || 1;
          const discount = Number(res?.discount) || 0;

          const cgstRate = Number(res?.cgst) || 0;
          const sgstRate = Number(res?.sgst) || 0;
          const igstRate = Number(res?.igst) || 0;

          const discountedPrice = price - (price * discount) / 100;
          const taxable = discountedPrice * qty;

          const cgstAmt = (taxable * cgstRate) / 100;
          const sgstAmt = (taxable * sgstRate) / 100;
          const igstAmt = (taxable * igstRate) / 100;

          const total = taxable + cgstAmt + sgstAmt + igstAmt;

          return (
            <tr key={index}>
              <td>{res.inventory_name}</td>
              <td>{res.category_name}</td>
              <td>{res.hsc_sac}</td>
              <td>₹{price.toFixed(2)}</td>
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
              <td>{qty}</td>
              <td>₹{total.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  </>
)}

            {/* {details?.service_table?.length > 0 && (
              <>
                <div className="mt-5">
                  <div className="mt-3">
                    <h2>Service Details</h2>
                    <hr />
                  </div>
                  <div className="mt-3">
                    <table>
                      <thead>
                        <th>Item</th>
                        <th>Taxable</th>
                        <th>HSN/SAC Code</th>
                        <th>Discount%</th>
                        <th>SGST</th>
                        <th>CGST</th>
                        <th>Quantity</th>
                        <th>Total Taxable</th>
                      </thead>
                      <tbody>
                        {details?.service_table?.map(res => {
                          const amount = Number(res?.amount) || 0; // Default to 0 if undefined or invalid
                          const sgstPercent = Number(res?.sgst) || 0;
                          const cgstPercent = Number(res?.cgst) || 0;
                          const discountPercent = Number(res?.discount) || 0;
                          const quantity = Number(res?.quantity) || 1; // Default quantity to 1

                          // Calculations
                          const sgst = amount * (sgstPercent / 100);
                          const cgst = amount * (cgstPercent / 100);
                          const discount = amount * (discountPercent / 100);
                          const totalAmount = (amount - discount + sgst + cgst) * quantity;
                          return (
                            <>
                              <tr>
                                <td>{res?.service_name}</td>

                                <td>Rs.{res?.amount}</td>
                                <td>{res.hsc_sac}</td>
                                <td>{res?.discount}%</td>
                                <td>
                                  Rs.{sgst.toFixed(2)} ({sgstPercent}%)
                                </td>
                                <td>
                                  Rs.{cgst.toFixed(2)} ({cgstPercent}%)
                                </td>

                                <td>
                                  <div className="d-flex align-items-center">{res?.duration}</div>
                                </td>

                                <td>Rs.{totalAmount.toFixed(2)}</td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )} */}

            {details?.service_table?.length > 0 && (
  <>
    <div className="f-18 fw-600 mt-5">Service Details</div>
    <Table hover className="mt-3">
      <thead>
        <tr>
          <th>Item</th>
          <th>Taxable</th>
          <th>HSN/SAC Code</th>
          <th>Discount%</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>Quantity</th>
          <th>Total Taxable</th>
        </tr>
      </thead>
      <tbody>
        {details?.service_table?.map((res, index) => {
          const price = Number(res?.amount) || 0;
          // const qty = Number(res?.duration) || 1; // Quantity = Duration
            const qty =
    res?.quantity !== undefined
      ? Number(res?.quantity)
      : Number((res?.duration || "").split(" ")[0]) || 1;
          const discount = Number(res?.discount) || 0;

          const cgstRate = Number(res?.cgst) || 0;
          const sgstRate = Number(res?.sgst) || 0;
          const igstRate = Number(res?.igst) || 0;

          const discountedPrice = price - (price * discount) / 100;
          const taxable = discountedPrice * qty;

          const cgstAmt = (taxable * cgstRate) / 100;
          const sgstAmt = (taxable * sgstRate) / 100;
          const igstAmt = (taxable * igstRate) / 100;

          const total = taxable + cgstAmt + sgstAmt + igstAmt;

          return (
            <tr key={index}>
              <td>{res?.service_name}</td>
              <td>₹{price.toFixed(2)}</td>
              <td>{res.hsc_sac}</td>
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
              <td>{qty}</td>
              <td>₹{total.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
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
                  details?.templateInfo?.logo?.file_url
                    ? details?.templateInfo?.logo?.file_url
                    : getLogoData?.profile_image?.file_url
                }
                width="150px"
                alt=""
              />
              <h1 style={{ marginRight: "50px" }} className="">Invoice</h1>
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
                  <tr>
                    <th>Plan Total Taxable</th>
                    <th>Inventory Total Taxable</th>
                    <th>Service Total Taxable</th>
                    <th>Total Taxable</th>
                    {/* <th>TDS</th> */}
                    <th>Discount%</th>
                    <th>CGST</th>
    <th>SGST</th>
    <th>IGST</th>
                    <th>Total Invoice Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* Plan Total */}
                    <td>Rs.{details?.planInfo?.amount ? calculatePlanTotal()?.toFixed(2) : 0}</td>

                    {/* Inventory Total */}
                    <td>Rs.{details?.inventory_table ? calculateInventoryTotal()?.toFixed(2) : 0}</td>

                    {/* Service Total */}
                    <td>Rs.{details?.service_table ? calculateServiceTotal()?.toFixed(2) : 0}</td>

                    {/* Total (sum of plan, inventory, and service totals) */}
                    <td>
                      Rs.{(calculatePlanTotal() + calculateInventoryTotal() + calculateServiceTotal())?.toFixed(2)}
                    </td>
                    {/* <td>
                      Rs.
                      {details?.tds
                        ? (
                            (calculatePlanTotal() + calculateInventoryTotal() + calculateServiceTotal())?.toFixed(2) *
                            (details?.tds / 100)
                          ).toFixed(2)
                        : 0}
                    </td> */}
                    {/* Discount% */}
                    <td>{details?.discount || 0}%</td>
                    <td>Rs. {totalCGST.toFixed(2)}</td>
    <td>Rs. {totalSGST.toFixed(2)}</td>
    <td>Rs. {totalIGST.toFixed(2)}</td>

                    {/* Grand Total */}
                    {/* <td>Rs.{calculateAmountAfterTDS(details?.grand_total?.toFixed(2), details?.tds?.toFixed(2))}</td> */}
                    <td>Rs. {calculateAmountAfterTDS(details?.grand_total?.toFixed(2), details?.tds?.toFixed(2))} </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2">
                <div style={{ fontWeight: "bold" }}>Total Invoice Value (Words)</div>
                <div style={{ fontSize: "0.9em" }}>({amountInWords(details?.grand_total)})</div>
              </div>
            </div>
            <div className="mt-3 mb-3 d-flex justify-content-end">
              <div> Authorized Signature</div>
            </div>
            {/* <div className="mt-5 pt-5 text-center">
                  Page 2
                </div> */}
            {/* <div className="mt-5 f-18">
              <b className="">Terms & Conditions :</b>
              {details?.pdftemplates?.plan && details?.pdftemplates?.plan.trim().length !== 0 && (
                <>
                  <div className="mt-4">
                    <div className="fw-600">Plan</div>{" "}
                    <div dangerouslySetInnerHTML={{ __html: details?.pdftemplates?.plan }} />
                  </div>
                </>
              )}
              {details?.pdftemplates?.inventory && details?.pdftemplates?.inventory.trim().length !== 0 && (
                <>
                  <div className="mt-4">
                    <div className="fw-600">Inventory</div>{" "}
                    <div dangerouslySetInnerHTML={{ __html: details?.pdftemplates?.inventory }} />
                  </div>
                </>
              )}
              {details?.pdftemplates?.service && details?.pdftemplates?.service.trim().length !== 0 && (
                <>
                  <div className="mt-4">
                    <div className="fw-600">Service</div>{" "}
                    <div dangerouslySetInnerHTML={{ __html: details?.pdftemplates?.service }} />
                  </div>
                </>
              )}
            </div> */}
            <div className="mt-5 f-18">
  <b className="">Terms & Conditions :</b>

  {details?.templateInfo?.plan?.trim()?.length > 0 && (
    <div className="mt-4">
      <div className="fw-600">Plan</div>
      <div dangerouslySetInnerHTML={{ __html: details.templateInfo.plan }} />
    </div>
  )}

  {details?.templateInfo?.inventory?.trim()?.length > 0 && (
    <div className="mt-4">
      <div className="fw-600">Inventory</div>
      <div dangerouslySetInnerHTML={{ __html: details.templateInfo.inventory }} />
    </div>
  )}

  {details?.templateInfo?.service?.trim()?.length > 0 && (
    <div className="mt-4">
      <div className="fw-600">Service</div>
      <div dangerouslySetInnerHTML={{ __html: details.templateInfo.service }} />
    </div>
  )}
</div>

          </div>
        </div>
      </div>
      <Modal isOpen={ViewOpen.status} toggle={toggle} scrollable size="xl" className="p-md-4 p-sm-3 p-0">
        <ModalHeader toggle={toggle} className="d flex align-items-center justify-content-between">
          <div className="head_min">{details?.inVoiceType === "paid" ? "Paid Invoice" : "Perfoma Invoice"}</div>
        </ModalHeader>
        <ModalBody className="p-md-4 p-sm-3 p-0">
          <div className="row">
            <div className="col-xl-6">
              <div className="row">
                <div className="col-7 d-flex">
                  <FaHashtag className="f-22 d-sm-block d-none" color="gray" />
                  <div className="ml-sm-3 ml-1">
                    <div className="f-18 text-secondary fw-600">Invoice Number:</div>
                    <div className="fw-500 text-black">{details?.invoice_no}</div>
                  </div>
                </div>

                <div className="col-5">
                  <div className="f-18 text-secondary fw-600">Created on:</div>
                  <div className="fw-500 text-black">{moment(details?.createdAt).format("DD-MM-YYYY")}</div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 mt-xl-0 mt-3">
              <div className="row">
                <div className="col-7 d-flex">
                  <IoPersonSharp className="f-22 d-sm-block d-none" color="gray" />
                  <div className="ml-sm-3 ml-1">
                    <div className="f-18 text-secondary fw-600">User Name:</div>
                    <div className="fw-500 text-black">{details?.subscriberInfo?.full_name}</div>
                  </div>
                </div>

                <div className="col-5">
                  <div className="f-18 text-secondary fw-600">Phone Number:</div>
                  <div className="fw-500 text-black">{details?.subscriberInfo?.mobile_number}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-md-5 mt-sm-5 mt-3">
            {/*
             */}
            <div class="col-md-6 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
              <div>Total Amount</div>
              <Input value={details?.grand_total?.toFixed(2)} disabled className="border-0" />
            </div>
          </div>
          <div className="mt-4">
            <hr />
          </div>
          <div class="mt-4 f-24">Invoice Details</div>
          <div className="mt-4">
            <Nav tabs>
              {/* {details?.invoice_table && details.invoice_table.length > 0 && (
                 <NavItem className="pr-0">
                 <NavLink
                   className={`text-secondary fw-bold ${actpaymentsAndBillingsiveTab == "0" ? "activeTab1" : ""} px-4  f-18 py-2 pointer`}
                   onClick={() => toggleTab("0")}
                 >
                   Plan
                 </NavLink>
               </NavItem>
               )}  */}
              <NavItem className="pr-0">
                <NavLink
                  className={`text-secondary fw-bold ${activeTab == "0" ? "activeTab1" : ""} px-4  f-18 py-2 pointer`}
                  onClick={() => toggleTab("0")}
                >
                  Plan
                </NavLink>
              </NavItem>
              {details?.inventory_table?.length > 0 && (
                <NavItem className="pr-0">
                  <NavLink
                    className={`text-secondary fw-bold ${activeTab == "1" ? "activeTab1" : ""} px-4  f-18 py-2 pointer`}
                    onClick={() => toggleTab("1")}
                  >
                    Inventory
                  </NavLink>
                </NavItem>
              )}
              {details?.service_table?.length > 0 && (
                <NavItem className="pr-0">
                  <NavLink
                    className={`text-secondary fw-bold ${activeTab == "2" ? "activeTab1" : ""} px-4 f-18 py-2 pointer`}
                    onClick={() => toggleTab("2")}
                  >
                    Service
                  </NavLink>
                </NavItem>
              )}

              <NavItem className="pr-0">
                <NavLink
                  className={`text-secondary fw-bold ${activeTab == "3" ? "activeTab1" : ""} px-4 f-18 py-2 pointer`}
                  onClick={() => toggleTab("3")}
                >
                  Payment History
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="px-md-4 px-sm-2 px-1" activeTab={activeTab}>
              <TabPane tabId="0">
                <div className="tableContainer md-mt-5 sm-mt-5 mt-3" style={{ overflowX: "auto" }}>
                  <Table hover>
                    <thead>
                      <th>Item</th>
                      <th>Taxable</th>
                      <th>Discount%</th>
                      <th>SGST</th>
                      <th>CGST</th>
                      {/* <th>Quantity</th> */}
                      <th>Total Taxable</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{details?.invoice_table?.payment_name ? details?.invoice_table?.payment_name : "---"}</td>
                        <td>Rs.{details?.invoice_table?.amount ? details?.invoice_table?.amount : 0}</td>
                        <td>{details?.invoice_table?.discount ? details?.invoice_table?.discount : 0}%</td>

                        <td>
                          {details?.invoice_table?.cgst && details?.invoice_table?.amount
                            ? `${(
                                Number(details?.invoice_table?.amount) *
                                (Number(details?.invoice_table?.cgst) / 100)
                              )?.toFixed(2)} (${details?.invoice_table?.cgst}%)`
                            : 0}
                        </td>
                        {/* <td>{details?.invoice_table?.cgst}</td> */}

                        <td>
                          {details?.invoice_table?.sgst && details?.invoice_table?.amount
                            ? `${(
                                Number(details?.invoice_table?.amount) *
                                (Number(details?.invoice_table?.sgst) / 100)
                              )?.toFixed(2)} (${details?.invoice_table?.sgst}%)`
                            : 0}
                        </td>
                        {/* <td>1</td> */}
                        <td>Rs.{totalAmount?.toFixed(2) ? totalAmount?.toFixed(2) : 0}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </TabPane>
              <TabPane tabId="1">
                <div className="tableContainer md-mt-5 sm-mt-5 mt-3" style={{ overflowX: "auto" }}>
                  <Table hover>
                    <thead>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Taxable</th>
                      <th>Discount%</th>
                      <th>SGST</th>
                      <th>CGST</th>
                      <th>Quantity</th>
                      <th>Total Taxable</th>
                    </thead>
                    <tbody>
                      {details?.inventory_table?.map((res, index) => {
                        // const amount = Number(res.amount) || 0;
                        // const sgstPercent = Number(res.sgst) || 0;
                        // const cgstPercent = Number(res.cgst) || 0;
                        // const quantity = Number(res.quantity) || 0;

                        // const sgst = amount * (sgstPercent / 100);
                        // const cgst = amount * (cgstPercent / 100);
                        // const totalAmount =
                        //   (amount + sgst + cgst) * quantity;
                        const amount = Number(res?.amount) || 0; // Default to 0 if undefined or invalid
                        const sgstPercent = Number(res?.sgst) || 0;
                        const cgstPercent = Number(res?.cgst) || 0;
                        const discountPercent = Number(res?.discount) || 0;
                        const quantity = Number(res?.quantity) || 1; // Default quantity to 1

                        // Calculations
                        const sgst = amount * (sgstPercent / 100);
                        const cgst = amount * (cgstPercent / 100);
                        const discount = amount * (discountPercent / 100);
                        const totalAmount = (amount - discount + sgst + cgst) * quantity;

                        return (
                          <tr key={index}>
                            <td>{res.inventory_name}</td>
                            <td>{res.category_name}</td>
                            <td>Rs.{amount?.toFixed(2)}</td>
                            <td>{res.discount}%</td>
                            <td>
                              Rs. {sgst?.toFixed(2)} ({sgstPercent}%)
                            </td>
                            <td>
                              Rs. {cgst?.toFixed(2)} ({cgstPercent}%)
                            </td>
                            <td>{quantity}</td>
                            <td>Rs.{totalAmount?.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </TabPane>
              <TabPane tabId="2">
                <div className="tableContainer md-mt-5 sm-mt-5 mt-3" style={{ overflowX: "auto" }}>
                  <Table hover>
                    <thead>
                      <th>Item</th>
                      <th>Taxable</th>
                      <th>Discount%</th>
                      <th>SGST</th>
                      <th>CGST</th>
                      <th>Quantity</th>
                      <th>Total Taxable</th>
                    </thead>
                    <tbody>
                      {details?.service_table?.map((res, index) => {
                        const amount = Number(res?.amount) || 0; // Default to 0 if undefined or invalid
                        const sgstPercent = Number(res?.sgst) || 0;
                        const cgstPercent = Number(res?.cgst) || 0;
                        const discountPercent = Number(res?.discount) || 0;
                        // const quantity = Number(res?.quantity) || 1; // Default quantity to 1
                        const quantity =
  Number(res?.quantity) ||
  Number(res?.duration?.match(/\d+/)?.[0]) || 1;

                        // Calculations
                        const sgst = amount * (sgstPercent / 100);
                        const cgst = amount * (cgstPercent / 100);
                        const discount = amount * (discountPercent / 100);
                        const totalAmount = (amount - discount + sgst + cgst) * quantity;

                        // Debugging: Log values for troubleshooting

                        return (
                          <tr key={index}>
                            <td>{res?.service_name || "N/A"}</td>
                            <td>Rs.{amount?.toFixed(2)}</td>
                            <td>{discountPercent}%</td>
                            <td>
                              Rs.{sgst?.toFixed(2)} ({sgstPercent}%)
                            </td>
                            <td>
                              Rs.{cgst?.toFixed(2)} ({cgstPercent}%)
                            </td>
                         <td>{res?.duration?.split(" ")[0] || "N/A"}</td>
                            <td>Rs.{totalAmount?.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </TabPane>
              <TabPane tabId="3">
                <div className="tableContainer text-center md-mt-5 sm-mt-5 mt-3" style={{ overflowX: "auto" }}>
                  {paymentHistory.length !== 0 ? (
                    <>
                      {" "}
                      <Table hover>
                        <thead>
                          <tr className="table-heading-size">
                            <th>Name</th>
                            <th>Phone No.</th>
                            <th>Email ID</th>
                            <th>Amount</th>
                            <th>Mode</th>
                            <th>Order ID</th>
                            <th>Transaction ID</th>
                            <th>Status</th>
                            <th>Invoice Date/Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory?.map((res, index) => {
                            return (
                              <tr key={index}>
                                <td>{res?.paymentDetails?.buyerName || "---"}</td>
                                <td>{res?.paymentDetails?.buyerPhone || "---"}</td>
                                <td>{res?.paymentDetails?.buyerEmail || "---"}</td>
                                <td>{res?.paymentDetails?.amount || "---"}</td>
                                <td>{res?.paymentMode}</td>

                                <td>{res?.paymentDetails?.orderId || "---"}</td>
                                <td>{res?.paymentDetails?.paymentId ? res?.paymentDetails?.paymentId : "---"}</td>
                                <td>{res?.paymentDetails?.paymentStatus || "---"}</td>
                                <td>{moment(res?.createdAt).format("DD/MM/YYYY HH:mm:ss")}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </>
                  ) : (
                    <>
                      <p>--- No Payment History ---</p>
                    </>
                  )}
                </div>
              </TabPane>
            </TabContent>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="col-md-12 d-flex  justify-content-end p-0">
            <button className="btn mr-2" onClick={toggle}>
              Cancel
            </button>
            {details?.credit_note && (
              <>
                <button className="btn btn-primary mr-2" onClick={e => convertToImg(true)}>
                  Downoad Credit Note
                </button>
              </>
            )}
            <button className="btn btn-primary" onClick={() => convertToImg(false)}>
              Downoad Invoice Pdf
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default InvoiceViewDetailed;
