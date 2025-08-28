import React from 'react'
import { Modal, ModalHeader, ModalBody, FormGroup, Label, Input } from "reactstrap";


export default function ViewServicePopup({ open, toggle, formData }) {
    return (
        <>
            <Modal isOpen={open} size="lg">
                <ModalHeader toggle={toggle} className="d-flex align-items-center justify-content-between pop_up">
                    <span className={`head_min  bandWidthHeader`}>Service View</span>
                </ModalHeader>

                <ModalBody>
                    <div className="row">
                        <div className="col-12">
                            <FormGroup>
                                <Label for="templateName" className="labels mt-2 ">
                                    Service Name
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Enter Service Name"
                                    name="service_name"
                                    value={formData?.service_name}
                                    disabled
                                />
                            </FormGroup>
                        </div>
                        <div className="col-md-6 mt-2">
                            <Label for="templateName" className="labels mt-2 ">
                                Service Cost
                            </Label>
                            <Input
                                type="number"
                                placeholder="Enter Service Cost"
                                name="cost"
                                value={formData?.cost}
                                disabled
                            />
                        </div>
                        <div className="col-md-6 mt-2">
                            <Label for="templateName" className="labels mt-2 ">
                                Service Duration
                            </Label>
                            <Input
                                type="text"
                                placeholder="Enter Duration (Optional)"
                                name="duration_frequency"
                                value={`${formData?.duration_frequency} ${formData?.duration}`}
                                disabled
                            />

                        </div>
                        <div className="col-md-6 mt-2">
                            <Label for="templateName" className="labels mt-2 ">
                                CGST (If Applicable) %
                            </Label>
                            <Input
                                type="text"
                                placeholder="Enter CGST in percent"
                                name="cgst"
                                value={formData?.cgst !== null ? formData?.cgst : 'NA'}
                                disabled
                            />
                        </div>
                        <div className="col-md-6 mt-2">
                            <Label for="templateName" className="labels mt-2 ">
                                SGST (If Applicable) %
                            </Label>
                            <Input
                                type="text"
                                placeholder="Enter GST in percent"
                                name="sgst"
                                value={formData?.sgst !== null ? formData?.sgst : 'NA'}
                                disabled
                            />
                        </div>
                        <div className="col-md-6 mt-2">
                            <Label for="templateName" className="labels mt-2 ">
                                Service Tax (If Applicable) %
                            </Label>
                            <Input
                                type="text"
                                placeholder="Enter service tax in percent"
                                name="service_tax"
                                value={formData?.service_tax !== null ? formData?.service_tax : 'NA'}
                                disabled
                            />
                        </div>
                    </div>

                </ModalBody>


            </Modal>
        </>
    )
}
