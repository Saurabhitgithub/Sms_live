import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Table } from "reactstrap";
import CreateReceipt from "./ReceiptStep/CreateReceipt";
import ReceitModal from "./ReceitModal";
import { getAllReceiptData } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";
import moment from "moment";
import { exportCsv } from "../../assets/commonFunction";
import { permisionsTab } from "../../assets/userLoginInfo";
import PaginationComponent from "../../components/pagination/Pagination";
import { paginateData } from "../../utils/Utils";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import Error403 from "../../components/error/error403";

const PreviewPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [getData, setGetData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [ViewData, setViewData] = useState();
  const [receptsPermission, setReceptsPermission] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);

  let [page, setPage] = useState(1);
  let itemPerPage = 8;

  const getAllDataReceipts = async () => {
    setLoader(true);
    try {
      setLoader(true);
      const res = await getAllReceiptData();
      await permissionFunction();
      // 
      let ReverseData = res?.data?.data?.reverse();
      // 
      setAllPlanData([...ReverseData]);

      const datas = paginateData(page, itemPerPage, ReverseData);
      // 
      setGetData(datas);
      let exportInfo = ReverseData.map((e) => {
        return {
          receipt_no: e?.receipt_no,
          createdAt: moment(e.createdAt).format("YYYY-MM-DD"),
          full_name: e?.subscriberInfo?.full_name,
          mobile_number: e?.subscriberInfo?.mobile_number,
          total_amount: e?.invoiceInfo?.invoice_table?.total_amount,
          payment_mode: e?.invoiceInfo?.payment_mode,
        };
      });
      setExportData(exportInfo);
      setSearchData(res.data.data);
    } catch (err) {
      
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  const handleSearchClick = (e) => {
    const val = e.target.value.trim().toLowerCase();
    // 
    if (Array.isArray(allPlanData)) {
      const filteredData = allPlanData.filter((res) => {
        const Invoice = (res?.receipt_no || "").toString().toLowerCase();
        const SubscriberInfo = (res?.subscriberInfo?.mobile_number || "").toString().toLowerCase();
        const Amount = (res?.invoiceInfo?.invoice_table?.total_amount || "").toString().toLowerCase();

        return Invoice.includes(val) || SubscriberInfo.includes(val) || Amount.includes(val);
      });

      // 
      setGetData(filteredData);
    } else {
    }
  };
  useEffect(() => {
    // 
    let ddd = paginateData(page, itemPerPage, allPlanData);
    // 
    setGetData(ddd);
  }, [page]);

  async function permissionFunction() {
    const res = await permisionsTab();
    const permissions = res.filter((s) => s.tab_name === "Invoices");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0].is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
      setReceptsPermission(permissionArr);
    }
  }
  useEffect(() => {
    getAllDataReceipts();
    // 
  }, []);

  return (
    <Content>
      {permissionAccess ? (
        <>
          {" "}
          <div className="card_container p-4 user_section">
            <div className="d-flex justify-content-between align-items-center">
              <div className="head_min">Receipts</div>
              <div className="flex center">
                {receptsPermission.includes("Export Receipt") && (
                  <>
                    <span
                      className="export pointer"
                      onClick={() => {
                        exportCsv(exportData, "Receipt");
                      }}
                    >
                      Export
                    </span>
                    {/* <div className="line ml-4 mr-4"></div> */}
                  </>
                )}
                {receptsPermission.includes("Add Receipt") && (
                  <>
                    {/* <div>
                  <CreateReceipt getAllDataReceipts={getAllDataReceipts} />
                </div> */}
                  </>
                )}
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-5">
              <div className="mr-0 mr-md-2">
                <SearchInput placeholder={"Enter Receipt No. "} onChange={handleSearchClick} />
              </div>
              {/* <div className="mt-3 ml-0 ml-md-2 mt-sm-0">
            <SingleSelect placeholder={"All Zones"} name={"Zone"} />
          </div> */}
            </div>
            {loader ? (
              <>
                <TableSkeleton columns={8} />
              </>
            ) : (
              <>
                <div className="mt-5">
                  <Table hover={true} responsive>
                    <thead style={{ backgroundColor: "#F5F6FA" }}>
                      <tr className="table-heading-size">
                        <th scope="row">Receipt No.</th>
                        <th scope="row">Created On</th>
                        {/* <th scope="row">Zone</th> */}
                        <th scope="row">Name</th>
                        <th scope="row">Mobile No</th>
                        <th scope="row">Amount (Rs)</th>
                        {/* <th scope="row">Created By</th> */}
                        <th scope="row">Mode</th>
                        {/* <th scope="row">Status</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {getData.map((item) => (
                        <tr key={item.receipt_no}>
                          <td
                            className={
                              receptsPermission.includes("Export Receipt") ? "text-nowrap pointer" : "text-nowrap "
                            }
                            onClick={() => {
                              if (receptsPermission.includes("Export Receipt")) {
                                setIsOpen(true), setViewData(item);
                              }
                            }}
                          >
                            {item.receipt_no}
                          </td>
                          <td className="text-nowrap" style={{ color: "#0E1073" }}>
                            {moment(item.createdAt).format("DD-MM-YYYY")}
                          </td>
                          {/* <td className="text-nowrap"></td> */}
                          <td className="text-nowrap">{item.subscriberInfo?.full_name}</td>
                          <td className="text-nowrap">{item.subscriberInfo?.mobile_number}</td>
                          <td className="text-nowrap">{item.invoiceInfo?.invoice_table?.total_amount}</td>
                          {/* <td className="text-nowrap">{"Admin"}</td> */}
                          <td className="text-nowrap">{item.invoiceInfo?.payment_mode}</td>
                          {/* <td className="text-nowrap">{"Paid"}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}

            <div class="d-flex justify-content-center mt-1">
              <PaginationComponent
                currentPage={page}
                itemPerPage={itemPerPage}
                paginate={(d) => {
                  setPage(d);
                  // 
                }}
                totalItems={allPlanData.length}
              />
            </div>
          </div>
          {isOpen && <ReceitModal isOpen={isOpen} setIsOpen={setIsOpen} ViewData={ViewData} />}
        </>
      ) : (
        <>
          <Error403 />
        </>
      )}
    </Content>
  );
};

export default PreviewPage;
