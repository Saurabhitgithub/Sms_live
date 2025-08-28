import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import { IoArrowBack } from "react-icons/io5";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
// import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import style1 from "../UserManagement/UserManagement.module.css";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, Table } from "reactstrap";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import InventoryAddAndUpdateItem from "./InventoryAddAndUpdateItem";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { getListofInventory, deleteOfInventoryItem,getDataParticularCategory } from "../../service/admin";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import moment from "moment";
import { paginateData } from "../../utils/Utils";
import { PaginationComponent } from "../../components/Component";
import { useDispatch } from "react-redux";
import { success } from "../../Store/Slices/SnackbarSlice";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png"








export default function InventoryCategoryView() {
  const history = useHistory();
  const [open, setOpen] = useState({ mode: "", status: false, data: {} });
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [iconFilter, setIconFilter] = useState(true);
  const filterToggle = () => {
    setOverlayVisible(prevState => !prevState);
    // setIconFilter((prevState) => !prevState);
  };
  const paramsData = useParams();
  

  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [prticularData,setParticularData]  =useState({})                                                                                                                                                                                                                                                                                                                                                                              
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);
  

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };


  const getParticularCategoryData = async()=>{
    try{
      let res = await getDataParticularCategory(paramsData.id)
      
      setParticularData(res?.data?.data)
    }catch(err){
      console.log(err)
    }
  }

  const getALLData = async () => {
    setLoader(true)
    try {
      let res = await getListofInventory(paramsData.id);
      
      let reverseData = res?.data?.data?.reverse();
      setAllPlan(reverseData);
      setAllPlanData(reverseData);
      const datas = paginateData(page, itemPerPage, reverseData);
      setTableData(datas);
      let exportInfo = reverseData.map((e)=>{
        return{
          "Item Code":e?.item_id,
          "Item Name":e?.item_name,
          "Price":e?.item_price,
          "QTY":e?.item_quantity,
          "Address":e?.address,
          "MAC Number":e?.mac,
          "Serial Number":e?.serial,
          "Condition":e?.condition,
          "Purchase Date":e?.purchase_date ? moment(e?.purchase_date).format("DD-MM-YYYY") : "",
          "Description":e?.item_description
        }
      })
      setExportData(exportInfo)
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false)
    }
  };

  const deleteItem = async () => {
    setLoader(true)
    try {
      let res = await deleteOfInventoryItem(deleteId._id);
      setDeleteModal(false);
      getALLData();
      dispatch(
        success({
          show: true,
          msg: "Item deleted successfully",
          severity: "success",
        })
      );
    } catch (error) {
      console.log(err);
    } finally {
      setLoader(false)
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
          const fullname = res?.item_name?.toLowerCase() || "";
          // const mobileNumber = (res?.hsc_sac?.toString() || "").toLowerCase();
          // const pinCode = (res?.installation_address?.pin_code?.toString() || "").toLowerCase();
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
    getALLData();
    getParticularCategoryData()
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

    pdf.save("Inventory Item.pdf");
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
      <div style={{ width: "1300px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Category: {prticularData?.category_name}</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>QTY</th>
                      <th>Address</th>
                      <th>MAC Number</th>
                      <th>Serial Number</th>
                      <th>Condition</th>
                      <th>Purchase Date</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td>{res?.item_id}</td>
                          <td className="text-capitalize">{res?.item_name}</td>
                          <td>{res?.item_price}</td>
                          <td>{res?.item_quantity}</td>
                          <td>{res?.address}</td>
                          {/* <td>{res?.mac_serial}</td> */}
                          <td>{res?.mac}</td>
                          <td>{res?.serial}</td>
                          <td>{res?.condition}</td>
                          <td>{moment(res?.purchase_date).format("DD-MM-YYYY")}</td>
                          <td>{res?.item_description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
            </div>
          </div>
        </div>
        {loader ? (
          <div className="table-container mt-5">
            <TableSkeleton columns={6} />
          </div>
        ) : (
          <>
            <Modal size="md" isOpen={deleteModal}>
              <ModalBody>
                <div>Are you sure you want to delete this Item?</div>
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
                        deleteItem();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </ModalBody>
            </Modal>
            {/* <InventoryAddAndUpdateItem
              open={open.status}
              setOpen={setOpen}
              mode={open.mode}
              editData={open.data}
              paramsData={paramsData}
              getALLData={getALLData}
              prticularData={prticularData}
            /> */}
            <div className="card_container p-md-4 p-sm-3 p-3 user_section">
            <div className="d-flex gap-2 align-items-center  text-dark">
                  <button
                    className="btn p-0 text-primary fw-600 f-18"
                    onClick={() => history.push("/inventoryManagement")}
                  >
                    <IoArrowBack className="f-20" /> Back
                  </button>
                </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="fw-600 fs-26 text-capitalize ">Category: {prticularData?.category_name}</div>
                <div className="d-flex">
               
                <button
                    className="btn btn-primary ml-3"
                    onClick={() => history.push(`/inventoryManagement/viewInventoryCategory/${paramsData.id}/inventoryAddAndUpdate`)}
                  >
                    Add New Item
                  </button>
            
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <SearchInput placeholder={"Enter Item Name"} onChange={handleSearchClick} />
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
                <div>
                {/* <ExportCsv filName={"Inventory Category Items"} exportData={exportData} /> */}
                <div className="dropdown_logs ">

                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportData} filName={"Inventory Item"} />
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
              <div className="table-container mt-5">
                <Table hover>
                  <thead style={{ backgroundColor: "#F5F6FA" }}>
                    <tr className="table-heading-size">
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>QTY</th>
                      <th>Address</th>
                      <th>MAC Number</th>
                      <th>Serial Number</th>
                      <th>Condition</th>
                      <th>Purchase Date</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td>{res?.item_id}</td>
                          <td className="text-capitalize">{res?.item_name}</td>
                          <td>{res?.item_price}</td>
                          <td>{res?.item_quantity}</td>
                          <td>{res?.address}</td>
                          {/* <td>{res?.mac_serial}</td> */}
                          <td>{res?.mac_serial?.map((res1)=>{
                            return (
                              <div>{res1?.mac}</div>
                            )
                          })}</td>
                          <td>{res?.mac_serial?.map((res1)=>{
                            return (
                              <div>{res1?.serial}</div>
                            )
                          })}</td>
                          <td>{res?.condition}</td>
                          <td>{moment(res?.purchase_date).format("DD-MM-YYYY")}</td>
                          <td>{res?.item_description}</td>
                          <td style={{ width: "5%" }}>
                            <div className="d-flex align-items-center">
                              <FiEdit
                                className="f-20 pointer parimary-color mr-2"
                                color="#0E1073"
                                onClick={() => history.push(`/inventoryManagement/viewInventoryCategory/${paramsData.id}/inventoryAddAndUpdate/${res._id}`)}
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
