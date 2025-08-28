import React from 'react';
import { MdOutlineMailOutline } from "react-icons/md";
import { Button, Form, FormGroup } from 'reactstrap';
import style from './style.module.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


function Email() {
    const history=useHistory()
    const handleBack=()=>{
       history.push('auth-login')
    }

    return (
        <div className='flex center align-items-center vh-100'>
            <div className='email_page text-center' style={{ width: '29%'}}>
                <div className='text-center'>
                    <div className={`${style.key_icon}`}>
                        <MdOutlineMailOutline size={80} color='grey' />
                    </div>
                </div>
                <div className='email_heading mt-4 mb-3'>
                    <h1>Check your email</h1>
                </div>
                <div className='btn' style={{ width: "100%" }}>
                    <Form >
                        <FormGroup>
                           <Button size="lg" className="btn-block" type="submit" color="primary">
                              Check Your Email Inbox
                            </Button>
                            <Button size="lg" className={`${style.btn} mt-4`} onClick={handleBack}>
                                Back to Log In
                            </Button>

                        </FormGroup>

                    </Form>
                </div>
                <div className='mt-3'>
                    <div>Don't receive the email? <span style={{color:'#0e1073'}}>Click to resend</span></div>
                </div>
            </div>
        </div>
    )
}

export default Email