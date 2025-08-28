import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalHeader, ModalBody, Label, Table } from "reactstrap";
import { FaHashtag } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { BorderedTable } from "../../components/commonComponent/Bordertable/BorderedTable";
import moment from "moment";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { getReceiptDataById } from "../../service/admin";
import logo from "../../assets/images/jsTree/PdfLogo.png"
import Loader from "../../components/commonComponent/loader/Loader";

const ReceitModal = ({ isOpen, setIsOpen,ViewData }) => {
  const userData = [
    {
      Receipt_No: "123456",
      Created_On: "22 June 2024",
      Zone: "North",
      Name: "Shubham",
      Phone_No: "+91 9876543210",
      Amount: "Rs 1000",
      Created_By: "Infinity",
      Mode: "UPI",
      Status: "Paid",
    },
  ];

  const inVoiceRef1 = useRef(null);
  const inVoiceRef2 = useRef(null);
  // 
  const [allData, setAlldata] = useState(null);
  const [loader, setLoader] = useState(false);



  const getDataByidInPdf = async(id)=>{
      await getReceiptDataById(id).then((res)=>{
        // 
        setAlldata(res.data.data[0])
      }).catch((err)=>{
        console.log(err)
      })
  }
  useEffect(()=>{
    if(ViewData._id){

      getDataByidInPdf(ViewData._id)
    }
  },[ViewData])

  const TableRow = ({ label, value }) => (
    <tr>
      <td className="text-nowrap">{label}</td>
      <td className="text-nowrap">{value}</td>
    </tr>
  );
  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      // background: "linear-gradient(251.07deg, #FFFFFF 35.06%, #E8F9FA 95.96%)",
      // margin:'0 auto'
      background:"white"
    },
   
  };
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
        .then(function (dataUrl) {
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
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (index === arr.length - 1) {
            setLoader(false);
          }
        });
    }

    pdf.save("invoice.pdf");
  }

  // 
  const toggle = () => setIsOpen(false);
  return (
    <React.Fragment>
       {loader && <Loader />}

       <div style={{ width: "905px" }} className=" pdf_table_style_wrap">
          <div
            style={
              {
                height: "0px",
                overflow: "hidden",
              }
            }
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border">
              <div className="d-flex justify-content-center">
                <div className="f-28">Tax Receipt</div>
              </div>
              <div className="d-flex justify-content-between  align-items-center">
                <div>
                  <img src={logo} width={100} alt="" />
                </div>
                <div className="flex-direction-column mt-4">
                  <div>
                    Address : {allData?.companyInfo?.commercial_address?.address_line}
                  </div>
                  <div className="mt-2">
                    Mobile No :
                  </div>
                  <div className="mt-2">Email : {allData?.companyInfo?.email}</div>
                  <div className="mt-2">GSTIN :</div>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-4 w-75">
                <div className="flex-direction-column">
                  <div>
                   <b>To</b> : {allData?.subscriberInfo?.full_name}
                  </div>
                  <div className="mt-2">
                   <b> Address</b> : {allData?.subscriberInfo?.billing_address?.address_line1}
                  </div>
                  <div className="mt-2">
                   <b>Phone</b> : {allData?.subscriberInfo?.mobile_number}
                  </div>
                  <div className="mt-2">
                   <b>Status</b> : Paid
                  </div>
                  <div className="mt-2">
                    <b>Received From</b> : Acccount XXXXX0209
                  </div>
                </div>
                <div className="flex-direction-column">
                  <div>
                    <b>Receipt No</b> : {allData?.receipt_no}
                  </div>
                  <div className="mt-2">
                    <b>Date</b> : {moment(allData?.createdAt).format("YYYY-MM-DD")}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <table>
                  <thead className="ps-5">
                    <tr>
                    <th style={{width:"70%"}} className="pl-3">Description</th>
                    <th style={{width:"10%"}} className="pl-3">Qty</th>
                    <th style={{width:"20%"}} className="pl-3">Rate (Rs)</th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr>
                      <td className="pl-2 pt-3">
                        <div>
                         <b>Plan Name : </b> {allData?.planInfo?.category}
                        </div>
                        <div className='mt-2'>
                         <b>Plan Category:</b> {allData?.planInfo?.plan_name}
                        </div>
                        <div className='mt-2'>
                          <b>Description:</b> {allData?.planInfo?.shortDescription}
                        </div>
                      </td>
                      <td className="pl-2">1</td>

                      <td className="pl-2">{allData?.invoiceInfo?.invoice_table?.amount}</td>

                    </tr>
                    <tr>
                      <td colSpan={2} className="text-right pr-2 pt-2">
                        <div className="">
                          <b>Price :</b>
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
                        <div className=''>{allData?.invoiceInfo?.invoice_table?.amount}</div>
                        <div className='mt-3'>{allData?.invoiceInfo?.invoice_table?.sgst}</div>
                        <div className='mt-3'>{allData?.invoiceInfo?.invoice_table?.cgst}</div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}  className="text-right pr-2 ">
                        <div>
                          <b>Total:</b>
                        </div>
                      </td>
                      <td className="pl-2">{allData?.invoiceInfo?.invoice_table?.total_amount}</td>
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
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
     
     
        <ModalHeader toggle={toggle} style={{ font: "200px" }}>
          <div className="head_min">Receipt</div>
          
        </ModalHeader>
        <ModalBody>
          <div className="Grid_Style_template">
            <div className="child_container">
              <div>
                {" "}
                <FaHashtag size={30} color="gray" />
              </div>
              <div>
                <div>Receipt Number:</div>
                <div style={{ marginTop: "8px" }}>{ViewData?.receipt_no}</div>
              </div>
              <div>
                {" "}
                <div>Created on:</div> 
                <div style={{ marginTop: "8px" }}>{moment(ViewData?.createdAt).format("YYYY-MM-DD")}</div>
              </div>
            </div>
            <div className="verticle_line"></div>
            <div className="child_container">
              <div class="px-3">
                {" "}
                <IoPersonSharp size={30} color="gray" />
              </div>
              <div>
                <div>User Name:</div>
                <div style={{ marginTop: "8px" }}>{ViewData?.subscriberInfo?.userName}</div>
              </div>
              <div>
                {" "}
                <div>Phone Number:</div>
                <div style={{ marginTop: "8px" }}>{ViewData?.subscriberInfo?.mobile_number}</div>
              </div>
            </div>
          </div>

          <div class="container mt-5 mb-5">
            <div class="row">
              <div class="col">
                <Label className="labels mt-2 ">Created By</Label>
                {/* <div
                  style={{ marginTop: "5px", background: "#F6F6F6", padding: "8px 16px 8px 16px", borderRadius: "8px" }}
                >
                  Infinity
                </div> */}
                <input type="text" className="form-control" disabled value={"Admin"} />
              </div>
              {/* <div class="col">
                <Label className="labels mt-2">Zone</Label>
                <div
                  style={{ marginTop: "5px", background: "#F6F6F6", padding: "8px 16px 8px 16px", borderRadius: "8px" }}
                >
                  Zone1
                </div>
              </div> */}
            </div>
          </div>
          <hr />
          <div class="mt-5">Invoice Details</div>
          <div className="mt-2"></div>
          <BorderedTable>
            <Table hover responsive>
              <tbody>
                
                  <React.Fragment >
                    <TableRow label="Invoice No." value={ViewData?.invoiceInfo?.invoice_no} />
                    <TableRow label="Created On" value={moment(ViewData?.invoiceInfo?.createdAt).format("YYYY-MM-DD")} />
                    {/* <TableRow label="Zone"  /> */}
                    <TableRow label="Name" value={ViewData?.subscriberInfo?.full_name} />
                    <TableRow label="Phone No"  value={ViewData?.subscriberInfo?.mobile_number}/>
                    <TableRow label="Amount (Rs)" value={ViewData?.invoiceInfo?.invoice_table?.total_amount}/>
                    {/* <TableRow label="Created By"  /> */}
                    <TableRow label="Mode"  value={ViewData?.invoiceInfo?.payment_mode} />
                    {/* <TableRow label="Status"  /> */}
                  </React.Fragment>
             
              </tbody>
            </Table>
          </BorderedTable>

          <div className="col-md-12 d-flex  justify-content-end mt-5 p-0">
            <button className="cancel_btn mr-2" onClick={toggle}>
              Cancel
            </button>
            <button className="btn_primary_btn" onClick={convertToImg}>DownLoad Pdf</button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default ReceitModal;