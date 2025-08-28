import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import UserProfileRegularPage from "./UserProfileRegular";
import { Route, Switch, Link } from "react-router-dom";
import { Icon, UserAvatar } from "../../../components/Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { profileUpdate, uploadDocument } from "../../../service/admin";
import { useDispatch } from "react-redux";
import { changeHeaderData } from "../../../Store/Slices/ProjectDataSlice";
import UserProfileNotificationPage from "./UserProfileNotification";
import InvoiceSettings from "./InvoiceSettings";
import EmailManagement from "./EmailManagement";
import HsnAndSacCode from "./HsnAndSacCode";
import { permisionsTab } from "../../../assets/userLoginInfo";
const UserProfileLayout = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [profileName, setProfileName] = useState();
  const [profilePicture, setProfilePicture] = useState();
  const dispatch = useDispatch();
  // Function to handle file input change
  const handleFileChange = async (event) => {
    

    const file = event.target.files[0];
    

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
        
      };
      reader.readAsDataURL(file);
      let fileForm = new FormData();
      fileForm.append("upload", file);
      let res = await uploadDocument(fileForm);
      let filesData = res.data.data[0];
      await profileUpdate(profileName._id, { profile: filesData });
      
      dispatch(changeHeaderData({ profilePic: filesData }));
    }
  };

  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };
  const [permissionAccess, setPermissionAccess] = useState([]);
  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter((s) => s.is_show === true).map((e) => e.tab_name);
    setPermissionAccess(permissions);
  }
  useEffect(() => {
    permissionFunction();
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
      updateSm(false);
    });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  return (
    <React.Fragment>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <div className="card-inner-group">
                <div className="card-inner">
                  <div className="user-card">
                    <div
                      onClick={() => {
                        document.getElementById("fileInput").click();
                      }}
                      className="pointer "
                    >
                      <UserAvatar
                        className="md use_avtar_style"
                        text={profileName?.name.charAt(0)}
                        image={profilePicture ? profilePicture : profileName?.profile?.file_url}
                        theme="primary"
                      />
                    </div>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e)}
                    />
                    <div className="user-info ml-3">
                      <span className="lead-text">{profileName?.name}</span>
                      <span className="sub-text">{profileName?.email}</span>
                    </div>
                    {/* <div className="user-action">
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-icon btn-trigger mr-n2">
                          <Icon name="more-v"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                           
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  document.getElementById("fileInput").click();
                                }}
                              >
                                  <Icon name="edit-fill"></Icon>
                                <span>Update Profile</span>
                              </DropdownItem>
                           
                            </li> 
                      
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div> */}
                  </div>
                </div>

                <div className="card-inner p-0">
                  <ul className="link-list-menu">
                    <li onClick={() => updateSm(false)}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/user-profile-regular`}
                        className={
                          window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-regular` ? "active" : ""
                        }
                      >
                        <Icon name="user-fill-c"></Icon>
                        <span>Personal Information</span>
                      </Link>
                    </li>
                    {permissionAccess.includes("Invoice Settings") && (
                      <>
                        <li>
                          <Link
                            to={`${process.env.PUBLIC_URL}/user-profile-invoice`}
                            className={
                              window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-invoice`
                                ? "active"
                                : ""
                            }
                          >
                            <Icon name="setting-alt"></Icon>
                            <span>Invoice Setting</span>
                          </Link>
                        </li>
                      </>
                    )}
                    {permissionAccess.includes("Email Management") && (
                      <>
                        <li>
                          <Link
                            to={`${process.env.PUBLIC_URL}/user-profile-email-management`}
                            className={
                              window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-email-management`
                                ? "active"
                                : ""
                            }
                          >
                            <Icon name="text-rich"></Icon>
                            <span>Email Management</span>
                          </Link>
                        </li>
                      </>
                    )}
                    {permissionAccess.includes("HSN/SAC Code") && (
                      <>
                        <li>
                          <Link
                            to={`${process.env.PUBLIC_URL}/user-profile-hsn-sac-code`}
                            className={
                              window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-hsn-sac-code`
                                ? "active"
                                : ""
                            }
                          >
                            <Icon name="code" />
                            <span>HSN/SAC Code</span>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <Switch>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/user-profile-regular`}
                  render={() => <UserProfileRegularPage updateSm={updateSm} sm={sm} setProfileName={setProfileName} />}
                ></Route>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/user-profile-invoice`}
                  render={() => <InvoiceSettings updateSm={updateSm} sm={sm} setProfileName={setProfileName} />}
                ></Route>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/user-profile-email-management`}
                  render={() => <EmailManagement updateSm={updateSm} sm={sm} setProfileName={setProfileName} />}
                ></Route>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/user-profile-hsn-sac-code`}
                  render={() => <HsnAndSacCode updateSm={updateSm} sm={sm} setProfileName={setProfileName} />}
                ></Route>
              </Switch>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileLayout;
