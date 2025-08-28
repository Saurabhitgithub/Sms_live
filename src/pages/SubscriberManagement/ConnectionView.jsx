import React from 'react'
import { BorderedTable } from "../../components/commonComponent/Bordertable/BorderedTable";
import { Table } from 'reactstrap';

function ConnectionView() {
  const plansData = [
    {
      id: 1,
      start_time:'22 Hr 16 Mins',
      mac_address:'00:E0:Ea:ww',
      nas_ip:'00:E0:Ea:ww',
      status:'successful',
      password:'abcd_1234'
    },
    {
      id: 1,
      start_time:'22 Hr 16 Mins',
      mac_address:'00:E0:Ea:ww',
      nas_ip:'00:E0:Ea:ww',
      status:'successful',
      password:'abcd_1234'
    },
    {
      id: 1,
      start_time:'22 Hr 16 Mins',
      mac_address:'00:E0:Ea:ww',
      nas_ip:'00:E0:Ea:ww',
      status:'Unsuccessful',
      password:'abcd_1234'
    },
    {
      id: 1,
      start_time:'22 Hr 16 Mins',
      mac_address:'00:E0:Ea:ww',
      nas_ip:'00:E0:Ea:ww',
      status:'successful',
      password:'abcd_1234'
    },
  ];
  return (
    <>
    <div className="mt-md-5 mt-sm-4 mt-4">
          <div className='table-container'>
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Start Time</th>
                  <th>Mac-Address</th>
                  <th>NAS IP</th>
                  <th>Status</th>
                  <th>Password</th>
                  
                </tr>
              </thead>
              <tbody>
                {plansData.map((plan) => (
                  <tr key={plan.id}>
                    <td >{plan.start_time}</td>
                    <td>{plan.mac_address}</td>
                    <td>{plan.nas_ip}</td>
                   

                    <td style={{width:'1%'}}>
                      <div className={`statusBg ${plan?.status === "successful" ? "statusActive" : "statusExpire"}`}>
                        {plan?.status}
                      </div>
                    </td>
                    <td>{plan.password}</td>
                  
                  </tr>
                ))}
              </tbody>

           

           

            </Table>
          </div>
        </div>

    </>
  )
}

export default ConnectionView