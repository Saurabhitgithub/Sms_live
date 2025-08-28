import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import { Form, FormGroup, Input } from "reactstrap";
import "./role.css";
import { getRoleDatabyId, updatePermission } from "../../service/admin";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../components/commonComponent/loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { success } from "../../Store/Slices/SnackbarSlice";
import { permisionsTab } from "../../assets/userLoginInfo";

const UpdateAccess = () => {
  const [loader, setLoader] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [access, setAccess] = useState({
    permission_tab: [
      {
        tab_name: "Dashboard",
        is_show: false,
        tab_function: [
          { tab_functionName: "Total Subscribers", is_showFunction: false },
          { tab_functionName: "Active Subscribers", is_showFunction: false },
          { tab_functionName: "Total Revenue", is_showFunction: false },
          { tab_functionName: "Invoice Paid", is_showFunction: false },
          { tab_functionName: "Active Plans", is_showFunction: false },
          { tab_functionName: "Total Active Users (Doughnut chart)", is_showFunction: false },
          { tab_functionName: "User Distribution (Doughnut chart)", is_showFunction: false },
          { tab_functionName: "Last Month Revenue (Bar Chart)", is_showFunction: false },
          { tab_functionName: "Total Revenue (Line chart)", is_showFunction: false },
          { tab_functionName: "Total Subscriber (Bar char)", is_showFunction: false },
        ],
      },
      // {
      //   tab_name: "Isp Management",
      //   is_show: false,
      //   tab_function: [
         
      //   ],
      // },
      {
        tab_name: "User Management",

        is_show: false,
        tab_function: [
          { tab_functionName: "Add User", is_showFunction: false },
          { tab_functionName: "Edit User", is_showFunction: false },
          { tab_functionName: "Delete User", is_showFunction: false },
          { tab_functionName: "View User", is_showFunction: false },
        ],
      },
      {
        tab_name: "Subscription Plan",
        is_show: false,
        tab_function: [
          { tab_functionName: "Add Plan", is_showFunction: false },
          { tab_functionName: "Edit Plan", is_showFunction: false },
          { tab_functionName: "Delete Plan", is_showFunction: false },
          { tab_functionName: "Import Plan", is_showFunction: false },
          { tab_functionName: "Export Plan", is_showFunction: false },
          { tab_functionName: "View Plan", is_showFunction: false },
        ],
      },
      {
        tab_name: "Subscriber Management",
        is_show: false,
        tab_function: [
          { tab_functionName: "Add Subscriber", is_showFunction: false },
          { tab_functionName: "Edit Subscriber", is_showFunction: false },
          { tab_functionName: "Delete Subscriber", is_showFunction: false },
          { tab_functionName: "View Subscriber", is_showFunction: false },
          { tab_functionName: "Subscriber Plan Tab", is_showFunction: false },
          { tab_functionName: "Subscriber Other Tab", is_showFunction: false },

        ],
      },

      {
        tab_name: "Bandwidth Management",
        is_show: false,
        tab_function: [
          { tab_functionName: "Add Bandwidth", is_showFunction: false },
          { tab_functionName: "Edit Bandwidth", is_showFunction: false },
          { tab_functionName: "Delete Bandwidth", is_showFunction: false },
          { tab_functionName: "View Bandwidth", is_showFunction: false },
        ],
      },
      {
        tab_name: "Service Management",
        is_show: false,
        tab_function: [
          { tab_functionName: "Add Service", is_showFunction: false },
          { tab_functionName: "Edit Service", is_showFunction: false },
          { tab_functionName: "Delete Service", is_showFunction: false },
          { tab_functionName: "View Service", is_showFunction: false },
        ],
      },

      {
        tab_name: "Email Template",
        is_show: false,
        tab_function: [
          // { tab_functionName: "Add  payment", is_showFunction: false },
          // { tab_functionName: "Edit Payment", is_showFunction: false },
          // { tab_functionName: "Delete Payment", is_showFunction: false },
          // { tab_functionName: "View Payment", is_showFunction: false },

        ],
      },
      {
        tab_name: "Invoices",
        is_show: false,
        tab_function: [
          { tab_functionName: "Invoice Management Tab", is_showFunction: false },
          { tab_functionName: "Add Invoice", is_showFunction: false },
          { tab_functionName: "View Invoice", is_showFunction: false },
          { tab_functionName: "Export Invoice", is_showFunction: false },
          { tab_functionName: "Change Invoice Status", is_showFunction: false },
          { tab_functionName: "Proposal Tab", is_showFunction: false },
          { tab_functionName: "View Proposal", is_showFunction: false },
          { tab_functionName: "Export Proposal", is_showFunction: false },
          { tab_functionName: "Change Proposal Status", is_showFunction: false },
        ],
      },
      {
        tab_name: "Reports",

        is_show: false,
        tab_function: [
          { tab_functionName: "Add  Report", is_showFunction: false },
          { tab_functionName: "Edit Report", is_showFunction: false },
          { tab_functionName: "Delete Report", is_showFunction: false },
        ],
      },
      {
        tab_name: "Activity Logs",
        is_show: false,
        tab_function: [
          { tab_functionName: "Export Activity", is_showFunction: false },
          { tab_functionName: "Event Log", is_showFunction: false },
          { tab_functionName: "Payment Log", is_showFunction: false },
        ],
      },
      {
        tab_name: "Role Management",
        is_show: false,
        tab_function: [
          { tab_functionName: "Add Role", is_showFunction: false },
          { tab_functionName: "Update Access", is_showFunction: false },
        ],
      },
      {
        tab_name: "Leads",
        is_show: false,
        tab_function: [
          { tab_functionName: "Leads Management Tab", is_showFunction: false },
          { tab_functionName: "Export Leads", is_showFunction: false },
          { tab_functionName: "New Leads", is_showFunction: false },
          { tab_functionName: "Edit Leads", is_showFunction: false },
          { tab_functionName: "Delete Leads", is_showFunction: false },
          { tab_functionName: "Assigned To", is_showFunction: false },
          { tab_functionName: "Status", is_showFunction: false },
          { tab_functionName: "Lead Comment/Conversation", is_showFunction: false },
          { tab_functionName: "Leads Configuration Tab", is_showFunction: false },
          { tab_functionName: "New Leads Configuration", is_showFunction: false },
          { tab_functionName: "Delete Leads Configuration", is_showFunction: false },
          { tab_functionName: "Leads Assignment Tab", is_showFunction: false },
          { tab_functionName: "Select Stages ( Leads Assignment )", is_showFunction: false },
          { tab_functionName: "Lead owner can view leads ( Leads Assignment )", is_showFunction: false },

        ],
      },

      {
        tab_name: "Payment Transaction",
        is_show: false,
        tab_function: [
          { tab_functionName: "Export Leads", is_showFunction: false },
          { tab_functionName: "Refund Payment", is_showFunction: false },
        ],
      },
      {
        tab_name: "Help Desk",
        is_show: false,
        tab_function: [
          { tab_functionName: "Help Desk Management Tab", is_showFunction: false },
          { tab_functionName: "Export Ticket", is_showFunction: false },
          { tab_functionName: "Raise Ticket", is_showFunction: false },
          { tab_functionName: "Priority Ticket", is_showFunction: false },
          { tab_functionName: "View Ticket", is_showFunction: false },
          { tab_functionName: "Help Desk Configuration Tab", is_showFunction: false },
          { tab_functionName: "New Help Desk Configuration", is_showFunction: false },
          { tab_functionName: "Delete Help Desk Configuration", is_showFunction: false },
          { tab_functionName: "Help Desk Assignment Tab", is_showFunction: false },
          { tab_functionName: "Select Stages ( Help Desk Assignment )", is_showFunction: false },
          { tab_functionName: "Ticket  owner can view Ticket  ( Help Desk Assignment )", is_showFunction: false },
        ],
      },
      {
        tab_name: "Invoice Settings",
        is_show: false,
        tab_function: [],
      },
      {
        tab_name: "Email Management",
        is_show: false,
        tab_function: [
          { tab_functionName: "Add Bcc", is_showFunction: false },
          { tab_functionName: "Delete Bcc", is_showFunction: false },
        ],
      },
      {
        tab_name: "HSN/SAC Code",
        is_show: false,
        tab_function: [
          { tab_functionName: "Add HSN/SAC Code", is_showFunction: false },
          { tab_functionName: "Delete HSN/SAC Code", is_showFunction: false },
        ],
      },
      {
        tab_name: "Settings",
        is_show: false,
        tab_function: [{ tab_functionName: "General Setting Tab", is_showFunction: false }],
      },
      {
        tab_name: "Franchisee",
        is_show: false,
        tab_function: [
          { tab_functionName: "Franchisee Management Tab", is_showFunction: false },
          { tab_functionName: "Export Csv (Franchisee Management)", is_showFunction: false },
          { tab_functionName: "Add Balance (Franchisee Management)", is_showFunction: false },
          { tab_functionName: "Reduce Balance (Franchisee Management)", is_showFunction: false },
          { tab_functionName: "Franchisee Configuration Tab", is_showFunction: false },
          { tab_functionName: "Add Franchisee (Franchisee Configuration)", is_showFunction: false },
          { tab_functionName: "Edit Franchisee (Franchisee Configuration)", is_showFunction: false },
          { tab_functionName: "Export Csv (Franchisee Configuration)", is_showFunction: false },
          { tab_functionName: "Delete Franchisee (Franchisee Configuration)", is_showFunction: false },
          { tab_functionName: "Franchisee Statement Tab", is_showFunction: false },
          { tab_functionName: "Export Csv (Franchisee Statement)", is_showFunction: false },
        ],
      },
      {
        tab_name: "Payment Collection",
        is_show: false,
        tab_function: [
          { tab_functionName: "Define Area Tab", is_showFunction: false },
          { tab_functionName: "Mapping Admins Tab", is_showFunction: false },
          { tab_functionName: "Viewing Users Tab", is_showFunction: false },
          { tab_functionName: "Collection Approval Tab", is_showFunction: false },
          // { tab_functionName: "Admin-Wise Tab", is_showFunction: false },
          
        ],
      },
      {
        tab_name: "Inventory Management",

        is_show: false,
        tab_function: [
          // { tab_functionName: "Add  Report", is_showFunction: false },
          // { tab_functionName: "Edit Report", is_showFunction: false },
          // { tab_functionName: "Delete Report", is_showFunction: false },
        ],
      },
      // {
      //   tab_name: "Bng Attributes",
      //   is_show: false,
      //   tab_function: [
        
      //   ],
      // },
    ],
  });
  const handleCheckbox = (value, key) => {
    let filterData = access.permission_tab.map((res) => {
      if (res.tab_name === key) {
        res.is_show = value;

        res.tab_function = res.tab_function.map((e) => {
          e.is_showFunction = value;
          return e;
        });

        return res;
      } else {
        return res;
      }
    });
    setAccess({ ...access, permission_tab: filterData });
  };

  const handleCheckboxChild = (value, key, child) => {
    let filterData = access.permission_tab.map((res) => {
      if (res.tab_name === key) {
        res.tab_function = res.tab_function.map((e) => {
          if (e.tab_functionName === child) {
            e.is_showFunction = value;
            return e;
          } else {
            return e;
          }
        });
        return res;
      } else {
        return res;
      }
    });
    setAccess({ ...access, permission_tab: filterData });
  };

  // const handleUpdate = async () => {
  //   try {
  //     setLoader(true);
  //     await updatePermission({ permission_tab: access.permission_tab }, id);

  //     history.push("/roleManagement");
  //   } catch (err) {
  //     console.log(err.message);
  //     setLoader(false);
  //   } finally {
  //     setLoader(false);
  //     dispatch(
  //       success({
  //         show: true,
  //         msg: "Role Updated Successfully",
  //         severity: "success",
  //       })
  //     );
  //   }
  // };
const handleUpdate = async () => {
    try {
      setLoader(true);
      await updatePermission({ permission_tab: access.permission_tab }, id);
      await getRoleData(); 
 
      dispatch(
        success({
          show: true,
          msg: "Role Updated Successfully",
          severity: "success",
        })
      );
      history.push("/roleManagement");
    } catch (err) {
      console.log(err.message);
      setLoader(false);
    } finally {
      setLoader(false);
      dispatch(
        success({
          show: true,
          msg: "Role Updated Successfully",
          severity: "success",
        })
      );
    }
  };


  // const getRoleData = async () => {
  //   try {
  //     let res = await getRoleDatabyId(id);
  //     if (res?.data?.data?.permission_tab?.length !== 0) {
  //       let response = res.data.data.permission_tab;
  //       let namesInB = new Set(response.map((item) => item.tab_name));

  //       access.permission_tab.forEach((item) => {
  //         if (!namesInB.has(item.tab_name)) {
  //           response.push(item);
  //         }
  //       });
  //       setAccess({ ...res.data.data, permission_tab: response });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

//   const getRoleData = async () => {
//   try {
//     const roleRes = await getRoleDatabyId(id);
//     const permRes = await permisionsTab();

//     if (roleRes?.data?.data?.permission_tab?.length !== 0) {
//       let roleTabs = roleRes.data.data.permission_tab;
//       let namesInRole = new Set(roleTabs.map(item => item.tab_name));

//       // Add missing tabs from access.permission_tab
//       access.permission_tab.forEach(item => {
//         if (!namesInRole.has(item.tab_name)) {
//           roleTabs.push(item);
//         }
//       });

//       // Now inject is_show and is_showFunction from permisionsTab API
//       const finalTabs = roleTabs.map(roleTab => {
//         const matchedPermTab = permRes.find(p =>
//           p.tab_name.toLowerCase() === roleTab.tab_name.toLowerCase()
//         );

//         return {
//           ...roleTab,
//           is_show: matchedPermTab?.is_show ?? false, // ✅ override
//           tab_function: roleTab.tab_function.map(func => {
//             const matchedFunc = matchedPermTab?.tab_function?.find(
//               f => f.tab_functionName.toLowerCase() === func.tab_functionName.toLowerCase()
//             );
//             return {
//               ...func,
//               is_showFunction: matchedFunc?.is_showFunction ?? false // ✅ override
//             };
//           })
//         };
//       });

//       setAccess({ ...roleRes.data.data, permission_tab: finalTabs });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
const getRoleData = async () => {
  try {
    const roleRes = await getRoleDatabyId(id);         
    const permRes = await permisionsTab();            
 
    const roleTabs = roleRes?.data?.data?.permission_tab || [];
 
    // Create a map from roleTabs for fast lookup
    const roleTabMap = new Map(
      roleTabs.map(tab => [tab.tab_name.toLowerCase(), tab])
    );
 
    // Final tabs: only tabs allowed by permRes (i.e., is_show === true)
    const finalTabs = permRes
      .filter(permTab => permTab.is_show) 
      .map(permTab => {
        const roleTab = roleTabMap.get(permTab.tab_name.toLowerCase());
 
        // Create map for role functions
        const roleFuncMap = new Map(
          (roleTab?.tab_function || []).map(f => [f.tab_functionName.toLowerCase(), f])
        );
 
        const mergedFunctions = permTab.tab_function.map(f => {
          const updatedFunc = roleFuncMap.get(f.tab_functionName.toLowerCase());
          return {
            ...f,
            is_showFunction: updatedFunc?.is_showFunction ?? false // ✅ take updated value
          };
        });
 
        return {
          ...permTab,
          tab_function: mergedFunctions
        };
      });
 
    // Set the final filtered and merged tabs
    setAccess({ ...roleRes.data.data, permission_tab: finalTabs });
 
  } catch (err) {
    console.log("Error in getRoleData:", err);
  }
};

  useEffect(() => {
    getRoleData();
  }, []);

  //   async function permissionFunction() {
  //   try {
  //     const res = await permisionsTab();

  //     if (res?.length) {
  //       setAccess(prev => {
  //         const updatedTabs = prev.permission_tab.map(defaultTab => {
  //           const matchedTab = res.find(apiTab => apiTab.tab_name?.toLowerCase() === defaultTab.tab_name.toLowerCase());

  //           if (matchedTab) {
  //             return {
  //               ...defaultTab,
  //               is_show: matchedTab.is_show,
  //               tab_function: defaultTab.tab_function.map(func => {
  //                 const matchedFunc = matchedTab.tab_function.find(
  //                   f => f.tab_functionName?.toLowerCase() === func.tab_functionName.toLowerCase()
  //                 );
  //                 return matchedFunc ? { ...func, is_showFunction: matchedFunc.is_showFunction } : func;
  //               })
  //             };
  //           }

  //           return defaultTab;
  //         });

  //         return { ...prev, permission_tab: updatedTabs };
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Permission fetch failed:", err);
  //   }
  // }
  // useEffect(() => {
  //   permissionFunction();
  // }, []);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const handleToggleAllChildren = (value, tabName) => {
  const updated = access.permission_tab.map(tab => {
    if (tab.tab_name === tabName) {
      return {
        ...tab,
        tab_function: tab.tab_function.map(func => ({
          ...func,
          is_showFunction: value, // ✅ Set all children to same value
        })),
      };
    }
    return tab;
  });

  setAccess(prev => ({ ...prev, permission_tab: updated }));
};
  return (
    <Content>
      {loader ? <Loader /> : ""}
      <div className="mainContainer rbacManagement_container">
        <h1>Roles And Permissions Control Management</h1>
        <div className="mt-3">
          <div>
            {/* {access.permission_tab.map((res, ind) => {
              return (
                <div key={ind}>
                  <div className="card_container p-md-4 p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="parentModule_heading">{res.tab_name}</div>

                      <div className={``}>
                        <FormGroup check className="d-flex align-items-center">
                          <Input
                            type="checkbox"
                            className="input "
                            checked={res.is_show}
                            tab_functionName=""
                            onChange={(e) => handleCheckbox(e.target.checked, res.tab_name)}
                          />{" "}
                        </FormGroup>
                      </div>
                    </div>
                    {res.tab_function.length !== 0 && (
                      <>
                        <hr />
                      </>
                    )}
                    {res.tab_function.map((res2, jj) => {
                      return (
                        <div key={jj} className="d-flex align-items-center">
                          <div
                            className={`childModule_heading mb-1 text-capitalize ${
                              res2.tab_functionName.includes("Tab") ? "font-weight-bold" : ""
                            }`}
                          >
                            {res2.tab_functionName}
                          </div>
                          <div className={``}>
                            <FormGroup check className="d-flex align-items-center">
                              <Input
                                type="checkbox"
                                className="input "
                                tab_functionName=""
                                checked={res2.is_showFunction}
                                onChange={(e) =>
                                  handleCheckboxChild(e.target.checked, res.tab_name, res2.tab_functionName)
                                }
                              />{" "}
                            </FormGroup>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })} */}
              {/* {access.permission_tab
              .filter(res => res.is_show) // Only include tabs with is_show: true
              .map((res, ind) => {
                return (
                  <div key={ind}>
                    <div className="card_container p-md-4 p-3 mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="parentModule_heading">{res.tab_name}</div>
                        <div>
                          <FormGroup check className="d-flex align-items-center">
                            <Input
                              type="checkbox"
                              className="input"
                              checked={res.is_show}
                              onChange={e => handleCheckbox(e.target.checked, res.tab_name)}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      {res.tab_function.length !== 0 && <hr />}

                      {res.tab_function.map((res2, jj) => (
                        <div key={jj} className="d-flex align-items-center">
                          <div
                            className={`childModule_heading mb-1 text-capitalize ${
                              res2.tab_functionName.includes("Tab") ? "font-weight-bold" : ""
                            }`}
                          >
                            {res2.tab_functionName}
                          </div>
                          <div>
                            <FormGroup check className="d-flex align-items-center">
                              <Input
                                type="checkbox"
                                className="input"
                                checked={res2.is_showFunction}
                                onChange={e =>
                                  handleCheckboxChild(e.target.checked, res.tab_name, res2.tab_functionName)
                                }
                              />
                            </FormGroup>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })} */}



{access.permission_tab.map((res, ind) => (
  res.is_show ? ( 
    <div key={ind} className="card_container p-md-4 p-3 mb-3">
      <div className="d-flex align-items-center mb-2">
        <div className="parentModule_heading">{res.tab_name}</div>
        <div>
      
                <FormGroup check className="d-flex align-items-center mb-2">
        <Input
          type="checkbox"
          className="input"
          checked={res.tab_function.every(f => f.is_showFunction)}
          onChange={e => handleToggleAllChildren(e.target.checked, res.tab_name)}
        />
       
      </FormGroup>
        </div>
      </div>

      {res.tab_function.length !== 0 && <hr />}

      {res.tab_function.map((res2, jj) => (
        <div key={jj} className="d-flex align-items-center">
          <div
            className={`childModule_heading mb-1 text-capitalize ${
              res2.tab_functionName.includes("Tab") ? "font-weight-bold" : ""
            }`}
          >
            {res2.tab_functionName}
          </div>
          <div>
            <FormGroup check className="d-flex align-items-center">
              <Input
                type="checkbox"
                className="input"
                checked={res2.is_showFunction}
                onChange={e =>
                  handleCheckboxChild(e.target.checked, res.tab_name, res2.tab_functionName)
                }
              />
            </FormGroup>
          </div>
        </div>
      ))}
    </div>
  ) : null // ❌ If is_show === false, render nothing
))}

          </div>
          <div className="d-flex justify-content-end mb-3">
            <div className="d-flex ">
              <button className="btn mr-3" onClick={() => history.push("/roleManagement")}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => handleUpdate()}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default UpdateAccess;
