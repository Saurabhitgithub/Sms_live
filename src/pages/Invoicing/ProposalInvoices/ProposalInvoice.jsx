import React, { useEffect, useRef, useState } from "react";

import SearchInput from "../../../components/commonComponent/searchInput/SearchInput";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from "reactstrap";
import Content from "../../../layout/content/Content";
import ProposalModal from "./ProposalModal";
import { PaginationComponent } from "../../../components/Component";
import { convertStatusPropsal, getAllPropsal } from "../../../service/admin";
import { exportCsv } from "../../../assets/commonFunction";
import moment from "moment";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { permisionsTab, userInfo } from "../../../assets/userLoginInfo";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";
import Error403 from "../../../components/error/error403";
import { paginateData } from "../../../utils/Utils";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../../assets/images/jsTree/PdfLogo.png";
import ExportCsv from "../../../components/commonComponent/ExportButton/ExportCsv";

const ProposalInvoice = () => {
  const proposalData = [
    {
      Invoice_No: "123456",
      Created_On: "12 June 2024",
      Name: "Shubham",
      Phone_no: "9876543210",
      Email_ID: "abc@gmail.com",
      Plan_Name: "Gold",
      Amount: "Rs 99999.00",
      Created_By: "admin_01",
      Status: "Pending"
    },
    {
      Invoice_No: "123456",
      Created_On: "12 June 2024",
      Name: "Shubham",
      Phone_no: "9876543210",
      Email_ID: "abc@gmail.com",
      Plan_Name: "Gold",
      Amount: "Rs 99999.00",
      Created_By: "admin_01",
      Status: "Pending"
    },
    {
      Invoice_No: "123456",
      Created_On: "12 June 2024",
      Name: "Shubham",
      Phone_no: "9876543210",
      Email_ID: "abc@gmail.com",
      Plan_Name: "Gold",
      Amount: "Rs 99999.00",
      Created_By: "admin_01",
      Status: "Pending"
    }
  ];

  let [page, setPage] = useState(1);
  let [proposalList, setProposalList] = useState([]);
  let [allProposalList, setAllProposalList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [perposalPermission, setPerposalPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };
  async function permissionFunction() {
    const res = await permisionsTab();

    const permissions = res.filter(s => s.tab_name === "Invoices");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setPerposalPermission(permissionArr);
    }
  }
  let itemPerPage = 8;
  const [ViewOpen, setViewOpen] = useState({ status: false });

  const changeStatus = async (id, status) => {
    try {
      setLoader(true);
      await convertStatusPropsal({
        id: id,
        status: status,
        user_name: userInfo().name,
        user_role: userInfo().role
      });
    } catch (err) {
      console.log(err);
    } finally {
      await getallData();
    }
  };

  const getallData = async () => {
    setLoader(true);
    try {
      permissionFunction();
      let Payload;
      if (userInfo().role === "isp admin" || userInfo().role === "admin") {
        Payload = {
          org_id: userInfo()._id
        };
      } else {
        Payload = {
          org_id: userInfo().org_id,
          isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
        };
      }
      let response = await getAllPropsal(Payload).then(res => {
        setLoader(false);
        return res.data.data;
      });
      
      let reverse = response.reverse().map(ree=>{
    let info = ree
        if (info?.subscribersInfo?.email) {
          info.leadsInfo = info.subscribersInfo;
        }
        return info
      });
     
      let ddd = paginateData(page, itemPerPage, reverse);
      setProposalList(ddd);
      
      setAllProposalList(reverse);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };
  const exportData = () => {
    let data = proposalList.map(item => {
      return {
        Invoice_No: item?.invoice_no,
        Created_On: item?.Created_On,
        Name: item.leadsInfo?.full_name,
        Phone_no: item.leadsInfo?.mobile_number,
        Email_ID: item.leadsInfo?.email,
        Plan_Name: item.planInfo?.plan_name,
        Amount: item.invoice_table?.total_amount,
        Created_By:
          item.ispsMemberInfo.length !== 0
            ? `${item.ispsMemberInfo[0].name} (${item.ispsMemberInfo[0].role})`
            : `${item.AdminInfo.admin_name} (${item.AdminInfo.role})`,
        Status: item.propsal_status
      };
    });
    return data;
  };
  function searchData(text) {
    if (text) {
      if (text.length !== 0) {
        let search = allProposalList.filter(res => {
          if (
            res?.invoice_no?.includes(text) ||
            res?.leadsInfo?.full_name?.includes(text) ||
            res?.leadsInfo?.mobile_number?.toString().includes(text) ||
            res?.leadsInfo?.email?.includes(text) ||
            res?.invoice_table?.total_amount?.toString().includes(text) ||
            res?.planInfo?.plan_name?.includes(text) ||
            res?.propsal_status?.includes(text)
          ) {
            return true;
          } else {
            return false;
          }
        });
        setProposalList(search);
      } else {
        setProposalList(allProposalList);
      }
    } else {
      setProposalList(allProposalList);
    }
  }
  function filterProposal(status) {
    if (status === "All") {
      setProposalList(allProposalList);
    } else {
      let filteredData = allProposalList.filter(item => item.propsal_status === status);

      setProposalList(filteredData);
    }
  }
  useEffect(() => {
    getallData();
  }, []);
  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allProposalList);
    setProposalList(ddd);
  }, [page]);
  let optionData = [
    {
      value: "pending",
      label: "Pending"
    },
    {
      value: "accept",
      label: "Accept"
    },
    {
      value: "decline",
      label: "Decline"
    }
  ];

  const inVoiceRef1 = useRef(null);

  async function convertToImg() {
    // setLoader(true);
    let arr = [inVoiceRef1.current];
    let photoArr = [];
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let index = 0; index < arr.length; index++) {
      const res = arr[index];
      await htmlToImage
        .toPng(res, { quality: 0.5 }) // Reduced quality to 0.5
        .then(function(dataUrl) {
          photoArr.push(dataUrl);
          const imgProps = pdf.getImageProperties(dataUrl);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // Scale image to fit within PDF dimensions
          const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
          const scaledWidth = imgProps.width * scaleFactor;
          const scaledHeight = imgProps.height * scaleFactor;

          pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST"); // Added compression option
          if (index !== arr.length - 1) {
            pdf.addPage();
          }
        })
        .catch(function(error) {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (index === arr.length - 1) {
            // setLoader(false);
          }
        });
    }

    pdf.save("Proposal.pdf");
  }
  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      // background: "linear-gradient(251.07deg, #FFFFFF 35.06%, #E8F9FA 95.96%)",
      // margin:'0 auto'
      background: "white"
    }
  };
  return (
    <Content>
      <div style={{ width: "1000px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3>Proposal</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Proposal No.</th>
                  <th>Created On</th>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Email ID</th>
                  <th>Plan Name</th>
                  <th>Amount</th>
                  <th>Created By</th>
                  <th>Payment Status</th>
                  <th>Viewed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {proposalList.map((item, index) => (
                  <tr key={index} className={perposalPermission.includes("Change Proposal Status") ? "pointer" : ""}>
                    <td
                      onClick={() => {
                        if (perposalPermission.includes("Change Proposal Status"))
                          setViewOpen({ status: true, data: item });
                      }}
                    >
                      {item.invoice_no}
                    </td>
                    <td>{moment(item?.createdAt).format("DD-MM-YYYY")}</td>
                    <td>{item?.leadsInfo?.full_name}</td>
                    <td>{item?.leadsInfo?.mobile_number}</td>
                    <td title={item?.leadsInfo?.email} class="email-cell">
                      {item?.leadsInfo?.email.split("@")[0].slice(0, 10)}...
                    </td>
                    <td>{item?.planInfo?.plan_name ? item?.planInfo?.plan_name : "---"}</td>
                    <td>Rs. {item?.grand_total ? item?.grand_total.toFixed(2) : "---"}</td>
                    <td>
                      {item.ispsMemberInfo.length !== 0
                        ? `${item.ispsMemberInfo[0].name} (${item.ispsMemberInfo[0].role})`
                        : `${item.AdminInfo.admin_name} (${item.AdminInfo.role})`}
                    </td>
                    <td>{item?.proposal_seen ? "Seen" : "Unseen"}</td>
                    <td>{item?.payment_done ? "Done" : "Pending"}</td>
                    <td className="style_change_select" style={{ width: "200px" }}>
                      {perposalPermission.includes("Change Proposal Status") ? (
                        <>
                          <SingleSelect
                            placeItem="status"
                            options={optionData}
                            value={item?.propsal_status}
                            onChange={e => {
                              changeStatus(item._id, e.target.value);
                            }}
                          />
                        </>
                      ) : (
                        <>{optionData.find(es => es.value === item?.propsal_status)?.label}</>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {loader ? (
        <>
          <TableSkeleton columns={7} />
        </>
      ) : (
        <>
          {permissionAccess ? (
            <>
              <div className="card_container p-md-4 p-sm-3 p-2 user_section">
                <div className="topContainer">
                  <div className="w-100 f-28">Proposal</div>
                  <div
                    className={`d-flex align-items-center w-100 justify-content-md-end justify-content-sm-end justify-content-start`}
                  >
                    {perposalPermission.includes("Export Proposal") && (
                      <>
                        {/* <button
                          className="btn btn-primary mt-md-0 mt-sm-0 mt-2"
                          type="button"
                          onClick={() => exportCsv(exportData(), "proposal_Invoice_List")}
                        >
                          Export
                        </button> */}
                        <div className="dropdown_logs ">
                          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle
                              caret
                              className="parimary-background text-wrap text-capitalize"
                              type="button"
                            >
                              Export
                              <span className="ml-2">
                                {icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}{" "}
                              </span>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem>
                                <ExportCsv exportData={exportData()} filName={"Proposal"} />
                              </DropdownItem>
                              <DropdownItem>
                                {" "}
                                <div onClick={convertToImg}>Export PDF</div>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="d-flex flex-wrap align-items-center justify-content-between mt-md-5 mt-sm-5 mt-4">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-6 mb-md-0 p-0 ">
                    <SearchInput
                      placeholder={"Enter invoiceNo,customer name.. "}
                      onChange={e => searchData(e.target.value)}
                    />
                  </div>
                  <div className="mt-md-0 mt-sm-0 mt-2">
                    <select className="btn border" onChange={e => filterProposal(e.target.value)}>
                      <option value="All">All</option>
                      <option value="accept">Accept</option>
                      <option value="decline">Decline</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="table-container mt-5">
                  <Table hover>
                    <thead style={{ backgroundColor: "#F5F6FA" }}>
                      <tr className="table-heading-size">
                        <th>Proposal No.</th>
                        <th>Created On</th>
                        <th>Name</th>
                        <th>Phone No</th>
                        <th>Email ID</th>
                        <th>Plan Name</th>
                        <th>Amount</th>
                        <th>Created By</th>
                        <th>Payment Status</th>
                        <th>Viewed</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposalList.map((item, index) => (
                        <tr
                          key={index}
                          className={perposalPermission.includes("Change Proposal Status") ? "pointer" : ""}
                        >
                          <td
                            onClick={() => {
                              if (perposalPermission.includes("Change Proposal Status"))
                                setViewOpen({ status: true, data: item });
                            }}
                          >
                            {item.invoice_no}
                          </td>
                          <td>{moment(item?.createdAt).format("DD-MM-YYYY")}</td>
                          <td>{item?.leadsInfo?.full_name}</td>
                          <td>{item?.leadsInfo?.mobile_number}</td>
                          <td title={item?.leadsInfo?.email} class="email-cell">
                            {item?.leadsInfo?.email.split("@")[0].slice(0, 10)}...
                          </td>
                          <td>{item?.planInfo?.plan_name ? item?.planInfo?.plan_name : "---"}</td>
                          <td>Rs. {item?.grand_total ? item?.grand_total.toFixed(2) : "---"}</td>
                          <td>
                            {item.ispsMemberInfo.length !== 0
                              ? `${item.ispsMemberInfo[0].name} (${item.ispsMemberInfo[0].role})`
                              : `${item.AdminInfo.admin_name} (${item.AdminInfo.role})`}
                          </td>
                          <td>{item?.payment_done ? "Done" : "Pending"}</td>
                          <td>{item?.proposal_seen ? "Seen" : "Unseen"}</td>

                          <td className="style_change_select" style={{ width: "200px" }}>
                            {perposalPermission.includes("Change Proposal Status") ? (
                              <>
                                <SingleSelect
                                  placeItem="status"
                                  options={optionData}
                                  value={item?.propsal_status}
                                  onChange={e => {
                                    changeStatus(item._id, e.target.value);
                                  }}
                                />
                              </>
                            ) : (
                              <>{optionData.find(es => es.value === item?.propsal_status)?.label}</>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div class="d-flex justify-content-center mt-3">
                  <PaginationComponent
                    currentPage={page}
                    itemPerPage={itemPerPage}
                    paginate={d => {
                      setPage(d);
                    }}
                    totalItems={allProposalList?.length}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <Error403 />
            </>
          )}
        </>
      )}
      <ProposalModal ViewOpen={ViewOpen} setViewOpen={setViewOpen} />
    </Content>
  );
};

export default ProposalInvoice;
