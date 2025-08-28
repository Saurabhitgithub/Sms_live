import React from 'react';
import { Input } from 'reactstrap';

const Calendar = ({ id, name, placeholder, value, onChange }) => {
  return (
    <Input
      id={id}
      name={name}
      placeholder={placeholder}
      type="date"
      value={value}
      onChange={onChange}
      bsSize="lg"
    />
  );
};

export default Calendar;
