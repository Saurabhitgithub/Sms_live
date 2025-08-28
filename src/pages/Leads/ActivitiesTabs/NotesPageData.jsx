import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { addNotesActiveLeads } from "../../../service/admin";
import { userId, userInfo } from "../../../assets/userLoginInfo";
import Loader from "../../../components/commonComponent/loader/Loader";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";

export default function NotesPageData({ getDataById, getdataLeads }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(false);
  const [AddTitle, setAddTitle] = useState("");
  const [addDescription, setDescription] = useState("");
  const [loader, setLoader] = useState(false);

  const paramsData = useParams();
  useEffect(() => {}, [getDataById]);

  const addNotesFunction = async () => {
    setLoader(true);
    const payLoadData = {
      creator_id: userId(),
      desc: addDescription.trim(),
      title: AddTitle.trim(),
      creator_name: userInfo().name,
      id: paramsData.id,
    };
    await addNotesActiveLeads(payLoadData)
      .then((res) => {
        // 
        setIsOpen(false);
        setLoader(false);
        getdataLeads();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  return (
    <>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader
          toggle={toggle}
          style={{ font: "200px" }}
          className="d flex align-items-center justify-content-between"
        >
          <div className="head_min">New Note</div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNotesFunction();
            }}
          >
            <div className="row">
              <div className="col-md-12">
                <label className="labels">Title</label>
                <input
                  className="form-control"
                  placeholder="Enter title here"
                  required
                  onChange={(e) => {
                    if (e.target.value === " ") {
                      e.target.value = "";
                    } else {
                      setAddTitle(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="labels">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Enter description here"
                  rows="5"
                  required
                  onChange={(e) => {
                    if (e.target.value === " ") {
                      e.target.value = "";
                    } else {
                      setDescription(e.target.value);
                    }
                  }}
                ></textarea>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn mr-2"
                  onClick={() => {
                    setIsOpen(false);
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
      {getDataById?.lead_status === "converted" ? (
        <></>
      ) : (
        <>
          <div className="">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              New Note
            </button>
          </div>
        </>
      )}

      <div className="mt-4 fw-500 f-18 filter_label_color">{moment().format("MMM YYYY")}</div>
      <div className="mt-3">
        {getDataById?.notes?.map((res) => {
          return (
            <div className="activity_List_style mt-3 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-600 f-18">{res?.title}</div>
                <div>
                  {moment(res?.createdAt).format("MMM DD, YYYY ")} at {moment(res?.createdAt).format("h:mm:ss a")}
                </div>
              </div>
              <div className="mt-2 f-400 f-18">{res?.desc}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
