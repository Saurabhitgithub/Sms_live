import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import style from "./SubscriberManagement.module.css";
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from "reactstrap";
import AccountInfo from "./AccountInfo";
import UserInfo from "./UserInfo";
import BngInfo from "./BngInfo";

function AddSubscriber({
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
            <span className={`head_min ${style.head_min}`}> {mode === "edit" ? "Edit" : "Add"} Subscriber Details</span>
          </ModalHeader>
          <ModalBody className={`p-md-4 p-sm-3 p-2 ${style.customScrollbar}`} style={{ overflowX: "hidden" }}>
            <div>
              <Nav className=" col-md-12 p-3">
                <NavItem>
                  <NavLink
                    className={` ${activeTab === "1" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "1" ? "active" : ""
                    }`}
                    // onClick={() => toggleTab("1")}
                  >
                    Account Info
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    className={`${activeTab === "2" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "2" ? "active" : ""
                    }`}
                    // onClick={() => toggleTab("2")}
                  >
                    User Info
                  </NavLink>
                </NavItem>

                {/* <NavItem>
                  <NavLink
                    className={`${activeTab === "3" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "3" ? "active" : ""
                    }`}
                    // onClick={() => toggleTab("3")}
                  >
                    Attributes
                  </NavLink>
                </NavItem> */}
              </Nav>

              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <AccountInfo
                        mode={mode}
                        toggleTab={toggleTab}
                        setOpen={setOpen}
                        handleChangeInput={handleChangeInput}
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        nextButton={nextButton}
                        setPlanErr={setPlanErr}
                        setLoader={setLoader}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <UserInfo
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
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <BngInfo 
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
              </TabContent>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
}

export default AddSubscriber;
