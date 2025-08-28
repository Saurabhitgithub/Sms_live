import React, { useEffect } from "react";
import moment from "moment";

export default function EmailPageData({ getDataById }) {
  useEffect(() => {
   
    
  }, [getDataById]);
  return (
    <div>
      <div className="mt-4 fw-500 f-18 filter_label_color">{moment().format("MMM YYYY")}</div>
      <div className="mt-3">
       
        {getDataById?.email_log?.map((res) => {
          return (
            <div className="activity_List_style mt-3 p-3">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-12">
                  <div className="fw-600 f-18">{res?.sub}</div>
                </div>
                <div className="col-md-6 col-sm-6 col-12 w-100 d-flex justify-content-md-end justify-contetn-sm-end justify-content-start">
                  <div className="fw-500 text-nowrap">
                    Sent {moment(res?.createdAt).format("MMM DD, YYYY ")} at {moment(res?.createdAt).format("h:mm a")}
                  </div>
                </div>
              </div>
              
              <div className="d-flex align-items-center mt-2">
                <span className="fw-500 f-18 filter_label_color">To:</span>
                <span className="ml-2">
                  <span className="fw-600 f-16">{getDataById?.full_name}</span>
                  <span className="pl-2">{`<${getDataById?.email}>`}</span>
                </span>
              </div>
              <div className="mt-3 f-400 f-18">
                {res?.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
