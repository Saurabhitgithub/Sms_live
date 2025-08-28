import React from "react";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";

export default function ViewBngAttribute({ open, setOpen, viewData }) {
  return (
    <>
      <Modal centered scrollable isOpen={open} size="md">
        <ModalHeader toggle={() => setOpen(false)}>
          Detail BNG Attribute  
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <label className="f-14">Bng Name</label>
              <input
                type="text"
                className="form-control"
                value={viewData?.bng_name || ""}
                disabled
              />
            </div>
          </div>

          <Table hover className="mt-3">
            <thead>
              <tr>
                <th>Sn No.</th>
                <th>Attribute</th>
              </tr>
            </thead>
            <tbody>
              {viewData?.attributes?.length > 0 ? (
                viewData.attributes.map((attr, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{attr}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No attributes available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  );
}
