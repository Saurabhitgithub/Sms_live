import React, { useEffect, useState } from "react";
import { Label, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import Multiselect from "multiselect-react-dropdown";
import Loader from "../../../components/commonComponent/loader/Loader";
import { getAllServices, assignServicesData,getServiceDataById } from "../../../service/admin";
import { userInfo } from "../../../assets/userLoginInfo";

export default function ServicesOther({ planData,
  toggleTab,
  setOpen,
}) {
  const [selectedOptions2, setSelectedOptions2] = useState([]);
  const [allService, setAllService] = useState([]);
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
const [getAllData ,setGetAllData] = useState([])

  // 

  function addTaxesinPrice(price, cgst, sgst, serviceTax) {
    let amount = Number(price);

    if (cgst && cgst !== null) {
      amount += Number(price) * (Number(cgst) / 100);
    }

    if (sgst && sgst !== null) {
      amount += Number(price) * (Number(sgst) / 100);
    }

    if (serviceTax) {
      amount += Number(price) * (Number(serviceTax) / 100);
    }

    return amount;
  }

  const getAllServicesData = async () => {
    setLoader(true);

    await getAllServices()
      .then(res => {
        let reverseData = [...res.data.data];
        let dataReverse = reverseData.reverse();
        setAllService(
          dataReverse.map(es => {
            return {
              value: es._id || "", // Default to empty string if undefined
              qty: 1,
              label: es.service_name || "Unnamed Service", // Default label
              price: es.cost || 0, // Default price to 0
              total: es.cost || 0,
              discount: 0,
              cgst: es?.cgst || 0,
              sgst: es?.sgst || 0,
              priceWithtax: addTaxesinPrice(es.cost || 0, es?.cgst || 0, es?.sgst || 0),
              totalWithTax: addTaxesinPrice(es.cost || 0, es?.cgst || 0, es?.sgst || 0)
            };
          })
        );
        setLoader(false);
      })
      .catch(err => {
        console.error(err);
        setLoader(false);
      });
  };

  const addNewServices = async (e) => {
    e.preventDefault();
    setLoader(true);
  
    let sevicesIdGet = selectedOptions2.map((res) => {
      // Create a new instance of payload for each service
      return {
        subscriber_id: planData._id,
        service_id: res.value, // Assign the current service ID
        assigned_by: userInfo()._id,
      };
    });
  
    
    // return; // Remove return if you want the function to proceed
  
    try {
      let response = await assignServicesData({ services: sevicesIdGet });
      setLoader(false);
      getAllServicesOfSubscriber();
      setVisible(false);
    } catch (err) {
      console.error(err);
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };
  
  const getAllServicesOfSubscriber = async() =>{
    try{
      let ress = await getServiceDataById(planData._id)
      
      let dataReverse = ress?.data?.data.currentServices;
      let reverseData = dataReverse?.reverse()
      
      
      setGetAllData(reverseData)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getAllServicesData();
    getAllServicesOfSubscriber();
  }, []);
  function toggle() {
    setVisible(!visible);
  }

  return (
    <>
      {loader && <Loader />}

      <Modal centered scrollable size="xl" isOpen={visible}>
        <ModalHeader toggle={toggle}>
          <div className="f-24">Add Services</div>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={addNewServices}>
            <div className="row" style={{ paddingBottom: "100px" }}>
              <div className="col-md-12 col-sm-12 col-12">
                <label className="form-label">
                  Select Service<span className="text-danger">*</span>
                </label>
                <Multiselect
                  options={allService}
                  selectedValues={selectedOptions2}
                  onSelect={values => setSelectedOptions2(values)}
                  onRemove={values => setSelectedOptions2(values)}
                  displayValue="label" // Ensures "label" is used for display
                  className="text-capitalize"
                  showCheckbox
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
                      Create Service
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
          <div className="fs-24 fw-500"> Services</div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            Add
          </button>
        </div>
        <div className="mt-3">
          <div className="table-container mt-5">
            <Table hover>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <th>Item</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Discount %</th>
                <th>TOTAL</th>
              </thead>
              <tbody>
                {getAllData.map((res,index)=>{
                   const cgstAmount = (res?.serviceDetails?.cgst / 100) * res?.serviceDetails?.cost;
                   const sgstAmount = (res?.serviceDetails?.sgst / 100) * res?.serviceDetails?.cost;
                  
                   let totalAmount = res?.serviceDetails?.cost + cgstAmount + sgstAmount ;
                   
                  return (
                    <tr>
                      <td>{res?.serviceDetails?.service_name}</td>
                      <td>{totalAmount.toFixed(2)}</td>
                      <td>{res?.serviceDetails?.duration_frequency} {res?.serviceDetails?.duration}</td>
                      <td>---</td>
                      <td>{totalAmount.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="w-100 d-flex justify-content-end mt-4 p-1">
            {/* <button type="button" className="btn mr-2" onClick={() => setOpen(!open)}>
              Cancel
            </button>
            <button type="button" className="btn mr-2" onClick={() => toggleTab("2")} >
              Back
            </button>
            <button type="submit" className="btn btn-primary"  >
              Continue
            </button> */}
          </div>
      </div>
    </>
  );
}
