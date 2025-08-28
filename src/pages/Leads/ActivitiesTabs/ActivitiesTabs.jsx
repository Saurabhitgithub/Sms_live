import React, { useEffect, useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Activities from "./Activities";
import NotesPageData from "./NotesPageData";
import EmailPageData from "./EmailPageData";
import CallsPageData from "./CallsPageData";
import MessagePageData from "./MessagePageData";
import RemindersPageData from "./RemindersPageData";
import DiscussionActivity from "./DiscussionActivity";
import { permisionsTab } from "../../../assets/userLoginInfo";

export default function ActivitiesTabs({ activeTabLogo, getDataById, getdataLeads }) {
  const [activeTab, toggleTab] = useState("0");

  const [tabPermission, setTabPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();
    

    const permissions = res.filter(s => s.tab_name === "Leads");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setTabPermission(permissionArr);
    }
  }
  useEffect(() => {
    permissionFunction();
    toggleTab(activeTabLogo.toString());
  }, [activeTabLogo]);

  return (
    <div>
      <Nav className="mx-md-3 mx-sm-2 mx-1 mt-4 border-bottom">
        <NavItem className="pr-0">
          <NavLink
            className={`text-secondary f-r-16 fw-500 ${
              activeTab == "0" ? "activeTab2" : ""
            } px-md-4 px-sm-3 px-2 pointer`}
            onClick={() => toggleTab("0")}
          >
            Activity
          </NavLink>
        </NavItem>
        <NavItem className="pr-0">
          <NavLink
            className={`text-secondary f-r-16 fw-500 ${
              activeTab == "1" ? "activeTab2" : ""
            } px-md-4 px-sm-3 px-2 pointer`}
            onClick={() => toggleTab("1")}
          >
            Notes
          </NavLink>
        </NavItem>
        <NavItem className="pr-0">
          <NavLink
            className={`text-secondary f-r-16 fw-500 ${
              activeTab == "2" ? "activeTab2" : ""
            } px-md-4 px-sm-3 px-2 pointer`}
            onClick={() => toggleTab("2")}
          >
            Emails
          </NavLink>
        </NavItem>
        <NavItem className="pr-0">
          <NavLink
            className={`text-secondary f-r-16 fw-500 ${
              activeTab == "3" ? "activeTab2" : ""
            } px-md-4 px-sm-3 px-2 pointer`}
            onClick={() => toggleTab("3")}
          >
            Calls
          </NavLink>
        </NavItem>
        <NavItem className="pr-0">
          <NavLink
            className={`text-secondary f-r-16 fw-500 ${
              activeTab == "4" ? "activeTab2" : ""
            } px-md-4 px-sm-3 px-2 pointer`}
            onClick={() => toggleTab("4")}
          >
            Messages
          </NavLink>
        </NavItem>
        <NavItem className="pr-0">
          <NavLink
            className={`text-secondary f-r-16 fw-500 ${
              activeTab == "5" ? "activeTab2" : ""
            } px-md-4 px-sm-3 px-2 pointer`}
            onClick={() => toggleTab("5")}
          >
            Reminders
          </NavLink>
        </NavItem>
        {tabPermission.includes("Lead Comment") && (
          <>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary f-r-16 fw-500 ${
                  activeTab == "6" ? "activeTab2" : ""
                } px-md-4 px-sm-3 px-2 pointer`}
                onClick={() => toggleTab("6")}
              >
                Comment
              </NavLink>
            </NavItem>
          </>
        )}
      </Nav>
      <TabContent className="mx-md-3 mx-sm-2 mx-1 mt-4" activeTab={activeTab}>
        <TabPane tabId="0">
          <Activities getDataById={getDataById} getdataLeads={getdataLeads} />
        </TabPane>
        <TabPane tabId="1">
          <NotesPageData getDataById={getDataById} getdataLeads={getdataLeads} />
        </TabPane>
        <TabPane tabId="2">
          <EmailPageData getDataById={getDataById} getdataLeads={getdataLeads} />
        </TabPane>
        <TabPane tabId="3">
          <CallsPageData getDataById={getDataById} getdataLeads={getdataLeads} />
        </TabPane>
        <TabPane tabId="4">
          <MessagePageData getDataById={getDataById} getdataLeads={getdataLeads} />
        </TabPane>
        <TabPane tabId="5">
          <RemindersPageData getDataById={getDataById} getdataLeads={getdataLeads} />
        </TabPane>
        <TabPane tabId="6">
          <DiscussionActivity getDataById={getDataById} getdataLeads={getdataLeads} />
        </TabPane>
      </TabContent>
    </div>
  );
}
