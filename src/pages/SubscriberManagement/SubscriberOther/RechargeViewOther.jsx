import moment from 'moment';
import React from 'react'
import { Table } from 'reactstrap';


function RechargeViewOther({ planData,allPlans }) {


  function getPlansInfo(data){
    let arr = [...allPlans]
    let obj = {}
    if(arr.length > 0){
      obj = arr?.find(res=>res._id == data?.plan)
      // 
    }

    return {...obj,...data}
  }
 
  // 

  return (
    <>
      <div className="mt-5">
        <div className='table-container'>
          <Table hover responsive>
            <thead style={{ backgroundColor: "#F5F6FA" }}>
              <tr className="table-heading-size">
                <th>Plan Name</th>
                <th>Data</th>
                <th>Recharge Amount</th>
                <th>Recharge Date</th>
                <th>Validity</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {planData?.plan_history?.map((res) => {
                let plan = getPlansInfo(res)
                return (
                  <tr key={plan?.id}>
                    <td>{plan?.plan_name}</td>
                    <td>{plan?.type}</td>
                    <td>{plan?.amount}</td>
                    <td>{moment(plan?.start_date).format('DD MMM YYYY')}</td>
                    <td>{plan?.billingCycleDate} {plan?.billingCycleType}</td>
                    <td>{moment(plan?.end_date).format('DD MMM YYYY')}</td>
  
                    <td >
                      <div className={`${plan?.active_status ? "statusActive" : "statusExpire"}`}>
                      Successful
                      </div>
                    </td>
  
                  </tr>
                )
              })}
            </tbody>





          </Table>
        </div>
      </div>
    </>
  )
}

export default RechargeViewOther