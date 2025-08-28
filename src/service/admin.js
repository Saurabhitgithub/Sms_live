import axios from "axios";
import { API, baseUrl } from "./Api";
import { userInfo } from "../assets/userLoginInfo";

let logPayload = {
  user_name: userInfo()?.name,
  user_role: userInfo()?.role,
  user_id: userInfo()?._id
};

const idsForGet = () => {
  let Payload = {};
  if (userInfo().role === "isp admin") {
    Payload = {
      org_id: userInfo()._id,
      role: userInfo()?.role
    };
  } else {
    Payload = {
      org_id: userInfo().org_id,
      // isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id,
      // role: userInfo()?.role
      role: "isp admin"
    };
  }
  return Payload;
};

export const addPlan = async payload => {
  let newPayload = { ...payload, ...logPayload };
  return await axios.post(`${baseUrl}${API.plan.addPlan}`, newPayload);
};

export const getPlanByCreator = async () => {
  return await axios.post(`${baseUrl}${API.plan.getPlanByCreator}`, idsForGet());
};

export const deletePlan = async id => {
  let newPayload = { ...logPayload };
  return await axios.post(`${baseUrl}${API.plan.deletePlan}${id}`, newPayload);
};
export const getPlanById = async id => {
  return await axios.get(`${baseUrl}${API.plan.getPlanById}${id}`);
};

export const bulkInsertPlan = async payload => {
  return await axios.post(`${baseUrl}${API.plan.bulkInsertPlan}`, payload);
};

//           User           //

export const addUser = async payload => {
  let newPayload = { ...payload, ...logPayload };
  return await axios.post(`${baseUrl}${API.user.addUser}`, newPayload);
};

export const getAlluser = async () => {
  return await axios.get(`${baseUrl}${API.user.getAllUser}`);
};

export const getAllUserbyIspId = async () => {
  return await axios.post(`${baseUrl}${API.user.getAllUserbyIspId}`, idsForGet());
};
export const profileUpdate = async (id, payload) => {
  return await axios.post(`${baseUrl}${API.user.profileUpdate}${id}`, payload);
};
export const deleteUser = async id => {
  let newPayload = { ...logPayload };
  return await axios.post(`${baseUrl}${API.user.deleteUser}${id}`, newPayload);
};

export const getUserById = async id => {
  return await axios.get(`${baseUrl}${API.user.getUserById}${id}`);
};

export const updateUser = async (id, payload) => {
  let newPayload = { ...payload, ...logPayload };
  return await axios.put(`${baseUrl}${API.user.updateUser}${id}`, newPayload);
};

export const updateMemberStatus = async (id, payload) => {
  //activity log added
  return await axios.put(`${baseUrl}${API.user.updateMemberStatus}${id}`, payload);
};

export const planStatusChanges = async id => {
  let newPayload = { ...logPayload };
  return await axios.put(`${baseUrl}${API.plan.statusChanges}${id}`, newPayload);
};
// export const getFilterUser = async (payload) => {
//   return await axios.post(`${baseUrl}${API.user.getFilterUser}`,payload);
// };
// subscriber management
export const addSubscriber = async payload => {
  let newPayload = {
    ...payload,
    ...logPayload,
    ...idsForGet(),
    isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
  };
  return await axios.post(`${baseUrl}${API.subscriberManagement.addSubscriber}`, newPayload);
};

export const getAllSubscriber = async (id,allData) => {
  let Payload;
  if (userInfo().role === "isp admin" || userInfo().role === "admin") {
    Payload = {
      org_id: userInfo()._id
    };
  } else {
    Payload = {
      org_id: userInfo().org_id,
      isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
    };
  }
  return await axios.post(`${baseUrl}${API.subscriberManagement.getAllSubscriber}`, {...Payload,allData});
};

export const getSubscriberById = async id => {
  return await axios.get(`${baseUrl}${API.subscriberManagement.getSubscriberById}${id}`);
};

