import React, { useEffect, useRef, useState } from "react";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import Content from "../../layout/content/Content";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import style1 from "../UserManagement/UserManagement.module.css";
// import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
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
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import InventoryManagementCreateAndUpdate from "./InventoryManagementCreateAndUpdate";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  getListOfInventoryCategory,
  deleteCategoryOfInventory,
  bulkInsertCategory,
  addCategoryCode,
  getlistCategoryCode,
  deleteCategoryCodeById
} from "../../service/admin";
import { userId, userInfo } from "../../assets/userLoginInfo";
import { PaginationComponent } from "../../components/Component";
import { paginateData } from "../../utils/Utils";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { error, success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { csvToJsons, exportCsv } from "../../assets/commonFunction";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import Loader from "../../components/commonComponent/loader/Loader";

export default function InventorymanagementList() {
  const [open, setOpen] = useState({ mode: "", status: false, data: {} });
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [iconFilter, setIconFilter] = useState(true);
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [errorImport, setErrorImport] = useState([]);
  const [fileErr, setFileErr] = useState(false);
  const [disable, setDisable] = useState(false);
  const [openCategoryModel, setOpenCategoryModel] = useState(false);
  const [category_codeList, setCategory_codeList] = useState([]);
  const [category_codeInfo, setCategory_codeInfo] = useState({});
  const [loader, setLoader] = useState(false);
  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);

  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const deleteCategoryCodeFunction = async id => {
    setLoader2(true);
    await deleteCategoryCodeById(id)
      .then(res => {
        setLoader2(false);
        getCategory_code();
      })
      .catch(err => {
        console.log(err);
        setLoader2(false);
      });
  };

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  let simpleData = [
    {
      code: "23",
      category_name: "string",
      hsc_sac: "1234",
      category_description: "string",
      need_length: true,
      cgst: "1",
      scgst: "4",
      service_tax: "2"
    }
  ];
  function findDuplicatesWithIndexAndKeys(data) {
    let nameAndSacTracker = {};
    let duplicates = [];

    data.forEach((item, index) => {
      let key = item.category_name + "|" + item.hsc_sac;

      if (nameAndSacTracker[key]) {
        // Add index and the object keys (category_name, hsc_sac) to the result
        duplicates.push({
          index,
          duplicate: {
            category_name: item.category_name,
            hsc_sac: item.hsc_sac
          }
        });
      } else {
        nameAndSacTracker[key] = true;
      }
    });

    return duplicates;
  }

  const validationImport = data => {
    const error = [];
    const res = [];
    let duplicateError = findDuplicatesWithIndexAndKeys(data);
    let requiredKeys1 = [
      "code",
      "hsc_sac",
      "category_name",
      "category_description",
      "need_length",
      "cgst",
      "scgst",
      "service_tax"
    ];

    let booleanFields1 = ["category_name*"];

    let requiredKeys2 = [
      "code",
      "hsc_sac",
      "category_name",
      "category_description",
      "need_length",
      "cgst",
      "scgst",
      "service_tax"
    ];

    let booleanFields2 = ["category_name*"];
    // }
    function check(type) {
      if (type == "data") {
        return requiredKeys1;
      } else {
        return requiredKeys2;
      }
    }
    function check2(type) {
      if (type == "data") {
        return booleanFields1;
      } else {
        return booleanFields2;
      }
    }

    data.forEach((element, index) => {
      // Check for undefined or missing values in required keys
      check(element["type*"])?.forEach(key => {
        if (element[key] === undefined) {
          error.push({
            row: index + 2,
            key: key,
            message: "This field is required"
          });
        } else {
          if (typeof element[key] !== "boolean" && typeof element[key] !== "number") {
            element[key] = element[key].trim();
          }
        }
      });

      // Validate type and category fields

      // Validate boolean fields
      check2(element["type*"])?.forEach(field => {
        if (element[field] !== undefined && typeof element[field] !== "boolean") {
          error.push({
            row: index + 2,
            key: field,
            message: "Must be Boolean"
          });
        }
      });
      res.push(element);
    });
    duplicateError.forEach((ele, index) => {
      let errorInfo = { row: ele.index + 1, key: Object.keys(ele.duplicate).join(","), message: "duplicacy error" };
      error.push(errorInfo);
    });
    setErrorImport(error);
    return { error, res };
  };

  const importCategory = async sheet => {
    if (sheet?.target?.value == undefined) {
      setFileErr(true);
      return;
    }
    setDisable(true);
    const data = await csvToJsons(sheet);
    let validata = validationImport(data);
    if (validata.error.length !== 0) {
      return;
    }

    const bulk = [];
    data.forEach(response => {
      let codeInfo = category_codeList.find(es => es?.category_code?.toString() === response?.code?.toString());
      if (codeInfo) {
        let attach = {
          ...response,
          category_id: codeInfo?.category_code,
          category_code_id: codeInfo?._id,
          org_id: userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id,
          isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
        };
        delete attach.code;
        bulk.push(attach);
      }
    });
   
    try {
      if (bulk.length === 0) {
        dispatch(
          error({
            show: true,
            msg: "CSV File is Empty or All Codes are InCorrect",
            severity: "error"
          })
        );
      }

      setLoader(true);

      let res = await bulkInsertCategory({ importData: bulk });

      dispatch(
        success({
          show: true,
          msg: "Category Imported Successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        error({
          show: true,
          msg: "File format is not correct",
          severity: "error"
        })
      );
    } finally {
      setDisable(true);
      setModal(false);
      setErrorImport([]);
      setFileData({});
      await getAllData();
      setLoader(false);
    }
  };

  let orGId = userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id;

  const [tableData, setTableData] = useState([]);

  const getAllData = async () => {
    setLoader(true);
    try {
      let res = await getListOfInventoryCategory(orGId);

      let reverseData = res?.data?.data?.reverse();
      setAllPlan(reverseData);
      setAllPlanData(reverseData);
      const datas = paginateData(page, itemPerPage, reverseData);
      setTableData(datas);
      let exportInfo = reverseData.map(e => {
        return {
          "Category Code": e?.category_id,
          "Category Name": e?.category_name,
          "No. of items": e.noOfItem ? e?.noOfItem : "---",
          CGST: e?.cgst,
          SGST: e?.scgst,
          "HSN Code": e?.hsc_sac,
          Description: e?.category_description
        };
      });
      setExportData(exportInfo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const deleteCatagory = async () => {
    setLoader(true);
    try {
      let res = await deleteCategoryOfInventory(deleteId._id);
      setDeleteModal(false);
      getAllData();
      dispatch(
        success({
          show: true,
          msg: "Category deleted successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
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
          const fullname = res?.category_name?.toLowerCase() || "";
          const mobileNumber = (res?.hsc_sac?.toString() || "").toLowerCase();
          // const pinCode = (res?.installation_address?.pin_code?.toString() || "").toLowerCase();
          return fullname.includes(val) || mobileNumber.includes(val);
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setTableData(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  const addCategory_code = async e => {
    try {
      e.preventDefault();
      setLoader1(true);
      await addCategoryCode(category_codeInfo);
      await getCategory_code();
      setLoader1(false);
      setCategory_codeInfo({
        category_code: "",
        category_name: ""
      });
    } catch (err) {
      console.log(err);
      if (err.response.data.error) {
        dispatch(
          error({
            show: true,
            msg: err.response.data.errormessage,
            severity: "error"
          })
        );
      }
    } finally {
      setCategory_codeInfo({
        category_code: "",
        category_name: ""
      });
      setLoader1(false);
    }
  };
  const getCategory_code = async () => {
    try {
      let info = await getlistCategoryCode().then(res => {
        return res.data.data;
      });

      setCategory_codeList(info.reverse());
    } catch (err) {}
  };
  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanData);
    setTableData(ddd);
  }, [page]);
  useEffect(() => {
    getCategory_code();
    getAllData();
  }, []);

  const filterToggle = () => {
    setOverlayVisible(prevState => !prevState);
    // setIconFilter((prevState) => !prevState);
  };
  const toggle = () => {
    setModal(false);
    setErrorImport([]);
    setFileData([]);
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

    pdf.save("Inventory Category.pdf");
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
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Inventory Category</h3>
                <div>
                  <img src={logo} width={100} alt="" />
                </div>
              </div>
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Category Code</th>
                    <th>Category Name</th>
                    <th>No. of items</th>
                    <th>CGST (%)</th>
                    <th>SGST (%)</th>
                    <th>HSN Code</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res, index) => {
                    return (
                      <tr key={index}>
                        <td>{res?.category_id}</td>
                        <td className="pointer text-capitalize">{res?.category_name}</td>
                        <td>{res?.noOfItem ? res?.noOfItem : "---"}</td>
                        <td>{res?.cgst}</td>
                        <td>{res?.scgst}</td>
                        <td>{res?.hsc_sac}</td>
                        <td className="text-capitalize">{res?.category_description}</td>
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
              <TableSkeleton columns={6} />
            </div>
          </>
        ) : (
          <>
            <Modal size="md" isOpen={deleteModal}>
              <ModalBody>
                <div>Are you sure you want to delete this Category?</div>
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
                        deleteCatagory();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </ModalBody>
            </Modal>
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
                    onChange={e => {
                      setFileData(e);
                      setErrorImport([]);
                      setFileErr(false);
                    }}
                  />
                  {fileErr ? <div className="text-danger">Required</div> : ""}
                </div>
                <p style={{ color: "red", marginTop:"4px"}}>
                  ⚠️ Please enter the code carefully. The category will not be added if you enter an incorrect code.
                </p>

                {errorImport.length !== 0 && (
                  <>
                    <hr style={{ width: "100%" }} />
                    <div className="ml-2">
                      <h6>Errors Table</h6>
                    </div>
                    <div className="mt-3">
                      <div className="table-container">
                        <Table hover responsive>
                          <thead style={{ backgroundColor: "#F5F6FA" }}>
                            <tr className="table-heading-size">
                              <th>Row</th>
                              <th>column</th>
                              <th>Message</th>
                            </tr>
                          </thead>
                          <tbody>
                            {errorImport.map(error => (
                              <tr className={`align-items-center h7 `}>
                                <th>{error.row}</th>

                                <td>{error.key}</td>
                                <td>{error.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-end mt-4">
                  <button
                    className={`btn btn-primary mr-3`}
                    onClick={() => exportCsv(simpleData, "Inventory Category")}
                  >
                    Download Sample
                  </button>
                  <button
                    className={`btn bg-gray text-white mr-3`}
                    onClick={() => {
                      setModal(false);
                      setErrorImport([]);
                      setFileData([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button className={`btn btn-primary`} onClick={() => importCategory(fileData)}>
                    Import
                  </button>
                </div>
              </ModalBody>
            </Modal>

            <Modal isOpen={openCategoryModel} size="lg">
              <ModalHeader toggle={() => setOpenCategoryModel(false)}>
                <div className="f-24">Make Category</div>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={addCategory_code}>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    {/* Inputs */}
                    <div className="d-flex align-items-center" style={{ gap: "16px" }}>
                      <div>
                        <label className="f-18 text-black">Category Code</label>
                        <Input
                          type="text"
                          className="form-control"
                          style={{ width: "200px" }} // Adjust width as needed
                          value={category_codeInfo?.category_code}
                          onChange={e => {
                            setCategory_codeInfo({ ...category_codeInfo, category_code: e.target.value });
                          }}
                          required
                        />
                      </div>

                      <div>
                        <label className="f-18 text-black">Category Name</label>
                        <Input
                          type="text"
                          className="form-control"
                          style={{ width: "200px" }} // Adjust width as needed
                          value={category_codeInfo?.category_name}
                          onChange={e => {
                            setCategory_codeInfo({ ...category_codeInfo, category_name: e.target.value });
                          }}
                          required
                        />
                      </div>
                    </div>
                    {/* Button */}
                    {loader1 ? (
                      <Loader />
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Add Category
                      </button>
                    )}
                  </div>
                </form>

                {/* Scrollable table container */}
                {/* <div className="table-container mt-5" style={{ maxHeight: "300px", overflowY: "auto" }}> */}
                <Table hover className="mt-3">
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Category Code</th>
                      <th>Category Name</th>
                      {/* <th>No. of items</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category_codeList.map((res, index) => (
                      <tr key={index}>
                        <td>{res?.category_code}</td>
                        <td className="pointer text-capitalize">{res?.category_name}</td>
                        {/* <td>hello</td> */}
                        <td>
                          {" "}
                          {loader2 ? (
                            <Loader />
                          ) : (
                            <BsTrash
                              className="f-20 fw-500 pointer parimary-color"
                              color="#0E1073"
                              onClick={() => {
                                deleteCategoryCodeFunction(res._id);
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* </div> */}
              </ModalBody>
            </Modal>

            <InventoryManagementCreateAndUpdate
              open={open.status}
              setOpen={setOpen}
              mode={open.mode}
              editData={open.data}
              getAllData={getAllData}
              category_codeList={category_codeList}
            />
            <div className="card_container p-md-4 p-sm-3 p-3">
              <div className="topContainer">
                <div className="f-28">Inventory Management</div>
                <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                  <button className="btn btn-primary mr-3" onClick={() => setOpenCategoryModel(true)}>
                    Create Category
                  </button>
                  <button className="btn export" onClick={() => setModal(true)}>
                    Import Data
                  </button>
                  <div className="ml-3">
                    {/* <ExportCsv filName={"Inventory Category"} exportData={exportData} /> */}
                    <div className="dropdown_logs ">
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                          Export
                          <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>
                            <ExportCsv exportData={exportData} filName={"Inventory Category"} />
                          </DropdownItem>
                          <DropdownItem>
                            {" "}
                            <div onClick={convertToImg}>PDF</div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary ml-3"
                    onClick={() => setOpen({ mode: "add", status: true, data: {} })}
                  >
                    Create Item Model
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <SearchInput placeholder={"Enter Category Name or Hsn..."} onChange={handleSearchClick} />
                {/* <div className="d-flex center g-1 ">
              <div className={style1.filterbtn}>
                <div className={`filter_btn pointer`} onClick={filterToggle}>
                  <span className="mr-2">All</span>
                  {iconFilter ? (
                    <FaAngleDown style={{ fontSize: "1rem", color: "#53545C" }} size={15} />
                  ) : (
                    <FaAngleUp style={{ fontSize: "1rem", color: "#53545C" }} size={15} />
                  )}
                </div>
              </div>
            </div> */}
              </div>
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Category Code</th>
                      <th>Category Name</th>
                      <th>No. of items</th>
                      <th>CGST (%)</th>
                      <th>SGST (%)</th>
                      <th>HSN Code</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td
                            onClick={() => history.push(`/inventoryManagement/viewInventoryCategory/${res._id}`)}
                            className="pointer text-capitalize"
                          >
                            {res?.category_id}
                          </td>
                          <td
                            onClick={() => history.push(`/inventoryManagement/viewInventoryCategory/${res._id}`)}
                            className="pointer text-capitalize"
                          >
                            {res?.category_name}
                          </td>
                          <td>{res?.noOfItem ? res?.noOfItem : "---"}</td>
                          <td>{res?.cgst}</td>
                          <td>{res?.scgst}</td>
                          <td>{res?.hsc_sac}</td>
                          <td className="text-capitalize">{res?.category_description}</td>
                          <td style={{ width: "5%" }}>
                            <div className="d-flex align-items-center">
                              <FiEdit
                                className="f-20 pointer parimary-color mr-2"
                                color="#0E1073"
                                onClick={() => setOpen({ mode: "edit", status: true, data: res })}
                              />
                              <BsTrash
                                className="f-20 fw-500 pointer parimary-color"
                                color="#0E1073"
                                onClick={() => {
                                  setDeleteModal(true);
                                  setDeleteId(res);
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
        )}
      </Content>
    </>
  );
}
