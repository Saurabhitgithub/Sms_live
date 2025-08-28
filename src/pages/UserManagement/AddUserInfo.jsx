import React from 'react'
import SingleSelect from '../../components/commonComponent/singleSelect/SingleSelect'
import { Form, FormGroup, Input, Label } from 'reactstrap'

function AddUserInfo() {
  const options = [
    { value: "New York", label: "NY" },
    { value: "Rome", label: "RM" },
    { value: "London", label: "LDN" },
    { value: "Istanbul", label: "IST" },
    { value: "Paris", label: "PRS" },
  ];
  return (
    <>
      <div className="user_info_section">
        <h3>User Info</h3>
        <div className="mt-4">
          <span className="light_heading">Gender</span>
          <div className=" flex justify-content-start mt-3">
            <div className="flex flex-wrap gap-5">
              <div className="flex align-items-center gap-3">
                <Form className='d-flex gap-3'>
                  <FormGroup check  >
                    <Input
                      name="radio1"
                      type="radio" className='radioButton' />
                    <Label className="labels" check>
                      Male
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Input
                      name="radio1"
                      type="radio"
                      className='radioButton'
                    />
                    <Label className="labels" check>
                      Female
                    </Label>
                  </FormGroup>

                </Form>
              </div>

            </div>
          </div>
        </div>

        <div className="col-md-12 p-0 mt-2">
          <span className="light_heading">Personal Detail</span>
          <div className="row mt-3 ">
            <div className="col-md-6">
              <Label className="labels ">First Name</Label>
              <Input bsSize="lg" placeholder='First Name' />
            </div>
            <div className="col-md-6">
              <Label className="labels">Last Name</Label>
              <Input bsSize="lg" placeholder='Last Name' />
            </div>

            <div className="col-md-6 mt-4">
              <Label className="labels">Mobile Number</Label>
              <Input bsSize="lg" placeholder='Mobile NUmber' />
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Alternate Mobile Number </Label>
              <Input bsSize="lg" placeholder='Alternate Mobile Number' />
            </div>

            <div className="col-md-6 mt-4">
              <Label className="labels">Email</Label>
              <Input bsSize="lg" placeholder='Emails' />
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Tax Number</Label>
              <Input bsSize="lg" placeholder='Tax Number' />
            </div>
            {/* biiling */}

            <div className="col-md-12 mt-5">
              <span className="light_heading">Billing Address</span>{" "}
            </div>
            <div className="flex gap-4 mt-3 col-md-12 ">
              <FormGroup check className='d-flex align-items-center'>
                <Input type="checkbox" className='input' />
                {' '}
                <Label className="labels ml-3 pt-1 " check>
                  Use Billing address as installation address
                </Label>
              </FormGroup>
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Billing Address Line 1</Label>
              <Input bsSize="lg" placeholder='Enter Billing Address' />
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Billing Address Line 2</Label>
              <Input bsSize="lg" placeholder='Enter Billing Address' />
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">City</Label>
              <div className="w-100 ">
                <SingleSelect placeholder="Select City" options={options}/>
              </div>
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Zip Code</Label>
              <div className="w-100">
                <SingleSelect placeholder="Select Zip Code" options={options} />
              </div>
            </div>
            {/* installation */}
            <div className="col-md-12 mt-5">
              <span className="light_heading">Installation Address</span>{" "}
            </div>

            <div className="col-md-6 mt-4">
              <Label className="labels">Billing Address Line 1</Label>
              <Input bsSize="lg" placeholder='Enter Billing Address' />
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Billing Address Line 2</Label>
              <Input bsSize="lg" placeholder='Enter Billing Address' className='mt-1' />
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">City</Label>
              <div className="w-100">
                <SingleSelect placeholder="Select City" options={options}/>
              </div>
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Zip Code</Label>
              <div className="w-100">
                <SingleSelect placeholder="Select Zip Code" options={options} />
              </div>
            </div>

            {/* Document */}
            <div className="col-md-12 mt-5">
              <span className="light_heading">Document Details</span>{" "}
            </div>

            <div className="col-md-6 mt-4">
              <Label className="labels">ID Proof</Label>
              <div className="w-100">
                <SingleSelect placeholder="Select Id Proof" options={options}/>
              </div>
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">ID Proof No</Label>
              <div className="w-100">
                <Input bsSize="lg" placeholder='Id Proof Number' />
              </div>
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Address Proof</Label>
              <div className="w-100">
                <SingleSelect placeholder="Address Proof" options={options}/>
              </div>
            </div>
            <div className="col-md-6 mt-4">
              <Label className="labels">Address Proof No</Label>
              <div className="w-100">
                <Input bsSize="lg" placeholder='Enter Address Proof No.' />
              </div>
            </div>
            {/* Portal Detail */}
            <div className="col-md-12 mt-5">
              <span className="light_heading">Portal Details</span>{" "}
            </div>

            <div className="col-md-6 mt-4">
              <Label className="labels">Notes</Label>
              <div className="w-100 ">
                <Input bsSize="lg" placeholder='Enter Notes' />
              </div>
            </div>

            <div className="col-md-6 mt-4">
              <Label className="labels">CPE IP Address</Label>
              <div className="w-100">
                <Input bsSize="lg" placeholder='Enter CPE IP Address' />
              </div>
            </div>
            <div className="flex gap-4 mt-3 col-md-12">
              <FormGroup check className='d-flex align-items-center'>
                <Input type="checkbox" className='input ' />
                {' '}
                <Label className="labels ml-3 pt-1" check>
                  Enable user portal login
                </Label>
              </FormGroup>
            </div>

            {/* Document Upload */}
            <div className="col-md-12 mt-5">
              <span className="light_heading">Document Upload</span>{" "}
            </div>

            <div className="col-md-6 mt-4">
              <Label className="labels">CPE IP Address</Label>
              <div className="w-100 ">
                <Input bsSize="lg" placeholder='Enter CPE IP Address' />
              </div>
            </div>
            <div className="col-md-6 mt-4">
              <FormGroup>
                <Label className="labels">Choose File *</Label>
                <div className="w-100 mt-1">
                  <Input
                    id="exampleFile"
                    name="file"
                    type="file"
                  />
                </div>
              </FormGroup>
            </div>

            <div className="col-md-12 mt-4">
              <button className="upload_btn">Upload</button>
            </div>
          </div>
        </div>
        <div className="flex justify-content-end mt-2">
          <button className="btn_primary_btn">Next</button>
        </div>
      </div>
    </>
  )
}

export default AddUserInfo