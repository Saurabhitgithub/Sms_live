import React, { useEffect, useRef, useState } from "react";
import Content from "../../../layout/content/Content";
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
import ExportCsv from "../../../components/commonComponent/ExportButton/ExportCsv";
import CreateArea from "./CreateArea";
import { CiSquarePlus } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import SearchInput from "../../../components/commonComponent/searchInput/SearchInput";
import EditDefineArea from "./EditDefineArea";
import ViewDefineArea from "./ViewDefineArea";
import { addAreaOfCollection, getDefineAreaofCollection, deleteDefineArea } from "../../../service/admin";
import { permisionsTab, userId, userInfo } from "../../../assets/userLoginInfo";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { PaginationComponent } from "../../../components/Component";
import { paginateData } from "../../../utils/Utils";
import { success } from "../../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../../assets/images/jsTree/PdfLogo.png";
import Error403 from "../../../components/error/error403";

export default function DefineAreaList() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const [fileData, setFileData] = useState([]);
  const [errorImport, setErrorImport] = useState([]);
  const [fileErr, setFileErr] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [editModule, setEditModule] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [streetAdd, setStreetAdd] = useState("");
  const [BuildingAdd, setBuildingAdd] = useState("");
  const [currentStreet, setCurrentStreet] = useState();
  const [loader, setLoader] = useState(true);
  const [resId, setresId] = useState("");
  const [exportData, setExportData] = useState([]);
  const dispatch = useDispatch();
  const [resEditData, setResEditData] = useState({});

  const [deleteModal, setDeleteModal] = useState(false);

  const [getResId, setGetResId] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  let orGId = userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id;

  const toggle = () => {
    setModal(false);
  };
  const toggle1 = () => {
    setVisible(false);
  };
  const toggle2 = () => {
    setVisible1(false);
  };

  const [tableData, setTableData] = useState([]);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);

  const [leadPermission, setLeadPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();

    const permissions = res.filter(s => s.tab_name === "Payment Collection");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);
      setLeadPermission(permissionArr);
    }
  }

  const submitStreet = async e => {
    e.preventDefault();
    setLoader(true);
    try {
      let payload = {
        name: streetAdd,
        role: "street",
        _id: resId._id,
        createdBy: userId()
      };
      let res = await addAreaOfCollection(payload);
      setStreetAdd("");
      dispatch(
        success({
          show: true,
          msg: "Street Created Successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setVisible(false);
      setLoader(false);
      getAllAreaData();
    }
  };

  const submitBuilding = async e => {
    e.preventDefault();
    setLoader(true);
    let payload = {
      name: BuildingAdd,
      role: "building",
      _id: currentStreet,
      createdBy: userId()
    };
    try {
      let res = await addAreaOfCollection(payload);
      setBuildingAdd("");
      dispatch(
        success({
          show: true,
          msg: "Building Created Successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
      setVisible1(false);
      getAllAreaData();
    }
  };

  const deteteData = async () => {
    setLoader(true);
    try {
      let payload = {
        role: "area",
        _id: getResId._id
      };
      let res = await deleteDefineArea(payload);
      dispatch(
        success({
          show: true,
          msg: "Area Deleted Successfully",
          severity: "success"
        })
      );
      getAllAreaData();
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteModal(false);
      setLoader(false);
    }
  };

  const getAllAreaData = async () => {
    setLoader(true);
    try {
      let res = await getDefineAreaofCollection();
      let reverseData = res?.data?.data?.reverse();
      setAllPlan(reverseData);
      setAllPlanData(reverseData);
      await permissionFunction();
      const datas = paginateData(page, itemPerPage, reverseData);
      setTableData(datas);
      let exportInfo = reverseData.map(e => {
        return {
          Area: e?.name,
          Street: e?.streets[0]?.name ? e?.streets[0]?.name : "---",
          Building: e?.streets[0]?.buildings[0]?.name ? e?.streets[0]?.buildings[0]?.name : "---"
        };
      });
      setExportData(exportInfo);
      setLoader(false);
    } catch (err) {
      console.log(err);
    } finally {
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
    getAllAreaData();
  }, []);

  //

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

    pdf.save("Define Area.pdf");
  }
  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",

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
                <h3>Define Area</h3>

                <div>
                  <img src={logo} width={100} alt="" />
                </div>
              </div>
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Area</th>
                    <th>Street</th>
                    <th>Building</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res, index) => {
                    //
                    return (
                      <tr key={index}>
                        <td className="pointer text-capitalize">{res?.name}</td>
                        <td style={{ width: "30%" }}>
                          <div className="d-flex align-tems-center">
                            <span className="ms-2 mt-2">{res?.streets[0]?.name ? res?.streets[0]?.name : "---"}</span>
                          </div>
                        </td>
                        <td style={{ width: "30%" }}>
                          <div className="d-flex align-tems-center">
                            <span className="ms-2 mt-2">
                              {res?.streets[0]?.buildings[0]?.name ? res?.streets[0]?.buildings[0]?.name : "---"}
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
            {permissionAccess && leadPermission.includes("Define Area Tab") ? (
              <>
                <CreateArea open={open} setOpen={setOpen} getAllAreaData={getAllAreaData} />
                <EditDefineArea
                  editModule={editModule}
                  setEditModule={setEditModule}
                  resEditData={resEditData}
                  setResEditData={setResEditData}
                  getAllAreaData={getAllAreaData}
                />
                <ViewDefineArea viewModal={viewModal} setViewModal={setViewModal} resEditData={resEditData} />
                {/* delete Modal */}

                <Modal size="md" isOpen={deleteModal}>
                  <ModalBody>
                    <div>Are you sure you want to delete this Area?</div>
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
                            deteteData();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </ModalBody>
                </Modal>

                {/* delete Modal */}

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
                        className={`form-control ${fileErr ? "border border-danger" : ""}`}
                      />
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button className={`btn btn-primary mr-3`}>Download Sample</button>
                      <button
                        className={`btn bg-gray text-white mr-3`}
                        onClick={() => {
                          setModal(false);
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
                    <div className="f-24">Add Street</div>
                  </ModalHeader>
                  <ModalBody>
                    <span>Add specific streets within an area to target payment collection more precisely.</span>
                    <form onSubmit={submitStreet}>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <label className="form-label">Area Name</label>
                          <input className="form-control" placeholder="Area 1" value={resId?.name} disabled />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <label className="form-label">Add Street Address</label>
                          <input
                            required
                            className="form-control"
                            placeholder="Enter Street Address"
                            onChange={e => {
                              if (e.target.value === " ") {
                                e.target.value = "";
                              } else {
                                setStreetAdd(e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-4">
                        <button className="btn text-primary mr-3" type="button" onClick={toggle1}>
                          Cancel
                        </button>
                        <button className="btn btn-primary" type="submit">
                          Add
                        </button>
                      </div>
                    </form>
                  </ModalBody>
                </Modal>
                <Modal scrollable={true} isOpen={visible1} size="md">
                  <ModalHeader toggle={toggle2}>
                    <div className="f-24">Add Building</div>
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={submitBuilding}>
                      <span>
                        Include individual buildings within a street for detailed payment collection management.
                      </span>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <label className="form-label">Area Name</label>
                          <input className="form-control" placeholder="Area 1" value={resId?.name} disabled />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <label className="form-label">Add Street Address</label>

                          <SingleSelect
                            placeItem={"Street"}
                            options={resId?.streets?.map(res => {
                              return {
                                value: res?._id,
                                label: res?.name
                              };
                            })}
                            onChange={e => {
                              setCurrentStreet(e.target.value);
                            }}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <label className="form-label">Add Building No.</label>
                          <input
                            required
                            className="form-control"
                            placeholder="Enter Builing No."
                            onChange={e => {
                              if (e.target.value === " ") {
                                e.target.value = "";
                              } else {
                                setBuildingAdd(e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-4">
                        <button className="btn text-primary mr-3" type="button" onClick={toggle2}>
                          Cancel
                        </button>
                        <button className="btn btn-primary" type="submit">
                          Add
                        </button>
                      </div>
                    </form>
                  </ModalBody>
                </Modal>
                <div className="card_container p-md-4 p-sm-3 p-3">
                  <div className="topContainer">
                    <div className="f-28">Define Area Collection</div>
                    <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                      <div className="ml-3">
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
                                <ExportCsv exportData={exportData} filName={"Define Area"} />
                              </DropdownItem>
                              <DropdownItem>
                                {" "}
                                <div onClick={convertToImg}>PDF</div>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                      <button className="btn btn-primary ml-3" onClick={() => setOpen(true)}>
                        Create Area
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    Note: Please add street and building once <b>area is created</b>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <SearchInput placeholder={"Enter Name "} onChange={handleSearchClick} />
                  </div>
                  <div className="mt-5">
                    <Table hover>
                      <thead style={{ backgroundColor: "#F5F6FA" }}>
                        <tr className="table-heading-size">
                          <th>Area</th>
                          <th>Street</th>
                          <th>Building</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((res, index) => {
                          //
                          return (
                            <tr key={index}>
                              <td
                                className="pointer text-capitalize"
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
                                    }}
                                  />

                                  <span className="ms-2 mt-2">
                                    {res?.streets[0]?.name ? res?.streets[0]?.name : "---"}
                                  </span>
                                </div>
                              </td>
                              <td style={{ width: "30%" }}>
                                <div className="d-flex align-tems-center">
                                  <CiSquarePlus
                                    style={{ fontSize: "35px", cursor: "pointer" }}
                                    onClick={() => {
                                      setVisible1(true);
                                      setresId(res);
                                    }}
                                  />

                                  <span className="ms-2 mt-2">
                                    {res?.streets[0]?.buildings[0]?.name ? res?.streets[0]?.buildings[0]?.name : "---"}
                                  </span>
                                </div>
                              </td>
                              <td style={{ width: "5%" }}>
                                <div className="d-flex align-items-center">
                                  <FiEdit
                                    className="f-20 pointer parimary-color mr-2"
                                    color="#0E1073"
                                    onClick={() => {
                                      setEditModule(true);
                                      setResEditData(res);
                                    }}
                                  />
                                  <BsTrash
                                    className="f-20 fw-500 pointer parimary-color"
                                    color="#0E1073"
                                    onClick={() => {
                                      setDeleteModal(true);
                                      setGetResId(res);
                                    }}
                                  />
                                </div>
                              </td>
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
            ) : (
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
