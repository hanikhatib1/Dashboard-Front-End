import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addAppealToInvoice,
  setAppealInvoiceDetails,
  setDeleteAppealData,
  setDocumentsStatusAppealModel,
  setEditAppealData,
  setFormsAppeal,
} from "@/redux/features/AppealSlice";
import { reverseDate } from "@/utiles/revserDate";
import { MoreHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Fill_Form_Client from "./PDFs/Fill_Form_Client";

export const appealsColumns = [
  {
    accessorKey: "client_first_name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link
          to={`/clients/${row.original.client_id}`}
          className="flex items-center gap-2 hover:underline"
        >
          <span>{`${row.original.client_first_name} ${row.original.client_last_name}`}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      return (
        <Link
          to={`/properties/${row.original.pin1}`}
          className="flex items-center gap-2 max-w-[180px] text-[14px] hover:underline"
        >
          <span>{row.original.address}</span>
        </Link>
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      return (
        <span className="text-[#4693D6]">
          {row.original.appeal_status.status}
        </span>
      );
    },
  },
  {
    header: "Township",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span>{row.original.township.name}</span>
        </div>
      );
    },
  },
  {
    header: "Assessor Appeal Date",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span>
            {`${reverseDate(row.original.reassessment_notice_date)} -
              ${reverseDate(row.original.last_file_date)}`}
          </span>
        </div>
      );
    },
  },
  {
    header: "Last Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span>{reverseDate(row.original.last_update)}</span>
        </div>
      );
    },
  },
  {
    header: "Signature Sent",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span>{row.original.signature_sent ? "Yes" : "No"}</span>
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
              onClick={() => dispatch(setEditAppealData(row.original))}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer"
              onClick={() => dispatch(addAppealToInvoice(row.original))}
            >
              Invoice
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer"
              onClick={() => dispatch(setAppealInvoiceDetails(row.original))}
            >
              View Invoices
            </DropdownMenuItem>
            <DropdownMenuItem
              className={` cursor-pointer ${row.original.signature_sent ? "text-[#80838E] cursor-not-allowed" : " hover:bg-slate-100"}`}
              onClick={() => !row.original.signature_sent && dispatch(setFormsAppeal(row.original))}
            >
              Send Forms
            </DropdownMenuItem>
            <DropdownMenuItem
              className={` cursor-pointer ${!row.original.signature_sent ? "text-[#80838E] cursor-not-allowed" : " hover:bg-slate-100"}`}
              onClick={() =>
                row.original.signature_sent &&
                dispatch(setDocumentsStatusAppealModel(row.original))
              }
            >
              Signature Status
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer text-red-500"
              onClick={() => dispatch(setDeleteAppealData(row.original))}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
