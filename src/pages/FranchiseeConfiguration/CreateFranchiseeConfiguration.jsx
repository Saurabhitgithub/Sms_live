import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import AddDetails from "./AddDetails";
import AddConfiguration from "./AddConfiguration";
import InvoiceConfiguration from "./InvoiceConfiguration";
import { franchiseeConfigurationAdd, getAllIssueType } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import { userId, userInfo } from "../../assets/userLoginInfo";
import { error, success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
export default function CreateFranchiseeConfiguration({ open, setOpen, mode, editData, GetAllDataFunction, allPlanData}) {
  const [activeTab, toggleTab] = useState("0");
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  let emptyData = {
    name: "",
    lcoName: "",
    email: "",
    mobileNumber: "",
    revenueShare: "",
    // plans: ["string"],
    allowLimitAddition: true,
    taxPercentage: "",
    tdsPercentage: "",
    minLimitAmount: "",
    maxCreditLimit: "",
    creator_id: "",
    commercialAddress: {
      address_line: "",
      state: "",
      city: "",
      pinCode: "",
    },
    billingAddress: {
      address_line: "",
      state: "",
      city: "",
      pinCode: "",
    },
    paymentType: [],
    org_id: userId(),
    assignsPlan:[]
  };
  const [formData, setFormData] = useState(mode === "edit" ? editData : emptyData);

  const handleInput = (event, key) => {
    const { name, value } = event;
    switch (key) {
      case "commercialAddress":
        setFormData((prev) => ({
          ...prev,
          commercialAddress: { ...prev.commercialAddress, [name]: value },
        }));
        break;
      case "billingAddress":
        setFormData((prev) => ({
          ...prev,
          billingAddress: { ...prev.billingAddress, [name]: value },
        }));
        break;
      default:
        setFormData({ ...formData, [name]: value });
    }
  };
  const handlePaymentType = (value, check) => {
    
    if (check) {
      let paymentType = [...formData.paymentType, value];
      setFormData((pre) => ({ ...pre, paymentType: paymentType }));
    } else {
      let paymentType = formData.paymentType.filter((e) => e !== value);
      setFormData((pre) => ({ ...pre, paymentType: paymentType }));
    }
  };
  const configurationAddFunction = async () => {
    setLoader(true);
    try {
      let payloadData = { ...formData, user_role: userInfo().role, user_name: userInfo().name, user_id: userId() };

      await franchiseeConfigurationAdd(payloadData)
        .then(() => {
          setFormData({});
          toggleTab("0");
          setLoader(false);
          setOpen({ mode: "", status: false, data: {} });
          GetAllDataFunction();
          if(mode === "edit" ){
            dispatch(
              success({
                show: true,
                msg: "Franchisee Updated successfully",
                severity: "success"
              })
            );
          }else{
            dispatch(
              success({
                show: true,
                msg: "Franchisee Created successfully",
                severity: "success"
              })
            );
          }
          
        })
        .catch((err) => {
          console.log(err.response.data.errormessage.includes("email_1 dup key"));
          // if (err?.response?.data?.errormessage?.includes("email_1 dup key")) {
          //   dispatch(
          //     error({
          //       show: true,
          //       msg: "This email alreday exist",
          //       severity: "error",
          //     })
          //   );
          //   toggleTab("0");
          // }
          // if (err?.response?.data?.errormessage?.includes("mobileNumber_1 dup key")) {
          //   dispatch(
          //     error({
          //       show: true,
          //       msg: "This Mobile Number alreday exist",
          //       severity: "error",
          //     })
          //   );
          //   toggleTab("0");
          // }
          setLoader(false);
        });
    } catch (err) {}
  };
  useEffect(() => {
    setFormData(mode === "edit" ? editData : emptyData);
    
  }, [open]);
  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal scrollable={true} isOpen={open} size="xl">
        <ModalHeader
          toggle={() => setOpen({ mode: "", status: false, data: {} })}
          className="d flex align-items-center justify-content-between"
        >
          <div className="flex">
            <span className="f-28">{mode === "edit" ? "Edit" : "Create New"} Franchisee</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <Nav className="mx-md-3 mx-sm-2 mx-1 mt-4 border-bottom">
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary f-r-16 fw-500 ${
                  activeTab == "0" ? "activeTab2" : ""
                } px-md-4 px-sm-3 px-2 pointer`}
                // onClick={() => toggleTab("0")}
              >
                Details
              </NavLink>
            </NavItem>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary f-r-16 fw-500 ${
                  activeTab == "1" ? "activeTab2" : ""
                } px-md-4 px-sm-3 px-2 pointer`}
                // onClick={() => toggleTab("1")}
              >
                Configuration
              </NavLink>
            </NavItem>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary f-r-16 fw-500 ${
                  activeTab == "2" ? "activeTab2" : ""
                } px-md-4 px-sm-3 px-2 pointer`}
                // onClick={() => toggleTab("2")}
              >
                Invoice
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="mx-md-3 mx-sm-2 mx-1 mt-4" activeTab={activeTab}>
            <TabPane tabId="0">
              <AddDetails
                toggleTab={toggleTab}
                open={open}
                setOpen={setOpen}
                mode={mode}
                handleInput={handleInput}
                formData={formData}
                setFormData={setFormData}
              />
            </TabPane>
            <TabPane tabId="1">
              <AddConfiguration
                toggleTab={toggleTab}
                open={open}
                setOpen={setOpen}
                mode={mode}
                handleInput={handleInput}
                formData={formData}
                setFormData={setFormData}
                handlePaymentType={handlePaymentType}
                allPlanData={allPlanData}
              />
            </TabPane>
            <TabPane tabId="2">
              <InvoiceConfiguration
                toggleTab={toggleTab}
                open={open}
                setOpen={setOpen}
                mode={mode}
                formData={formData}
                setFormData={setFormData}
                configurationAddFunction={configurationAddFunction}
                allPlanData={allPlanData}
              />
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>
    </>
  );
}
