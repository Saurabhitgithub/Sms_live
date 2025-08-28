import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import {
  Modal,
  Table,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import PaginationComponent from "../../components/pagination/Pagination";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { AddBandwidth } from "./AddBandwidth";
import { ViewBandWidth } from "./ViewBandWidth";
import { getAllBandWidthData, deleteBandWidth } from "../../service/admin";
import { permisionsTab, userId, userInfo } from "../../assets/userLoginInfo";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { paginateData } from "../../utils/Utils";
import EditBandwidth from "./EditBandwidth";
import { useDispatch } from "react-redux";
import { success } from "../../Store/Slices/SnackbarSlice";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import Error403 from "../../components/error/error403";

export default function Bandwidth() {
  const [bandWidthRow, setbandWidthRow] = useState();
  const [page, setPage] = useState(1);
  const itemPerPage = 8;
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [modal, setModal] = useState(false);
  const [view, setView] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteBand, setDeleteBand] = useState("");

  const [getAllData, setGetAllData] = useState([]);
  const [bandwidthData, setBandwidthdata] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [bandwidthId, setbandWidthId] = useState();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const [leadPermission, setLeadPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);

  async function permissionFunction() {
    const res = await permisionsTab();

    console.log(res, "permission bandwidth");
    const permissions = res.filter(s => s.tab_name === "Bandwidth Management");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setLeadPermission(permissionArr);
    }
  }

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const handleSearchClick = e => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, allPlanData);
      setAllPlan(allPlanData);
      setGetAllData(ddd);
    } else {
      if (Array.isArray(allPlanData)) {
        const filteredData = allPlanData.filter(res => {
          const fullname = res?.name?.toLowerCase() || "";
          const MaxDownload = (res?.max_download?.speed?.toString() || "").toLowerCase();
          const MaxUpload = (res?.max_upload?.speed?.toString() || "").toLowerCase();
          return fullname.includes(val) || MaxDownload.includes(val) || MaxUpload.includes(val);
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setGetAllData(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  const getAllBandWidthFunction = async () => {
    setLoader(true);
    await getAllBandWidthData()
      .then(async(res) => {
        let reverseData = [...res.data.data];
        let dataReverse = reverseData.reverse();
        setAllPlan(dataReverse);
        setAllPlanData(dataReverse);
        let data = paginateData(page, itemPerPage, dataReverse);
        setGetAllData(data);
       await permissionFunction();

        let exportInfo = dataReverse?.map(es => {
          return {
            "Template name": es?.name,
            "Max Download": es?.max_download?.speed,
            "Min Download": es?.min_download?.speed,
            "Max Upload": es?.max_upload?.speed,
            "Min Upload": es?.min_upload?.speed,
            "Advanced Options": es?.advance_option ? "Enable" : "Disable"
          };
        });
        setExportData(exportInfo);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const deleteFunction = async () => {
    setLoader(true);
    let payloadData = {
      user_role: userInfo().role,
      user_id: userId(),
      user_name: userInfo().name,
      id: deleteBand
    };
    await deleteBandWidth(payloadData)
      .then(res => {
        setDeleteModal(false);
        getAllBandWidthFunction();
        dispatch(
          success({
            show: true,
            msg: "Bandwidth Deleted successfully",
            severity: "success"
          })
        );
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };
  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanData);
    setGetAllData(ddd);
  }, [page]);
  useEffect(() => {
    getAllBandWidthFunction();
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

    pdf.save("Bandwidth Management.pdf");
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
      <Modal size="md" isOpen={deleteModal}>
        <ModalBody>
          <div>Are you sure you want to delete this Bandwidth?</div>
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex">
              <button
                type="button"
                className="cancel_btn mr-2"
                onClick={() => {
                  setDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  deleteFunction();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
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
                <h3>Bandwidth Management</h3>
                <div>
                  <img src={logo} width={100} alt="" />
                </div>
              </div>
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Template name</th>
                    <th>Template code</th>

                    <th>Max Download</th>

                    <th>Min Dowload</th>

                    <th>Max Upload</th>

                    <th>Min Upload</th>

                    <th>Advanced Options</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllData.map(res => (
                    <tr key={res.id}>
                      <td className="pointer">{res?.name}</td>

                      <td>{res?.temp_code}</td>
                      <td>
                        {res?.max_download?.speed}/{res?.max_download?.unit}
                      </td>

                      <td>
                        {res?.min_download?.speed}/{res?.min_download?.unit}
                      </td>

                      <td>
                        {res?.max_upload?.speed}/{res?.max_upload?.unit}
                      </td>

                      <td>
                        {res?.min_upload?.speed}/{res?.min_upload?.unit}
                      </td>

                      <td className={` pointer ${res.advance_option ? "statusActive" : "statusExpire"}`}>
                        {res.advance_option ? "Enable" : "Disable"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        {/* <div className="mt-5"> */}
        {loader ? (
          <TableSkeleton columns={5} />
        ) : (
          <>
            {permissionAccess && leadPermission.includes("View Bandwidth") ? (
              <>
                <div className="card_container p-md-4 p-sm-3 p-3">
                  <div className="topContainer d-flex justify-content-between">
                    <div className="f-28">Bandwidth Management</div>
                    <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                      {/* <ExportCsv exportData={exportData} filName={"Bandwidth data"} /> */}
                      <div className="dropdown_logs ">
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                          <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                            Export
                            <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>
                              <ExportCsv exportData={exportData} filName={"Bandwidth Management"} />
                            </DropdownItem>
                            <DropdownItem>
                              {" "}
                              <div onClick={convertToImg}>PDF</div>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>

                      {leadPermission.includes("Add Bandwidth") && (
                        <>
                          <div className="line ml-4 mr-4"></div>
                          <button className="btn btn-primary" type="button" onClick={() => setModal(true)}>
                            Create New
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 d-flex flex-row justify-content-between">
                    <SearchInput placeholder={"Enter a name here to search"} onChange={handleSearchClick} />
                  </div>
                  <div className="mt-5 table-container">
                    <Table hover>
                      <thead style={{ backgroundColor: "#F5F6FA" }}>
                        <tr className="table-heading-size">
                          <th>Template name</th>
                          <th>Template code</th>
                          <th>Max Download</th>

                          <th>Min Dowload</th>

                          <th>Max Upload</th>

                          <th>Min Upload</th>

                          <th>Advanced Options</th>
                          {(leadPermission.includes("Edit Bandwidth") ||
                            leadPermission.includes("Delete Bandwidth")) && (
                            <>
                              <th>Actions</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {getAllData.map(res => (
                          <tr key={res.id}>
                            <td
                              className="pointer"
                              onClick={() => {
                                setView(true);
                                setbandWidthRow(res);
                              }}
                            >
                              {res?.name}
                            </td>
                            <td>{res?.temp_code}</td>
                            <td>
                              {res?.max_download?.speed}/{res?.max_download?.unit}
                            </td>

                            <td>
                              {res?.min_download?.speed}/{res?.min_download?.unit}
                            </td>

                            <td>
                              {res?.max_upload?.speed}/{res?.max_upload?.unit}
                            </td>

                            <td>
                              {res?.min_upload?.speed}/{res?.min_upload?.unit}
                            </td>

                            <td className={` pointer ${res.advance_option ? "statusActive" : "statusExpire"}`}>
                              {res.advance_option ? "Enable" : "Disable"}
                            </td>
                            {(leadPermission.includes("Edit Bandwidth") ||
                              leadPermission.includes("Delete Bandwidth")) && (
                              <>
                                <td className="d-flex  align-items-center">
                                  <FiEdit
                                    className="f-20 pointer parimary-color"
                                    color="#0E1073"
                                    onClick={() => {
                                      setbandWidthId(res._id);
                                      setEditModal(true);
                                    }}
                                  />

                                  <div className="line mx-3"></div>

                                  <BsTrash
                                    className="f-20 pointer parimary-color"
                                    color="#0E1073"
                                    onClick={() => {
                                      setDeleteBand(res);
                                      setDeleteModal(true);
                                    }}
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="d-flex justify-content-center mt-1">
                    <PaginationComponent
                      currentPage={page}
                      itemPerPage={itemPerPage}
                      paginate={d => setPage(d)}
                      totalItems={allPlan.length}
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
        {/* </div> */}
      </Content>

      <AddBandwidth modal={modal} setModal={setModal} getAllBandWidthFunction={getAllBandWidthFunction} />
      <EditBandwidth
        editModal={editModal}
        setEditModal={setEditModal}
        getAllBandWidthFunction={getAllBandWidthFunction}
        bandwidthId={bandwidthId}
      />

      <ViewBandWidth modal={view} setModal={setView} bandWidthRow={bandWidthRow} />
    </>
  );
}
