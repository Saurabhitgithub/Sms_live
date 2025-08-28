import React, { useState } from "react";
import style from "./SubscriberManagement.module.css";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { IoMdDownload } from "react-icons/io";
function UserInfoViewOther({ planData }) {
  const [showMoreOne, setShowMoreOne] = useState(false);
  const [showMoreTwo, setShowMoreTwo] = useState(false);
  const [showMoreThree, setShowMoreThree] = useState(false);
  const [showMoreFour, setShowMoreFour] = useState(false);
  const [openDocView, setopenDocView] = useState(false);
  const [openUrl, setOpenUrl] = useState("");

  const toggleShowMoreOne = () => {
    setShowMoreOne(!showMoreOne);
  };
  const toggleShowMoreTwo = () => {
    setShowMoreTwo(!showMoreTwo);
  };
  const toggleShowMoreThree = () => {
    setShowMoreThree(!showMoreThree);
  };
  const toggleShowMoreFour = () => {
    setShowMoreFour(!showMoreFour);
  };
  return (
    <div>
      <Modal
        isOpen={openDocView}
        className="p-0"
        size="lg"
        toggle={() => {
          setOpenUrl("");
          setopenDocView(!openDocView);
        }}
      >
        <ModalHeader
          toggle={() => {
            setOpenUrl("");
            setopenDocView(!openDocView);
          }}
        >
          <div className="f-28">Document View</div>
        </ModalHeader>
        <ModalBody className="p-0">
          {openUrl?.includes(".pdf") ? (
            <>
              <iframe title="document view" src={openUrl} style={{ width: "100%", height: "80vh" }}></iframe>
            </>
          ) : (
            <>
              <img className="w-100" src={openUrl} />
            </>
          )}
        </ModalBody>
      </Modal>
      <>
        {/* personal details  */}
        <div className="col-md-12 mt-md-5 mt-sm-4 mt-4 p-0 flex justify-content-between " onClick={toggleShowMoreOne}>
          <div className="labelsHeading">Personal Details</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreOne ? "show less" : "show more"}
            {showMoreOne ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div className={style.horizontal}>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreOne && (
          <>
            <div className="row ">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Full Name</label>

                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.full_name}</span>
                </div>
              </div>
              <div className="col-md-6 mt-3 ">
                <label className={`${style.labels} mb-2`}>Email</label>
                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.email}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Mobile Number</label>

                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.mobile_number}</span>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Alternate Mobile Number</label>
                <div className={style.boxBackground}>
                  <span className={style.labels}>
                    {planData?.alter_mobile_number ? planData?.alter_mobile_number : "Not Added"}
                  </span>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className={`${style.labels} mb-2`}>GST No.</label>

                <div className="row">
                  <div className="col-md-6 ">
                    <div className={`${style.boxBackground} `}>
                      <span className={style.labels}>{planData?.gst_no ? planData?.gst_no : "Not Added"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* plan details  */}
        <div className="col-md-12 mt-md-5 mt-sm-4 mt-4 p-0 flex justify-content-between " onClick={toggleShowMoreTwo}>
          <div className="labelsHeading">Billing Address</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreTwo ? "show less" : "show more"}
            {showMoreTwo ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div className={style.horizontal}>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreTwo && (
          <>
            <div className="row ">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>House/Flat No.</label>

                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.billing_address?.flat_number}</span>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>State</label>
                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.billing_address?.state}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>City</label>

                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.billing_address?.city}</span>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Pin Code</label>
                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.billing_address?.pin_code}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* internet speed  */}
        <div className="col-md-12 mt-md-5 mt-sm-4 mt-4 p-0 flex justify-content-between " onClick={toggleShowMoreThree}>
          <div className="labelsHeading">Installation Address</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreThree ? "show less" : "show more"}
            {showMoreThree ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div className={style.horizontal}>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreThree && (
          <>
            <div className="row ">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>House/Flat No.</label>

                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.installation_address?.flat_number}</span>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>State</label>
                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.installation_address?.state}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>City</label>

                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.installation_address?.city}</span>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Pin Code</label>
                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.installation_address?.pin_code}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* bandwidth details  */}
        <div className="col-md-12 mt-md-5 mt-sm-4 mt-4 p-0 flex justify-content-between " onClick={toggleShowMoreFour}>
          <div className="labelsHeading">Document Details</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreFour ? "show less" : "show more"}
            {showMoreFour ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div className={style.horizontal}>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreFour && (
          <>
            <div className="dark_heading mt-4 mb-2">Identity Verification</div>
            <div className="row ">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Identity Verification</label>

                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.identity_verify?.id_proof}</span>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>ID Proof No.</label>
                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.identity_verify?.id_proof_no}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Attachment <IoMdDownload /></label>

                <div
                  className={`${style.boxBackground} pointer`}
                  onClick={() => {
                    setOpenUrl(planData?.identity_verify?.attachment?.file_url);
                    setopenDocView(true);
                  }}
                >
                  <span className={style.labels}>
                    {planData?.identity_verify?.attachment?.file_name
                      ? planData?.identity_verify?.attachment?.file_name
                      : "No file uploaded"}
                  </span>
                </div>
              </div>
            </div>
            <div className="dark_heading mt-5 mb-2">Address Verification</div>
            <div className="row ">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Address Verification</label>

                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.address_verify?.address_proof}</span>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Address Proof No.</label>
                <div className={style.boxBackground}>
                  <span className={style.labels}>{planData?.address_verify?.address_proof_no}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-3">
                <label className={`${style.labels} mb-2`}>Attachment <IoMdDownload /></label>

                <div
                  className={`${style.boxBackground} pointer`}
                  onClick={() => {
                    setOpenUrl(planData?.address_verify?.attachment?.file_url);
                    setopenDocView(true);
                  }}
                >
                  <span className={style.labels}>
                    {planData?.address_verify?.attachment?.file_name
                      ? planData?.address_verify?.attachment?.file_name
                      : "No file uploaded"}
                  </span>
             
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
}

export default UserInfoViewOther;
