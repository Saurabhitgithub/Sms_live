import moment from "moment";
import React, { useEffect, useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button, Table } from "reactstrap";

export const ViewBandWidth = ({ modal, setModal, bandWidthRow }) => {
  const toggle = () => setModal(!modal);
  const [showMore, setShowMore] = useState(true);
  useEffect(() => {
    // 
    
  }, [bandWidthRow]);

  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle} className="d flex align-items-center justify-content-between pop_up">
          <span className={`head_min bandWidthHeader `}> Bandwidth Template</span>
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <Form className="w-100">
              <div className="mb-4">
                <div className="text-secondary">
                  {" "}
                  Created on: {moment(bandWidthRow?.createdAt).format("DD-MM-YYYY")}
                </div>
                <h4 className="text-muted"> {bandWidthRow?.name}</h4>
              </div>

              <div className="mt-3 BandwidthHeading">Bandwidth Details</div>
              <hr />
              <div className="row">
                <div className="col-12">
                  <FormGroup>
                    <Label for="templateName" className="labels mt-2">
                      Template Name
                    </Label>
                    <Input type="text" name="templateName" id="templateName" value={bandWidthRow?.name} disabled />
                  </FormGroup>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="planName" className="labels mt-2">
                     Max Download Bandwidth
                    </Label>
                    <Input
                      type="text"
                      name="planName"
                      id="planName"
                      value={bandWidthRow?.max_download?.speed}
                      disabled
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="speedDownload" className="labels mt-2">
                      Speed
                    </Label>
                    <Input
                      type="text"
                      name="speedDownload"
                      id="speedDownload"
                      value={bandWidthRow?.max_download?.unit}
                      disabled
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="uploadBandwidth" className="labels mt-2">
                     Max Upload Bandwidth
                    </Label>
                    <Input
                      type="text"
                      name="uploadBandwidth"
                      id="uploadBandwidth"
                      value={bandWidthRow?.max_upload?.speed}
                      disabled
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="speedUpload" className="labels mt-2">
                      Speed
                    </Label>
                    <Input
                      type="text"
                      name="speedUpload"
                      id="speedUpload"
                      value={bandWidthRow?.max_upload?.unit}
                      disabled
                    />
                  </FormGroup>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="minDownload" className="labels mt-2">
                      Min Download Bandwidth
                    </Label>
                    <Input
                      type="text"
                      name="minDownload"
                      id="minDownload"
                      value={bandWidthRow?.min_download?.speed}
                      disabled
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="minSpeedDownload" className="labels mt-2">
                      Speed
                    </Label>
                    <Input
                      type="text"
                      name="minSpeedDownload"
                      id="minSpeedDownload"
                      value={bandWidthRow?.min_download?.unit}
                      disabled
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="minUpload" className="labels mt-2">
                      Min Upload Bandwidth
                    </Label>
                    <Input
                      type="text"
                      name="minUpload"
                      id="minUpload"
                      value={bandWidthRow?.min_upload?.speed}
                      disabled
                    />
                  </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                  <FormGroup>
                    <Label for="minSpeedUpload" className="labels mt-2">
                      Speed
                    </Label>
                    <Input
                      type="text"
                      name="minSpeedUpload"
                      id="minSpeedUpload"
                      value={bandWidthRow?.min_upload?.unit}
                      disabled
                    />
                  </FormGroup>
                </div>
              </div>

               <div className="row mt-4">
                                <div className="col-12">
                                  <div className="table-responsive">
                                    <Table>
                                      <thead style={{ backgroundColor: "#F5F6FA" }}>
                                        <tr>
                                          <th>BNG</th>
                                          <th>Attributes</th>
                                          <th>Operator</th>
                                          <th>Values</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {bandWidthRow?.assignattributesData?.attributes?.map((attr, index) => (
                                          <tr key={index}>
                                            <td>{bandWidthRow?.assignattributesData?.bng_name}</td>
                                            <td>{attr.key}</td>
                                            <td>
                                              <input
                                                className="form-control"
                                                disabled
                                                value={attr?.opt}
                                              >
                                               
                                              </input>
                                            </td>
                                            <td>
                                              <input
                                               
                                                className="form-control"
                                                value={attr?.value}
                                               disabled
                                                required
                                              />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                </div>
                              </div>

              <div className="col-md-12 mt-5 flex justify-content-between">
                <div className="labelsHeading BandwidthToggleText">Advanced Options</div>
              </div>

              <hr />

              <>
                <div className="row">
                  <div className="col-12 col-md-12 col-lg-6 mb-2">
                    <FormGroup>
                      <Label for="routerType" className="labels mt-2">
                        Router Type
                      </Label>
                      <Input type="text" name="routerType" id="routerType" value={bandWidthRow?.router_type} disabled />
                    </FormGroup>
                  </div>
                </div>

                <div className="BandwidthHeading">Burst Limit</div>

                <div className="row mt-4">
                  <div className="col-12 col-md-12 col-lg-6 mb-2">
                    <FormGroup>
                      <Label for="burstRate" className="labels mt-2">
                        Burst Rate
                      </Label>
                      <Input type="text" name="burstRate" id="burstRate" value={bandWidthRow?.burst?.rate} disabled />
                    </FormGroup>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <FormGroup>
                      <Label for="burstSpeed" className="labels mt-2">
                        Speed
                      </Label>
                      <Input type="text" name="burstSpeed" id="burstSpeed" value={bandWidthRow?.burst?.rate_unit} disabled />
                    </FormGroup>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <FormGroup>
                      <Label for="burstThreshold" className="labels mt-2">
                        Burst Threshold
                      </Label>
                      <Input type="text" name="burstThreshold" id="burstThreshold" value={bandWidthRow?.burst?.threshold} disabled />
                    </FormGroup>
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <FormGroup>
                      <Label for="burstSpeedThreshold" className="labels mt-2">
                        Speed
                      </Label>
                      <Input type="text" name="burstSpeedThreshold" id="burstSpeedThreshold" value={bandWidthRow?.burst?.threshold_unit} disabled />
                    </FormGroup>
                  </div>
                  <div className="col-12">
                    <FormGroup>
                      <Label for="burstTime" className="labels mt-2">
                        Burst Time
                      </Label>
                      <Input type="text" name="burstTime" id="burstTime" value={bandWidthRow?.burst?.time} disabled />
                    </FormGroup>
                  </div>
                </div>

                <div className="BandwidthHeading">Priority</div>

                <div className="row">
                  <div className="col-12">
                    <FormGroup>
                      <Label for="priority" className="labels mt-2">
                        Priority takes value 1 to 8 where 1 implies the highest priority, but 8 being the lowest
                      </Label>
                      <Input type="text" name="priority" id="priority" value={bandWidthRow?.priority} disabled />
                    </FormGroup>
                  </div>
                </div>
              </>

              <ModalFooter className="mt-4">
                <Button color=" btn btn-primary" onClick={toggle}>
                  Back
                </Button>
              </ModalFooter>
            </Form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
