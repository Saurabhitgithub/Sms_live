import React from 'react'
import { Form, FormGroup, Input, Label } from 'reactstrap'
import Dropdown from '../../components/commonComponent/dropDown/Dropdown'
import SingleSelect from '../../components/commonComponent/singleSelect/SingleSelect'
import Calendar from '../../components/commonComponent/calendar/Calendar'

function Policy() {
  const options = [
    { value: "New York", label: "NY" },
    { value: "Rome", label: "RM" },
    { value: "London", label: "LDN" },
    { value: "Istanbul", label: "IST" },
    { value: "Paris", label: "PRS" },
  ];
  return (
    <>
      <div className="policy_section">
        <div className="flex between">
          <h4>Policy</h4>
          <div>
            <Dropdown  placeholder="User Setting" options={options} />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <span className="light_heading">Invoice</span>
                <div className="flex ">
                  <div className="flex  mt-3  center">
                    <FormGroup check className='d-flex align-items-center'>
                      <Input type="checkbox" className='input ' />
                      {' '}
                      <Label className="labels ml-3 pt-1 " check>
                        Auto Invoice Generate
                      </Label>
                    </FormGroup>
                  </div>
                  <div className="flex  mt-3 mx-5">
                    <FormGroup check className='d-flex align-items-center'>
                      <Input type="checkbox" className='input ' />
                      {' '}
                      <Label className="labels ml-3 pt-1" check>
                        Auto Recharge Renew
                      </Label>
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-4">
                <span className="light_heading">Grace Period</span>
                <div className="flex gap-4 mt-3">
                  <FormGroup check className='d-flex align-items-center'>
                    <Input type="checkbox" className='input ' />
                    {' '}
                    <Label className="labels ml-3 pt-1" check>
                      Grace Period
                    </Label>
                  </FormGroup>
                </div>
              </div>
              <div className="col-md-6 mt-4 ">
                <Calendar />

              </div>

              <div className="col-md-12 mt-4">
                <span className="light_heading">Location</span>
              </div>
              <div className="col-md-6 mt-3 ">
                <Label className="labels">Address List</Label>
                <div >
                  <SingleSelect placeholder="Select or Enter Address" options={options} />
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <Label className="labels">Zone</Label>
                <div>
                  <SingleSelect placeholder="Select Zone" options={options}/>
                </div>
              </div>

              {/* Discount */}
              <div className="col-md-12 mt-4">
                <span className="light_heading">Discount</span>
              </div>
              <div className="col-md-6 mt-3 ">
                <Label className="labels">Type</Label>
                <div >
                  <SingleSelect placeholder="Select Type" options={options}/>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <Label className="labels">Value</Label>
                <div >
                  <Input bsSize="lg" placeholder='Enter Value' />
                </div>
              </div>
              {/* // */}

              {/* Bandwith */}
              <div className="col-md-12 mt-4">
                <span className="light_heading">Bandwidth</span>
              </div>
              <div className="col-md-6 mt-3">
                <Label className="labels">Max Download</Label>
                <div >
                  <Input bsSize="lg" placeholder='Max Download' />
                </div>
              </div>
              <div className="col-md-6 mt-3 ">
                <Label className="labels">Speed</Label>
                <div >
                  <SingleSelect placeholder="Select Speed" options={options} />
                </div>
              </div>
              <div className="col-md-6 mt-4">
                <Label className="labels">Max Upload</Label>
                <div >
                  <Input bsSize="lg" placeholder='Max Upload' />
                </div>
              </div>
              <div className="col-md-6 mt-4 ">
                <Label className="labels">Speed</Label>
                <div >
                  <SingleSelect placeholder="Select Speed" options={options}/>
                </div>
              </div>
              {/* // */}

              {/* Expiration */}
              <div className="col-md-12 mt-4">
                <span className="light_heading">Plan Expiration Date</span>
              </div>

              <div className="col-md-12 mt-3 ">
                <Label className="labels">Exp. Date</Label>
                <div >
                  <Calendar />
                </div>
              </div>
              {/* // */}

              {/* Nass */}
              <div className="col-md-12 mt-4">
                <span className="light_heading">Nas</span>
              </div>

              <div className="col-md-12 mt-3">
                <Label className="labels">Nas</Label>
                <div >
                  <SingleSelect placeholder="Select Nas" options={options} />
                </div>
              </div>
              {/* // */}

              {/* ip address */}
              <div className="col-md-12 mt-4">
                <span className="light_heading">IP Address</span>
              </div>

              <div className="col-md-12 mt-4 ">
                <Label className="labels">IP Address</Label>
                <div className="w-100 d-flex">
                  <SingleSelect placeholder="Select IP Address" options={options}/>
                  <div className="ml-2">
                    <button className="BackGroundLight">Unused IP</button>
                  </div>

                </div>
              </div>
            </div>

            {/* // */}

            {/* Simultaneous */}
            <div className="col-md-12 mt-4 p-0">
              <span className="light_heading">Simultaneous Use</span>
            </div>

            <div className="col-md-12 mt-3 p-0 ">
              <Label className="labels">Simultaneous Use *</Label>
              <div >
                <Input bsSize="lg" placeholder='Enter Simultaneous Use' />
              </div>
            </div>
            {/* // */}

            {/* plan group */}
            <div className="col-md-12 mt-4 p-0">
              <span className="light_heading">Plan Group</span>
            </div>

            <div className="col-md-12 mt-3 p-0">
              <Label className="labels">Plan Group</Label>
              <div >
                <SingleSelect placeholder="Select Plan Group" options={options} />
              </div>
            </div>

            {/* // */}

            {/* Extra Attribute */}

            <div className="col-md-12 mt-5 d-flex gap-3 p-0">
              <div className="flex flex-column gap-2 align-items-center">
                <div className="plus">+</div>
                <div className="minus">-</div>
                <div className="minus">-</div>
              </div>
              <div className="flex flex-column gap-2">
                <label className="labels">Attributes</label>
                <div>
                  <SingleSelect placeholder="Select Attribute" options={options} />
                </div>
                <div>
                  <SingleSelect placeholder="Select Attribute" options={options} />
                </div>
              </div>

              <div className="flex flex-column gap-2">
                <label className="labels">Value</label>
                <div>
                  <Input bsSize="lg" placeholder='Enter Value' />
                </div>
                <div>
                  <Input bsSize="lg" placeholder='Enter Value' />
                </div>
              </div>
            </div>
            {/* // */}
          </div>
        </div>
        {/* <div className="flex justify-content-end">
        <button className="btn_primary_btn">Apply</button>
      </div> */}
      </div>
    </>
  )
}

export default Policy