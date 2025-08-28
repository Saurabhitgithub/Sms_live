import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from "reactstrap";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import CreateFranchiseeConfiguration from "./CreateFranchiseeConfiguration";
import { deleteFranchiseeById, getAllDataByOrg, getPlanByCreator } from "../../service/admin";
import { permisionsTab, userId, userInfo } from "../../assets/userLoginInfo";
import moment from "moment";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import Error403 from "../../components/error/error403";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";


export default function FranchiseeConfiguration() {
  const [tableData, setTableData] = useState([]);
  const [skeleton, setSkeleton] = useState(true);
  const [exportData, setExportData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [franchiseePermission, setFranchiseePermission] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter((s) => s.tab_name === "Franchisee");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0].is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
      setFranchiseePermission(permissionArr);
    }
  }
  const GetAllDataFunction = async () => {
    setSkeleton(true)
    try {
      await permissionFunction();

      let resonpse = await getAllDataByOrg(userId())
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      let getAllplans = await getPlanByCreator().then((res) => {
        return res.data.data;
      });
      setAllPlanData(getAllplans)
      setTableData(resonpse.reverse());
      setAllData(resonpse.reverse());
      setExportData(
        resonpse.reverse().map((res) => {
          return {
            Name: res.name,
            LCO: res.lcoName,
            Email: res.email,
            "Mobile Number": res.mobileNumber.toString(),
            "No. of Plans": res?.assignsPlan ? res?.assignsPlan?.length : 0,
            "Revenue Sharing": `${res.revenueShare}%`,
            "Sharing Total Users": res.users.length,
            "Created On": moment(res.createdAt).format("DD MMM YYYY").toString(),
          };
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setSkeleton(false);
    }
  };
  const deleteDataFunction = async (id) => {
    try {
      setSkeleton(true);

      let resonpse = await deleteFranchiseeById({
        user_role: userInfo().role,
        user_id: userId(),
        user_name: userInfo().name,
        id: id,
      }).catch((err) => {
        console.log(err);
      });

      await GetAllDataFunction();
      dispatch(
        success({
          show: true,
          msg: "Franchisee Deleted successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
  const searchData = (text) => {
    if (text?.length !== 0) {
      let responsedata = allData.filter((es) => {
        if (
          es.name.toLowerCase().includes(text) ||
          es.lcoName.toLowerCase().includes(text) ||
          es.email.toLowerCase().includes(text) ||
          es.mobileNumber.includes(text)
        ) {
          return true;
        } else {
          return false;
        }
      });
      setTableData(responsedata);
    } else {
      setTableData(allData);
    }
  };
  const [open, setOpen] = useState({ mode: "", status: false, data: {} });
  useEffect(() => {
    GetAllDataFunction();
  }, []);
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

    pdf.save("Franchisee Configuration.pdf");
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
    <>
      <Content>
      <div style={{ width: "1000px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden",
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
            <h3>Franchisee Configuration</h3>

              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>
            <Table hover>
                        <thead style={{ backgroundColor: "#F5F6FA" }}>
                          <tr className="table-heading-size">
                            <th>Name</th>
                            <th>LCO</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                            <th>No. of Plans</th>
                            <th>Revenue Sharing</th>
                            <th>Total Users</th>
                            <th>Created On</th>
                           
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((res) => {
                            return (
                              <tr>
                                <td>{res?.name}</td>
                                <td>{res?.lcoName}</td>
                                <td>{res?.email}</td>
                                <td>{res?.mobileNumber}</td>
                                <td>{res?.assignsPlan ? res?.assignsPlan?.length : 0}</td>
                                <td>{res?.revenueShare}%</td>
                                <td>{res?.users?.length}</td>
                                <td>{moment(res?.createdAt).format("DD MMM YYYY")}</td>
                                
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
          </div>
        </div>
      </div>
        {skeleton ? (
          <>
            <TableSkeleton columns={5} />
          </>
        ) : (
          <>
            {permissionAccess && franchiseePermission.includes("Franchisee Configuration Tab") ? (
              <>
                <div className="card_container p-md-4 p-sm-3 p-3">
                  <div className="topContainer">
                    <div className="f-28">Franchisee Configuration</div>
                    <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                      {franchiseePermission.includes("Export Csv (Franchisee Configuration)") && (
                        <>
                          <div>
                            {/* <ExportCsv exportData={exportData} filName={"Franchisee Configuration Table"} /> */}
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
                                  <ExportCsv exportData={exportData} filName={"Franchisee Configuration"} />
                                </DropdownItem>
                                <DropdownItem> <div onClick={convertToImg}>PDF</div></DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                            </div>
                          </div>
                          <div className="line ml-2 mr-2"></div>
                        </>
                      )}
                      {franchiseePermission.includes("Add Franchisee (Franchisee Configuration)") && (
                        <>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setOpen({ mode: "add", status: true, data: {} });
                              
                            }}
                          >
                            Create Franchisee
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-8 col-12">
                      <SearchInput placeholder={"Enter Name"} onChange={(e) => searchData(e.target.value)} />
                    </div>
                  </div>
                  <div className="table-container mt-5">
                    <>
                      <Table hover>
                        <thead style={{ backgroundColor: "#F5F6FA" }}>
                          <tr className="table-heading-size">
                            <th>Name</th>
                            <th>LCO</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                            <th>No. of Plans</th>
                            <th>Revenue Sharing</th>
                            <th>Total Users</th>
                            <th>Created On</th>
                            {(franchiseePermission.includes("Edit Franchisee (Franchisee Configuration)") ||
                              franchiseePermission.includes("Delete Franchisee (Franchisee Configuration)")) && (
                                <>
                                  {" "}
                                  <th>Action</th>
                                </>
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((res) => {
                            return (
                              <tr>
                                <td>{res?.name}</td>
                                <td>{res?.lcoName}</td>
                                <td>{res?.email}</td>
                                <td>{res?.mobileNumber}</td>
                                <td>{res?.assignsPlan ? res?.assignsPlan?.length : 0}</td>
                                <td>{res?.revenueShare}%</td>
                                <td>{res?.users?.length}</td>
                                <td>{moment(res?.createdAt).format("DD MMM YYYY")}</td>
                                {(franchiseePermission.includes("Edit Franchisee (Franchisee Configuration)") ||
                                  franchiseePermission.includes("Delete Franchisee (Franchisee Configuration)")) && (
                                    <>
                                      {" "}
                                      <td>
                                        <div className="d-flex align-items-center">
                                          {franchiseePermission?.includes(
                                            "Edit Franchisee (Franchisee Configuration)"
                                          ) && (
                                              <>
                                                {" "}
                                                <FiEdit
                                                  className="f-20 pointer parimary-color mr-2"
                                                  color="#0E1073"
                                                  onClick={() => {
                                                    setOpen({ mode: "edit", status: true, data: res });
                                                    
                                                  }}
                                                />
                                              </>
                                            )}

                                          {franchiseePermission?.includes(
                                            "Delete Franchisee (Franchisee Configuration)"
                                          ) && (
                                              <>
                                                <BsTrash
                                                  className="f-20 fw-500 pointer parimary-color"
                                                  color="#0E1073"
                                                  onClick={() => deleteDataFunction(res._id)}
                                                />
                                              </>
                                            )}
                                        </div>
                                      </td>
                                    </>
                                  )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </>
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
      </Content>
      <CreateFranchiseeConfiguration
        open={open.status}
        setOpen={setOpen}
        mode={open.mode}
        editData={open.data}
        GetAllDataFunction={GetAllDataFunction}
        allPlanData={allPlanData} />
    </>
  );
}