export const deleteSubscriber = async id => {
  let newPayload = { ...logPayload };
  return await axios.post(`${baseUrl}${API.subscriberManagement.deleteSubscriber}${id}`, newPayload);
};

export const updateSubscriber = async (id, payload) => {
  let newPayload = { ...payload, ...logPayload };
  return await axios.put(`${baseUrl}${API.subscriberManagement.updateSubscriber}${id}`, newPayload);
};

export const addInvoiceData = async payload => {
  return await axios.post(`${baseUrl}${API.invoice.addInvoices}`, { ...payload, ...idsForGet() });
};

export const getInvoiceDataById = async payload => {
  // return await axios.post(`${baseUrl}${API.invoice.getInvoiceById}`, payload);
  return await axios.post(`${baseUrl}${API.invoice.getInvoiceById}`, { ...idsForGet() });
};

export const addRole = async payload => {
  return await axios.post(`${baseUrl}${API.role.addRole}`, payload);
};

export const getAllRole = async () => {
  return await axios.post(`${baseUrl}${API.role.getAllRole}${idsForGet().org_id}`);
};

export const updatePermission = async (payload, id) => {
  return await axios.put(`${baseUrl}${API.role.updatePermission}${id}`, payload);
};
export const deleteRole = async id => {
  return await axios.delete(`${baseUrl}${API.role.deleteRole}${id}`);
};
export const getRoleDatabyId = async id => {
  return await axios.get(`${baseUrl}${API.role.getRoleDatabyId}${id}`);
};

export const getPdfInvoiceId = async id => {
  return await axios.get(`${baseUrl}${API.invoice.getInvoicePdfById}${id}`);
};

export const addReceipts = async payload => {
  return await axios.post(`${baseUrl}${API.reciept.addReceiptData}`, payload);
};

export const getAllReceiptData = async () => {
  return await axios.get(`${baseUrl}${API.reciept.getAllDataReceipt}`);
};

export const getReceiptDataById = async id => {
  return await axios.get(`${baseUrl}${API.reciept.getReceiptById}${id}`);
};

// Auth

export const sendWhatsappWithLink = async payload => {
  return await axios.post(`${baseUrl}${API.auth.sendWhatsappWithLink}`, payload);
};

export const loginAuth = async payload => {
  return await axios.post(`${baseUrl}${API.auth.login}`, payload);
};
export const forgetPasswordEmailSend = async data => {
  return await axios.post(`${baseUrl}${API.auth.forgotPassword}`, data);
};

export const changePassword = async (id, body) => {
  return await axios.post(`${baseUrl}${API.auth.changePassword}${id}`, body);
};
export const checkResetLink = async id => {
  return await axios.get(`${baseUrl}${API.auth.checkResetLink}${id}`);
};

// Auth end

export const getLeadsData = async () => {
  return await axios.get(`${baseUrl}${API.leads.getLeads}`);
};

export const getAllActivelogs = async () => {
  return await axios.post(`${baseUrl}${API.logs.getLogs}`, idsForGet());
};

export const getIpUserLog = async () => {
  return await axios.get(`${baseUrl}${API.logs.getIpUserLog}${idsForGet().org_id}`);
};
export const getPermissionByRole = async payload => {
  return await axios.post(`${baseUrl}${API.role.getPermissionByRole}`, payload);
};

export const dashboaredReportData = async id => {
  return await axios.post(`${baseUrl}${API.dashboard.dashboardReport}`, idsForGet());
};

export const adminDashboardReport = async () => {
  return await axios.get(`${baseUrl}${API.dashboard.adminReport}`);
};

export const getleadsPerIspForAdmin = async () => {
  return await axios.get(`${baseUrl}${API.dashboard.admingetLeadsPerIsp}`);
};

export const admindashboaredActiveUser = async id => {
  return await axios.get(`${baseUrl}${API.dashboard.admindashboardActive}`);
};

