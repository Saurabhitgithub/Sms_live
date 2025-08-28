import React, { useEffect, useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import { Button, Form, FormGroup } from "reactstrap";
import { Icon } from "../../components/Component";
import style from "./style.module.css";
import { useHistory, useLocation } from "react-router-dom";
import { changePassword, checkResetLink } from "../../service/admin";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import { success } from "../../Store/Slices/SnackbarSlice";
import Loader from "../../components/commonComponent/loader/Loader";

function NewPassword() {
  let { id } = useParams();
  const dispatch = useDispatch();
  

  const [passState, setPassState] = useState(false);
  const [loader, setLoader] = useState(true);
  const [checkering, setCheckering] = useState(false);

  const [confirmpassState, setConfirmPassState] = useState(false);
  const [error, setError] = useState("");

  const [formData, setformData] = useState({
    password: "",
    confirmPassword: "",
  });

  const history = useHistory();
  const handleBack = () => {
    history.push("auth-login");
  };
  // const handleSUbmit = async (e) => {
  //   e.preventDefault();
  //   const { password, confirmPassword } = formData;
  //   

  //   if (password !== confirmPassword) {
  //     setError("Password doesn't match");
  //     return;
  //   }
  //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //   if (!passwordRegex.test(password)) {
  //     setError([
  //       "Password must be at least 8 characters long",
  //       "Password must include at least one lowercase letter",
  //       "Password must include at least one uppercase letter",
  //       "Password must include at least one number",
  //       "Password must include at least one special character",
  //     ]);
  //     return;
  //   }

  //   let body = {
  //     password: formData.password,
  //   };
  //   try {
  //     let res = await changePassword(id, body);
  //     
  //     dispatch(
  //       success({
  //         show: true,
  //         msg: "Password Updated Successfully",
  //         severity: "success",
  //       })
  //     );
  //     history.push("/auth-login");
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  const checker = async () => {
    setLoader(true);
    try {
      let result = await checkResetLink(id.split("_")[1]);
      if (result.data.data) {
        setCheckering(true);
      }
    } catch (err) {
      setCheckering(false);
    }
    setLoader(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    

    if (password !== confirmPassword) {
      setError(["Password doesn't match"]);
      return;
    }

    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must include at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must include at least one uppercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must include at least one number");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Password must include at least one special character");
    }

    if (errors.length > 0) {
      setError(errors);
      return;
    }

    let body = {
      password: formData.password,
    };
    try {
      let res = await changePassword(id, body);
      
      dispatch(
        success({
          show: true,
          msg: "Password Updated Successfully",
          severity: "success",
        })
      );
      history.push("/auth-login");
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    checker();
  }, []);

  return (
    <div>
      {loader ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {checkering ? (
            <>
              <div className="flex align-items-center center vh-100">
                {" "}
                <div className={`${style.new_password} text-center w-30`}>
                  <div className="text-center">
                    <div className={`${style.key_icon}`}>
                      <IoKeyOutline size={60} color="grey" />
                    </div>
                  </div>
                  <div className="heading mt-4">
                    <h1>Set new password</h1>
                  </div>
                  <div className="mt-4">
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <div className="form-label-group">
                          <label className="form-label" htmlFor="password">
                            Password
                          </label>
                        </div>
                        <div className="form-control-wrap">
                          <a
                            href="#password"
                            onClick={(ev) => {
                              ev.preventDefault();
                              setPassState(!passState);
                            }}
                            className={`form-icon lg form-icon-right passcode-switch ${
                              passState ? "is-hidden" : "is-shown"
                            }`}
                          >
                            <Icon name="eye" className="passcode-icon icon-show"></Icon>

                            <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                          </a>
                          <input
                            type={passState ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Create new password"
                            className={` form-control ${passState ? "is-hidden" : "is-shown"}`}
                            onChange={(e) => {
                              setformData({
                                ...formData,
                                password: e.target.value,
                              });
                              setError("");
                            }}
                          />
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <div className="form-label-group">
                          <label className="form-label" htmlFor="password">
                            Confirm Password
                          </label>
                        </div>
                        <div className="form-control-wrap">
                          <a
                            href="#password"
                            onClick={(ev) => {
                              ev.preventDefault();
                              setConfirmPassState(!confirmpassState);
                            }}
                            className={`form-icon lg form-icon-right passcode-switch ${
                              confirmpassState ? "is-hidden" : "is-shown"
                            }`}
                          >
                            <Icon name="eye" className="passcode-icon icon-show"></Icon>

                            <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                          </a>
                          <input
                            type={confirmpassState ? "text" : "password"}
                            id="password"
                            name="confirmpassword"
                            placeholder="Confirm Password"
                            className={` form-control ${passState ? "is-hidden" : "is-shown"}`}
                            onChange={(e) => {
                              setformData({
                                ...formData,
                                confirmPassword: e.target.value,
                              });
                              setError("");
                            }}
                          />
                          <div className="text-danger text-left f-13 ">
                            {Array.isArray(error) && error.length > 0 ? (
                              <ul>
                                {error.map((err, index) => (
                                  <li key={index}>{err}</li>
                                ))}
                              </ul>
                            ) : (
                              <span>{error}</span>
                            )}
                          </div>
                        </div>
                      </FormGroup>
                      <FormGroup className="mt-5">
                        <Button size="lg" className="btn-block" type="submit" color="primary">
                          Reset Password
                        </Button>
                        <Button size="lg" className={`${style.btn} mt-4`} onClick={handleBack}>
                          Back to Log In
                        </Button>
                      </FormGroup>
                    </Form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div className="text-aligns-center align-items-center">
                <div className="d-flex justify-content-center">
                  Reset password link is already used or expired, please reset password again if you want to change
                  password
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <button className="btn-primary" onClick={()=>history.push("/forgot-password")}>Reset Again</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NewPassword;
