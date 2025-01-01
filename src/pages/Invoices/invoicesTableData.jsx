import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  setDeleteInvoiceData,
  setEditInvoiceData,
} from "@/redux/features/Invoices";
import { formattedNumber } from "@/utiles/formattedNumber";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export const invoicesTableData = [
  {
    accessorKey: "actual_saving",
    header: "Actual Saving",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 max-w-[180px] text-[14px]">
          <span>$ {formattedNumber(row.original.actual_saving)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "invoice_amount",
    header: "Invoice Amount",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 max-w-[180px] text-[14px]">
          <span>$ {formattedNumber(row.original.invoice_amount)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "payed",
    header: "Payed",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 max-w-[180px] text-[14px]">
          <span>{row.original.payed ? "Yes" : "No"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "document",
    header: "Payed",
    cell: ({ row }) => {
      return (
        <Link to={row.original.document} target="_blank" className="flex items-center underline gap-2 max-w-[180px] text-[14px]">
          Document
        </Link>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 max-w-[180px] text-[14px]">
          <span>{format(row.original.date, "MM-dd-yyyy")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
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
              onClick={() => dispatch(setEditInvoiceData(row.original))}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer text-red-500"
              onClick={() => dispatch(setDeleteInvoiceData(row.original))}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