export const adminlastMonthRevenueData = async id => {
  return await axios.get(`${baseUrl}${API.dashboard.adminDashboardLastMonthRevenue}`);
};

export const admintoTalSubcriberData = async id => {
  return await axios.get(`${baseUrl}${API.dashboard.adminTotalSubscriber}`);
};

export const admintotalRevenueData = async payload => {
  return await axios.post(`${baseUrl}${API.dashboard.adminTotalRevenue}`, payload);
};

export const adminTotalPaymentData = async payload => {
  return await axios.post(`${baseUrl}${API.dashboard.adminTotalPayment}`, payload);
};

export const adminTotalPaidPerMont = async payload => {
  return await axios.post(`${baseUrl}${API.dashboard.adminPaidInvoicePerMonth}`, payload);
};

export const dashboaredActiveUser = async id => {
  return await axios.post(`${baseUrl}${API.dashboard.dashBoardTotalActiveUser}`, idsForGet());
};

export const lastMonthRevenueData = async id => {
  return await axios.post(`${baseUrl}${API.dashboard.lastMonthRevenue}`, idsForGet());
};

export const toTalSubcriberData = async id => {
  return await axios.post(`${baseUrl}${API.dashboard.totalSubcriber}`, idsForGet());
};

export const totalRevenueData = async payload => {
  return await axios.post(`${baseUrl}${API.dashboard.totalRevenue}`, { ...payload, ...idsForGet() });
};

export const convertLeadsData = async (id, payload) => {
  //activity log added
  return await axios.post(`${baseUrl}${API.leads.convertLeads}${id}`, { ...payload, ...idsForGet() });
};

export const getallTransactionData = async () => {
  return await axios.post(`${baseUrl}${API.payment.getpaymentTransaction}`, idsForGet());
};

export const uploadDocument = async file => {
  return await axios.post(`${baseUrl}${API.fileUpload}`, file);
};

export const updateLeadStatusData = async (id, payload) => {
  return await axios.put(`${baseUrl}${API.leads.updateLeadsStatus}${id}`, payload);
};

export const updateEngagement = async (id, payload) => {
  return await axios.put(`${baseUrl}${API.leads.updateEngageActivity}${id}`, payload);
};

export const getAdmin = async id => {
  return await axios.get(`${baseUrl}${API.getAdmin}${id}`);
};
export const updateAdmin = async (id, payload) => {
  return await axios.put(`${baseUrl}${API.updateAdmin}${id}`, payload);
};
export const emailSendPdf = async payload => {
  return await axios.post(`${baseUrl}${API.invoice.sendEmailInvoicePdf}`, payload);
};
export const addInvoiceSeq = async payload => {
  return await axios.post(`${baseUrl}${API.invoiceSeq.add}`, { ...payload, ...idsForGet() });
};
export const getInvoiceSeq = async () => {
  return await axios.post(`${baseUrl}${API.invoiceSeq.getSeq}`, idsForGet());
};
export const nextSeq = async payload => {
  return await axios.post(`${baseUrl}${API.invoiceSeq.nextSeq}`, { ...payload, ...idsForGet() });
};

export const disableAllSeq = async payload => {
  return await axios.post(`${baseUrl}${API.invoiceSeq.disableAllSeq}`, { ...payload, ...idsForGet() });
};

export const invoiceFilter = async payload => {
  return await axios.post(`${baseUrl}${API.invoice.filterData}`, { ...payload, ...idsForGet() });
};

export const addNotesActiveLeads = async payload => {
  return await axios.post(`${baseUrl}${API.leads.addNotes}`, payload);
};

export const AddCallsActiveLeads = async payload => {
  return await axios.post(`${baseUrl}${API.leads.addCalls}`, payload);
};

export const AddReminderActiveLeads = async payload => {
  return await axios.post(`${baseUrl}${API.leads.addReminder}`, payload);
};

