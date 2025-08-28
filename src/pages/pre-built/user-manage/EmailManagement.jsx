import React, { useEffect, useState } from "react";
import { BlockHead, BlockHeadContent, BlockTitle } from "../../../components/Component";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { addBccemail, getBccEmail, deleteBccEmail } from "../../../service/admin";
import { permisionsTab, userId } from "../../../assets/userLoginInfo";
import Loader from "../../../components/commonComponent/loader/Loader";
import moment from "moment";
import { BsTrash } from "react-icons/bs";
import { error } from "../../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Error403 from "../../../components/error/error403";

export default function EmailManagement() {
  const [open, setOpen] = useState(false);
  const [addEmail, setEmail] = useState();
  const toggle = () => setOpen(!open);
  const [loader, setLoader] = useState(false);
  const [bccEmail, setBccEmail] = useState([]);
  const [deleteEmail, setDeleteEmail] = useState();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dispatch = useDispatch();
  const [emailPermission, setEmailPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();
    

    const permissions = res.filter((s) => s.tab_name === "Email Management");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
      setEmailPermission(permissionArr);
    }
  }

  const deleteBccEmailById = async () => {
    setLoader(true);
    await deleteBccEmail(deleteEmail._id)
      .then((res) => {
        setLoader(false);
        setDeleteOpen(false);
        getBccEmailList();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  const submitBcc = async () => {
    setLoader(true);
    let payloadData = {
      email: addEmail,
      createdBy: userId(),
    };
    await addBccemail(payloadData)
      .then((res) => {
        setLoader(false);
        setOpen(false);
        setEmail();
        getBccEmailList();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.errormessage.includes("Email already exist.")) {
          dispatch(
            error({
              show: true,
              msg: "Email already exist.",
              severity: "error",
            })
          );
        }
        setLoader(false);
      });
  };

  const getBccEmailList = async () => {
    setLoader(true);
    await permissionFunction();
    await getBccEmail()
      .then((res) => {
        let dataReverse = [...res.data.data];
        let reverseData = dataReverse.reverse();
        setLoader(false);
        setBccEmail(reverseData);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };
  useEffect(() => {
    getBccEmailList();
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
            Are you sure you want to delete this Bcc email?
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
                  deleteBccEmailById();
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
          <div className="head_min">Create New Bcc Email</div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              submitBcc();
              e.preventDefault();
            }}
          >
            <div>
              <label>Bcc</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn mr-2"
                  onClick={() => {
                    toggle();
                    setEmail();
                  }}
                >
                  Cancel
                </button>
                <button type="Submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <BlockHead size="lg">
        <BlockHeadContent>
          <BlockTitle tag="h4">Blind Carbon Copy</BlockTitle>
        </BlockHeadContent>
      </BlockHead>
      {permissionAccess ?(<> <div className="d-flex justify-content-end">
        {emailPermission.includes("Add Bcc") && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Add Bcc
            </button>
          </>
        )}
      </div>
      <div className="mt-5">
        {/* <div className="table-container mt-5"> */}
        <Table hover>
          <thead style={{ backgroundColor: "#F5F6FA" }}>
            <tr className="table-heading-size">
              <th>S.No</th>
              <th>Email</th>
              <th>Created On</th>
              {emailPermission.includes("Delete Bcc") && (
                <>
                  <th>Action</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {bccEmail.map((res, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{res.email}</td>
                  <td>{moment(res.createdAt).format("DD-MM-YYYY")}</td>
                  {emailPermission.includes("Delete Bcc") && (
                    <>
                      <td>
                        <BsTrash
                          className="f-20 fw-500 pointer parimary-color"
                          color="#0E1073"
                          onClick={() => {
                            setDeleteOpen(true);
                            setDeleteEmail(res);
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
        {/* </div> */}
      </div></>):(<><Error403/></>)}
     
    </>
  );
}
