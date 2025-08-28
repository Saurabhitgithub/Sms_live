import React, { useEffect, useState } from "react";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import moment from "moment";

export default function Activities({ getDataById }) {
  // 
  let filterMonth = [
    { value: "24h", label: "24 hr ago" },
    { value: "1week", label: "One Week ago" },
    { value: "1Month", label: "One Month ago" },
    { value: "all", label: "All" },

  ];

  const [datafilter,setDataFilter] = useState([])

  function filterData(key) {
    let currentTime = moment();
    let newTime = moment(currentTime).subtract(24, "hours");
    let newWeek = moment(currentTime).subtract(1, "weeks");
    let newMonth = moment(currentTime).subtract(1, "months");
  
    if (key === "24h") {
      let activeData = getDataById?.activity_logs?.filter((e) => {
        // Log the condition to check if it's correct
        // 
        return newTime.isBefore(e.createdAt);
      });
      
      setDataFilter(activeData);
    }
    
    if (key === "1week") {
      let activeData = getDataById?.activity_logs?.filter((e) => {
        return newWeek.isBefore(moment(e.createdAt));
      });
      setDataFilter(activeData);
    }
  
    if (key === "1Month") {
      let activeData = getDataById?.activity_logs?.filter((e) => {
        return newMonth.isBefore(moment(e.createdAt));
      });
      setDataFilter(activeData);
    }
    if (key === "all") {
     
      setDataFilter(getDataById?.activity_logs);
    }
  
  }
  useEffect(() => {
    filterData("24h");
  }, [getDataById]);
  
  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <div className="mr-3 fw-500 f-18 filter_label_color">Filter by:</div>
          <div className="style_change_select">
            <SingleSelect options={filterMonth} placeItem="" onChange={(e)=>{filterData(e.target.value)}}/>
          </div>
        </div>
      </div>
      <div className="mt-4 fw-500 f-18 filter_label_color">{moment().format("MMM YYYY")}</div>
      <div className="mt-3">
        {datafilter?.map((res) => {
          return (
            <div className="activity_List_style mt-3 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-600 f-18">{res?.action}</div>
                <div>
                  {moment(res?.createdAt).format("MMM DD, YYYY ")} at {moment(res?.createdAt).format("h:mm:ss a")}
                </div>
              </div>
              <div className="mt-2 f-400 f-18">{res?.detail}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
