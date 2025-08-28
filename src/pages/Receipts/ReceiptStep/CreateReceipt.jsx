import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import style from "./style.module.css";
import { Label, Input } from "reactstrap";
import { IoPersonSharp } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";
import SingleSelect from "../../../components/commonComponent/singleSelect/SingleSelect";
import { FaHashtag } from "react-icons/fa";
import { Table } from "reactstrap";
import { FaFilePdf } from "react-icons/fa";
import { uid } from "uid";
import { addReceipts } from "../../../service/admin";

import { getInvoiceDataById } from "../../../service/admin";
import moment from "moment";
import Loader from "../../../components/commonComponent/loader/Loader";
import { exportCsv } from "../../../assets/commonFunction";
import { userInfo } from "../../../assets/userLoginInfo";

const CreateReceipt = ({ getAllDataReceipts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [userId, setUserId] = useState(uid());
  
  const [loader, setLoader] = useState(false);
  const [exportData, setExportData] = useState([]);

  const [filterData, setFilterData] = useState();
  const handleOpen = () => {
    setIsOpen(true);
    setActiveStep(1);
  };

  const [data, setData] = useState([]);
  const toggle = () => setIsOpen(false);

  const getData = async () => {
    try {
      const res = await getInvoiceDataById("664645a80522c3d5bc318cd2");
      
      setData(res.data.data);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  const AddRecieptsFunction = async () => {};

  useEffect(() => {
    getData();
    setUserId(uid())
  }, []);
  const userData = [
    {
      Receipt_No: "123456",
      Created_On: "22 June 2024",
      Zone: "North",
      Name: "Shubham",
      Phone_No: "+91 9876543210",
      Amount: "Rs 1000",
      Created_By: "Infinity",
      Mode: "UPI",
      Status: "Paid",
    },
  ];
  const handleSubmit1 = (e) => {
    e.preventDefault();
    setActiveStep(2);
    
  };
  const handleSubmit2 = async (e) => {
    setLoader(true);
    e.preventDefault();
    let payLoadData = {
      zone: "string",
      notes: "string",
      receipt_no: userId,
      invoice_id: filterData?._id,
      user_id: filterData?.subscriberInfo._id,
      plan_id: filterData?.planInfo._id,
      creator_id: userInfo()._id,
    };
    await addReceipts(payLoadData)
      .then((res) => {
        
        setLoader(false);
        setIsOpen(false);
        getAllDataReceipts();
        setFilterData()
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const TableRow = ({ label, value, style }) => (
    <tr>
      <td className="text-nowrap">{label}</td>
      <td className="text-nowrap" style={style}>
        {value}
      </td>
    </tr>
  );

  return (
    <div>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <button className="btn_primary_btn" onClick={handleOpen}>
        Generate Receipts
      </button>
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle} style={{ font: "200px" }}>
          <div className="head_min">New Receipt</div>
        </ModalHeader>
        <ModalBody>
          {activeStep === 1 && (
            <div>
              <div className={`${style.Grid_Style_template}`}>
                <div className={`${style.child_container}`}>
                  <div>
                    {" "}
                    <FaHashtag size={30} color="gray" />
                  </div>
                  <div className="ml-md-2">
                    <div>Invoice Number:</div>
                    <div style={{ marginTop: "8px" }}>{filterData?.invoice_no}</div>
                  </div>
                  <div>
                    {" "}
                    <div>Created on:</div>
                    <div style={{ marginTop: "8px" }}>{moment(filterData?.createdAt).format("YYYY-MM-DD")}</div>
                  </div>
                </div>
                <div className={`${style.verticle_line}`}></div>
                <div className={`${style.child_container}`}>
                  <div>
                    {" "}
                    <IoPersonSharp size={30} color="gray" />
                  </div>
                  <div>
                    <div className="ml-md-3">User Name:</div>
                    <div className="px-md-3" style={{ marginTop: "8px" }}>
                      {filterData?.subscriberInfo?.userName}
                    </div>
                  </div>
                  <div>
                    {" "}
                    <div className="ml-md-1 mt-md-1">Phone Number:</div>
                    <div style={{ marginTop: "8px" }}>{filterData?.subscriberInfo?.mobile_number}</div>
                  </div>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit1(e);
                }}
              >
                <p className={`${style.para_headings} mt-5`}>Receipt Settings</p>
                <hr />
                <div class="container">
                  <div class="row">
                    <div class="col">
                      <Label className="labels mt-2">Created By</Label>
                      <Input placeholder="Admin" disabled name="user_name" className="mt-2" />
                    </div>
                    {/* <div class="col">
                    <Label className="labels mt-2 ">Zone</Label>
                    <SingleSelect placeholder={"Select Zone"} name={"Zone"} className="mt-2" />
                  </div> */}
                  </div>
                </div>
                <p className={`${style.para_headings} mt-5`}>Invoice Selection</p>
                <hr />
                <div class="container">
                  <div class="row align-items-stretch">
                    <div class="col-12 col-md-4 mb-3 mb-md-0 ">
                      <div class="form-group  h-100">
                        <label for="invoice_number" class="labels">
                          Invoice Number
                        </label>
                        <SingleSelect
                          id="invoiceNumber"
                          name="Zone"
                          placeItem="Invoice Number"
                          class="form-control mt-2"
                          options={data.map((res) => {
                            return { value: res._id, label: res.invoice_no };
                          })}
                          required
                          // value={filterData}
                          onChange={(e) => {
                            
                            let filterDatas = data.filter((s) => s?._id === e?.target?.value)[0];
                            
                            setFilterData(filterDatas);
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-12 col-md-4 mb-3 mb-md-0 ">
                      <div class={`form-group ${style.form_group}`}>
                        <label for="userName" class="labels">
                          User Name
                        </label>
                        <Input
                          id="userName"
                          placeholder="User Name"
                          value={filterData?.subscriberInfo?.userName}
                          disabled
                          name="user_name"
                          class="form-control"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-md-4 mb-3 mb-md-0 ">
                      <div class="form-group  h-100">
                        <label for="phoneNumber" class="labels">
                          Phone Number
                        </label>
                        <Input
                          id="phoneNumber"
                          placeholder="Phone Number"
                          name="user_name"
                          value={filterData?.subscriberInfo?.mobile_number}
                          type="number"
                          class="form-control mt-2"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 d-flex justify-content-end mt-5 p-0 ">
                  <button className="cancel_btn mr-2" onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn_primary_btn" type="submit">
                    Next <GoArrowRight size={24} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <div className={`${style.Grid_Style_template}`}>
                <div className={`${style.child_container}`}>
                  <div>
                    {" "}
                    <FaHashtag size={30} color="gray" />
                  </div>
                  <div>
                    <div>Invoice Number:</div>
                    <div style={{ marginTop: "8px" }}>{filterData?.invoice_no}</div>
                  </div>
                  <div>
                    {" "}
                    <div>Created on:</div>
                    <div style={{ marginTop: "8px" }}>{moment(filterData?.createdAt).format("YYYY-MM-DD")}</div>
                  </div>
                </div>
                <div className={`${style.verticle_line}`}></div>
                <div className={`${style.child_container}`}>
                  <div class="px-3">
                    {" "}
                    <IoPersonSharp size={30} color="gray" />
                  </div>
                  <div>
                    <div>User Name:</div>
                    <div style={{ marginTop: "8px" }}>{filterData?.subscriberInfo?.userName}</div>
                  </div>
                  <div>
                    {" "}
                    <div>Phone Number:</div>
                    <div style={{ marginTop: "8px" }}>{filterData?.subscriberInfo?.mobile_number}</div>
                  </div>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit2(e);
                }}
              >
                <div class="mt-5">Invoice Details</div>
                <div className="mt-2">
                  <div>
                    <Table hover responsive style={{ width: "100%" }}>
                      <tbody>
                        {/* {userData?.map((item, key) => ( */}
                        <React.Fragment>
                          <TableRow label="Receipt No." value={userId} />
                          <TableRow label="Created On" value={moment().format("YYYY-MM-DD")} />
                          {/* <TableRow label="Zone" value={item.Zone} /> */}
                          <TableRow label="Name" value={filterData?.subscriberInfo?.userName} />
                          <TableRow label="Phone No" value={filterData?.subscriberInfo?.mobile_number} />
                          <TableRow label="Amount" value={filterData?.invoice_table?.total_amount} />
                          <TableRow label="Created By" value={"Admin"} />
                          <TableRow
                            label="Status"
                            // value={item.Status}
                            // style={item.Status === "Paid" ? { color: "green" } : {}}
                            value={"Paid"}
                          />
                        </React.Fragment>
                        {/* ))} */}
                      </tbody>
                    </Table>
                  </div>
                </div>
                <div className="col-md-12 d-flex  justify-content-end mt-5 p-0 mb-2">
                  <button className="cancel_btn mr-2" onClick={() => setActiveStep(1)}>
                    Back
                  </button>
                  <button className="btn_primary_btn" type="submit">
                    Genrate Receipt
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* {activeStep === 3 && (
            <div>
              <p className={`${style.para_headings} mt-3`}>Subscriber Selection</p>
              <p style={{ fontWeight: "400" }}>Please enter any notes you want to add in the receipt</p>
              <Input
                className="mt-2"
                name="notes"
                type="text"
                placeholder="Please enter any notes you want to add in the receipt"
              />
              <button className={`${style.receipt_btn} mt-5`}>Generate Receipt</button>
              <p className={`${style.para_headings} mt-5`}>Generated Receipt</p>
              <div className="d-flex flex-row">
                <div class="ml-1">
                  <FaFilePdf color="red" size={30} />
                </div>
                <div class="ml-3">
                  <div>arnav_123 Invoice</div>
                  <div style={{ color: "#0E1073", cursor: "pointer" }}>Download</div>
                </div>
              </div>

              <div className="col-md-12 d-flex  justify-content-end mt-5 p-0 mb-2">
                <button className="btn_primary_btn" onClick={() => setIsOpen(false)}>
                  Done
                </button>
              </div>
            </div>
          )} */}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CreateReceipt;
