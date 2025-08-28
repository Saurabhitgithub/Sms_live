import React, { useEffect } from "react";
import menu from "./MenuData";
import Icon from "../../components/icon/Icon";
import classNames from "classnames";
import { NavLink, Link } from "react-router-dom";
import { permisionsTab, permisionsTabJwt } from "../../assets/userLoginInfo";

const MenuHeading = ({ heading }) => {
  return (
    <li className="nk-menu-heading">
      <h6 className="overline-title text-primary-alt">{heading}</h6>
    </li>
  );
};

const MenuItem = ({ icon, link, text, sub, newTab, sidebarToggle, mobileView, badge, ...props }) => {
  let currentUrl;
  const toggleActionSidebar = (e) => {
    if (!sub && !newTab && mobileView) {
      sidebarToggle(e);
    }
  };

  if (window.location.pathname !== undefined) {
    currentUrl = window.location.pathname;
  } else {
    currentUrl = null;
  }

  const menuHeight = (el) => {
    var totalHeight = [];
    for (var i = 0; i < el.length; i++) {
      var margin =
        parseInt(window.getComputedStyle(el[i]).marginTop.slice(0, -2)) +
        parseInt(window.getComputedStyle(el[i]).marginBottom.slice(0, -2));
      var padding =
        parseInt(window.getComputedStyle(el[i]).paddingTop.slice(0, -2)) +
        parseInt(window.getComputedStyle(el[i]).paddingBottom.slice(0, -2));
      var height = el[i].clientHeight + margin + padding;
      totalHeight.push(height);
    }
    totalHeight = totalHeight.reduce((sum, value) => (sum += value));
    return totalHeight;
  };

  const makeParentActive = (el, childHeight) => {
    let element = el.parentElement.parentElement.parentElement;
    let wrap = el.parentElement.parentElement;
    if (element.classList[0] === "nk-menu-item") {
      element.classList.add("active");
      const subMenuHeight = menuHeight(el.parentNode.children);
      wrap.style.height = subMenuHeight + childHeight - 50 + "px";
      makeParentActive(element);
    }
  };

  useEffect(() => {
    var element = document.getElementsByClassName("nk-menu-item active current-page");
    var arrayElement = [...element];

    arrayElement.forEach((dom) => {
      if (dom.parentElement.parentElement.parentElement.classList[0] === "nk-menu-item") {
        dom.parentElement.parentElement.parentElement.classList.add("active");
        const subMenuHeight = menuHeight(dom.parentNode.children);
        dom.parentElement.parentElement.style.height = subMenuHeight + "px";
        makeParentActive(dom.parentElement.parentElement.parentElement, subMenuHeight);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const menuToggle = (e) => {
    e.preventDefault();
    var self = e.target.closest(".nk-menu-toggle");
    var parent = self.parentElement;
    var subMenu = self.nextSibling;
    var subMenuItem = subMenu.childNodes;
    var parentSiblings = parent.parentElement.childNodes;
    var parentMenu = parent.closest(".nk-menu-wrap");
    //For Sub Menu Height
    var subMenuHeight = menuHeight(subMenuItem);
    // Get parent elements
    const getParents = (el, parentSelector) => {
      parentSelector = document.querySelector(".nk-menu");
      if (parentSelector === undefined) {
        parentSelector = document;
      }
      var parents = [];
      var p = el.parentNode;
      while (p !== parentSelector) {
        var o = p;
        parents.push(o);
        p = o.parentNode;
      }
      parents.push(parentSelector);
      return parents;
    };
    var parentMenus = getParents(self);
    if (!parent.classList.contains("test")) {
      // For Parent Siblings
      for (var j = 0; j < parentSiblings.length; j++) {
        parentSiblings[j].classList.remove("test");
        if (typeof parentSiblings[j].childNodes[1] !== "undefined") {
          parentSiblings[j].childNodes[1].style.height = 0;
        }
      }
      if (parentMenu !== null) {
        if (!parentMenu.classList.contains("sub-opened")) {
          parentMenu.classList.add("sub-opened");

          for (var l = 0; l < parentMenus.length; l++) {
            if (typeof parentMenus !== "undefined") {
              if (parentMenus[l].classList.contains("nk-menu-wrap")) {
                parentMenus[l].style.height = subMenuHeight + parentMenus[l].clientHeight + "px";
              }
            }
          }
        }
      }
      // For Current Element
      parent.classList.add("test");
      subMenu.style.height = subMenuHeight + "px";
    } else {
      parent.classList.remove("test");
      if (parentMenu !== null) {
        parentMenu.classList.remove("sub-opened");
        for (var k = 0; k < parentMenus.length; k++) {
          if (typeof parentMenus !== "undefined") {
            if (parentMenus[k].classList.contains("nk-menu-wrap")) {
              parentMenus[k].style.height = parentMenus[k].clientHeight - subMenuHeight + "px";
            }
          }
        }
      }
      subMenu.style.height = 0;
    }
  };

  const menuItemClass = classNames({
    "nk-menu-item": true,
    "has-sub": sub,
    "current-page": currentUrl === link,
  });



  function checkSubActive() {
    let ss = sub?.map((res) => res.link);
    // )
    return ss?.includes(currentUrl);
  }

  return (
    <li className={`${menuItemClass} px-2`} onClick={(e) => toggleActionSidebar(e)}>
      {newTab ? (
        <Link
          to={`${link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nk-menu-link d-flex align-items-center pb-3"
        >
          {icon ? (
            <span className="f-22 mr-2">
              {/* <Icon name={icon} /> */}
              {icon}
            </span>
          ) : null}
          <span className="nk-menu-text pt-1">{text}</span>
        </Link>
      ) : (
        <NavLink
          to={`${link}`}
          className={`nk-menu-link ${sub ? " nk-menu-toggle" : ""} ${currentUrl === link ? "active" : ""} ${
            sub ? (checkSubActive() ? "active" : "") : ""
          } d-flex align-items-center pb-3`}
          onClick={sub ? menuToggle : null}
        >
          {icon ? (
            <span className="f-22 mr-2">
              {/* <Icon name={icon} /> */}
              {icon}
            </span>
          ) : null}
          <span className="nk-menu-text pt-1">{text}</span>
          {badge && <span className="nk-menu-badge">{badge}</span>}
        </NavLink>
      )}
      {sub ? (
        <div className="nk-menu-wrap">
          <MenuSub sub={sub} sidebarToggle={sidebarToggle} mobileView={mobileView} />
        </div>
      ) : null}
    </li>
  );
};

const MenuSub = ({ icon, link, text, sub, sidebarToggle, mobileView, ...props }) => {
  return (
    <ul className="nk-menu-sub" style={props.style}>
      {sub.map((item) => (
        <MenuItem
          link={item.link}
          icon={item.icon}
          text={item.text}
          sub={item.subMenu}
          key={item.text}
          newTab={item.newTab}
          badge={item.badge}
          sidebarToggle={sidebarToggle}
          mobileView={mobileView}
        />
      ))}
    </ul>
  );
};

const Menu = ({ sidebarToggle, mobileView }) => {
  let permisionsRaw = permisionsTabJwt().filter((e) => e.is_show === true);
  let permisions = permisionsRaw.map((rs) => rs.tab_name);
  const subtab = (key, submenu) => {
    if (!submenu) return submenu;
  
    const subPermissions = permisionsRaw.find((e) => e.tab_name === key);
    if (!subPermissions) return [];
  
    const subtabData = subPermissions.tab_function
      .filter((s) => s.is_showFunction && s.tab_functionName.includes("Tab"))
      .map((s) => s.tab_functionName);
  
    const response = submenu.filter((res) => subtabData.includes(res.key));
   
  
    return response;
  };
  

  return (
    <ul className="nk-menu">
      {menu.map((item) =>
        item.heading ? (
          <MenuHeading heading={item.heading} key={item.heading} />
        ) : (
          <>
            {permisions.includes(item.key) && (
              <MenuItem
                key={item.text}
                link={item.link}
                icon={item.icon}
                text={item.text}
                sub={subtab(item.key, item.subMenu)}
                badge={item.badge}
                sidebarToggle={sidebarToggle}
                mobileView={mobileView}
              />
            )}
          </>
        )
      )}
    </ul>
  );
};

export default Menu;
