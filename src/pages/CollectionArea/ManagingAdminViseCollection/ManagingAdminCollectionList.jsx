import React, { useState } from 'react'
import Content from '../../../layout/content/Content'
import ExportCsv from '../../../components/commonComponent/ExportButton/ExportCsv'
import SearchInput from '../../../components/commonComponent/searchInput/SearchInput'
import { Table } from 'reactstrap'

export default function ManagingAdminCollectionList() {
  const [TableData,setTableData] = useState([
    {c:"24 June 2024",
      u:"Admin 1",
      fn:"Varun",
      ln:"Saxena",
      pn:"9090909090",
      em:"asd@gmail.com",
      iadd:"Pandav Nagar",
      bAdd:"PandavNagar",
      ac:"99992",
      ad:"Admin 1",
      ar:"Area 1"

    },
    {c:"24 June 2024",
      u:"Admin 2",
      fn:"Varun",
      ln:"Saxena",
      pn:"9090909090",
      em:"asd@gmail.com",
      iadd:"Pandav Nagar",
      bAdd:"PandavNagar",
      ac:"99992",
      ad:"Admin 1",
      ar:"Area 1"
      
    },
    {c:"24 June 2024",
      u:"Admin 3",
      fn:"Varun",
      ln:"Saxena",
      pn:"9090909090",
      em:"asd@gmail.com",
      iadd:"Pandav Nagar",
      bAdd:"PandavNagar",
      ac:"99992",
      ad:"Admin 1",
      ar:"Area 1"

    }
  ])
  return (
    <>
       <Content>
        <div className="card_container p-md-4 p-sm-3 p-1">
          <div className="topContainer">
            <div className="f-28">Admin Wise Collection</div>
            <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
              <div className="ml-3">
                <ExportCsv filName={"Collection List"} />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <SearchInput placeholder={"Enter Name "} />
          </div>
          <div className="table-container mt-5">
            <Table hover>
            <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Created On</th>
                  <th>Admin</th>
                  <th>Area</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Installation Address</th>
                  <th>Billing Address</th>
                  <th>Amount Collected</th>
                  <th>Admin</th>
                  
                </tr>
              </thead>
              <tbody>
                {TableData.map((res,index)=>{
                  return(
                    <tr>
                      <td>{res?.c}</td>
                      <td>{res?.u}</td>
                      <td>{res?.ar}</td>
                      <td>{res?.fn}</td>
                      <td>{res?.ln}</td>
                      <td>{res?.pn}</td>
                      <td>{res?.em}</td>
                      <td>{res?.iadd}</td>
                      <td>{res?.bAdd}</td>
                      <td>{res?.ac}</td>
                      <td>{res?.ad}</td>
                      
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </Content>
    </>
  )
}
