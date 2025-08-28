import React from "react";
import Content from "../../layout/content/Content";
import SearchInput from "../../components/commonComponent/searchInput/SearchInput";
import { RSelect } from "../../components/Component";
import { BorderedTable } from "../../components/commonComponent/Bordertable/BorderedTable";
import { Table } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import style from "./style.module.css";

export default function Invoicing() {
  const handleSearchClick = (e) => {
    
  };

  return (
    <>
      <Content>
        <div className="card_container p-4 user_section">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Invoices</h1>
            <div className="flex center export">
              <div>
                <span className="export"> Import</span>
              </div>
              <div className="line ml-2 mr-2"></div>

              <div>
                <span className="export">Export</span>
              </div>

              <div className="line ml-2 mr-2"></div>
              <div>
                <button className="btn_primary_btn" type="button">
                  {" "}
                  Generate Invoice
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-5">
            <div>
              <SearchInput
                className={style.searchContainer}
                placeholder={"Enter invoice no./customer name, phone..."}
                onChange={(e) => handleSearchClick(e.target.value)}
              />
            </div>
            {/* dropdown start  */}
            <div></div>
          </div>

          <div className="mt-5 tableContainer">
            <Table hover={true} responsive>
              <thead style={{ backgroundColor: "#F5F6FA" }}>
                <tr className="table-heading-size">
                  <th scope="row">Invoice No.</th>
                  <th scope="row">Created On</th>
                  <th scope="row">Zone</th>
                  <th scope="row">Name</th>

                  <th scope="row">Phone no.</th>
                  <th scope="row">Amount</th>
                  <th scope="row">Created By</th>
                  <th scope="row">Mode</th>
                  <th scope="row">Status</th>
                  <th scope="row">Due Date</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#0E1073" }}>
                <tr>
                  <td>123456</td>
                  <td>12 june 2024</td>
                  <td>Infinity</td>
                  <td>Arnav</td>
                  <td>1237485586</td>
                  <td>Rs 999</td>
                  <td>Auto</td>
                  <td>UpI</td>
                  <td>Paid</td>
                  <td>12 july 2024</td>
                </tr>

                <tr className="s">
                  <td className="first-data">123456</td>
                  <td>12 june 2024</td>
                  <td>Infinity</td>
                  <td>Arnav</td>
                  <td>1237485586</td>
                  <td>Rs 999</td>
                  <td>Auto</td>
                  <td>UpI</td>
                  <td>Paid</td>
                  <td>12 july 2024</td>
                </tr>

                <tr>
                  <td className="first-data">123456</td>
                  <td>12 june 2024</td>
                  <td>Infinity</td>
                  <td>Arnav</td>
                  <td>1237485586</td>
                  <td>Rs 999</td>
                  <td>Auto</td>
                  <td>UpI</td>
                  <td>Paid</td>
                  <td>12 july 2024</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </Content>
    </>
  );
}
