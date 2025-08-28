import React, { useEffect, useState, useRef } from "react";
import Content from "../../layout/content/Content";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, Table } from "reactstrap";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import IspCreateAndUpdate from "./IspCreateAndUpdate";
import { getAllIsp, deleteIspById } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import { FiEdit } from "react-icons/fi";
import { PaginationComponent } from "../../components/Component";
import { paginateData } from "../../utils/Utils";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";
import { BsTrash } from "react-icons/bs";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export default function IspManagementList() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState({ mode: "", status: false, data: null });
  const [icon, setIcon] = useState(true);
  const [allIsp, setIsp] = useState([]);
  const [getAllData, setGetAllData] = useState([]);
  const [loader, setLoader] = useState(false);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
const dispatch = useDispatch();
  const history = useHistory();

  const getAllIspDataFunction = async () => {
    setLoader(true);
    try {
      let response = await getAllIsp({all:false}).then(res => {
        return res.data.data;
      });
      let reverseData = response.reverse();
      setAllPlan(reverseData);
      setAllPlanData(reverseData);
      const datas = paginateData(page, itemPerPage, reverseData);
      setGetAllData(datas);
      let exportInfo = reverseData.map(e => {
        return {
          "Isp Name": e?.admin_name,
          Email: e?.admin_email,
          "Mobile number": e.admin_contact
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
        let res = await deleteIspById(deleteId._id);
        setDeleteModal(false);
        getAllIspDataFunction();
        dispatch(
          success({
            show: true,
            msg: "Isp deleted successfully",
            severity: "success"
          })
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(false);
      }
    };

  useEffect(() => {
    getAllIspDataFunction();
  }, []);

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
          const fullname = res?.admin_name?.toLowerCase() || "";
          const mobileNumber = (res?.admin_contact?.toString() || "").toLowerCase();
          const emsil = (res?.admin_email?.toString() || "").toLowerCase();
          return fullname.includes(val) || mobileNumber.includes(val) || emsil.includes(val);
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setGetAllData(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanData);
    setGetAllData(ddd);
  }, [page]);

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

    pdf.save("Isp Management.pdf");
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
      {loader && (
        <>
          <Loader />
        </>
      )}

      <div style={{ width: "1000px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden"
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
              <h3> Isp Management</h3>
              <div>
                <img src={logo} width={100} alt="" />
              </div>
            </div>
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Isp Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                </tr>
              </thead>
              <tbody>
                {getAllData.map((res, index) => {
                  return (
                    <tr key={index}>
                      <td >{res?.admin_name}</td>
                      <td>{res?.admin_email}</td>
                      <td>{res?.admin_contact}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <Modal size="md" isOpen={deleteModal}>
              <ModalBody>
                <div>Are you sure you want to delete this {deleteId?.admin_name}?</div>
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
      <div className="card_container p-md-4 p-sm-3 p-3">
        <div className="topContainer">
          <div className="f-28">Isp Management</div>
          <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
            <div className="dropdown_logs ">
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                  Export
                  <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <ExportCsv exportData={exportData} filName={"Isp Management"} />
                  </DropdownItem>
                  <DropdownItem>
                    <div onClick={convertToImg}>PDF</div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="line ml-4 mr-4"></div>
            <div>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setOpen({ mode: "add", status: true, data: null })}
              >
                Create Isp
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 d-flex flex-row justify-content-between">
          <div>
            <SearchInput placeholder={"Enter Name"} onChange={handleSearchClick} />
          </div>
        </div>
        <div className="mt-5 ">
          <Table hover>
            <thead style={{ backgroundColor: "#F5F6FA" }}>
              <tr className="table-heading-size">
                <th>Isp Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getAllData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td onClick={()=>{history.push(`/ispManagementList/ispview/${item?._id}`)}} className="pointer">{item?.admin_name}</td>
                    <td>{item?.admin_email}</td>
                    <td>{item?.admin_contact}</td>
                    <td style={{ width: "5%" }}>
                      <div className="d-flex align-items-center">
                        <FiEdit
                          className="f-20 pointer parimary-color mr-2"
                          color="#0E1073"
                          onClick={() => setOpen({ mode: "edit", status: true, data: item })}
                        />
                        <BsTrash
                          className="f-20 fw-500 pointer parimary-color"
                          color="#0E1073"
                          onClick={() => {
                            setDeleteModal(true);
                            setDeleteId(item);
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
      <IspCreateAndUpdate
        open={open.status}
        setOpen={setOpen}
        mode={open.mode}
        editData={open.data}
        getAllIspDataFunction={getAllIspDataFunction}
      />
    </Content>
  );
}
