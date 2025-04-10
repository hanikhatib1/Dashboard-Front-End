import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import { reverseDate } from "@/utiles/revserDate";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  setEditPurchaseProperty,
  steDeletePurchaseProperty,
} from "@/redux/features/Properties";
import { useDispatch } from "react-redux";

const currentYear = new Date().getFullYear();

export const appealDatesColumns = [
  {
    header: "Assessors Appeal Close Date ",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {rowData.last_file_date ? reverseDate(rowData.last_file_date) : ""}
        </p>
      );
    },
  },
  {
    header: "BOR Appeal Opens",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {rowData.bor_appeal_begin
            ? reverseDate(rowData.bor_appeal_begin)
            : ""}
        </p>
      );
    },
  },
  {
    header: "BOR Appeal Closes",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>{reverseDate(rowData.bor_appeal_end)}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Township",
  },
];

export const purchaseDetailsColumns = [
  {
    header: "Purchase Date",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>{rowData.purchase_date}</p>;
    },
  },
  {
    header: "Purchase Price",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.purchase_price.toLocaleString()}</p>;
    },
  },
  {
    accessorKey: "type_of_deed",
    header: "Type  of Deed",
  },
  {
    accessorKey: "buyer_name",
    header: "Buyers Name",
  },
  {
    accessorKey: "seller_Name",
    header: "Seller's Name ",
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
              onClick={() => dispatch(setEditPurchaseProperty(rowData))}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => dispatch(steDeletePurchaseProperty(rowData))}
              className="text-red-500 cursor-pointer hover:bg-slate-100"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const detailRecordsColumns = [
  {
    header: "Total",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.total.toLocaleString()}</p>;
    },
  },
  {
    header: "Land Average Per Square Foot",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.building_square_feet.toLocaleString()}</p>;
    },
  },
  {
    accessorKey: "ovacls",
    header: "Ovacals",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.ovacls.toLocaleString()}</p>;
    },
  },
  {
    accessorKey: "building_square_foot",
    header: "Building Square Foot",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.building_square_foot.toLocaleString()}</p>;
    },
  },
  {
    accessorKey: "land_assessed_value",
    header: "Land Assesses Value",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.land_assessed_value.toLocaleString()}</p>;
    },
  },
  {
    header: "Land MV",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.land_value.toLocaleString()}</p>;
    },
  },
  {
    accessorKey: "land_square_foot",
    header: "Land Square Foot",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.land_square_foot.toLocaleString()}</p>;
    },
  },
];

export const exemptionsColumns = [
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    header: "Homeowner",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.homeowner_exemption}</p>;
    },
  },
  {
    accessorKey: "senior_exemption",
    header: "Senior",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.senior_exemption}</p>;
    },
  },
  {
    accessorKey: "senior_freeze",
    header: "Senior Freeze",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.senior_freeze}</p>;
    },
  },
  {
    accessorKey: "disabled_persons",
    header: "Disabled Person",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.disabled_persons}</p>;
    },
  },
  {
    header: "Disabled Veterans",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>$ {rowData.disabled_veteran}</p>;
    },
  },
];

export const descriptionColumns = [
  {
    accessorKey: "key",
    header: "",
    cell: ({ row }) => {
      const rowData = row.original;
      const title = rowData.key.split("_").join(" ");
      return <p className="capitalize">{title}</p>;
    },
  },
  {
    accessorKey: "value",
    header: "",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p className="capitalize">{rowData.value}</p>;
    },
  },
];

