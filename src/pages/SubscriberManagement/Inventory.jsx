import React, { useEffect, useRef, useState } from "react";
import ExportCsv from "../../components/commonComponent/ExportButton/ExportCsv";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { PaginationComponent, RSelect } from "../../components/Component";
import {
  AddInventorySubscriber,
  getListOfInventoryCategory,
  getListofInventory,
  getSubscriberInventory
} from "../../service/admin";
import { userInfo } from "../../assets/userLoginInfo";
import TableSkeleton from "../../AppComponents/Skeleton/TableSkeleton";
import { error, success } from "../../Store/Slices/SnackbarSlice";
import { useDispatch } from "react-redux";
import Loader from "../../components/commonComponent/loader/Loader";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/jsTree/PdfLogo.png"

export default function Inventory({ planData }) {
  const [tableData, setTableData] = useState([]);
  const [visible, setVisible] = useState(false);
  function toggle() {
    setVisible(!visible);
  }

  const [getcategory, setGetCategory] = useState([]);
  const [getItemList, setGetItemList] = useState([]);
  const [selectCategory, seTSelectCategory] = useState("");
  const [quantityData, setQuantityData] = useState("");
  const [selectItem, setSelectItem] = useState("");
  const [loader, setLoader] = useState(false);
  const [exportData, setExportData] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(true);

  const toggleDropdown = () => {
    setIcon(prevState => !prevState);
    setDropdownOpen(prevState => !prevState);
  };

  const dispatch = useDispatch();

  let [page, setPage] = useState(1);
  let itemPerPage = 8;
  let orGId = userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id;

  const getDataOfCategory = async () => {
    try {
      let res = await getListOfInventoryCategory(orGId);
      let AllDatas = Array.isArray(res?.data?.data)
        ? res.data.data.map(res => ({
            value: res?._id,
            label: res?.category_name
          }))
        : []; // Return an empty array if it's not an array
      
      setGetCategory(AllDatas);
    } catch (err) {
      
    }
  };
  
  const getItemData = async () => {
    try {
      let res = await getListofInventory(selectCategory);
      let AllDataItem = Array.isArray(res?.data?.data)
        ? res.data.data.map(resss => ({
            value: resss?._id,
            label: resss?.item_name
          }))
        : []; // Return an empty array if it's not an array
      
      setGetItemList(AllDataItem);
    } catch (err) {
      
    }
  };

  const addSubscriberInventory = async e => {
    e.preventDefault();
    setLoader(true);
    let payload = {
      subcriber_id: planData._id,
      inventory_id: selectItem,
      inventoryCategory_id: selectCategory,
      qty: quantityData,
      isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
      org_id: userInfo().role === "isp admin" ? userInfo()._id : userInfo().org_id
    };
    try {
      let res = await AddInventorySubscriber(payload);
      dispatch(
        success({
          show: true,
          msg: "Item Created Successfully",
          severity: "success"
        })
      );
      getAllInventoryOfSubscriber();
    } catch (err) {
      console.log(err);
      if(err?.response?.data?.errormessage?.includes("this Item have 0 quantity")){
        dispatch(
          error({
            show: true,
            msg: "this Item have 0 quantity",
            severity: "error"
          })
        );
      }
    } finally {
      setVisible(false);
      setLoader(false);
    }
  };

  const getAllInventoryOfSubscriber = async () => {
    setLoader(true);
    try {
      let res = await getSubscriberInventory(planData._id);
      
      let dataReverse = res?.data?.data?.reverse();
      setTableData(dataReverse);
      let exportInfo = dataReverse.map(e => {
        const price = e?.inventoryInfo?.item_price || 0;
        const qty = e?.qty || 0;
        const cgst = e?.inventorycategorie?.cgst || 0;
        const sgst = e?.inventorycategorie?.scgst || 0;

        const total = price * qty + (cgst / 100) * (price * qty) + (sgst / 100) * (price * qty);
        return {
          Item: e?.inventoryInfo?.item_name,
          Price: e?.inventoryInfo?.item_price,
          CGST: e?.inventorycategorie?.cgst ? e?.inventorycategorie?.cgst : "---",
          SGST: e?.inventorycategorie?.scgst ? e?.inventorycategorie?.scgst : "---",
          Quantity: e?.qty,
          Total: total.toFixed(2)
        };
      });
      setExportData(exportInfo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllInventoryOfSubscriber();
    getDataOfCategory();
    if (selectCategory) {
      getItemData();
    }
  }, [selectCategory]);

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

    pdf.save("Inventory of Subscriber.pdf");
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
    <div style={{ width: "1000px" }} className="">
          <div
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <div style={styleSheet.maincontainer} ref={inVoiceRef1} id="print" className="border ">
              <div className="d-flex justify-content-between  align-items-center">
                <h3>Inventory Of Subscriber</h3>
                <div>
                <img src={logo} width={100} alt="" />
              </div>
              </div>
              <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Item</th>
                  <th>Price</th>
                  <th>CGST(%)</th>
                  <th>SGST(%)</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((res, index) => {
                  const price = res?.inventoryInfo?.item_price || 0;
                  const qty = res?.qty || 0;
                  const cgst = res?.inventorycategorie?.cgst || 0;
                  const sgst = res?.inventorycategorie?.scgst || 0;

                  const total = price * qty + (cgst / 100) * (price * qty) + (sgst / 100) * (price * qty);
                  return (
                    <tr>
                      <td>{res?.inventoryInfo?.item_name}</td>
                      <td>{res?.inventoryInfo?.item_price}</td>
                      <td>{res?.inventorycategorie?.cgst ? res?.inventorycategorie?.cgst : "---"}</td>
                      <td>{res?.inventorycategorie?.scgst ? res?.inventorycategorie?.scgst : "---"}</td>
                      <td>{res?.qty}</td>
                      <td>{total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </div>
          </div>
        </div>
      {/* {} */}

      <Modal centered scrollable size="xl" isOpen={visible}>
        <ModalHeader toggle={toggle}>
          <div className="f-24">Create Inventory</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={addSubscriberInventory}>
            <div className="row">
              <div className="col-md-6 col-sm-6 col-12">
                <label className="form-label">
                  Category<span className="text-danger">*</span>
                </label>
                <SingleSelect
                  required
                  options={getcategory}
                  placeItem="Category"
                  onChange={e => {
                    seTSelectCategory(e.target.value);
                  }}
                />
              </div>
              <div className="col-md-6 col-sm-6 col-12">
                <label className="form-label">
                  Item<span className="text-danger">*</span>
                </label>
                <SingleSelect
                  required
                  placeItem="Item"
                  options={getItemList}
                  onChange={e => {
                    setSelectItem(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <label>Quantity</label>
                <input
                  type="number"
                  required
                  className="form-control"
                  onChange={e => {
                    setQuantityData(e.target.value);
                  }}
                  placeholder="Enter Quantity"
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <div>
                <div className="w-100 d-flex justify-content-end mt-5">
                  <button className="btn text-primary" type="button" onClick={() => setVisible(false)}>
                    Cancel
                  </button>
                  {loader ? (
                    <Loader />
                  ) : (
                    <button className="btn btn-primary" type="submit">
                      Create Inventory
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <div className="mt-md-5 mt-sm-4 mt-3">
        <div className="d-flex justify-content-between">
          <div className="fs-24 fw-500">Inventory Management</div>
          <div className="d-flex align-items-center">
            <div className="">
              {/* <ExportCsv filName={"Inventory"} exportData={exportData} /> */}
              <div className="dropdown_logs ">

              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret className="parimary-background text-wrap text-capitalize" type="button">
                        Export
                        <span className="ml-2">{icon ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />} </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <ExportCsv exportData={exportData} filName={"Inventory Of Subscriber"} />
                        </DropdownItem>
                        <DropdownItem>
                          {" "}
                          <div onClick={convertToImg}>PDF</div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
            </div>
            <div className="ml-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setVisible(true);
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="table-container mt-5">
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th>Item</th>
                  <th>Price</th>
                  <th>CGST(%)</th>
                  <th>SGST(%)</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((res, index) => {
                  const price = res?.inventoryInfo?.item_price || 0;
                  const qty = res?.qty || 0;
                  const cgst = res?.inventorycategorie?.cgst || 0;
                  const sgst = res?.inventorycategorie?.scgst || 0;

                  const total = price * qty + (cgst / 100) * (price * qty) + (sgst / 100) * (price * qty);
                  return (
                    <tr>
                      <td>{res?.inventoryInfo?.item_name}</td>
                      <td>{res?.inventoryInfo?.item_price}</td>
                      <td>{res?.inventorycategorie?.cgst ? res?.inventorycategorie?.cgst : "---"}</td>
                      <td>{res?.inventorycategorie?.scgst ? res?.inventorycategorie?.scgst : "---"}</td>
                      <td>{res?.qty}</td>
                      <td>{total.toFixed(2)}</td>
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
                    totalItems={tableData.length}
                  />
                </div>
        </div>
      </div>
    </>
  );
}
