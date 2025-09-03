import { Checkbox } from "@/components/ui/checkbox";
import {
  deletePropertiesById,
  deletePropertyDetailsDataById,
  setPropertiesList,
  setPropertyDetails,
  setPropertyDetailsData,
} from "@/redux/features/Properties";
import { formatePin } from "@/utiles/formatePin";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const RowsNumberSelected = 7;

export const comparisonAssessmentsColumns = [
  {
    id: "select",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const { propertiesList, propertyDetailsData, pageCountComparison } =
        useSelector((state) => state.properties);
      const propertiesListFilter = new Set(propertiesList);
      const propertiesListArray = Array.from(propertiesListFilter);
      const isIncluded = propertyDetailsData.includes(row.original.pin);

      useEffect(() => {
        /* if (row.index < RowsNumberSelected && pageCountComparison === 1) {
          row.toggleSelected(!!true);
          dispatch(setPropertiesList(row.original.pin));
          if (!isIncluded)
            dispatch(
              setPropertyDetailsData({
                property: row.original,
                index: row.index,
              })
            );
        } */
      }, []);

      return (
        <Checkbox
          checked={
            row.index === 0
              ? true
              : propertiesListArray.includes(row.original.pin)
          }
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value) {
              dispatch(setPropertiesList(row.original.pin));
              if (!isIncluded)
                dispatch(
                  setPropertyDetailsData({
                    property: row.original,
                    index: row.index,
                  })
                );
            } else {
              dispatch(deletePropertiesById(row.original.pin));
              dispatch(deletePropertyDetailsDataById(row.original.pin));
            }
          }}
          aria-label="Select row"
          className={`border-primary rounded-[4px] ${
            row.index === 0
              ? "bg-primary text-white"
              : propertiesListArray.includes(row.original.pin)
                ? "bg-primary text-white"
                : ""
          } `}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    header: "Market Value",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p className="capitalize">
          $ {rowData?.market_value && rowData?.market_value.toLocaleString()}
        </p>
      );
    },
  },
  {
    header: "Address",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p className="capitalize">{rowData.property_address}</p>;
    },
  },
  {
    header: "Score",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p>{rowData.score}</p>;
    },
  },
  {
    header: "OVACLS",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p className="capitalize max-w-[230px]">
          {rowData.ovacls}
        </p>
      );
    },
  },
  {
    accessorKey: "exterior",
    header: "Exterior",
  },
  {
    accessorKey: "basement",
    header: "Basement",
  },
  {
    accessorKey: "bathrooms",
    header: "Bathroom",
  },
  {
    accessorKey: "land_assm",
    header: "Building Assessment",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {rowData.building_ratio && rowData.building_ratio.toLocaleString()}
        </p>
      );
    },
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "building_sq_ft",
    header: "Building Size",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>
          {rowData.building_sq_ft && rowData.building_sq_ft.toLocaleString()}
        </p>
      );
    },
  },
  {
    accessorKey: "distance",
    header: "Distance",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>{rowData.distance && rowData.distance.toLocaleString()} Miles</p>
      );
    },
  },
  {
    accessorKey: "View Details",
    header: "",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const rowData = row.original;
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => dispatch(setPropertyDetails(rowData))}
        >
          <span className="text-[#80838E] text-body">View Details</span>
          <ChevronDown color="#80838E" />
        </button>
      );
    },
  },
];

export const comparisonSalesColumns = [
  {
    id: "select",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const { propertiesList, propertyDetailsData } = useSelector(
        (state) => state.properties
      );
      const propertiesListFilter = new Set(propertiesList);
      const propertiesListArray = Array.from(propertiesListFilter);
      const isIncluded = propertyDetailsData.includes(row.original.pin);

      useEffect(() => {
        if (row.index < RowsNumberSelected) {
          row.toggleSelected(!!true);
          console.log(row.index);
          dispatch(setPropertiesList(row.original.pin));
          if (!isIncluded)
            dispatch(
              setPropertyDetailsData({
                property: row.original,
                index: row.index,
              })
            );
        }
      }, []);

      return (
        <Checkbox
          checked={propertiesListArray.includes(row.original.pin)}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value) {
              dispatch(setPropertiesList(row.original.pin));
              if (!isIncluded)
                dispatch(
                  setPropertyDetailsData({
                    property: row.original,
                    index: row.index,
                  })
                );
            } else {
              dispatch(deletePropertiesById(row.original.pin));
              dispatch(deletePropertyDetailsDataById(row.original.pin));
            }
          }}
          aria-label="Select row"
          className={`border-primary rounded-[4px] ${
            propertiesListArray.includes(row.original.pin)
              ? "bg-primary text-white "
              : ""
          } `}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Pin",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p className="capitalize">{formatePin(rowData.pin)}</p>;
    },
  },
  {
    header: "Address",
    cell: ({ row }) => {
      const rowData = row.original;
      return <p className="capitalize">{rowData.property_address}</p>;
    },
  },
  {
    accessorKey: "sale_price",
    header: "Sales Price",
  },
  {
    accessorKey: "executed",
    header: "Executed",
  },
  {
    accessorKey: "seller",
    header: "Seller",
  },
  {
    accessorKey: "buyer",
    header: "Buyer",
  },
  {
    accessorKey: "distance",
    header: "Distance",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <p>{rowData.distance && rowData.distance.toLocaleString()} Miles</p>
      );
    },
  },
  {
    accessorKey: "View Details",
    header: "",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const rowData = row.original;
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => dispatch(setPropertyDetails(rowData))}
        >
          <span className="text-[#80838E] text-body">View Details</span>
          <ChevronDown color="#80838E" />
        </button>
      );
    },
  },
];
