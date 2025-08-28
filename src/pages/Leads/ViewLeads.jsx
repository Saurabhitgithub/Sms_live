import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { IoArrowBack } from "react-icons/io5";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import mobileLog from "../../assets/images/jsTree/mobileSvg.svg";
import messageLog from "../../assets/images/jsTree/messageSvg.svg";
import noteLogo from "../../assets/images/jsTree/notepadSvg.svg";
import calender from "../../assets/images/jsTree/calender.svg";
import DetailsTabs from "./DetailsTabs/DetailsTabs";
import ActivitiesTabs from "./ActivitiesTabs/ActivitiesTabs";
import LeadConvertModal from "./LeadConvertModal";
import { getLeadsByIdData, updateLeadStatusData } from "../../service/admin";
import { userId, userInfo } from "../../assets/userLoginInfo";
import Loader from "../../components/commonComponent/loader/Loader";
import moment from "moment";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import ProposalTab from "./Proposal/ProposalTab";

export default function ViewLeads() {
  const history = useHistory();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [icon, setIcon] = useState(true);
  const [activeTab, toggleTab] = useState("0");
  const [activeTabLogo, setActTabLogo] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const statusArr = [
    { value: "prospect", label: "Prospect", color: "#0046B0" },
    { value: "contacted", label: "Contacted", color: "#50AD97" },
    { value: "not contacted", label: "Not Contacted", color: "#50AD97" },
    { value: "schedule", label: "Installation: Scheduled", color: "#AD5088" },
    { value: "re-schedule", label: "Installation: Re-Scheduled", color: "#3570A6" },
    { value: "compatible", label: "Feasibility Check: Compatible", color: "#1CA098" },
    { value: "not compatible", label: "Feasibility Check: Not Compatible", color: "#F88E12" },
    { value: "lost", label: "Lost", color: "#F06565" },
  ];
  const [getDataById, setGetDataById] = useState({});
  const [loader, setLoader] = useState(false);

  const paramsData = useParams();

  function undoData(data) {
    
    setGetDataById(data)
  }

  // 

  const getdataLeads = async () => {
    setLoader(true);
    const payloadData = {
      id: paramsData.id,
      role: userInfo().role,
    };
    await getLeadsByIdData(payloadData)
      .then((res) => {
        
        let dataReverse = res.data.data;
        dataReverse.notes = dataReverse?.notes?.reverse();
        dataReverse.activity_logs = dataReverse?.activity_logs?.reverse();
        dataReverse.reminder = dataReverse.reminder?.reverse();
        dataReverse.call_log = dataReverse.call_log?.reverse();
        dataReverse.email_log = dataReverse.email_log?.reverse();
        setStatus(res?.data?.data?.lead_status);

        setLoader(false);
        setGetDataById(dataReverse);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    getdataLeads();
  }, []);

  async function getIndividualLeadData() {
    try {
    } catch (err) { }
  }

  useEffect(() => {
    getIndividualLeadData();
  }, []);

  const toggleDropdown = () => {
    setIcon((prevState) => !prevState);
    setDropdownOpen((prevState) => !prevState);
  };

  function convertToSubscriber() {
    setOpenModal(true);
  }
  const updateLeadsData = async (status) => {
    setLoader(true);
    setStatus(status);
    let updatPayload = {
      user_name: userInfo().name,
      user_role: userInfo().role,
      user_id: userId(),
      status: status,
    };

    await updateLeadStatusData(paramsData?.id, updatPayload)
      .then(async (res) => {
        // 
        setLoader(false);
        // await allLeadsData();
        await getdataLeads();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  return (
    <Content>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <LeadConvertModal open={openModal} setOpen={setOpenModal} getDataOfLeads={getdataLeads} />
      <div className="card_container p-md-4 p-sm-3 p-3 user_section">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2 align-items-center  text-dark">
            <button className="btn p-0 text-primary fw-600 f-18" onClick={() => history.push("/leads")}>
              <IoArrowBack className="f-20" /> Back
            </button>
          </div>
          <div className="d-flex f-18">
            <span>Created At:</span>
            <span className="ml-2 text-black">{moment(getDataById?.createdAt).format("DD-MM-YYYY")}</span>
          </div>
        </div>

        <div className="d-flex flex-md-row flex-sm-row flex-column justify-content-between align-items-md-center align-items-sm-center align-items-left mt-md-5 mt-sm-4 mt-3">
          <div className="f-30 fw-600 text-black order-md-first order-sm-first order-last w-50 text-capitalize text-nowrap">
            {getDataById?.full_name}
          </div>
          <div className=" w-100 d-flex justify-content-end order-md-last order-sm-last order-first">
            {getDataById?.lead_status === "converted" ? (
              <div className="fw-600 fs-24">Converted</div>
            ) : (
              <div className="dropdown_logs ">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                    {status || "Status"}{" "}
                    <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                  </DropdownToggle>
                  <DropdownMenu>
                    {statusArr.map((res, index) => (
                      <DropdownItem key={index} value={res?.value} onClick={() => updateLeadsData(res.value)} className="text-capitalize">
                        {res.label}
                      </DropdownItem>
                    ))}
                    <DropdownItem divider />
                    {getDataById?.planInfo !== undefined ? (
                      <DropdownItem className="text-primary" onClick={convertToSubscriber}>
                        Convert to Subscriber
                      </DropdownItem>
                    ) : (
                      ""
                    )}
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-md-row flex-sm-row flex-column text-secondary f-18">
          <div className="border-right mr-3 pr-3">{getDataById?.email}</div>
          <div className="d-flex">
            <span>Phone Number:</span>

            <span className="ml-2">{getDataById?.mobile_number}</span>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-sm-row flex-column mt-2">
          <div className="mt-2 d-flex align-items-center f-18 border-right mr-3 pr-3">
            <div className="Text_color_style fw-600">Source:</div>
            <div className="ml-2">{getDataById?.connectionStatus ? getDataById?.connectionStatus : "---"}</div>
          </div>
          <div className="mt-2 d-flex align-items-center f-18">
            <div className="Text_color_style fw-600">Account Type:</div>
            <div className="ml-2">{getDataById?.account_type}</div>
          </div>
        </div>
        <div className="mt-2 d-flex align-items-center f-18">
          <div className="Text_color_style fw-600">Assigned To:</div>
          <div className="ml-2">{getDataById?.assignee_name ? getDataById?.assignee_name : "---"}</div>
        </div>
        <div className="mt-4 d-flex">
          <div
            className="d-flex flex-column pointer"
            onClick={() => {
              setActTabLogo(1);
              toggleTab("1");
            }}
          >
            <img src={noteLogo} alt="" className={`topIcon`} />
            <div className="mt-2 text-center text-secondary f-14 fw-500 ">Notes</div>
          </div>
          <div
            className="d-flex flex-column pointer ml-md-5 ml-sm-4 ml-3"
            onClick={() => {
              setActTabLogo(2);
              toggleTab("1");
            }}
          >
            <img src={messageLog} alt="" className={`topIcon`} />
            <div className="mt-2 text-center text-secondary f-14 fw-500">Email</div>
          </div>
          <div
            className="d-flex flex-column pointer ml-md-5 ml-sm-4 ml-3"
            onClick={() => {
              setActTabLogo(3);
              toggleTab("1");
            }}
          >
            <img src={mobileLog} alt="" className={`topIcon`} />
            <div className="mt-2 text-center text-secondary f-14 fw-500">Call</div>
          </div>
          <div
            className="d-flex flex-column pointer ml-md-5 ml-sm-4 ml-3"
            onClick={() => {
              setActTabLogo(5);
              toggleTab("1");
            }}
          >
            <img src={calender} alt="" className={`topIcon`} />
            <div className="mt-2 text-center text-secondary f-14 fw-500">Reminder</div>
          </div>
        </div>

        <div className="mt-5">
          <Nav tabs>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary fw-bold ${activeTab == "0" ? "activeTab1" : ""} px-4  f-18 py-2 pointer`}
                onClick={() => toggleTab("0")}
              >
                Details
              </NavLink>
            </NavItem>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary fw-bold ${activeTab == "1" ? "activeTab1" : ""} px-4  f-18 py-2 pointer`}
                onClick={() => toggleTab("1")}
              >
                Activities
              </NavLink>
            </NavItem>
            <NavItem className="pr-0">
              <NavLink
                className={`text-secondary fw-bold ${activeTab == "2" ? "activeTab1" : ""} px-4 f-18 py-2 pointer`}
                onClick={() => toggleTab("2")}
              >
                Proposal
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="px-md-4 px-sm-2 px-1" activeTab={activeTab}>
            <TabPane tabId="0">
              <DetailsTabs getDataById={getDataById} getdataLeads={getdataLeads} undoData={undoData} />
            </TabPane>
            <TabPane tabId="1">
              <ActivitiesTabs activeTabLogo={activeTabLogo} getDataById={getDataById} getdataLeads={getdataLeads} />
            </TabPane>
            <TabPane tabId="2">
              <ProposalTab getDataById={getDataById} />
            </TabPane>
          </TabContent>
        </div>
      </div>
    </Content>
  );
}
