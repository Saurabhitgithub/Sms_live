import React, { useEffect, useRef, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, TabContent, Table, TabPane } from "reactstrap";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import SearchableDropdown from "../../../AppComponents/SearchableDropdown/SearchableDropdown";
import { FaArrowRight } from "react-icons/fa";
import CustomDropdown from "../../../AppComponents/CustomDropdown/CustomDropdown";
import { createTicket, getAllIssueType, getAllSubscriber ,getTicketDataSubscriberId,updateTicket} from "../../../service/admin";
import { error, success } from "../../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { userInfo } from "../../../assets/userLoginInfo";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import moment from "moment";
import { PaginationComponent } from "../../../components/Component";
import Loader from "../../../components/commonComponent/loader/Loader";
import ExportCsv from "../../../components/commonComponent/ExportButton/ExportCsv";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../../assets/images/jsTree/PdfLogo.png"

export default function TicketsOther({planData}) {
  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);


  let OptionLabel = [
    { value: "low", label: "Low", color: "#0046B0" },
    { value: "medium", label: "Medium", color: "#50AD97" },
    { value: "high", label: "High", color: "#50AD97" },
    { value: "urgent", label: "Urgent", color: "#AD5088" }
  ];
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [next, setNext] = useState(1);
  const [formData, setFormData] = useState({
    ticket_id: "",
    // already_subscriber: true,
    subscriber_id: planData._id,
    status: "new",
    priority: "high",
    issue_type: "payment",
    desc: "",
    title: "",
    // name: "",
    // email: "",
    // mobile_number: "",
  });
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  const [getAllIssues, setGetAllIssues] = useState([])
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  let [page, setPage] = useState(1);
  let itemPerPage = 8;

  function toggle() {
    setOpen(!open);
  }
  let userId = userInfo()._id
  const [activeTab, toggleTab] = useState('0')
  const [subscriberData, setSubscriberData] = useState({})
  const [backBtnState, setBackBtnState] = useState('0')
  const [option, setOption] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  function toggle() {
      setOpen(!open)
      toggleTab('0')
      setSubscriberData({})
      setFormData({
          already_subscriber: true,
          subscriber_id: planData._id,
          status: 'new',
          priority: 'high',
          issue_type: 'payment',
          desc: '',
          title: '',
          name: planData?.full_name,
          email: planData?.email,
          mobile_number: '',
      })
  }

  async function getSubscriberData() {
    setLoader(true)
    try {
        let response = await getAllSubscriber("664645a80522c3d5bc318cd2");
        let data = response?.data?.data?.map((res,index) => { return { ...res, label: res?.full_name, value: `${res?.full_name}${res?.mobile_number}` } })
      
        setOption(data)
    } catch (err) {
        console.log(err)
    } finally {
        setLoader(false)
    }
}

useEffect(() => {
  if (open) {
      getSubscriberData()
  } else {
      toggleTab('0')
      setSubscriberData({})
      setFormData({
          already_subscriber: true,
          subscriber_id: planData._id,
          status: 'new',
          priority: 'high',
          issue_type: 'payment',
          desc: '',
          title: '',
          name: planData?.full_name,
          email: planData?.email	,
          mobile_number: '',
      })
  }
}, [open])

