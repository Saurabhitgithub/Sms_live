import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label } from "reactstrap";
import style from "./style.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const DropDown = ({ items, label }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="px-2" >
      <DropdownToggle caret className={`${style.dropdown_bg} `}>
        {label}
        {dropdownOpen ? <FaChevronUp size={30} color="gray" className="px-2" /> : <FaChevronDown size={28} color="gray" className="px-2" />}
      </DropdownToggle>
      <DropdownMenu className="px-2">
        {items.map((item) => (
          <DropdownItem key={item} toggle={false}>
            <Label check>
              <Input type="checkbox" />
              {item}
            </Label>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDown;
