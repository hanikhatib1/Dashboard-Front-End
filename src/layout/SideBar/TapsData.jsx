import {
  AppealsIcon,
  EmployeeIcon,
  PropertiesIcon,
  ScheduleIcon,
  SettingsIcon,
} from "@/assets/Icons";
import { employees } from "../../routes/paths";
import Clients from "@/assets/Icons/Clients";
import DatePie from "@/assets/Icons/DatePie";
import {
  BetweenVerticalStart,
  BookOpen,
  ClipboardPlus,
  Contact,
  KeySquare,
  Receipt,
  Star,
  Upload,
  Users,
  FileQuestionMark,
  LampDesk,
  Link,
} from "lucide-react";

export const TapsData = [
  /* {
    name: "Dashboard",
    Icon: <DashboardIcon />,
    url: homepage.index,
  }, */
  {
    name: "Employee",
    Icon: <EmployeeIcon />,
    url: employees.index,
  },
  {
    name: "Clients",
    Icon: <Clients />,
    url: "/clients",
  },
  {
    name: "Properties",
    Icon: <PropertiesIcon />,
    url: "/properties",
  },
  {
    name: "Residential Appeals",
    Icon: <AppealsIcon />,
    url: "/residential_appeals",
  },
  {
    name: "Commercial Appeals",
    Icon: <LampDesk />,
    url: "/commercial_appeals",
  },
  /* {
    name: "Exemptions",
    Icon: <PropertiesIcon />,
    url: "/exemptions",
  }, */
  /* {
    name: "Reports",
    Icon: <ReportsIcon />,
    url: "/reports",
  }, */
  {
    name: "Township",
    Icon: <ScheduleIcon />,
    url: "/township",
  },
  {
    name: "Invoices",
    Icon: <Receipt color="currentColor" />,
    url: "/invoices",
  },
  {
    name: "Data Script",
    Icon: <DatePie />,
    children: [
      {
        name: "Import Data Script",
        Icon: <Upload className="text-inherit" />,
        url: "/data-script/import-data-script",
      },
      {
        name: "Actions",
        Icon: <BetweenVerticalStart className="text-inherit" />,
        url: "/data-script/actions",
      },
    ],
  },
  {
    name: "Settings",
    Icon: <SettingsIcon />,
    url: "/settings",
    children: [
      {
        name: "Blogs",
        Icon: <BookOpen color="currentColor" />,
        url: "/settings/blogs",
      },
      {
        name: "Workers",
        Icon: <Users color="currentColor" />,
        url: "/settings/workers",
      },
      {
        name: "Contact Us",
        Icon: <Contact />,
        url: "/settings/contact-us",
      },
      {
        name: "Reports",
        Icon: <ClipboardPlus />,
        url: "/settings/reports",
      },
      {
        name: "Permissions",
        Icon: <KeySquare className="text-inherit" />,
        url: "/settings/permissions",
      },
      {
        name: "Appeal Status",
        Icon: <Star className="text-inherit" />,
        url: "/settings/appeal-status",
      },
      {
        name: "FAQs",
        Icon: <FileQuestionMark className="text-inherit" />,
        url: "/settings/faqs",
      },
    ],
  },
  {
    name: "Assets",
    Icon: <Link />,
    children: [
      {
        name: "Board of Review",
        Icon: null,
        url: "https://appeals.cookcountyboardofreview.com/Account/LoginPage",
        target: "_blank",
      },
      {
        name: "Cook Counrty Assessor",
        Icon: null,
        url: "https://propertytaxfilings.cookcountyil.gov/",
        target: "_blank",
      },
      {
        name: "Cook County Data Store",
        Icon: null,
        url: "https://data.cookcountyassessoril.gov/",
        target: "_blank",
      },
      {
        name: "Cook County Dates",
        Icon: null,
        url: "https://www.cookcountyassessoril.gov/assessment-calendar-and-deadlines",
        target: "_blank",
      },
      {
        name: "Board of Review Dates",
        Icon: null,
        url: "https://www.cookcountyboardofreview.com/dates-and-deadlines",
        target: "_blank",
      },
    ],
  },
];
