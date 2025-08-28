import React, { useRef, useState } from 'react';
import { IoKeyOutline } from "react-icons/io5";
import { Button, Form, FormGroup } from 'reactstrap';
import style from './style.module.css'
import { useSelector, useDispatch } from "react-redux";
import { success } from "../../Store/Slices/SnackbarSlice";

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { forgetPasswordEmailSend } from '../../service/admin';
import Swal from 'sweetalert2';


function ForgotPass() {

    const emailRef = useRef('');
    const [error,setError] = useState('')
    const [message, setMessage] = useState('');
    const history=useHistory()
    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailRef.current === '') {
          setError('Email is required');
          return;
        }
    
        try {
          const res = await forgetPasswordEmailSend({ email: emailRef.current });
          Swal.fire("Success", "Please check your email and reset your password.", "success");
           
        } catch (error) {
          console.error('There was an error!', error.response.data.errormessage);
          setError(error.response.data.errormessage)

        }
      };

     const handleBack=()=>{
        history.push('auth-login')
     }
    return (
        <div className='flex center align-items-center vh-100'>
         <div className={`${style.new_password} text-center w-30`}>
          <div className='text-center'>
          <div className={`${style.key_icon}`}>
                <IoKeyOutline size={60} color='grey'/>
            </div>
          </div>
            <div className='heading mt-4 mb-4'>
                <h1 className='text-center'>Forgot Password ?</h1>
            </div>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <div className="form-label-group">
                        <label className="form-label" htmlFor="password">
                            Email
                        </label>
                    </div>
                    <div className="form-control-wrap">
                        <input
                            type="email" className=' form-control' placeholder='Enter your email'
                            onChange={(e) => {
                                const emailValue = e.target.value.trim();
                                if (emailValue === '') {
                                  emailRef.current = '';
                                } else {
                                  emailRef.current = emailValue;
                                  setError('');
                                }
                              }} />
                              <div className='text-danger text-left'>{error}</div>
                              
                    </div>

                </FormGroup>
                <FormGroup >
                <Button size="lg" className="btn-block" type="submit" color="primary" >
                 Reset Password
                </Button>
              </FormGroup>
              <div>
                <hr/>
              </div>
             <Button className={style.btn} onClick={handleBack} >
              Back to Log In
              </Button>
               
            
            </Form>
            

        </div>

        </div>
       
    )
}

export default ForgotPass