import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import style from "./DetailsTabs/style.module.css";
import { Icon } from "../../components/Component";
import {
  addInvoiceData,
  getLeadsByIdData,
  getPdfInvoiceId,
  nextSeq,
  phonePePayment,
  emialSendLInk,
  getInventoryAndService
} from "../../service/admin";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { userId, userInfo } from "../../assets/userLoginInfo";
import { convertLeadsData } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import QRCode from "qrcode.react";
import doneImage from "../../assets/images/jsTree/done.svg";
import pendingImage from "../../assets/images/jsTree/pending.svg";
import UserInfo from "../SubscriberManagement/UserInfo";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";

export default function LeadConvertModal({ open, setOpen, getDataOfLeads }) {
  const [planVisible, setPlanVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [phonepe, setPhonePe] = useState();
  const [copyStatus, setCopyStatus] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [paymentStatus, setPaymentStatus] = useState("");
  const [invoiceInfoData, setInvoiceInfo] = useState({});
  const [showData1, setShowData1] = useState(false);
  const [showData2, setShowData2] = useState(false);
  const [showData3, setShowData3] = useState(false);
  const [getDataById, setGetDataById] = useState({});
  const [loader, setLoader] = useState(false);
  const paramsData = useParams();
  const inVoiceRef1 = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [getFindInventory, setGetFindInventory] = useState({});

  

  const onCopyText = () => {
    setCopyStatus(true);

    setTimeout(() => setCopyStatus(false), 2000);
  };

  const sendPaymentFunction = async () => {
    setLoader(true);
    let payloadData = {
      payment_link: phonepe?.url,
      id: paramsData?.id,
      user_id: userId(),
      user_name: userInfo().name,
      user_role: userInfo().role,
      total_amount: invoiceId.invoice_table.total_amount
    };
    await emialSendLInk(payloadData)
      .then(res => {
        
        dispatch(
          success({
            show: true,
            msg: "Payment link send on subcriber Email",
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

  const getdataLeads = async () => {
    setLoader(true);
    const payloadData = {
      id: paramsData.id,
      role: userInfo().role
    };
    await getLeadsByIdData(payloadData)
      .then(res => {
        let dataReverse = res.data.data;
        dataReverse.notes = dataReverse?.notes?.reverse();
        dataReverse.activity_logs = dataReverse?.activity_logs?.reverse();
        dataReverse.reminder = dataReverse.reminder?.reverse();
        dataReverse.call_log = dataReverse.call_log?.reverse();

        setLoader(false);
        setGetDataById(dataReverse);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const getAllInventoryAndService = async () => {
    setLoader(true);
    const payloads = {
      lead_id: paramsData.id,
      status: "accept"
    };
    await getInventoryAndService(payloads)
      .then(res => {
        
        // let dataReverse = res?.data?.reverse();

        setGetFindInventory(res.data.data);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };
  const convertLeadsTosubscriber = async e => {
    setLoader(true);
    e.preventDefault();
    try {
      let PayloadData = {
        user_name: userInfo().name,
        user_role: userInfo().role,
        user_id: userId()
      };
      let response = await convertLeadsData(paramsData.id, PayloadData);
      let res = response.data.data;
      getdataLeads();
      getDataOfLeads();
      if (getDataById?.planInfo?.category === "prepaid") {
        let nextseq = await nextSeq({ paid: "perfoma" }).then(res => {
          return res.data.data;
        });
        let payload = {
          payment_status: "pending",
          plan_id: getDataById.current_plan.plan,
          user_id: res._id,
          invoice_no: `${nextseq.code}-${nextseq.nextSeq}`,
          user_name: getDataById.full_name,
          user_role: "subscriber",
          creator_id: userInfo()._id,
          lead_id: paramsData.id,
          manual: false,
          invoiceNo_id: nextseq.id,
          phonepe: true
        };
        
        let invoiceInfo = await addInvoiceData(payload).then(res => {
          return res.data.data;
        });
        setInvoiceId(invoiceInfo);
        let payloadPhonepe = {
          name: getDataById.full_name,
          mobile_number: getDataById.mobile_number,
          amount: Math?.round(invoiceInfo.grand_total * 100),
          userID: res._id,
          planId: getDataById.current_plan.plan,
          invoiceId: invoiceInfo._id
        };
        

        let phonepe = await phonePePayment(payloadPhonepe).then(res => {
          return res.data.data;
        });
        setPhonePe(phonepe);
        setModalOpen(true);
      }

      setLoader(false);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };
  useEffect(() => {
    getdataLeads();
    getDataOfLeads();
    getAllInventoryAndService();
  }, [open]);

  function toggle() {
    setOpen(!open);
  }
  async function checkstatus() {
    try {
      let data = await getPdfInvoiceId(invoiceId._id).then(res => {
        return res.data.data;
      });

      if (data.payment_status === "paid") {
        setPaymentStatus("paid");
      } else {
        setPaymentStatus("pending");
      }
    } catch (err) {
      console.log(err);
    }
  }
  function toggel1() {
    setModalOpen(!modalOpen);
  }
  async function convertToImg(emailsend) {
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
      let res = await sendPdfbyEmail(
        pdfBlob,
        "Dear User,\n\nplease find invoice attachment below\n\nRegards,\nSMS Platform",
        "Invoice",
        emailsend
      );
    } else {
      const pdfURL = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new window/tab
      window.open(pdfURL);
    }
  }

  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(text);
      setQrCodeUrl(url);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal centered scrollable isOpen={open} size="xl">
        <ModalHeader toggle={toggle}>
          <div className="f-24">Convert to Subscriber</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={convertLeadsTosubscriber}>
            <div className="row mt-2">
              <div className="col-md-6 col-sm-6 col-12 mt-3">
                <label className="form-label mb-1">Connection Category</label>
                <input className="form-control text-capitalize" disabled value={getDataById?.planInfo?.category} />
              </div>
              <div className="col-md-6 col-sm-6 col-12 mt-3">
                <label className="form-label mb-1">Connection Type</label>
                <input className="form-control text-capitalize" disabled value={getDataById?.planInfo?.type} />
              </div>
              <div className="col-md-6 col-sm-6 col-12 mt-3">
                <label className="form-label mb-1">Plan Name</label>
                <input className="form-control" disabled value={getDataById?.planInfo?.plan_name} />
              </div>
            </div>

            <div className="d-flex justify-content-between  align-items-center mt-5">
              <div className="f-20 fw-600">Plan Details</div>
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
            {showData1 === true ? (
              <>
                <hr />
                <div className="row mt-2">
                  <div className="col-md-6 col-sm-6 col-12 mt-3">
                    <label className="form-label mb-1">Plan Name</label>
                    <input className="form-control" disabled value={getDataById?.planInfo?.plan_name} />
                  </div>
                  <div className="col-md-6 col-sm-6 col-12 mt-3">
                    <label className="form-label mb-1">Plan Rate</label>
                    <input className="form-control" disabled value={getDataById?.planInfo?.amount} />
                  </div>
                  <div className="col-md-6 col-sm-6 col-12 mt-3">
                    <label className="form-label mb-1">Billing Cycle</label>
                    <input className="form-control" disabled value={getDataById?.planInfo?.billingCycleType} />
                  </div>
                  <div className="col-md-6 col-sm-6 col-12 mt-3">
                    <label className="form-label "></label>
                    <input className="form-control mt-1" disabled value={getDataById?.planInfo?.billingCycleDate} />
                  </div>
                </div>
                <div className="mt-2 fw-500 f-20">Internet Speed</div>
                <hr />
                <div className="row mt-2">
                  <div className="col-md-3 col-sm-3 col-12 mt-3">
                    <label className="form-label ">Download Speed</label>
                    <input className="form-control" disabled value={getDataById?.bandwidth_info?.max_download?.speed} />
                  </div>
                  <div className="col-md-3 col-sm-3 col-12 mt-3">
                    <label className="form-label "></label>
                    <input
                      className="form-control mt-2"
                      disabled
                      value={getDataById?.bandwidth_info?.max_download?.unit}
                    />
                  </div>
                  <div className="col-md-3 col-sm-3 col-12 mt-3">
                    <label className="form-label ">Upload Speed</label>
                    <input className="form-control" disabled value={getDataById?.bandwidth_info?.max_upload?.speed} />
                  </div>
                  <div className="col-md-3 col-sm-3 col-12 mt-3">
                    <label className="form-label "></label>
                    <input
                      className="form-control mt-2"
                      disabled
                      value={getDataById?.bandwidth_info?.max_upload?.unit}
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="d-flex justify-content-between  align-items-center mt-5">
              <div className="f-20 fw-600">Inventory Details</div>
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

            {showData2 === true ? (
              <>
                <hr />
                <Table>
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
                    {getFindInventory?.inventory_table?.map((res, index) => {
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
                </Table>
              </>
            ) : (
              <></>
            )}

            <div className="d-flex justify-content-between  align-items-center mt-5">
              <div className="f-20 fw-600">Service Details</div>
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

            {showData3 === true ? (
              <>
                <hr />
                <Table>
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
                    {getFindInventory?.service_table?.map(res => {
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
                </Table>
              </>
            ) : (
              <></>
            )}

            <div className="w-100 d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn text-primary mr-3 fw-500"
                onClick={() => {
                  toggle();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Next
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      <Modal centered scrollable isOpen={modalOpen} size="lg">
        <ModalHeader toggle={toggel1}>
          <div className="f-24">Convert to Subscriber</div>
        </ModalHeader>
        <ModalBody>
          <div className="fw-600 f-24 mt-3">Generate Payment Link</div>
          <div className="mt-3">
            Please click on the below button to generate the payment link. You can share it with the lead and once
            payment is updated you can close the link.
          </div>
          <div className="mt-3">
            <button type="button" className="btn btn-primary" onClick={() => setPaymentOpen(true)}>
              Get QR & Payment Link
            </button>
          </div>
          {paymentOpen && (
            <>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-12 mt-3">
                  <div className="fw-500 f-18">Generate Link</div>
                  <input type="text" className="form-control" value={phonepe?.url} disabled />
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-center">
                <QRCode value={phonepe?.url} />
              </div>
              <div className="mt-4 d-flex flex-column gap 3 align-items-center justify-content-center">
                <div className="d-flex">
                  <button
                    className="btn btn-primary mr-3"
                    type="button"
                    onClick={() => {
                      sendPaymentFunction();
                    }}
                  >
                    Send Link
                  </button>
                  <CopyToClipboard text={phonepe?.url} onCopy={onCopyText}>
                    <button className="btn btn-primary">Copy Link</button>
                  </CopyToClipboard>
                </div>
                {copyStatus && <p>Text copied to clipboard!</p>}
              </div>
            </>
          )}

          <div className="w-100 d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn text-primary mr-3 fw-500"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Cancel
            </button>
            {/* <button type="button" className="btn btn-primary mr-3">
            Preview
          </button> */}
            <button type="button" className="btn btn-primary" onClick={() => checkstatus()}>
              Check Status
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* successful modal */}
      <Modal size="lg" centered isOpen={paymentStatus === "paid"} toggle={() => setPaymentStatus("")}>
        <ModalBody className="bg-white p-md-4 p-sm-4 p-3">
          <div className="py-3">
            <div className="d-flex justify-content-center pb-3">
              <img src={doneImage} width="100px" />
            </div>
            <div className="fw-bold fs-3 text-center">Payment Successful!</div>
          </div>
        </ModalBody>
      </Modal>

      {/* Modal Pending */}

      <Modal size="lg" centered isOpen={paymentStatus === "pending"} toggle={() => setPaymentStatus("")}>
        <ModalBody className="bg-white p-md-4 p-sm-4 p-3">
          <div className="py-3">
            <div className="d-flex justify-content-end"></div>
            <div className="d-flex justify-content-center pb-3">
              <img src={pendingImage} width="100px" />
            </div>
            <div className="fw-bold fs-3 text-center">Payment Pending</div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
