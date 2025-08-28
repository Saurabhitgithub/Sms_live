import React from 'react';
import { GoCheckCircle } from "react-icons/go";
import { Button, Form, FormGroup } from 'reactstrap';
import style from './style.module.css'


function PasswordReset() {
    return (
        <div className='flex center align-items-center vh-100'>
            <div className='password_reset text-center' style={{width:'29%'}}>
                <div className='text-center'>
                    <div className={`${style.key_icon}`}>
                        <GoCheckCircle size={80} color='grey' />
                    </div>
                </div>
                <div className='heading mt-4'>
                    <h1>Password Reset</h1>
                </div>
                <div className='pass-info flex flex-column mt-2 mb-5'>
                    <span>Your password has been successfuly reset!</span>
                    <span>Click below to log in.</span>
                </div>
                <Form>
                    <FormGroup>
                    <Button size="lg" className="btn-block"  color="primary">
                 Continue
                </Button>
                    </FormGroup>
                </Form>
            </div>

        </div>

    )
}

export default PasswordReset