export const addLeadsConfigurationData = async payload => {
  return await axios.post(`${baseUrl}${API.leadsConfiguration.addLeadsConfiguration}`, {
    ...payload,
    org_id: idsForGet().org_id,
    isp_id: idsForGet().isp_id
  });
};

export const getLeadsConfiguration = async () => {
  return await axios.post(`${baseUrl}${API.leadsConfiguration.getLeadConfigurationData}`, idsForGet());
};

export const leadConfigurationDelete = async (id, payload) => {
  return await axios.post(`${baseUrl}${API.leadsConfiguration.deleteleadsConfiguration}${id}`, payload);
};

export const getAllLeadsData = async payload => {
  return await axios.post(`${baseUrl}${API.leads.getAllLeads}`, payload);
};

export const getLeadsByIdData = async payload => {
  return await axios.post(`${baseUrl}${API.leads.getLeadgetById}`, payload);
};

export const getInventoryAndService = async payload => {
  return await axios.post(`${baseUrl}${API.leads.getFindProposal}`, payload);
};

export const updateLeadsData = async payload => {
  return await axios.post(`${baseUrl}${API.leads.addAndUpdateLeads}`, { ...payload, ...idsForGet() });
};

export const convertstoPaid = async (id, body) => {
  return await axios.post(`${baseUrl}${API.invoice.convertstoPaid}${id}`, { ...body, ...idsForGet() });
};
export const convertToCredit = async id => {
  return await axios.post(`${baseUrl}${API.invoice.convertToCredit}${id}`, { ...idsForGet() });
};
export const addAndUpdateSetting = async payload => {
  return await axios.post(`${baseUrl}${API.setting.addAndUpdateSetting}`, { ...payload, org_id: userInfo()._id });
};

export const addAndUpdateSetting2 = async payload => {
  return await axios.post(`${baseUrl}${API.setting.addAndUpdateSetting}`, { ...payload });
};
export const getLogoSetting = async () => {
  return await axios.get(
    `${baseUrl}${API.setting.getSetting}${
      userInfo().role === "isp admin" || userInfo().role === "super admin" ? userInfo()._id : userInfo().org_id
    }`
  );
};

export const leadAssessmentByAdmin = async payload => {
  return await axios.post(`${baseUrl}${API.leads.leadAssessment}`, { ...payload, ...idsForGet() });
};

export const getleadAssessmentData = async () => {
  return await axios.post(`${baseUrl}${API.leads.getLeadAssessment}`, idsForGet());
};

export const getAllAssigned = async () => {
  return await axios.post(`${baseUrl}${API.leads.userListOfAssigned}`, idsForGet());
};
export const addAssignUser = async payload => {
  return await axios.post(`${baseUrl}${API.leads.updatAssignedUser}`, payload);
};
export const emailAndNumberCheck = async payload => {
  return await axios.post(`${baseUrl}${API.leads.phoneNumberAndEmailCheck}`, payload);
};
export const leadsDeleteById = async (id, payload) => {
  return await axios.post(`${baseUrl}${API.leads.deleteLeadsById}${id}`, payload);
};

// help desk start

export const getAllTickets = async payload => {
  return await axios.post(`${baseUrl}${API.helpDesk.getTickets}`, { ...payload, ...idsForGet() });
};

export const sendMail = async payload => {
  return await axios.post(`${baseUrl}${API.helpDesk.sendMail}`, payload);
};

export const createTicket = async payload => {
  return await axios.post(`${baseUrl}${API.helpDesk.raiseTicket}`, { ...payload, ...idsForGet() });
};

export const getTicketDataSubscriberId = async id => {
  return await axios.get(`${baseUrl}${API.helpDesk.getTicketSubcriberId}${id}`);
};
export const updateTicket = async payload => {
  return await axios.put(`${baseUrl}${API.helpDesk.updateTicket}`, payload);
};

