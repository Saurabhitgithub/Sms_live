import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { userInfo } from "../../assets/userLoginInfo";
import { addAndUpdateBng, getBngData } from "../../service/admin";
import Loader from "../../components/commonComponent/loader/Loader";

export default function BngAttributes() {
  const [formData, setFormData] = useState({
    "MicroBNG-Bandwidth-Max-Up": { opt: "", value: "" },
    "MicroBNG-Bandwidth-Max-Down": { opt: "", value: "" },
    "MicroBNG-Bandwidth-Min-Up": { opt: "", value: "" },
    "MicroBNG-Bandwidth-Min-Down": { opt: "", value: "" },
    "MicroBNG-QoS-Profile": { opt: "", value: "" },
    "MicroBNG-Access-Policy": { opt: "", value: "" },
    "MicroBNG-Rate-Limit-Session": { opt: "", value: "" },
    "MicroBNG-Session-Terminate-Time": { opt: "", value: "" },
    "MicroBNG-Session-Terminate-Action": { opt: "", value: "" }
  });

  const getBngDataFunction = async () => {
    setLoader(true);
    try {
      let response = await getBngData();
      console.log(response);
      setFormData(response.data.data);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    getBngDataFunction();
  }, []);

  const [isDisabled, setIsDisabled] = useState(true);
  const [loader, setLoader] = useState(false);

  const handleInput = (field, type) => e => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [type]: value
      }
    }));
  };

  const handleUpdate = () => {
    setIsDisabled(false);
  };

  const handleSave = async () => {
    setLoader(true);
    try {
      const response = await addAndUpdateBng(formData);
      setIsDisabled(true); // Disable fields after saving
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  // Group fields by subheadings
  const fieldGroups = [
    {
      heading: "1. Bandwidth Management",
      fields: [
        "MicroBNG-Bandwidth-Max-Up",
        "MicroBNG-Bandwidth-Max-Down",
        "MicroBNG-Bandwidth-Min-Up",
        "MicroBNG-Bandwidth-Min-Down"
      ]
    },
    {
      heading: "2. Quality of Service",
      fields: ["MicroBNG-QoS-Profile"]
    },
    {
      heading: "3. Access and Rate Limiting",
      fields: ["MicroBNG-Access-Policy", "MicroBNG-Rate-Limit-Session"]
    },
    {
      heading: "4. Session Management",
      fields: ["MicroBNG-Session-Terminate-Time", "MicroBNG-Session-Terminate-Action"]
    }
  ];

  return (
    <Content>
      {loader && (
        <>
          <Loader />
        </>
      )}
      <div className="card_container m-5 p-3">
        <div className="">
          <h4>Radius And BNG Attribute Configuration</h4>
        </div>

        {fieldGroups.map((group, index) => (
          <div key={index} className="mt-3">
            <div>
              <label className="fw-bold">{group.heading}</label>
            </div>

            {group.fields.map(field => (
              <div className="row mt-3" key={field}>
                <div className="col-md-4">
                  <label>{field}</label>
                </div>
                <div className="col-md-4">
                  <select
                    id="operators"
                    className="form-control"
                    value={formData[field].opt}
                    onChange={handleInput(field, "opt")}
                    disabled={isDisabled}
                  >
                    <option value="" disabled>
                      Select an operator
                    </option>
                    <option value="=">=</option>
                    <option value="==">==</option>
                    <option value=":=">:=</option>
                    <option value="!=">!=</option>
                    <option value="+=">+=</option>
                    <option value=">">{">"}</option>
                    <option value=">=">{">="}</option>
                    <option value="<">{"<"}</option>
                    <option value="<=">{"<="}</option>
                    <option value="~">~</option>
                    <option value="=~">=~</option>
                    <option value="!~">!~</option>
                    <option value="|*">|*</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <input
                    type={field.includes("Bandwidth") ? "number" : "text"}
                    className="form-control"
                    placeholder={`Enter ${field.includes("Bandwidth") ? "value" : "text"}`}
                    value={formData[field].value}
                    onChange={handleInput(field, "value")}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="d-flex justify-content-end mt-4 ">
          <div className="mr-3">
            {!isDisabled ? (
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={handleUpdate}>
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </Content>
  );
}
