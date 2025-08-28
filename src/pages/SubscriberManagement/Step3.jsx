import React, { useEffect, useState } from 'react'
import { getAllIssueType } from '../../service/admin';
import { DropdownItem } from 'reactstrap'
import CustomDropdown from '../../AppComponents/CustomDropdown/CustomDropdown';
import Loader from '../../components/commonComponent/loader/Loader';


export default function Step3({ toggleTab, backBtnState, formData, handleChange, setFormData,submitData,setLoader,loader }) {
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const [dropdownOpen3, setDropdownOpen3] = useState(false);
    const [getAllIssues, setGetAllIssues] = useState([])



    function dropdownSelectData(name, value) {
        setFormData(pre => {
            return {
                ...pre,
                [name]: value
            }
        })
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
    },[])

  return (
    <>
    <form onSubmit={submitData}>
        <div className='row mt-3'>
            <div className='col-md-4 col-sm-6 col-12 mt-2'>
                <label className='form-label'>Status <span className='text-danger'>*</span></label>
                <CustomDropdown open={dropdownOpen1} text={<div className='d-flex align-items-center'><div className='new mr-2' />{formData?.status !== '' ? formData?.status : 'Select status'}</div>} setOpen={setDropdownOpen1}>
                    <DropdownItem className='d-flex align-items-center' onClick={() => dropdownSelectData('status', 'new')} ><div className='new mr-2' />&nbsp;New</DropdownItem>
                    <DropdownItem className='d-flex align-items-center' onClick={() => dropdownSelectData('status', 'ongoing')} ><div className='ongoing mr-2' />&nbsp;Ongoing</DropdownItem>
                    <DropdownItem className='d-flex align-items-center' onClick={() => dropdownSelectData('status', 'overdue')} ><div className='overdue mr-2' />&nbsp;Overdue</DropdownItem>
                    <DropdownItem className='d-flex align-items-center' onClick={() => dropdownSelectData('status', 'resolved')} ><div className='resolved mr-2' />&nbsp;Resolved</DropdownItem>
                </CustomDropdown>
            </div>
            <div className='col-md-4 col-sm-6 col-12 mt-2'>
                <label className='form-label'>Issue Type <span className='text-danger'>*</span></label>
                {/* <CustomDropdown open={dropdownOpen2} text={formData?.issue_type !== '' ? formData?.issue_type : 'Select issue type'} setOpen={setDropdownOpen2}>
                    <DropdownItem className='text-capitalize' onClick={() => dropdownSelectData('issue_type', 'payment')}>payment</DropdownItem>
                    <DropdownItem className='text-capitalize' onClick={() => dropdownSelectData('issue_type', 'billing')}>billing</DropdownItem>
                    <DropdownItem className='text-capitalize' onClick={() => dropdownSelectData('issue_type', 'service')}>service</DropdownItem>
                    <DropdownItem className='text-capitalize' onClick={() => dropdownSelectData('issue_type', 'other')}>other</DropdownItem>
                </CustomDropdown> */}
                 <select
                        className='form-control text-capitalize'
                        required
                        value={formData?.issue_type}
                        onChange={(e) => {
                            setFormData(pre => {
                                return {
                                    ...pre,
                                    issue_type: e.target.value
                                }
                            })
                        }}
                    >
                        <option value=''>Select Issue Type</option>
                        
                        {getAllIssues.map((res)=>{
                            return(
                                <option key={res.id} className='text-capitalize fw-500' value={res?.issue_type}>{res?.issue_type}</option>
                            )
                        })}
                    </select>
            </div>
            <div className='col-md-4 col-sm-6 col-12 mt-2'>
                <label className='form-label'>Priority <span className='text-danger'>*</span></label>
                <CustomDropdown open={dropdownOpen3} text={<div className='d-flex align-items-center'><div className='high mr-2' />{formData?.priority !== '' ? formData?.priority : 'Select status'}</div>} setOpen={setDropdownOpen3}>
                    <DropdownItem className='d-flex align-items-center' onClick={() => dropdownSelectData('priority', 'high')}><div className='high mr-2' />&nbsp;High</DropdownItem>
                    <DropdownItem className='d-flex align-items-center' onClick={() => dropdownSelectData('priority', 'medium')}><div className='medium mr-2' />&nbsp;Medium</DropdownItem>
                    <DropdownItem className='d-flex align-items-center' onClick={() => dropdownSelectData('priority', 'low')}><div className='low mr-2' />&nbsp;Low</DropdownItem>
                    <DropdownItem className='d-flex align-items-center' onClick={() => dropdownSelectData('priority', 'urgent')}><div className='urgent mr-2' />&nbsp;Urgent</DropdownItem>
                </CustomDropdown>
            </div>
            <div className='col-12 mt-2'>
                <label className='form-label'>Title <span className='text-danger'>*</span></label>
                <input className='form-control' required name='title' placeholder='Enter title here' value={formData?.title} onChange={handleChange} />
            </div>
            <div className='col-12 mt-2'>
                <label className='form-label'>Description <span className='text-danger'>*</span></label>
                <textarea className='form-control' required name='desc' placeholder='Enter description here' value={formData?.desc} onChange={handleChange} />
            </div>
        </div>
        <div className='w-100 d-flex justify-content-end mt-5'>
            <button className='btn text-primary' type='button' onClick={() => toggleTab(backBtnState)}>Back</button>
         {loader ? <Loader/> : 
         <button className='btn btn-primary' type='submit'>Raise Ticket</button>}   
        </div>
    </form>
</>
  )
}
