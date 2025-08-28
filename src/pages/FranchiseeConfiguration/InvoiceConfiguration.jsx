import React, { Fragment, useEffect, useState } from "react";
import { Table } from "reactstrap";
import { classnames } from "classnames";

export default function InvoiceConfiguration({
  toggleTab,
  open,
  setOpen,
  mode,
  setFormData,
  formData,
  configurationAddFunction,
  allPlanData
}) {
  const [tableData, setTableData] = useState([]);
  function tableAllData() {
    let planInfo = allPlanData.filter(es => formData?.assignsPlan?.includes(es._id));
    let infoArry = planInfo.map(res => {
      let tax = (res.amount * Number(formData.taxPercentage)) / 100;
      let addtax = (res.amount * Number(formData.tdsPercentage)) / 100;
      return {
        planName: res.plan_name,
        ispShare: 100 - Number(formData.revenueShare),
        fShare: Number(formData.revenueShare),
        total: res.amount,
        invoiceTax: formData.taxPercentage,
        addTax: formData.tdsPercentage,
        invoiceTaxAmount: tax.toFixed(2),
        addTaxAmount: addtax.toFixed(2),
        totalAmt: (res.amount + tax + addtax).toFixed(2)
      };
    });

    setTableData(infoArry);
  }
  useEffect(() => {
    tableAllData();
  }, [formData]);
  return (
    <>
      <div className="f-18 fw-500">Calculate Invoice Breakup</div>
      <div className="table-responsive mt-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className="w-100 mt-4 table-with-styling">
          <thead className="f-16 fw-500">
            <tr>
              <th>Plan Name</th>
              <th>ISP Share</th>
              <th>Franchisee Share</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody className="invoice_creation_table">
            {tableData?.map((res, index) => (
              <Fragment key={index}>
                <tr className="first-row">
                  <td>{res?.planName}</td>
                  <td>{res?.ispShare}%</td>
                  <td>{res?.fShare}%</td>
                  <td>{res?.total}</td>
                  {/* <td style={{ color: "rgba(150, 153, 167, 1)" }}>(Revenue Calculation Exclude Tax)</td> */}
                  <td></td>
                </tr>

                <tr
                  className="f-16 fw-500 mt-2 invoice_creation_table_row"
                  style={{ background: "rgba(248, 248, 248, 1)" }}
                >
                  <td></td>
                  <td></td>
                  <td>Invoice Tax</td>
                  <td>{`${res?.invoiceTaxAmount}(${res?.invoiceTax}%)`}</td>
                  <td style={{ color: "rgba(150, 153, 167, 1)" }}>(Revenue Calculation Exclude Tax)</td>

                </tr>

                <tr className="invoice_creation_table_row" style={{ background: "rgba(248, 248, 248, 1)" }}>
                  <td></td>
                  <td></td>
                  <td>Additional Tax</td>
                  <td>{`${res?.addTaxAmount}(${res?.addTax}%)`}</td>
                  <td style={{ color: "rgba(150, 153, 167, 1)" }}>(Revenue Calculation Include Tax)</td>

                </tr>
                <tr className="invoice_creation_table_row" style={{ background: "rgba(248, 248, 248, 1)" }}>
                  <td></td>
                  <td></td>
                  <td className="f-16 fw-700">Total Amount</td>
                  <td>{res?.totalAmt}</td>
                  {/* <td style={{ color: "rgba(150, 153, 167, 1)" }}>(Revenue Calculation Include Tax)</td> */}
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="d-table w-100">
        <div className="d-table-row">
          <div className="d-table-cell">Plan Name</div>
          <div className="d-table-cell">ISP Share</div>
          <div className="d-table-cell">Franchisee Share</div>
          <div className="d-table-cell">Total</div>
        </div>

        <hr className="w-100 my-2" style={{ border: "1px solid lightgray" }} />

        <div className="d-table-row">
          <div className="d-table-cell">100mbps</div>
          <div className="d-table-cell">60%</div>
          <div className="d-table-cell">Share</div>
          <div className="d-table-cell">Total</div>
        </div>

        <div className="d-table-row">
          <div className="d-table-cell"></div>
          <div className="d-table-cell"></div>
          <div className="d-table-cell">Invoive tax</div>
          <div className="d-table-cell">Total</div>
          <div className="d-table-cell">(Revenue Calculation Exclude Tax)</div>
        </div>
        <div className="d-table-row">
          <div className="d-table-cell"></div>
          <div className="d-table-cell"></div>
          <div className="d-table-cell">Invoive tax</div>
          <div className="d-table-cell">Total</div>
          <div className="d-table-cell">(Revenue Calculation Exclude Tax)</div>
        </div>

        <div className="d-table-row">
          <div className="d-table-cell"></div>
          <div className="d-table-cell"></div>
          <div className="d-table-cell">Invoive tax</div>
          <div className="d-table-cell">Total</div>
          <div className="d-table-cell"></div>
        </div>
      </div> */}

      {/* <div className="w-75 d-flex justify-content-between mt-3">
        <div className="f-18 fw-500">Invoice Taxe</div>
        <div className="f-18 fw-500">18</div>
        <div>(Revenue Calculation Exclude Tax)</div>
      </div>
      <div className="w-75 d-flex justify-content-between mt-3">
        <div className="f-18 fw-500">Additional Tax(TDS)</div>
        <div className="f-18 fw-500">118</div>
        <div>(Revenue Calculation Include Tax)</div>
      </div> */}
      <div className="d-flex justify-content-end mt-4">
        <div className="d-flex">
          <button
            type="button"
            className="btn text-primary mr-3"
            onClick={() => {
              toggleTab("1");
            }}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              configurationAddFunction();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
