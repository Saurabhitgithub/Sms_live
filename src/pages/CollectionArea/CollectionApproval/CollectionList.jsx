import React, { useEffect, useRef, useState } from "react";
import Content from "../../../layout/content/Content";
import ExportCsv from "../../../components/commonComponent/ExportButton/ExportCsv";
import SearchInput from "../../../components/commonComponent/searchInput/SearchInput";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from "reactstrap";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { changeCollectionStatus, getallCollectionInfoArea } from "../../../service/admin";
import moment from "moment";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../../assets/images/jsTree/PdfLogo.png";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { permisionsTab } from "../../../assets/userLoginInfo";
import Error403 from "../../../components/error/error403";

export default function CollectionList() {
  const [TableData, setTableData] = useState([]);
  const [allTableData, setAllTableData] = useState([]);
  const [loader, setLoader] = useState(true);

  const [exportData, setExportData] = useState([]);
  const [allexportData, setAllExportData] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

   const [leadPermission, setLeadPermission] = useState([]);
        const [permissionAccess, setPermissionAccess] = useState(true);
        async function permissionFunction() {
          const res = await permisionsTab();
          
      
          const permissions = res.filter((s) => s.tab_name === "Payment Collection");
          if (permissions.length !== 0) {
            setPermissionAccess(permissions[0]?.is_show);
            let permissionArr = permissions[0]?.tab_function
              ?.filter((s) => s.is_showFunction === true)
              .map((e) => e.tab_functionName);
            setLeadPermission(permissionArr);
          }
        }

  const getcollectioninfo = async () => {
    setLoader(true);
    try {
      let response = await getallCollectionInfoArea().then(res => {
        return res.data.data;
      });
      
      let exportinfo = response?.map(res => {
        return {
          "Created On": moment(res?.createdAt).format("DD MMM YYYY"),
          "User Name": res?.subscriberInfo[0]?.userName,
          Name: res?.subscriberInfo[0]?.full_name,
          "Phone Number": res?.subscriberInfo[0]?.mobile_number,
          Email: res?.subscriberInfo[0]?.email,
          "Installation Address": `${res?.subscriberInfo[0]?.installation_address?.flat_number},${res?.subscriberInfo[0]?.installation_address?.city},${res?.subscriberInfo[0]?.installation_address?.state}-${res?.subscriberInfo[0]?.installation_address?.pin_code}`,

          "Billing Address": `${res?.subscriberInfo[0]?.billing_address?.flat_number},${res?.subscriberInfo[0]?.billing_address?.city},${res?.subscriberInfo[0]?.billing_address?.state}-${res?.subscriberInfo[0]?.billing_address?.pin_code}`,
          "Amount Collected": res?.amount,
          Admin: "",
          "Collection status": res?.collection_status
        };
      });
      setTableData(response);
      setExportData(exportinfo);
      setAllExportData(exportinfo);
     await permissionFunction()
      setAllTableData(response);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };
  const collectionStatus = async (id, status) => {
    setLoader(true)
    try {
      let payload = { id: id, status: status };
      await changeCollectionStatus(payload);
      getcollectioninfo();
      setLoader(false)
    } catch (err) {
      console.log(err);
      setLoader(false)
    }
  };
  const searchInfo = async text => {
    try {
      
      if (text && text.length !== 0) {
        let lowerCaseText = text.toLowerCase();

        let searchTable = allTableData.filter(res => {
          return (
            (res?.subscriberInfo[0]?.userName &&
              res.subscriberInfo[0].userName.toLowerCase().includes(lowerCaseText)) ||
            (res?.subscriberInfo[0]?.full_name &&
              res.subscriberInfo[0].full_name.toLowerCase().includes(lowerCaseText)) ||
            (res?.subscriberInfo[0]?.mobile_number &&
              res.subscriberInfo[0].mobile_number
                .toString()
                .toLowerCase()
                .includes(lowerCaseText)) ||
            (res?.subscriberInfo[0]?.email && res.subscriberInfo[0].email.toLowerCase().includes(lowerCaseText)) ||
            (res?.amount &&
              res.amount
                .toString()
                .toLowerCase()
                .includes(lowerCaseText)) ||
            (res?.collection_status && res.collection_status.toLowerCase().includes(lowerCaseText))
          );
        });

        let searchExport = allexportData.filter(res => {
          return (
            (res["User Name"] && res["User Name"].toLowerCase().includes(lowerCaseText)) ||
            (res["Name"] && res["Name"].toLowerCase().includes(lowerCaseText)) ||
            (res["Phone Number"] &&
              res["Phone Number"]
                .toString()
                .toLowerCase()
                .includes(lowerCaseText)) ||
            (res["Email"] && res["Email"].toLowerCase().includes(lowerCaseText)) ||
            (res["Amount Collected"] &&
              res["Amount Collected"]
                .toString()
                .toLowerCase()
                .includes(lowerCaseText)) ||
            (res["Collection status"] && res["Collection status"].toLowerCase().includes(lowerCaseText))
          );
        });

        setTableData(searchTable);
        setExportData(searchExport);
      } else {
        setTableData(allTableData);
        setExportData(allexportData);
      }
    } catch (err) {
      console.log(err);
    }
  };

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

    pdf.save("Collection Approval.pdf");
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

  useEffect(() => {
    getcollectioninfo();
  }, []);
  return (
    <>
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
                <h3>Collection Approval</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Created On</th>
                      <th>User Name</th>
                      <th>Name</th>
                      {/* <th>Last Name</th> */}
                      <th>Phone Number</th>
                      <th>Email</th>
                      <th>Installation Address</th>
                      <th>Billing Address</th>
                      <th>Amount Collected</th>
                      <th>Admin</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {TableData.map((res, index) => {
                      return (
                        <tr>
                          <td>{moment(res?.createdAt).format("DD MMM YYYY")}</td>
                          <td>{res?.subscriberInfo[0]?.userName}</td>
                          <td>{res?.subscriberInfo[0]?.full_name}</td>
                          {/* <td>{res?.ln}</td> */}
                          <td>{res?.subscriberInfo[0]?.mobile_number}</td>
                          <td>{res?.subscriberInfo[0]?.email}</td>
                          <td>{`${res?.subscriberInfo[0]?.installation_address?.flat_number},${res?.subscriberInfo[0]?.installation_address?.city},${res?.subscriberInfo[0]?.installation_address?.state}-${res?.subscriberInfo[0]?.installation_address?.pin_code}`}</td>
                          <td>{`${res?.subscriberInfo[0]?.billing_address?.flat_number},${res?.subscriberInfo[0]?.billing_address?.city},${res?.subscriberInfo[0]?.billing_address?.state}-${res?.subscriberInfo[0]?.billing_address?.pin_code}`}</td>
                          <td>{res?.amount}</td>
                          <td>{res?.ad}</td>
                          
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
            </div>
          </div>
        </div>
        {loader ? (
          <>
            <div className="table-container mt-5">
              <TableSkeleton columns={5} />
            </div>
          </>
        ) : (
          <>
          {permissionAccess && leadPermission.includes("Collection Approval Tab") ? (<>
            <div className="card_container p-md-4 p-sm-3 p-3">
              <div className="topContainer">
                <div className="f-28">Collection Approval</div>
                <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                  <div className="ml-3">
                    {/* <ExportCsv filName={"Collection Approval List"} exportData={exportData} /> */}
              <div className="dropdown_logs ">

                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportData} filName={"Collection Approval"} />
                        </DropdownItem>
                        <DropdownItem>
                          {" "}
                          <div onClick={convertToImg}>PDF</div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <SearchInput placeholder={"Enter Name "} onChange={e => searchInfo(e.target.value.trim())} />
              </div>
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Created On</th>
                      <th>User Name</th>
                      <th>Name</th>
                      {/* <th>Last Name</th> */}
                      <th>Phone Number</th>
                      <th>Email</th>
                      <th>Installation Address</th>
                      <th>Billing Address</th>
                      <th>Amount Collected</th>
                      <th>Admin</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TableData.map((res, index) => {
                      return (
                        <tr>
                          <td>{moment(res?.createdAt).format("DD MMM YYYY")}</td>
                          <td>{res?.subscriberInfo[0]?.userName}</td>
                          <td>{res?.subscriberInfo[0]?.full_name}</td>
                          {/* <td>{res?.ln}</td> */}
                          <td>{res?.subscriberInfo[0]?.mobile_number}</td>
                          <td>{res?.subscriberInfo[0]?.email}</td>
                          <td>{`${res?.subscriberInfo[0]?.installation_address?.flat_number},${res?.subscriberInfo[0]?.installation_address?.city},${res?.subscriberInfo[0]?.installation_address?.state}-${res?.subscriberInfo[0]?.installation_address?.pin_code}`}</td>
                          <td>{`${res?.subscriberInfo[0]?.billing_address?.flat_number},${res?.subscriberInfo[0]?.billing_address?.city},${res?.subscriberInfo[0]?.billing_address?.state}-${res?.subscriberInfo[0]?.billing_address?.pin_code}`}</td>
                          <td>{res?.amount}</td>
                          <td>{res?.ad}</td>
                          <td style={{ width: "5%" }}>
                            <div className="d-flex">
                              {res?.collection_status === "pending" ? (
                                <>
                                  <IoCheckmarkCircleOutline
                                    className="pointer"
                                    onClick={() => collectionStatus(res._id, "accept")}
                                  />
                                  <RxCrossCircled
                                    className="ml-3 pointer"
                                    onClick={() => collectionStatus(res._id, "reject")}
                                  />
                                </>
                              ) : (
                                <>{res?.collection_status === "accept" ? <>Accept</> : <>Reject</>}</>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </>):(<>
            <Error403 />
          </>)}
            
          </>
        )}
      </Content>
    </>
  );
}
