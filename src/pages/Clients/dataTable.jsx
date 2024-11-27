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
import { useDeleteClientMutation } from "@/redux/apiSlice";
import { useDispatch } from "react-redux";
import { deleteClientById, setEditClientData } from "@/redux/features/Clients";
import { useToast } from "@/components/ui/use-toast";
import { reverseDate } from "@/utiles/revserDate";
import { useNavigate } from "react-router-dom";
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
  /*  {
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        className={`${
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
            ? "bg-primary"
            : ""
        } text-white rounded-[4px]`}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className={`${
          row.getIsSelected() ? "bg-primary" : ""
        }  text-white rounded-[4px]`}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  }, */
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
  /*  {
    header: "Property Count",
    cell: ({ row }) => (
      <div className="bg-[#53ABF933] w-[40px] h-[40px] rounded-[8px] flex justify-center items-center">
        <p className="text-center">{row.original.property_count}</p>
      </div>
    ),
  }, */
  /*  {
    accessorKey: "address",
    header: "Property Locations",
    cell: ({ row }) => {
      const properties = row.original.properties;
      return (
        <div className="flex flex-col justify-center items-center">
          {properties.map((property) => (
            <p key={property.id} className="text-center">
              {property.address}
            </p>
          ))}
        </div>
      );
    },
  }, */
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
      const { toast } = useToast();
      const [deleteClient] = useDeleteClientMutation();
      const navigate = useNavigate();
      const deleteEmployeeHandler = async () => {
        const res = await deleteClient(rowData.id);
        if ("data" in res) {
          dispatch(deleteClientById(rowData.id));
          toast({
            title: "Client Deleted",
            message: "Client Deleted Successfully",
            type: "success",
          });
        } else
          toast({
            title: "Error",
            type: "error",
          });
      };

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
              onClick={deleteEmployeeHandler}
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
