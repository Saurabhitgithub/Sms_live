import React from 'react'
import { LuSearch } from "react-icons/lu";


const SearchInput = ({ placeholder, onChange, ...props }) => {
  return (
    <div className='searchInput_main_con'>
      <input type='search' {...props} placeholder={placeholder || "Search"} onChange={onChange} />
      <LuSearch className='search_icon' />
    </div>
  )
}

export default SearchInput
