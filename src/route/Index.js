import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { ProductContextProvider } from "../pages/pre-built/products/ProductContext";
import { UserContextProvider } from "../pages/pre-built/user-manage/UserContext";
import { RedirectAs404 } from "../utils/Utils";

import Component from "../pages/components/Index";
import Accordian from "../pages/components/Accordions";
import Alerts from "../pages/components/Alerts";
import Avatar from "../pages/components/Avatar";
import Badges from "../pages/components/Badges";
import Breadcrumbs from "../pages/components/Breadcrumbs";
import ButtonGroup from "../pages/components/ButtonGroup";
import Buttons from "../pages/components/Buttons";
import Cards from "../pages/components/Cards";
import Carousel from "../pages/components/Carousel";
import Dropdowns from "../pages/components/Dropdowns";
import FormElements from "../pages/components/forms/FormElements";
import FormLayouts from "../pages/components/forms/FormLayouts";
import FormValidation from "../pages/components/forms/FormValidation";
import DataTablePage from "../pages/components/table/DataTable";
import Modals from "../pages/components/Modals";
import Pagination from "../pages/components/Pagination";
import Popovers from "../pages/components/Popovers";
import Progress from "../pages/components/Progress";
import Spinner from "../pages/components/Spinner";
import Tabs from "../pages/components/Tabs";
import Toast from "../pages/components/Toast";
import Tooltips from "../pages/components/Tooltips";
import Typography from "../pages/components/Typography";
import CheckboxRadio from "../pages/components/forms/CheckboxRadio";
import AdvancedControls from "../pages/components/forms/AdvancedControls";
import InputGroup from "../pages/components/forms/InputGroup";
import FormUpload from "../pages/components/forms/FormUpload";
import NumberSpinner from "../pages/components/forms/NumberSpinner";
import NouiSlider from "../pages/components/forms/nouislider";
import WizardForm from "../pages/components/forms/WizardForm";
import UtilBorder from "../pages/components/UtilBorder";
import UtilColors from "../pages/components/UtilColors";
import UtilDisplay from "../pages/components/UtilDisplay";
import UtilEmbeded from "../pages/components/UtilEmbeded";
import UtilFlex from "../pages/components/UtilFlex";
import UtilOthers from "../pages/components/UtilOthers";
import UtilSizing from "../pages/components/UtilSizing";
import UtilSpacing from "../pages/components/UtilSpacing";
import UtilText from "../pages/components/UtilText";

import Blank from "../pages/others/Blank";
import Faq from "../pages/others/Faq";
import Regularv1 from "../pages/others/Regular-1";
import Regularv2 from "../pages/others/Regular-2";
import Terms from "../pages/others/Terms";
import BasicTable from "../pages/components/table/BasicTable";
import SpecialTablePage from "../pages/components/table/SpecialTable";
import ChartPage from "../pages/components/charts/Charts";
import EmailTemplate from "../pages/components/email-template/Email";
import NioIconPage from "../pages/components/crafted-icons/NioIcon";
import SVGIconPage from "../pages/components/crafted-icons/SvgIcons";

import ProjectCardPage from "../pages/pre-built/projects/ProjectCard";
import ProjectListPage from "../pages/pre-built/projects/ProjectList";
import UserListRegularPage from "../pages/pre-built/user-manage/UserListRegular";
import UserContactCardPage from "../pages/pre-built/user-manage/UserContactCard";
import UserDetailsPage from "../pages/pre-built/user-manage/UserDetailsRegular";
import UserListCompact from "../pages/pre-built/user-manage/UserListCompact";
import UserProfileLayout from "../pages/pre-built/user-manage/UserProfileLayout";
import KycListRegular from "../pages/pre-built/kyc-list-regular/KycListRegular";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import TransListBasic from "../pages/pre-built/trans-list/TransListBasic";
import TransListCrypto from "../pages/pre-built/trans-list/TransListCrypto";
import ProductCard from "../pages/pre-built/products/ProductCard";
import ProductList from "../pages/pre-built/products/ProductList";
import ProductDetails from "../pages/pre-built/products/ProductDetails";
import InvoiceList from "../pages/pre-built/invoice/InvoiceList";
import InvoiceDetails from "../pages/pre-built/invoice/InvoiceDetails";
import PricingTable from "../pages/pre-built/pricing-table/PricingTable";
import GalleryPreview from "../pages/pre-built/gallery/GalleryCardPreview";
import ReactToastify from "../pages/components/misc/ReactToastify";

