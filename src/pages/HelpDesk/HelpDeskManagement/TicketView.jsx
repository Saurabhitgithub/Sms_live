import React, { useEffect, useState } from 'react'
import Content from '../../../layout/content/Content'
import { IoArrowBack } from "react-icons/io5";
import { FaTag } from "react-icons/fa6";
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { DropdownItem } from 'reactstrap';
import CustomDropdown from '../../../AppComponents/CustomDropdown/CustomDropdown';
import { getTicketDataById, sendMail, updateTicket,getAllIssueType } from '../../../service/admin';
import moment from 'moment';
import Loader from '../../../components/commonComponent/loader/Loader';
import { userId, userInfo } from '../../../assets/userLoginInfo';
import { useDispatch } from "react-redux";
import { error, success } from '../../../Store/Slices/SnackbarSlice';


export default function TicketView() {
    const history = useHistory()
    const { id } = useParams()
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(true)
    const [ticketData, setTicketData] = useState({})
    const [status, setStatus] = useState('')
    const [issue, setIssue] = useState('')
    const [priority, setPriority] = useState('')
    const [content,setContent] = useState('')
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const [dropdownOpen3, setDropdownOpen3] = useState(false);
    const [getAllIssues, setGetAllIssues] = useState([])

    async function getTicketData() {
        try {
            let res = await getTicketDataById(id)
            let [data] = res?.data?.data
            
            setTicketData(data)
            setStatus(data?.status)
            setIssue(data?.issue_type)
            setPriority(data?.priority)
        } catch (err) {
            console.log(err)
        } finally {
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

    useEffect(() => {
        getTicketData()
        getAllDataIssue()
    }, [])



    async function updateData(e) {
        e.preventDefault()
        setLoader(true)

        let payload = {
            priority: priority,
            status:status,
            priority:priority,
            issue_type:issue,
            id: id,
            user_role: userInfo().role,
                    user_name: userInfo().name,
                    user_id:userId()
        }
        let mail = {
            content: content,
            senderName: userInfo()?.name,
            receiverName: ticketData?.name,
            receiverEmail: ticketData?.email,
            id:id,
          }
        try {
            await updateTicket(payload)
            await sendMail(mail)
            setLoader(false)
            await getTicketData()
            dispatch(
                success({
                  show: true,
                  msg: "Ticket updated and mail sent successfully",
                  severity: "success",
                })
              );
        }
        catch (err) {
            console.log(err)
            setLoader(false)
            dispatch(
                error({
                  show: true,
                  msg: "There are some error occupied",
                  severity: "error",
                })
              );
        } finally {
            setContent('')
        }
    }



    function checkPriority(type) {
        switch (type) {
            case 'high':
                return 'High HighBg'
                break;
            case 'medium':
                return 'Medium MediumBg'
                break;
            case 'low':
                return 'Low LowBg'
                break;
            case 'urgent':
                return 'Urgent UrgentBg'
                break;
        }
    }

    function checkStatus(type) {
        switch (type) {
            case 'new':
                return 'new'
                break;
            case 'ongoing':
                return 'ongoing'
                break;
            case 'overdue':
                return 'overdue'
                break;
            case 'resolved':
                return 'resolved'
                break;
        }
    }



    return (
        <>
            <Content>
                {loader?<Loader/>:''}
                <div className="card_container p-md-4 p-sm-3 p-3">
                    <button className="btn p-0 text-primary fw-600" onClick={() => history.push("/helpDeskManagement")}>
                        <IoArrowBack className="f-18" /> Back
                    </button>
                    <div className="f-28 fw-600 text-black mt-4">Ticket# {ticketData?.ticket_id}</div>
                    <div className="mt-2 d-flex align-items-center f-18">
                        <div className="text-secondary fw-500">Full Name:</div>
                        <div className="ml-2 text-black fw-500">{ticketData?.name}</div>
                    </div>
                    <div className="mt-2 d-flex align-items-center f-18">
                        <div className="text-secondary fw-500">Mobile Number:</div>
                        <div className="ml-2 text-black fw-500">+91{ticketData?.mobile_number}</div>
                    </div>
                    <div className="mt-2 d-flex align-items-center f-18">
                        <div className="text-secondary fw-500">Email:</div>
                        <div className="ml-2 text-black fw-500">{ticketData?.email}</div>
                    </div>
                    <div className="mt-2 d-flex align-items-center f-18">
                        <div className="text-secondary fw-500">Issue Type:</div>
                        <div className="ml-2 text-black fw-500 text-capitalize">{ticketData?.issue_type}</div>
                    </div>
                    {ticketData?.subscriber_info !== undefined?
                    <div className="mt-2 d-flex align-items-center f-18">
                    <div className="text-secondary fw-500">Installation Address:</div>
                    <div className="ml-2 text-black fw-500 text-capitalize">{ticketData?.subscriber_info?.installation_address?.flat_number}, {ticketData?.subscriber_info?.installation_address?.city}, {ticketData?.subscriber_info?.installation_address?.state}, {ticketData?.subscriber_info?.installation_address?.pin_code}</div>
                </div>
                :''}
                    
                  
                    <div className='border rounded mt-4'>
                        <div className='w-100 p-md-3 p-sm-3 p-2'>
                            <div className='row mx-md-0 mx-sm-0 mx-0 justify-content-between'>
                                <div className='d-flex align-items-center'>
                                    <div className='fw-600'>Ticket# {ticketData?.ticket_id}</div>
                                    <div className={`${checkPriority(ticketData?.priority)} p-1 rounded f-13 fw-500 ml-2 text-capitalize`}>{ticketData?.priority} priority</div>
                                </div>
                                <div className='text-secondary f-13'>Posted at {moment(ticketData?.createdAt).format('DD MMM YYYY HH:mm a')}</div>
                            </div>
                            <div className='btn border text-primary f-13 mt-3 text-uppercase'><FaTag className='text-black f-18' /> {ticketData?.issue_type} ISSUE</div>
                            <div className='mt-3 text-black'>
                                {ticketData?.title}
                            </div>
                            <div className='mt-3 text-secondary'>
                                {ticketData?.desc}

                            </div>
                        </div>
                    </div>
                   <form onSubmit={updateData}>
                   <div className='border rounded mt-4'>
                        <div className='w-100 p-md-3 p-sm-3 p-2'>
                            <div className='fw-500 f-18'>Reply To Ticket</div>
                            <div className='row mt-3'>
                                <div className='col-md-4 col-sm-6 col-12 mt-2'>
                                    <label className='form-label'>Status</label>
                                    {ticketData?.status !== "resolved" ? <>
                                        <CustomDropdown open={dropdownOpen1} text={<div className='d-flex align-items-center text-capitalize'><div className={`${checkStatus(status)} mr-2`} />{status}</div>} setOpen={setDropdownOpen1}>
                                        <DropdownItem className='d-flex align-items-center' onClick={() => setStatus('new')} ><div className='new mr-2' />&nbsp;New</DropdownItem>
                                        <DropdownItem className='d-flex align-items-center' onClick={() => setStatus('ongoing')} ><div className='ongoing mr-2' />&nbsp;Ongoing</DropdownItem>
                                        <DropdownItem className='d-flex align-items-center' onClick={() => setStatus('overdue')} ><div className='overdue mr-2' />&nbsp;Overdue</DropdownItem>
                                        <DropdownItem className='d-flex align-items-center' onClick={() => setStatus('resolved')} ><div className='resolved mr-2' />&nbsp;Resolved</DropdownItem>
                                    </CustomDropdown></>:<>
                                    <input type="text" className='form-control' value={status} disabled /></>}
                                   
                                </div>
                                <div className='col-md-4 col-sm-6 col-12 mt-2'>
                                    <label className='form-label'>Issue Type</label>
                                    {ticketData?.status !== "resolved" ? <>
                                        {/* <CustomDropdown open={dropdownOpen2} text={issue} setOpen={setDropdownOpen2}>
                                        <DropdownItem className='text-capitalize' onClick={() => setIssue('payment')}>payment</DropdownItem>
                                        <DropdownItem className='text-capitalize' onClick={() => setIssue('billing')}>billing</DropdownItem>
                                        <DropdownItem className='text-capitalize' onClick={() => setIssue('service')}>service</DropdownItem>
                                        <DropdownItem className='text-capitalize' onClick={() => setIssue('other')}>other</DropdownItem>
                                    </CustomDropdown> */}
                                     <select
                                className='form-control text-capitalize'
                                required
                                value={issue}
                                onChange={(e) => {
                                    setIssue(e.target.value)
                                }}
                            >
                                <option value='' disabled>Select Issue Type</option>
                                
                                {getAllIssues.map((res)=>{
                                    return(
                                        <option key={res.id} className='text-capitalize fw-500' value={res?.issue_type}>{res?.issue_type}</option>
                                    )
                                })}
                            </select>
                                    </> :<>
                                    <input type="text" className='form-control' value={issue} disabled /></>}
                                  
                                </div>
                                <div className='col-md-4 col-sm-6 col-12 mt-2'>
                                    <label className='form-label'>Priority</label>
                                    {ticketData?.status !== "resolved" ? <>
                                        <CustomDropdown open={dropdownOpen3} text={<div className='d-flex align-items-center'><div className={`${priority} mr-2`} />{priority}</div>} setOpen={setDropdownOpen3}>
                                        <DropdownItem className='d-flex align-items-center' onClick={() => setPriority('high')}><div className='high mr-2' />&nbsp;High</DropdownItem>
                                        <DropdownItem className='d-flex align-items-center' onClick={() => setPriority('medium')}><div className='medium mr-2' />&nbsp;Medium</DropdownItem>
                                        <DropdownItem className='d-flex align-items-center' onClick={() => setPriority('low')}><div className='low mr-2' />&nbsp;Low</DropdownItem>
                                        <DropdownItem className='d-flex align-items-center' onClick={() => setPriority('urgent')}><div className='urgent mr-2' />&nbsp;Urgent</DropdownItem>
                                    </CustomDropdown></> : <>
                                    <input type="text" className='form-control' value={priority} disabled /></>}
                                    
                                </div>
                                <div className='col-12 mt-2'>
                                    <label className='form-label'>Ticket Body</label>
                                    {ticketData?.status !== "resolved" ?<>
                                        <textarea className='form-control' required placeholder='Type here...' value={content} onChange={(e)=>{
                                        if(e.target.value == ' '){
                                            e.target.value = ''
                                        }else{
                                            setContent(e.target.value)
                                        }
                                    }} />
                                    </>:<>
                                    <textarea name="" id="" className='form-control' value={ticketData?.last_email} disabled/></>}
                                  
                                </div>
                            </div>
                            <div className='w-100 d-flex justify-content-end mt-4'>
                                <button className='btn text-primary' type='button' onClick={()=> history.push("/helpDeskManagement")}>Cancel</button>
                                <button className='btn btn-primary' type='submit'>Save & Send</button>
                            </div>
                        </div>
                    </div>
                   </form>
                </div>
            </Content>
        </>
    )
}