export const taxColumns = [
  {
    header: "Description",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p className="capitalize">{rowData.category.split("_").join(" ")}</p>
      );
    },
  },
  {
    accessorKey: "estimated_value",
    header: `Estimated Taxes ${currentYear + 1}`,
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {rowData.category === "local_tax_rate"
            ? `${rowData.estimated_value.toLocaleString()} %`
            : rowData.category === "state_equalizer"
              ? rowData.estimated_value
              : `$ ${rowData.estimated_value.toLocaleString()}`}
        </p>
      );
    },
  },
  {
    accessorKey: "current_value",
    header: `Estimated Taxes ${currentYear}`,
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {" "}
          {rowData.category === "local_tax_rate"
            ? `${rowData.current_value.toLocaleString()} %`
            : rowData.category === "state_equalizer"
              ? rowData.current_value
              : `$ ${rowData.current_value.toLocaleString()}`}
        </p>
      );
    },
  },
  {
    accessorKey: "prior_value",
    header: `${currentYear - 2} Payable in ${currentYear - 1}`,
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {" "}
          {rowData.category === "local_tax_rate"
            ? `${rowData.prior_value.toLocaleString()} %`
            : rowData.category === "state_equalizer"
              ? rowData.prior_value
              : `$ ${rowData.prior_value.toLocaleString()}`}
        </p>
      );
    },
  },
  {
    accessorKey: "yoy_change",
    header: "Y/Y change",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {rowData.category === "state_equalizer"
            ? rowData.yoy_change
            : `${rowData.yoy_change} %`}
        </p>
      );
    },
  },
  {
    accessorKey: "estimated_change",
    header: "Estimated Change",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {" "}
          {rowData.category === "local_tax_rate"
            ? `${rowData.prior_value.toLocaleString()} %`
            : rowData.category === "state_equalizer"
              ? rowData.prior_value
              : `$ ${rowData.prior_value.toLocaleString()}`}
        </p>
      );
    },
  },
];

export const documentsColumns = [
  {
    header: "Client Name",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p className="capitalize">{rowData.client_first_name}</p>;
    },
  },
  {
    header: "Client Phone",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p className="capitalize">{formatPhoneNumber(rowData.client_phone)}</p>
      );
    },
  },
  {
    header: "Date",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p className="capitalize">{reverseDate(rowData.created_at)}</p>;
    },
  },
  {
    header: "CCOA",
    cell: ({ row }) => {
      const rowData = row.original;
      const hasLink = rowData.ccoa;
      return hasLink ? (
        <Link
          to={rowData.ccoa.link}
          target="_blank"
          className="capitalize underline"
        >
          Show PDF
        </Link>
      ) : (
        "N/A"
      );
    },
  },
  {
    header: "BOR",
    cell: ({ row }) => {
      const rowData = row.original;
      const hasLink = rowData.bor;
      return hasLink ? (
        <Link
          to={rowData.bor.link}
          target="_blank"
          className="capitalize underline"
        >
          Show PDF
        </Link>
      ) : (
        "N/A"
      );
    },
  },
  {
    header: "Representation Agreement",
    cell: ({ row }) => {
      const rowData = row.original;
      const hasLink = rowData.sa;
      return hasLink ? (
        <Link
          to={rowData.sa.link}
          target="_blank"
          className="capitalize underline"
        >
          Show PDF
        </Link>
      ) : (
        "N/A"
      );
    },
  },
  {
    header: "Report",
    cell: ({ row }) => {
      const rowData = row.original;
      const hasLink = rowData.lour;
      return hasLink ? (
        <Link
          to={rowData.lour.link}
          target="_blank"
          className="capitalize underline"
        >
          Show PDF
        </Link>
      ) : (
        "N/A"
      );
    },
  },
  {
    header: "Residential Appeal Narrative",
    cell: ({ row }) => {
      const rowData = row.original;
      const hasLink = rowData.ran;
      return hasLink ? (
        <Link
          to={rowData.ran.link}
          target="_blank"
          className="capitalize underline"
        >
          Show PDF
        </Link>
      ) : (
        "N/A"
      );
    },
  },
  {
    header: "Sales Questionnaire",
    cell: ({ row }) => {
      const rowData = row.original;
      const hasLink = rowData.sq;
      return hasLink ? (
        <Link
          to={rowData.sq.link}
          target="_blank"
          className="capitalize underline"
        >
          Show PDF
        </Link>
      ) : (
        "N/A"
      );
    },
  },
];
