import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Modal, ModalBody, Table } from "reactstrap";
import CreateNewTemplate from "./CreateNewTemplate";
import { getTemplateData, deleteTemplateById, templateToggleOnOff } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ViewPdfTemplate from "./ViewPdfTemplate";
import { permisionsTab } from "../../assets/userLoginInfo";
import Error403 from "../../components/error/error403";

export default function PdfTemplate() {
  const [openModal, setOpenModal] = useState({ mode: "", status: false, data: {} });
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const [getAllData, setGateAllData] = useState([]);
  const [getDataList, setGetDataList] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTemplate, setDeleteTemplate] = useState("");
  const [viewTemplateData, setViewTemplateData] = useState("");
  const [view, setView] = useState(false);

      const [leadPermission, setLeadPermission] = useState([]);
      const [permissionAccess, setPermissionAccess] = useState(true);
    
      async function permissionFunction() {
        const res = await permisionsTab();
    
       
        const permissions = res.filter(s => s.tab_name === "Email Template");
        if (permissions.length !== 0) {
          setPermissionAccess(permissions[0]?.is_show);
          let permissionArr = permissions[0]?.tab_function
            ?.filter(s => s.is_showFunction === true)
            .map(e => e.tab_functionName);
          setLeadPermission(permissionArr);
        }
      }

  const getData = async () => {
    setLoader(true);
    try {
      let res = await getTemplateData();
      
      setGateAllData(res.data.data);
      setGetDataList(res.data.data);
      permissionFunction()
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };
  const searchTemp = async text => {
    if (text) {
      if (text.trim().length !== 0) {
        setGetDataList(getAllData.filter(res => res.name.toLowerCase().includes(text)));
      } else {
        setGetDataList(getAllData);
      }
    } else {
      setGetDataList(getAllData);
    }
  };
  const disableEnableFunction = async id => {
    setLoader(true);
    try {
      let res = await templateToggleOnOff(id);

      getData();
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };
  const deletTemplateFunction = async () => {
    setLoader(true);

    await deleteTemplateById(deleteTemplate._id)
      .then(res => {
        
        setLoader(false);
        getData();
        setOpenDeleteModal(false);
        dispatch(
          success({
            show: true,
            msg: "Template delete successfully",
            severity: "success"
          })
        );
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Content>
      {loader && (
        <>
          <Loader />
        </>
      )}
{permissionAccess && leadPermission ? (
  <>
  <Modal size="md" isOpen={openDeleteModal}>
        <ModalBody>
          <div>Are you sure you want to delete this Template?</div>
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex">
              <button
                type="button"
                className="cancel_btn mr-2"
                onClick={() => {
                  setOpenDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  deletTemplateFunction();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <CreateNewTemplate
        open={openModal.status}
        mode={openModal.mode}
        editData={openModal.data}
        setOpen={setOpenModal}
        getData={getData}
      />
      <div className="card_container p-md-4 p-sm-3 p-3">
        <div className="topContainer">
          <div className="f-28">Pdf Template</div>
          <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
            <button className="btn btn-primary" onClick={() => setOpenModal({ mode: "add", status: true, data: {} })}>
              New Template
            </button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-8 col-12">
            <SearchInput placeholder={"Enter Name"} onChange={e => searchTemp(e.target.value.toLowerCase())} />
          </div>
        </div>
        {/* <div className="table-container mt-5"> */}
        <Table hover className="mt-5">
          <thead style={{ backgroundColor: "#F5F6FA" }}>
            <tr className="table-heading-size">
              <th>Template Name</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getDataList.map((res, index) => {
              return (
                <tr key={index}>
                  <td
                    className="pointer"
                    onClick={() => {
                      setView(true);
                      setViewTemplateData(res);
                    }}
                  >
                    {res?.name ? res?.name : "---"}
                  </td>
                  <td>
                    <div className="custom-control custom-control-sm custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input w-100"
                        id={`customSwitch-${index}`}
                        name="active_status"
                        checked={res.is_active}
                        onChange={e => disableEnableFunction(res._id)}
                      />
                      <label className="custom-control-label f-16 text-black" htmlFor={`customSwitch-${index}`}></label>
                    </div>
                  </td>
                  <td style={{ width: "5%" }}>
                    <div className="d-flex align-items-center">
                      <>
                        <FiEdit
                          className="f-20 pointer parimary-color mr-2"
                          color="#0E1073"
                          onClick={() => setOpenModal({ mode: "edit", status: true, data: res })}
                        />
                      </>

                      <>
                        <BsTrash
                          className="f-20 fw-500 pointer parimary-color"
                          color="#0E1073"
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteTemplate(res);
                          }}
                        />
                      </>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {/* </div> */}
      </div>
      <ViewPdfTemplate modal={view} setModal={setView} viewTemplateData={viewTemplateData} />
  </>
):(
  <>
  <Error403 />
  </>
)}
      
    </Content>
  );
}
