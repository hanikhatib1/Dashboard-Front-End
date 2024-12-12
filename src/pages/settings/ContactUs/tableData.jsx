import { setReplayContactData } from "@/redux/features/ContactUs";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import { useDispatch } from "react-redux";

export const columns = [
  {
    accessorKey: "full_name",
    header: "Name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <p>{formatPhoneNumber(row.original.phone)}</p>;
    },
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    id: "Reply",
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;
      const dispatch = useDispatch();

      return (
        <button
          onClick={() => dispatch(setReplayContactData(rowData))}
          className="text-primary border border-primary rounded-[8px] px-4 py-2"
        >
          View
        </button>
      );
    },
  },
];
