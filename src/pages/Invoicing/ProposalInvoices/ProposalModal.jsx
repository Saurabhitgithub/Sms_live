import React, { useState, useEffect, useRef } from "react";
import style from "../style.module.css";
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
import Loader from "../../../components/commonComponent/loader/Loader";
import logo from "../../../assets/images/jsTree/PdfLogo.png";
import moment from "moment";
import { getAdminById, getHsnandSacCode } from "../../../service/admin";
import { userInfo } from "../../../assets/userLoginInfo";
import { toWords } from "number-to-words";
const ProposalModal = ({ ViewOpen, setViewOpen }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [details, setDetails] = useState();
  const inVoiceRef1 = useRef(null);
  const inVoiceRef2 = useRef(null);

  const [activeTab, toggleTab] = useState("0");
  const [loader, setLoader] = useState(false);
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

  const toggle = () => setViewOpen({ status: false });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDetails(ViewOpen.data);
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
    getLogoFunction();
    getHsnCode();
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
  const convertToImg = async () => {
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

      pdf.save("Proposal.pdf");
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

  const calculatePlanTotal = () => {
    return details?.planInfo?.amount
      ? Number(details?.planInfo.amount) * (1 - Number(details?.planInfo.discount || 0) / 100) +
          (Number(details?.planInfo.cgst || 0) + Number(details?.planInfo.sgst || 0))
      : 0;
  };

  const calculateInventoryTotal = () => {
    return details?.inventory_table
      ? details.inventory_table.reduce((sum, item) => {
          const itemTotal =
            (Number(item.amount) * (1 - Number(item.discount || 0) / 100) +
              Number(item.cgst || 0) +
              Number(item.sgst || 0)) *
            Number(item.quantity || 1);
          return sum + itemTotal;
        }, 0)
      : 0;
  };

  const calculateServiceTotal = () => {
    return details?.service_table
      ? details.service_table.reduce((sum, item) => {
          const itemTotal =
            Number(item.amount) * (1 - Number(item.discount || 0) / 100) +
            (Number(item.cgst || 0) + Number(item.sgst || 0));
          return sum + itemTotal;
        }, 0)
      : 0;
  };

  const getAmountInWords = amount => {
    if (amount === undefined || amount === null) return "";

    const num = parseFloat(amount);
    if (isNaN(num)) return "";

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let words = `${toWords(rupees)}` + " Rupees";
    if (paise > 0) {
      words += ` and ${toWords(paise)} Paise`;
    }
    return `${words} only`;
  };

const getPlaceOfSupply = gstNo => {
  if (!gstNo || gstNo.length < 2) return "N/A";
  const code = gstNo.slice(0, 2);
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
                  details?.templateInfo?.logo?.file_url
                    ? details?.templateInfo?.logo?.file_url
                    : getLogoData?.profile_image?.file_url
                }
                width="150px"
                alt=""
              />
              <h1  style={{ marginRight: "50px" }} className="">Proposal</h1>
              {/* <div className="">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </div> */}
            </div>
            <div className="d-flex justify-content-between mt-3">
              <div className="flex-direction-column f-18">
                <div className="fw-600">User Details :</div>
                <div className="mt-1">
                  <span className="fw-600">Name</span> : {details?.leadsInfo.full_name}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Email</span> : {details?.leadsInfo.email}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Shipping Address</span> : {details?.leadsInfo.installation_address?.pin_code}
                  ,{details?.leadsInfo.installation_address?.flat_number},{" "}
                  {details?.leadsInfo.installation_address?.city}, {details?.leadsInfo.installation_address?.state}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Billing Address</span> : {details?.leadsInfo.billing_address?.pin_code},
                  {details?.leadsInfo.billing_address?.flat_number}, {details?.leadsInfo.billing_address?.city},{" "}
                  {details?.leadsInfo.billing_address?.state}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Mobile No.</span> : {details?.leadsInfo.mobile_number}
                </div>
              </div>
              <div className="flex-direction-column f-18">
                <div className="mt-1">
                  <span className="fw-600">Invoice No</span> : {`${details?.code}-${details?.nextSeq}`}
                </div>
                <div className="mt-1">
                  <span className="fw-600">Date</span> : {moment().format("DD-MM-YYYY")}
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
<div className="mt-1">
  <span className="fw-600">Place of Supply</span> : {getPlaceOfSupply(userInfo()?.gstNo)}
</div>

              </div>
            </div>
            {/* {planInfo?.plan_name && checkPlan &&( */}
            {true && (
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
                        <th> Item</th>
                        <th>Taxable</th>
                        <th>Discount%</th>
                        <th>CGST</th>
                        <th>SGST</th>
                        {/* <th>Quantity</th> */}
                        <th>HSN/SAC Code</th>
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
                          {/* <td>{details?.invoice_table?.cgst}</td> */}

                          <td>
                            {details?.invoice_table?.sgst && details?.invoice_table?.amount
                              ? `${(
                                  Number(details?.invoice_table?.amount) *
                                  (Number(details?.invoice_table?.sgst) / 100)
                                ).toFixed(2)} (${details?.invoice_table?.sgst}%)`
                              : 0}
                          </td>
                          {/* <td>{details?.invoice_table?.sgst}</td> */}
                          <td>{hsndata?.[0]?.code}</td>
                          {/* <td>1</td> */}
                          <td>Rs.{totalAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {details?.inventory_table?.length > 0 && (
              <>
                <div className="mt-5">
                  <div className="mt-3">
                    <h2>Inventory Details</h2>
                    <hr />
                  </div>
                  <div className="mt-3">
                    <table>
                      <thead>
                        <th> Item</th>
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
            )}
            {details?.service_table?.length > 0 && (
              <>
                <div className="mt-5">
                  <div className="mt-3">
                    <h2>Service Details</h2>
                    <hr />
                  </div>
                  <div className="mt-3">
                    <table>
                      <thead>
                        <th> Item</th>
                        <th>Taxable</th>
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
              <h1  style={{ marginRight: "50px" }} className="">Proposal</h1>
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
                    <th>Plan Total</th>
                    <th>Inventory Total</th>
                    <th>Service Total</th>
                    <th>Total</th>
                    <th>Discount%</th>
                    <th>Total Invoice Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* Plan Total */}
                    <td>Rs.{details?.planInfo?.amount ? calculatePlanTotal() : 0}</td>

                    {/* Inventory Total */}
                    <td>Rs.{details?.inventory_table ? calculateInventoryTotal() : 0}</td>

                    {/* Service Total */}
                    <td>Rs.{details?.service_table ? calculateServiceTotal() : 0}</td>

                    {/* Total (sum of plan, inventory, and service totals) */}
                    <td>
                      Rs.{(calculatePlanTotal() + calculateInventoryTotal() + calculateServiceTotal()).toFixed(2)}
                    </td>

                    {/* Discount% */}
                    <td>{details?.discount || 0}%</td>

                    {/* Grand Total */}
                    {/* <td>Rs.{details?.grand_total.toFixed(2)}</td> */}
                    <td> Rs. {details?.grand_total?.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2">
                <div style={{ fontWeight: "bold" }}>Total Invoice Value (Words)</div>
                <div style={{ fontSize: "0.9em" }}>({getAmountInWords(details?.grand_total)})</div>
              </div>
            </div>
            <div className="mt-3 mb-3 d-flex justify-content-end">
              <div> Authorized Signature</div>
            </div>
            {/* <div className="mt-5 pt-5 text-center">
                  Page 2
                </div> */}
            <div className="mt-5 f-18">
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
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={ViewOpen.status} toggle={toggle} scrollable size="xl" className="p-md-4 p-sm-3 p-0">
        <ModalHeader toggle={toggle} className="d flex align-items-center justify-content-between">
          <div className="head_min">Proposal</div>
        </ModalHeader>
        <ModalBody className="p-md-4 p-sm-3 p-0">
          <div className="row">
            <div className="col-xl-6">
              <div className="row">
                <div className="col-7 d-flex">
                  <FaHashtag className="f-22 d-sm-block d-none" color="gray" />
                  <div className="ml-sm-3 ml-1">
                    <div className="f-18 text-secondary fw-600">Proposal Number:</div>
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
                    <div className="fw-500 text-black">{details?.leadsInfo.full_name}</div>
                  </div>
                </div>

                <div className="col-5">
                  <div className="f-18 text-secondary fw-600">Phone Number:</div>
                  <div className="fw-500 text-black">{details?.leadsInfo.mobile_number}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-md-5 mt-sm-5 mt-3">
            <div class="col-md-6 col-sm-6 col-12">
              <div>Created By</div>

              <Input value={details?.AdminInfo?.admin_name} disabled className="border-0" />
            </div>
            <div class="col-md-6 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-2">
              <div>Total Amount</div>
              <Input value={details?.grand_total} disabled className="border-0" />
            </div>
          </div>
          <div className="mt-4">
            <hr />
          </div>
          <div class="mt-4 f-24">Proposal Invoice Details</div>
          <div className="mt-4">
            <Nav tabs>
              {/* {details?.invoice_table && details.invoice_table.length > 0 && (
                 <NavItem className="pr-0">
                 <NavLink
                   className={`text-secondary fw-bold ${activeTab == "0" ? "activeTab1" : ""} px-4  f-18 py-2 pointer`}
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
            </Nav>
            <TabContent className="px-md-4 px-sm-2 px-1" activeTab={activeTab}>
              <TabPane tabId="0">
                <div className="tableContainer md-mt-5 sm-mt-5 mt-3" style={{ overflowX: "auto" }}>
                  <Table hover>
                    <thead>
                      <th> Item</th>
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
                              ).toFixed(2)} (${details?.invoice_table?.cgst}%)`
                            : 0}
                        </td>
                        {/* <td>{details?.invoice_table?.cgst}</td> */}

                        <td>
                          {details?.invoice_table?.sgst && details?.invoice_table?.amount
                            ? `${(
                                Number(details?.invoice_table?.amount) *
                                (Number(details?.invoice_table?.sgst) / 100)
                              ).toFixed(2)} (${details?.invoice_table?.sgst}%)`
                            : 0}
                        </td>
                        {/* <td>1</td> */}
                        <td>Rs.{totalAmount.toFixed(2) ? totalAmount.toFixed(2) : 0}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </TabPane>
              <TabPane tabId="1">
                <div className="tableContainer md-mt-5 sm-mt-5 mt-3" style={{ overflowX: "auto" }}>
                  <Table hover>
                    <thead>
                      <th> Item</th>
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
                            <td>Rs.{amount.toFixed(2)}</td>
                            <td>{res.discount}%</td>
                            <td>
                              Rs. {sgst.toFixed(2)} ({sgstPercent}%)
                            </td>
                            <td>
                              Rs. {cgst.toFixed(2)} ({cgstPercent}%)
                            </td>
                            <td>{quantity}</td>
                            <td>Rs.{totalAmount.toFixed(2)}</td>
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
                      <th> Item</th>
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
                        const quantity = Number(res?.quantity) || 1; // Default quantity to 1

                        // Calculations
                        const sgst = amount * (sgstPercent / 100);
                        const cgst = amount * (cgstPercent / 100);
                        const discount = amount * (discountPercent / 100);
                        const totalAmount = (amount - discount + sgst + cgst) * quantity;

                        // Debugging: Log values for troubleshooting

                        return (
                          <tr key={index}>
                            <td>{res?.service_name || "N/A"}</td>
                            <td>Rs.{amount.toFixed(2)}</td>
                            <td>{discountPercent}%</td>
                            <td>
                              Rs.{sgst.toFixed(2)} ({sgstPercent}%)
                            </td>
                            <td>
                              Rs.{cgst.toFixed(2)} ({cgstPercent}%)
                            </td>
                            <td>{res?.duration || "N/A"}</td>
                            <td>Rs.{totalAmount.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
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
            <button className="btn btn-primary" onClick={convertToImg}>
              Downoad Pdf
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProposalModal;
