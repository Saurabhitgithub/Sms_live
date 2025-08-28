import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import style from "./SubscriberManagement.module.css";
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from "reactstrap";
import RechargeView from "./RechargeView";
import ConnectionView from "./ConnectionView";
import AccountView from "./AccountView";
import UserInfoView from "./UserInfoView";
import { getPlanByCreator } from "../../service/admin";
import { userInfo } from "../../assets/userLoginInfo";
import Session from "./Session";
import Logs from "./Logs";
import Tickets from "./Tickets";
import Inventory from "./Inventory";
import Services from "./Services";
import ProposalSubscriber from "./ProposalSubscriber";

function View({ open, setOpen, planData, setplanData, updateUserCategory, getAllData, otherPermission }) {
  const [allPlans, setAllPlans] = useState([]);
  const toggle = () => {
    setOpen(!open);
    setplanData({});
    setActiveTab("1");
  };

  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  async function getAllPlans() {
    try {
      const res = await getPlanByCreator(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id);
      setAllPlans(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllPlans();
  }, []);
  return (
    <>
      <div className="view_page">
        <Modal scrollable={true} isOpen={open} size="xl">
          <ModalHeader toggle={toggle} className="d flex align-items-center justify-content-between">
            <div className="f-28">Subscriber Details</div>
          </ModalHeader>
          <ModalBody>
            <div>
              <Nav className={`px-3 pt-2 ${style.navStyle}`}>
                <NavItem>
                  <NavLink
                    className={`${activeTab === "1" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "1" ? "active" : ""
                    } pointer`}
                    onClick={() => toggleTab("1")}
                  >
                    Account Info
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${activeTab === "2" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "2" ? "active" : ""
                    } pointer`}
                    onClick={() => toggleTab("2")}
                  >
                    Personal Info
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink
                    className={`${activeTab === "3" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "3" ? "active" : ""
                    } pointer`}
                    onClick={() => toggleTab("3")}
                  >
                    Recharge
                  </NavLink>
                </NavItem> */}
                {/* <NavItem>
                                    <NavLink
                                        className={`${activeTab === '4' ? style.btn_primary_btn : style.btn_secondary} ${activeTab === '4' ? 'active' : ''} pointer`}
                                        onClick={() => toggleTab('4')}
                                    >
                                        Connection Attempt
                                    </NavLink>
                                </NavItem> */}

                <NavItem>
                  <NavLink
                    className={`${activeTab === "3" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "3" ? "active" : ""
                    } pointer`}
                    onClick={() => toggleTab("3")}
                  >
                    Session
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${activeTab === "4" ? style.btn_primary_btn : style.btn_secondary} ${
                      activeTab === "4" ? "active" : ""
                    } pointer`}
                    onClick={() => toggleTab("4")}
                  >
                    Logs
                  </NavLink>
                </NavItem>
                {otherPermission.includes("Help Desk") && (
                  <NavItem>
                    <NavLink
                      className={`${activeTab === "5" ? style.btn_primary_btn : style.btn_secondary} ${
                        activeTab === "5" ? "active" : ""
                      } pointer`}
                      onClick={() => toggleTab("5")}
                    >
                      Tickets
                    </NavLink>
                  </NavItem>
                )}

                {otherPermission.includes("Inventory Management") && (
                  <NavItem>
                    <NavLink
                      className={`${activeTab === "6" ? style.btn_primary_btn : style.btn_secondary} ${
                        activeTab === "6" ? "active" : ""
                      } pointer`}
                      onClick={() => toggleTab("6")}
                    >
                      Inventory
                    </NavLink>
                  </NavItem>
                )}

                {otherPermission.includes("Service Management") && (
                  <NavItem>
                    <NavLink
                      className={`${activeTab === "7" ? style.btn_primary_btn : style.btn_secondary} ${
                        activeTab === "7" ? "active" : ""
                      } pointer`}
                      onClick={() => toggleTab("7")}
                    >
                      Services
                    </NavLink>
                  </NavItem>
                )}

                {otherPermission.includes("Invoices") && (
                  <NavItem>
                    <NavLink
                      className={`${activeTab === "8" ? style.btn_primary_btn : style.btn_secondary} ${
                        activeTab === "8" ? "active" : ""
                      } pointer`}
                      onClick={() => toggleTab("8")}
                    >
                      Send Proposal
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <AccountView
                    planData={planData}
                    setplanData={setplanData}
                    updateUserCategory={updateUserCategory}
                    getAllData={getAllData}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <UserInfoView planData={planData} setplanData={setplanData} />
                    </Col>
                  </Row>
                </TabPane>
                {/* <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <RechargeView planData={planData} allPlans={allPlans} />
                    </Col>
                  </Row>
                </TabPane> */}
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <Session planData={planData} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <Logs planData={planData} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="5">
                  <Row>
                    <Col sm="12">
                      <Tickets planData={planData} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="6">
                  <Row>
                    <Col sm="12">
                      <Inventory planData={planData} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="7">
                  <Row>
                    <Col sm="12">
                      <Services planData={planData} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="8">
                  <Row>
                    <Col sm="12">
                      <ProposalSubscriber
                        planData={planData}
                        inventoryPermission={otherPermission.includes("Inventory Management")}
                        servicesPermission={otherPermission.includes("Service Management")}
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

export default View;
