import React from "react";
import Content from "../../layout/content/Content";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import Style from "./style.module.css";

// Utility function to strip HTML tags
const stripHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default function ViewPdfTemplate({ modal, setModal, viewTemplateData }) {
  const toggle = () => setModal(!modal);
  
  const paramsData = useParams();

  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader
          toggle={toggle}
          className="d flex align-items-center justify-content-between pop_up"
        >
          <span className={`head_min bandWidthHeader `}> Pdf Template</span>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <Label>Pdf Logo</Label>
              <div className={Style.LogoCustom1}>
                <img src={viewTemplateData?.logo?.file_url} alt="" />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <Label>Template Name</Label>
              <input
                type="text"
                className="form-control"
                disabled
                placeholder="Enter Name"
                value={viewTemplateData?.name}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <Label>Plan</Label>
              <textarea
                value={stripHTML(viewTemplateData?.plan)}
                disabled
                className="form-control"
              />
            </div>
            <div className="col-md-12 mt-3">
              <Label>Inventory</Label>
              <textarea
                value={stripHTML(viewTemplateData?.inventory)}
                disabled
                className="form-control"
              />
            </div>
            <div className="col-md-12 mt-3">
              <Label>Services</Label>
              <textarea
                value={stripHTML(viewTemplateData?.service)}
                disabled
                className="form-control"
              />
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
