import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function DiscussionActivity({ getDataById, getdataLeads }) {

  useEffect(() => {
  }, [getDataById]);

  return (
    <>
      <div className="mt-4 fw-500 f-18 filter_label_color">{moment().format("MMM YYYY")}</div>
      
      {getDataById?.proposal_info?.map((res1) => (
        <>
          {res1.comment?.map((res) => {
            return (
              <div className="activity_List_style mt-3 p-3">
               
                <div className="d-flex justify-content-between align-items-center">
                  <div className="f-18 fw-500">{res1?.invoice_no}</div>
                  <div>
                    {moment(res?.createdAt).format("MMM DD, YYYY ")} at {moment(res?.createdAt).format("h:mm:ss a")}
                  </div>
                </div>
                <div>{res?.msg}</div>
              </div>
            );
          })}
        </>
      ))}
    </>
  );
}
