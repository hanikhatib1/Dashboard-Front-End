import { Button } from "@/components/ui/button";
import { useState } from "react";
import PropertiesTable from "./Table";
import {
  appealDatesColumns,
  AppealHistoryColumns,
  descriptionColumns,
  detailRecordsColumns,
  documentsColumns,
  exemptionsColumns,
  propertyTaxBillHistoryColumns,
  purchaseDetailsColumns,
  taxColumns,
} from "./TablesData";
import { Link } from "react-router-dom";
import EditPropertySale from "./EditPropertySale";
import { useSelector } from "react-redux";
import DeletePropertySale from "./DeletePropertySale";
import { useGetPropertyListHistoryMutation } from "@/redux/apiSlice";
import Loader from "@/components/Loader";

const statusData = [
  {
    name: "Appeal Dates",
    key: "appeal_dates",
    columns: appealDatesColumns,
    hasPagination: false,
    isArray: false,
  },
  {
    name: "Description",
    key: "description",
    columns: descriptionColumns,
    hasPagination: false,
    isArray: true,
  },
  {
    name: "Purchase Details",
    key: "purchase_details",
    columns: purchaseDetailsColumns,
    hasPagination: false,
    isArray: true,
  },
  {
    name: "Tax Statistics",
    key: "tax_statistics",
    columns: taxColumns,
    hasPagination: false,
    isArray: true,
  },
  {
    name: "Detail Records",
    key: "detail_records",
    columns: detailRecordsColumns,
    hasPagination: false,
    isArray: false,
  },
  {
    name: "Exemptions",
    key: "exemption",
    columns: exemptionsColumns,
    hasPagination: false,
    isArray: true,
  },
  {
    name: "Appeal History",
    key: "appeal_history",
    columns: AppealHistoryColumns,
    hasPagination: false,
    isArray: true,
  },
  {
    name: "Documents",
    key: "documents",
    columns: documentsColumns,
    hasPagination: false,
    isArray: true,
  },
  {
    name: "20-Year Property Tax Bill History",
    key: "property-tax-bill-history",
    columns: propertyTaxBillHistoryColumns,
    hasPagination: false,
    isArray: true,
  },
  {
    name: "Comparison",
    key: "Comparison",
    columns: [],
    hasPagination: false,
    isArray: false,
  },
];

const formateDescription = (description) =>
  Object.keys(description).map((key) => ({ key, value: description[key] }));

const Details = (data) => {
  const [status, setStatus] = useState(statusData[0]);
  const [getPropertyListHistory, { isLoading, isError, data: historyData }] =
    useGetPropertyListHistoryMutation();
  const { editPurchaseProperty, deletePurchaseProperty } = useSelector(
    (state) => state.properties
  );

  const handleFetchPropertyListHistory = async () => {
    try {
      const result = await getPropertyListHistory(data.data.pin).unwrap();
      console.log("Property List History:", result);
    } catch (error) {
      console.error("Failed to fetch property list history:", error);
    }
  };

  return (
    <div className="border rounded-[8px] bg-white border-gray-200 flex flex-col gap-2">
      <div className="flex gap-4 px-4 py-2 overflow-scroll">
        {statusData.map((item) =>
          item.key === "Comparison" ? (
            <Link
              key={item.key}
              to={`/properties/${data.data.pin}/comparison`}
              className={`p-0 flex-1 bg-white hover:bg-transparent flex gap-1 w-max items-center `}
            >
              <span>{item.name}</span>
            </Link>
          ) : (
            <Button
              key={item.key}
              className={`text-heading_2 flex-1 p-0 bg-white hover:bg-transparent flex gap-1 w-max ${
                status.key === item.key
                  ? "border-primary text-primary  "
                  : "border-white"
              } border-b-[3px]`}
              onClick={() => {
                setStatus(item);
                if (item.key === "property-tax-bill-history") {
                  handleFetchPropertyListHistory();
                }
              }}
            >
              <span>{item.name}</span>
            </Button>
          )
        )}
      </div>
      {status.key === "property-tax-bill-history" ? (
        isLoading ? (
          <Loader />
        ) : (
          historyData && (
            <PropertiesTable
              columns={status.columns}
              data={historyData}
              hasPagination={status.hasPagination}
              tableKey={status.key}
            />
          )
        )
      ) : (
        <PropertiesTable
          columns={status.columns}
          data={
            status.key === "description"
              ? [...formateDescription(data.data[status.key])]
              : status.isArray
                ? [...data.data[status.key]]
                : [{ ...data.data[status.key] }]
          }
          hasPagination={status.hasPagination}
          tableKey={status.key}
        />
      )}
      {editPurchaseProperty && <EditPropertySale />}
      {deletePurchaseProperty && <DeletePropertySale />}
    </div>
  );
};

export default Details;
