import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import News from "../news/News";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { getAllIsp, createJwtToken } from "../../service/admin";
import { userInfo } from "../../assets/userLoginInfo";
import Loader from "../../components/commonComponent/loader/Loader";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Header = ({ fixed, theme, className, setVisibility, ...props }) => {
  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme === "white",
    [`is-${theme}`]: theme !== "white" && theme !== "light",
    [`${className}`]: className
  });
  let history = useHistory();
  const [getAllData, setGetAllData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [storeIspData, setStoreIspData] = useState(userInfo().org_id ? userInfo().org_id : "all"); // Default to "all"
  const [createToken, setCreateToken] = useState();

  const cretateTokenFunction = async org_id => {
    setLoader(true);

    let payload = {
      reqBody: {
        ...userInfo(),
        org_id
      }
    };
    delete payload.reqBody.exp;
    delete payload.reqBody.iat;
    if (org_id === "all") {
      delete payload.reqBody.org_id;
    }
    try {
      let response = await createJwtToken(payload);
      console.log(response);
      localStorage.setItem("accessToken", response.data.data);
      localStorage.setItem("authToken", response.data.data);
      if (org_id === "all") {
        history.push("/adminDashboard");
      } else {
        history.push("/dashboard"); 
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
      window.location.reload();
    }
  };

  const getAllIspFunction = async () => {
    try {
      let response = await getAllIsp({ all: false });
      const ispData = [{ _id: "all", admin_name: "All ISPs" }, ...response.data.data];
      setGetAllData(ispData);
      setStoreIspData(userInfo().org_id ? userInfo().org_id : "all"); // Ensure "All ISPs" is selected by default
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllIspFunction();
  }, []);

  return (
    <>
      {loader && <Loader />}
      <div className={headerClass}>
        <div className="container-fluid">
          <div className="nk-header-wrap">
            <div className="nk-menu-trigger d-xl-none ml-n1">
              <Toggle
                className="nk-nav-toggle nk-quick-nav-icon d-xl-none ml-n1"
                icon="menu"
                click={props.sidebarToggle}
              />
            </div>
            <div className="nk-header-brand d-xl-none">
              <Logo />
            </div>

            <div className="nk-header-tools mr-4">
              <ul className="nk-quick-nav">
                {userInfo().role === "super admin" && (
                  <li className="">
                    <SingleSelect
                      placeItem={"isp"}
                      value={storeIspData}
                       isSearchable={true} 
                      options={getAllData.map(e => ({
                        value: e._id,
                        label: e.admin_name
                      }))}
                      onChange={e => {
                        cretateTokenFunction(e.target.value);
                        setStoreIspData(e.target.value);
                        console.log(e.target.value, "check value in console");
                      }}
                    />
                  </li>
                )}

                <li className="user-dropdown" mr-3 onClick={() => setVisibility(false)}>
                  <User />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
