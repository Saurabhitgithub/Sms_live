import React from 'react'
import "./skeleten.css"

const Skeleten = ( { width, height,variant }) => {
    const style ={
        width,
        height,
    };
  return (
   <span className={'skeleton ${variant}'} style={style}></span>
  )
};

export default Skeleten
