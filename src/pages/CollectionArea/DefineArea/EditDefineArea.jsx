import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import EditBuilding from "./EditBuilding";
import { deleteDefineArea, updateDefineAreaOfCollection ,getCollectionDetailsId} from "../../../service/admin";
import { userId } from "../../../assets/userLoginInfo";
import Loader from "../../../components/commonComponent/loader/Loader";
import { success } from "../../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";

export default function EditDefineArea({ editModule, setEditModule, resEditData, setResEditData, getAllAreaData }) {
 async function toggle() {
    setEditModule(!editModule);
    await getAllAreaData()
  }

  const [streetData, setStreetData] = useState([{ name: "street 1" }, { name: "street 2" }]);
  const [updateStreetModal, setUpdateStreetModal] = useState(false);
  const [EditBuildingModule, setEditBuildingModule] = useState(false);
  const [getStreet, setGetStreet] = useState("");
  const [changeArea, setChangeArea] = useState();
  const [changeStreet, setChangeStreet] = useState("");
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [getBuildingData, setgetBuildingData] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [getResId, setGetResId] = useState("");
  const [getCollectionByID,setGetCollectionById] = useState({})

  const updateDefineArea = async e => {
    e.preventDefault();

    setLoader(true);
    try {
      setChangeArea(resEditData?.name)
      let payload = {
        name: changeArea,
        role: "area",
        _id: resEditData?._id,
        updatedBy: userId()
      };
      let res = await updateDefineAreaOfCollection(payload);
      dispatch(
        success({
          show: true,
          msg: "Area Updated Successfully",
          severity: "success"
        })
      );
      getAllAreaData();
    } catch (err) {
      console.log(err);
    } finally {
      setEditModule(false);
      setLoader(false);
      
    }
  };

  const getDataByIdOfCollection = async()=>{
    // 
    try{
      let res = await getCollectionDetailsId(resEditData?._id)
      // 
      setGetCollectionById(res?.data?.data)
      

    }catch(err){
      console.log(err)
    }finally{
      
    }
  }

  const updateStreets = async e => {
    e.preventDefault();

    setLoader(true);
    try {
      let payload = {
        name: changeStreet,
        role: "street",
        _id: getStreet?._id,
        updatedBy: userId()
      };
      let res = await updateDefineAreaOfCollection(payload);
      getDataByIdOfCollection()
      dispatch(
        success({
          show: true,
          msg: "Updated Street successfully",
          severity: "success"
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
      setUpdateStreetModal(false);
     
    }
  };

  const deteteData = async () => {
    setLoader(true);
    try {
      let payload = {
        role: "street",
        _id: getResId._id
      };
      let res = await deleteDefineArea(payload);
      dispatch(
        success({
          show: true,
          msg: "Delete Street successfully",
          severity: "success"
        })
      );
      getDataByIdOfCollection()

    } catch (err) {
      console.log(err);
    } finally {
      setDeleteModal(false);
      setLoader(false);
      
    }
  };
  function toggle1() {
    setUpdateStreetModal(!updateStreetModal);
  }
  useEffect(() => {
    // 
    if(resEditData._id){

      getDataByIdOfCollection()
    }
  }, [resEditData]);
  // 
  return (
    <div>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <EditBuilding
        EditBuildingModule={EditBuildingModule}
        setEditBuildingModule={setEditBuildingModule}
        getBuildingData={getBuildingData}
        getDataByIdOfCollection={getDataByIdOfCollection}
        resEditData={resEditData}
        getAllAreaData={getAllAreaData}
      />

      {/* delete Modal */}

      <Modal size="md" isOpen={deleteModal}>
        <ModalBody>
          <div>Are you sure you want to delete this Street?</div>
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

      <Modal centered scrollable isOpen={updateStreetModal} size="md">
        <ModalHeader toggle={toggle1}>
          <div className="f-24">Edit Street</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={updateStreets}>
            <div className="row">
              <label>Street</label>
              <input
                required
                type="text"
                className="form-control"
                defaultValue={getStreet?.name}
                onChange={e => {
                  if (e.target.value === " ") {
                    e.target.value = "";
                  } else {
                    setChangeStreet(e.target.value);
                  }
                }}
              />
            </div>
            <div className="mt-4 d-flex justify-content-end">
              <button className="btn text-primary" type="button" onClick={toggle1}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      {/* edit Area moduleeeeee */}

      <Modal centered scrollable isOpen={editModule} size="lg">
        <ModalHeader toggle={toggle}>
          <div className="f-24">Edit</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={updateDefineArea}>
            <div className="row">
              <div className="col-md-12">
                <label>Area Name <span className="text-danger">*</span></label>
                <input
                  required
                  type="text"
                  className="form-control"
                  defaultValue={resEditData?.name}
                  placeholder="Enter Area Name"
                  onChange={e => {
                    if (e.target.value === " ") {
                      e.target.value = "";
                    } else {
                      setChangeArea(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="fw-600 fs-26 mt-4">
              Streets {`(${getCollectionByID?.streets?.length?getCollectionByID?.streets?.length:"---"})`}
            </div>
            <div className="mt-3">
              <div className="">
                <Table>
                  <tbody>
                    {/* {} */}
                    {getCollectionByID?.streets?.map((res, index) => {
                      return (
                        <tr className="border rounded">
                          <td
                            style={{ width: "90%" }}
                            className="pointer"
                            onClick={() => {
                              setEditBuildingModule(true);
                              setgetBuildingData(res);
                            }}
                          >
                            {res?.name}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FiEdit
                                className="f-20 pointer parimary-color mr-2"
                                color="#0E1073"
                                onClick={() => {
                                  setUpdateStreetModal(true);
                                  setGetStreet(res);
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
            </div>
            <div className="mt-4 d-flex justify-content-end">
              <button className="btn text-primary mr-3" type="button" onClick={toggle}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