export const getTicketDataById = async id => {
  return await axios.get(`${baseUrl}${API.helpDesk.getTicketData}${id}`);
};

export const changeMethod = async payload => {
  return await axios.post(`${baseUrl}${API.helpDesk.changeMethod}`, { ...payload, ...idsForGet() });
};

export const getCurrentMethod = async () => {
  return await axios.post(`${baseUrl}${API.helpDesk.getMethod}`, idsForGet());
};

export const getAllHelpDeskConfigurationData = async () => {
  return await axios.post(`${baseUrl}${API.helpDesk.getHelpDeskConfiguration}`, idsForGet());
};
export const addUpdateHelpDeskConfigurationItem = async payload => {
  return await axios.post(`${baseUrl}${API.helpDesk.addUpdateHelpDeskConfiguration}`, {
    ...payload,
    org_id: idsForGet().org_id,
    isp_id: idsForGet().isp_id
  });
};
export const deleteHelpDeskConfigurationItem = async (id, payload) => {
  return await axios.post(`${baseUrl}${API.helpDesk.deleteHelpDeskConfiguration}${id}`, payload);
};

// help desk end

export const phonePePayment = async payload => {
  return await axios.post(`${baseUrl}${API.payment.phonePe}`, { ...payload, ...idsForGet() });
};

export const paymentInfoByInvoiceId = async id => {
  return await axios.get(`${baseUrl}${API.payment.paymentInfoByInvoiceId}${id}`);
};
export const getDashboardCardPosition = async id => {
  return await axios.get(`${baseUrl}${API.dashboard.getCordinates}${id}`);
};

export const addUpdateDashboardCardPosition = async payload => {
  return await axios.post(`${baseUrl}${API.dashboard.updateCordinates}`, payload);
};

//proposal invoice

export const getAllPropsal = async Payload => {
  return await axios.post(`${baseUrl}${API.proposal.getAllPropsal}`, { ...idsForGet() });
};
export const findPropsalData = async id => {
  return await axios.get(`${baseUrl}${API.proposal.findPropsal}`);
};
export const addPropsal = async payload => {
  return await axios.post(`${baseUrl}${API.proposal.addPropsal}`, { ...payload, ...idsForGet() });
};
export const convertStatusPropsal = async payload => {
  return await axios.post(`${baseUrl}${API.proposal.convertStatus}`, payload);
};
export const addBccemail = async payload => {
  return await axios.post(`${baseUrl}${API.bccEmail.addBcc}`, { ...payload, ...idsForGet() });
};
export const getBccEmail = async () => {
  return await axios.get(`${baseUrl}${API.bccEmail.getBcc}${idsForGet().org_id}`);
};
export const deleteBccEmail = async id => {
  return await axios.delete(`${baseUrl}${API.bccEmail.deleteBcc}${id}`);
};
export const emialSendLInk = async payload => {
  return await axios.post(`${baseUrl}${API.leads.sendEmailLink}`, payload);
};
export const hsnAndSacAdd = async payload => {
  return await axios.post(`${baseUrl}${API.hsnAndSac.addHsnAndSac}`, { ...payload, ...idsForGet() });
};
export const getHsnandSacCode = async () => {
  return await axios.post(`${baseUrl}${API.hsnAndSac.getHsnAndSac}`, idsForGet());
};
export const hsnAndSacDelete = async id => {
  return await axios.delete(`${baseUrl}${API.hsnAndSac.deletehsnSac}${id}`);
};
export const getUserReport = async payload => {
  return await axios.post(`${baseUrl}${API.reports.usergetReport}`, payload);
};
export const getRoleUserData = async payload => {
  return await axios.post(`${baseUrl}${API.reports.getUserRoledata}`, { ...payload, ...idsForGet() });
};
export const generateReportSubscriber = async payload => {
  return await axios.post(`${baseUrl}${API.reports.getSubscriberReport}`, payload);
};
export const generateInvoiceReport = async payload => {
  return await axios.post(`${baseUrl}${API.reports.getInvoiceReport}`, payload);
};
export const addBandWidths = async payload => {
  return await axios.post(`${baseUrl}${API.bandwidthAPi.AddBandwidth}`, payload);
};
export const getAllBandWidthData = async () => {
  return await axios.get(`${baseUrl}${API.bandwidthAPi.getAllBandWidth}${idsForGet().org_id}`);
};
export const deleteBandWidth = async payload => {
  return await axios.post(`${baseUrl}${API.bandwidthAPi.bandwidthDelete}`, payload);
};
export const getByIdBandwidth = async id => {
  return await axios.get(`${baseUrl}${API.bandwidthAPi.getBandWidthById}${id}`);
};
export const generateHelpDeskReport = async payload => {
  return await axios.post(`${baseUrl}${API.reports.gethelpdeskReport}`, payload);
};
export const generateLeadsReport = async payload => {
  return await axios.post(`${baseUrl}${API.reports.getleadsReport}`, payload);
};
export const addIssueType = async payload => {
  return await axios.post(`${baseUrl}${API.helpDesk.issueTypeAdd}`, { ...payload, ...idsForGet() });
};
export const getAllIssueType = async () => {
  return await axios.get(`${baseUrl}${API.helpDesk.getIssueType}`);
};
export const getIssueTypeByCreatorId = async () => {
  return await axios.post(`${baseUrl}${API.helpDesk.getIssueTypeByid}`, idsForGet());
};
export const DeleteDataIssueType = async payload => {
  return await axios.post(`${baseUrl}${API.helpDesk.deleteIssueTYpe}`, payload);
};

