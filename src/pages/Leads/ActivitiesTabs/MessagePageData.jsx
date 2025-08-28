import React from "react";

export default function MessagePageData() {
  return (
    <div>
      <div className="mt-4 fw-500 f-18 filter_label_color">June 2024</div>
      <div className="mt-3">
        <div className="activity_List_style mt-3 p-3">
          {/* <div className="d-flex justify-content-between align-items-center">
            <div className="fw-600 f-18">Message</div>
            <div>June 27, 2024 at 12:19 PM</div>
          </div> */}
          <div className="row">
            <div className="col-md-6 col-sm-6 col-12">
              <div className="fw-600 f-18">Message</div>
            </div>
            <div className="col-md-6 col-sm-6 col-12 w-100 d-flex justify-content-md-end justify-contetn-sm-end justify-content-start">
              <div className="fw-500 text-nowrap">Sent June 27, 2024 at 12:19 PM</div>
            </div>
          </div>
          <div className="mt-2 fw-600 f-18">Plan Expiration on 05-July-2024</div>
          <div className="mt-2 f-400 f-18">
            Your plan is going to expire on 05-July-2024. Please recharge on time to get uninterrupted services.
          </div>
        </div>
      </div>
    </div>
  );
}
