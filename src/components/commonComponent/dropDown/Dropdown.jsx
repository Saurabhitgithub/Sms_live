import React, { useState } from "react";
import { Input } from "reactstrap";
import './Dropdown.css'

export default function Dropdown({  placeholder, id, name, options, style  }) {

  return (
    <div className='dropDown'>
        <Input id={id} name={name} type="select" placeholder={placeholder} style={style}  bsSize="lg">
          {options.map((option, index) => (
            <option key={index} value={option?.value}>
              {option.value}
            </option>
          ))}
        </Input>
       
      
    </div>
  );
}
