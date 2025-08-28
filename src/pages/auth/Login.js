import React, { useState } from "react";
import smsLogo from '../../images/smsLogo.png'
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, FormGroup, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { loginAuth } from "../../service/admin";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { userInfo } from "../../assets/userLoginInfo";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  let history = useHistory()
  // const onFormSubmit = async (formData) => {
  //   setLoading(true);
  //   setErrorMessage("")
  //   try {
  //     let res = await loginAuth({ email: formData.email, password: formData.password });
     
  //     if(userInfo().role === "super admin"){
  //       window.history.pushState(
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/adminDashboard"}`,
  //         "auth-login",
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/adminDashboard"}`
  //       );
  //       localStorage.setItem("accessToken", res?.data?.data?.token);

  //     }else{

  //       window.history.pushState(
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/dashboard"}`,
  //         "auth-login",
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/dashboard"}`
  //       );
  //       localStorage.setItem("accessToken", res?.data?.data?.token);
  //     }
  //     window.location.reload();
  //   } catch (err) {
  //     setErrorMessage(err.response.data.errormessage);
  //     setLoading(false);
  //   }
  // };


  const onFormSubmit = async (formData) => {
    setLoading(true);
    setErrorMessage("");
  
    try {
      let res = await loginAuth({ email: formData.email, password: formData.password });
  
      if (res && res.data && res.data.data && res.data.data.token) {
        localStorage.setItem("accessToken", res.data.data.token);
  
        if (userInfo().role === "super admin") {
          window.history.pushState(
            process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/adminDashboard",
            "auth-login",
            process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/adminDashboard"
          );
        } else {
          window.history.pushState(
            process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/dashboard",
            "auth-login",
            process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/dashboard"
          );
        }
  
        window.location.reload();
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMessage(err.response?.data?.errormessage || "Login failed. Please try again.");
      setLoading(false);
    }
  };
  
  const { errors, register, handleSubmit } = useForm();
  const handlePassword = () => {
    history.push('forgot-password')
  }

  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={smsLogo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={smsLogo} alt="logo-dark" />
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Sign-In</BlockTitle>
                {/* <BlockDes>
                  <p>Access Dashlite using your email and passcode.</p>
                </BlockDes> */}
              </BlockContent>
            </BlockHead>
            {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> Unable to login with credentials{" "}
                </Alert>
              </div>
            )}
            <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="email"
                    id="default-01"
                    name="email"
                    ref={register({ required: "This field is required" })}

                    placeholder="Enter your email address"
                    className=" form-control"
                  />
                  {errors.name && <span className="invalid">{errors.name.message}</span>}
                </div>

              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  {/* <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot Code?
                  </Link> */}


                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={() => setErrorMessage('')}

                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your password"
                    className={` form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                  <div className="text-danger">{errorMessage}</div>
                </div>
              </FormGroup>
              <FormGroup>
                <Button size="lg" className="btn-block" type="submit" disabled={loading} color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </Button>
              </FormGroup>
              <div className="text-center" onClick={handlePassword} >
                <div style={{ cursor: 'pointer' }}>Forgot Password</div>
              </div>
            </Form>
            {/* <div className="form-note-s2 text-center pt-4">
              {" "}
              New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
            </div> */}
            {/* <div className="text-center pt-4 pb-3">
              <h6 className="overline-title overline-title-sap">
                <span>OR</span>
              </h6>
            </div>
            <ul className="nav justify-center gx-4">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Facebook
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Google
                </a>
              </li>
            </ul> */}
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;
