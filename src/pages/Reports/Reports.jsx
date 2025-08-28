import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import UserManagementReports from "./UserManagementReports";
import InvoiceManagementReport from "./InvoiceManagementReport";
import SubscriberManagementReport from "./SubscriberManagementReport";
import HelpDeskReport from "./HelpDeskReport";
import LeadsReport from "./LeadsReport";
import { permisionsTab } from "../../assets/userLoginInfo";
import Error403 from "../../components/error/error403";

export default function Reports() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [action, setAction] = useState(true);
  const [icon, setIcon] = useState(true);
  const [selectedOption, setSelectedOption] = useState("User Management");
  const toggleDropdown = () => {
    setIcon((prevState) => !prevState);
    setDropdownOpen((prevState) => !prevState);
  };

  const handleSelect = (option) => {
    // 
    setSelectedOption(option);
    // setAction(option === 'Event Logs' ? true : false)
  };

    const [leadPermission, setLeadPermission] = useState([]);
      const [permissionAccess, setPermissionAccess] = useState(true);
    
      async function permissionFunction() {
        const res = await permisionsTab();
    
       
        const permissions = res.filter(s => s.tab_name === "Reports");
        if (permissions.length !== 0) {
          setPermissionAccess(permissions[0]?.is_show);
          let permissionArr = permissions[0]?.tab_function
            ?.filter(s => s.is_showFunction === true)
            .map(e => e.tab_functionName);
          setLeadPermission(permissionArr);
        }
      }
  useEffect(() => {
    permissionFunction()
  },[]);
  return (
    <Content>
      {permissionAccess && leadPermission ? (
        <>
           <div className="card_container p-4 user_section">
        <div className="d-flex flex-column ">
          <div className="f-28">Reports</div>
          <div className="d-flex align-items-center">
            <div className="dropdown_logs mt-4">
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret className="btn btn-primary" type="button">
                  {selectedOption || "User Management"}{" "}
                  <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleSelect("User Management")}>User Management</DropdownItem>
                  <DropdownItem onClick={() => handleSelect("Subscriber Management")}>
                    Subscriber Management
                  </DropdownItem>
                  <DropdownItem onClick={() => handleSelect("Invoice Management")}>Invoice Management</DropdownItem>
                  <DropdownItem onClick={() => handleSelect("Helpdesk Management")}>Help Desk Management</DropdownItem>
                  <DropdownItem onClick={() => handleSelect("Leads Management")}>Leads Management</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="content__reports_div m-top-40">
          {selectedOption === "User Management" && <UserManagementReports management={selectedOption} />}
          {selectedOption === "Subscriber Management" && <SubscriberManagementReport management={selectedOption} />}
          {selectedOption === "Invoice Management" && <InvoiceManagementReport management={selectedOption} />}
          {selectedOption === "Helpdesk Management" && <HelpDeskReport management={selectedOption}/>}
          {selectedOption === "Leads Management" && <LeadsReport management={selectedOption}/>}
        </div>
      </div>
        </>
      ):(
        <>
          <Error403 />
        </>
      )}
     
    </Content>
  );
}
