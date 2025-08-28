import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Modal, ModalBody, Table } from "reactstrap";
import AddAndUpdateBng from "./AddAndUpdateBng";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { getAllBngData, deleteBngData } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { PaginationComponent } from "../../components/Component";
import ViewBngAttribute from "./ViewBngAttribute";

export default function BngListing() {
  const [open, setOpen] = useState({ mode: "", status: false, data: {} });
  const [getAllData, setGetAllData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLeads, setDeleteLeads] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const dispatch = useDispatch();
  const [allPlan, setAllPlan] = useState([]);

  const [openView,setOpenView] = useState({status:false,data:{}})

  let [page, setPage] = useState(1);
  let itemPerPage = 8;

  const getAllDataFunction = async () => {
    setLoader(true);
    try {
      const response = await getAllBngData().then((res) => res.data.data);
      setGetAllData(response);
      setAllPlan(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const deleteDataFunction = async () => {
    setLoader(true);
    try {
      await deleteBngData(deleteLeads._id);
      getAllDataFunction();
      dispatch(
        success({
          show: true,
          msg: "Bng deleted successfully",
          severity: "success",
        })
      );
      setOpenDeleteModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllDataFunction();
  }, []);

  // Filter data based on search query
  const filteredData = getAllData.filter(
    (attribute) =>
      attribute.bng_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attribute.attributes.some((attr) =>
        attr.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Paginate the filtered data
  const paginatedData = filteredData.slice(
    (page - 1) * itemPerPage,
    page * itemPerPage
  );

  return (
    <>
      <Modal size="md" isOpen={openDeleteModal}>
        <ModalBody>
          <div>Are you sure you want to delete this Bng?</div>
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex">
              <button
                type="button"
                className="cancel_btn mr-2"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={deleteDataFunction}>
                Delete
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {loader && <Loader />}

      <AddAndUpdateBng
        open={open.status}
        setOpen={setOpen}
        mode={open.mode}
        editData={open.data}
        getAllDataFunction={getAllDataFunction}
      />
      <ViewBngAttribute
      open={openView.status}
      setOpen={setOpenView}
      viewData={openView.data}
      />

      <Content>
        <div className="card_container p-md-4 p-sm-3 p-3">
          <div className="topContainer">
            <div className="f-28">Bng Attribute</div>
            <button
              className="btn btn-primary"
              onClick={() => setOpen({ mode: "add", status: true, data: {} })}
            >
              Add Bng Attributes
            </button>
          </div>

          <div className="row mt-4">
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-8 col-12">
              <SearchInput
                placeholder={"Search by Name or Attributes..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
              />
            </div>
          </div>

          <div className="mt-5">
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>S.No</th>
                  <th>Bng Name</th>
                  <th>Attribute</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((attribute, index) => (
                    <tr key={index}>
                      <td>{(page - 1) * itemPerPage + index + 1}</td>
                      <td className="pointer" onClick={() =>{
                              setOpenView({
                                status: true,
                                data: attribute,
                              });
                            }
                            }>{attribute?.bng_name}</td>
                      <td>{attribute?.attributes?.slice(0, 3)?.join(" ,")}</td>
                      <td style={{ width: "5%" }}>
                        <div className="d-flex align-items-center">
                          <FiEdit
                            className="f-20 pointer primary-color mr-2"
                            color="#0E1073"
                            onClick={() =>
                              setOpen({
                                mode: "edit",
                                status: true,
                                data: attribute,
                              })
                            }
                          />
                          <BsTrash
                            className="f-20 fw-500 pointer primary-color"
                            color="#0E1073"
                            onClick={() => {
                              setOpenDeleteModal(true);
                              setDeleteLeads(attribute);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center mt-1">
            <PaginationComponent
              currentPage={page}
              itemPerPage={itemPerPage}
              paginate={(d) => setPage(d)}
              totalItems={filteredData.length} // Use filteredData count for pagination
            />
          </div>
        </div>
      </Content>
    </>
  );
}
