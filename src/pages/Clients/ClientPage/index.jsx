import { useGetOneClientQuery } from "@/redux/apiSlice";
import ClientAppealTable from "./ClientAppealTable";
import { clientAppealColumns } from "./tableData";
import { useParams } from "react-router-dom";
import { User2 } from "lucide-react";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import { reverseDate } from "@/utiles/revserDate";
import Loader from "@/components/Loader";
import Properties from "../Properties";
import EditAppeal from "@/pages/Appeals/EditAppeal";
import { useSelector } from "react-redux";
import { formattedNumber } from "@/utiles/formattedNumber";
import DeleteAppealModel from "@/pages/Appeals/DeleteAppealModel";
import InvoicesTable from "@/pages/Invoices/InvoicesTable";
import { invoicesTableData } from "@/pages/Invoices/invoicesTableData";
import EditInvoice from "@/pages/Invoices/EditInvoice";
import DeleteInvoiceModel from "@/pages/Invoices/DeleteInvoiceModel";

const DataLabel = ({ title, value }) => {
  return (
    <div className="flex justify-between flex-col text-start flex-1">
      <p className="font-medium text-[16px] text-[#80838E] leading-[150%]">
        {title}
      </p>
      <p className="font-medium text-[16px] text-dark leading-[150%] truncate">
        {value ?? "N/A"}
      </p>
    </div>
  );
};

const ClientPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetOneClientQuery(id);
  const { editAppealData, deleteAppealData } = useSelector(
    (state) => state.appeals
  );
  const { editInvoiceData, deleteInvoiceData } = useSelector(
    (state) => state.invoices
  );

  if (isLoading) return <Loader />;

  if (isError) return <p className="text-center">Error</p>;

  const clientData = data.data.client_data;
  const propertyData = data.data.property_data ?? [];
  const appealData = data.data.appeal_data ?? [];
  const invoiceData = data.data.invoices_data ?? [];

  return (
    <div className="p-4 flex flex-col gap-5">
      <div className="flex justify-between gap-2">
        <div className="w-[720px] border  rounded-[16px] bg-white border-white flex ">
          <div className="w-[250px] border-r p-6 border-[#E5E5EF] flex flex-col gap-10 justify-center text-center">
            <div className="flex gap-4 flex-col justify-center items-center">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                {clientData.image ? (
                  <img
                    src={clientData.image}
                    alt=""
                    className="object-cover w-[100px] h-[100px]"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] flex justify-center items-center border rounded-full">
                    <User2 className="object-cover" size={40} />
                  </div>
                )}
              </div>
              <p className="bold text-[20px] text-dark">
                {clientData.first_name} {clientData.last_name}
              </p>
              <div>
                <p className="text-[16px] text-[#80838E]">{clientData.email}</p>
                <p className="text-[16px] text-[#80838E]">
                  Num: {formatPhoneNumber(clientData.phone)}
                </p>
              </div>
            </div>
            <div className="flex gap-1 justify-between ">
              <div className="border-r border-r-[2px] px-4 pr-10 flex flex-col">
                <span className="font-bold text-[14px] text-dark">
                  {appealData.length}
                </span>
                <span className="text-[#80838E] text-[13px]">Appeal</span>
              </div>
              <div className="px-4 flex flex-col">
                <span className="font-bold text-[14px] text-dark">
                  {propertyData.length}
                </span>
                <span className="text-[#80838E] text-[13px]">Properties</span>
              </div>
            </div>
            <div className="flex  flex-col gap-1 ">
              <p className="justify-start">
                Total Invoices : {clientData.total_invoice}
              </p>

              <div className="flex justify-between">
                <div className="border-r border-r-[2px]  flex flex-col flex-1">
                  <span className="font-bold text-[14px] text-dark">
                    {clientData.payed_invoice}
                  </span>
                  <span className="text-[#80838E] text-[13px]">Payed</span>
                </div>
                <div className=" flex flex-col flex-1">
                  <span className="font-bold text-[14px] text-dark">
                    {clientData.unpayed_invoice}
                  </span>
                  <span className="text-[#80838E] text-[13px]">unpayed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full py-6 ps-6  flex flex-col gap-5">
            <div className="flex justify-between items-center gap-2  w-full">
              <DataLabel title="Address" value={clientData.address} />
              <DataLabel title="City" value={clientData.city} />
              <DataLabel title="State" value={clientData.state} />
            </div>
            <div className="flex justify-between items-center gap-2  w-full">
              <DataLabel title="Zip Code" value={clientData.zip_code} />
              <DataLabel
                title="Birth Date"
                value={
                  clientData.birth_date
                    ? reverseDate(clientData.birth_date)
                    : null
                }
              />
              <DataLabel
                title="Start Date"
                value={
                  clientData.start_date
                    ? reverseDate(clientData.start_date)
                    : null
                }
              />
            </div>
            <div className="flex justify-between items-center gap-2  w-full">
              <DataLabel
                title="Annual income"
                value={`$ ${formattedNumber(clientData.annual_income)}`}
              />
              <DataLabel
                title="Disability Year"
                value={
                  clientData.disability_date
                    ? reverseDate(clientData.disability_date)
                    : null
                }
              />
              <DataLabel
                title="Veteran"
                value={clientData.Veteran ? "Yes" : "No"}
              />
            </div>
            <div className="flex justify-between items-center gap-2  w-full">
              <DataLabel
                title="Disability"
                value={clientData.disability ? "Yes" : "No"}
              />
              <DataLabel
                title="Verified"
                value={clientData.verified ? "Yes" : "No"}
              />
            </div>
            <div className="flex justify-between items-center gap-2  w-full">
              <DataLabel
                title="Entity Name"
                value={clientData.entity_name ?? "N/A"}
              />
              <DataLabel
                title="Entity Type"
                value={clientData.entity_type ?? "N/A"}
              />
              <DataLabel
                title="Relation Ship"
                value={clientData.relation_ship ?? "N/A"}
              />
            </div>
          </div>
        </div>
        <div className="w-[440px] border bg-white rounded-[16px] border-white p-4">
          <Properties data={propertyData} />
        </div>
      </div>

      <div className="border rounded-[8px]">
        <p className="text-[20px] font-bold p-4">Appeals Data </p>
        <ClientAppealTable columns={clientAppealColumns} data={appealData} />
      </div>
      <div className="border rounded-[8px]">
        <p className="text-[20px] font-bold p-4">Invoices Data </p>
        <InvoicesTable
          columns={invoicesTableData}
          invoices={invoiceData ? { data: invoiceData } : []}
        />{" "}
      </div>

      {editAppealData && <EditAppeal />}
      {deleteAppealData && <DeleteAppealModel />}

      {editInvoiceData && <EditInvoice />}
      {deleteInvoiceData && <DeleteInvoiceModel />}
    </div>
  );
};

export default ClientPage;
