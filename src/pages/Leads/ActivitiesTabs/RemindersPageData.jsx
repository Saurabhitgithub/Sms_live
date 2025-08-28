import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { AddReminderActiveLeads } from "../../../service/admin";
import Loader from "../../../components/commonComponent/loader/Loader";
import { userId, userInfo } from "../../../assets/userLoginInfo";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";
export default function RemindersPageData({ getDataById, getdataLeads }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [addDescription, setDescription] = useState("");
  const [followUpTime, setFollowUpTime] = useState();

  const [loader, setLoader] = useState(false);
  const paramsData = useParams();
  useEffect(() => {
    
  }, [getDataById]);

  const addReminderFunction = async () => {
    setLoader(true);
    let dateData = moment(followUpDate);
    let time = followUpTime.split(":");
    dateData.add(Number(time[0]), "hours");
    dateData.add(Number(time[1]), "minutes");
    // 
    const payloadData = {
      creator_id: userId(),
      creator_name: userInfo().name,
      note: addDescription.trim(),
      follow_up_date: dateData.format(),
      id: paramsData.id,
      // follow_up_time: followUpTime,
    };
    await AddReminderActiveLeads(payloadData)
      .then((res) => {
        // 
        setLoader(false);
        setIsOpen(false);
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
          <div className="head_min">Create New Reminder</div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addReminderFunction();
            }}
          >
            <div className="row mt-3">
              <div className="col-md-6">
                <label className="labels">Date</label>
                <input
                  className="form-control"
                  type="date"
                  required
                  onChange={(e) => {
                    setFollowUpDate(e.target.value);
                  }}
                />
              </div>
              <div className="col-md-6">
                <label className="labels">Time</label>
                <input
                  className="form-control"
                  type="time"
                  required
                  onChange={(e) => {
                    setFollowUpTime(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-12">
                <label className="labels">Notes</label>
                <textarea
                  className="form-control"
                  placeholder="Add Text"
                  rows="5"
                  required
                  onChange={(e) => {
                    setDescription(e.target.value);
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
              Add Reminder
            </button>
          </div>
        </>
      )}

      <div className="mt-4 fw-500 f-18 filter_label_color">{moment().format("MMM YYYY")}</div>
      <div className="mt-3">
        {getDataById?.reminder?.map((res) => {
          return (
            <div className="activity_List_style mt-3 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="fw-600 f-18">{res?.creator_name}</div>
                  <div className="ml-1 f-18">created a follow up</div>
                </div>
                <div className="ml-1 ">
                  {moment(res?.createdAt).format("MMM DD, YYYY ")} at {moment(res?.createdAt).format("h:mm a")}
                </div>
              </div>
              <div className="mt-2 fw-500 followUp_style_color">
                For {moment(res?.follow_up_date).format("DD MMM YYYY ")} at{" "}
                {moment(res?.follow_up_date).format("h:mm a")}
              </div>
              {/* {} */}
              <div className="mt-2 f-400 f-18">{res?.note}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
