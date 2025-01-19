import {
  ActiveEmployeeIcon,
  EmployeeCardIcon,
  InactiveEmployee,
} from "@/assets/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  setDeleteClientData,
  setEditClientData,
} from "@/redux/features/Clients";
import { reverseDate } from "@/utiles/revserDate";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";

export const mockData = [
  {
    title: "Total Employee",
    count: "20",
    Icon: <EmployeeCardIcon />,
    value: "total",
  },
  {
    title: "Active Employee",
    count: "15",
    Icon: <ActiveEmployeeIcon />,
    value: "active",
  },
  {
    title: "Inactive Employee ",
    count: "5",
    Icon: <InactiveEmployee />,
    value: "inactive",
  },
];
export const tableData = [
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
  {
    id: "728ed52f",
    client_name: "Sara Mohamed ",
    contact_information: 7777 - 222 - 3333,
    property_count: "1",
    property_locations: "Palos, Cook, IL",
    added_date: "2022-01-01",
  },
];

export const columns = [
  {
    accessorKey: "first_name",
    header: "Client Name ",
    cell: ({ row }) => {
      return (
        <p>
          {row.original.first_name} {row.original.last_name}
        </p>
      );
    },
  },
  {
    header: "Contact Information",
    cell: ({ row }) => {
      return (
        <>
          <p>{formatPhoneNumber(row.original?.phone)}</p>
          <p className="text-[#80838E]">{row.original.email}</p>
        </>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Added Date ",
    cell: ({ row }) => {
      return <p>{reverseDate(row.original.start_date)}</p>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;
      const dispatch = useDispatch();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="!bg-white min-w-[180px]">
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer"
              onClick={() => navigate(`/clients/${rowData.id}`)}
            >
              All Details{" "}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer"
              onClick={() => dispatch(setEditClientData(rowData))}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => dispatch(setDeleteClientData(rowData))}
              className="hover:bg-slate-100 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
