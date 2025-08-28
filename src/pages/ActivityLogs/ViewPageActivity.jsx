import moment from "moment";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

function ViewPageActivity({ open, setOpen, id, fullData, rowData }) {
  const toggle = () => setOpen({ status: !open });

  return (
    <>
      <Modal scrollable={true} isOpen={open} toggle={open} className="" size="lg">
        <ModalHeader toggle={toggle}>
          <div className="f-24">
            <span>Event Logs</span>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="d-flex w-100 row mt-3">
            <div className="d-flex gap-1 col-12 col-sm-4 h-100 justify-content-between">
              <div className="d-flex flex-sm-column flex-row gap-5 ">
                <span className="text-secondary f-18">Role</span>
                <span className="f-18 ml-md-0 ml-sm-0 ml-2">{rowData?.role}</span>
              </div>

              <div className="line-full d-none d-sm-block me-2"></div>
            </div>

            <div className="d-flex gap-1 col-12 col-sm-4 h-100 justify-content-between">
              <div className="d-flex flex-sm-column flex-row gap-5 ">
                <span className="text-secondary f-18">Name</span>
                <span className="f-18 me-2 ml-md-0 ml-sm-0 ml-2">{rowData?.name}</span>
              </div>

              <div className="line-full d-none d-sm-block"></div>
            </div>

            <div className="d-flex gap-1 col-12 col-sm-4 justify-content-between mt-md-0 mt-sm-0 mt-0">
              <div className="d-flex flex-sm-column flex-row gap-5  ">
                <span className="text-secondary f-18 ">Date/Time</span>
                <span className="f-18 me-2 ml-md-0 ml-sm-0 ml-2">
                  {moment(rowData?.createdAt).format("DD-MM-YYYY / HH:mm:ss")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-md-4 mt-sm-4 mt-5">
            <h2 className="f-20">Event Details</h2>
          </div>
          <div className="d-flex mt-3">
            <span>Activity:</span>
            <span className="ml-3 text-secondary">{rowData?.activity}</span>
          </div>
          <div className="d-flex flex-column mt-3">
            <span>Details:</span>
            <div className="mt-2 text-secondary details-box">{rowData?.detail}</div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default ViewPageActivity;