import AppMessages from "../pages/app/messages/Messages";
import Chat from "../pages/app/chat/ChatContainer";
import Calender from "../pages/app/calender/Calender";
import FileManager from "../pages/app/file-manager/FileManager";
import Inbox from "../pages/app/inbox/Inbox";
import Kanban from "../pages/app/kanban/Kanban";
import DateTimePicker from "../pages/components/forms/DateTimePicker";
import CardWidgets from "../pages/components/widgets/CardWidgets";
import ChartWidgets from "../pages/components/widgets/ChartWidgets";
import RatingWidgets from "../pages/components/widgets/RatingWidgets";
import SlickPage from "../pages/components/misc/Slick";
import SweetAlertPage from "../pages/components/misc/SweetAlert";
import BeautifulDnd from "../pages/components/misc/BeautifulDnd";
import DualListPage from "../pages/components/misc/DualListbox";
import GoogleMapPage from "../pages/components/misc/GoogleMap";
import JsTreePreview from "../pages/components/misc/JsTree";
import QuillPreview from "../pages/components/forms/rich-editor/QuillPreview";
import TinymcePreview from "../pages/components/forms/rich-editor/TinymcePreview";
import KnobPreview from "../pages/components/charts/KnobPreview";
import { FileManagerContextProvider } from "../pages/app/file-manager/FileManagerContext";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import NSA from "../pages/NSA/NSA";
import Invoicing from "../pages/Invoicing/Invoicing";
import Bandwidth from "../pages/Bandwidth/Bandwidth";
import Inventory from "../pages/Inventory/Inventory";
import Reports from "../pages/Reports/Reports";
import Notifications from "../pages/Notifications/Notifications";
import Leads from "../pages/Leads/Leads";
import NasManagement from "../pages/NasManagement/NasManagement";
import UserManagement from "../pages/UserManagement/UserManagement";
import SubscriptionPlans from "../pages/SubscriptionPlans/Plans";

