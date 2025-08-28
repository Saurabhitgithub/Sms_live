import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import {
  adminDashboardReport,
  getRoleDatabyId,
  updatePermission,
  addUpdateDashboardCardPosition,
  getDashboardCardPosition
} from "../../service/admin";
import style from "./style.module.css";
import { PreviewCard } from "../../components/Component";
import {
  LastMonthRevenue,
  TotalActiveUser,
  TotalInvoiceChart,
  TotalLeadsPerInvoiceChart,
  TotalPaidInvoiceChart,
  TotalPaymentsChart,
  TotalRevenueChart,
  TotalSubcriberPerPlan,
  UserDistributionChart
} from "./AdminDashboardChart";
import {
  activeUserfunction,
  dataofInvoices,
  dataofleadsIspAdmin,
  dataofSubcription,
  LastMonthRevenueData,
  lastRevenueofMonth,
  totalActiveChartData,
  totalDataRevenue,
  TotalInvoicePaidAdmindata,
  TotalInvoicePlanData,
  TotalLeadsOfIspPerPlanData,
  totalpaymentData,
  TotalPaymentRevenuedata,
  totalpidInvoiceData,
  TotalRevenuedata,
  TotalSubcriberPerPlanData,
  userDistributionData
} from "./AdminDashboardChartData";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { FormGroup, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { success } from "../../Store/Slices/SnackbarSlice";
import { useSelector, useDispatch } from "react-redux";
import { permisionsTab, userId } from "../../assets/userLoginInfo";
import Loader from "../../components/commonComponent/loader/Loader";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { IoSettings } from "react-icons/io5";

const AdminDashboard = () => {
  const [cardHeading, setCardHeadings] = useState([]);
  const [activeUserChart, setActiveUserChart] = useState(totalActiveChartData);
  const [distributeUser, setDistributeUser] = useState(userDistributionData);
  const [lastRevenue, setLastRevenue] = useState(LastMonthRevenueData);
  const [selectYear, setSelectYear] = useState();
  const [listYear, setListYear] = useState([]);
  const [selectYear1, setSelectYear1] = useState();
  const [listYear1, setListYear1] = useState([]);
  const [selectYear2, setSelectYear2] = useState();
  const [listYear2, setListYear2] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(TotalRevenuedata);
  const [totalSubcriber, setTotalSubcriber] = useState(TotalSubcriberPerPlanData);
  const [totalAllInvoice, setTotalAllInvoice] = useState(TotalInvoicePlanData);
  const [totalLeadsPerIsp, setTotalLeadsPerIsp] = useState(TotalLeadsOfIspPerPlanData);
  const [totalPaymentData, setTotalPaymentData] = useState(TotalPaymentRevenuedata);
  const [totalPaidInvoiceData, setTotalPaidInvoiceData] = useState(TotalInvoicePaidAdmindata);

  const reportData = async () => {
    setLoader(true);
    try {
      // let response = await adminDashboardReport();
      let [
        dashreport,
        userChat,
        lastMonthRevenueChart,
        totalSubcriberChartData,
        totalDataChartRevenue,
        totalInvoiceChartData,
        totalLeadsChartData
      ] = await Promise?.all([
        adminDashboardReport(),
        activeUserfunction(),
        lastRevenueofMonth(),
        dataofSubcription(),
        totalDataRevenue(),
        dataofInvoices(),
        dataofleadsIspAdmin()
      ]);
      let ress = dashreport?.data?.data;

      setCardHeadings([
        { label: "Total Subscribers", value: ress?.total_user },
        { label: "Active Subscribers", value: ress?.active_subscriber, color: "#08A771" },
        { label: "Total Revenue", value: `Rs ${ress?.total_revenue?.toFixed(2)}` },
        { label: "Invoice Paid", value: `Rs ${ress?.invoice_paid?.toFixed(2)}` },
        { label: "Active Plans", value: ress?.active_plans }
      ]);
      setActiveUserChart(userChat.active_user);
      setDistributeUser(userChat?.userDistribution);
      setLastRevenue(lastMonthRevenueChart);
      setTotalSubcriber(totalSubcriberChartData);
      setTotalAllInvoice(totalInvoiceChartData);
      setTotalLeadsPerIsp(totalLeadsChartData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };
  async function totalRevenueYearData(year) {
    setSelectYear(year);
    let resData = await totalDataRevenue(year);
    setTotalRevenue(resData);
    const startYear = 2000; // Starting year
    const endYear = new Date().getFullYear(); // Current year
    const years = Array.from(new Array(endYear - startYear + 1), (val, index) => startYear + index);

    setListYear(years);
  }

  async function totalPaymentYearData(year) {
    setSelectYear1(year);
    let resData = await totalpaymentData(year);
    setTotalPaymentData(resData);
    const startYear = 2000; // Starting year
    const endYear = new Date().getFullYear(); // Current year
    const years = Array.from(new Array(endYear - startYear + 1), (val, index) => startYear + index);

    setListYear1(years);
  }

  async function totalPaidInvoiceFunctionData(year) {
    setSelectYear2(year);
    let resData = await totalpidInvoiceData(year);
    setTotalPaidInvoiceData(resData);
    const startYear = 2000; // Starting year
    const endYear = new Date().getFullYear(); // Current year
    const years = Array.from(new Array(endYear - startYear + 1), (val, index) => startYear + index);

    setListYear2(years);
  }

  useEffect(() => {
    reportData();
    let currentDate = new Date().getFullYear();
    totalRevenueYearData(currentDate);
    totalPaymentYearData(currentDate);
    totalPaidInvoiceFunctionData(currentDate);
  }, []);

  const [open, setOpen] = useState(false);
  const [getAccess, setGetAccess] = useState([]);
  const [access, setAccess] = useState({
    tab_name: "Dashboard",
    is_show: false,
    tab_function: [
      { tab_functionName: "Total Subscribers", is_showFunction: false },
      { tab_functionName: "Active Subscribers", is_showFunction: false },
      { tab_functionName: "Total Revenue", is_showFunction: false },
      { tab_functionName: "Invoice Paid", is_showFunction: false },
      { tab_functionName: "Active Plans", is_showFunction: false },
      { tab_functionName: "Total Active Users (Doughnut chart)", is_showFunction: false },
      { tab_functionName: "User Distribution (Doughnut chart)", is_showFunction: false },
      { tab_functionName: "Last Month Revenue (Bar Chart)", is_showFunction: false },
      { tab_functionName: "Total Revenue (Line chart)", is_showFunction: false },
      { tab_functionName: "Total Subscriber (Bar char)", is_showFunction: false },
      { tab_functionName: "Total Payment (Line Chart)", is_showFunction: false },
      { tab_functionName: "Total Paid Invoice (Line chart)", is_showFunction: false },
      { tab_functionName: "Total Invoices (Bar char)", is_showFunction: false },
      { tab_functionName: "Total Leads Per Isp (Bar char)", is_showFunction: false }
    ]
  });
  const [dashPermission, setDashPermission] = useState([]);
  const [loader, setLoader] = useState(true);

  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter(s => s.tab_name === "Dashboard");
    if (permissions?.length !== 0) {
      // setPermissionAccess(permissions[0]?.is_show);
      if (!permissions[0]?.is_show) {
        setLoader(false);
      }

      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);

      setDashPermission(permissionArr);
    }
  }

  const getRoleData = async () => {
    try {
      let res = await getRoleDatabyId("66c582e9bc0000e9b5879865");
      if (res?.data?.data?.permission_tab?.length !== 0) {
        let response = res.data.data.permission_tab;
        let namesInB = new Set(response.map(item => item.tab_name));

        getAccess?.permission_tab?.forEach(item => {
          if (!namesInB.has(item.tab_name)) {
            response.push(item);
          }
        });
        setGetAccess({ ...res.data.data, permission_tab: response });
        // console.log({ ...res.data.data, permission_tab: response });
        setAccess(response.find(e => e.tab_name === "Dashboard"));
        // console.log(response.find(e => e.tab_name === "Dashboard"));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckbox = (value, key) => {
    let keyAcces = { ...access };
    keyAcces.tab_function[key].is_showFunction = value;
    setAccess(keyAcces);
  };
  const dispatch = useDispatch();

  const handleUpdate = async () => {
    try {
      let permission_tab = getAccess.permission_tab.map(res => {
        if (res.tab_name === "Dashboard") {
          // return {...access,tab_function:[...access.tab_function, { tab_functionName: "Total Leads Per Isp (Bar char)", is_showFunction: false }]}
          return access;
        } else {
          return res;
        }
      });
      // console.log(permission_tab);
      // return
      setLoader(true);
      await updatePermission({ permission_tab: permission_tab }, "66c582e9bc0000e9b5879865");
      reportData();
      permissionFunction();
      setOpen(false);
    } catch (err) {
      console.log(err.message);
      setLoader(false);
    } finally {
      setLoader(false);
      dispatch(
        success({
          show: true,
          msg: "Dashboard Updated Successfully",
          severity: "success"
        })
      );
    }
  };

  useEffect(() => {
    getRoleData();
    permissionFunction();
  }, []);

  const layout = [
    { w: 1, h: 1, x: 0, y: 0, i: "0" },
    { w: 1, h: 1, x: 1, y: 0, i: "1" },
    { w: 1, h: 1, x: 2, y: 0, i: "2" },
    { w: 1, h: 1, x: 3, y: 0, i: "3" },
    { w: 1, h: 1, x: 4, y: 0, i: "4" },
    { w: 1, h: 3, x: 0, y: 1, i: "5" },
    { w: 1, h: 3, x: 1, y: 1, i: "6" },
    { w: 1, h: 3, x: 2, y: 1, i: "7" },
    { w: 1, h: 3, x: 0, y: 2, i: "8" },
    { w: 1, h: 3, x: 1, y: 2, i: "9" },
    { w: 1, h: 3, x: 2, y: 2, i: "10" },
    { w: 1, h: 3, x: 0, y: 3, i: "11" },
    { w: 1, h: 3, x: 1, y: 3, i: "12" },
    { w: 1, h: 3, x: 2, y: 3, i: "13" }
  ];
  const [cardsData, setCardsData] = useState([]);

  const fetchInitialCardPositions = async () => {
    try {
      const response = await getDashboardCardPosition(userId());
      const initialLayout = response?.data?.data?.layoutCoordinates;
      setCardsData(initialLayout);
      console.log(initialLayout, "getcordinates datatatatatatatattatatatatatattatatatat");
    } catch (err) {
      console.error("Failed to fetch card positions:", err);
    }
  };
  useEffect(() => {
    fetchInitialCardPositions();
  }, []);

  const handleStop = async info => {
    // Clean up the layout object by removing unnecessary properties
    const cleanedLayout = info.map(item => ({
      w: item.w,
      h: item.h,
      x: item.x,
      y: item.y,
      i: item.i
    }));

    console.log(cleanedLayout, "Cleaned Layout");

    const payload = {
      user_id: userId(),
      layoutCoordinates: cleanedLayout
    };

    try {
      await addUpdateDashboardCardPosition(payload);
      // Optionally, you can fetch the updated positions again if needed
      // fetchInitialCardPositions();
    } catch (err) {
      console.error("Failed to update card positions:", err);
    }
  };

  return (
    <Content>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <Modal centered scrollable isOpen={open} size="lg">
        <ModalHeader
          toggle={() => {
            setOpen(!open);
          }}
        >
          <div className="f-24">Dashboard Setting</div>
        </ModalHeader>
        <ModalBody>
          <div>
            {access?.tab_function?.map((res, ind) => {
              return (
                <>
                  <div key={ind}>
                    <div className="card_container p-3 mb-0">
                      <div className="d-flex align-items-center justify-content-between mb-0">
                        <div className="parentModule_heading">{res.tab_functionName}</div>
                        <div className={``}>
                          <FormGroup check className="d-flex align-items-center">
                            <Input
                              type="checkbox"
                              className="input "
                              checked={res.is_showFunction}
                              tab_functionName=""
                              onChange={e => handleCheckbox(e.target.checked, ind)}
                            />{" "}
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="d-flex mt-4 justify-content-end">
            <button
              className="cancel_btn mr-2"
              color="white"
              onClick={() => {
                setOpen(!open);
              }}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                handleUpdate();
              }}
            >
              Save
            </button>
          </div>
        </ModalBody>
      </Modal>
      <div className="p-md-4 p-sm-4 p-0 user_section">
        <div className="d-flex justify-content-end ps-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            <IoSettings /> Dashboard
          </button>
        </div>
        <GridLayout
          // className="layout"
          // layout={layout}
          // cols={5} // 5 columns
          // rowHeight={100}
          // width={1500}
          // draggableHandle=".drag-handle"
          // onDrag={e => {
          //   console.log(e);
          // }}
          className="layout"
          layout={cardsData}
          cols={5}
          rowHeight={100}
          width={1500}
          draggableHandle=".drag-handle"
          onLayoutChange={handleStop}
          // onDrag={handleStop}
        >
          {cardHeading?.map(
            (res, index) =>
              dashPermission.includes(res?.label) && (
                <div
                  key={index}
                  data-grid={cardsData.find(l => l.i === index.toString())}
                  className="drag-handle gap-2 p-3 card_shadow"
                  style={{ zIndex: "99", cursor: "move", width: "100%", height: "100px" }}
                >
                  <div>
                    <div className="d-flex w-100 justify-content-start heading_label">{res.label}</div>
                    <div className="d-flex w-100 mt-2 data_values" style={{ color: res?.color ? res?.color : "" }}>
                      {res.value}
                    </div>
                  </div>
                </div>
              )
          )}
          {/* </div> */}
          {/* <div className={`${style.grid_container_dashboard} g-gs mt-4`}> */}
          {dashPermission.includes("Total Active Users (Doughnut chart)") && (
            <div key="5" data-grid={cardsData.find(l => l.i === "5")}>
              <PreviewCard className="drag-handle w-100">
                <div className="nk-ck-sm">
                  <TotalActiveUser data={activeUserChart} />
                </div>
                <div className="card-head text-center mt-2">
                  <h6 className="title f-18 fw-600">Total Active Users</h6>
                </div>
              </PreviewCard>
            </div>
          )}
          {dashPermission.includes("User Distribution (Doughnut chart)") && (
            <div key="6" data-grid={cardsData.find(l => l.i === "6")}>
              <PreviewCard className="drag-handle w-100">
                <div className="nk-ck-sm">
                  <UserDistributionChart data={distributeUser} />
                </div>
                <div className="card-head text-center mt-2">
                  <h6 className="title f-18 fw-600">User Distribution</h6>
                </div>
              </PreviewCard>
            </div>
          )}
          {dashPermission.includes("Last Month Revenue (Bar Chart)") && (
            <div key="7" data-grid={cardsData.find(l => l.i === "7")}>
              <PreviewCard className="drag-handle w-100">
                <div className="d-flex justify-content-start">
                  <div className="card-head text-center mt-2">
                    <h6 className="title f-18 fw-600">Last Month Revenue</h6>
                  </div>
                </div>
                <div className="nk-ck-sm">
                  <LastMonthRevenue data={lastRevenue} />
                </div>
              </PreviewCard>
            </div>
          )}
          {/* </div> */}
          {/* <div className={`${style.grid_container_dashboard2} mt-4`}> */}
          {dashPermission.includes("Total Revenue (Line chart)") && (
            <div key="8" data-grid={cardsData.find(l => l.i === "8")}>
              <PreviewCard className="drag-handle w-100">
                <div className="d-flex justify-content-between">
                  <div className="card-head text-center mt-2">
                    <h6 className="title f-18 fw-600">Total Revenue</h6>
                  </div>
                  <SingleSelect
                    value={selectYear}
                    options={listYear.map(res => {
                      return { value: res, label: res };
                    })}
                    onChange={e => {
                      totalRevenueYearData(e.target.value);
                    }}
                    placeItem="Year"
                  />
                </div>
                <div className="nk-ck-sm">
                  <TotalRevenueChart legend={false} data={totalRevenue} />
                </div>
              </PreviewCard>
            </div>
          )}
          {dashPermission.includes("Total Subscriber (Bar char)") && (
            <div key="9" data-grid={cardsData.find(l => l.i === "9")}>
              <PreviewCard className="drag-handle w-100">
                <div className="d-flex justify-content-start">
                  <div className="card-head text-center mt-2">
                    <h6 className="title f-18 fw-600">Total Subscriber Per Isp</h6>
                  </div>
                </div>
                <div className="nk-ck-sm">
                  <TotalSubcriberPerPlan data={totalSubcriber} />
                </div>
              </PreviewCard>
            </div>
          )}
          {dashPermission.includes("Total Payment (Line Chart)") && (
            <div key="10" data-grid={cardsData.find(l => l.i === "10")}>
              <PreviewCard className="drag-handle w-100">
                <div className="d-flex justify-content-between">
                  <div className="card-head text-center mt-2">
                    <h6 className="title f-18 fw-600">Total Payment</h6>
                  </div>
                  <SingleSelect
                    value={selectYear1}
                    options={listYear1.map(res => {
                      return { value: res, label: res };
                    })}
                    onChange={e => {
                      totalPaymentYearData(e.target.value);
                    }}
                    placeItem="Year"
                  />
                </div>
                <div className="nk-ck-sm">
                  <TotalPaymentsChart legend={false} data={totalPaymentData} />
                </div>
              </PreviewCard>
            </div>
          )}
          {dashPermission.includes("Total Paid Invoice (Line chart)") && (
            <div key="11" data-grid={cardsData.find(l => l.i === "11")}>
              <PreviewCard className="drag-handle w-100">
                <div className="d-flex justify-content-between">
                  <div className="card-head text-center mt-2">
                    <h6 className="title f-18 fw-600">Total Paid Invoice</h6>
                  </div>
                  <SingleSelect
                    value={selectYear2}
                    options={listYear2.map(res => {
                      return { value: res, label: res };
                    })}
                    onChange={e => {
                      totalPaidInvoiceFunctionData(e.target.value);
                    }}
                    placeItem="Year"
                  />
                </div>
                <div className="nk-ck-sm">
                  <TotalPaidInvoiceChart legend={false} data={totalPaidInvoiceData} />
                </div>
              </PreviewCard>
            </div>
          )}
          {/* </div> */}
          {/* <div className={`${style.grid_container_dashboard2} mt-4`}> */}
          {dashPermission.includes("Total Invoices (Bar char)") && (
            <div key="12" data-grid={cardsData.find(l => l.i === "12")}>
              <PreviewCard className="drag-handle w-100">
                <div className="d-flex justify-content-start">
                  <div className="card-head text-center mt-2">
                    <h6 className="title f-18 fw-600">Total Invoices</h6>
                  </div>
                </div>
                <div className="nk-ck-sm">
                  <TotalInvoiceChart data={totalAllInvoice} />
                </div>
              </PreviewCard>
            </div>
          )}
          {dashPermission.includes("Total Leads Per Isp (Bar char)") && (
            <div key="13" data-grid={cardsData.find(l => l.i === "13")}>
              <PreviewCard className="drag-handle w-100">
                <div className="d-flex justify-content-start">
                  <div className="card-head text-center mt-2">
                    <h6 className="title f-18 fw-600">Total Leads Per Isp</h6>
                  </div>
                </div>
                <div className="nk-ck-sm">
                  <TotalLeadsPerInvoiceChart data={totalLeadsPerIsp} />
                </div>
              </PreviewCard>
            </div>
          )}
          {/* </div> */}
        </GridLayout>
      </div>
    </Content>
  );
};

export default AdminDashboard;
