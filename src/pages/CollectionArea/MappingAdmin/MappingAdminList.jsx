import React, { useEffect, useRef, useState } from "react";
import Content from "../../../layout/content/Content";
import ExportCsv from "../../../components/commonComponent/ExportButton/ExportCsv";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Table
} from "reactstrap";
import SearchInput from "../../../components/commonComponent/searchInput/SearchInput";
import { CiSquarePlus } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { getDefineAreaofCollection, addMappingAdmin, getAllUserbyIspId } from "../../../service/admin";
import { paginateData } from "../../../utils/Utils";
import { permisionsTab, userId, userInfo } from "../../../assets/userLoginInfo";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";
import { PaginationComponent, RSelect } from "../../../components/Component";
import { useDispatch } from "react-redux";
import { success } from "../../../Store/Slices/SnackbarSlice";
import ViewMappingAdmin from "./ViewMappingAdmin";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../../assets/images/jsTree/PdfLogo.png";
import Error403 from "../../../components/error/error403";


export default function MappingAdminList() {
  const [modal, setModal] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [errorImport, setErrorImport] = useState([]);
  const [fileErr, setFileErr] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(true);
  const [requiredType, setRequiredType] = useState("");
  const [valid, setValid] = useState(false);

  const [exportData, setExportData] = useState([]);
  const [resId, setresId] = useState("");
  const [userData, setUserData] = useState([]);
  const [selectUser, setSelectuser] = useState("");

  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();

  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [resEditData, setResEditData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

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

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const toggle = () => {
    setModal(false);
  };
  const toggle1 = () => {
    setVisible(false);
  };

  let orGId = userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id;

  const getDataMapping = async () => {
    setLoader(true);
    try {
      let res = await getDefineAreaofCollection();
      let reverseData = res?.data?.data?.reverse();
      
      setAllPlan(reverseData);
      setAllPlanData(reverseData);
     await permissionFunction()
      const datas = paginateData(page, itemPerPage, reverseData);
      setTableData(datas);
      let exportInfo = reverseData.map(e => {
        return {
          "Franchisee Name": e?.isp_id?.name ? e?.isp_id?.name : "---",
          Area: e?.name,
          Admin: e?.assign_user[0]?.name ? e?.assign_user[0]?.name : "---"
        };
      });
      setExportData(exportInfo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const getAllUserData = async () => {
    try {
      let res = await getAllUserbyIspId();
      // 
      let dataOfUser = res?.data?.data?.map(e => {
        return { value: e._id, label: e.name };
      });
      // 
      setUserData(dataOfUser);
    } catch (err) {
      console.log(err);
    }
  };

  const addUser = async () => {
    // e.preventDefault();
    setLoader(true);
    try {
      let payload = {
        assign_user: selectUser.map(ee => ee.value),
        _id: resId._id
      };
      let res = await addMappingAdmin(payload);
      if (payload.assign_user.length != 0) {
        dispatch(
          success({
            show: true,
            msg: "Add Users successfully",
            severity: "success"
          })
        );
      }

      getDataMapping();
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
      setVisible(false);
    }
  };

  const handleSearchClick = e => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, allPlanData);
      setAllPlan(allPlanData);
      setTableData(ddd);
    } else {
      if (Array.isArray(allPlanData)) {
        const filteredData = allPlanData.filter(res => {
          const fullname = res?.name?.toLowerCase() || "";

          return fullname.includes(val);
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setTableData(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanData);
    setTableData(ddd);
  }, [page]);

  useEffect(() => {
    getDataMapping();
    getAllUserData();
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

    pdf.save("Mapping Adding.pdf");
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
        <div style={{ width: "905px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Mapping Admin</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Franchisee Name</th>
                    <th>Area</th>
                    <th>Admin</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res, index) => {
                    return (
                      <tr key={index}>
                        <td className="pointer">{res?.isp_id?.name ? res?.isp_id?.name : "---"}</td>
                        <td className="pointer">{res?.name}</td>
                        <td style={{ width: "30%" }}>
                          <div className="d-flex align-tems-center">
                            <span className="ms-2 mt-2">
                              {res?.assign_user?.length > 0
                                ? `${res?.assign_user[0]?.name} ${res?.assign_user.length > 1 ? "..." : ""}`
                                : "---"}
                            </span>
                          </div>
                        </td>
                        
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
          {permissionAccess && leadPermission.includes("Mapping Admins Tab")?(
            <>
                <ViewMappingAdmin viewModal={viewModal} setViewModal={setViewModal} resEditData={resEditData} />
            <Modal scrollable={true} isOpen={modal} size="lg">
              <ModalHeader toggle={toggle}>
                <div className="f-24">Import Data</div>
              </ModalHeader>
              <ModalBody>
                <div className="">
                  <label for="fileInput" className="f-18 text-black">
                    Select File
                  </label>
                  <Input
                    id="fileInput"
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    // className={style.fileInput}
                    className={`form-control ${fileErr ? "border border-danger" : ""}`}
                    // onChange={(e) => {
                    //   setFileData(e);
                    //   setErrorImport([]);
                    //   setFileErr(false);
                    // }}
                  />
                  {/* {fileErr ? <div className="text-danger">Required</div> : ""} */}
                </div>

                
                <div className="d-flex justify-content-end mt-4">
                  <button className={`btn btn-primary mr-3`}>Download Sample</button>
                  <button
                    className={`btn bg-gray text-white mr-3`}
                    onClick={() => {
                      setModal(false);
                      // setErrorImport([]);
                      // setFileData([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button className={`btn btn-primary`} onClick={() => setModal(false)}>
                    Import
                  </button>
                </div>
              </ModalBody>
            </Modal>
            <Modal scrollable={true} isOpen={visible} size="md">
              <ModalHeader toggle={toggle1}>
                <div className="f-24">Add Mapping Admin</div>
              </ModalHeader>
              <ModalBody>
                {/* <form onSubmit={addUser}> */}
                <div className="row">
                  <div className="col-md-12">
                    <label className="form-label">Select User</label>
                    <div style={{ height: "15vh" }}>
                      <RSelect
                        placeholder="Select User Name"
                        isMulti
                        options={userData}
                        value={selectUser}
                        onChange={e => {
                          setSelectuser(e);
                          setRequiredType();
                        }}
                        styles={{
                          menu: provided => ({
                            ...provided,
                            zIndex: 9999999 // Ensures dropdown is always above other elements
                          }),
                          menuList: provided => ({
                            ...provided,
                            maxHeight: "150px", // Set a fixed height for the list of options
                            overflowY: "auto" // Enable vertical scrolling when options exceed the height
                          })
                          // control: (provided) => ({
                          //   ...provided,
                          //   minHeight: '10vh', // Set the height for the control (input field)
                          // }),
                        }}
                      />
                      {/* {valid && requiredType === "" && <p className="text-danger">Please Select Type</p>} */}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button className="btn text-primary mr-3" type="button" onClick={toggle1}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      // if (requiredType === "") {
                      //   setValid(true);
                      // } else {
                      addUser();
                      //   setValid(false);
                      // }
                    }}
                  >
                    Add
                  </button>
                </div>
                {/* </form> */}
              </ModalBody>
            </Modal>
            <div className="card_container p-md-4 p-sm-3 p-3">
              <div className="topContainer">
                <div className="f-28">Mapping Admins</div>
                <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                  {/* <button className="btn export" onClick={() => setModal(true)}>
                Import Data
              </button> */}
                  <div className="ml-3">
                    {/* <ExportCsv filName={"Mapping Admin"} exportData={exportData} /> */}
              <div className="dropdown_logs ">

                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportData} filName={"Mapping Admin"} />
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
                <SearchInput placeholder={"Enter Name "} onChange={handleSearchClick} />
              </div>
              <div className="mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Franchisee Name</th>
                      <th>Area</th>
                      <th>Admin</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td
                            className="pointer"
                            onClick={() => {
                              setViewModal(true);
                              setResEditData(res);
                            }}
                          >
                            {res?.isp_id?.name ? res?.isp_id?.name : "---"}
                          </td>
                          <td
                            className="pointer"
                            onClick={() => {
                              setViewModal(true);
                              setResEditData(res);
                            }}
                          >
                            {res?.name}
                          </td>
                          <td style={{ width: "30%" }}>
                            <div className="d-flex align-tems-center">
                              <CiSquarePlus
                                style={{ fontSize: "35px", cursor: "pointer" }}
                                onClick={() => {
                                  setVisible(true);
                                  setresId(res);
                                  const selectedUsers = res?.assign_user?.map(user => ({
                                    value: user._id,
                                    label: user.name
                                  }));
                                  setSelectuser(selectedUsers);
                                }}
                              />

                              {/* <span className="ms-2 mt-2">{res?.assign_user?.map((e)=>{
                                return(
                                  <>
                                  {e?.name?e?.name:"---"}
                                  </>
                                )
                              })}</span> */}
                              <span className="ms-2 mt-2">
                                {res?.assign_user?.length > 0
                                  ? `${res?.assign_user[0]?.name} ${res?.assign_user.length > 1 ? "..." : ""}`
                                  : "---"}
                              </span>
                            </div>
                          </td>
                          {/* <td style={{ width: "5%" }}>
                            <div className="d-flex align-items-center">
                              <FiEdit
                                className="f-20 pointer parimary-color mr-2"
                                color="#0E1073"
                                onClick={() => setVisible(true)}
                              />
                            </div>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div class="d-flex justify-content-center mt-1">
                <PaginationComponent
                  currentPage={page}
                  itemPerPage={itemPerPage}
                  paginate={d => {
                    setPage(d);
                  }}
                  totalItems={allPlan.length}
                />
              </div>
            </div>
            </>
          ):(
            <>
               <Error403 />
            </>
          )}
            
          </>
        )}
      </Content>
    </>
  );
}
