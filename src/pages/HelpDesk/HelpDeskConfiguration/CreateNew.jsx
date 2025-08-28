import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { getAllRole,getAllIssueType, } from '../../../service/admin'

export default function CreateNew({ open, setOpen, setLoader, submitData, formData, setFormData, data,existData1,getAllIssues }) {
    const [roles, setRoles] = useState([])
    const [issues,setIssues] = useState([])
  const [existData, setExistData] = useState([]);
   
    const issueOptions = [
        {name:'payment',key:false},
        {name:'billing',key:false},
        {name:'service',key:false},
        {name:'other',key:false}
    ]
    function toggle() {
        setOpen(!open)
        setFormData({
            role: '',
            issue_type: '',
        })
    }

   
    useEffect(()=>{
        
    },[getAllIssues])
    async function getAllRoles() {
        setLoader(true)
        try {
            let res = await getAllRole()
            let addedIssues = data.map(res => res.issue_type)
            let newArr = issueOptions?.map(res =>{
              if(addedIssues?.includes(res.name)){
                return {...res,key:true}
              }else{
                return res
              }
            })
            setIssues(newArr)
            setRoles(res?.data?.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        if (open) {
            getAllRoles()
        }

    }, [open])

    return (
        <>
            <Modal isOpen={open} toggle={toggle} size='xl' scrollable>
                <ModalHeader className='px-md-4 px-sm-3 px-0' toggle={toggle}>
                    <div className='f-24 fw-500'>Create New Help Desk Configuration</div>
                </ModalHeader>
                <ModalBody className='px-md-4 px-sm-3 px-0'>
                    <form onSubmit={(e)=>{ e.preventDefault();{existData1.includes(formData?.issue_type)? <>""</>:submitData()}}}>
                        <div className='f-20'>This page allows you to configure automatic ticket assignment by selecting a issue type and assigning an admin role to that status.</div>
                        <div className='mt-4'>
                            <div className='fw-600 text-black f-18'>Choose Issue Type:</div>
                            <div className='text-secondary f-18'>Select the type of the issue</div>
                            <select
                                className='form-control text-capitalize mt-2'
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
                                {/* {issues?.map((res, index) => (<option key={index} className='text-capitalize fw-500' disabled={res?.key} value={res?.name}>{res?.name}</option>))} */}
                                {getAllIssues.map((res)=>{
                                    return(
                                        <option key={res.id} className='text-capitalize fw-500' value={res?.issue_type}>{res?.issue_type}</option>
                                    )
                                })}
                            </select>
                            {existData1.includes(formData?.issue_type) && (
                  <>
                    <p className="text-danger">This issue type already exist</p>
                  </>
                )}
                        </div>
                        <div className='mt-4'>
                            <div className='fw-600 text-black f-18'>Assign Admin Role:</div>
                            <div className='text-secondary f-18'>Choose the admin role responsible for managing specific issue type</div>
                            <select
                                className='form-control text-capitalize mt-2'
                                required
                                value={formData?.role}
                                onChange={(e) => {
                                    setFormData(pre => {
                                        return {
                                            ...pre,
                                            role: e.target.value
                                        }
                                    })
                                }}
                            >
                                <option value=''>Select Admin Role</option>
                                {roles?.map((res, index) => (<option key={index} className='text-capitalize fw-500' value={res?.role}>{res?.role}</option>))}
                            </select>
                        </div>
                        <div className='w-100 d-flex justify-content-end mt-4'>
                            <button className='btn text-primary' type='button' onClick={toggle}>Cancel</button>
                            <button className='btn btn-primary' type='submit'>Create</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    )
}
