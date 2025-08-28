import React, { useEffect, useState } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { RedirectAs404 } from "./utils/Utils";
import PrivateRoute from "./route/PrivateRoute";
import Layout from "./layout/Index";
import Error404Classic from "./pages/error/404-classic";
import Error404Modern from "./pages/error/404-modern";
import Error504Modern from "./pages/error/504-modern";
import Error504Classic from "./pages/error/504-classic";

import Faq from "./pages/others/Faq";
import Terms from "./pages/others/Terms";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Success from "./pages/auth/Success";
import InvoicePrint from "./pages/pre-built/invoice/InvoicePrint";
import ForgotPass from "./pages/auth/ForgotPass";
import Email from "./pages/auth/Email";
import NewPassword from "./pages/auth/NewPassword";
import PasswordReset from "./pages/auth/PasswordReset";
import { getLogoSetting } from "./service/admin";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "./components/commonComponent/loader/Loader";
import ChatBotFile from "./components/chatbot/ChatBotFile";
import { useLocation } from "react-router-dom";
import UnavailablePage from "./components/error/UnavailablePage";
const App = () => {
  const [themeColor, setThemeColor] = useState("");
  const [loader, setLoader] = useState(false);
  const [lighterColor, setLighterColor] = useState("");
  const location = useLocation();

  const getPreviousData = async () => {
    setLoader(true);
    try {
      let predata = await getLogoSetting();
      setThemeColor(predata.data.data?.color);
      setLighterColor(predata.data.data?.lighterColor);
    } catch (error) {
      console.error(error);
    }
    setLoader(false);
  };

  useEffect(() => {
    getPreviousData();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primaryColor", themeColor);
    document.documentElement.style.setProperty("--primaryColorLight", lighterColor);
  }, [themeColor, lighterColor]);

  function checkAuthentication() {
    if (localStorage.getItem("accessToken")) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <div>
       {location?.pathname !=="/auth-login" && (
          <div className="main_div_chat_boat">
          <ChatBotFile />
        </div>
        )} 

        <Switch>
          {loader ? <Loader /> : ""}
           {/* <Route exact path={`${process.env.PUBLIC_URL}/`} component={UnavailablePage}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/auth-login`} component={UnavailablePage}></Route> */}
          {/* Auth Pages */}
          <Route exact path={`${process.env.PUBLIC_URL}/auth-success`} component={Success}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/auth-reset`} component={ForgotPassword}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/auth-register`} component={Register}></Route>
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/auth-login`}
            render={() => (checkAuthentication() ? <Redirect to="/dashboard" /> : <Login />)}
          ></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/forgot-password`} component={ForgotPass}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/email`} component={Email}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/new-password/:id`} component={NewPassword}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/password-reset`} component={PasswordReset}></Route>

  
          <Route exact path={`${process.env.PUBLIC_URL}/invoice-print/:id`} component={InvoicePrint}></Route>


          <Route exact path={`${process.env.PUBLIC_URL}/auths/terms`} component={Terms}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/auths/faq`} component={Faq}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/invoice-print`} component={InvoicePrint}></Route>

          <Route exact path={`${process.env.PUBLIC_URL}/errors/404-classic`} component={Error404Classic}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/errors/504-modern`} component={Error504Modern}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/errors/404-modern`} component={Error404Modern}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/errors/504-classic`} component={Error504Classic}></Route>

          <PrivateRoute exact path="" component={Layout}></PrivateRoute>
          <Route component={RedirectAs404}></Route>
        </Switch>
      </div>
    </>
  );
};
export default withRouter(App);
