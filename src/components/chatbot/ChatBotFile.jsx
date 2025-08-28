import React, { useEffect, useState } from "react";
import ChatBot from "react-simple-chatbot";
import { FaTimes } from "react-icons/fa";
import chatBotImage from "../../assets/images/jsTree/chatbot.svg";
import { subDays, subMonths } from "date-fns";
import {
  generateHelpDeskReport,
  generateInvoiceReport,
  generateLeadsReport,
  generateReportSubscriber,
  getAllIssueType,
  getPlanByCreator,
  getUserReport
} from "../../service/admin";
import { userId, userInfo } from "../../assets/userLoginInfo";
import { CSVLink } from "react-csv";
import moment from "moment";
export default function ChatBotFile() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Add this state
  const [year, setYear] = useState("");
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };
  // const [csvFilename, setCsvFilename] = useState("report.csv");
  // const [csvData, setCsvData] = useState([]);

  const getStartandEndData = (type, value) => {
    try {
      let startDate = "";
      let endDate = "";
      if (type === "Yearly") {
        startDate = new Date(`${value}-01-01`);
        endDate = new Date(`${value}-12-31`);
      } else if (type === "Monthly") {
        startDate = new Date(`${year}-${value}-01`);
        endDate = new Date(`${year}-${value}-31`);
      } else {
        let months = value.split("-");
        startDate = new Date(`${year}-${months[0]}-01`);
        endDate = new Date(`${year}-${months[1]}-31`);
      }

      return { startDate, endDate };
    } catch (err) {
      console.log(err);
    }
  };
  const [step1, setStep1] = useState([]);
  const [steps, setSteps] = useState([
    {
      id: "1",
      message: "Welcome to our service! How can I assist you today?",
      trigger: "main-menu"
    },
    {
      id: "main-menu",
      options: [
        { value: "FAQ", label: "FAQ", trigger: "FAQ" },
        { value: "Report", label: "Report", trigger: "Report" }
      ]
    },
    {
      id: "Report",
      options: [
        { value: "User Management", label: "User Management", trigger: "user-report-input-message" },
        { value: "Subscriber Management", label: "Subscriber Management", trigger: "user-type-sub" },
        { value: "Invoice Management", label: "Invoice Management", trigger: "invoice_type_message" },
        { value: "Helpdesk Management", label: "Helpdesk Management", trigger: "Helpdesk_type_message" },
        { value: "Leads Management", label: "Leads Management", trigger: "user-report-input-message" },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "Helpdesk_type_message",
      message: "Please Select Ticket Type",
      trigger: "Helpdesk_type"
    },
    {
      id: "Helpdesk_type",
      options: [
        { value: "new", label: "All", trigger: "user-report-input-message" },
        { value: "resolve", label: "Resolved", trigger: "user-report-input-message" },
        { value: "unresolve", label: "Unresolve", trigger: "user-report-input-message" }
      ]
    },
    {
      id: "invoice_type_message",
      message: "Please Select Invoice Type",
      trigger: "invoice_type"
    },
    {
      id: "invoice_type",
      options: [
        { value: "perfoma", label: "Perfoma Invoice", trigger: "user-report-input-message" },
        { value: "proposal", label: "Proposal Invoice", trigger: "user-report-input-message" },
        { value: "paid", label: "Paid Invoice", trigger: "user-report-input-message" }
      ]
    },
    {
      id: "user-type-sub",
      message: "Please Select User Type",
      trigger: "Subscriber_user_type"
    },
    {
      id: "Subscriber_user_type",
      options: [
        { value: "all", label: "All", trigger: "metrics-type-sub" },
        { value: "postpaid", label: "Postpaid", trigger: "metrics-type-sub" },
        { value: "prepaid", label: "Prepaid", trigger: "metrics-type-sub" }
      ]
    },
    {
      id: "metrics-type-sub",
      message: "Please Select Actvity Type",
      trigger: "Subscriber_metrics_type"
    },
    {
      id: "Subscriber_metrics_type",
      options: [
        { value: "deleted", label: "Deleted Subscriber", trigger: "user-report-input-message" },
        { value: "new", label: "New Subscriber", trigger: "user-report-input-message" },
        { value: "status", label: "Active/Inactive", trigger: "user-report-input-message" }
      ]
    },
    // {
    //   id: "user-report-input-message",
    //   message: "Enter Dates or months eg(28-09-2024 to 31-09-2024 , 4 months and etc)",
    //   trigger: "user-report-input",
    // },
    // {
    //   id: "user-report-input",
    //   user: true,
    //   validator: (input) => {
    //     handleUserInput(input);
    //     return true;
    //   },
    //   trigger: "report-generated",
    // },
    {
      id: "user-report-input-message",
      message: "Enter report Type",
      trigger: "user-report-input"
    },
    {
      id: "user-report-input",
      options: [
        { value: "Yearly", label: "Yearly", trigger: "select-year" },
        { value: "Quarterly", label: "Quarterly", trigger: "select-year-q" },
        { value: "Monthly", label: "Monthly", trigger: "select-year-month" }
      ]
    },
    {
      id: "select-year",
      message: "Please Enter a year for report. For eg: 2024",
      trigger: "user-year-selection"
    },
    {
      id: "select-year-month",
      message: "Please Enter a year for report. For eg: 2024",
      trigger: "user-year-selection-month"
    },
    {
      id: "select-year-q",
      message: "Please Enter a year for report. For eg: 2024",
      trigger: "user-year-selection-q"
    },

    {
      id: "user-year-selection",
      user: true,
      validator: input => {
        let year = new Date().getFullYear();
        if (isNaN(input) || input.length > 4 || Number(input) > Number(year)) {
          return "Please enter a valid year.";
        } else {
          setYear(input);
        }
        return true;
      },
      trigger: "report-generated"
    },
    {
      id: "user-year-selection-q",
      user: true,
      validator: input => {
        let year = new Date().getFullYear();
        if (isNaN(input) || input.length > 4 || Number(input) > Number(year)) {
          return "Please enter a valid year.";
        } else {
          setYear(input);
        }
        return true;
      },
      trigger: "select-quarter"
    },
    {
      id: "user-year-selection-month",
      user: true,
      validator: input => {
        let year = new Date().getFullYear();
        if (isNaN(input) || input.length > 4 || Number(input) > Number(year)) {
          return "Please enter a valid year.";
        } else {
          setYear(input);
        }
        return true;
      },
      trigger: "select-month"
    },
    {
      id: "select-quarter",
      message: "Please select a quarter for your report.",
      trigger: "user-quarter-selection"
    },
    {
      id: "user-quarter-selection",
      options: [
        { value: "01-03", label: "Q1 (Jan - Mar)", trigger: "report-generated" },
        { value: "04-06", label: "Q2 (Apr - Jun)", trigger: "report-generated" },
        { value: "07-09", label: "Q3 (Jul - Sep)", trigger: "report-generated" },
        { value: "10-12", label: "Q4 (Oct - Dec)", trigger: "report-generated" }
      ]
      // user: true,
    },
    {
      id: "select-month",
      message: "Please select a month for your report.",
      trigger: "user-month-selection"
    },
    {
      id: "user-month-selection",
      options: [
        { value: "01", label: "January", trigger: "report-generated" },
        { value: "02", label: "February", trigger: "report-generated" },
        { value: "03", label: "March", trigger: "report-generated" },
        { value: "04", label: "April", trigger: "report-generated" },
        { value: "05", label: "May", trigger: "report-generated" },
        { value: "06", label: "June", trigger: "report-generated" },
        { value: "07", label: "July", trigger: "report-generated" },
        { value: "08", label: "August", trigger: "report-generated" },
        { value: "09", label: "September", trigger: "report-generated" },
        { value: "10", label: "October", trigger: "report-generated" },
        { value: "11", label: "November", trigger: "report-generated" },
        { value: "12", label: "December", trigger: "report-generated" }
      ]
    },
    {
      id: "report-generated",
      message: "Your report is being generated. Please wait...",
      trigger: "download-report"
    },
    {
      id: "download-report",
      component: <div>Generating report...</div>, // Default content
      end: true
    },
    {
      id: "FAQ",
      options: [
        { value: "Internet Plans", label: "Internet Plans", trigger: "internet-plans" },
        { value: "Technical Support", label: "Technical Support", trigger: "technical-support" },
        { value: "Billing and Payments", label: "Billing and Payments", trigger: "billing-payments" },
        { value: "Account Management", label: "Account Management", trigger: "account-management" },
        { value: "Customer Feedback", label: "Customer Feedback", trigger: "customer-feedback" },
        { value: "Multilingual Support", label: "Multilingual Support", trigger: "multilingual-support" },
        { value: "Installation and Equipment", label: "Installation and Equipment", trigger: "installation-equipment" },
        {
          value: "Service Availability and Cancellations",
          label: "Service Availability and Cancellations",
          trigger: "service-availability"
        },
        { value: "Speed and Usage", label: "Speed and Usage", trigger: "speed-usage" },
        { value: "Refunds and Satisfaction", label: "Refunds and Satisfaction", trigger: "refunds-satisfaction" },
        { value: "Business Services", label: "Business Services", trigger: "business-services" },
        { value: "Support and Contact", label: "Support and Contact", trigger: "support-contact" },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "internet-plans",
      message: "What would you like to know about Internet Plans?",
      trigger: "internet-plans-options"
    },
    {
      id: "internet-plans-options",
      options: [
        {
          value: "What internet plans do you offer?",
          label: "What internet plans do you offer?",
          trigger: "internet-plans-answer1"
        },
        {
          value: "What types of internet connections do you offer?",
          label: "What types of internet connections do you offer?",
          trigger: "internet-plans-answer2"
        },
        {
          value: "Is there a data cap on your internet plans?",
          label: "Is there a data cap on your internet plans?",
          trigger: "internet-plans-answer3"
        },
        {
          value: "Can I bundle internet with other services?",
          label: "Can I bundle internet with other services?",
          trigger: "internet-plans-answer4"
        },
        {
          value: "Do you offer any promotions or discounts?",
          label: "Do you offer any promotions or discounts?",
          trigger: "internet-plans-answer5"
        },
        {
          value: "Do you offer any discounts for seniors or students?",
          label: "Do you offer any discounts for seniors or students?",
          trigger: "internet-plans-answer6"
        },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "internet-plans-answer1",
      message:
        "We offer a variety of internet plans tailored to meet different needs, including basic, standard, and premium options. You can choose based on your usage requirements.",
      trigger: "internet-plans-options"
    },
    {
      id: "internet-plans-answer2",
      message:
        "We offer several types of internet connections, including fiber-optic, cable, DSL, and satellite. Each type has its own benefits, and we can help you choose the best option for your needs.",
      trigger: "internet-plans-options"
    },
    {
      id: "internet-plans-answer3",
      message:
        "Some of our plans have data caps, while others offer unlimited data. Please check the specific plan details or ask me for recommendations based on your usage.",
      trigger: "internet-plans-options"
    },
    {
      id: "internet-plans-answer4",
      message:
        "Yes! We offer bundle packages that include internet, TV, and phone services at a discounted rate. Let me know if you're interested, and I can provide more details.",
      trigger: "internet-plans-options"
    },
    {
      id: "internet-plans-answer5",
      message:
        "We frequently have promotions and discounts for new customers. Please check our website or ask me for current offers available in your area.",
      trigger: "internet-plans-options"
    },
    {
      id: "internet-plans-answer6",
      message:
        "We do offer special discounts for seniors and students in certain areas. Please check our website or ask me for more information about any current promotions that may apply to you.",
      trigger: "internet-plans-options"
    },
    {
      id: "technical-support",
      message: "What technical issue can I help you with?",
      trigger: "technical-support-options"
    },
    {
      id: "technical-support-options",
      options: [
        {
          value: "I'm experiencing connectivity issues.",
          label: "I'm experiencing connectivity issues.",
          trigger: "technical-support-answer1"
        },
        {
          value: "How do I reset my router?",
          label: "How do I reset my router?",
          trigger: "technical-support-answer2"
        },
        {
          value: "What should I do if I experience slow internet speeds?",
          label: "What should I do if I experience slow internet speeds?",
          trigger: "technical-support-answer3"
        },
        {
          value: "Can I use my own router with your service?",
          label: "Can I use my own router with your service?",
          trigger: "technical-support-answer4"
        },
        {
          value: "Do you offer static IP addresses?",
          label: "Do you offer static IP addresses?",
          trigger: "technical-support-answer5"
        },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "technical-support-answer1",
      message:
        "Please try restarting your modem and router. If the issue persists, I can assist you in troubleshooting or schedule a technician visit.",
      trigger: "technical-support-options"
    },
    {
      id: "technical-support-answer2",
      message:
        "To reset your router, locate the reset button on the device, press and hold it for about 10 seconds until the lights blink, then release it. This will restore factory settings.",
      trigger: "technical-support-options"
    },
    {
      id: "technical-support-answer3",
      message:
        "If you're experiencing slow speeds, try restarting your modem and router, check for any devices using a lot of bandwidth, and ensure your equipment is up to date. If the issue persists, please contact our support team for further assistance.",
      trigger: "technical-support-options"
    },
    {
      id: "technical-support-answer4",
      message:
        "Yes, you can use your own router as long as it is compatible with our network. We recommend checking our list of approved routers or consulting with our support team to ensure your device will work properly.",
      trigger: "technical-support-options"
    },
    {
      id: "technical-support-answer5",
      message:
        "Yes, we offer static IP addresses for businesses and individuals who need a consistent IP for hosting servers or other services. Please contact our sales team for more information on pricing and availability.",
      trigger: "technical-support-options"
    },
    {
      id: "billing-payments",
      message: "How can I assist you with Billing and Payments?",
      trigger: "billing-payments-options"
    },
    {
      id: "billing-payments-options",
      options: [
        { value: "How can I pay my bill?", label: "How can I pay my bill?", trigger: "billing-payments-answer1" },
        {
          value: "What should I do if I have a billing error?",
          label: "What should I do if I have a billing error?",
          trigger: "billing-payments-answer2"
        },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "billing-payments-answer1",
      message:
        "You can pay your bill online through our payment portal, via our mobile app, or by calling our customer service line.",
      trigger: "billing-payments-options"
    },
    {
      id: "billing-payments-answer2",
      message:
        "If you believe there is a billing error, please provide your account details, and I will help you investigate the issue.",
      trigger: "billing-payments-options"
    },
    {
      id: "account-management",
      message: "How can I assist you with Account Management?",
      trigger: "account-management-options"
    },
    {
      id: "account-management-options",
      options: [
        {
          value: "How can I change my plan?",
          label: "How can I change my plan?",
          trigger: "account-management-answer1"
        },
        {
          value: "How do I update my account information?",
          label: "How do I update my account information?",
          trigger: "account-management-answer2"
        },
        {
          value: "Can I upgrade my internet plan at any time?",
          label: "Can I upgrade my internet plan at any time?",
          trigger: "account-management-answer3"
        },
        {
          value: "What should I do if I forget my account password?",
          label: "What should I do if I forget my account password?",
          trigger: "account-management-answer4"
        },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "account-management-answer1",
      message:
        "You can change your plan by logging into your account on our website or by speaking with a customer service representative.",
      trigger: "account-management-options"
    },
    {
      id: "account-management-answer2",
      message:
        "To update your account information, please log into your account and navigate to the profile settings section. You can update your contact details there.",
      trigger: "account-management-options"
    },
    {
      id: "account-management-answer3",
      message:
        "Yes, you can upgrade your internet plan at any time. Simply log into your account on our website or contact our customer service team, and we will assist you with the upgrade process.",
      trigger: "account-management-options"
    },
    {
      id: "account-management-answer4",
      message:
        "If you forget your password, you can reset it by clicking the 'Forgot Password?' link on the login page. Follow the instructions sent to your registered email.",
      trigger: "account-management-options"
    },
    {
      id: "customer-feedback",
      message:
        "We value your feedback! You can provide feedback directly through this chat, or you can fill out a feedback form on our website.",
      trigger: "main-menu"
    },
    {
      id: "multilingual-support",
      message:
        "Yes, our chatbot can assist you in multiple languages. Please select your preferred language, and I will respond accordingly.",
      trigger: "main-menu"
    },
    {
      id: "installation-equipment",
      message: "How can I assist you with Installation and Equipment?",
      trigger: "installation-equipment-options"
    },
    {
      id: "installation-equipment-options",
      options: [
        {
          value: "How long does it take to install internet service?",
          label: "How long does it take to install internet service?",
          trigger: "installation-equipment-answer1"
        },
        {
          value: "What equipment do I need for internet service?",
          label: "What equipment do I need for internet service?",
          trigger: "installation-equipment-answer2"
        },
        {
          value: "What is the installation process for your internet service?",
          label: "What is the installation process for your internet service?",
          trigger: "installation-equipment-answer3"
        },
        {
          value: "Are there any contracts or commitments required for your services?",
          label: "Are there any contracts or commitments required for your services?",
          trigger: "installation-equipment-answer4"
        },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "installation-equipment-answer1",
      message:
        "Installation times can vary based on your location and the type of service. Typically, installations can be completed within a few hours. We’ll schedule a time that works for you.",
      trigger: "installation-equipment-options"
    },
    {
      id: "installation-equipment-answer2",
      message:
        "You will need a modem and a router to connect to the internet. We can provide rental options or recommend compatible devices if you prefer to purchase your own.",
      trigger: "installation-equipment-options"
    },
    {
      id: "installation-equipment-answer3",
      message:
        "The installation process typically involves scheduling an appointment with one of our technicians, who will come to your location to set up the necessary equipment and ensure everything is working properly. The installation usually takes about 1-2 hours.",
      trigger: "installation-equipment-options"
    },
    {
      id: "installation-equipment-answer4",
      message:
        "We offer both contract and no-contract options for our internet services. If you choose a contract, it may come with lower monthly rates. Please let me know if you’d like more details about the options available in your area.",
      trigger: "installation-equipment-options"
    },
    {
      id: "service-availability",
      message: "How can I assist you with Service Availability and Cancellations?",
      trigger: "service-availability-options"
    },
    {
      id: "service-availability-options",
      options: [
        {
          value: "How do I know if your service is available in my area?",
          label: "How do I know if your service is available in my area?",
          trigger: "service-availability-answer1"
        },
        {
          value: "What should I do if I want to cancel my service?",
          label: "What should I do if I want to cancel my service?",
          trigger: "service-availability-answer2"
        },
        {
          value: "Can I pause my internet service temporarily?",
          label: "Can I pause my internet service temporarily?",
          trigger: "service-availability-answer3"
        },
        {
          value: "How can I find out about service outages in my area?",
          label: "How can I find out about service outages in my area?",
          trigger: "service-availability-answer4"
        },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "service-availability-answer1",
      message:
        "You can check service availability by entering your address on our website. Alternatively, I can assist you with that right now!",
      trigger: "service-availability-options"
    },
    {
      id: "service-availability-answer2",
      message:
        "If you wish to cancel your service, please contact our customer support team. They will guide you through the cancellation process and inform you about any final billing or equipment return procedures.",
      trigger: "service-availability-options"
    },
    {
      id: "service-availability-answer3",
      message:
        "Yes, we offer a temporary suspension option for customers who may not need service for a short period. Please contact our customer support team to discuss your options.",
      trigger: "service-availability-options"
    },
    {
      id: "service-availability-answer4",
      message:
        "You can check for service outages by contacting our customer support team. We also provide updates via email and text notifications if you sign up for alerts.",
      trigger: "service-availability-options"
    },
    {
      id: "speed-usage",
      message: "How can I assist you with Speed and Usage?",
      trigger: "speed-usage-options"
    },
    {
      id: "speed-usage-options",
      options: [
        {
          value: "What is the difference between download and upload speeds?",
          label: "What is the difference between download and upload speeds?",
          trigger: "speed-usage-answer1"
        },
        {
          value: "How do I know if my internet speed is fast enough?",
          label: "How do I know if my internet speed is fast enough?",
          trigger: "speed-usage-answer2"
        },
        {
          value: "What is the difference between upload and download speeds?",
          label: "What is the difference between upload and download speeds?",
          trigger: "speed-usage-answer3"
        },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "speed-usage-answer1",
      message:
        "Download speed refers to the rate at which data is transferred from the internet to your device, while upload speed measures the rate at which data is sent from your device to the internet. Download speed is typically more important for activities like streaming videos or downloading files, while upload speed is crucial for video conferencing, online gaming, and uploading content.",
      trigger: "speed-usage-options"
    },
    {
      id: "speed-usage-answer2",
      message:
        "The ideal internet speed for you depends on your household's needs and the number of devices connected. For light usage (browsing, email): 3-10 Mbps, for moderate usage (streaming, online gaming): 10-25 Mbps, and for heavy usage (multiple streams, large file downloads): 25+ Mbps.",
      trigger: "speed-usage-options"
    },
    {
      id: "speed-usage-answer3",
      message:
        "Download speed refers to how quickly data is transferred from the internet to your device, while upload speed measures how quickly data is sent from your device to the internet. Both are important for different online activities.",
      trigger: "speed-usage-options"
    },
    {
      id: "refunds-satisfaction",
      message:
        "We stand behind the quality of our service, but we understand that sometimes things don't go as planned. If you're not satisfied, please contact our customer support team within the first 30 days of service to discuss your options. We'll work with you to resolve any issues or provide a refund if necessary.",
      trigger: "main-menu"
    },
    {
      id: "business-services",
      message:
        "Yes, we offer tailored internet solutions for businesses, including dedicated lines, higher bandwidth options, and business support services. Please let me know if you would like more information.",
      trigger: "main-menu"
    },
    {
      id: "support-contact",
      options: [
        {
          value: "How can I contact customer support?",
          label: "How can I contact customer support?",
          trigger: "support-contact-answer1"
        },
        {
          value: "What types of customer support do you offer?",
          label: "What types of customer support do you offer?",
          trigger: "support-contact-answer2"
        },
        { value: "Back to Main Menu", label: "Back to Main Menu", trigger: "main-menu" }
      ]
    },
    {
      id: "support-contact-answer1",
      message:
        "You can reach our customer support team via phone, email, or live chat on our website. We’re here to help you 24/7",
      trigger: "support-contact"
    },
    {
      id: "support-contact-answer2",
      message:
        "We offer multiple support options, including live chat, phone support, and email assistance. Our support team is available 24/7 to help you with any questions or issues.",
      trigger: "support-contact"
    }
  ]);

  const generateReportFunction = async (startDate, endDate) => {
    let payloadData = {
      role: userInfo().role,
      users: [userId()],
      startDate: startDate,
      endDate: endDate
    };

    try {
      const response = await getUserReport(payloadData).then(res => res.data.data);

      if (response) {
        let tableInfo = {
          createUser: [],
          updateUser: [],
          deleteUser: []
        }
        response.forEach(es => {
          tableInfo.createUser = [...tableInfo.createUser, ...es.userCreate];
          tableInfo.updateUser = [...tableInfo.updateUser, ...es.userModify];
          tableInfo.deleteUser = [...tableInfo.deleteUser, ...es.userDelete];

        })
        const csvdata = formatCsvData(tableInfo)
        setStep1([
          {
            id: "1",
            message: `Download User Mangement Report ${moment(startDate).format("DD-MM-YYYY")} to ${moment(
              endDate
            ).format("DD-MM-YYYY")}`,
            trigger: "download-report"
          },
          {
            id: "download-report",
            component: (
              <>
                {/* <div className="d-flex flex-column"> */}
                {/* <div className="mb-4">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Account Creation</th>
                        <th>Account Deletion</th>
                        <th>Account Modification</th>
                        <th>Last Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvdata.map((row, index) => (
                        <tr key={index}>
                          <td>{row["Account Creation"]}</td>
                          <td>{row["Account Deletion"]}</td>
                          <td>{row["Account Modification"]}</td>
                          <td>{row["Last Action"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
                <div className="d-flex justify-content-between">
                  <div className="mr-4">
                    <CSVLink
                      data={csvdata}
                      filename={`user_report_${moment(startDate).format("DD-MM-YYYY")}_${moment(
                        endDate
                      ).format("DD-MM-YYYY")}.csv`}
                      className="btn btn-primary"
                    >
                      Download Report
                    </CSVLink>
                  </div>
                  <div>
                    <button className="btn btn-primary" onClick={() => mainMenuButtonAction("user")}>
                      Main Menu
                    </button>
                  </div>
                </div>
                {/* </div> */}
              </>
            ), // Default content
            end: true
          }
        ]);
      }
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate the report. Please try again.");
    }
  };
  const mainMenuButtonAction = con => {
    if (con === "user") {
      setStep1([]);
    }
  };
  const handleUserInput = input => {
    const today = new Date();
    let startDate = today;
    let endDate = today;

    const dateRangeRegex = /(\d{2}[-/]\d{2}[-/]\d{4})\s*to\s*(\d{2}[-/]\d{2}[-/]\d{4})/i;
    const matchDateRange = input.match(dateRangeRegex);

    if (matchDateRange) {
      [, startDate, endDate] = matchDateRange;
      startDate = new Date(
        startDate
          .split("-")
          .reverse()
          .join("-")
      );
      endDate = new Date(
        endDate
          .split("-")
          .reverse()
          .join("-")
      );
    } else {
      const durationRegex = /(\d+(\.\d+)?)\s*(day|week|month)/i;
      const matchDuration = input.match(durationRegex);

      if (matchDuration) {
        const [_, durationValue, , durationUnit] = matchDuration;
        const duration = parseFloat(durationValue);

        switch (durationUnit.toLowerCase()) {
          case "day":
          case "days":
            startDate = subDays(today, duration);
            break;
          case "week":
          case "weeks":
            startDate = subDays(today, duration * 7);
            break;
          case "month":
          case "months":
            startDate = subMonths(today, duration);
            break;
          default:
            alert("Invalid duration unit. Please use days, weeks, or months.");
            return;
        }
      } else {
        alert("Invalid input. Please specify a valid date range or duration.");
        return;
      }
    }

    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();
    generateReportFunction(formattedStartDate, formattedEndDate);
  };

  const generateSubscriberReport = async payloadData => {
    let result = await generateReportSubscriber(payloadData)
      .then(res => res.data.data.tabelData)
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
    let exportCSV = result?.map(planName => {
      return {
        "Subscriber Name": planName?.full_name,
        "Plan Type/Category": `${planName?.planDetails?.type}/${planName?.planDetails?.category}`,
        "Source": planName?.connectionStatus,
        "Plan Name": planName?.planDetails?.plan_name,
        "Bill Amount": planName?.planDetails?.amount,
        "Created on": moment(planName?.createdAt).format("DD/MM/YYYY"),
        "Status": planName?.status
      }
    });

    setStep1([
      {
        id: "1",
        message: `Download Subscriber Mangement Report ${moment(payloadData.startDate).format(
          "DD-MM-YYYY"
        )} to ${moment(payloadData.endDate).format("DD-MM-YYYY")}`,
        trigger: "download-report"
      },
      {
        id: "download-report",
        component: (
          <>
            <div className="d-flex justify-content-between">
              <div className="mr-4">
                <CSVLink
                  data={exportCSV}
                  filename={`subscriber_report_${moment(payloadData.startDate).format("DD-MM-YYYY")}_${moment(
                    payloadData.endDate
                  ).format("DD-MM-YYYY")}.csv`}
                  className="btn btn-primary"
                >
                  Download Report
                </CSVLink>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => mainMenuButtonAction("user")}>
                  Main Menu
                </button>
              </div>
            </div>
            {/* </div> */}
          </>
        ), // Default content
        end: true
      }
    ]);
  };

  const generateReportInvoice = async payloadData => {
    let result = await generateInvoiceReport(payloadData)
      .then(res => res.data.data.tabelData)
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
    let exportCSV = result?.map(planName => {
      return {
        "Invoice No": planName?.invoice_no,
        "Created On": moment(planName.createdAt).format("DD/MM/YYYY"),
        "Plan Name": planName?.planInfo?.plan_name,
        "Amount": planName?.invoice_table?.total_amount,
        "Customer Name": planName?.subscriberInfo?.full_nam,
        "Email": planName?.subscriberInfo?.email,
        "Mobile Number": planName?.subscriberInfo?.mobile_number

      }
    });

    setStep1([
      {
        id: "1",
        message: `Download Invoice Mangement Report ${moment(payloadData.startDate).format("DD-MM-YYYY")} to ${moment(
          payloadData.endDate
        ).format("DD-MM-YYYY")}`,
        trigger: "download-report"
      },
      {
        id: "download-report",
        component: (
          <>
            <div className="d-flex justify-content-between">
              <div className="mr-4">
                <CSVLink
                  data={exportCSV}
                  filename={`invoice_report_${moment(payloadData.startDate).format("DD-MM-YYYY")}_${moment(
                    payloadData.endDate
                  ).format("DD-MM-YYYY")}.csv`}
                  className="btn btn-primary"
                >
                  Download Report
                </CSVLink>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => mainMenuButtonAction("user")}>
                  Main Menu
                </button>
              </div>
            </div>
            {/* </div> */}
          </>
        ), // Default content
        end: true
      }
    ]);
  };

  const generateReportHelpDesk = async payloadData => {
    let result = await generateHelpDeskReport(payloadData)
      .then(res => res.data.data.tabelData)
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
    let exportCSV = result.map((issueType) => {
      return {
        "Ticket Id No": issueType?.ticket_id,
        "Source": issueType?.issue_from_website,
        "Status": issueType?.status,
        "Issue Type": issueType?.name,
        "Name": issueType?.already_subscriber,
        "User Type": issueType?.desc.slice(0, 10),
        "Assigned To": issueType?.assignee_name,
        "Priority": issueType?.priority,
        "Created At": moment(issueType?.createdAt)?.format("DD/MMM/YYYY")
      }
    });

    setStep1([
      {
        id: "1",
        message: `Download HelpDesk Mangement Report ${moment(payloadData.startDate).format("DD-MM-YYYY")} to ${moment(
          payloadData.endDate
        ).format("DD-MM-YYYY")}`,
        trigger: "download-report"
      },
      {
        id: "download-report",
        component: (
          <>
            <div className="d-flex justify-content-between">
              <div className="mr-4">
                <CSVLink
                  data={exportCSV}
                  filename={`helpDesk_report_${moment(payloadData.startDate).format("DD-MM-YYYY")}_${moment(
                    payloadData.endDate
                  ).format("DD-MM-YYYY")}.csv`}
                  className="btn btn-primary"
                >
                  Download Report
                </CSVLink>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => mainMenuButtonAction("user")}>
                  Main Menu
                </button>
              </div>
            </div>
            {/* </div> */}
          </>
        ), // Default content
        end: true
      }
    ]);
  };
  function formatCsvData(userData) {
    let csvData = [];

    // Account Creation
    userData.createUser.forEach(user => {
      csvData.push({
        "Member Id": user.member_id,
        "Name": user.name,
        "Role": user.role,
        "Email": user.email,
        "Phone Number": user.phone_number,
        "Last Action": moment(user?.updateAt).format("DD/MM/YYYY"),
        "Action": "Account Creation"
      });
    });

    // Account Modification
    userData.updateUser.forEach(user => {
      csvData.push({
        "Member Id": user.member_id,
        "Name": user.name,
        "Role": user.role,
        "Email": user.email,
        "Phone Number": user.phone_number,
        "Last Action": moment(user?.updateAt).format("DD/MM/YYYY"),
        "Action": "Account Modification"

      });
    });

    // Account Deletion
    userData.deleteUser.forEach(user => {
      csvData.push({
        "Member Id": user.member_id,
        "Name": user.name,
        "Role": user.role,
        "Email": user.email,
        "Phone Number": user.phone_number,
        "Last Action": moment(user?.updateAt).format("DD/MM/YYYY"),
        "Action": "Account Deletion"

      });
    });

    return csvData;
  }
  const generateReportlead = async payloadData => {
    let result = await generateLeadsReport(payloadData)
      .then(res => res.data.data.tabelData)
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
    let exportCSV = result.map(res => {
      return {
        "Source ": res?.connectionStatus ? res?.connectionStatus : "---",
        "Lead Name": res?.full_name,
        "Mobile Number": res?.mobile_number,
        "Account Type": res?.account_type ? res?.account_type : "---",
        "Installation Address": res?.installation_address?.city
          ? `${res.installation_address.city}, ${res.installation_address.state}`
          : "---",
        Status: res?.lead_status,
        "Assigned To": res?.assignee_name,
        "Created on": moment(res?.createdAt).format("DD/MM/YYYY")
      };
    });

    setStep1([
      {
        id: "1",
        message: `Download Lead Mangement Report ${moment(payloadData.startDate).format("DD-MM-YYYY")} to ${moment(
          payloadData.endDate
        ).format("DD-MM-YYYY")}`,
        trigger: "download-report"
      },
      {
        id: "download-report",
        component: (
          <>
            <div className="d-flex justify-content-between">
              <div className="mr-4">
                <CSVLink
                  data={exportCSV}
                  filename={`helpDesk_report_${moment(payloadData.startDate).format("DD-MM-YYYY")}_${moment(
                    payloadData.endDate
                  ).format("DD-MM-YYYY")}.csv`}
                  className="btn btn-primary"
                >
                  Download Report
                </CSVLink>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => mainMenuButtonAction("user")}>
                  Main Menu
                </button>
              </div>
            </div>
            {/* </div> */}
          </>
        ), // Default content
        end: true
      }
    ]);
  };

  const [planName, setPlanName] = useState([]);

  const getPlanData = async () => {
    await getPlanByCreator(userInfo().role === "franchise" ? userInfo()._id : userInfo().isp_id)
      .then(res => {
        setPlanName(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [getAllIssue, setGetAllIssue] = useState([]);
  const getAllDataIssueFunction = async () => {
    await getAllIssueType()
      .then(res => {
        setGetAllIssue(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    getPlanData();
    getAllDataIssueFunction();
  }, []);

  const handleEnd = result => {
    let reportType = result?.steps["Report"]?.value;
    const reporDateType = result?.steps["user-report-input"]?.value;
    let selectedMonth;
    if (reporDateType === "Yearly") {
      selectedMonth = result?.steps["user-year-selection"]?.value;
    } else if (reporDateType === "Monthly") {
      selectedMonth = result?.steps["user-month-selection"]?.value;
    } else {
      selectedMonth = result?.steps["user-quarter-selection"]?.value;
    }

    if (selectedMonth && reporDateType) {
      let dateInfo = getStartandEndData(reporDateType, selectedMonth);
      if (reportType === "User Management") {
        generateReportFunction(dateInfo.startDate, dateInfo.endDate);
      } else if (reportType === "Subscriber Management") {
        let payloadData = {
          type: result?.steps["Subscriber_metrics_type"]?.value,
          plan: planName?.map(eeee => eeee?._id),
          startDate: dateInfo.startDate,
          endDate: dateInfo.endDate,
          category: result?.steps["Subscriber_user_type"]?.value
        };

        generateSubscriberReport(payloadData);
      } else if (reportType === "Invoice Management") {
        let payloadData = {
          type: result?.steps["invoice_type"]?.value,
          plans: planName?.map(eeee => eeee?._id),
          startDate: dateInfo.startDate,
          endDate: dateInfo.endDate
        };
        generateReportInvoice(payloadData);
      } else if (reportType === "Helpdesk Management") {
        let payloadData = {
          issueStatus: result?.steps["Helpdesk_type"]?.value,
          issueType: getAllIssue.map(e => e.issue_type),
          startDate: dateInfo.startDate,
          endDate: dateInfo.endDate
        };

        generateReportHelpDesk(payloadData);
      } else if (reportType === "Leads Management") {
        let payloadData = {
          type: ["new", "converted", "lost"],
          startDate: dateInfo.startDate,
          endDate: dateInfo.endDate
        };

        generateReportlead(payloadData);
      }
    }
  };

  return (
    <div className="mainclass_of_chatbot">
      <button className="toggle-chatbot-button" onClick={toggleChatbot}>
        {isChatbotOpen ? (
          <img src={chatBotImage} width="40px" height="40px" />
        ) : (
          <img src={chatBotImage} width="40px" height="40px" />
        )}
      </button>

      <div className={`chat_boat_sub_div ${isChatbotOpen ? "open" : "close"}`}>
        <ChatBot
          steps={step1.length !== 0 ? step1 : steps}
          handleEnd={handleEnd}
          key={JSON.stringify(step1)}
          botAvatar="https://r2.erweima.ai/imgcompressed/compressed_b45d25e6806765b9fc2c9116ca599737.webp"
          headerComponent={
            <div
              className="d-flex justify-content-between m-2 align-items-center"
              style={{ height: "20px", width: "95%", background: "" }}
            >
              <div className="fs-24 fw-600">Chat</div>
              <div>
                <FaTimes
                  onClick={() => {
                    setIsChatbotOpen(false);
                  }}
                  style={{ fontSize: "25px" }}
                  className="pointer mr-2"
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
