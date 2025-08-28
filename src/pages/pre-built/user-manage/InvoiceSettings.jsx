import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import { Input, Label } from "reactstrap";
import { addInvoiceSeq, disableAllSeq, getInvoiceSeq } from "../../../service/admin";
import Loader from "../../../components/commonComponent/loader/Loader";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Block } from "../../../components/Component";
import Head from "../../../layout/head/Head";
import { permisionsTab } from "../../../assets/userLoginInfo";
import Error403 from "../../../components/error/error403";
const InvoiceSettings = ({ sm, updateSm }) => {
  const [formData, setFormData] = useState({
    paid: {
      hsc_sac: "",
      digitCount: "",
      for_seq: "paid"
    },
    performa: {
      hsc_sac: "",
      digitCount: "",
      for_seq: "perfoma"
    },
    proposal: {
      hsc_sac: "",
      digitCount: "",
      for_seq: "proposal"
    },
    credit: {
      hsc_sac: "",
      digitCount: "",
      for_seq: "credit"
    }
  });
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [valid, setVaild] = useState(false);

  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();

    const permissions = res.filter(s => s.tab_name === "Invoice Settings");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
    }
  }
  function handleInput(e, key) {
    let { value, name } = e.target;
    if (key === "paid") {
      let Obj = { ...formData.paid, [name]: value.trim(), for_seq: "paid" };
      setFormData({ ...formData, paid: Obj });
    } else if (key === "proposal") {
      let Obj = { ...formData?.proposal, [name]: value.trim(), for_seq: "proposal" };
      setFormData({ ...formData, proposal: Obj });
    } else if (key === "credit") {
      let Obj = { ...formData.credit, [name]: value.trim(), for_seq: "credit" };
      setFormData({ ...formData, credit: Obj });
    } else {
      let Obj = { ...formData.performa, [name]: value.trim(), for_seq: "perfoma" };
      setFormData({ ...formData, performa: Obj });
    }
  }
  function checkFields(user) {
    for (let key in user) {
      for (let innerKey in user[key]) {
        if (user[key][innerKey] === "") {
          return false;
        }
      }
    }
    return true;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setLoader(true);
    if (checkFields(formData) && formData.paid.hsc_sac.trim() !== formData.performa.hsc_sac.trim()) {
      try {
        await disableAllSeq();
        await addInvoiceSeq(formData.paid);
        await addInvoiceSeq(formData.performa);
        await addInvoiceSeq(formData.proposal);
        await addInvoiceSeq(formData?.credit);
        await getInvoiceSeqData();
      } catch (err) {
        console.log(err);
      }
    } else {
      setVaild(true);
    }
    setLoader(false);
  }
  async function getInvoiceSeqData() {
    setLoader(true);
    await permissionFunction();
    let res = await getInvoiceSeq();
    let response = res.data.data;
    if (response.length === 4) {
      let paid = response.find(e => e.for_seq === "paid");
      let performa = response.find(e => e.for_seq === "perfoma");
      let proposal = response.find(e => e.for_seq === "proposal");
      let credit = response.find(e => e.for_seq === "credit");

      setFormData({ paid: paid, performa: performa, proposal: proposal, credit: credit });
      setOpen(true);
    }
    setLoader(false);
  }

  useEffect(() => {
    getInvoiceSeqData();
  }, []);
  return (
    <React.Fragment>
      {loader && <Loader />}
      <Head title="User List - Profile"></Head>
      <Block>
        {permissionAccess ? (
          <>
            {" "}
            <form onSubmit={handleSubmit}>
              <div className="card_container p-4 user_section">
                <h4>Invoice Settings</h4>
                <h1 className="mt-5">Paid Invoice</h1>
                {/* <p>
                  The code assigned to Paid invoices can only be changed at the start of the next financial year once it
                  is set.
                </p> */}
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="mb-4">
                      <label>
                        Code<span className="text-danger">*</span>
                      </label>
                      <Input
                        className="mt-2"
                        type="text"
                        value={formData?.paid?.hsc_sac}
                        placeholder="Enter the Code"
                        name="hsc_sac"
                        onChange={e => handleInput(e, "paid")}
                        // disabled={open}
                        valid={false}
                        required
                      />
                      {formData.paid.hsc_sac.length !== 0 &&
                        formData.performa.hsc_sac.length !== 0 &&
                        formData?.proposal?.hsc_sac.length !== 0 &&
                        (formData.paid.hsc_sac.trim() === formData.performa.hsc_sac.trim() ||
                          formData.paid.hsc_sac.trim() === formData?.proposal?.hsc_sac.trim()) && (
                          <>
                            <p className="text-danger">Paid code, Performa code and Proposal code can not be same</p>
                          </>
                        )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12 mb-4">
                    <label>Issued On</label>
                    <Input
                      className="mt-2"
                      type="text"
                      value={
                        formData?.paid?.issue_on ? moment(formData?.paid?.issue_on).format("DD/MM/YYYY") : "--/--/----"
                      }
                      name="date"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-4">
                    <label>
                      No.Digits(After the Code)<span className="text-danger">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      type="number"
                      placeholder="Enter the digits"
                      name="digitCount"
                      value={formData.paid.digitCount}
                      onChange={e => handleInput(e, "paid")}
                      // disabled={open}
                      required
                    />
                  </div>
                </div>

                <h1 className="mt-5">Performa Invoice</h1>
                {/* <p>
                  The code assigned to Performa invoices can only be changed at the start of the next financial year
                  once it is set.
                </p> */}
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-4">
                    <label>
                      Code<span className="text-danger">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      type="text"
                      placeholder="Enter the  Code"
                      name="hsc_sac"
                      value={formData.performa.hsc_sac}
                      onChange={e => handleInput(e, "performa")}
                      // disabled={open}
                      required
                    />
                    {formData.paid.hsc_sac.length !== 0 &&
                      formData.performa.hsc_sac.length !== 0 &&
                      formData?.proposal.hsc_sac.length !== 0 &&
                      (formData.paid.hsc_sac.trim() === formData.performa.hsc_sac.trim() ||
                        formData.performa.hsc_sac.trim() === formData?.proposal.hsc_sac.trim()) && (
                        <>
                          <p className="text-danger">Paid code, Performa code and Proposal code can not be same</p>
                        </>
                      )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-4">
                    <label>Issued On</label>
                    <Input
                      className="mt-2"
                      type="text"
                      value={
                        formData?.performa?.issue_on
                          ? moment(formData?.performa?.issue_on).format("DD/MM/YYYY")
                          : "--/--/----"
                      }
                      name="date"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-4">
                    <label>
                      No.Digits(After the Code)<span className="text-danger">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      type="number"
                      placeholder="Enter the digits"
                      name="digitCount"
                      value={formData.performa.digitCount}
                      onChange={e => handleInput(e, "performa")}
                      // disabled={open}
                      required
                    />
                  </div>
                </div>

                <h1 className="mt-5">Proposal Invoice</h1>
                {/* <p>
                  The code assigned to Proposal invoices can only be changed at the start of the next financial year
                  once it is set.
                </p> */}
                <div className="row mb-4">
                  <div className="col-md-6 col-sm-12">
                    <label>
                      Code<span className="text-danger">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      type="text"
                      value={formData?.proposal?.hsc_sac}
                      placeholder="Enter the Code"
                      name="hsc_sac"
                      onChange={e => handleInput(e, "proposal")}
                      // disabled={open}
                      valid={false}
                      required
                    />
                    {formData.paid.hsc_sac.length !== 0 &&
                      formData.performa.hsc_sac.length !== 0 &&
                      formData?.proposal?.hsc_sac.length !== 0 &&
                      (formData?.proposal?.hsc_sac.trim() === formData.performa.hsc_sac.trim() ||
                        formData?.proposal?.hsc_sac.trim() === formData.paid.hsc_sac.trim()) && (
                        <>
                          <p className="text-danger">Paid code, Performa code and Proposal code can not be same</p>
                        </>
                      )}
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label>Issued On</label>
                    <Input
                      className="mt-2"
                      type="text"
                      value={
                        formData?.paid?.issue_on ? moment(formData?.paid?.issue_on).format("DD/MM/YYYY") : "--/--/----"
                      }
                      name="date"
                      disabled
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6 col-sm-12">
                    <label>
                      No.Digits(After the Code)<span className="text-danger">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      type="number"
                      placeholder="Enter the digits"
                      name="digitCount"
                      value={formData?.proposal?.digitCount}
                      onChange={e => handleInput(e, "proposal")}
                      // disabled={open}
                      required
                    />
                  </div>
                </div>

                <h1 className="mt-5">Credit Note</h1>
                {/* <p>
                  The code assigned to Proposal invoices can only be changed at the start of the next financial year
                  once it is set.
                </p> */}
                <div className="row mb-4">
                  <div className="col-md-6 col-sm-12">
                    <label>
                      Code<span className="text-danger">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      type="text"
                      value={formData?.credit?.hsc_sac}
                      placeholder="Enter the Code"
                      name="hsc_sac"
                      onChange={e => handleInput(e, "credit")}
                      // disabled={open}
                      valid={false}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label>Issued On</label>
                    <Input
                      className="mt-2"
                      type="text"
                      value={
                        formData?.credit?.issue_on
                          ? moment(formData?.credit?.issue_on).format("DD/MM/YYYY")
                          : "--/--/----"
                      }
                      name="date"
                      disabled
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6 col-sm-12">
                    <label>
                      No.Digits(After the Code)<span className="text-danger">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      type="number"
                      placeholder="Enter the digits"
                      name="digitCount"
                      value={formData?.credit?.digitCount}
                      onChange={e => handleInput(e, "credit")}
                      // disabled={open}
                      required
                    />
                  </div>
                </div>
                <div className="flex end mt-5">
                  <div type="button" className="cancel_form_btn pointer" onClick={() => history.goBack()}>
                    Cancel
                  </div>
                  {/* {!open && (
                    <> */}
                  <button type="submit" className="btn_primary_btn">
                    Save
                  </button>
                  {/* </>
                  )} */}
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            <Error403 />
          </>
        )}
      </Block>
    </React.Fragment>
  );
};

export default InvoiceSettings;
