import React from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

export default function CustomDropdown({ children, open, setOpen, text }) {
    return (
        <>
            <Dropdown className='w-100' isOpen={open} toggle={() => setOpen(!open)}>
                <DropdownToggle color='white' className='w-100 d-flex justify-content-between f-16 text-capitalize' ><div>{text ? text : Dropdown}</div> {open ? <IoIosArrowUp /> : <IoIosArrowDown />}</DropdownToggle>
                <DropdownMenu>
                    {children}
                </DropdownMenu>
            </Dropdown >
        </>
    )
}
