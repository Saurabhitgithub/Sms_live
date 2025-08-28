import React, { useEffect, useState } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import { userId, userInfo } from "../../../../assets/userLoginInfo";
import { getAdmin, getUserById, getfranchiseebyId } from "../../../../service/admin";
import { useSelector, useDispatch } from "react-redux";
import { changeHeaderData } from "../../../../Store/Slices/ProjectDataSlice";

const User = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState();
  const dispatch = useDispatch();
  let selector = useSelector((e) => e?.profileInfo);

  const toggle = () => setOpen((prevState) => !prevState);

  const handleSignout = () => {
    localStorage.removeItem("accessToken");
  };
  async function userData() {
    try {
      let response;
      if (userInfo().role === "franchise") {
        response = await getfranchiseebyId(userId()).then((es) => {
          return es.data.data;
        });
      } else if (userInfo().role === "isp admin") {
        response = await getAdmin(userId()).then((es) => {
          return es.data.data;
        });
        response = {
          name: response.admin_name,
          role: response.role,
        };
      } else {
        response = await getUserById(userId()).then((es) => {
          return es.data.data;
        });
      }

      setProfile(response);
      let profile = response.profile;
      dispatch(changeHeaderData({ profilePic: profile }));
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    userData();
  }, []);
  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar
            text={profile?.name ? profile?.name.charAt(0) : userInfo().name.charAt(0)}
            className="sm"
            image={selector?.profilePic?.file_url}
            theme="primary"
          />
          <div className="user-info d-none d-md-block">
            <div className="user-name dropdown-indicator">{profile?.name ? profile?.name : userInfo().name}</div>
            <div className="user-status mt-1">{profile?.role ? profile?.role : userInfo().role}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <UserAvatar
              text={profile?.name.charAt(0)}
              className="sm"
              image={selector?.profilePic?.file_url}
              theme="primary"
            />

            <div className="user-info">
              <span className="lead-text">{profile?.name ? profile?.name : userInfo().name}</span>
              <span className="sub-text">{profile?.role ? profile?.role : userInfo().role}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem link="/user-profile-regular" icon="setting-alt" onClick={toggle}>
              Setting
            </LinkItem>
            {/* <LinkItem link="/invoice-setting" icon="setting-alt" onClick={toggle}>
              Invoice Setting
            </LinkItem> */}
            {/* <LinkItem 
            // link="/user-profile-activity" 
            icon="activity-alt" onClick={toggle}>
              Login Activity
            </LinkItem> */}
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
