import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import style from "./SubscriberManagement.module.css";
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from "reactstrap";
import UserInfoOther from "./UserInfoOther";
import BngInfoOther from "./BngInfoOther";
import InventoryOther from "./InventoryOther";
import ServicesOther from "./ServicesOther";

function AddSubscriberOther({
  open,
  setOpen,
  mode,
  handleChangeInput,
  formData,
  setFormData,
  handleSubmit,
  errors,
  setActiveTab,
  activeTab,
  setAddressFile,
  setIdFile,
  idFile,
  addressFile,
  setFile1Err,
  setFile2Err,
  removeErr1,
  removeErr2,
  setFileFordelete,
  setbStateErr,
  setiStateErr,
  nextButton,
  setPlanErr,
  setLoader,
  setGetDatabng,
  getDataBng,
  getDataBngFunction,
  handleInutAttributes
}) {
  const toggle = () => {
    setActiveTab("1");
    setOpen({ mode: mode, status: !open });
  };

  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <div className="info_page">
        <Modal scrollable={true} className="p-md-4 p-sm-3 p-2" isOpen={open} size="xl">
          <ModalHeader toggle={toggle} className="d flex align-items-center justify-content-between pop_up">
            <span className={`head_min ${style.head_min}`}> {mode === "edit" ? "Edit" : "Add"} Subscriber Other Details</span>
          </ModalHeader>
          <ModalBody className={`p-md-4 p-sm-3 p-2 ${style.customScrollbar}`} style={{ overflowX: "hidden" }}>
            <div>
              {/* <Nav className=" col-md-12 p-3">
               

                <NavItem>
                  <NavLink
                    className={`${activeTab === "1" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "1" ? "active" : ""
                    }`}
                   
                  >
                    User Info
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${activeTab === "2" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "2" ? "active" : ""
                    }`}
                    
                  >
                    Inventory
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${activeTab === "3" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "3" ? "active" : ""
                    }`}
                   
                  >
                    Services
                  </NavLink>
                </NavItem>
               
              </Nav> */}

              <TabContent activeTab={activeTab}>
                
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <UserInfoOther
                        mode={mode}
                        setOpen={setOpen}
                        toggleTab={toggleTab}
                        handleChangeInput={handleChangeInput}
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        setAddressFile={setAddressFile}
                        setIdFile={setIdFile}
                        idFile={idFile}
                        addressFile={addressFile}
                        setFile1Err={setFile1Err}
                        setFile2Err={setFile2Err}
                        removeErr1={removeErr1}
                        removeErr2={removeErr2}
                        nextButton={nextButton}
                        setFileFordelete={setFileFordelete}
                        setbStateErr={setbStateErr}
                        setiStateErr={setiStateErr}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <InventoryOther
                        handleSubmit={handleSubmit}
                        mode={mode}
                        setOpen={setOpen}
                        toggleTab={toggleTab}
                        getDataBng={getDataBng}
                        setGetDatabng={setGetDatabng}
                        getDataBngFunction={getDataBngFunction}
                        handleInutAttributes={handleInutAttributes}
                        formData={formData}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <ServicesOther
                        handleSubmit={handleSubmit}
                        mode={mode}
                        setOpen={setOpen}
                        toggleTab={toggleTab}
                        getDataBng={getDataBng}
                        setGetDatabng={setGetDatabng}
                        getDataBngFunction={getDataBngFunction}
                        handleInutAttributes={handleInutAttributes}
                        formData={formData}
                      />
                    </Col>
                  </Row>
                </TabPane>
                {/* <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <BngInfoOther
                        handleSubmit={handleSubmit}
                        mode={mode}
                        setOpen={setOpen}
                        toggleTab={toggleTab}
                        getDataBng={getDataBng}
                        setGetDatabng={setGetDatabng}
                        getDataBngFunction={getDataBngFunction}
                        handleInutAttributes={handleInutAttributes}
                        formData={formData}
                      />
                    </Col>
                  </Row>
                </TabPane> */}
              </TabContent>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
}

export default AddSubscriberOther;
