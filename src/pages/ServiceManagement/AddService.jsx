import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";

export const AddService = ({ open, toggle, formData, handleChange, submitFunction, mode }) => {
  return (
    <>
      <Modal isOpen={open} size="lg">
        <ModalHeader toggle={toggle} className="d-flex align-items-center justify-content-between pop_up">
          <span className={`head_min  bandWidthHeader`}>
            {mode === "edit" ? "Update Service" : "Create New Service"}
          </span>
        </ModalHeader>
        <Form onSubmit={submitFunction}>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <FormGroup>
                  <Label for="templateName" className="labels mt-2 ">
                    Service Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Service Name"
                    name="service_name"
                    value={formData?.service_name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </div>
              <div className="col-md-6 mt-2">
                <Label for="templateName" className="labels mt-2 ">
                  Service Cost <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Enter Service Cost"
                  name="cost"
                  value={formData?.cost}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-2">
                <Label for="templateName" className="labels mt-2 ">
                  Service Duration <span className="text-danger">*</span>
                </Label>
                <div className="row">
                  <div className="col-6">
                    <Input
                      type="number"
                      placeholder="Enter Duration"
                      name="duration_frequency"
                      value={formData?.duration_frequency}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <select
                      className="form-control"
                      name="duration"
                      value={formData?.duration}
                      onChange={handleChange}
                      required
                    >
                      <option value={""}>Select Cycle</option>
                      <option value={"daily"}>Daily</option>
                      <option value={"weekly"}>Weekly</option>
                      <option value={"monthly"}>Monthly</option>
                      <option value={"quarterly"}>Quarterly</option>
                      <option value={"half_yearly"}>Half Yearly</option>
                      <option value={"yearly"}>Yearly</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <Label for="templateName" className="labels mt-2 ">
                  CGST (If Applicable) %
                </Label>
                <Input
                  type="number"
                  placeholder="Enter CGST in percent"
                  name="cgst"
                  value={formData?.cgst}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mt-2">
                <Label for="templateName" className="labels mt-2 ">
                  SGST (If Applicable) %
                </Label>
                <Input
                  type="number"
                  placeholder="Enter GST in percent"
                  name="sgst"
                  value={formData?.sgst}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mt-2">
                <Label for="templateName" className="labels mt-2 ">
                  Service Tax (If Applicable) %
                </Label>
                <Input
                  type="number"
                  placeholder="Enter service tax in percent"
                  name="service_tax"
                  value={formData?.service_tax}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mt-2">
                <Label for="templateName" className="labels mt-2 ">
                  HSC/SAC Code
                </Label>
                <Input
                  type="text"
                  placeholder="Enter HSC/SAC Code"
                  name="hsc_sac"
                  value={formData?.hsc_sac}
                  onChange={handleChange}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="btn" type="button" onClick={toggle}>
              Cancel
            </Button>
            <Button color="btn btn-primary" type="submit">
              {mode === "edit" ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};
