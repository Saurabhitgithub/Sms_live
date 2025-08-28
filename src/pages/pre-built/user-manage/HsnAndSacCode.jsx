import React, { useEffect, useState } from "react";
import { BlockHead, BlockHeadContent, BlockTitle } from "../../../components/Component";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { hsnAndSacAdd, getHsnandSacCode, hsnAndSacDelete } from "../../../service/admin";
import Loader from "../../../components/commonComponent/loader/Loader";
import moment from "moment";
import { BsTrash } from "react-icons/bs";
import { error, success } from "../../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import { permisionsTab } from "../../../assets/userLoginInfo";
import Error403 from "../../../components/error/error403";

export default function HsnAndSacCode() {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
    setSelectItem();
    setAddCode();
  };
  let optionLabel = [
    { value: "internet service", label: "Internet Service" },
    // { value: "router", label: "Router" },
    // { value: "cable", label: "Cable" },
  ];
  const [hsnPermission, setHsnPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();
    

    const permissions = res.filter((s) => s.tab_name === "HSN/SAC Code");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
      setHsnPermission(permissionArr);
    }
  }
  const [selectItem, setSelectItem] = useState();
  const [addCode, setAddCode] = useState();
  const [loader, setLoader] = useState(false);
  const [getHnsAndSac, setGetHsnAndSac] = useState([]);
  const [deleteId, setDeleteId] = useState();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [existData, setExistData] = useState("");
  const dispatch = useDispatch();

  const addHsnAndSacFunction = async () => {
    setLoader(true);
    let PayloadData = {
      code: addCode,
      item: selectItem,
    };
    await hsnAndSacAdd(PayloadData)
      .then((res) => {
        setLoader(false);
        setOpen(false);
        setSelectItem();
        setAddCode();
        getData();
        dispatch(
          success({
            show: true,
            msg: "HSN/SAC code add successfully",
            severity: "error",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  const getData = async () => {
    setLoader(true);

    await permissionFunction();
    await getHsnandSacCode()
      .then((res) => {
        let dataReverse = [...res.data.data];
        let reverseData = dataReverse.reverse();
        setExistData(reverseData.map((e) => e.item));
        setGetHsnAndSac(reverseData);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  const deleteFunction = async () => {
    setLoader(true);
    await hsnAndSacDelete(deleteId._id)
      .then((res) => {
        setLoader(false);
        setDeleteOpen(false);
        getData();
        dispatch(
          error({
            show: true,
            msg: "HSN/SAC code delete successfully",
            severity: "error",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal size="md" isOpen={deleteOpen}>
        <div className="p-4">
          <div className="d-flex align-items-center mt-2 h5_delete">
            Are you sure you want to delete this HSN/SAC Code?
          </div>
          <div className="mt-4 d-flex justify-content-end">
            <div className="d-flex">
              <button
                type="button"
                className="cancel_btn mr-2"
                onClick={() => {
                  setDeleteOpen(false);
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
        </div>
      </Modal>
      <Modal size="md" isOpen={open}>
        <ModalHeader toggle={toggle} style={{ font: "200px" }}>
          <div className="head_min">Create HSN/SAC Code</div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              {
                existData.includes(selectItem) ? <>""</> : addHsnAndSacFunction();
              }
            }}
          >
            <div>
              <label>Select Item</label>
              <SingleSelect
                placeItem="Item"
                options={optionLabel}
                required
                onChange={(e) => {
                  setSelectItem(e.target.value);
                }}
              />
              {existData?.includes(selectItem) && (
                <>
                  <p className="text-danger">This Item already exist</p>
                </>
              )}
            </div>
            <div className="mt-3">
              <label>Add Code</label>
              <input
                type="number"
                required
                className="form-control"
                placeholder="Enter Hsn / Sac Code"
                onChange={(e) => {
                  setAddCode(e.target.value);
                }}
              />
            </div>
            <div className="d-flex justify-content-end mt-4">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn mr-2"
                  onClick={() => {
                    setOpen(false);
                    setSelectItem();
                    setAddCode();
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <BlockHead size="lg">
        <BlockHeadContent>
          <BlockTitle tag="h4">HSN/SAC Code</BlockTitle>
        </BlockHeadContent>
      </BlockHead>
      {permissionAccess ? (
        <>
          {" "}
          <div className="d-flex justify-content-end">
            {hsnPermission.includes("Add HSN/SAC Code") && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Add HSN/SAC Code
                </button>
              </>
            )}
          </div>
          <div className="mt-5">
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr>
                  <th>S.No</th>
                  <th>HSN/SAC Code</th>
                  <th>Item</th>
                  <th>Created On</th>
                  {hsnPermission.includes("Delete HSN/SAC Code") && (
                    <>
                      <th>Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {getHnsAndSac.map((res, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{res?.code}</td>
                      <td className="text-capitalize">{res?.item}</td>
                      <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
                      {hsnPermission.includes("Delete HSN/SAC Code") && (
                        <>
                          {" "}
                          <td>
                            <BsTrash
                              className="f-20 fw-500 pointer parimary-color"
                              color="#0E1073"
                              onClick={() => {
                                setDeleteOpen(true);
                                setDeleteId(res);
                              }}
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <>
          <Error403 />
        </>
      )}
    </>
  );
}
