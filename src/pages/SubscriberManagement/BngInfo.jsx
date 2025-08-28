import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FormGroup, Input, Label } from "reactstrap";

export default function BngInfo({ mode, setOpen, handleSubmit, toggleTab, getDataBng, setGetDatabng,getDataBngFunction,handleInutAttributes,formData }) {
  const [showMoreOne, setShowMoreOne] = useState(false);
  const [showMoreTwo, setShowMoreTwo] = useState(false);
  const toggleShowMoreOne = () => {
    setShowMoreOne(!showMoreOne);
  };
  const toggleShowMoreTwo = () => {
    setShowMoreTwo(!showMoreTwo);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="col-md-12 mt-5 p-0 flex justify-content-between " onClick={toggleShowMoreOne}>
          <div className="labelsHeading">Check Attributes</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreOne ? "show less" : "show more"}
            {showMoreOne ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreOne && (
          <>
            <div className="row">
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-Bandwidth-Max-Up")}  onChange={(e)=>{handleInutAttributes("MicroBNG-Bandwidth-Max-Up","check",e.target.checked,getDataBng["MicroBNG-Bandwidth-Max-Up"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-Bandwidth-Max-Up
                  </Label>
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-Bandwidth-Max-Down")}  onChange={(e)=>{handleInutAttributes("MicroBNG-Bandwidth-Max-Down","check",e.target.checked,getDataBng["MicroBNG-Bandwidth-Max-Down"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-Bandwidth-Max-Down
                  </Label>
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-Bandwidth-Min-Up")} onChange={(e)=>{handleInutAttributes("MicroBNG-Bandwidth-Min-Up","check",e.target.checked,getDataBng["MicroBNG-Bandwidth-Min-Up"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-Bandwidth-Min-Up
                  </Label>
                </FormGroup>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-Bandwidth-Min-Down")} onChange={(e)=>{handleInutAttributes("MicroBNG-Bandwidth-Min-Down","check",e.target.checked,getDataBng["MicroBNG-Bandwidth-Min-Down"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-Bandwidth-Min-Down
                  </Label>
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-QoS-Profile")} onChange={(e)=>{handleInutAttributes("MicroBNG-QoS-Profile","check",e.target.checked,getDataBng["MicroBNG-QoS-Profile"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-QoS-Profile
                  </Label>
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-Access-Policy")} onChange={(e)=>{handleInutAttributes("MicroBNG-Access-Policy","check",e.target.checked,getDataBng["MicroBNG-Access-Policy"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-Access-Policy
                  </Label>
                </FormGroup>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-Rate-Limit-Session")} onChange={(e)=>{handleInutAttributes("MicroBNG-Rate-Limit-Session","check",e.target.checked,getDataBng["MicroBNG-Rate-Limit-Session"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-Rate-Limit-Session
                  </Label>
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-Session-Terminate-Time")} onChange={(e)=>{handleInutAttributes("MicroBNG-Session-Terminate-Time","check",e.target.checked,getDataBng["MicroBNG-Session-Terminate-Time"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-Session-Terminate-Time
                  </Label>
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup check>
                  <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.checkAttributes || {})?.includes("MicroBNG-Session-Terminate-Action")} onChange={(e)=>{handleInutAttributes("MicroBNG-Session-Terminate-Action","check",e.target.checked,getDataBng["MicroBNG-Session-Terminate-Action"])}}/>
                  <Label className="labels ml-1 mt-1" check>
                    MicroBNG-Session-Terminate-Action
                  </Label>
                </FormGroup>
              </div>
            </div>
          </>
        )}
        <div className="col-md-12 mt-5 p-0 flex justify-content-between " onClick={toggleShowMoreTwo}>
          <div className="labelsHeading">Reply Attributes</div>
          <div className="labelsHeading" style={{ cursor: "pointer" }}>
            {showMoreTwo ? "show less" : "show more"}
            {showMoreTwo ? (
              <SlArrowUp style={{ marginLeft: "10px", fontSize: "12px" }} />
            ) : (
              <SlArrowDown style={{ marginLeft: "8px", fontSize: "12px" }} />
            )}
          </div>
        </div>
        <div>
          <hr style={{ marginBottom: "0px !important", padding: "0px !important" }} />
        </div>
        {showMoreTwo && (
           <>
           <div className="row">
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-Bandwidth-Max-Up")}  onChange={(e)=>{handleInutAttributes("MicroBNG-Bandwidth-Max-Up","reply",e.target.checked,getDataBng["MicroBNG-Bandwidth-Max-Up"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-Bandwidth-Max-Up
                 </Label>
               </FormGroup>
             </div>
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-Bandwidth-Max-Down")}  onChange={(e)=>{handleInutAttributes("MicroBNG-Bandwidth-Max-Down","reply",e.target.checked,getDataBng["MicroBNG-Bandwidth-Max-Down"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-Bandwidth-Max-Down
                 </Label>
               </FormGroup>
             </div>
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-Bandwidth-Min-Up")} onChange={(e)=>{handleInutAttributes("MicroBNG-Bandwidth-Min-Up","reply",e.target.checked,getDataBng["MicroBNG-Bandwidth-Min-Up"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-Bandwidth-Min-Up
                 </Label>
               </FormGroup>
             </div>
           </div>
           <div className="row mt-3">
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-Bandwidth-Min-Down")} onChange={(e)=>{handleInutAttributes("MicroBNG-Bandwidth-Min-Down","reply",e.target.checked,getDataBng["MicroBNG-Bandwidth-Min-Down"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-Bandwidth-Min-Down
                 </Label>
               </FormGroup>
             </div>
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-QoS-Profile")} onChange={(e)=>{handleInutAttributes("MicroBNG-QoS-Profile","reply",e.target.checked,getDataBng["MicroBNG-QoS-Profile"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-QoS-Profile
                 </Label>
               </FormGroup>
             </div>
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-Access-Policy")} onChange={(e)=>{handleInutAttributes("MicroBNG-Access-Policy","reply",e.target.checked,getDataBng["MicroBNG-Access-Policy"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-Access-Policy
                 </Label>
               </FormGroup>
             </div>
           </div>
           <div className="row mt-3">
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-Rate-Limit-Session")} onChange={(e)=>{handleInutAttributes("MicroBNG-Rate-Limit-Session","reply",e.target.checked,getDataBng["MicroBNG-Rate-Limit-Session"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-Rate-Limit-Session
                 </Label>
               </FormGroup>
             </div>
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-Session-Terminate-Time")} onChange={(e)=>{handleInutAttributes("MicroBNG-Session-Terminate-Time","reply",e.target.checked,getDataBng["MicroBNG-Session-Terminate-Time"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-Session-Terminate-Time
                 </Label>
               </FormGroup>
             </div>
             <div className="col-md-4">
               <FormGroup check>
                 <Input name="generateInvoice" type="checkbox" className="checkbox input" checked={Object?.keys(formData?.replyAttributes || {})?.includes("MicroBNG-Session-Terminate-Action")} onChange={(e)=>{handleInutAttributes("MicroBNG-Session-Terminate-Action","reply",e.target.checked,getDataBng["MicroBNG-Session-Terminate-Action"])}}/>
                 <Label className="labels ml-1 mt-1" check>
                   MicroBNG-Session-Terminate-Action
                 </Label>
               </FormGroup>
             </div>
           </div>
         </>
        )}

        <div className="w-100 d-flex justify-content-end mt-4 p-0">
          <button type="button" className="btn border mr-2" onClick={() => toggleTab("2")}>
            Back
          </button>
          <button
            type="button"
            className="btn mr-2"
            onClick={() => {
              setOpen(!open);
              // toggleTab("2");
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {mode == "edit" ? "Edit" : "Create"}
          </button>
        </div>
      </form>
    </>
  );
}