import PaymentsAndBillings from "../pages/Invoicing/PaymentsAndBillings";
import ActivityLogs from "../pages/ActivityLogs/ActivityLogs";
import UserProfile from "../pages/UserManagement/UserProfile";
import AddUser from "../pages/UserManagement/AddUser";
import Edituser from "../pages/UserManagement/Edituser";
import SubscriberManagement from "../pages/SubscriberManagement/SubscriberManagement";
import Receipts from "../pages/Receipts/PreviewPage";
import RoleManagement from "../pages/RoleManagement/RoleManagement";
import UpdateAccess from "../pages/RoleManagement/UpdateAccess";
import PaymentStatementListing from "../pages/PaymentStatement/PaymentStatementListing";
import ViewLeads from "../pages/Leads/ViewLeads";
import InvoiceSettings from "../pages/pre-built/user-manage/InvoiceSettings";
import LeadConfiguration from "../pages/LeadConfiguration/LeadConfiguration";
import LeadAssignment from "../pages/LeadAssignment/LeadAssignment";
import HelpDeskManagement from "../pages/HelpDesk/HelpDeskManagement/HelpDeskManagement";
import TicketView from "../pages/HelpDesk/HelpDeskManagement/TicketView";
import HelpDeskConfiguration from "../pages/HelpDesk/HelpDeskConfiguration/HelpDeskConfiguration";
import HelpDeskAssignment from "../pages/HelpDesk/HelpDeskAssignment/HelpDeskAssignment";
import Setting from "../pages/Setting/Setting";
import GeneralSetting from "../pages/Setting/GeneralSetting";
import PrivateRoute from "./PrivateRoute";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import ProposalInvoice from "../pages/Invoicing/ProposalInvoices/ProposalInvoice";
import EmailManagement from "../pages/pre-built/user-manage/EmailManagement";
import FranchiseeConfiguration from "../pages/FranchiseeConfiguration/FranchiseeConfiguration";
import FranchiseeManagement from "../pages/FranchiseeConfiguration/FranchiseeManagement";
import FranchiseeStatement from "../pages/FranchiseeConfiguration/FranchiseeStatement";
import InventorymanagementList from "../pages/InventoryManagement/InventorymanagementList";
import InventoryCategoryView from "../pages/InventoryManagement/InventoryCategoryView";
import DefineAreaList from "../pages/CollectionArea/DefineArea/DefineAreaList";
import MappingAdminList from "../pages/CollectionArea/MappingAdmin/MappingAdminList";
import ViewUsersList from "../pages/CollectionArea/ViewUsers/ViewUsersList";
import CollectionList from "../pages/CollectionArea/CollectionApproval/CollectionList";
import ManagingAdminCollectionList from "../pages/CollectionArea/ManagingAdminViseCollection/ManagingAdminCollectionList";
import ServiceManagement from "../pages/ServiceManagement/ServiceManagement";
import PdfTemplate from "../pages/EmailTemplate/PdfTemplate";
import NewInvoice from "../pages/Invoicing/NewInvoice";
import IspManagementList from "../pages/IspManagement/IspManagementList";
import IspView from "../pages/IspManagement/IspView";
import BngAttributes from "../pages/bngAttributes/BngAttributes";
import AddAndUpdateBng from "../pages/BngFolder/AddAndUpdateBng";
import BngListing from "../pages/BngFolder/BngListing";
import SubscriberOther from "../pages/SubscriberManagement/SubscriberOther/SubscriberOther";
import InventoryAddAndUpdateItem from "../pages/InventoryManagement/InventoryAddAndUpdateItem";
const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense fallback={<div />}>
      <Switch>
        {/*Dashboards*/}
        <Route exact path={`${process.env.PUBLIC_URL}/_blank`} component={Blank}></Route>

        {/*Pre-built Pages*/}
        <Route exact path={`${process.env.PUBLIC_URL}/project-card`} component={ProjectCardPage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/project-list`} component={ProjectListPage}></Route>
        <Route //Context Api added
          exact
          path={`${process.env.PUBLIC_URL}/user-list-regular`}
          render={() => (
            <UserContextProvider>
              <UserListRegularPage />
            </UserContextProvider>
          )}
        ></Route>
        <Route //Context Api added
          exact
          path={`${process.env.PUBLIC_URL}/user-list-compact`}
          render={() => (
            <UserContextProvider>
              <UserListCompact />
            </UserContextProvider>
          )}
        ></Route>

        <Route //Context Api added
          exact
          path={`${process.env.PUBLIC_URL}/user-details-regular/:id`}
          render={(props) => (
            <UserContextProvider>
              <UserDetailsPage {...props} />
            </UserContextProvider>
          )}
        ></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-regular/`} component={UserProfileLayout}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-invoice/`} component={UserProfileLayout}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-email-management/`} component={UserProfileLayout}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-hsn-sac-code/`} component={UserProfileLayout}></Route>

        <Route
          exact
          path={`${process.env.PUBLIC_URL}/user-profile-notification/`}
          component={UserProfileLayout}
        ></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-activity/`} component={UserProfileLayout}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-setting/`} component={UserProfileLayout}></Route>
        <Route //Context api added
          exact
          path={`${process.env.PUBLIC_URL}/user-contact-card`}
          render={() => (
            <UserContextProvider>
              <UserContactCardPage />
            </UserContextProvider>
          )}
        ></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/kyc-list-regular`} component={KycListRegular}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/kyc-details-regular/:id`} component={KycDetailsRegular}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/transaction-basic`} component={TransListBasic}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/transaction-crypto`} component={TransListCrypto}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/product-list`} component={ProductList}></Route>
        <Route // context api added
          exact
          path={`${process.env.PUBLIC_URL}/product-card`}
          render={(props) => (
            <ProductContextProvider>
              <ProductCard />
            </ProductContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/product-details/:id`}
          render={(props) => (
            <ProductContextProvider>
              <ProductDetails {...props} />
            </ProductContextProvider>
          )}
        ></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/invoice-list`} component={InvoiceList}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/invoice-details/:id`} component={InvoiceDetails}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/pricing-table`} component={PricingTable}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/image-gallery`} component={GalleryPreview}></Route>

        {/*Demo Pages*/}
        <Route exact path={`${process.env.PUBLIC_URL}/pages/terms-policy`} component={Terms}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/pages/faq`} component={Faq}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/pages/regular-v1`} component={Regularv1}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/pages/regular-v2`} component={Regularv2}></Route>

        {/*Application*/}
        <Route exact path={`${process.env.PUBLIC_URL}/app-messages`} component={AppMessages}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/app-chat`} component={Chat}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/app-calender`} component={Calender}></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app-file-manager`}
          render={(props) => (
            <FileManagerContextProvider>
              <FileManager />
            </FileManagerContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app-file-manager/files`}
          render={(props) => (
            <FileManagerContextProvider>
              <FileManager />
            </FileManagerContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app-file-manager/shared`}
          render={(props) => (
            <FileManagerContextProvider>
              <FileManager />
            </FileManagerContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app-file-manager/starred`}
          render={(props) => (
            <FileManagerContextProvider>
              <FileManager />
            </FileManagerContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app-file-manager/recovery`}
          render={(props) => (
            <FileManagerContextProvider>
              <FileManager />
            </FileManagerContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app-file-manager/settings`}
          render={(props) => (
            <FileManagerContextProvider>
              <FileManager />
            </FileManagerContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app-file-manager/pricing`}
          render={(props) => (
            <FileManagerContextProvider>
              <FileManager />
            </FileManagerContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app-file-manager/folder/:id`}
          render={(props) => (
            <FileManagerContextProvider>
              <FileManager />
            </FileManagerContextProvider>
          )}
        ></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/app-inbox`} component={Inbox}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/app-kanban`} component={Kanban}></Route>

        {/*Components*/}
        <Route exact path={`${process.env.PUBLIC_URL}/components`} component={Component}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/accordions`} component={Accordian}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/alerts`} component={Alerts}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/avatar`} component={Avatar}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/badges`} component={Badges}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/breadcrumbs`} component={Breadcrumbs}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/button-group`} component={ButtonGroup}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/buttons`} component={Buttons}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/cards`} component={Cards}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/carousel`} component={Carousel}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/dropdowns`} component={Dropdowns}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/form-elements`} component={FormElements}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/form-layouts`} component={FormLayouts}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/checkbox-radio`} component={CheckboxRadio}></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/components/advanced-control`}
          component={AdvancedControls}
        ></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/input-group`} component={InputGroup}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/form-upload`} component={FormUpload}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/number-spinner`} component={NumberSpinner}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/form-validation`} component={FormValidation}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/datetime-picker`} component={DateTimePicker}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/modals`} component={Modals}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/pagination`} component={Pagination}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/popovers`} component={Popovers}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/progress`} component={Progress}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/spinner`} component={Spinner}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/tabs`} component={Tabs}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/toast`} component={Toast}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/tooltips`} component={Tooltips}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/typography`} component={Typography}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/noUislider`} component={NouiSlider}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/wizard-basic`} component={WizardForm}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/quill`} component={QuillPreview}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/tinymce`} component={TinymcePreview}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/widgets/cards`} component={CardWidgets}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/widgets/charts`} component={ChartWidgets}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/widgets/rating`} component={RatingWidgets}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/misc/slick-slider`} component={SlickPage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/misc/sweet-alert`} component={SweetAlertPage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/misc/beautiful-dnd`} component={BeautifulDnd}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/misc/dual-list`} component={DualListPage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/misc/map`} component={GoogleMapPage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/misc/toastify`} component={ReactToastify}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/misc/jsTree`} component={JsTreePreview}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-border`} component={UtilBorder}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-colors`} component={UtilColors}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-display`} component={UtilDisplay}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-embeded`} component={UtilEmbeded}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-flex`} component={UtilFlex}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-others`} component={UtilOthers}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-sizing`} component={UtilSizing}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-spacing`} component={UtilSpacing}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/components/util-text`} component={UtilText}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/table-basic`} component={BasicTable}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/table-datatable`} component={DataTablePage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/table-special`} component={SpecialTablePage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/charts/chartjs`} component={ChartPage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/charts/knobs`} component={KnobPreview}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/email-template`} component={EmailTemplate}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/nioicon`} component={NioIconPage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/svg-icons`} component={SVGIconPage}></Route>
        <Route exact path={`/`} render={() => (true ? <Redirect to="/dashboard" /> : "")}></Route>
        <PrivateRoute exact path={`/dashboard`} component={Dashboard}></PrivateRoute>
        <PrivateRoute exact path={`/adminDashboard`} component={AdminDashboard}></PrivateRoute>
        <PrivateRoute exact path={`/userManagement`} component={UserManagement}></PrivateRoute>
        <PrivateRoute exact path={`/setting`} component={Setting}></PrivateRoute>
        <PrivateRoute exact path={`/generalSetting`} component={GeneralSetting}></PrivateRoute>
        <PrivateRoute exact path={`/userprofile`} component={UserProfile}></PrivateRoute>
        <PrivateRoute exact path={`/adduser`} component={AddUser}></PrivateRoute>
        <PrivateRoute exact path={`/edituser/:id`} component={Edituser}></PrivateRoute>
        <PrivateRoute exact path={`/nsa`} component={NSA}></PrivateRoute>
        <PrivateRoute exact path={`/subscriptionPlans`} component={SubscriptionPlans}></PrivateRoute>
        <PrivateRoute exact path={`/subscriberManagement`} component={SubscriberManagement}></PrivateRoute>
        <PrivateRoute exact path={`/subscriberOther`} component={SubscriberOther}></PrivateRoute>

        <PrivateRoute exact path={`${process.env.PUBLIC_URL}/receipts`} component={Receipts}></PrivateRoute>
        <PrivateRoute
          exact
          path={`${process.env.PUBLIC_URL}/paymentsAndBillings`}
          component={PaymentsAndBillings}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path={`${process.env.PUBLIC_URL}/paymentsAndBillings/newInvoice/:id`}
          component={NewInvoice}
        ></PrivateRoute>
        <PrivateRoute exact path={`/ispManagementList`} component={IspManagementList}></PrivateRoute>
        <PrivateRoute exact path={`/ispManagementList/ispview/:id`} component={IspView}></PrivateRoute>
        <PrivateRoute exact path={`/proposalInvoices`} component={ProposalInvoice}></PrivateRoute>

        <PrivateRoute exact path={`/invoicing`} component={Invoicing}></PrivateRoute>
        <PrivateRoute exact path={`/bandwidthManagement`} component={Bandwidth}></PrivateRoute>
        <PrivateRoute exact path={`/serviceManagement`} component={ServiceManagement}></PrivateRoute>
        <PrivateRoute exact path={`/inventory`} component={Inventory}></PrivateRoute>
        <PrivateRoute exact path={`/reports`} component={Reports}></PrivateRoute>
        <PrivateRoute exact path={`/notification`} component={Notifications}></PrivateRoute>
        <PrivateRoute exact path={`/activityLogs`} component={ActivityLogs}></PrivateRoute>
        <PrivateRoute exact path={`/leads`} component={Leads}></PrivateRoute>
        <PrivateRoute exact path={`/leads/viewLeads/:id`} component={ViewLeads} />
        <PrivateRoute exact path={`/paymentTransactionlist`} component={PaymentStatementListing}></PrivateRoute>

        <PrivateRoute exact path={`/leadConfiguration`} component={LeadConfiguration}></PrivateRoute>
        <PrivateRoute exact path={`/leadAssignment`} component={LeadAssignment}></PrivateRoute>

        <PrivateRoute exact path={`/nsaManagment`} component={NasManagement}></PrivateRoute>
        <PrivateRoute exact path={`/roleManagement`} component={RoleManagement}></PrivateRoute>
        <PrivateRoute exact path={`/updateAccess/:id`} component={UpdateAccess}></PrivateRoute>

        <PrivateRoute exact path={`/helpDeskManagement`} component={HelpDeskManagement}></PrivateRoute>
        <PrivateRoute exact path={`/helpDeskManagement/view/:id`} component={TicketView}></PrivateRoute>
        <PrivateRoute exact path={`/helpDeskConfiguration`} component={HelpDeskConfiguration}></PrivateRoute>
        <PrivateRoute exact path={`/helpDeskAssignment`} component={HelpDeskAssignment}></PrivateRoute>
        <PrivateRoute exact path={`/franchiseeConfiguration`} component={FranchiseeConfiguration}></PrivateRoute>
        <PrivateRoute exact path={`/franchiseeMangement`} component={FranchiseeManagement}></PrivateRoute>
        <PrivateRoute exact path={`/franchiseeStatement`} component={FranchiseeStatement}></PrivateRoute>
        <PrivateRoute exact path={`/inventoryManagement`} component={InventorymanagementList}></PrivateRoute>
        <PrivateRoute exact path={`/inventoryManagement/viewInventoryCategory/:id`} component={InventoryCategoryView}></PrivateRoute>
        <PrivateRoute exact path={`/inventoryManagement/viewInventoryCategory/:id/inventoryAddAndUpdate`} component={InventoryAddAndUpdateItem}></PrivateRoute>
        <PrivateRoute exact path={`/inventoryManagement/viewInventoryCategory/:id/inventoryAddAndUpdate/:eid`} component={InventoryAddAndUpdateItem}></PrivateRoute>

        <PrivateRoute exact path={`/`} component={BngAttributes}></PrivateRoute>
        <PrivateRoute exact path={`/addBng`} component={AddAndUpdateBng}></PrivateRoute>
        <PrivateRoute exact path={`/bngAttributes`} component={BngListing}></PrivateRoute>


        <PrivateRoute exact path={`/defineArea`} component={DefineAreaList}></PrivateRoute>
        <PrivateRoute exact path={`/mappingAdmin`} component={MappingAdminList}></PrivateRoute>
        <PrivateRoute exact path={`/viewUsers`} component={ViewUsersList}></PrivateRoute>
        <PrivateRoute exact path={`/collectionlist`} component={CollectionList}></PrivateRoute>
        <PrivateRoute exact path={`/managingingAdminCollection`} component={ManagingAdminCollectionList}></PrivateRoute>

        <PrivateRoute exact path={`/pdf-template`} component={PdfTemplate}></PrivateRoute>





        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
