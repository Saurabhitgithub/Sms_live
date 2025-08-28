import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from "reactstrap";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";

export default function Session() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);
  const [status, setStatus] = useState("Complete Session");
  const [sessionData,setSessionData] = useState([
    {stTime:"24:02:2024 20:58:56",
      mac:"B095.758D.BADF",
      ip:"10.10.10.86",
      downlo:"1.1 GB",
      upload:"420 MB",
      total:"1.52 GB",
      band:"600 mbps",
      upT:"4 hr",
      action:"Terminate"
    },
    {stTime:"24:02:2024 20:58:56",
      mac:"B095.758D.BADF",
      ip:"10.10.10.86",
      downlo:"1.1 GB",
      upload:"420 MB",
      total:"1.52 GB",
      band:"600 mbps",
      upT:"4 hr",
      action:"Terminate"
    },{stTime:"24:02:2024 20:58:56",
      mac:"B095.758D.BADF",
      ip:"10.10.10.86",
      downlo:"1.1 GB",
      upload:"420 MB",
      total:"1.52 GB",
      band:"600 mbps",
      upT:"4 hr",
      action:"Terminate"
    }
  ])

  const statusArr = [
    { value: "Complete", label: "Complete Session", color: "#0046B0" },
    { value: "Active", label: "Active Session", color: "#50AD97" }
  ];

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const sessionChange = status => {
    setStatus(status); // Set the status to the clicked item's label
  };

  return (
    <>
      <div className="mt-md-5 mt-sm-4 mt-3">
        <div className="d-flex justify-content-between">
          <div>
            {/* Conditionally render content based on the selected status */}
            {status === "Complete Session" && <div className="fs-24 fw-500">Completed Session</div>}
            {status === "Active Session" && <div className="fs-24 fw-500">Active Session</div>}
          </div>

          <div className="d-flex justify-content-end">
            <div>
              <div className="dropdown_logs">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle caret className="primary-background text-wrap text-capitalize" type="button">
                    {status || "Select Session"}{" "}
                    <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    {statusArr.map((res, index) => (
                      <DropdownItem
                        key={index}
                        className="text-capitalize"
                        onClick={() => sessionChange(res.label)} // Pass the label to sessionChange
                      >
                        {res.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div className="ml-3">
              {/* <ExportCsv filName={"Session"} /> */}
            </div>
          </div>
        </div>
        <div className="mt-3">
          {status === "Complete Session" && (
            <div>
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Start Time</th>
                      <th>Stop Time</th>
                      <th>Mac Address</th>
                      <th>IP Address</th>
                      <th>Download Bytes</th>
                      <th>Uploads Bytes</th>
                      <th>Total Data</th>
                      <th>Bandwidth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionData.map((res,index)=>{
                      return(
                        <>
                        <tr key={index}>
                          <td>{res?.stTime}</td>
                          <td>{res?.stTime}</td>
                          <td>{res?.mac}</td>
                          <td>{res?.ip}</td>
                          <td>{res?.downlo}</td>
                          <td>{res?.upload}</td>
                          <td>{res?.total}</td>
                          <td>{res?.band}</td>
                        </tr>
                        </>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
          {status === "Active Session" && (
            <div>
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Start Time</th>
                      <th>Up time</th>
                      <th>Mac Address</th>
                      <th>IP Address</th>
                      <th>Download Bytes</th>
                      <th>Uploads Bytes</th>
                      <th>Total Data</th>
                      <th>Bandwidth</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionData.map((res,index)=>{
                      return(
                        <>
                        <tr key={index}>
                          <td>{res?.stTime}</td>
                          <td>{res?.upT}</td>
                          <td>{res?.mac}</td>
                          <td>{res?.ip}</td>
                          <td>{res?.downlo}</td>
                          <td>{res?.upload}</td>
                          <td>{res?.total}</td>
                          <td>{res?.band}</td>
                          <td style={{color:"red"}}>{res?.action}</td>
                        </tr>
                        </>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
