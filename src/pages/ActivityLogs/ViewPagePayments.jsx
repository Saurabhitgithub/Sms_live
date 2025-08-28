import moment from "moment";
import React from "react";
import {  Modal, ModalBody, ModalHeader, } from "reactstrap";



function ViewPagePayments({ open, setOpen, id, fullData,rowPayment }) {
  const toggle = () => setOpen({ status: !open });


 
  return (
    <>
      <Modal scrollable={true} isOpen={open} toggle={open} className="" size="lg">
        <ModalHeader toggle={toggle}>
          <div className="f-24">
            <span>Transaction ID: {rowPayment?.paymentDetails?.paymentId}</span>
          </div>
        </ModalHeader>

        <ModalBody>
        <div className="d-flex w-100  mt-3">
           
            <div className="d-flex flex-column g-1">
                <span className="text-secondary f-18">Mode</span>
                <span className="f-18">{rowPayment?.paymentMode}</span>
            </div>
           
           
            <div className="line-full mx-5"></div>
            <div className="d-flex flex-column g-1">
                <span className="text-secondary f-18">Amount</span>
                <span className="f-18">{rowPayment?.paymentDetails?.amount}</span>
            </div>
            <div className="line-full mx-5"></div>
            <div className="d-flex flex-column g-1">
                <span className="text-secondary f-18">Status</span>
                <span className="f-18 ">{rowPayment?.paymentDetails?.paymentStatus}</span>
            </div>
            <div className="line-full mx-5"></div>
            <div className="d-flex flex-column g-1">
                <span className="text-secondary f-18">Date/Time</span>
                <span className="f-18">{moment(rowPayment?.createdAt).format("DD-MM-YYYY / HH:mm:ss")}</span>
            </div>
       
        </div>
        <div className="mt-5">
            <h2 className="f-20">Plan Details</h2>
        </div>
        <div className="d-flex g-3 mt-3">
     <div className="d-flex flex-column g-1">
     <span>Plan Name:</span>
     <span>Plan Type/Category:</span>

     </div>
     <div className="d-flex flex-column g-1">
     <span className="ml-3 text-secondary">{rowPayment?.planData[0]?.plan_name}</span>
     <span className="ml-3 text-secondary">{rowPayment?.planData[0]?.type}/{rowPayment?.planData[0]?.category}</span>
     </div>
           
        </div>
        <div className="mt-5">
            <h2 className="f-20">Customer Details</h2>
        </div>
        <div className="d-flex g-3 mt-3">
     <div className="d-flex flex-column g-1">
     <span>Full Name:</span>
     <span>Email ID:</span>
     <span>Phone Number:</span>

     </div>
     <div className="d-flex flex-column g-1">
     <span className="ml-3 text-secondary">{rowPayment?.subscriberData[0]?.full_name}</span>
     <span className="ml-3 text-secondary">{rowPayment?.subscriberData[0]?.email}</span>
     <span className="ml-3 text-secondary">{rowPayment?.subscriberData[0]?.mobile_number}</span>
     </div>
           
        </div>
       
        </ModalBody>
      </Modal>
    </>
  );
}

export default ViewPagePayments;
