import React, { useEffect, useRef, useState } from "react";
import { Input, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { getHsnandSacCode, getProposalbyUserId } from "../../../service/admin";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import logo from "../../../assets/images/jsTree/PdfLogo.png";
import { sendPdfbyEmail } from "../../../assets/commonFunction";

export default function ViewAllPraposal({
  open,
  toggle,
  getDataById,
  invoceIds,
  getLogoData,
  setLoader = { setLoader }
}) {
  const [proposalList, setProposalList] = useState([]);
  const [pdfListData, setPdflistData] = useState({});
  const [discountPer, setDiscountper] = useState(0);
 const [getHnsAndSac, setGetHsnAndSac] = useState([]);
  let { id } = useParams();
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

  

  const getListInfo = async () => {
    try {
      const info = await getProposalbyUserId(id).then(res => {
        return res.data.data;
      });

      setProposalList(info);
    } catch (err) {
      console.log(err);
    }
  };

  function getTextBasedOnInvoice(res) {
    let textArray = [];

    if (res?.invoice_table?.amount) {
      textArray.push(" Plan ");
    }
    if (res?.service_table.length !== 0) {
      textArray.push(" Service ");
    }
    if (res?.inventory_table.length !== 0) {
      textArray.push(" Inventory ");
    }
    return textArray.join(" & ");
  }
  function getNameandRole(info) {
    if (info?.franchiseesInfo?.length !== 0) {
      return {
        name: info?.franchiseesInfo[0]?.name,
        role: "Franchisee"
      };
    } else if (info?.ispsMemberInfo?.length !== 0) {
      return {
        name: info?.ispsMemberInfo[0]?.name,
        role: "Isps Member"
      };
    } else {
      return {
        name: info?.adminsInfo[0]?.admin_name,
        role: "Admin"
      };
    }
    {
    }
  }
  useEffect(() => {
    getListInfo();
    getData()
  }, [open]);

  const inVoiceRef1 = useRef(null);
  const inVoiceRef2 = useRef(null);

  // async function convertToImg(emailsend, pid) {
  //   setLoader(true);
  //   let arr = [inVoiceRef1.current, inVoiceRef2.current];
  //   let photoArr = [];
  //   const pdf = new jsPDF();
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   for (let index = 0; index < arr.length; index++) {
  //     const res = arr[index];
  //     try {
  //       const dataUrl = await htmlToImage.toPng(res, { quality: 0.5 });
  //       photoArr.push(dataUrl);
  //       const imgProps = pdf.getImageProperties(dataUrl);
  //       const imgWidth = pdfWidth;
  //       const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
  //       const scaledWidth = imgProps.width * scaleFactor;
  //       const scaledHeight = imgProps.height * scaleFactor;

  //       pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST");
  //       if (index !== arr.length - 1) {
  //         pdf.addPage();
  //       }
  //     } catch (error) {
  //       console.error("oops, something went wrong!", error);
  //     }
  //   }

  //   setLoader(false);

  //   const pdfBlob = pdf.output("blob");
  //   if (emailsend) {
  //     let res = await sendPdfbyEmail(
  //       pdfBlob,
  //       getDataById?.email,
  //       getDataById?.full_name,
  //       (getTotalAmount() - (getTotalAmount() / 100) * Number(discountPer)).toFixed(2),
  //       new Date(),
  //       `${invoceIds.code}/${invoceIds.nextSeq}`,
  //       "proposal",
  //       `https://main.d26qjdzv5chp7x.amplifyapp.com/proposalAcknoledge/${pid}/${hsndata?.code}`
  //     );
  //   } else {
  //     const pdfURL = URL.createObjectURL(pdfBlob);
  //     window.open(pdfURL);
  //   }
  // }

  async function convertToImg() {
    setLoader(true);
    let arr = [inVoiceRef1.current];
    let photoArr = [];
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let index = 0; index < arr.length; index++) {
      const res = arr[index];
      await htmlToImage
        .toPng(res, { quality: 0.5 }) // Reduced quality to 0.5
        .then(function(dataUrl) {
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
        })
        .catch(function(error) {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (index === arr.length - 1) {
            setLoader(false);
          }
        });
    }

    pdf.save("Proposal.pdf");
  }

  const generatePDF = async () => {
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
  useEffect(async () => {
    await generatePDF();
  }, [pdfListData]);

  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      background: "white"
    }
  };

  const calculatePlanTotal = () => {
    let gst =
      Number(pdfListData?.planInfo?.amount) * (Number(pdfListData?.planInfo?.cgst || 0) / 100) +
      Number(pdfListData?.planInfo?.amount) * (Number(pdfListData?.planInfo?.sgst || 0) / 100);
    let discount =
      Number(pdfListData?.invoice_table?.amount) * (Number(pdfListData?.invoice_table?.discount || 0) / 100);
    return pdfListData?.planInfo?.amount ? pdfListData?.planInfo?.amount + gst - discount : 0;
  };

  const calculateInventoryTotal = () => {
    return pdfListData?.inventory_table
      ? pdfListData.inventory_table.reduce((sum, item) => {
          return sum + Number(item.total_amount);
        }, 0)
      : 0;
  };

  const calculateServiceTotal = () => {
    return pdfListData?.service_table
      ? pdfListData.service_table.reduce((sum, item) => {
          // const itemTotal =
          //   Number(item.amount) * (1 - Number(item.discount || 0) / 100) +
          //   (Number(item.cgst || 0) + Number(item.sgst || 0));
          return sum + Number(item.total_amount);
        }, 0)
      : 0;
  };

  const calculateGrandTotal = () => {
    const planTotal = parseFloat(calculatePlanTotal());
    const inventoryTotal = parseFloat(calculateInventoryTotal());
    const serviceTotal = parseFloat(calculateServiceTotal());

    return (planTotal + inventoryTotal + serviceTotal).toFixed(2); // Now you can safely call .toFixed() here
  };

  return (
    <>
      <Modal isOpen={open} size="xl" centered scrollable>
        <ModalHeader toggle={toggle}>
          <div className={`head_min bandWidthHeader`}>Proposals</div>
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
                      pdfListData?.pdftemplates?.logo?.file_url
                        ? pdfListData?.pdftemplates?.logo?.file_url
                        : getLogoData?.profile_image?.file_url
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
                      <span className="fw-600">Name</span> : {getDataById?.full_name}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Email</span> : {getDataById?.email}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Installation Address</span> :{" "}
                      {getDataById?.installation_address?.pin_code},{getDataById?.installation_address?.flat_number},{" "}
                      {getDataById?.installation_address?.city}, {getDataById?.installation_address?.state}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Mobile No.</span> : {getDataById?.mobile_number}
                    </div>
                  </div>
                  <div className="flex-direction-column f-18">
                    <div className="mt-1">
                      <span className="fw-600">Invoice No</span> : {`${invoceIds.code}-${invoceIds.nextSeq}`}
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Date</span> : {moment().format("DD-MM-YYYY")}
                    </div>
                    <div className="fw-600 mt-4">Sender Details :</div>
                    <div className="mt-1">
                      <span className="fw-600">Address</span> : 9878675434
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Mobile No.</span> : 20ABGFHTRD123YG
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">Email</span> : 20ABGFHTRD123YG
                    </div>
                    <div className="mt-1">
                      <span className="fw-600">GSTIN</span> : 20ABGFHTRD123YG
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
                          
                          <th>Price</th>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{pdfListData?.invoice_table?.payment_name}</td>
                            <td>{pdfListData?.planInfo?.category}</td>
                            <td>Rs.{pdfListData?.planInfo?.amount}</td>
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
                              <td>{pdfListData?.invoice_table?.payment_name}</td>
                              <td>Rs.{pdfListData?.invoice_table?.amount}</td>
                              <td>{pdfListData?.invoice_table?.discount}%</td>

                              <td>
                                {" "}
                                Rs.
                                {pdfListData?.invoice_table?.cgst
                                  ? `${(
                                      Number(pdfListData?.invoice_table?.amount) *
                                      (Number(pdfListData?.invoice_table?.cgst) / 100)
                                    ).toFixed(2)} (${pdfListData?.invoice_table?.cgst}%) `
                                  : 0}
                              </td>
                              <td>
                                Rs.
                                {pdfListData?.invoice_table?.sgst
                                  ? `${(
                                      Number(pdfListData?.invoice_table?.amount) *
                                      (Number(pdfListData?.invoice_table?.sgst) / 100)
                                    ).toFixed(2)} (${pdfListData?.invoice_table?.sgst}%) `
                                  : 0}
                              </td>
                              <td>{getHnsAndSac?.[0]?.code}</td>
                              <td>Rs.{calculatePlanTotal().toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {pdfListData?.inventory_table?.length > 0 && (
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
                            {pdfListData?.inventory_table?.map((res, index) => (
                              <tr key={index}>
                                <td>{res.inventory_name}</td>
                                <td>{res.category_name}</td>
                                <td>Rs.{res.amount.toFixed(2)}</td>
                                <td>{res.discount}%</td>

                                <td>
                                  Rs.
                                  {res?.cgst
                                    ? `${(Number(res?.amount) * (Number(res?.cgst) / 100)).toFixed(2)} (${res?.cgst}%)`
                                    : 0}
                                </td>
                                <td>
                                  Rs.
                                  {res?.sgst
                                    ? `${(Number(res?.amount) * (Number(res?.sgst) / 100)).toFixed(2)} (${res?.sgst}%)`
                                    : 0}
                                </td>
                                <td>{res.quantity}</td>
                                <td>Rs.{res.total_amount.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
                {pdfListData?.service_table?.length > 0 && (
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
                            {pdfListData?.service_table?.map(res => (
                              <>
                                <tr>
                                  <td>{res?.service_name}</td>

                                  <td>Rs.{res?.amount}</td>

                                  <td>{res?.discount}%</td>

                                  <td>
                                    Rs.
                                    {res?.cgst
                                      ? `${(Number(res?.amount) * (Number(res?.cgst) / 100)).toFixed(2)} (${
                                          res?.cgst
                                        }%)`
                                      : 0}
                                  </td>
                                  <td>
                                    Rs.
                                    {res?.sgst
                                      ? `${(Number(res?.amount) * (Number(res?.sgst) / 100)).toFixed(2)} (${
                                          res?.sgst
                                        }%)`
                                      : 0}
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">{res?.duration}</div>
                                  </td>

                                  <td>Rs.{res?.total_amount.toFixed(2)}</td>
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
                      pdfListData?.pdftemplates?.logo?.file_url
                        ? pdfListData?.pdftemplates?.logo?.file_url
                        : getLogoData?.profile_image?.file_url
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
                      <tr>
                        <th>Plan Total</th>
                        <th>Inventory Total</th>
                        <th>Service Total</th>
                        <th>Total</th>
                        <th>Discount%</th>
                        <th>Grand Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {/* Plan Total */}
                        <td>Rs.{pdfListData?.planInfo?.amount ? calculatePlanTotal() : 0}</td>

                        {/* Inventory Total */}
                        <td>Rs.{pdfListData?.inventory_table ? calculateInventoryTotal() : 0}</td>

                        {/* Service Total */}
                        <td>Rs.{pdfListData?.service_table ? calculateServiceTotal() : 0}</td>

                        {/* Total (sum of plan, inventory, and service totals) */}
                        <td>
                          Rs.{(calculatePlanTotal() + calculateInventoryTotal() + calculateServiceTotal()).toFixed(2)}
                        </td>

                        {/* Discount% */}
                        <td>{pdfListData?.invoice_discount || 0}%</td>

                        {/* Grand Total */}
                        <td>Rs.{pdfListData?.grand_total?.toFixed(2)}</td>
                        {}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 f-18">
                  <b className="">Terms & Conditions :</b>
                  {pdfListData?.pdftemplates?.plan && pdfListData?.pdftemplates?.plan.trim().length !== 0 && (
                    <>
                      <div className="mt-4">
                        <div className="fw-600">Plan</div>{" "}
                        <div dangerouslySetInnerHTML={{ __html: pdfListData?.pdftemplates?.plan }} />
                      </div>
                    </>
                  )}
                  {pdfListData?.pdftemplates?.inventory && pdfListData?.pdftemplates?.inventory.trim().length !== 0 && (
                    <>
                      <div className="mt-4">
                        <div className="fw-600">Inventory</div>{" "}
                        <div dangerouslySetInnerHTML={{ __html: pdfListData?.pdftemplates?.inventory }} />
                      </div>
                    </>
                  )}
                  {pdfListData?.pdftemplates?.service && pdfListData?.pdftemplates?.service.trim().length !== 0 && (
                    <>
                      <div className="mt-4">
                        <div className="fw-600">Service</div>{" "}
                        <div dangerouslySetInnerHTML={{ __html: pdfListData?.pdftemplates?.service }} />
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
          <Table hover className="mt-3">
            <thead>
              <tr>
                <th>Proposal No.</th>
                <th>Plan Name</th>
                <th>Amount</th>
                <th>Send by</th>
                <th>Payment Status</th>
                <th>Viewed</th>
                <th>Status</th>
                <th>Create At</th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {proposalList.map(res => (
                <>
                  <tr>
                    <td>{res?.invoice_no}</td>

                    <td>{getTextBasedOnInvoice(res)}</td>
                    <td>{res.grand_total}</td>
                    <td>{`${getNameandRole(res).name} (${getNameandRole(res).role})`}</td>
                    <td>{res?.payment_done ? "Done" : "Pending"}</td>
                    <td>{res?.proposal_seen ? "Seen" : "Unseen"}</td>
                    <td className="text-capitalize">{res?.propsal_status}</td>

                    <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>

                    <td>
                      <div
                        className="fw-600 pointer text-primary"
                        onClick={() => {
                          setPdflistData(res);
                        }}
                      >
                        Download
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  );
}
