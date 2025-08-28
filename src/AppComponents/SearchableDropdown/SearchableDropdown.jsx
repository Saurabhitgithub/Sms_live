import React from 'react'
import Select from 'react-dropdown-select'

export default function SearchableDropdown({...props}) {
    return (
        <>
            <Select className='text-capitalize' {...props}/>
        </>
    )
}
