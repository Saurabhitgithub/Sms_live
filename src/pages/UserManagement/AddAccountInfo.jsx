import React from 'react'
import { Form, FormGroup, Input, Label } from 'reactstrap'

import SingleSelect from '../../components/commonComponent/singleSelect/SingleSelect'

function AddAccountInfo() {
  const options = [
    { value: "New York", label: "NY" },
    { value: "Rome", label: "RM" },
    { value: "London", label: "LDN" },
    { value: "Istanbul", label: "IST" },
    { value: "Paris", label: "PRS" },
  ];
 
  return (
    <>
      <div className="account_info">
        <div className="row">
          <div className="col-md-12">
            <div className="mt-4">
              <span className="light_heading">Select User type:</span>
              <div className=" flex justify-content-start mt-3">
                <div className="flex flex-wrap gap-5">
                  <div className="flex align-items-center gap-2">
                    <Form className='d-flex gap-3'>
                      <FormGroup check >
                        <Input
                          name="radio1"
                          type="radio" className='radioButton'

                        />

                        <Label className="labels" check>
                          User
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          name="radio1"
                          type="radio"
                          className='radioButton'
                        />

                        <Label className="labels" check>
                          Max / Static IP
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          name="radio1"
                          type="radio"
                          className='radioButton'
                        />

                        <Label className="labels" check>
                          Multiple / Static IP
                        </Label>
                      </FormGroup>

                    </Form>

                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* invoice */}
          <div className="col-md-12">
            <span className="light_heading">Invoice</span>
          </div>
          <div className="mt-2 col-md-12 flex gap-3">
            <FormGroup check className='d-flex align-items-center'>
              <Input type="checkbox" className='input' />
              {' '}
              <Label className="labels ml-3 pt-1" check>
                Enable user portal login
              </Label>
            </FormGroup>
          </div>
          {/* // */}

          {/* discount */}
          <div className="col-md-12 mt-4">
            <span className="light_heading">Discount</span>
          </div>
          <div className="col-md-6 mt-2">
            <Label className="labels">Type</Label>
            <div className="w-100">
              {/* <Input bsSize="lg" type="select" /> */}
              <SingleSelect placeholder="Select Percentage" />
            </div>
          </div>

          <div className="col-md-6 mt-2">
            <Label className="labels">Value</Label>
            <div className="w-100">
              {/* <InputText className="w-100" placeholder={"Enter Value"} /> */}
              <Input bsSize="lg" placeholder='Enter Billing Address' />
            </div>
          </div>
          {/* // */}

          <div className="col-md-12 mt-4">
            <Label className="labels">User Name</Label>
            <div className="w-100 ">
              <Input bsSize="lg" placeholder='Enter User Name' />
            </div>
          </div>

          <div className="col-md-12 mt-4">
            <Label className="labels">Password</Label>
            <div className="w-100">
              <Input bsSize="lg" placeholder='Enter Password' />
            </div>
          </div>

          <div className="col-md-12 mt-4">
            <Label className="labels">Zone</Label>
            <div className="w-100">
              <SingleSelect placeholder="Select Zone" options={options}  />

            </div>
          </div>

          <div className="col-md-12 mt-4">
            <label className="labels mt-1">Nas</label>
            <div className="w-100 ">
              <SingleSelect placeholder="Select Nas" options={options}/>
            </div>
          </div>

          <div className="col-md-12 mt-4">
            <Label className="labels">Plan</Label>
            <div className="w-100 ">
              <SingleSelect placeholder="Select Plan" options={options}/>
            </div>
          </div>


          <div className="col-md-12 mt-4">
            <Label className="labels">Plan Group</Label>
            <div className="w-100 ">
              <SingleSelect placeholder="Select Plan Group" options={options}/>
            </div>
          </div>

          <div className="col-md-12 mt-4">
            <Label className="labels">Simultaneous Use</Label>
            <div className="w-100 ">
              <Input bsSize="lg" placeholder='Simultaneous Use' />
            </div>
          </div>

          <div className="col-md-12 mt-4 ">
            <Label className="labels">IP Address</Label>
            <div className="w-100 d-flex ">
              <Input bsSize="lg" placeholder='Enter IP Address' />
              <div className="ml-2">
                <button className="BackGroundLight">Unused IP</button>
              </div>

            </div>
          </div>

          <div className="col-md-12 d-flex  justify-content-end mt-5">
            <button className="cancel_btn mr-2">Cancel</button>
            <button className="btn_primary_btn">Add</button>


          </div>


        </div>
      </div>
    </>
  )
}

export default AddAccountInfo