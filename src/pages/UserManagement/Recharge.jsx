import React from 'react'
import SingleSelect from '../../components/commonComponent/singleSelect/SingleSelect'
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Table } from "reactstrap";
import { IoCopyOutline } from "react-icons/io5";

function Recharge() {
  const options = [
    { value: "New York", label: "NY" },
    { value: "Rome", label: "RM" },
    { value: "London", label: "LDN" },
    { value: "Istanbul", label: "IST" },
    { value: "Paris", label: "PRS" },
  ];

  const plansData = [
    {
      planName: '20 MBPS',
      quantity: '0/1',
      amount: '$100',
      status: 'Active',
      rechargeDate: '23/01/22',
      rechargeTime: '10.40 Am',
      type: 'Plan',
      action: 'Option'

    },
    {
      planName: '20 MBPS',
      quantity: '0/1',
      amount: '$100',
      status: 'Expired',
      rechargeDate: '23/01/22',
      rechargeTime: '10.40 Am',
      type: 'Plan',
      action: 'Option'

    },
    {
      planName: '20 MBPS',
      quantity: '0/1',
      amount: '$100',
      status: 'Expired',
      rechargeDate: '23/01/22',
      rechargeTime: '10.40 Am',
      type: 'Plan',
      action: 'Option'

    },
    {
      planName: '20 MBPS',
      quantity: '0/1',
      amount: '$100',
      status: 'Active',
      rechargeDate: '23/01/22',
      rechargeTime: '10.40 Am',
      type: 'Plan',
      action: 'Option'

    },
    {
      planName: '20 MBPS',
      quantity: '0/1',
      amount: '$100',
      status: 'Expired',
      rechargeDate: '23/01/22',
      rechargeTime: '10.40 Am',
      type: 'Plan',
      action: 'Option'

    },
    {
      planName: '20 MBPS',
      quantity: '0/1',
      amount: '$100',
      status: 'Active',
      rechargeDate: '23/01/22',
      rechargeTime: '10.40 Am',
      type: 'Plan',
      action: 'Option'

    },
  ]
  return (
    <>
      <div className='card-container'>
        <div className="flex between align-items-center mt-2">
          <h4>Recharges</h4>
          <div className="flex g-1 center">
            <span className="export">Export</span>
            <div className={`user_setting`}>
              <SingleSelect placeholder={'Select '} options={options} />
            </div>
          </div>
        </div>
        <div className="mt-4 flex between align-items-center">
          <SearchInput />

          <div className={`filter_dropdown`} >
            <SingleSelect placeholder={"filter"} options={options} />
          </div>
        </div>

        <div className="mt-5">
          <Table hover>
            <thead style={{ backgroundColor: "#F5F6FA" }}>
              <tr className='table-heading-size'>
                <th>
                  <input type="checkbox" className="input" />
                </th>
                <th>Plan Name</th>
                <th>Quantity</th>
                <th>Amount</th>

                <th>Recharge Date</th>
                <th>Type</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plansData.map((plan) => (
                <tr key={plan.id}>
                  <th>
                    <input type="checkbox" className="input" />
                  </th>
                  <td>
                    <div className="d-flex">
                      <div className='mr-1'>{plan.planName}</div>
                      <div><IoCopyOutline /></div>
                    </div>
                  </td>
                  <td >{plan.quantity}</td>
                  <td>{plan.amount}</td>


                  <td>
                    <div>
                      <div>{plan.rechargeDate}</div>
                      <div>{plan.rechargeTime}</div>
                    </div>
                  </td>
                  <td>{plan.type}</td>

                  <td>{plan.action}</td>
                  <td style={{ width: '5%' }} >
                    <div
                      className={`statusBg ${plan?.status === "Active"
                          ? "statusActive"
                          : "statusExpire"
                        }`}

                    >
                      {plan?.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

    </>
  )
}

export default Recharge