function addSubscriberData(e) {
  let obj = e[0]
  setSubscriberData(obj)
  setFormData(pre => {
      return {
          ...pre,
          name: planData?.full_name,
          email: planData?.email,
          mobile_number: obj?.mobile_number,
          subscriber_id: planData?._id
      }
  })
}

  function handleChange(e) {
    let { name, value } = e.target;

    if (value == " ") {
      e.target.value = "";
    } else {
      if (name == "already_subscriber") {
        setFormData((pre) => {
          return {
            ...pre,
            [name]: JSON.parse(value),
          };
        });
        setFormData((pre) => {
          return {
            ...pre,
            name: planData?.full_name,
            email: planData?.email,
            mobile_number: "",
            subscriber_id: planData._id,
          };
        });
      } else {
        setFormData((pre) => {
          return {
            ...pre,
            [name]: value,
          };
        });
      }
    }
  }
  

  async function submitData(e) {
    e.preventDefault();
    setLoader(true);
    try {
      let payload = {};
      if (formData.already_subscriber) {
        payload = {
          ...formData,
          created_by: userId,
          issue_from_website: false,
          user_role: userInfo().role,
          user_name: userInfo().name,
        };
      } else {
        payload = {
          ...formData,
          created_by: userId,
          issue_from_website: false,
          user_role: userInfo().role,
          user_name: userInfo().name,
        };
        delete payload.subscriber_id;
      }
      await createTicket(payload);
      dispatch(
        success({
          show: true,
          msg: "New ticket added successfully",
          severity: "success",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        error({
          show: true,
          msg: "There are some error occupied",
          severity: "error",
        })
      );
    } finally {
      setLoader(false);
      setOpen(false);
      await getTicketDataByid()
      // await getAllTicketsData();
    }
  }


  function generateTicketId() {
    const year = new Date().getFullYear();
    const staticPart = "CS";
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const milliseconds = new Date().getMilliseconds();
    return `${year}-${staticPart}${randomNumber}${milliseconds}`;
  }


  useEffect(() => {
    setFormData((pre) => {
      return {
        ...pre,
        ticket_id: generateTicketId(),
      };
    });
  }, [open]);


  const getTicketDataByid = async()=>{
    setLoader(true)
    try{
      let res =await getTicketDataSubscriberId(planData?._id)
      let dataReverse = res?.data?.data.reverse()
    
      setTableData(dataReverse)
      let exportInfo = dataReverse.map((e)=>{
        return {
          "Ticket Id No":e?.ticket_id,
          "Status":e?.status,
          "Issue Type":e?.issue_type,
          "Name":e?.name,
          "Description":e?.desc,
          "Assigned To":e?.assignee_name?e?.assignee_name:"---",
          "Priority":e?.priority,
          "Created At":e?.createdAt
        }
      })
      setExportData(exportInfo)
      setLoader(false)
    }catch(err){
      console.log(err)
      setLoader(false)
    }
    
  }

const updatePriority =async(id,priority)=>{
  setLoader(true)
  let payload = {
    priority: priority,
    id: id,
    user_role: userInfo().role,
    user_name: userInfo().name,
    user_id: userId,
  };
  try{
    let res = await updateTicket(payload)
    setLoader(false)

  }catch(err){
    console.log(err)
  }finally{
    await getTicketDataByid()
    setLoader(false)
  }
}
  const getAllDataIssue = async()=>{
    await getAllIssueType().then((res)=>{
        
        let dataReverse = [...res.data.data];
    let reverData = dataReverse.reverse();
        setGetAllIssues(reverData)
    
    }).catch((err)=>{
        console.log(err)
    })
}
useEffect(()=>{
    getAllDataIssue()
    getTicketDataByid()
},[])

const inVoiceRef1 = useRef(null);

async function convertToImg() {
  // setLoader(true);
  let arr = [inVoiceRef1.current];
  let photoArr = [];
  const pdf = new jsPDF();
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let index = 0; index < arr.length; index++) {
    const res = arr[index];
    await htmlToImage
      .toPng(res, { quality: 0.5 }) // Reduced quality to 0.5
      .then(function(dataUrl) {
        photoArr.push(dataUrl);
        const imgProps = pdf.getImageProperties(dataUrl);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Scale image to fit within PDF dimensions
        const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
        const scaledWidth = imgProps.width * scaleFactor;
        const scaledHeight = imgProps.height * scaleFactor;

        pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST"); // Added compression option
        if (index !== arr.length - 1) {
          pdf.addPage();
        }
      })
      .catch(function(error) {
        console.error("oops, something went wrong!", error);
      })
      .finally(() => {
        if (index === arr.length - 1) {
          // setLoader(false);
        }
      });
  }

  pdf.save("Tickets Of Subscriber.pdf");
}
let styleSheet = {
  maincontainer: {
    width: "100%",
    height: "auto",
    position: "relative",
    padding: "25px",
    // background: "linear-gradient(251.07deg, #FFFFFF 35.06%, #E8F9FA 95.96%)",
    // margin:'0 auto'
    background: "white"
  }
};
  return (
    <>
    <div style={{ width: "1800px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Subscriber Tickets</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Ticket Id No.</th>
                  <th>Status</th>
                  <th>Issue Type</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((res, index) => {
                  return (
                    <tr key={index}>
                      <td>{res?.ticket_id	}</td>
                      <td>{res?.status}</td>
                      <td>{res?.issue_type}</td>
                      <td>{res?.name}</td>
                      <td>{res?.desc	}</td>
                      <td>{res?.assignee_name?res?.assignee_name:"---"}</td>
                      <td>
                        <div className="style_change_select w-75">
                          <SingleSelect options={OptionLabel} placeItem="Priority"   value={res?.priority}
                                onChange={(e) => updatePriority(res?._id, e.target.value, index)} />
                        </div>
                      </td>
                      <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </div>
          </div>
        </div>
    {loader ? <Loader /> : ""}
      <Modal centered scrollable size="xl" isOpen={open}>
        <ModalHeader toggle={toggle}>
          <div className="f-24">Raise Ticket</div>
        </ModalHeader>
        <ModalBody>
          
           <div className='f-28 fw-600'>Ticket# {formData?.ticket_id}</div>
           <TabContent className='mt-2' activeTab={activeTab}>
                        <TabPane tabId="0">
                            <Step1
                                toggleTab={toggleTab}
                                toggle={toggle}
                                formData={formData}
                                handleChange={handleChange}
                                option={option}
                                addSubscriberData={addSubscriberData}
                                setSubscriberData={setSubscriberData}
                                subscriberData={subscriberData}
                                setBackBtnState={setBackBtnState}
                                planData={planData}
                            />
                        </TabPane>
                        <TabPane tabId="1">
                            <Step2
                                toggleTab={toggleTab}
                                formData={formData}
                                handleChange={handleChange}
                                subscriberData={subscriberData}
                                setBackBtnState={setBackBtnState}
                                planData={planData}
                            />
                        </TabPane>
                        <TabPane tabId="2">
                            <Step3
                                toggleTab={toggleTab}
                                formData={formData}
                                handleChange={handleChange}
                                backBtnState={backBtnState}
                                setFormData={setFormData}
                                submitData={submitData}
                                loader={loader}
                                setLoader={setLoader}
                                planData={planData}
                            />
                        </TabPane>
                    </TabContent>
        </ModalBody>
      </Modal>
      <div className="mt-md-5 mt-sm-4 mt-3">
        <div className="d-flex justify-content-between">
          <div className="fs-24 fw-500">Tickets</div>
          <div className="d-flex align-items-center">
          {/* <ExportCsv exportData={exportData} filName={"Subscriber Tickets Data"}/> */}
          <div className="dropdown_logs ">

          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportData} filName={"Subscriber Tickets Data"} />
                        </DropdownItem>
                        <DropdownItem>
                          {" "}
                          <div onClick={convertToImg}>PDF</div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
          <div className="line ml-2 mr-2"></div>

          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Raise Ticket
            </button>
          </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="table-container mt-5">
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Ticket Id No.</th>
                  <th>Status</th>
                  <th>Issue Type</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((res, index) => {
                  return (
                    <tr key={index}>
                      <td>{res?.ticket_id	}</td>
                      <td>{res?.status}</td>
                      <td>{res?.issue_type}</td>
                      <td>{res?.name}</td>
                      <td>{res?.desc	}</td>
                      <td>{res?.assignee_name?res?.assignee_name:"---"}</td>
                      <td>
                        <div className="style_change_select w-75">
                          <SingleSelect options={OptionLabel} placeItem="Priority"   value={res?.priority}
                                onChange={(e) => updatePriority(res?._id, e.target.value, index)} />
                        </div>
                      </td>
                      <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div class="d-flex justify-content-center mt-1">
                  <PaginationComponent
                    currentPage={page}
                    itemPerPage={itemPerPage}
                    paginate={(d) => {
                      setPage(d);
                    }}
                    totalItems={tableData.length}
                  />
                </div>
        </div>
      </div>
    </>
  );
}
