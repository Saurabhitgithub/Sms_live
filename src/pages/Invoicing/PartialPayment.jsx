import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { toBeDisabled } from "@testing-library/jest-dom/matchers";
import { partial_paymentsFuncation } from "../../service/admin";
export default function PartialPayment({ invoice, isOpen, toggle, onSave, getData, setMakeSure }) {
  const safeInvoice = invoice || {
    invoice_no: "",
    grand_total: 0,
    invoice_table: { total_amount: 0 },
    partialPayments: []
  };

  const [paymentData, setPaymentData] = useState({
    amount: "",
    payment_date: moment().format("YYYY-MM-DD"),
    notes: ""
  });
  const ClearToggle = () => {
    setPaymentData({
      amount: "",
      payment_date: moment().format("YYYY-MM-DD"),
      notes: ""
    });
    setTransactions([]);
    toggle();
  };
  const [transactions, setTransactions] = useState([]);
  const totalAmount = invoice?.grand_total || 0;
  const paidAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const remainingAmount = totalAmount - paidAmount;

  const handleSubmit = async () => {
    try {
      let Payload = {
        id: invoice._id,
        amount: paymentData.amount,
        currentRemain: (invoice.remainingAmount ? invoice.grand_tota : l) - paymentData.amount
      };
      let response = await partial_paymentsFuncation(Payload);
    } catch (e) {
      console.error(e);
    }
  };
  const handleChange = e => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAddPayment = async () => {
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (parseFloat(paymentData.amount) > remainingAmount) {
      alert("Payment amount cannot exceed remaining balance");
      return;
    }

    const newTransaction = {
      _id: Date.now(),
      amount: parseFloat(paymentData.amount),
      payment_date: new Date().toISOString(),
      date: paymentData.payment_date,
      currentRemain: (invoice.remainingAmount ? invoice.remainingAmount : invoice.grand_total) - paymentData.amount
    };

    try {
      let Payload = {
        id: invoice._id,
        amount: parseFloat(paymentData.amount),
        payment_mode: "cash",
        currentRemain: (invoice.remainingAmount ? invoice.remainingAmount : invoice.grand_total) - paymentData.amount
      };

      await partial_paymentsFuncation(Payload);
    } catch (e) {
      console.error(e);
    }
    let trance = [...transactions, newTransaction];
    setTransactions(prev => [...prev, newTransaction]);
    setPaymentData({
      amount: "",
      payment_date: moment().format("YYYY-MM-DD"),
      notes: ""
    });
    const tpaidAmount = trance.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    if (totalAmount === tpaidAmount) {
      setMakeSure({ status: true, id: invoice._id, type: "paid" });

      ClearToggle();
    } else {
      getData();
    }
  };

  const handleDeleteTransaction = id => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleSave = () => {
    onSave({
      ...invoice,
      partialPayments: transactions,
      payment_status: remainingAmount - parseFloat(paymentData.amount) <= 0 ? "paid" : "partial"
    });
    toggle();
  };
  useEffect(() => {
    if (invoice?.partial_payment_history) {
      const sortedTransactions = [...invoice.partial_payment_history].sort((a, b) => {
        return new Date(a.payment_date) - new Date(b.payment_date);
      });
      setTransactions(sortedTransactions);
    }
  }, [invoice]);
  return (
    <Modal isOpen={isOpen} toggle={ClearToggle} size="xl">
      <ModalHeader toggle={ClearToggle}>Partial Payment for Invoice #{safeInvoice.invoice_no || "N/A"}</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <div className="d-flex justify-content-between">
            <h5>Total Amount: ₹{totalAmount?.toFixed(2)}</h5>
            <h5>Remaining Amount: ₹{remainingAmount?.toFixed(2)}</h5>
            <h5>Paid Amount: ₹{paidAmount?.toFixed(2)}</h5>
          </div>
        </div>

        <div className="border p-3 mb-4">
          <h5 className="mb-3">Add New Payment</h5>
          <div className="row">
            <div className="col-md-4">
              <Label>Amount Paid *</Label>
              <Input
                type="number"
                name="amount"
                value={paymentData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                disabled={totalAmount === paidAmount}
              />
            </div>
            <div className="col-md-4">
              <Label>Payment Date *</Label>
              <Input
                step={{ type: toBeDisabled }}
                type="date"
                name="payment_date"
                value={paymentData.payment_date}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="text-right mt-4">
              {totalAmount === paidAmount ? (
                <>
                  <Button
                    color="primary"
                    style={{ marginTop: "7px" }}
                    onClick={() => setMakeSure({ status: true, id: invoice._id, type: "paid" })}
                  >
                    {" "}
                    Covert to Paid
                  </Button>
                </>
              ) : (
                <div>
                  <Button color="primary" style={{ marginTop: "7px" }} onClick={() => handleAddPayment()}>
                    {" "}
                    Add Payment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <h5 className="mb-3">Payment History</h5>
        {transactions.length > 0 ? (
          <Table striped>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>

                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction._id}>
                  <td>{moment(transaction?.payment_date).format("DD-MM-YYYY")}</td>
                  <td>₹{transaction?.amount?.toFixed(2)}</td>

                  <td>
                    <h5> ₹{transaction?.currentRemain?.toFixed(2)}</h5>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No payments recorded yet</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={ClearToggle}>
          Cancel
        </Button>
        {/* <Button color="primary" onClick={handleSave}>
          Save Changes
        </Button> */}
      </ModalFooter>
    </Modal>
  );
}
