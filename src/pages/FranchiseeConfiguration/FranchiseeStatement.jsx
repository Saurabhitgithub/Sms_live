import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from "reactstrap";
import { franchiseeStatement } from "../../service/admin";
import { userInfo } from "../../assets/userLoginInfo";
import moment from "moment";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { PaginationComponent } from "../../components/Component";
import { paginateData } from "../../utils/Utils";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png";

export default function FranchiseeStatement() {
  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [loader, setLoader] = useState(true);
  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  const [allPlan, setAllPlan] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  


  const getAllFranchisee = async()=>{
    try{
      setLoader(true)
      let orgId = userInfo()._id
    let res = await franchiseeStatement(orgId)
    
    let reverseData = res?.data?.data
    let DataReverse = reverseData.reverse()
    setAllPlan(DataReverse)
    setAllPlanData(DataReverse)
    const datas = paginateData(page, itemPerPage, DataReverse);

    setTableData(datas)
    let exportInfo = DataReverse.map((e)=>{
      return{
        // "Transaction Id":"Cash",
        Name:e?.franchisee_info?.name,
        "Reference Type":e?.referenceType,
        "Revenue Amount":e?.revenueAmount,
        "Franchisee Share":e?.franchiseeShare,
        "Parent Share":e?.parentShare,
        "Withdrawal":e?.withdrawal,
        "Opening Balance":e?.openingBalance,
        "Closing Balance":e?.closingBalance,
        "Date":e?.createdAt
      }
    })
    setExportData(exportInfo)
    }catch(err){
      console.log(err,"errrorrr")
    }finally{
      setLoader(false)
    }
  }

  const handleSearchClick = (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length == 0) {
      let ddd = paginateData(page, itemPerPage, allPlanData);
      setAllPlan(allPlanData);
      setTableData(ddd);
    } else {
      if (Array.isArray(allPlanData)) {
        const filteredData = allPlanData.filter((res) => {
          const name = res?.franchisee_info?.name?.toLowerCase() || "";
          const revenue = (res?.revenueAmount?.toString() || "").toLowerCase();
          const franchisee = (res?.franchiseeShare?.toString() || "").toLowerCase();
          return name.includes(val) || revenue.includes(val) || franchisee.includes(val);
        });
        let ddd = paginateData(page, itemPerPage, filteredData);
        setAllPlan(filteredData);
        setTableData(ddd);
      } else {
        // Handle case when allPlanData is not an array, if needed
      }
    }
  };

  useEffect(() => {
    let ddd = paginateData(page, itemPerPage, allPlanData);
    setTableData(ddd);
  }, [page]);

  useEffect(()=>{
    getAllFranchisee()
  },[])
  const inVoiceRef1 = useRef(null);

  async function convertToImg() {
    // setLoader(true);
    let arr = [inVoiceRef1.current];
    let photoArr = [];
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let index = 0; index < arr.length; index++) {
      const res = arr[index];
      await htmlToImage
        .toPng(res, { quality: 0.5 }) // Reduced quality to 0.5
        .then(function(dataUrl) {
          photoArr.push(dataUrl);
          const imgProps = pdf.getImageProperties(dataUrl);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // Scale image to fit within PDF dimensions
          const scaleFactor = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
          const scaledWidth = imgProps.width * scaleFactor;
          const scaledHeight = imgProps.height * scaleFactor;

          pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight, undefined, "FAST"); // Added compression option
          if (index !== arr.length - 1) {
            pdf.addPage();
          }
        })
        .catch(function(error) {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (index === arr.length - 1) {
            // setLoader(false);
          }
        });
    }

    pdf.save("Franchisee Statement.pdf");
  }
  let styleSheet = {
    maincontainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      padding: "25px",
      // background: "linear-gradient(251.07deg, #FFFFFF 35.06%, #E8F9FA 95.96%)",
      // margin:'0 auto'
      background: "white"
    }
  };
  return (
    <>
      <Content>
      <div style={{ width: "905px" }} className="">
        <div
          style={{
            height: "0px",
            overflow: "hidden",
          }}
        >
          <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
            <div className="d-flex justify-content-between  align-items-center">
            <h3>Franchisee Statement</h3>
                <div>
                  <img src={logo} width={100} alt="" />
                </div>
            </div>
            <Table>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    {/* <th>Transaction Id</th> */}
                    <th>Name</th>
                    <th>Reference Type</th>
                    <th>Revenue Amount</th>
                    {/* <th>Revenue Tax</th> */}
                    <th>Franchisee Share</th>
                    <th>Parent Share</th>
                    <th>Withdrawal</th>
                    {/* <th>Deposit</th> */}
                    <th>Opening Balance</th>
                    <th>Closing Balance</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res) => {
                    return (
                      <tr>
                        {/* <td>Cash</td> */}
                        <td>{res?.franchisee_info?.name}</td>
                        <td>{res?.referenceType}</td>
                        <td>{res?.revenueAmount}</td>
                        {/* <td>{res?.rtax}</td> */}
                        <td>{res?.franchiseeShare}</td>
                        <td>{res?.parentShare}</td>
                        <td>{res?.withdrawal}</td>
                        {/* <td>{res.deposit}</td> */}
                        <td>{res?.openingBalance}</td>
                        <td>{res?.closingBalance}</td>
                        <td>{moment(res?.createdAt).format("DD/MM/YYYY")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
          </div>
        </div>
      </div>
        {
          loader ? (
            <>
          <div className="table-container mt-5">
            <TableSkeleton columns={6} />
          </div>
        </>
          ):(
            <div className="card_container p-md-4 p-sm-3 p-3">
            <div className="topContainer">
              <div className="f-28">Franchisee Statement</div>
              <div className="d-flex align-items-center mt-md-0 mt-sm-0 mt-1">
                <div>
                  {/* <ExportCsv exportData={exportData} filName={"Franchisee Statement"}/> */}
              <div className="dropdown_logs ">

                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                              <DropdownToggle
                                caret
                                className="parimary-background text-wrap text-capitalize"
                                type="button"
                              >
                                Export
                                <span className="ml-2">
                                  {icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}{" "}
                                </span>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>
                                  <ExportCsv exportData={exportData} filName={"Franchisee Statement"} />
                                </DropdownItem>
                                <DropdownItem> <div onClick={convertToImg}>PDF</div></DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                            </div>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-8 col-12">
                <SearchInput placeholder={"Enter Name"} onChange={handleSearchClick}/>
              </div>
            </div>
            <div className="table-container mt-5">
              <Table>
                <thead style={{ backgroundColor: "#F5F6FA" }}>
                  <tr className="table-heading-size">
                    {/* <th>Transaction Id</th> */}
                    <th>Name</th>
                    <th>Reference Type</th>
                    <th>Revenue Amount</th>
                    {/* <th>Revenue Tax</th> */}
                    <th>Franchisee Share</th>
                    <th>Parent Share</th>
                    <th>Withdrawal</th>
                    {/* <th>Deposit</th> */}
                    <th>Opening Balance</th>
                    <th>Closing Balance</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((res) => {
                    return (
                      <tr>
                        {/* <td>Cash</td> */}
                        <td>{res?.franchisee_info?.name}</td>
                        <td>{res?.referenceType}</td>
                        <td>{res?.revenueAmount}</td>
                        {/* <td>{res?.rtax}</td> */}
                        <td>{res?.franchiseeShare}</td>
                        <td>{res?.parentShare}</td>
                        <td>{res?.withdrawal}</td>
                        {/* <td>{res.deposit}</td> */}
                        <td>{res?.openingBalance}</td>
                        <td>{res?.closingBalance}</td>
                        <td>{moment(res?.createdAt).format("DD/MM/YYYY")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div class="d-flex justify-content-center mt-1">
                  <PaginationComponent
                    currentPage={page}
                    itemPerPage={itemPerPage}
                    paginate={(d) => {
                      setPage(d);
                    }}
                    totalItems={allPlan.length}
                  />
                </div>
          </div>
          )
        }
       
      </Content>
    </>
  );
}
