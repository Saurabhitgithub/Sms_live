import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import SingleSelect from "../../components/commonComponent/singleSelect/SingleSelect";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import { CiCalendarDate } from "react-icons/ci";
import { getPlanByCreator, invoiceFilter } from "../../service/admin";
import moment from "moment";
import { userInfo } from "../../assets/userLoginInfo";

const InovoiceFilterModal = ({ openFilter, setOpenFilter, filteringData, allPlanData,activeTab }) => {
  const [startDate, setStartDate] = useState();
  const [type, setType] = useState();
  const [category, setCategory] = useState();
  const [allPlans, setAllPlans] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [formData, setFormData] = useState();

  const toggle = () => {
    setOpenFilter(false);
  };
  function clearAllData() {
    setStartDate();
    setCategory();
    setType();
    setFormData();
    setFilterData([]);
    filteringData(allPlanData);
    toggle();
  }
  const getAllData = async () => {
    let data = await getPlanByCreator(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id);
    let AllPlan = data.data.data;
    setAllPlans(AllPlan);
    
  };
  const filterDataplan = async (types, categorys) => {
    if (types && categorys) {
      let alldata = allPlans.filter((e) => e.type === types && e.category === categorys);
      setFilterData(alldata);
      
    }
  };
  const handleInput = async (e) => {
    
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = async () => {
    let Payload = {
      ...formData,
      invoiceType: activeTab==="0"?"perfoma":"paid",

    };
    if (startDate) {
      Payload = { ...Payload, created_at_date: moment(startDate).format("YYYY-MM-DD") + "T00:00:00.000Z" };
    }

    for (let key in Payload) {
      if (Payload[key] === undefined || Payload[key] === "" || Payload[key] === null) {
        delete Payload[key];
      }
    }
    if (Object.keys(Payload).length !== 0) {
      const result = await invoiceFilter(Payload);
      
      filteringData(result.data.data.reverse());
    } else {
      filteringData(allPlanData);
    }

    toggle();
  };
  useEffect(() => {
    getAllData();
  }, []);
  return (
    <React.Fragment>
      <Modal isOpen={openFilter} toggle={toggle} size="xl">
        <ModalHeader isOpen={openFilter} toggle={toggle} className="d flex align-items-center justify-content-between">
          <div className={`head_min`}>{activeTab === "0" ?<span>Perfoma Filter Invoice </span>:<span>Paid Filter Invoice</span>}</div>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-6 mb-4">
              <h5>Amount(Min)</h5>
              <Input
                // options={roles}
                type="number"
                name="min"
                value={formData?.min}
                placeholder={"Input minimum amount"}
                onChange={(e) => {
                  handleInput(e);
                }}
              />
            </div>
            <div className="col-6 mb-4">
              <h5>Amount(Max)</h5>
              <Input
                // options={roles}
                type="number"
                name="max"
                value={formData?.max}
                placeholder={"Input maximum amount"}
                onChange={(e) => {
                  handleInput(e);
                }}
              />
            </div>

            {/* <div className="col-6 mb-4">
              <h5>Plan Type</h5>
              <SingleSelect
                placeItem={"Plan Type"}
                value={formData?.plan_type}
                options={[
                  { value: "data", label: "Data" },
                  { value: "unlimited", label: "Unlimited" },
                ]}
                name="plan_type"
                placeholder={"Select Plan Type"}
                onChange={(e) => {
                  setType(e.target.value);
                  filterDataplan(e.target.value, category);
                  handleInput(e);
                }}
              />
            </div> */}
            {/* <div className="col-6 mb-4">
              <h5>Plan Category</h5>
              <SingleSelect
                placeItem={"Plan Category"}
                options={[
                  { value: "postpaid", label: "Postpaid" },
                  { value: "prepaid", label: "Prepaid" },
                ]}
                name="plan_category"
                value={formData?.plan_category}
                placeholder={"Select Plan Category"}
                onChange={(e) => {
                  setCategory(e.target.value);
                  filterDataplan(type, e.target.value);
                  handleInput(e);
                }}
              />
            </div> */}
            {/* <div className="col-6 mb-4">
              <h5>Plan Name</h5>
              <SingleSelect
                placeItem={"Plan Name"}
                options={filterData.map((e) => {
                  return { value: e.plan_name, label: e.plan_name };
                })}
                name="plan_name"
                value={formData?.plan_name}
                placeholder={"Select Plan Name"}
                onChange={(e) => {
                  handleInput(e);
                }}
              />
            </div> */}
            <div className="col-6 mb-4">
              <h5>Created On</h5>
              <div style={{ position: "relative", cursor: "pointer" }}>
                <InputGroup className="d-flex align-items-center justify-content-end">
                  <DatePicker
                    id="Dt"
                    selected={startDate}
                    name="created_at_date"
                    onChange={(date) => {
                      setStartDate(date);
                      
                    }}
                    customInput={<Input placeholder="Select Date" style={{ cursor: "pointer" }} />}
                  />
                  <div style={{ position: "absolute", cursor: "pointer" }} htmlFor="Dt">
                    <CiCalendarDate size={30} />
                  </div>
                </InputGroup>
              </div>
            </div>
            <div className="col-6 mb-4">
              <h5>Invoice Status</h5>
              <SingleSelect
                placeItem={"Invoice Status"}
                value={formData?.invoice_status}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "paid", label: "Paid" },
                ]}
                name="invoice_status"
                placeholder={"Select Invoice Status"}
                onChange={(e) => {
                  handleInput(e);
                }}
              />
            </div>
          </div>

          <div className="col-md-12 d-flex  justify-content-end mt-5 p-0">
            <button
              type="button"
              className="btn mr-2"
              onClick={() => {
                clearAllData();
              }}
            >
              Clear
            </button>
            <button className="btn btn-primary mr-3" onClick={() => handleSubmit()}>
              Filter
            </button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default InovoiceFilterModal;
