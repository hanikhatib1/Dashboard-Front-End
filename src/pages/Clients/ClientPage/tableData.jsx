import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  addAppealToInvoice,
  setAppealInvoiceDetails,
  setDeleteAppealData,
  setDocumentsStatusAppealModel,
  setEditAppealData,
  setFormsAppeal,
} from "@/redux/features/AppealSlice";
import { formatePin } from "@/utiles/formatePin";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";

export const clientAppealColumns = [
  {
    header: "Pins",
    cell: ({ row }) => (
      <div>
        <p>{formatePin(row.original.pin1)}</p>
        <p>{row.original.pin2 ? formatePin(row.original.pin2) : ""}</p>
        <p>{row.original.pin3 ? formatePin(row.original.pin3) : ""}</p>
      </div>
    ),
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Status",
    accessorKey: "appeal_status.status",
  },
  {
    header: "Notes",
    accessorKey: "note",
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
    header: "Files",
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
              className="hover:bg-slate-100 cursor-pointer"
              onClick={() => dispatch(setFormsAppeal(row.original))}
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
{/* <div
  className="flex gap-1 justify-center items-center cursor-pointer"
  onClick={() => dispatch(setEditAppealData(row.original))}
>
  <span className="text-[#80838E] text-[16px]">View File</span>
  <ChevronDown color="#80838E" />
</div>; */}
