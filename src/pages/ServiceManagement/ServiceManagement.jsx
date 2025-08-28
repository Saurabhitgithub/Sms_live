import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Modal, Table, ModalBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import PaginationComponent from "../../components/pagination/Pagination";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { AddService } from "./AddService";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { paginateData } from "../../utils/Utils";
import { useDispatch } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png"
import { addServiceData, deleteServiceById, getAllServices } from "../../service/admin";
import { permisionsTab, userId } from "../../assets/userLoginInfo";
import Loader from "../../components/commonComponent/loader/Loader";
import ViewServicePopup from "./ViewServicePopup";
import Error403 from "../../components/error/error403";

export default function ServiceManagement() {
  const [page, setPage] = useState(1);
  const itemPerPage = 8;
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteBand, setDeleteBand] = useState("");

  const [getAllData, setGetAllData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [bandwidthId, setbandWidthId] = useState();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);
  const [viewModal, setViewModal] = useState(false)
  const [formData, setFormData] = useState({
    "service_name": "",
    "cost": '',
    "cgst": '',
    "sgst": '',
    "service_tax": '',
    "duration_frequency": '',
    "duration": ""
  })
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

    const [leadPermission, setLeadPermission] = useState([]);
    const [permissionAccess, setPermissionAccess] = useState(true);
  
    async function permissionFunction() {
      const res = await permisionsTab();
  
     
      const permissions = res.filter(s => s.tab_name === "Service Management");
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
          const fullname = res?.service_name?.toLowerCase() || "";
          return fullname.includes(val)
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setGetAllData(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  const getAllServicesData = async () => {
    setLoader(true);

    await getAllServices()
      .then(async(res) => {
        let reverseData = [...res.data.data];
        let dataReverse = reverseData.reverse();
        setAllPlan(dataReverse);
        setAllPlanData(dataReverse);
        let data = paginateData(page, itemPerPage, dataReverse);
        setGetAllData(data);
      await  permissionFunction()
        let exportInfo = dataReverse?.map(es => {
          return {
            "Service name": es?.service_name,
            "Service cost": `Rs.${es?.cost}`,
            "Duration": `${es?.duration_frequency} ${convertText(es?.duration)}${+(es?.duration_frequency) == 1 ? '' : 's'}`,
            "CGST": es?.cgst !== null ? es?.cgst + '%' : 'NA',
            "SGST": es?.sgst !== null ? es?.sgst + '%' : 'NA',
            "Service Tax": es?.service_tax !== null ? es?.service_tax + '%' : 'NA',
          };
        });
        setExportData(exportInfo);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };
  const deleteFunction = async () => {
    setLoader(true);

    await deleteServiceById(deleteBand)
      .then(async (res) => {
        setDeleteModal(false);
        await getAllServicesData();
        dispatch(
          success({
            show: true,
            msg: "Bandwidth Deleted successfully",
            severity: "success"
          })
        );
        setLoader(false);
        setDeleteBand('')
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
    getAllServicesData();
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
        .then(function (dataUrl) {
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
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (index === arr.length - 1) {
            // setLoader(false);
          }
        });
    }

    pdf.save("Service Management.pdf");
  }

  function handleChange(e) {
    let { name, value } = e.target
    if (e.target.value == ' ') {
      e.target.value = ''
    } else {
      setFormData(pre => {
        return {
          ...pre,
          [name]: value
        }
      })
    }

  }



  async function addService(e) {
    e.preventDefault()
    setLoader2(true);
    try {
      let payload = { ...formData }
      let res = await addServiceData(payload)
      setFormData({
        "service_name": "",
        "cost": '',
        "cgst": '',
        "sgst": '',
        "service_tax": '',
        "duration_frequency": '',
        "duration": ""
      })
      setModal(false)
      setLoader2(false);
      await getAllServicesData()

    } catch (Err) {
      console.log(Err)
    } finally {
      setLoader2(false);
    }
  }

  async function updateService(e) {
    e.preventDefault()
    setLoader2(true);
    try {
      let payload = { ...formData, id: formData?._id }
      let res = await addServiceData(payload)
      setFormData({
        "service_name": "",
        "cost": '',
        "cgst": '',
        "sgst": '',
        "service_tax": '',
        "duration_frequency": '',
        "duration": ""
      })
      setEditModal(false)
      setLoader2(false);
      await getAllServicesData()

    } catch (Err) {
      console.log(Err)
    } finally {

    }
  }


  function convertText(key) {
    switch (key) {
      case 'daily':
        return 'Day'
        break;
      case 'weekly':
        return 'Week'
        break;
      case 'monthly':
        return 'Month'
        break;
      case 'yearly':
        return 'Year'
        break;
      case 'quarterly':
        return 'Quarterly'
        break;
      case 'half_yearly':
        return 'Half Yearly'
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Content>
        {loader ? <Loader /> : ''}
        <ViewServicePopup
          open={viewModal}
          toggle={() => {
            setViewModal(!viewModal)
            setFormData({
              "service_name": "",
              "cost": '',
              "cgst": '',
              "sgst": '',
              "service_tax": '',
              "duration_frequency": '',
              "duration": ""
            })
          }}
          formData={formData}
        />

        <AddService
          mode='Add'
          open={modal}
          toggle={() => {
            setModal(!modal)
            setFormData({
              "service_name": "",
              "cost": '',
              "cgst": '',
              "sgst": '',
              "service_tax": '',
              "duration_frequency": '',
              "duration": ""
            })
          }}
          formData={formData}
          handleChange={handleChange}
          submitFunction={addService}
        />
        <AddService
          mode='Edit'
          open={editModal}
          toggle={() => {
            setEditModal(!editModal)
            setFormData({
              "service_name": "",
              "cost": '',
              "cgst": '',
              "sgst": '',
              "service_tax": '',
              "duration_frequency": '',
              "duration": ""
            })
          }}
          formData={formData}
          handleChange={handleChange}
          submitFunction={updateService}
        />
        <Modal size="md" isOpen={deleteModal}>
          <ModalBody>
            <div>Are you sure you want to delete this Service?</div>
            <div className="d-flex justify-content-end mt-3">
              <div className="d-flex">
                <button
                  type="button"
                  className="cancel_btn mr-2"
                  onClick={() => {
                    setDeleteModal(false);
                    setDeleteBand('')
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
        <div style={{ width: "1000px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Service Management</h3>
                <div>
                  <img src={logo} width={100} alt="" />
                </div>
              </div>
              <Table hover>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    <th>Service Name</th>
                    <th>Service Cost</th>
                    <th>Duration</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Service Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllData?.map(res => (
                    <tr key={res._id}>
                      <td className="pointer" onClick={() => {
                        setFormData(res)
                        setViewModal(true)
                      }}>
                        {res?.service_name}
                      </td>
                      <td>
                        Rs. {res?.cost}
                      </td>

                      <td>
                        {res?.duration_frequency} {convertText(res?.duration)}{+(res?.duration_frequency) == 1 ? '' : 's'}
                      </td>

                      <td>
                        {res?.cgst}{res?.cgst ? '%' : 'NA'}
                      </td>

                      <td>
                        {res?.sgst}{res?.sgst ? '%' : 'NA'}
                      </td>
                      <td>
                        {res?.service_tax}{res?.service_tax ? '%' : 'NA'}
                      </td>



                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        {/* <div className="card_container p-md-4 p-sm-3 p-3">
         
          <div className="mt-5"> */}
            {loader ? (
              <TableSkeleton columns={5} />
            ) : (
              <>{permissionAccess && leadPermission.includes("View Service") ? (
                <>
                   <div className="card_container p-md-4 p-sm-3 p-3">
               <div className="topContainer d-flex justify-content-between">
            <div className="f-28">Service Management</div>
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
                      <ExportCsv exportData={exportData} filName={"Service Management"} />
                    </DropdownItem>
                    <DropdownItem>
                      {" "}
                      <div onClick={convertToImg}>PDF</div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              {leadPermission.includes("Add Service") && (
                 <>
                 
              <div className="line ml-4 mr-4"></div>
              <button className="btn btn-primary" type="button" onClick={() => setModal(true)}>
                Create New Service
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
                      <th>Service Name</th>
                      <th>Service Cost</th>
                      <th>Duration</th>
                      <th>CGST</th>
                      <th>SGST</th>
                      {(leadPermission.includes("Edit Service") || leadPermission.includes("Delete Service")) && (
                        <>
                        
                        <th>Action</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getAllData?.map(res => (
                      <tr key={res._id}>
                        <td className="pointer" onClick={() => {
                          setFormData(res)
                          setViewModal(true)
                        }}>
                          {res?.service_name}
                        </td>
                        <td>
                          Rs. {res?.cost}
                        </td>

                        <td>
                          {res?.duration_frequency} {convertText(res?.duration)}{+(res?.duration_frequency) == 1 ? '' : 's'}
                        </td>

                        <td>
                          {res?.cgst}{res?.cgst ? '%' : 'NA'}
                        </td>

                        <td>
                          {res?.sgst}{res?.sgst ? '%' : 'NA'}
                        </td>


                        {/* <td className={` pointer ${res.advance_option ? "statusActive" : "statusExpire"}`}>
                          {res.advance_option ? "Enable" : "Disable"}
                        </td> */}
{(leadPermission.includes("Edit Service") || leadPermission.includes("Delete Service")) && (
  <>
  
                        <td className="d-flex  align-items-center">
                          <FiEdit
                            className="f-20 pointer parimary-color"
                            color="#0E1073"
                            onClick={() => {
                              setFormData(res);
                              setEditModal(true);
                            }}
                          />

                          <div className="line mx-3"></div>

                          <BsTrash
                            className="f-20 pointer parimary-color"
                            color="#0E1073"
                            onClick={() => {
                              setDeleteBand(res?._id);
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
              ):(
                <>
                <Error403 />
             </>
              )}</>
             
            )}
          {/* </div>
          
        </div> */}
      </Content>




    </>
  );
}
