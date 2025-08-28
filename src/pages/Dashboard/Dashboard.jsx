import { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import { PreviewCard, Col, Row } from "../../components/Component";
import Loader from "../../components/commonComponent/loader/Loader";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import style from "./style.module.css";

import {
  LastMonthRevenue,
  TotalActiveUser,
  TotalRevenueChart,
  TotalSubcriberPerPlan,
  UserDistributionChart
} from "./DashboardChart";
import {
  LastMonthRevenueData,
  TotalRevenuedata,
  TotalSubcriberPerPlanData,
  activeUserfunction,
  dataofSubcription,
  lastRevenueofMonth,
  totalActiveChartData,
  totalDataRevenue,
  userDistributionData
} from "./DashboardChartData";
import { addUpdateDashboardCardPosition, dashboaredReportData, getDashboardCardPosition } from "../../service/admin";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { permisionsTab, userInfo } from "../../assets/userLoginInfo";
import Error403 from "../../components/error/error403";
// import Draggable from "react-draggable";

// export default function Dashboard() {
//   let userId = userInfo()?._id
//   const [cardHeading, setCardHeadings] = useState([]);
//   const [activeUserChart, setActiveUserChart] = useState(totalActiveChartData);
//   const [distributeUser, setDistributeUser] = useState(userDistributionData);
//   const [lastRevenue, setLastRevenue] = useState(LastMonthRevenueData);
//   const [totalSubcriber, setTotalSubcriber] = useState(TotalSubcriberPerPlanData);
//   const [totalRevenue, setTotalRevenue] = useState(TotalRevenuedata);
//   const [listYear, setListYear] = useState([]);
//   const [loader, setLoader] = useState(true);
//   const [isBtnVisible, setIsBtnVisible] = useState(true)
//   const [selectYear, setSelectYear] = useState();
//   const [permissionAccess, setPermissionAccess] = useState(true);
//   const [dashPermission, setDashPermission] = useState([]);
//   const [cardsData, setCardsData] = useState([
//     { key: 'drag0', position: { x: 0, y: 0 } },
//     { key: 'drag1', position: { x: 0, y: 0 } },
//     { key: 'drag2', position: { x: 0, y: 0 } },
//     { key: 'drag3', position: { x: 0, y: 0 } },
//     { key: 'drag4', position: { x: 0, y: 0 } },
//     { key: 'drag5', position: { x: 0, y: 0 } },
//     { key: 'drag6', position: { x: 0, y: 0 } },
//     { key: 'drag7', position: { x: 0, y: 0 } },
//     { key: 'drag8', position: { x: 0, y: 0 } },
//     { key: 'drag9', position: { x: 0, y: 0 } }
//   ]);
//   const containerRef = useRef(null);
//   const cardRefs = useRef({});

//   async function permissionFunction() {
//     const res = await permisionsTab();
//     const permissions = res.filter((s) => s.tab_name === "Dashboard");
//     if (permissions.length !== 0) {
//       setPermissionAccess(permissions[0]?.is_show);
//       if (!permissions[0]?.is_show) {
//         setLoader(false);
//       }

//       let permissionArr = permissions[0]?.tab_function
//         ?.filter((s) => s.is_showFunction === true)
//         .map((e) => e.tab_functionName);

//       setDashPermission(permissionArr);
//     }
//   }

//   const reportData = async () => {

//     try {

//       let [dashreport, permission, userChat, lastMonthRevenueChart, totalSubcriberChartData, totalDataChartRevenue, cardPositionData] = await Promise?.all([dashboaredReportData("664645a80522c3d5bc318cd2"), permissionFunction(), activeUserfunction(), lastRevenueofMonth(), dataofSubcription(), totalDataRevenue(), getDashboardCardPosition(userId)])

//       let checkData = cardPositionData?.data?.data?.coordinates || [
//         { key: 'drag0', position: { x: 0, y: 0 } },
//         { key: 'drag1', position: { x: 0, y: 0 } },
//         { key: 'drag2', position: { x: 0, y: 0 } },
//         { key: 'drag3', position: { x: 0, y: 0 } },
//         { key: 'drag4', position: { x: 0, y: 0 } },
//         { key: 'drag5', position: { x: 0, y: 0 } },
//         { key: 'drag6', position: { x: 0, y: 0 } },
//         { key: 'drag7', position: { x: 0, y: 0 } },
//         { key: 'drag8', position: { x: 0, y: 0 } },
//         { key: 'drag9', position: { x: 0, y: 0 } }
//       ]

//       let checkCondition = checkData?.every(res=>res.position.x == 0 && res.position.y == 0)

//       if(checkCondition){
//         setIsBtnVisible(true)
//       }else{
//         setIsBtnVisible(false)
//       }
//       setCardsData(checkData)
//       let ress = dashreport?.data?.data;
//       setCardHeadings([
//         { label: "Total Subscribers", value: ress?.total_user },
//         { label: "Active Subscribers", value: ress?.active_subscriber, color: "#08A771" },
//         { label: "Total Revenue", value: `Rs ${ress?.total_revenue?.toFixed(2)}` },
//         { label: "Invoice Paid", value: `Rs ${ress?.invoice_paid?.toFixed(2)}` },
//         { label: "Active Plans", value: ress?.active_plans },
//       ]);

//       console.log(userChat.active_user,"check active Data")

//       setActiveUserChart(userChat?.active_user);
//       setDistributeUser(userChat?.userDistribution);
//       setLastRevenue(lastMonthRevenueChart);
//       setTotalSubcriber(totalSubcriberChartData);
//     } catch (err) {
//       console.log(err)
//     } finally {
//       setLoader(false);
//     }
//     //
//   };

//   async function totalRevenueYearData(year) {
//     setSelectYear(year);
//     let resData = await totalDataRevenue(year);
//     setTotalRevenue(resData);
//     const startYear = 2000; // Starting year
//     const endYear = new Date().getFullYear(); // Current year
//     const years = Array.from(new Array(endYear - startYear + 1), (val, index) => startYear + index);

//     setListYear(years);
//   }

//   useEffect(() => {
//     reportData();
//     let currentDate = new Date().getFullYear();
//     totalRevenueYearData(currentDate);
//   }, []);

//   // useEffect(() => {
//   //   const savedPositions = localStorage.getItem('cardPositions');
//   //   if (savedPositions) {
//   //     setCardsData(JSON.parse(savedPositions));
//   //   }
//   // }, []);

//   const handleStop = async (e, data, id) => {
//     const updatedCards = cardsData.map((card) => {
//       if (card.key === id) {
//         return { ...card, position: { x: data.x, y: data.y } };
//       }
//       return card;
//     });
//     setIsBtnVisible(false)
//     setCardsData(updatedCards);
//     let payload = {
//       user_id: userId,
//       coordinates: updatedCards
//     }
//     try {
//       let res = await addUpdateDashboardCardPosition(payload)

//     } catch (err) {
//       console.log(err)
//     } finally{
//       setIsBtnVisible(false)
//     }
//     // localStorage.setItem('cardPositions', JSON.stringify(updatedCards));
//   };

//   function findUniqueCard(cardId) {
//     let data = [...cardsData]
//     let newData = data.find(res => res.key == cardId)
//     return newData?.position

//   }

//   // const calculateBounds = (cardId) => {
//   //   if (containerRef.current && cardRefs.current[cardId]) {
//   //     const containerRect = containerRef.current.getBoundingClientRect();
//   //     const cardRect = cardRefs.current[cardId].getBoundingClientRect();
//   //     return {
//   //       left: -containerRect.left,
//   //       right: containerRect.width - cardRect.width,
//   //       top: -containerRect.top,
//   //       bottom: containerRect.height - cardRect.height,
//   //     };
//   //   }
//   //   return { left: 0, right: 0, top: 0, bottom: 0 };
//   // };

//   async function reset() {
//     setLoader(true)
//     try {
//       let payload = {
//         user_id: userId,
//         coordinates: [
//           { key: 'drag0', position: { x: 0, y: 0 } },
//           { key: 'drag1', position: { x: 0, y: 0 } },
//           { key: 'drag2', position: { x: 0, y: 0 } },
//           { key: 'drag3', position: { x: 0, y: 0 } },
//           { key: 'drag4', position: { x: 0, y: 0 } },
//           { key: 'drag5', position: { x: 0, y: 0 } },
//           { key: 'drag6', position: { x: 0, y: 0 } },
//           { key: 'drag7', position: { x: 0, y: 0 } },
//           { key: 'drag8', position: { x: 0, y: 0 } },
//           { key: 'drag9', position: { x: 0, y: 0 } }
//         ]
//       }
//       let res = await addUpdateDashboardCardPosition(payload)

//     } catch (err) {
//       console.log(err)
//     } finally {

//       setCardsData([
//         { key: 'drag0', position: { x: 0, y: 0 } },
//         { key: 'drag1', position: { x: 0, y: 0 } },
//         { key: 'drag2', position: { x: 0, y: 0 } },
//         { key: 'drag3', position: { x: 0, y: 0 } },
//         { key: 'drag4', position: { x: 0, y: 0 } },
//         { key: 'drag5', position: { x: 0, y: 0 } },
//         { key: 'drag6', position: { x: 0, y: 0 } },
//         { key: 'drag7', position: { x: 0, y: 0 } },
//         { key: 'drag8', position: { x: 0, y: 0 } },
//         { key: 'drag9', position: { x: 0, y: 0 } }
//       ])
//       setIsBtnVisible(true)
//         setLoader(false)
//     }
//   }

//   // useEffect(() => {
//   //   if (localStorage.getItem('cardPositions')) {
//   //     setIsBtnVisible(true)
//   //   } else {
//   //     setIsBtnVisible(false)
//   //   }

//   // }, [handleStop])

//   return (
//     <Content>
//       {loader ? (
//         <>
//           <TableSkeleton columns={5} />
//         </>
//       ) : (
//         <>
//           {permissionAccess ? (
//             <>
//               {" "}
//               <div className="p-md-4 p-sm-4 p-0 user_section"
//               //  ref={containerRef}
//               >
//                 <div className="d-flex justify-content-end">
//                   <button className="btn btn-primary" disabled={isBtnVisible} style={{ zIndex: '105' }} onClick={reset}>Reset</button>
//                 </div>

//                 <div className="grid-container-dashboard mt-3">
//                   {cardHeading?.map((res, index) => {
//                     return (
//                       <>
//                         {dashPermission.includes(res?.label) && (
//                           <>
//                             <Draggable defaultPosition={findUniqueCard(`drag${index}`)}
//                               // bounds={calculateBounds(`drag${index}`)} key={`drag${index}`}
//                               onDrag={(e) => console.log()} onStop={(e, data) => handleStop(e, data, `drag${index}`)}>
//                               <div
//                                 // ref={(el) => (cardRefs.current[`drag${index}`] = el)}
//                                 className="d-flex flex-column w-100 gap-2 p-3 card_shadow" style={{ zIndex: '99', cursor: 'move' }}>
//                                 <div className="d-flex w-100 justify-content-start heading_label">{res.label}</div>
//                                 <div
//                                   className="d-flex w-100 mt-2 data_values"
//                                   style={{ color: res?.color ? res?.color : "" }}
//                                 >
//                                   {res.value}
//                                 </div>
//                               </div>
//                             </Draggable>
//                           </>
//                         )}
//                       </>
//                     );
//                   })}
//                 </div>
//                 <div className={`${style.grid_container_dashboard} g-gs mt-4`}>
//                   {dashPermission.includes("Total Active Users (Doughnut chart)") && (
//                     <>
//                       <Draggable
//                         // bounds={calculateBounds(`drag5`)}
//                         defaultPosition={findUniqueCard(`drag5`)} key='drag5' onDrag={(e) => console.log()} onStop={(e, data) => handleStop(e, data, `drag5`)}>
//                         <div
//                           // ref={(el) => (cardRefs.current[`drag5`] = el)}
//                           className="mt-2" style={{ zIndex: '99', cursor: 'move' }}>
//                           <PreviewCard>
//                             <div className="nk-ck-sm">
//                               <TotalActiveUser data={activeUserChart} />
//                             </div>
//                             <div className="card-head text-center mt-2">
//                               <h6 className="title f-18 fw-600">Total Active Users</h6>
//                             </div>
//                           </PreviewCard>
//                         </div>
//                       </Draggable>
//                     </>
//                   )}
//                   {dashPermission.includes("User Distribution (Doughnut chart)") && (
//                     <>
//                       <Draggable
//                         // bounds={calculateBounds(`drag6`)}
//                         defaultPosition={findUniqueCard(`drag6`)} key='drag6' onDrag={(e) => console.log()} onStop={(e, data) => handleStop(e, data, `drag6`)}>
//                         <div
//                           // ref={(el) => (cardRefs.current[`drag6`] = el)}
//                           className="mt-2" style={{ zIndex: '99', cursor: 'move' }}>
//                           <PreviewCard>
//                             <div className="nk-ck-sm">
//                               <UserDistributionChart data={distributeUser} />
//                             </div>
//                             <div className="card-head text-center mt-2">
//                               <h6 className="title f-18 fw-600">User Distribution</h6>
//                             </div>
//                           </PreviewCard>
//                         </div>
//                       </Draggable>
//                     </>
//                   )}

//                   {dashPermission.includes("Last Month Revenue (Bar Chart)") && (
//                     <>
//                       <Draggable
//                         // bounds={calculateBounds(`drag7`)}
//                         defaultPosition={findUniqueCard(`drag7`)} key='drag7' onDrag={(e) => console.log()} onStop={(e, data) => handleStop(e, data, `drag7`)}>
//                         <div
//                           // ref={(el) => (cardRefs.current[`drag7`] = el)}
//                           className="mt-2" style={{ zIndex: '99', cursor: 'move' }}>
//                           <PreviewCard>
//                             <div className="d-flex justify-content-start">
//                               <div className="card-head text-center mt-2">
//                                 <h6 className="title f-18 fw-600">Last Month Revenue</h6>
//                               </div>
//                             </div>
//                             <div className="nk-ck-sm">
//                               <LastMonthRevenue data={lastRevenue} />
//                             </div>
//                           </PreviewCard>
//                         </div>
//                       </Draggable>
//                     </>
//                   )}
//                 </div>
//                 {/* <div className="d-flex mt-5">
//         <div className="w-50">
//             <div className="line-chart">
//               <Chart options={chartData4.options} series={chartData4.series} type="line" height={350} />
//             </div>
//           </div>
//           <div className="w-50">
//             <div className="chart_column_title">Total Subscriber per Plan</div>
//             <ReactApexChart options={options} series={series} type="bar" height={350} />
//           </div>

//         </div> */}
//                 <div className={`${style.grid_container_dashboard2} mt-4`}>
//                   {dashPermission.includes("Total Revenue (Line chart)") && (
//                     <>
//                       <Draggable
//                         // bounds={calculateBounds(`drag8`)}
//                         defaultPosition={findUniqueCard(`drag8`)} key='drag8' onDrag={(e) => console.log()} onStop={(e, data) => handleStop(e, data, `drag8`)}>
//                         <div
//                           //  ref={(el) => (cardRefs.current[`drag8`] = el)}
//                           className="mt-2" style={{ zIndex: '99', cursor: 'move' }}>
//                           <PreviewCard>
//                             <div className="d-flex justify-content-between">
//                               <div className="card-head text-center mt-2">
//                                 <h6 className="title f-18 fw-600">Total Revenue</h6>
//                               </div>
//                               <SingleSelect
//                                 value={selectYear}
//                                 options={listYear.map((res) => {
//                                   return { value: res, label: res };
//                                 })}
//                                 onChange={(e) => {
//                                   totalRevenueYearData(e.target.value);
//                                 }}
//                                 placeItem="Year"
//                               />
//                             </div>
//                             <div className="nk-ck-sm">
//                               <TotalRevenueChart legend={false} data={totalRevenue} />
//                             </div>
//                           </PreviewCard>
//                         </div>
//                       </Draggable>
//                     </>
//                   )}
//                   {dashPermission.includes("Total Subscriber (Bar char)") && (
//                     <>
//                       <Draggable
//                         //  bounds={calculateBounds(`drag9`)}
//                         defaultPosition={findUniqueCard(`drag9`)} key='drag9' onDrag={(e) => console.log()} onStop={(e, data) => handleStop(e, data, `drag9`)}>
//                         <div
//                           //  ref={(el) => (cardRefs.current[`drag9`] = el)}
//                           className="mt-2" style={{ zIndex: '99', cursor: 'move' }}>
//                           <PreviewCard>
//                             <div className="d-flex justify-content-start">
//                               <div className="card-head text-center mt-2">
//                                 <h6 className="title f-18 fw-600">Total Subscriber Per Plan</h6>
//                               </div>
//                             </div>
//                             <div className="nk-ck-sm">
//                               <TotalSubcriberPerPlan data={totalSubcriber} />
//                             </div>
//                           </PreviewCard>
//                         </div>
//                       </Draggable>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <Error403 />
//             </>
//           )}
//         </>
//       )}
//     </Content>
//   );
// }

import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const DragDropGrid = () => {
  const layout = [
    { w: 1, h: 1, x: 0, y: 0, i: "0" }, // All in the same row
    { w: 1, h: 1, x: 1, y: 0, i: "1" },
    { w: 1, h: 1, x: 2, y: 0, i: "2" },
    { w: 1, h: 1, x: 3, y: 0, i: "3" },
    { w: 1, h: 1, x: 4, y: 0, i: "4" },
    { w: 1, h: 3, x: 0, y: 1, i: "5" }, // Second row, 3 items
    { w: 1, h: 3, x: 1, y: 1, i: "6" },
    { w: 1, h: 3, x: 2, y: 1, i: "7" },
    { w: 1, h: 3, x: 0, y: 2, i: "8" }, // Third row, 2 items
    { w: 1, h: 3, x: 1, y: 2, i: "9" }
  ];

  let userId = userInfo()?._id;
  const [cardHeading, setCardHeadings] = useState([]);
  const [activeUserChart, setActiveUserChart] = useState(totalActiveChartData);
  const [distributeUser, setDistributeUser] = useState(userDistributionData);
  const [lastRevenue, setLastRevenue] = useState(LastMonthRevenueData);
  const [totalSubcriber, setTotalSubcriber] = useState(TotalSubcriberPerPlanData);
  const [totalRevenue, setTotalRevenue] = useState(TotalRevenuedata);
  const [listYear, setListYear] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isBtnVisible, setIsBtnVisible] = useState(true);
  const [selectYear, setSelectYear] = useState();
  const [permissionAccess, setPermissionAccess] = useState(true);
  const [dashPermission, setDashPermission] = useState([]);
  const [cardsData, setCardsData] = useState([
    { key: "drag0", position: { x: 0, y: 0 } },
    { key: "drag1", position: { x: 0, y: 0 } },
    { key: "drag2", position: { x: 0, y: 0 } },
    { key: "drag3", position: { x: 0, y: 0 } },
    { key: "drag4", position: { x: 0, y: 0 } },
    { key: "drag5", position: { x: 0, y: 0 } },
    { key: "drag6", position: { x: 0, y: 0 } },
    { key: "drag7", position: { x: 0, y: 0 } },
    { key: "drag8", position: { x: 0, y: 0 } },
    { key: "drag9", position: { x: 0, y: 0 } }
  ]);
  const containerRef = useRef(null);
  const cardRefs = useRef({});

  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter(s => s.tab_name === "Dashboard");
    if (permissions?.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      if (!permissions[0]?.is_show) {
        setLoader(false);
      }

      let permissionArr = permissions[0]?.tab_function
        ?.filter(s => s.is_showFunction === true)
        .map(e => e.tab_functionName);

      setDashPermission(permissionArr);
    }
  }

  const reportData = async () => {
    try {
      let [
        dashreport,
        permission,
        userChat,
        lastMonthRevenueChart,
        totalSubcriberChartData,
        totalDataChartRevenue,
        cardPositionData
      ] = await Promise?.all([
        dashboaredReportData(userInfo()?._id),
        permissionFunction(),
        activeUserfunction(),
        lastRevenueofMonth(),
        dataofSubcription(),
        totalDataRevenue(),
        getDashboardCardPosition(userId)
      ]);

      let checkData = cardPositionData?.data?.data?.coordinates || [
        { key: "drag0", position: { x: 0, y: 0 } },
        { key: "drag1", position: { x: 0, y: 0 } },
        { key: "drag2", position: { x: 0, y: 0 } },
        { key: "drag3", position: { x: 0, y: 0 } },
        { key: "drag4", position: { x: 0, y: 0 } },
        { key: "drag5", position: { x: 0, y: 0 } },
        { key: "drag6", position: { x: 0, y: 0 } },
        { key: "drag7", position: { x: 0, y: 0 } },
        { key: "drag8", position: { x: 0, y: 0 } },
        { key: "drag9", position: { x: 0, y: 0 } }
      ];

      let checkCondition = checkData?.every(res => res.position?.x == 0 && res.position?.y == 0);

      if (checkCondition) {
        setIsBtnVisible(true);
      } else {
        setIsBtnVisible(false);
      }
      setCardsData(checkData);
      let ress = dashreport?.data?.data;
      setCardHeadings([
        { label: "Total Subscribers", value: ress?.total_user },
        { label: "Active Subscribers", value: ress?.active_subscriber, color: "#08A771" },
        { label: "Total Revenue", value: `Rs ${ress?.total_revenue?.toFixed(2)}` },
        { label: "Invoice Paid", value: `Rs ${ress?.invoice.paid?.toFixed(2)}` },
        { label: "Active Plans", value: ress?.active_plans }
      ]);

      console.log(userChat.active_user, "check active Data");

      setActiveUserChart(userChat?.active_user);
      setDistributeUser(userChat?.userDistribution);
      setLastRevenue(lastMonthRevenueChart);
      setTotalSubcriber(totalSubcriberChartData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
    //
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

  useEffect(() => {
    reportData();
    let currentDate = new Date().getFullYear();
    totalRevenueYearData(currentDate);
  }, []);

  // useEffect(() => {
  //   const savedPositions = localStorage.getItem('cardPositions');
  //   if (savedPositions) {
  //     setCardsData(JSON.parse(savedPositions));
  //   }
  // }, []);

  const handleStop = async (e, data, id) => {
    const updatedCards = cardsData.map(card => {
      if (card.key === id) {
        return { ...card, position: { x: data.x, y: data.y } };
      }
      return card;
    });
    setIsBtnVisible(false);
    setCardsData(updatedCards);
    let payload = {
      user_id: userId,
      coordinates: updatedCards
    };
    try {
      let res = await addUpdateDashboardCardPosition(payload);
    } catch (err) {
      console.log(err);
    } finally {
      setIsBtnVisible(false);
    }
    // localStorage.setItem('cardPositions', JSON.stringify(updatedCards));
  };

  function findUniqueCard(cardId) {
    let data = [...cardsData];
    let newData = data.find(res => res.key == cardId);
    return newData?.position;
  }

  // const calculateBounds = (cardId) => {
  //   if (containerRef.current && cardRefs.current[cardId]) {
  //     const containerRect = containerRef.current.getBoundingClientRect();
  //     const cardRect = cardRefs.current[cardId].getBoundingClientRect();
  //     return {
  //       left: -containerRect.left,
  //       right: containerRect.width - cardRect.width,
  //       top: -containerRect.top,
  //       bottom: containerRect.height - cardRect.height,
  //     };
  //   }
  //   return { left: 0, right: 0, top: 0, bottom: 0 };
  // };

  async function reset() {
    setLoader(true);
    try {
      let payload = {
        user_id: userId,
        coordinates: [
          { key: "drag0", position: { x: 0, y: 0 } },
          { key: "drag1", position: { x: 0, y: 0 } },
          { key: "drag2", position: { x: 0, y: 0 } },
          { key: "drag3", position: { x: 0, y: 0 } },
          { key: "drag4", position: { x: 0, y: 0 } },
          { key: "drag5", position: { x: 0, y: 0 } },
          { key: "drag6", position: { x: 0, y: 0 } },
          { key: "drag7", position: { x: 0, y: 0 } },
          { key: "drag8", position: { x: 0, y: 0 } },
          { key: "drag9", position: { x: 0, y: 0 } }
        ]
      };
      let res = await addUpdateDashboardCardPosition(payload);
    } catch (err) {
      console.log(err);
    } finally {
      setCardsData([
        { key: "drag0", position: { x: 0, y: 0 } },
        { key: "drag1", position: { x: 0, y: 0 } },
        { key: "drag2", position: { x: 0, y: 0 } },
        { key: "drag3", position: { x: 0, y: 0 } },
        { key: "drag4", position: { x: 0, y: 0 } },
        { key: "drag5", position: { x: 0, y: 0 } },
        { key: "drag6", position: { x: 0, y: 0 } },
        { key: "drag7", position: { x: 0, y: 0 } },
        { key: "drag8", position: { x: 0, y: 0 } },
        { key: "drag9", position: { x: 0, y: 0 } }
      ]);
      setIsBtnVisible(true);
      setLoader(false);
    }
  }

  // useEffect(() => {
  //   if (localStorage.getItem('cardPositions')) {
  //     setIsBtnVisible(true)
  //   } else {
  //     setIsBtnVisible(false)
  //   }

  // }, [handleStop])
  

  return (
    <div style={{ width: "100%", height: "100vh", padding: "20px" }}>
      <br />
      <br />
      <br />
      <GridLayout
        className="layout"
        layout={layout}
        cols={5} // 5 columns
        rowHeight={100}
        width={1500}
        draggableHandle=".drag-handle"
        onDrag={e => {
          console.log(e);
        }}
      >
        {/* {cardHeading?.map((res, index) => (
          <div
            key={index}
            data-grid={layout.find(l => l.i === index.toString())} // Map to layout object
            className="drag-handle gap-2 p-3 card_shadow"
            style={{ zIndex: "99", cursor: "move", width: "100px", height: "200px" }}
          >
            {dashPermission.includes(res?.label) && (
              <div>
                <div className="d-flex w-100 justify-content-start heading_label">{res.label}</div>
                <div className="d-flex w-100 mt-2 data_values" style={{ color: res?.color ? res?.color : "" }}>
                  {res.value}
                </div>
              </div>
            )}
          </div>
        ))} */}
           {cardHeading?.map((res, index) => (
  // dashPermission.includes(res?.label) && (
    <div  
      key={index}
      data-grid={layout.find(l => l.i === index.toString())} 
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
  // )
))}

        {/* {dashPermission.includes("Total Active Users (Doughnut chart)") && ( */}
          <div key="5" data-grid={layout.find(l => l.i === "5")} className="">
            <PreviewCard className="drag-handle w-100">
              <div className="nk-ck-sm">
                <TotalActiveUser data={activeUserChart} />
              </div>
              <div className="card-head text-center mt-2">
                <h6 className="title f-18 fw-600">Total Active Users</h6>
              </div>
            </PreviewCard>
          </div>
        {/* )} */}

        {/* {dashPermission.includes("User Distribution (Doughnut chart)") && ( */}
          <div key="6" data-grid={layout.find(l => l.i === "6")} className="">
            <PreviewCard className="drag-handle w-100">
              <div className="nk-ck-sm">
                <UserDistributionChart data={distributeUser} />
              </div>
              <div className="card-head text-center mt-2">
                <h6 className="title f-18 fw-600">User Distribution</h6>
              </div>
            </PreviewCard>
          </div>
        {/* )} */}

        {/* {dashPermission.includes("Last Month Revenue (Bar Chart)") && ( */}
          <div key="7" data-grid={layout.find(l => l.i === "7")} className="">
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
        {/* )} */}

        {/* {dashPermission.includes("Total Revenue (Line chart)") && ( */}
          <div key="8" data-grid={layout.find(l => l.i === "8")} className="drag-handle">
            <PreviewCard>
              <div className="d-flex justify-content-between">
                <div className="card-head text-center mt-2">
                  <h6 className="title f-18 fw-600">Total Revenue</h6>
                </div>
                <SingleSelect
                  value={selectYear}
                  options={listYear.map(res => ({ value: res, label: res }))}
                  onChange={e => totalRevenueYearData(e.target.value)}
                  placeItem="Year"
                />
              </div>
              <div className="nk-ck-sm">
                <TotalRevenueChart legend={false} data={totalRevenue} />
              </div>
            </PreviewCard>
          </div>
        {/* )} */}

        {/* {dashPermission.includes("Total Subscriber (Bar char)") && ( */}
          <div key="9" data-grid={layout.find(l => l.i === "9")} className="drag-handle">
            <PreviewCard>
              <div className="">
                <div className="card-head text-center mt-2">
                  <h6 className="title f-18 fw-600">Total Subscriber Per Plan</h6>
                </div>
              </div>
              <div className="nk-ck-sm">
                <TotalSubcriberPerPlan data={totalSubcriber} />
              </div>
            </PreviewCard>
          </div>
        {/* )} */}
      </GridLayout>
    </div>
  );
};

export default DragDropGrid;
