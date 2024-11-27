import {
  AppealsIcon,
  BillingsIcon,
  DashboardIcon,
  EmployeeIcon,
  PropertiesIcon,
  ReportsIcon,
  ScheduleIcon,
  SettingsIcon,
} from "@/assets/Icons";
import { employees, homepage } from "../../routes/paths";
import Clients from "@/assets/Icons/Clients";
import DatePie from "@/assets/Icons/DatePie";
import {
  BetweenVerticalStart,
  KeySquare,
  Receipt,
  Star,
  Upload,
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
    name: "Appeals",
    Icon: <AppealsIcon />,
    url: "/appeals",
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
    Icon: <Receipt className="text-inherit" />,
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
        name: "Permissions",
        Icon: <KeySquare className="text-inherit" />,
        url: "/settings/permissions",
      },
      {
        name: "Appeal Status",
        Icon: <Star className="text-inherit" />,
        url: "/settings/appeal-status",
      },
    ],
  },
];
