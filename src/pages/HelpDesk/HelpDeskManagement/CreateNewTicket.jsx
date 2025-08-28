import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader, TabContent, TabPane } from 'reactstrap'
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { getAllSubscriber } from '../../../service/admin';
import { userInfo } from '../../../assets/userLoginInfo';

export default function CreateNewTicket({ open, setOpen, formData, setFormData, handleChange, setLoader, submitData, setPhoneErr }) {
    let userId = userInfo()._id
    const [activeTab, toggleTab] = useState('0')
    const [subscriberData, setSubscriberData] = useState({})
    const [backBtnState, setBackBtnState] = useState('0')
    const [option, setOption] = useState([])
    function toggle() {
        setOpen(!open)
        toggleTab('0')
        setSubscriberData({})
        setFormData({
            already_subscriber: true,
            subscriber_id: '',
            status: 'new',
            priority: 'high',
            issue_type: 'payment',
            desc: '',
            title: '',
            name: '',
            email: '',
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
                subscriber_id: '',
                status: 'new',
                priority: 'high',
                issue_type: 'payment',
                desc: '',
                title: '',
                name: '',
                email: '',
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
                name: obj?.full_name,
                email: obj?.email,
                mobile_number: obj?.mobile_number,
                subscriber_id: obj?._id
            }
        })
    }



    return (
        <>
            <Modal isOpen={open} toggle={toggle} size='xl' scrollable>
                <ModalHeader toggle={toggle}>
                    <div className='f-24'>Raise Ticket</div>
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
                               
                            />
                        </TabPane>
                        <TabPane tabId="1">
                            <Step2
                                toggleTab={toggleTab}
                                formData={formData}
                                handleChange={handleChange}
                                subscriberData={subscriberData}
                                setBackBtnState={setBackBtnState}
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
                            />
                        </TabPane>
                    </TabContent>

                </ModalBody>
            </Modal>
        </>
    )
}
