import React from 'react'
import { FaArrowRight } from "react-icons/fa6";



export default function Step2({ toggleTab, subscriberData, formData,planData }) {


  return (
    <>
    <div className='row'>
        <div className='col-md-6'>
            <div className="mt-2 f-18">
                <div className="text-secondary fw-500">User Name:</div>
                <div className="text-black fw-500">{planData?.full_name}</div>
            </div>
        </div>
        <div className='col-md-6'>
            <div className="mt-2 f-18">
                <div className="text-secondary fw-500">Installation Address:</div>
                <div className="text-black fw-500">{planData?.installation_address?.flat_number}, {subscriberData?.installation_address?.city}- {subscriberData?.installation_address?.state} {subscriberData?.installation_address?.pin_code}</div>
            </div>
        </div>
        <div className='col-md-6'>
            <div className="mt-2 f-18">
                <div className="text-secondary fw-500">Mobile Number:</div>
                <div className="text-black fw-500">+91{planData?.mobile_number}</div>
            </div>
        </div>
        <div className='col-md-6'>
            <div className="mt-2 f-18">
                <div className="text-secondary fw-500">Account Type:</div>
                <div className="text-black fw-500 text-capitalize">{planData?.account_type}</div>
            </div>
        </div>
    </div>
    <div className='f-18 fw-500 mt-md-5 mt-sm-4 mt-4'>Subscriber Personal Details</div>
    <hr />
    <div className='row'>
        <div className='col-md-6 col-sm-6 col-12'>
            <label className='form-label'>Full Name</label>
            <input className='form-control' required disabled value={planData?.full_name} />
        </div>
        <div className='col-md-6 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-3'>
            <label className='form-label'>Email ID</label>
            <input className='form-control' required disabled value={planData?.email} />
        </div>
    </div>
    <div className='f-18 fw-500 mt-md-5 mt-sm-4 mt-4'>Plan Details</div>
    <hr />
    <div className='row'>
        <div className='col-md-6 col-sm-6 col-12'>
            <label className='form-label'>Plan Name</label>
            <input className='form-control' disabled value={planData?.planInfo?.plan_name} />
        </div>
        <div className='col-md-6 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-3'>
            <label className='form-label'>Plan Rate</label>
            <input className='form-control' disabled value={planData?.planInfo?.amount} />
        </div>
        <div className='col-md-6 col-sm-6 col-12 mt-3'>
            <label className='form-label'>Billing Cycle</label>
            <input className='form-control' disabled value={planData?.planInfo?.billingCycleType} />
        </div>
        <div className='col-md-6 col-sm-6 col-12 mt-3'>
            <label className='form-label'>&nbsp;</label>
            <input className='form-control' disabled value={planData?.planInfo?.billingCycleDate} />
        </div>
    </div>
    <div className='f-18 fw-500 mt-md-5 mt-sm-4 mt-4'>Internet Speed</div>
    <hr />
    <div className='row'>
        <div className='col-md-6 col-sm-6 col-12'>
            <label className='form-label'>Download Speed</label>
            <input className='form-control' disabled value={`${planData?.bandwidth_info?.max_download?.speed} ${planData?.bandwidth_info?.max_download?.unit}`}/>

        </div>

        <div className='col-md-6 col-sm-6 col-12 mt-md-0 mt-sm-0 mt-3'>
            <label className='form-label'>Upload Speed</label>
            <input className='form-control' disabled value={`${planData?.bandwidth_info?.max_upload?.speed} ${planData?.bandwidth_info?.max_upload?.unit}`} />
        </div>
    </div>
    <div className='w-100 d-flex justify-content-end mt-5'>
        <button className='btn text-primary' onClick={() => toggleTab('0')}>Back</button>
        <button className='btn btn-primary' onClick={() => toggleTab('2')}>Next <FaArrowRight /></button>
    </div>
</>
  )
}