//franchisee
export const franchiseeConfigurationAdd = async payload => {
  return await axios.post(`${baseUrl}${API.franchisee.addFranchiseeConfiguration}`, payload);
};
export const getAllDataByOrg = async id => {
  return await axios.get(`${baseUrl}${API.franchisee.getAllFranchiseeById}${id}`);
};
export const getfranchiseebyId = async id => {
  return await axios.get(`${baseUrl}${API.franchisee.getbyId}${id}`);
};

export const deleteFranchiseeById = async payload => {
  return await axios.post(`${baseUrl}${API.franchisee.deleteFranchiseeById}`, payload);
};

export const addOrSubBalance = async payload => {
  return await axios.post(`${baseUrl}${API.franchisee.addOrSubBalance}`, payload);
};

export const PayAndRenew = async payload => {
  return await axios.post(`${baseUrl}${API.subscriberManagement.payandrenew}`, payload);
};
export const ToggleBlock = async payload => {
  return await axios.patch(`${baseUrl}${API.subscriberManagement.toggleblock}`, payload);
};

export const franchiseeStatement = async id => {
  return await axios.get(`${baseUrl}${API.franchisee.franchiseestatement}${id}`);
};

export const planHistorySubscriberId = async id => {
  return await axios.get(`${baseUrl}${API.subscriberManagement.planHistory}${id}`);
};

export const getEventLogsById = async id => {
  return await axios.get(`${baseUrl}${API.logs.eventLogs}${id}`);
};
export const getPaymentLogById = async id => {
  return await axios.get(`${baseUrl}${API.logs.paymentLog}${id}`);
};

export const addInventoryCategory = async payload => {
  return await axios.post(`${baseUrl}${API.inventory.addCategoryOfInventory}`, { ...payload, ...idsForGet() });
};
export const addCategoryCode = async payload => {
  return await axios.post(`${baseUrl}${API.inventory.addCategoryCode}`, { ...payload, ...idsForGet() });
};

export const getlistCategoryCode = async () => {
  return await axios.get(`${baseUrl}${API.inventory.getlistCategoryCode}${idsForGet().org_id}`);
};
export const getListOfInventoryCategory = async id => {
  return await axios.get(`${baseUrl}${API.inventory.getCategoryListOfInventory}${id}`);
};

