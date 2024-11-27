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
import { useDeleteEmployeeMutation } from "@/redux/apiSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import {
  deleteEmployeeById,
  setEditEmployeeData,
} from "@/redux/features/Employee";

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
    name: "Ahmed",
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    name: "Ahmed",
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    name: "Ahmed",
    id: "728ed52g",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    name: "Ahmed",
    id: "489e1d4d",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    name: "Ahmed",
    id: "728ed52s",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    name: "Ahmed",
    id: "489e1d4a",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    name: "Ahmed ss",
    id: "489e1d4r",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    name: "Ahmed",
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    name: "Ahmed",
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    name: "Ahmed",
    id: "728ed52g",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    name: "Ahmed",
    id: "489e1d4d",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    name: "Ahmed",
    id: "728ed52s",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    name: "Ahmed",
    id: "489e1d4a",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    name: "Ahmed ss",
    id: "489e1d4r",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
];

export const columns = [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>{rowData.active ? "Active" : "Inactive"}</p>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;
      const [deleteEmployee] = useDeleteEmployeeMutation();
      const dispatch = useDispatch();
      const { toast } = useToast();
      const deleteEmployeeHandler = async () => {
        const res = await deleteEmployee(rowData.id);
        if ("data" in res) {
          deleteEmployeeById(rowData.id);
          toast({
            title: "Employee Deleted",
            message: "Employee Deleted Successfully",
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
              onClick={() => dispatch(setEditEmployeeData(rowData))}
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
