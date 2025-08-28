import { IoIosHome, IoIosMale, IoIosMan } from "react-icons/io";
import { FaTools } from "react-icons/fa";
import { FaFileInvoiceDollar, FaRegCalendarCheck } from "react-icons/fa6";
import { CiMoneyBill } from "react-icons/ci";
import { MdHelp, MdOutlineInventory, MdPayments } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import { IoServer, IoSettings } from "react-icons/io5";
import { MdAssignment, MdInventory, MdLineStyle, MdOpenInNew } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";
import { TbLogs } from "react-icons/tb";
import { MdLeaderboard } from "react-icons/md";
import { MdSpeed } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { FcDataConfiguration } from "react-icons/fc";
import { BsSpeedometer2 } from "react-icons/bs";
import { MdMiscellaneousServices } from "react-icons/md";
import { userInfo } from "../../assets/userLoginInfo";
import { MdDashboard } from "react-icons/md";
import { MdEditAttributes } from "react-icons/md";

let menu = [
  {
    key: "Dashboard",
    icon: <MdDashboard />,
    text: "Dashboard",
    link: userInfo()?.role === "super admin" ? userInfo()?.org_id ? "/dashboard" : "/adminDashboard":"/dashboard"
  },
  {
    key: "Isp Management",
    icon: <IoIosMan />,
    text: "Isp Management",
    link: "/ispManagementList"
  },
  {
    key: "User Management",
    icon: <FaUsers />,
    text: "User Management",
    link: "/userManagement"
  },
  {
    key: "Franchisee",
    icon: <MdOpenInNew />,
    text: "Franchisee",
    link: "/okoko",
    active: true,
    subMenu: [
      {
        key: "Franchisee Management Tab",
        text: "Franchisee Management",
        link: "/franchiseeMangement"
      },
      {
        key: "Franchisee Configuration Tab",
        text: "Franchisee Configuration",
        link: "/franchiseeConfiguration"
      },
      {
        key: "Franchisee Statement Tab",
        text: "Franchisee Statement",
        link: "/franchiseeStatement"
      }
    ]
  },
  {
    key: "Payment Collection",
    icon: <MdPayments />,
    text: "Payment Collection",
    link: "/okoko",
    active: true,
    subMenu: [
      {
        key: "Define Area Tab",
        text: "Define Area",
        link: "/defineArea"
      },
      {
        key: "Mapping Admins Tab",
        text: "Mapping Admins",
        link: "/mappingAdmin"
      },
      {
        key: "Collection Approval Tab",
        text: "Collection Approval",
        link: "/collectionlist"
      },
      {
        key: "Viewing Users Tab",
        text: "Viewing Users",
        link: "/viewUsers"
      }

      // {
      //   key: "Admin-Wise Tab",
      //   text: "Admin-Wise",
      //   link: "/managingingAdminCollection",
      // },
    ]
  },
  {
    key: "Inventory Management",
    icon: <MdOutlineInventory />,
    text: "Inventory Management",
    link: "/inventoryManagement"
  },
  {
    key: "Subscription Plan",
    icon: <FaRegCalendarCheck />,
    text: "Subscription Plans",
    link: "/subscriptionPlans"
  },
  {
    key: "Subscriber Management",
    icon: <FaTools />,
    text: "Subscriber Management",
    link: "/okoko",
    subMenu: [
      {
        text: "Subscriber (Plan)",
        link: "/subscriberManagement",
        key: "Subscriber Plan Tab"
      },
      {
        text: "Subscriber (Other)",
        link: "/subscriberOther",
        key: "Subscriber Other Tab"
      },]
  },
  {
    key: "Bandwidth Management",
    icon: <BsSpeedometer2 />,
    text: "Bandwidth Management",
    link: "/bandwidthManagement"
  },
  {
    key: "Service Management",
    icon: <MdMiscellaneousServices />,
    text: "Service Management",
    link: "/serviceManagement"
  },
  {
    key: "Invoices",
    text: "Proposals and Invoices",
    // link: "/invoicing",
    icon: <CiMoneyBill />,
    link: "/okoko",
    active: true,
    subMenu: [
      {
        key: "Invoice Management Tab",
        text: "Invoice Management",
        link: "/paymentsAndBillings"
      },
      {
        key: "Proposal Tab",
        text: "Proposal",
        link: "/proposalInvoices"
      }
    ]
  },
  {
    key: "Payment Transaction",
    icon: <FaFileInvoiceDollar />,
    text: "Payment",
    link: "/paymentTransactionlist"
  },
  {
    key: "Reports",
    icon: <TbReportAnalytics />,
    text: "Reports",
    link: "/reports"
  },
  {
    key: "Leads",
    icon: <MdOpenInNew />,
    text: "Leads",
    link: "/okoko",
    active: true,
    subMenu: [
      {
        key: "Leads Management Tab",
        text: "Lead Management",
        link: "/leads"
      },
      {
        key: "Leads Configuration Tab",
        // icon: <FcDataConfiguration/>,
        text: "Lead Configuration",
        link: "/leadConfiguration"
      },
      {
        key: "Leads Assignment Tab",
        // icon: <MdAssignment/>,
        text: "Lead Assignment",
        link: "/leadAssignment"
      }
    ]
  },
  {
    key: "Activity Logs",
    icon: <TbLogs />,
    text: "Activity Logs",
    link: "/activityLogs"
  },
  {
    key: "Role Management",

    icon: <MdLeaderboard />,
    text: "Role Management",
    link: "/roleManagement"
  },
  {
    key: "Help Desk",
    text: "Help Desk",
    icon: <MdHelp />,
    link: "/okoko",
    active: true,
    subMenu: [
      {
        text: "Help Desk Management",
        link: "/helpDeskManagement",
        key: "Help Desk Management Tab"
      },
      {
        text: "Help Desk Configuration",
        link: "/helpDeskConfiguration",
        key: "Help Desk Configuration Tab"
      },
      {
        text: "Help Desk Assignment",
        link: "/helpDeskAssignment",
        key: "Help Desk Assignment Tab"
      }
    ]
  },
  {
    key: "Email Template",
    icon: <TbReportAnalytics />,
    text: "Pdf Template",
    link: "/pdf-template"
  },
  {
    key: "Bng Attributes",
    icon: <MdEditAttributes />,
    text: "Bng Attributes",
    link: "/bngAttributes"
  },
  {
    key: "Bng Management",
    icon: <MdEditAttributes />,
    text: "Bng Management",
    link: "/bngListing",
    active: true,
    subMenu: [
      {
        text: "Add Bng",
        link: "/addBng",
        key: "Add Bng"
      }
    ]
  },
  {
    key: "Settings",

    icon: <IoSettings />,
    text: "Setting",
    link: "/setting",
    active: true,
    subMenu: [
      {
        text: "General Setting",
        link: "/generalSetting",
        key: "General Setting Tab"
      }
    ]
  }

  // {
  //   icon: <FaTools/>,
  //   text: "Nas Management",
  //   link: "/nsaManagment",
  // },
  // {
  //   icon: <LuLogOut/>,
  //   text: "Sign Out",
  //   link: "/test",
  // },

  // {
  //   icon: "tile-thumb",
  //   text: "Projects",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Project Cards",
  //       link: "/project-card",
  //     },
  //     {
  //       text: "Project List",
  //       link: "/project-list",
  //     },
  //   ],
  // },
  // {
  //   icon: "users",
  //   text: "User Manage",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "User List - Regular",
  //       link: "/user-list-regular",
  //     },
  //     {
  //       text: "User List - Compact",
  //       link: "/user-list-compact",
  //     },
  //     {
  //       text: "User Details - Regular",
  //       link: "/user-details-regular/1",
  //     },
  //     {
  //       text: "User Profile - Regular",
  //       link: "/user-profile-regular",
  //     },
  //     {
  //       text: "User Contact - Card",
  //       link: "/user-contact-card",
  //     },
  //   ],
  // },
  // {
  //   icon: "file-docs",
  //   text: "AML / KYCs",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "KYC List - Regular",
  //       link: "/kyc-list-regular",
  //     },
  //     {
  //       text: "KYC Details - Regular",
  //       link: "/kyc-details-regular/UD01544",
  //     },
  //   ],
  // },
  // {
  //   icon: "tranx",
  //   text: "Transaction",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Trans List - Basic",
  //       link: "/transaction-basic",
  //     },
  //     {
  //       text: "Trans List - Crypto",
  //       link: "/transaction-crypto",
  //     },
  //   ],
  // },
  // {
  //   icon: "grid-alt",
  //   text: "Applications",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Messages",
  //       link: "/app-messages",
  //     },
  //     {
  //       text: "Chats / Messenger",
  //       link: "/app-chat",
  //     },
  //     {
  //       text: "Inbox / Mail",
  //       link: "/app-inbox",
  //     },
  //     {
  //       text: "Calendar",
  //       link: "/app-calender",
  //     },
  //     {
  //       text: "File Manager",
  //       link: "/app-file-manager",
  //       badge: "new",
  //     },
  //     {
  //       text: "Kanban Board",
  //       link: "/app-kanban",
  //     },
  //   ],
  // },
  // {
  //   icon: "card-view",
  //   text: "Products",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Product List",
  //       link: "/product-list",
  //     },
  //     {
  //       text: "Product Card",
  //       link: "/product-card",
  //     },
  //     {
  //       text: "Product Details",
  //       link: "/product-details/0",
  //     },
  //   ],
  // },
  // {
  //   icon: "file-docs",
  //   text: "Invoice",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Invoice List",
  //       link: "/invoice-list",
  //     },
  //     {
  //       text: "Invoice Details",
  //       link: "/invoice-details/1",
  //     },
  //   ],
  // },
  // {
  //   icon: "view-col",
  //   text: "Pricing Table",
  //   link: "/pricing-table",
  // },
  // {
  //   icon: "img",
  //   text: "Image Gallery",
  //   link: "/image-gallery",
  // },
  // {
  //   heading: "Misc Pages",
  // },
  // {
  //   icon: "signin",
  //   text: "Auth Pages",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Login / Signin",
  //       link: "/auth-login",
  //       newTab: true,
  //     },
  //     {
  //       text: "Register / Signup",
  //       link: "/auth-register",
  //       newTab: true,
  //     },
  //     {
  //       text: "Forgot Password",
  //       link: "/auth-reset",
  //       newTab: true,
  //     },
  //     {
  //       text: "Success / Confirm",
  //       link: "/auth-success",
  //       newTab: true,
  //     },
  //   ],
  // },
  // {
  //   icon: "files",
  //   text: "Error Pages",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "404 Classic",
  //       link: "/errors/404-classic",
  //       newTab: true,
  //     },
  //     {
  //       text: "504 Classic",
  //       link: "/errors/504-classic",
  //       newTab: true,
  //     },
  //     {
  //       text: "404 Modern",
  //       link: "/errors/404-modern",
  //       newTab: true,
  //     },
  //     {
  //       text: "504 Modern",
  //       link: "/errors/504-modern",
  //       newTab: true,
  //     },
  //   ],
  // },
  // {
  //   icon: "files",
  //   text: "Other Pages",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Blank / Startup",
  //       link: "/_blank",
  //     },
  //     {
  //       text: "Faqs / Help",
  //       link: "/pages/faq",
  //     },
  //     {
  //       text: "Terms / Policy",
  //       link: "/pages/terms-policy",
  //     },
  //     {
  //       text: "Regular Page - v1",
  //       link: "/pages/regular-v1",
  //     },
  //     {
  //       text: "Regular Page - v2",
  //       link: "/pages/regular-v2",
  //     },
  //   ],
  // },

  // {
  //   heading: "Components",
  // },
  // {
  //   icon: "layers",
  //   text: "Ui Elements",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Alerts",
  //       link: "/components/alerts",
  //     },
  //     {
  //       text: "Accordions",
  //       link: "/components/accordions",
  //     },
  //     {
  //       text: "Avatar",
  //       link: "/components/avatar",
  //     },
  //     {
  //       text: "Badges",
  //       link: "/components/badges",
  //     },
  //     {
  //       text: "Buttons",
  //       link: "/components/buttons",
  //     },
  //     {
  //       text: "Button Group",
  //       link: "/components/button-group",
  //     },
  //     {
  //       text: "Breadcrumbs",
  //       link: "/components/breadcrumbs",
  //     },
  //     {
  //       text: "Cards",
  //       link: "/components/cards",
  //     },
  //     {
  //       text: "Carousel",
  //       link: "/components/carousel",
  //     },
  //     {
  //       text: "Dropdowns",
  //       link: "/components/dropdowns",
  //     },
  //     {
  //       text: "Modals",
  //       link: "/components/modals",
  //     },
  //     {
  //       text: "Pagination",
  //       link: "/components/pagination",
  //     },
  //     {
  //       text: "Popovers",
  //       link: "/components/popovers",
  //     },
  //     {
  //       text: "Progress",
  //       link: "/components/progress",
  //     },
  //     {
  //       text: "Spinner",
  //       link: "/components/spinner",
  //     },
  //     {
  //       text: "Tabs",
  //       link: "/components/tabs",
  //     },
  //     {
  //       text: "Toast",
  //       link: "/components/toast",
  //     },
  //     {
  //       text: "Typography",
  //       link: "/components/typography",
  //     },
  //     {
  //       text: "Tooltips",
  //       link: "/components/tooltips",
  //     },
  //     {
  //       text: "Utilities",
  //       active: false,
  //       subMenu: [
  //         {
  //           text: "Borders",
  //           link: "/components/util-border",
  //         },
  //         {
  //           text: "Colors",
  //           link: "/components/util-colors",
  //         },
  //         {
  //           text: "Display",
  //           link: "/components/util-display",
  //         },
  //         {
  //           text: "Embeded",
  //           link: "/components/util-embeded",
  //         },
  //         {
  //           text: "Flex",
  //           link: "/components/util-flex",
  //         },
  //         {
  //           text: "Text",
  //           link: "/components/util-text",
  //         },
  //         {
  //           text: "Sizing",
  //           link: "/components/util-sizing",
  //         },
  //         {
  //           text: "Spacing",
  //           link: "/components/util-spacing",
  //         },
  //         {
  //           text: "Others",
  //           link: "/components/util-others",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   icon: "dot-box",
  //   text: "Crafted Icons",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "SVG Icon-Exclusive",
  //       link: "/svg-icons",
  //     },
  //     {
  //       text: "Nioicon - HandCrafted",
  //       link: "/nioicon",
  //     },
  //   ],
  // },
  // {
  //   icon: "table-view",
  //   text: "Tables",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Basic Tables",
  //       link: "/table-basic",
  //     },
  //     {
  //       text: "Special Tables",
  //       link: "/table-special",
  //     },
  //     {
  //       text: "DataTables",
  //       link: "/table-datatable",
  //     },
  //   ],
  // },
  // {
  //   icon: "card-view",
  //   text: "Forms",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Form Elements",
  //       link: "/components/form-elements",
  //     },
  //     {
  //       text: "Checkbox Radio",
  //       link: "/components/checkbox-radio",
  //     },
  //     {
  //       text: "Advanced Controls",
  //       link: "/components/advanced-control",
  //     },
  //     {
  //       text: "Input Group",
  //       link: "/components/input-group",
  //     },
  //     {
  //       text: "Form Upload",
  //       link: "/components/form-upload",
  //     },
  //     {
  //       text: "Date Time Picker",
  //       link: "/components/datetime-picker",
  //     },
  //     {
  //       text: "Number Spinner",
  //       link: "/components/number-spinner",
  //     },
  //     {
  //       text: "noUiSlider",
  //       link: "/components/nouislider",
  //     },
  //     {
  //       text: "Form Layouts",
  //       link: "/components/form-layouts",
  //     },
  //     {
  //       text: "Form Validation",
  //       link: "/components/form-validation",
  //     },
  //     {
  //       text: "Wizard Basic",
  //       link: "/components/wizard-basic",
  //     },
  //     {
  //       text: "Rich Editor",
  //       active: false,
  //       subMenu: [
  //         {
  //           text: "Quill",
  //           link: "/components/quill",
  //         },
  //         {
  //           text: "Tinymce",
  //           link: "/components/tinymce",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   icon: "pie",
  //   text: "Charts",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Chart Js",
  //       link: "/charts/chartjs",
  //     },
  //     {
  //       text: "Knobs",
  //       link: "/charts/knobs",
  //     },
  //   ],
  // },
  // {
  //   icon: "puzzle",
  //   text: "Widgets",
  //   subMenu: [
  //     {
  //       text: "Card Widgets",
  //       link: "/components/widgets/cards",
  //     },
  //     {
  //       text: "Chart Widgets",
  //       link: "/components/widgets/charts",
  //     },
  //     {
  //       text: "Rating Widgets",
  //       link: "/components/widgets/rating",
  //     },
  //   ],
  // },
  // {
  //   icon: "block-over",
  //   text: "Miscellaneous",
  //   subMenu: [
  //     {
  //       text: "Slick Sliders",
  //       link: "/components/misc/slick-slider",
  //     },
  //     {
  //       text: "JsTree",
  //       link: "/components/misc/jsTree",
  //     },
  //     {
  //       text: "React Toastify",
  //       link: "/components/misc/toastify",
  //     },
  //     {
  //       text: "Sweet Alert",
  //       link: "/components/misc/sweet-alert",
  //     },
  //     {
  //       text: "React DualListBox",
  //       link: "/components/misc/dual-list",
  //     },
  //     {
  //       text: "React Beautiful Dnd",
  //       link: "/components/misc/beautiful-dnd",
  //     },
  //     {
  //       text: "Google Map",
  //       link: "/components/misc/map",
  //     },
  //   ],
  // },
  // {
  //   icon: "text-rich",
  //   text: "Email Template",
  //   link: "/email-template",
  //   active: "false",
  // },
];

// menu =
//   userInfo()?.role === "super admin"
//     ? userInfo()?.org_id
//       ? [
//           {
//             key: "Dashboard",
//             icon: <MdDashboard />,
//             text: "Dashboard",
//             link: userInfo()?.org_id ? "/dashboard" : "/adminDashboard"
//           },

//         ]
//       : [
//           {
//             key: "Dashboard",
//             icon: <MdDashboard />,
//             text: "Dashboard",
//             link: "/adminDashboard"
//           },
//           {
//             key: "Isp Management",
//             icon: <IoIosMan />,
//             text: "Isp Management",
//             link: "/ispManagementList"
//           },
//           {
//             key: "User Management",
//             icon: <FaUsers />,
//             text: "User Management",
//             link: "/userManagement"
//           }
//         ]
//     : [
//         {
//           key: "Dashboard",
//           icon: <IoIosHome />,
//           text: "Dashboard",
//           link: "/dashboard"
//         },
//         ...menu
//       ];
export default menu;
