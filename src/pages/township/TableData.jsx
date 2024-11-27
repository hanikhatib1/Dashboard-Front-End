import {
  ActiveEmployeeIcon,
  EmployeeCardIcon,
  InactiveEmployee,
} from "@/assets/Icons";
import { useDispatch } from "react-redux";
import { setEditTownshipData } from "@/redux/features/Township";
import { reverseDate } from "@/utiles/revserDate";
import { Pencil } from "lucide-react";

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
    accessorKey: "name",
    header: "Township",
  },
  {
    header: "Re-Assessment",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p className={`${rowData.reassessment ? "" : "text-[#80828E]"}`}>
          {rowData.reassessment ? "Yes" : "No"}
        </p>
      );
    },
  },
  {
    accessorKey: "",
    header: "Assessor Appeal Window ",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p className="text-black">
          <span>
            {rowData.reassessment_notice_date
              ? reverseDate(rowData.reassessment_notice_date)
              : ""}
          </span>
          <span className="text-[#80828E] px-1">-</span>
          <span>
            {rowData.last_file_date ? reverseDate(rowData.last_file_date) : ""}
          </span>
        </p>
      );
    },
  },
  {
    accessorKey: "",
    header: "BOR Appeal Window",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p className="text-black">
          <span>
            {rowData.bor_appeal_begin
              ? reverseDate(rowData.bor_appeal_begin)
              : ""}
          </span>
          <span className="text-[#80828E] px-1">-</span>
          <span>
            {rowData.bor_appeal_end ? reverseDate(rowData.bor_appeal_end) : ""}
          </span>
        </p>
      );
    },
  },
  {
    accessorKey: "after_bor_appeal_end",
    header: "State Appeal Board",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {rowData.after_bor_appeal_end
            ? reverseDate(rowData.after_bor_appeal_end)
            : ""}
        </p>
      );
    },
  },
  {
    accessorKey: "Action",
    cell: ({ row }) => {
      const rowData = row.original;
      const dispatch = useDispatch();

      return (
        <Pencil
          className="cursor-pointer"
          onClick={() => dispatch(setEditTownshipData(rowData))}
        />
      );
    },
  },
];
