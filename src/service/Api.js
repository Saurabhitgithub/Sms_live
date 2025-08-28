import { AddBandwidth } from "../pages/Bandwidth/AddBandwidth";
export let baseUrl = "https://cdc-main-2b2871fc4c13.herokuapp.com";
// export const baseUrl = "http://localhost:4002";

export const API = {
  plan: {
    addPlan: "/plan/addPlan",
    deletePlan: "/plan/deletePlansById/",
    getPlanByCreator: "/plan/getPlanByCreator/",
    getPlanById: "/plan/getPlanById/",
    bulkInsertPlan: "/plan/bulkInsertPlan",
    statusChanges: "/plan/updatePlanStatus/"
  },

  user: {
    addUser: "/ispMember/addMember",
    getAllUser: "/ispMember/getAllIspMember",
    getAllUserbyIspId: "/ispMember/getIspMemberListByIsp/",
    getUserById: "/ispMember/getMemberById/",
    deleteUser: "/ispMember/deleteIspMember/",
    updateUser: "/ispMember/updateMember/",
    updateMemberStatus: "/ispMember/updateMemberStatus/",
    profileUpdate: "/ispMember/profileUpdate/"
  },

  subscriberManagement: {
    addSubscriber: "/subscriber/addSubscriber",
    getAllSubscriber: "/subscriber/subscriberListByCreator/",
    getSubscriberById: "/subscriber/getSubscriber/",
    updateSubscriber: "/subscriber/updateSubscriber/",
    deleteSubscriber: "/subscriber/deleteSubscriber/",
    updateStatus: "/subscriber/updateStatus/",
    payandrenew: "/subscriber/renewPlan",
    toggleblock: "/subscriber/toggleBlock",
    planHistory: "/subscriber/planHistory/",
    addInventory: "/inventory/assignInvantory",
    getInventoryOfSubscriber: "/inventory/getInvantoryHistoryListbysubscriberId/",
    getAllSubscriberOther: "/subscriber/getSubscriberListByCreatorInventory",
    bulkInsertSubscribers: "/subscriber/bulkInsertSubscribers",
  },
  invoice: {
    addInvoices: "/invoice/addInvoice",
    getInvoiceById: "/invoice/getInvoiceByCreator",
    viewDetailInvoice: "/invoice/getInvoiceById/id",
    getInvoicePdfById: "/invoice/getInvoiceById/",
    sendEmailInvoicePdf: "/invoice/sendPdfbyEmail",
    filterData: "/invoice/invoiceFilter",
    convertstoPaid: "/invoice/convertstoPaid/",
    getInvoiceDataById: "/invoice/getPerfomaInvoiceById/",
    updateInvoiceById: "/invoice/editInvoice/",
    convertToCredit: "/invoice/convertToCredit/",
    partial_payments: "/invoice/partial_payments/"

  },
  reciept: {
    addReceiptData: "/receipt/addReceipt",
    getAllDataReceipt: "/receipt/getAllReceipts",
    getReceiptById: "/receipt/getReceiptById/"
  },
  role: {
    addRole: "/role/superAdmin/addRole",
    getAllRole: "/role/superAdmin/getAllRoleData/",
    updatePermission: "/role/superAdmin/updateRolePermissionById/",
    getPermissionByRole: "/role/superAdmin/getPermissionByRole",
    deleteRole: "/role/deleteRole/",
    getRoleDatabyId: "/role/getRoleDatabyId/"
  },
  auth: {
    login: "/auth/login",
    forgotPassword: "/auth/forgetPassword",
    changePassword: "/auth/changePassword/",
    checkResetLink: "/auth/checkResetLink/",
    jwtToken: "/auth/generateJWT",
    sendWhatsappWithLink: "/auth/sendWhatsappWithLink"
  },
  leads: {
    getLeads: "/lead/getLeads",
    convertLeads: "/lead/convertLead/",
    updateLeadsStatus: "/lead/updateLeadStatus/",
    updateEngageActivity: "/lead/updateEngagementLevel/",
    addNotes: "/lead/addNote",
    addCalls: "/lead/addCall",
    addReminder: "/lead/addReminder",
    getAllLeads: "/lead/getLeadLeast",
    getLeadgetById: "/lead/getLeadById",
    getFindProposal: "/propsalInvoice/findPropsal",
    addAndUpdateLeads: "/lead/addAndUpdate",
    leadAssessment: "/arrangement/AddAndUpdateArrangement",
    getLeadAssessment: "/arrangement/getArrangementOfLead",
    userListOfAssigned: "/leadConfiguration/userListByRoleandStatus",
    updatAssignedUser: "/lead/changeAssignedTo",
    phoneNumberAndEmailCheck: "/lead/CheckEmailAndPhone",
    deleteLeadsById: "/lead/deleteLeadById/",
    sendEmailLink: "/lead/SendPaymentLink",
    getInventoryOfLeads: "/inventory/getInvantoryHistoryListbyLeadId/"
  },
  leadsConfiguration: {
    addLeadsConfiguration: "/leadConfiguration/AddAndUpdateConfiguration",
    getLeadConfigurationData: "/leadConfiguration/getConfiguration",
    deleteleadsConfiguration: "/leadConfiguration/deleteConfiguration/"
  },
  logs: {
    getLogs: "/log/getEventLogsByOrgOrIsp",
    eventLogs: "/log/getEventLogsByTargetId/",
    paymentLog: "/payment/paymentLogbySubcriberId/",
    getIpUserLog: "/subscriber/getIpUserLog/"
  },
  dashboard: {
    dashboardReport: "/dashboard/report/",
    dashBoardTotalActiveUser: "/dashboard/isp_user/",
    lastMonthRevenue: "/dashboard/last_month_revenue/",
    totalSubcriber: "/dashboard/total_subscriber/",
    totalRevenue: "/dashboard/total_revenue",
    getCordinates: "/dashboardSetting/getCoordinatesSchema/",
    updateCordinates: "/dashboardSetting/addCoordinatesSchema",
    adminReport: "/dashboard/admin_report",
    admindashboardActive: "/dashboard/admin_isp_user",
    adminDashboardLastMonthRevenue: "/dashboard/admin_last_month_revenue",
    adminTotalSubscriber: "/dashboard/admin_total_subscriber",
    adminTotalRevenue: "/dashboard/admin_total_revenue",
    adminTotalPayment: "/dashboard/getMonthlySuccessfulPayments",
    adminPaidInvoicePerMonth: "/dashboard/totalPaidInvoicesPerMonth",
    admingetLeadsPerIsp: "/dashboard/getLeadsCountPerOrg"
  },

  fileUpload: "/upload/uploadDocuments",
  getAdmin: "/admin/getAdminbyId/",
  updateAdmin: "/admin/updateAdmin/",
  invoiceSeq: {
    add: "/invoiceSeq/addInvoiceSeq",
    getSeq: "/invoiceSeq/getEnableSeq",
    nextSeq: "/invoiceSeq/nextSeq",
    disableAllSeq: "/invoiceSeq/disableAllSeq"
  },
  helpDesk: {
    addUpdateHelpDeskConfiguration: "/helpDeskConfiguration/AddAndUpdateConfiguration",
    getHelpDeskConfiguration: "/helpDeskConfiguration/getConfiguration",
    deleteHelpDeskConfiguration: "/helpDeskConfiguration/deleteConfiguration/",
    changeMethod: "/arrangement/AddAndUpdateArrangement",
    getMethod: "/arrangement/getArrangementOfHelpDesk",
    getTickets: "/helpDesk/getTickets",
    raiseTicket: "/helpDesk/raiseTicket",
    updateTicket: "/helpDesk/updateTicket",
    sendMail: "/helpDesk/sendMail",
    getTicketData: "/helpDesk/getTicketById/",
    issueTypeAdd: "/helpDeskConfiguration/addIssueType",
    getIssueType: "/helpDeskConfiguration/getIssueTypes",
    getIssueTypeByid: "/helpDeskConfiguration/getIssueTypesByIsp/",
    deleteIssueTYpe: "/helpDeskConfiguration/deleteIssueType",
    getTicketSubcriberId: "/helpDesk/getTicketBySubscriberId/"
  },
  setting: {
    addAndUpdateSetting: "/dashboardSetting/addAndUpdateSetting",
    getSetting: "/dashboardSetting/getSetting/"
  },
  payment: {
    phonePe: "/payment/phonepe_payment",
    getpaymentTransaction: "/payment/getallpayment",
    paymentInfoByInvoiceId: "/payment/paymentInfoByInvoiceId/"
  },
  proposal: {
    addPropsal: "/propsalInvoice/addPropsalInvoice",
    getAllPropsal: "/propsalInvoice/getAllProposalInvoices",
    convertStatus: "/propsalInvoice/convertStatus",
    findPropsal: "/propsalInvoice/findPropsal",
    getProposalbyUserId: "/propsalInvoice/getProposalbyUserId/"
  },
  bccEmail: {
    addBcc: "/dashboardSetting/addBcc",
    getBcc: "/dashboardSetting/getBccEmailsByOrg/",
    deleteBcc: "/dashboardSetting/deleteBccEmails/"
  },
  hsnAndSac: {
    addHsnAndSac: "/dashboardSetting/addHsnSac",
    getHsnAndSac: "/dashboardSetting/getHsnSacList",
    deletehsnSac: "/dashboardSetting/deleteHsnSac/"
  },
  reports: {
    usergetReport: "/report/userManagementReport",
    getUserRoledata: "/ispMember/getUserByRole",
    getSubscriberReport: "/report/subscriberManagementReport",
    getInvoiceReport: "/report/invoiceManagementReport",
    gethelpdeskReport: "/report/helpDeskManagementReport",
    getleadsReport: "/report/leadManagementReport"
  },
  bandwidthAPi: {
    AddBandwidth: "/bandwidth/addAndUpdate",
    getAllBandWidth: "/bandwidth/getListByCreator/",
    bandwidthDelete: "/bandwidth/delete",
    getBandWidthById: "/bandwidth/getById/"
  },
  franchisee: {
    addFranchiseeConfiguration: "/franchisee/addAndUpdate",
    getAllFranchiseeById: "/franchisee/getListByOrganization/",
    getbyId: "/franchisee/getDetailsById/",
    deleteFranchiseeById: "/franchisee/deleteFranchiseeById",
    addOrSubBalance: "/franchisee/addOrSubBalance",
    franchiseestatement: "/franchisee/getStatementListByOrg/"
  },
  inventory: {
    addCategoryOfInventory: "/inventory/addAndUpdateInvantoryCategory",
    getCategoryListOfInventory: "/inventory/getlistCategory/",
    deleteCategory: "/inventory/deleteInvantoryCategory/",
    addItemsOfCategory: "/inventory/addandUpdateInvantory",
    getItemsofInventory: "/inventory/getlistInvantorybyCategory/",
    deleteItemOfInventory: "/inventory/deleteInvantoryItem/",
    getParticularCategory: "/inventory/getCategorybyid/",
    bulkImportCategory: "/inventory/bulkImportInvantoryCategory",
    addCategoryCode: "/inventory/addCategoryCode",
    getlistCategoryCode: "/inventory/getlistCategoryCode/",
    deleteCategoryCode: "/inventory/deleteCategoryCode/",
    getInventoryById:"/inventory/getInvantoryItembyId/"
  },
  collection: {
    addArea: "/collectionArea/addEntity",
    getDefineArea: "/collectionArea/getListByCreator",
    updateDefineArea: "/collectionArea/updateEntity",
    deleteDefineArea: "/collectionArea/deleteEntity",
    getDetailsCollectionById: "/collectionArea/getDetails/",
    getInfoOfBuilding: "/collectionArea/getBuildingInfo",
    getallCollectionInfoArea: "/collectionArea/getallCollectionInfoArea",
    changeCollectionStatus: "/collectionArea/changeCollectionStatus",
    getallApprovalCollectionInfo: "/collectionArea/getallApprovalCollectionInfo",
    addUserMapping: "/collectionArea/assignUser"
  },
  serviceManagement: {
    getServiceList: "/service/serviceList",
    deleteService: "/service/deleteService/",
    addService: "/service/addService",
    assignServices: "/service/assignService",
    getServiceAssignById: "/service/getAssignedServices/"
  },
  pdfTemplate: {
    createTemplate: "/pdfTemplate/addTemplate",
    getTemplates: "/pdfTemplate/templateByOrgOrIsp",
    deleteTemplate: "/pdfTemplate/deleteTemplate/",
    templateToggel: "/pdfTemplate/toggleTemplate/",
    updateTemplate: "/pdfTemplate/updateTemplate"
  },
  isp: {
    addIsp: "/admin/addIspAdmin",
    getAllIsp: "/admin/getallispdata",
    upDateIspById: "/admin/updateAdmin/",
    deleteIspById: "/admin/deleteAdmin/",
    getAdminbyId: "/admin/getAdminbyId/"
  },
  pgfLogo: {
    adminById: "/admin/getAdminbyId/"
  },
  bng: {
    addAndUpdateBng: "/attributes/addAndUpdate",
    getBngData: "/attributes/getAttributes/",
    BngAddAndUpdate: "/attributes/addAndUpdate",
    getAllBngData: "/attributes/getAll",
    deleteBng: "/attributes/deleteBng/"
  }
};
