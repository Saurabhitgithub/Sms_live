import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from "reactstrap";

import AddAccountInfo from "./AddAccountInfo";
import AddUserInfo from "./AddUserInfo";
import Policy from "./Policy";
import Recharge from "./Recharge";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <>
      <div className="userprofile_container  ">
        {/* <div className="flex mt-1 between d-flex align-items-center"> */}
        <div style={{ color: "#0E1073", fontWeight: "600", fontSize: '18px' }} className="d-flex g-1 pointer align-items-center">
          <FaArrowLeft /> Back
        </div>
        <div className="mt-5 flex between">
          <h3>Arav Kapoor</h3>

          <button className="delete_btn">Delete</button>
        </div>


        <div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === '1' ? 'active' : ''}
                onClick={() => toggleTab('1')}
              >

                Account Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '2' ? 'active' : ''}
                onClick={() => toggleTab('2')}
              >
                User Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '3' ? 'active' : ''}
                onClick={() => toggleTab('3')}
              >
                Policy
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '4' ? 'active' : ''}
                onClick={() => toggleTab('4')}
              >
                ONU
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '5' ? 'active' : ''}
                onClick={() => toggleTab('5')}
              >
                Recharge
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '6' ? 'active' : ''}
                onClick={() => toggleTab('6')}
              >
                Connection Attempt
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  {/* some tag */}
                  <AddAccountInfo />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  {/* some tag */}
                  <AddUserInfo />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col sm="12">{/* some tag */}
                  <Policy />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="5">
              <Row>
                <Col sm="12">{/* some tag */}
                  <Recharge />
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
