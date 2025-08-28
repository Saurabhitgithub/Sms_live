import React from 'react'
import SingleSelect from '../../../components/commonComponent/singleSelect/SingleSelect'
import { updateLeadsData } from '../../../service/admin';

export default function SourceDetails() {
  const options = [
    { value: "offline", label: "Offline" },
    { value: "website", label: "Website" }
  ];

  async function onSubmit(e) {
    e.preventDefault()
}
  return (
    <>
      <form onSubmit={onSubmit}>
      <div className='f-18 fw-500 mt-4'>Source Details</div>
      <div className='row mt-1'>
        <div className='col-md-6 col-sm-6 col-12 mt-3'>
          <label className='form-label mb-1'>Source</label>
          <SingleSelect
            options={options}
            placeItem={"Source"}
          />
        </div>
      </div>
      <div className='w-100 d-flex justify-content-end mt-4'>
        <button type='button' className='btn text-primary mr-3'>Cancel</button>
        <button type='submit' className='btn btn-primary'>Next</button>
      </div>
      </form>
    </>
  )
}
