import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { FormGroup, Input } from "reactstrap";
import { getAdminbyId, getRoleDatabyId, updatePermission } from "../../service/admin";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../components/commonComponent/loader/Loader";
import {  useDispatch } from "react-redux";
import { success } from "../../Store/Slices/SnackbarSlice";
const IspView = () => {
    const dispatch = useDispatch();
  const [access, setAccess] = useState([
    {
      tab_name: "Dashboard",
      is_show: false,
      tab_function: [
        { tab_functionName: "Total Subscribers", is_showFunction: true },
        { tab_functionName: "Active Subscribers", is_showFunction: true },
        { tab_functionName: "Total Revenue", is_showFunction: true },
        { tab_functionName: "Invoice Paid", is_showFunction: true },
        { tab_functionName: "Active Plans", is_showFunction: true },
        { tab_functionName: "Total Active Users (Doughnut chart)", is_showFunction: true },
        { tab_functionName: "User Distribution (Doughnut chart)", is_showFunction: true },
        { tab_functionName: "Last Month Revenue (Bar Chart)", is_showFunction: true },
        { tab_functionName: "Total Revenue (Line chart)", is_showFunction: true },
        { tab_functionName: "Total Subscriber (Bar char)", is_showFunction: true }
      ]
    },
    {
      tab_name: "User Management",

      is_show: false,
      tab_function: [
        { tab_functionName: "Add User", is_showFunction: true },
        { tab_functionName: "Edit User", is_showFunction: true },
        { tab_functionName: "Delete User", is_showFunction: true },
        { tab_functionName: "View User", is_showFunction: true }
      ]
    },
    {
      tab_name: "Subscription Plan",
      is_show: false,
      tab_function: [
        { tab_functionName: "Add Plan", is_showFunction: true },
        { tab_functionName: "Edit Plan", is_showFunction: true },
        { tab_functionName: "Delete Plan", is_showFunction: true },
        { tab_functionName: "Import Plan", is_showFunction: true },
        { tab_functionName: "Export Plan", is_showFunction: true },
        { tab_functionName: "View Plan", is_showFunction: true }
      ]
    },
    {
      tab_name: "Subscriber Management",
      is_show: false,
      tab_function: [
        { tab_functionName: "Add Subscriber", is_showFunction: true },
        { tab_functionName: "Edit Subscriber", is_showFunction: true },
        { tab_functionName: "Delete Subscriber", is_showFunction: true },
        { tab_functionName: "View Subscriber", is_showFunction: true },
        { tab_functionName: "Subscriber Plan Tab", is_showFunction: true },
        { tab_functionName: "Subscriber Other Tab", is_showFunction: true },
      ]
    },

    {
      tab_name: "Bandwidth Management",
      is_show: false,
      tab_function: [
        { tab_functionName: "Add Bandwidth", is_showFunction: true },
        { tab_functionName: "Edit Bandwidth", is_showFunction: true },
        { tab_functionName: "Delete Bandwidth", is_showFunction: true },
        { tab_functionName: "View Bandwidth", is_showFunction: true }
      ]
    },
    {
      tab_name: "Service Management",
      is_show: false,
      tab_function: [
        { tab_functionName: "Add Service", is_showFunction: true },
        { tab_functionName: "Edit Service", is_showFunction: true },
        { tab_functionName: "Delete Service", is_showFunction: true },
        { tab_functionName: "View Service", is_showFunction: true }
      ]
    },

    {
      tab_name: "Email Template",
      is_show: false,
      tab_function: [
        // { tab_functionName: "Add  payment", is_showFunction: true },
        // { tab_functionName: "Edit Payment", is_showFunction: true },
        // { tab_functionName: "Delete Payment", is_showFunction: true },
        // { tab_functionName: "View Payment", is_showFunction: true },
      ]
    },
    {
      tab_name: "Invoices",
      is_show: false,
      tab_function: [
        { tab_functionName: "Invoice Management Tab", is_showFunction: true },
        { tab_functionName: "Add Invoice", is_showFunction: true },
        { tab_functionName: "View Invoice", is_showFunction: true },
        { tab_functionName: "Export Invoice", is_showFunction: true },
        { tab_functionName: "Change Invoice Status", is_showFunction: true },
        { tab_functionName: "Proposal Tab", is_showFunction: true },
        { tab_functionName: "View Proposal", is_showFunction: true },
        { tab_functionName: "Export Proposal", is_showFunction: true },
        { tab_functionName: "Change Proposal Status", is_showFunction: true }
      ]
    },
    {
      tab_name: "Reports",

      is_show: false,
      tab_function: [
        { tab_functionName: "Add  Report", is_showFunction: true },
        { tab_functionName: "Edit Report", is_showFunction: true },
        { tab_functionName: "Delete Report", is_showFunction: true }
      ]
    },
    {
      tab_name: "Activity Logs",
      is_show: false,
      tab_function: [
        { tab_functionName: "Export Activity", is_showFunction: true },
        { tab_functionName: "Event Log", is_showFunction: true },
        { tab_functionName: "Payment Log", is_showFunction: true }
      ]
    },
    {
      tab_name: "Role Management",
      is_show: false,
      tab_function: [
        { tab_functionName: "Add Role", is_showFunction: true },
        { tab_functionName: "Update Access", is_showFunction: true }
      ]
    },
    {
      tab_name: "Leads",
      is_show: false,
      tab_function: [
        { tab_functionName: "Leads Management Tab", is_showFunction: true },
        { tab_functionName: "Export Leads", is_showFunction: true },
        { tab_functionName: "New Leads", is_showFunction: true },
        { tab_functionName: "Edit Leads", is_showFunction: true },
        { tab_functionName: "Delete Leads", is_showFunction: true },
        { tab_functionName: "Assigned To", is_showFunction: true },
        { tab_functionName: "Status", is_showFunction: true },
        { tab_functionName: "Lead Comment/Conversation", is_showFunction: true },
        { tab_functionName: "Leads Configuration Tab", is_showFunction: true },
        { tab_functionName: "New Leads Configuration", is_showFunction: true },
        { tab_functionName: "Delete Leads Configuration", is_showFunction: true },
        { tab_functionName: "Leads Assignment Tab", is_showFunction: true },
        { tab_functionName: "Select Stages ( Leads Assignment )", is_showFunction: true },
        { tab_functionName: "Lead owner can view leads ( Leads Assignment )", is_showFunction: true }
      ]
    },

    {
      tab_name: "Payment Transaction",
      is_show: false,
      tab_function: [
        { tab_functionName: "Export Leads", is_showFunction: true },
        { tab_functionName: "Refund Payment", is_showFunction: true }
      ]
    },
    {
      tab_name: "Help Desk",
      is_show: false,
      tab_function: [
        { tab_functionName: "Help Desk Management Tab", is_showFunction: true },
        { tab_functionName: "Export Ticket", is_showFunction: true },
        { tab_functionName: "Raise Ticket", is_showFunction: true },
        { tab_functionName: "Priority Ticket", is_showFunction: true },
        { tab_functionName: "View Ticket", is_showFunction: true },
        { tab_functionName: "Help Desk Configuration Tab", is_showFunction: true },
        { tab_functionName: "New Help Desk Configuration", is_showFunction: true },
        { tab_functionName: "Delete Help Desk Configuration", is_showFunction: true },
        { tab_functionName: "Help Desk Assignment Tab", is_showFunction: true },
        { tab_functionName: "Select Stages ( Help Desk Assignment )", is_showFunction: true },
        { tab_functionName: "Ticket  owner can view Ticket  ( Help Desk Assignment )", is_showFunction: true }
      ]
    },
    {
      tab_name: "Invoice Settings",
      is_show: false,
      tab_function: []
    },
    {
      tab_name: "Email Management",
      is_show: false,
      tab_function: [
        { tab_functionName: "Add Bcc", is_showFunction: true },
        { tab_functionName: "Delete Bcc", is_showFunction: true }
      ]
    },
    {
      tab_name: "HSN/SAC Code",
      is_show: false,
      tab_function: [
        { tab_functionName: "Add HSN/SAC Code", is_showFunction: true },
        { tab_functionName: "Delete HSN/SAC Code", is_showFunction: true }
      ]
    },
    {
      tab_name: "Settings",
      is_show: false,
      tab_function: [{ tab_functionName: "General Setting Tab", is_showFunction: true }]
    },
    {
      tab_name: "Franchisee",
      is_show: false,
      tab_function: [
        { tab_functionName: "Franchisee Management Tab", is_showFunction: true },
        { tab_functionName: "Export Csv (Franchisee Management)", is_showFunction: true },
        { tab_functionName: "Add Balance (Franchisee Management)", is_showFunction: true },
        { tab_functionName: "Reduce Balance (Franchisee Management)", is_showFunction: true },
        { tab_functionName: "Franchisee Configuration Tab", is_showFunction: true },
        { tab_functionName: "Add Franchisee (Franchisee Configuration)", is_showFunction: true },
        { tab_functionName: "Edit Franchisee (Franchisee Configuration)", is_showFunction: true },
        { tab_functionName: "Export Csv (Franchisee Configuration)", is_showFunction: true },
        { tab_functionName: "Delete Franchisee (Franchisee Configuration)", is_showFunction: true },
        { tab_functionName: "Franchisee Statement Tab", is_showFunction: true },
        { tab_functionName: "Export Csv (Franchisee Statement)", is_showFunction: true }
      ]
    },
    {
      tab_name: "Payment Collection",
      is_show: false,
      tab_function: [
        { tab_functionName: "Define Area Tab", is_showFunction: true },
        { tab_functionName: "Mapping Admins Tab", is_showFunction: true },
        { tab_functionName: "Viewing Users Tab", is_showFunction: true },
        { tab_functionName: "Collection Approval Tab", is_showFunction: true }
        // { tab_functionName: "Admin-Wise Tab", is_showFunction: true },
      ]
    },
    {
      tab_name: "Inventory Management",

      is_show: false,
      tab_function: [
        // { tab_functionName: "Add  Report", is_showFunction: true },
        // { tab_functionName: "Edit Report", is_showFunction: true },
        // { tab_functionName: "Delete Report", is_showFunction: true },
      ]
    }
  ]);

  const [loader, setLoader] = useState(false);
 let history = useHistory()
  const handleCheckbox = (value, key) => {
    let keyAcces = [...access];
    keyAcces[key].is_show = value;
    setAccess(keyAcces);
  };
  const handleUpdate = async () => {
    try {
      setLoader(true);
      await updatePermission({ permission_tab: access }, ispInfo.tabAccess);
    } catch (err) {
      console.log(err.message);
      setLoader(false);
    } finally {
      setLoader(false);
      dispatch(
        success({
          show: true,
          msg: "Updated Successfully",
          severity: "success"
        })
      );
    }
  };
  const getRoleData = async key => {
    try {
      let res = await getRoleDatabyId(key);
      if (res?.data?.data?.permission_tab?.length !== 0) {
        let response = res.data.data.permission_tab;
        let namesInB = new Set(response.map(item => item.tab_name));

        access?.forEach(item => {
          if (!namesInB.has(item.tab_name)) {
            response.push(item);
          }
        });
        setAccess(response);
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [ispInfo, setIspInfo] = useState();
  let { id } = useParams();
  const getAdminUser = async () => {
    try {
      setLoader(true);
      let response = await getAdminbyId(id);
      console.log(response.data.data);
      setIspInfo(response.data.data);
      await getRoleData(response.data.data.tabAccess);
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAdminUser();
  }, []);
  return (
    <Content>
      {loader ? <Loader /> : ""}
      <div className="container rbacManagement_container">
        <div class="card_container  p-5 ">
          <div className="">
            <div className="">
              <label className="form-label">Upload Profile</label>
            </div>
            <div className="">
              <img
                src={ispInfo?.profile_image?.file_url?.length !== 0 ? ispInfo?.profile_image?.file_url : ""}
                alt=""
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "1px solid black",
                  display: "flex",
                  alignItems: "center"
                }}
              />
            </div>
          </div>

          <div className=" py-5 ">
            <div>
              <label className="form-label">
                ISP Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter ISP name"
                value={ispInfo?.admin_name}
                disabled
              />
            </div>

            <div>
              <label className="form-label mt-3">
                ISP Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter ISP email"
                value={ispInfo?.admin_email}
                disabled
              />
            </div>

            <div>
              <label className="form-label mt-3">
                ISP Mobile Number <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter ISP mobile number"
                value={ispInfo?.admin_contact}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="m-4 p-4">
          <h1>Tab Permissions</h1>
          <div className="card_container p-md-4 p-3 mb-3">
            {access.map((res, ind) => (
              <div key={ind} className="d-flex align-items-center mb-2 ">
                <div className="parentModule_heading flex-grow-1 ">{res.tab_name}</div>
                <FormGroup check className="mb-4">
                  <Input
                    type="checkbox"
                    className="input "
                    checked={res.is_show}
                    onChange={e => handleCheckbox(e.target.checked, ind)}
                  />
                </FormGroup>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-end mb-3">
            <div className="d-flex">
              <button className="btn mr-3" onClick={()=> history.push("/ispManagementList") }>Cancel</button>
              <button className="btn btn-primary" onClick={()=>handleUpdate()}>Update</button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default IspView;