export const deleteCategoryOfInventory = async id => {
  return await axios.delete(`${baseUrl}${API.inventory.deleteCategory}${id}`);
};

export const addItemsOfCategoryInventory = async payload => {
  return await axios.post(`${baseUrl}${API.inventory.addItemsOfCategory}`, payload);
};

export const getListofInventory = async id => {
  return await axios.get(`${baseUrl}${API.inventory.getItemsofInventory}${id}`);
};

export const deleteOfInventoryItem = async id => {
  return await axios.delete(`${baseUrl}${API.inventory.deleteItemOfInventory}${id}`);
};

export const getDataParticularCategory = async id => {
  return await axios.get(`${baseUrl}${API.inventory.getParticularCategory}${id}`);
};

export const bulkInsertCategory = async payload => {
  return await axios.post(`${baseUrl}${API.inventory.bulkImportCategory}`, payload);
};

export const getInventoryById = async(id)=>{
  return await axios.get(`${baseUrl}${API.inventory.getInventoryById}${id}`);
}

export const addAreaOfCollection = async payload => {
  return await axios.post(`${baseUrl}${API.collection.addArea}`, payload);
};

export const getDefineAreaofCollection = async () => {
  return await axios.post(`${baseUrl}${API.collection.getDefineArea}`, idsForGet());
};
export const updateDefineAreaOfCollection = async payload => {
  return await axios.put(`${baseUrl}${API.collection.updateDefineArea}`, payload);
};

export const deleteDefineArea = async payload => {
  return await axios.post(`${baseUrl}${API.collection.deleteDefineArea}`, payload);
};

export const getCollectionDetailsId = async id => {
  return await axios.get(`${baseUrl}${API.collection.getDetailsCollectionById}${id}`);
};

export const getBuildingInfo = async payload => {
  return await axios.post(`${baseUrl}${API.collection.getInfoOfBuilding}`, payload);
};
export const getallCollectionInfoArea = async payload => {
  return await axios.post(`${baseUrl}${API.collection.getallCollectionInfoArea}`, idsForGet());
};
export const changeCollectionStatus = async payload => {
  return await axios.post(`${baseUrl}${API.collection.changeCollectionStatus}`, payload);
};
export const getallApprovalCollectionInfo = async payload => {
  return await axios.post(`${baseUrl}${API.collection.getallApprovalCollectionInfo}`, idsForGet());
};

export const addMappingAdmin = async payload => {
  return await axios.patch(`${baseUrl}${API.collection.addUserMapping}`, payload);
};

export const AddInventorySubscriber = async payload => {
  return await axios.post(`${baseUrl}${API.subscriberManagement.addInventory}`, payload);
};

export const getSubscriberInventory = async id => {
  return await axios.get(`${baseUrl}${API.subscriberManagement.getInventoryOfSubscriber}${id}`);
};

export const getDataLeadOfInvrntory = async id => {
  return await axios.get(`${baseUrl}${API.leads.getInventoryOfLeads}${id}`);
};

export const getAllServices = async () => {
  let payload = { ...idsForGet() };
  return await axios.post(`${baseUrl}${API.serviceManagement.getServiceList}`, payload);
};

export const deleteServiceById = async id => {
  return await axios.post(`${baseUrl}${API.serviceManagement.deleteService}${id}`);
};

export const addServiceData = async payload => {
  let data = { ...payload, ...idsForGet() };
  return await axios.post(`${baseUrl}${API.serviceManagement.addService}`, data);
};

export const getProposalbyUserId = async user_id => {
  return await axios.get(`${baseUrl}${API.proposal.getProposalbyUserId}${user_id}`);
};

export const assignServicesData = async payload => {
  return await axios.post(`${baseUrl}${API.serviceManagement.assignServices}`, payload);
};

export const getServiceDataById = async id => {
  return await axios.get(`${baseUrl}${API.serviceManagement.getServiceAssignById}${id}`);
};

