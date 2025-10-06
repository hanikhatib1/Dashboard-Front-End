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
  setCanceledAppeal,
  setDeleteAppealData,
  setDocumentsStatusAppealModel,
  setEditAppealData,
  setFormsAppeal,
  setFormsAppealArray,
  setLastAppealIdUpdated,
} from "@/redux/features/AppealSlice";
import { reverseDate } from "@/utiles/revserDate";
import { MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Fill_Form_Client from "./PDFs/Fill_Form_Client";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import AppealStatusSelect from "./AppealStatusSelect";
import { useEffect, useState } from "react";
import { useUpdateAppealMutation } from "@/redux/apiSlice";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";

export const appealsColumns = [
  // add check box
  {
    id: "select",
    /* header: ({ table }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          className="cursor-pointer"
          onChange={table.getToggleAllRowsSelectedHandler()}
          checked={table.getIsAllRowsSelected()}
        />
      </div>
    ), */
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const { formsAppealArray } = useSelector((state) => state.appeals);

      return (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="cursor-pointer"
            disabled={row.original.signature_sent}
            checked={formsAppealArray.find((v) => v.id === row.original.id)}
            onChange={() => {
              const newFormsAppeal = [...formsAppealArray];
              if (newFormsAppeal.find((v) => v.id === row.original.id)) {
                // If the appeal is already selected, remove it
                const updatedFormsAppeal = newFormsAppeal.filter(
                  (v) => v.id !== row.original.id
                );
                dispatch(setFormsAppealArray(updatedFormsAppeal));
              } else {
                newFormsAppeal.push(row.original);
                dispatch(setFormsAppealArray(newFormsAppeal));
              }
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "appeal_number",
    header: "ID",
    cell: ({ row }) => {
      return (
        <p>{row.original.appeal_number ? row.original.appeal_number : "N/A"}</p>
      );
    },
  },
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
      const [updateAppeal, { isLoading }] = useUpdateAppealMutation();
      const [status, setStatus] = useState(row.original.appeal_status);
      const dispatch = useDispatch();

      const handleUpdateStatus = async (val) => {
        const defaultValue = {
          ccoa: "",
          bor: "",
          sa: "",
          lour: "",
          ran: null,
          sq: null,
          an: null,
          deleted_ccoa: "",
          deleted_bor: "",
          deleted_sa: "",
          deleted_lour: "",
          deleted_ran: "",
          deleted_sq: "",
          deleted_an: "",
          note: row.original.note ? row.original.note : "",
          appeal_status_id: val,
          appeal_number: row.original?.appeal_number
            ? row.original?.appeal_number
            : "",
        };
        const formData = new FormData();
        Object.keys(defaultValue).forEach((key) => {
          formData.append(key, defaultValue[key]);
        });
        if (val === 7) {
          dispatch(
            setCanceledAppeal({
              id: row.original.id,
              body: defaultValue,
            })
          );
        } else {
          const res = await updateAppeal({
            id: row.original.id,
            body: formData,
          });
          if ("data" in res) {
            toast({
              title: "Success",
              description: "Status updated successfully",
              variant: "success",
            });
            dispatch(
              setLastAppealIdUpdated(`${row.original.id}-${Date.now()}`)
            );
          } else {
            toast({
              title: "Error",
              description: res.error.data?.detail || "Failed to update status",
              variant: "destructive",
            });
          }
        }
      };

      useEffect(() => {
        setStatus(row.original.appeal_status);
      }, [row.original.appeal_status.status]);

      return (
        <div className="[&>div]:w-full flex flex-col justify-center gap-1">
          {/*  <span className="text-[#4693D6]">
            {row.original.appeal_status.status}
          </span> */}
          {isLoading ? (
            <Loader />
          ) : (
            <AppealStatusSelect
              status={status}
              setStatus={setStatus}
              setValue={(key, val) => handleUpdateStatus(val)}
              keyOfValue="appeal_status_id"
              showStatusKeyword={false}
            />
          )}
          <span className="text-red-600">{row?.original?.cancel_reason}</span>
        </div>
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
    header: "Phone Number",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span>{formatPhoneNumber(row.original.client_phone)}</span>
        </div>
      );
    },
  },
  {
    header: "Signature Status",
    cell: ({ row }) => {
      const dispatch = useDispatch();

      return (
        <button
          disabled={!row.original.signature_sent}
          className={`px-4 py-2 rounded-[8px] ml-3 cursor-pointer bg-[#1A73E833] ${!row.original.signature_sent ? "text-[#80838E] !cursor-not-allowed" : ""}`}
          onClick={() => dispatch(setDocumentsStatusAppealModel(row.original))}
        >
          Signature Status
        </button>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();

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
              onClick={() => navigate(`/appeals/${row.original.id}`)}
            >
              All Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer"
              onClick={() => dispatch(setEditAppealData(row.original))}
            >
              Edit
            </DropdownMenuItem>

            {/* <DropdownMenuItem
              className={` cursor-pointer ${row.original.signature_sent ? "text-[#80838E] cursor-not-allowed" : " hover:bg-slate-100"}`}
              onClick={() =>
                !row.original.signature_sent &&
                dispatch(setFormsAppeal(row.original))
              }
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
            </DropdownMenuItem> */}
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
