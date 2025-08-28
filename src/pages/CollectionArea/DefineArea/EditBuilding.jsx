import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { deleteDefineArea, updateDefineAreaOfCollection, getBuildingInfo } from "../../../service/admin";
import { userId } from "../../../assets/userLoginInfo";
import { success } from "../../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Loader from "../../../components/commonComponent/loader/Loader";
import { IoArrowBack } from "react-icons/io5";
import TableSkeleton from "../../../AppComponents/Skeleton/TableSkeleton";

export default function EditBuilding({
  EditBuildingModule,
  setEditBuildingModule,
  getBuildingData,
  getDataByIdOfCollection,
  resEditData,
  getAllAreaData
}) {
  const [buildingData, setBuildingData] = useState([{ name: "Building 1" }, { name: "Building 2" }]);
  function toggle() {
    setEditBuildingModule(!EditBuildingModule);
  }

  const [updateBuildingModal, setUpdateBuildingModal] = useState(false);
  const [getBuildingById, setGetBuildingById] = useState("");
  const [changeBuilding, setChangeBuilding] = useState("");
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [getResId, setGetResId] = useState("");
  const [getCollectionByID, setGetCollectionById] = useState([]);

  function toggle1() {
    setUpdateBuildingModal(!updateBuildingModal);
    
  }

  const deteteData = async () => {
    setLoader(true);
    try {
      let payload = {
        role: "building",
        _id: getResId._id
      };
      let res = await deleteDefineArea(payload);
      dispatch(
        success({
          show: true,
          msg: "Delete Building successfully",
          severity: "success"
        })
      );
      getBuildingDatass()

    } catch (err) {
      console.log(err);
    } finally {
      setDeleteModal(false);
      setLoader(false);
    }
  };

  const updateBuilding = async e => {
    e.preventDefault();
    setLoader(true);

    let payload = {
      name: changeBuilding,
      role: "building",
      _id: getBuildingById?._id,
      updatedBy: userId()
    };
    try {
      let res = await updateDefineAreaOfCollection(payload);
      
      dispatch(
        success({
          show: true,
          msg: "Updated Building successfully",
          severity: "success"
        })
      );
      // getDataByIdOfCollection();
      getBuildingDatass()
    } catch (err) {
      console.log(err);
    } finally {
      setUpdateBuildingModal(false);
      setLoader(false);
     

    }
  };

  const getBuildingDatass = async () => {
    setLoader(true);

    let payload = {
      area_id: resEditData._id,
      street_id: getBuildingData._id
    };
    try {
      let res = await getBuildingInfo(payload)
      
      setGetCollectionById(res?.data?.data)
    } catch (err) {
      console.log(err);
    }finally{
    setLoader(false);

    }
  };

  useEffect(() => {
    
    getBuildingDatass()
  }, [getBuildingData]);
  useEffect(()=>{

  },[resEditData])

  return (
    <div>
      {loader && (
        <>
          <Loader />
        </>
      )}

      {/* delete Modal */}

      <Modal size="md" isOpen={deleteModal}>
        <ModalBody>
          <div>Are you sure you want to delete this Buliding?</div>
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

      <Modal centered scrollable isOpen={updateBuildingModal} size="md">
        <ModalHeader toggle={toggle1}>
          <div className="f-24">Edit Building</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={updateBuilding}>
            <div className="row">
              <label>Building</label>
              <input
                type="text"
                required
                className="form-control"
                defaultValue={getBuildingById?.name}
                onChange={e => {
                  if (e.target.value === " ") {
                    e.target.value = "";
                  } else {
                    setChangeBuilding(e.target.value);
                  }
                }}
              />
            </div>
            <div className="mt-4 d-flex justify-content-end">
              <button className="btn text-primary mr-3" type="button" onClick={toggle1}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      <Modal centered scrollable isOpen={EditBuildingModule} size="md">
        <ModalHeader toggle={toggle}>
          <div className="f-24" onClick={(toggle)}> <IoArrowBack className="mr-2 pointer text-primary" />{getBuildingData?.name}</div>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12 fw-600 fs-26">
              Building {`(${getBuildingData?.buildings?.length ? getBuildingData?.buildings?.length : ""})`}
            </div>
          </div>
          <div className="mt-3">
            <div className="">
              <Table>
                <tbody>
                  {getCollectionByID?.map((res, index) => {
                    return (
                      <tr className="border rounded">
                        <td style={{ width: "90%" }}>{res?.name}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FiEdit
                              className="f-20 pointer parimary-color mr-2"
                              color="#0E1073"
                              onClick={() => {
                                setUpdateBuildingModal(true);
                                setGetBuildingById(res);
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
          {/* <div className="mt-4 d-flex justify-content-end mr-3">
            <button className="btn text-primary mr-3" type="button" onClick={toggle}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => setEditBuildingModule(false)}>
              Save Changes
            </button>
          </div> */}
        </ModalBody>
      </Modal>
    </div>
  );
}