export const createNewTemplate = async payload => {
  return await axios.post(`${baseUrl}${API.pdfTemplate.createTemplate}`, { ...payload, ...idsForGet() });
};

export const getTemplateData = async () => {
  return await axios.post(`${baseUrl}${API.pdfTemplate.getTemplates}`, idsForGet());
};

export const deleteTemplateById = async id => {
  return await axios.delete(`${baseUrl}${API.pdfTemplate.deleteTemplate}${id}`);
};

export const templateToggleOnOff = async id => {
  return await axios.patch(`${baseUrl}${API.pdfTemplate.templateToggel}${id}`);
};

export const updateTemplateData = async payload => {
  return await axios.put(`${baseUrl}${API.pdfTemplate.updateTemplate}`, { ...payload, ...idsForGet() });
};

export const deleteCategoryCodeById = async id => {
  return await axios.delete(`${baseUrl}${API.inventory.deleteCategoryCode}${id}`);
};

export const updateStatusSubscriber = async id => {
  return await axios.post(`${baseUrl}${API.subscriberManagement.updateStatus}${id}`);
};

export const getInvoiceDataBYId = async id => {
  return await axios.get(`${baseUrl}${API.invoice.getInvoiceDataById}${id}`);
};

export const updateInvoiceById = async (id, payload) => {
  return await axios.put(`${baseUrl}${API.invoice.updateInvoiceById}${id}`, payload);
};

export const createIsp = async payload => {
  return await axios.post(`${baseUrl}${API.isp.addIsp}`, payload);
};

export const getAllIsp = async body => {
  return await axios.post(`${baseUrl}${API.isp.getAllIsp}`, body);
};

export const updateIspById = async (id, data) => {
  return await axios.put(`${baseUrl}${API.isp.upDateIspById}${id}`, data);
};

export const deleteIspById = async id => {
  return await axios.delete(`${baseUrl}${API.isp.deleteIspById}${id}`);
};
export const getAdminbyId = async id => {
  return await axios.get(`${baseUrl}${API.isp.getAdminbyId}${id}`);
};
export const createJwtToken = async body => {
  return await axios.post(`${baseUrl}${API.auth.jwtToken}`, body);
};

export const getAdminById = async () => {
  return await axios.get(`${baseUrl}${API.pgfLogo.adminById}${idsForGet().org_id}`);
};

export const addAndUpdateBng = async(payload)=>{
  return await axios.post(`${baseUrl}${API.bng.addAndUpdateBng}`,{...payload,...idsForGet()});
}

export const getBngData = async()=>{
  return await axios.get(`${baseUrl}${API.bng.getBngData}${idsForGet().org_id}`);
}

export const bngAddAndUpdate = async(payload)=>{
  return await axios.post(`${baseUrl}${API.bng.BngAddAndUpdate}`,payload);
}

export const getAllBngData = async()=>{
  return await axios.get(`${baseUrl}${API.bng.getAllBngData}`);
}

export const deleteBngData = async(id)=>{
  return await axios.delete(`${baseUrl}${API.bng.deleteBng}${id}`); 
}


export const getAllSubscriberOther = async id => {
  let Payload;
  if (userInfo().role === "isp admin" || userInfo().role === "admin") {
    Payload = {
      org_id: userInfo()._id
    };
  } else {
    Payload = {
      org_id: userInfo().org_id,
      isp_id: userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id
    };
  }
  return await axios.post(`${baseUrl}${API.subscriberManagement.getAllSubscriberOther}`, Payload);
};

export const bulkInsertSubscribers = async payload => {
  return await axios.post(`${baseUrl}${API.subscriberManagement.bulkInsertSubscribers}`, payload);
}

export  const partial_paymentsFuncation  = async ( payload) => {
  return await axios.post(`${baseUrl}${API.invoice.partial_payments}`, payload);
}





























