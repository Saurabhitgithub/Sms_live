import React, { useState } from "react";
import { Input } from "reactstrap";


const SingleSelect = ({ placeholder, id, name, options, className, placeItem, ...rest }) => {

  return (
    <div>
      <Input id={id} name={name} type="select" placeholder={placeholder} className={className} {...rest} >
        <option value="" selected disabled>
          {placeItem === "none" ? "--N/A--" : `Select ${placeItem}`}
        </option>
        {options?.map((option, index) => (

          <option key={index} value={option?.value}>
            {option?.label}
          </option>
        ))}
      </Input>
    </div>
  );
};

export default SingleSelect;
