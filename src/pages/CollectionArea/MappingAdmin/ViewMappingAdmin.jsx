import React, { useEffect, useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function ViewMappingAdmin({ viewModal, setViewModal, resEditData }) {
  const toggle = () => {
    setViewModal(!viewModal);
  };
  useEffect(() => {
    
  }, [resEditData]);
  const [showMoreOne, setShowMoreOne] = useState(false);
  const toggleShowMoreOne = () => {
    setShowMoreOne(!showMoreOne);
  };
  return (
    <div>
      <Modal centered scrollable isOpen={viewModal} size="lg">
        <ModalHeader toggle={toggle}>
          <div className="f-24">{resEditData?.isp_id?.name ? resEditData?.isp_id?.name : "View Details"}</div>
        </ModalHeader>
        <ModalBody>
          <div
            className="col-md-12 mt-md-5 mt-sm-4 mt-4 p-0 flex justify-content-between"
            onClick={() => toggleShowMoreOne()} // Toggle based on index
          >
            <div className="labelsHeading">{resEditData?.name}</div>
            <div className="labelsHeading" style={{ cursor: "pointer" }}>
              {showMoreOne ? "show less" : "show more"}
              {showMoreOne ? (
                <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
              ) : (
                <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
              )}
            </div>
          </div>
          <div className="horizontal">
            <hr />
          </div>
          {showMoreOne && (
            <>
              <div className="mt-4">
                {resEditData?.assign_user?.map((ee)=>{
                    return (
                        <div className="mt-3">{ee?.name}</div>
                    )
                })}
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
