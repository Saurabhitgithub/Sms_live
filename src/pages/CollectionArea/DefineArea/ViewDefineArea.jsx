import React, { useEffect, useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function ViewDefineArea({ viewModal, setViewModal, resEditData }) {
  const toggle = () => {
    setViewModal(!viewModal);
  };

  // Create an array state to track showMore state for each street
  const [showMoreArray, setShowMoreArray] = useState([]);

  // Toggle the "show more" for a specific street based on index
  const toggleShowMore = (index) => {
    setShowMoreArray((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index]; // Toggle the specific index
      return updated;
    });
  };

  useEffect(() => {
    // 
  }, [resEditData]);

  return (
    <div>
      <Modal centered scrollable isOpen={viewModal} size="lg">
        <ModalHeader toggle={toggle}>
          <div className="f-24">{resEditData?.name}</div>
        </ModalHeader>
        <ModalBody>
          <div className="fs-24 fw-500">You can view all the streets and buildings in a particular area here</div>
          {resEditData?.streets?.map((street, index) => (
            <div key={index} className="border p-2 mt-md-3 mt-sm-2 mt-2 rounded">
              <div
                className="col-md-12 p-0 flex justify-content-between"
                onClick={() => toggleShowMore(index)} // Toggle based on index
              >
                <div className="labelsHeading">{street?.name} {`(${street?.buildings?.length})`}</div>
                <div className="labelsHeading" style={{ cursor: "pointer" }}>
                  {showMoreArray[index] ? "show less" : "show more"}
                  {showMoreArray[index] ? (
                    <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
                  ) : (
                    <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
                  )}
                </div>
              </div>
              {showMoreArray[index] && (
                <>
              <hr />

                  {street?.buildings?.map((building, buildingIndex) => (
                    <div key={buildingIndex} className="mt-3">{building?.name}</div>
                  ))}
                </>
              )}
            </div>
          ))}
        </ModalBody>
      </Modal>
    </div>
  );
}
