import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import PersonalDetails from "./PersonalDetails";
import AddressDetails from "./AddressDetails";
import PlanDetails from "./PlanDetails";
import DocumentsDetails from "./DocumentsDetails";
import SourceDetails from "./SourceDetails";

export default function AddNewLead({ open, setOpen, allLeadsData }) {
  const [activeTab, toggleTab] = useState("1");
  const [AddressFile, setAddressFile] = useState({});

  function toggle() {
    setOpen(!open);
    setFormData({});
    toggleTab("1");
  }
  const [formData, setFormData] = useState({
    creator_id: "",
    full_name: "",
    mobile_number: null,
    account_type: "",
    generateInvoice: false,
    connection_status: "",
    userName: "",
    password: "",
    deleted_file: [],
    nas: "",
    billing_type:'',
    ipAddress: "",
    alter_mobile_number: null,
    email: "",
    gst_no: "",
    billing_address: {
      address_line1: "",
      address_line2: "",
      state: "",
      city: "",
      pin_code: "",
      flat_number: "",
    },
    installation_address: {
      address_line1: "",
      address_line2: "",
      state: "",
      city: "",
      pin_code: "",
      flat_number: "",
    },
    identity_verify: {
      id_proof: "",
      id_proof_no: "",
      attachment: {
        file_name: "",
        file_url: "",
      },
    },
    address_verify: {
      address_proof: "",
      address_proof_no: "",
      attachment: {
        file_name: "",
        file_url: "",
      },
    },
  });
  const [checkbox2, setCheckbox2] = useState(false);

  function handleInput(e) {
    const { name, value } = e;
    setFormData({ ...formData, [name]: value });
  }
  function handleObjectInput(e, key) {
    const { name, value } = e;
    // 
    

    if (key === "identity_verify" && formData?.sameAsDocument) {
      
      setFormData((pre) => ({
        ...pre,
        address_verify: {
          address_proof: "",
          address_proof_no: "",
          attachment: {
            file_name: "",
            file_url: "",
          },
        },
        sameAsDocument:false,
        identity_verify: { ...pre[key], [name]: value }
      }));
      setCheckbox2(false)
      setAddressFile({});
    } else if (key === "address_verify" && formData?.sameAsDocument) {
      
      
      setFormData((pre) => ({
        ...pre,
        sameAsDocument:false,
        address_verify: { ...pre[key], [name]: value }
      }));
      setCheckbox2(false)

    } else {
      setFormData((pre) => ({ ...pre, [key]: { ...pre[key], [name]: value } }));
    }
  }
  const handleState = (state, key) => {
    if (key === "billing_address" && formData?.sameAs){
      setFormData({ ...formData, [key]: { ...formData[key], state: state, city: "" },sameAs:false });

    }else{

      setFormData({ ...formData, [key]: { ...formData[key], state: state, city: "" } });
    }
    
  };
  return (
    <>
      <Modal centered scrollable isOpen={open} size="xl">
        <ModalHeader toggle={toggle}>
          <div className="f-24">Create New Lead</div>
        </ModalHeader>
        <ModalBody>
          <Nav className="mx-md-3 mx-sm-2 mx-1 mt-4 border-bottom">
            {/* <NavItem className="pr-0">
                            <NavLink
                                className={`text-secondary f-r-16 fw-500 ${activeTab == '0' ? 'activeTab2' : ''} px-md-4 px-sm-3 px-2 pointer`}
                                onClick={() => toggleTab("0")}
                            >
                                Source
                            </NavLink>
                        </NavItem> */}
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary f-r-16 fw-500 ${
                  activeTab == "1" ? "activeTab2" : ""
                } px-md-4 px-sm-3 px-2 pointer`}
                // onClick={() => toggleTab("1")}
              >
                Personal
              </NavLink>
            </NavItem>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary f-r-16 fw-500 ${
                  activeTab == "2" ? "activeTab2" : ""
                } px-md-4 px-sm-3 px-2 pointer`}
                // onClick={() => toggleTab("2")}
              >
                Address
              </NavLink>
            </NavItem>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary f-r-16 fw-500 ${
                  activeTab == "3" ? "activeTab2" : ""
                } px-md-4 px-sm-3 px-2 pointer`}
                // onClick={() => toggleTab("3")}
              >
                Plan
              </NavLink>
            </NavItem>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary f-r-16 fw-500 ${
                  activeTab == "4" ? "activeTab2" : ""
                } px-md-4 px-sm-3 px-2 pointer`}
                // onClick={() => toggleTab("4")}
              >
                Documents
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="mx-md-3 mx-sm-2 mx-1 mt-4" activeTab={activeTab}>
            {/* <TabPane tabId="0">
                            <SourceDetails />
                        </TabPane> */}
            <TabPane tabId="1">
              <PersonalDetails toggleTab={toggleTab} handleInput={handleInput} formData={formData} />
            </TabPane>
            <TabPane tabId="2">
              <AddressDetails
                toggleTab={toggleTab}
                handleInput={handleInput}
                handleObjectInput={handleObjectInput}
                formData={formData}
                setFormData={setFormData}
                handleState={handleState}
              />
            </TabPane>
            <TabPane tabId="3">
              <PlanDetails
                toggleTab={toggleTab}
                handleInput={handleInput}
                handleObjectInput={handleObjectInput}
                formData={formData}
                setFormData={setFormData}
              />
            </TabPane>
            <TabPane tabId="4">
              <DocumentsDetails
                setOpen={setOpen}
                open={open}
                toggleTab={toggleTab}
                handleInput={handleInput}
                handleObjectInput={handleObjectInput}
                formData={formData}
                setFormData={setFormData}
                allLeadsData={allLeadsData}
                setAddressFile={setAddressFile}
                AddressFile={AddressFile}
                checkbox2={checkbox2}
                setCheckbox2={setCheckbox2}
              />
       
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>
    </>
  );
}
