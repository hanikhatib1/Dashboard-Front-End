import Loader from "@/components/Loader";
import {
  useGetAppealQuery,
  useGetInvoiceFromAppealMutation,
} from "@/redux/apiSlice";
import {
  addAppealToInvoice,
  setCertificateErrorAppealData,
  setDeleteAppealData,
  setDocumentsCertificateErrorStatusAppealModel,
  setDocumentsStatusAppealModel,
  setEditAppealData,
  setFormsAppeal,
} from "@/redux/features/AppealSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditAppeal from "../EditAppeal";
import DeleteAppealModel from "../DeleteAppealModel";
import SendFormModel from "../SendFormModel";
import { reverseDate } from "@/utiles/revserDate";
import InvoicesTable from "@/pages/Invoices/InvoicesTable";
import AddInvoice from "@/pages/Invoices/AddInvoice";
import { invoicesTableData } from "@/pages/Invoices/invoicesTableData";
import EditInvoice from "@/pages/Invoices/EditInvoice";
import DeleteInvoiceModel from "@/pages/Invoices/DeleteInvoiceModel";
import { Download, Upload } from "lucide-react";
import Files from "./Files";
import DocumentsStatusAppealModel from "../DocumentsStatusAppealModel";
import PropertyImageSlider from "@/pages/Properties/PropertyImageSlider";
import { useToast } from "@/components/ui/use-toast";
import { formatePin } from "@/utiles/formatePin";
import CertificateErrorModel from "./CertificateErrorModel";
import DocumentsCertificateErrorStatus from "./DocumentsCertificateErrorStatus";

const tableData = [
  {
    id: 2,
    title: "Address",
    key: "address",
  },
  {
    id: 3,
    title: "Appeal Type",
    key: "appeal_type",
  },
  {
    id: 4,
    title: "Status",
    key: "appeal_status.status",
  },
  {
    id: 5,
    title: "Township",
    key: "township.name",
  },
  {
    id: 10,
    title: "Date",
    key: "created_at",
  },
];

const appealKeys = [
  [
    {
      id: 1,
      title: "Client Name",
      key: "client_name",
      display: (data) => `${data.client_first_name} ${data.client_last_name}`,
    },
  ],
  [
    // client phone and client email
    {
      id: 2,
      title: "Client Phone",
      key: "client_phone",
      display: (data) => data.client_phone,
    },
    {
      id: 3,
      title: "Client Email",
      key: "client_email",
      display: (data) => data.client_email,
    },
  ],
  [
    // address and township
    {
      id: 4,
      title: "Address",
      key: "address",
      display: (data) => String(data.address).toLocaleLowerCase(),
    },
    {
      id: 5,
      title: "Township",
      key: "township.name",
      display: (data) => data.township.name,
    },
  ],
  [
    // pin1 and pin2 and pin3
    {
      id: 6,
      title: "PIN 1",
      key: "pin1",
      display: (data) => formatePin(data.pin1),
    },
    {
      id: 7,
      title: "PIN 2",
      key: "pin2",
      display: (data) => (data.pin2 ? formatePin(data.pin2) : "N/A"),
    },
    {
      id: 8,
      title: "PIN 3",
      key: "pin3",
      display: (data) => (data.pin3 ? formatePin(data.pin3) : "N/A"),
    },
  ],
  [
    // appeal number and appeal type and status
    {
      id: 9,
      title: "Appeal Number",
      key: "appeal_number",
      display: (data) => (data.appeal_number ? data.appeal_number : "N/A"),
    },
    {
      id: 10,
      title: "Appeal Type",
      key: "appeal_type",
      display: (data) => data.appeal_type,
    },
    {
      id: 11,
      title: "Status",
      key: "appeal_status.status",
      display: (data) => data.appeal_status.status,
    },
  ],
  [
    // appeal date and last action
    {
      id: 12,
      title: "Appeal Date",
      key: "created_at",
      display: (data) => reverseDate(data.created_at),
    },
    {
      id: 13,
      title: "Last Action",
      key: "last_action",
      display: (data) => (data.last_action ? data.last_action : "N/A"),
    },
  ],
  [
    // owner name
    {
      id: 14,
      title: "Owner Name",
      key: "owner_first_name",
      display: (data) => `${data.owner_first_name} ${data.owner_last_name}`,
    },
  ],
  [
    // note
    {
      id: 15,
      title: "Note",
      key: "note",
      display: (data) => (data.note ? data.note : "N/A"),
    },
  ],
  [
    // entity name and entity relation ship and entity type
    {
      id: 16,
      title: "Entity Name",
      key: "entity_name",
      display: (data) => (data.entity_name ? data.entity_name : "N/A"),
    },
    {
      id: 17,
      title: "Entity Relationship",
      key: "entity_relationship",
      display: (data) =>
        data.entity_relationship ? data.entity_relationship : "N/A",
    },
    {
      id: 18,
      title: "Entity Type",
      key: "entity_type",
      display: (data) => (data.entity_type ? data.entity_type : "N/A"),
    },
  ],
];

const Appeal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const {
    data,
    isError,
    isLoading,
    refetch: fetchData,
  } = useGetAppealQuery(id);
  const {
    editAppealData,
    deleteAppealData,
    appealToInvoice,
    appealInvoiceDetails,
    formsAppeal,
    documentsStatusAppealModel,
    certificateErrorAppealData,
    documentsCertificateErrorStatusAppealModel,
  } = useSelector((state) => state.appeals);
  const { editInvoiceData, deleteInvoiceData } = useSelector(
    (state) => state.invoices
  );
  const [
    getInvoices,
    { isError: isErrorInvoices, isLoading: isLoadingInvoices },
  ] = useGetInvoiceFromAppealMutation();
  const [invoices, setInvoice] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await getInvoices(id);
      if ("error" in res) return;
      if ("data" in res) {
        let newInvoices = [];
        res.data.data.filter((item) => {
          newInvoices.push({ ...item, appeal_id: item.appeal.id });
        });
        console.log(newInvoices);
        setInvoice(newInvoices);
      }
    }
    fetchData();
  }, [getInvoices, id]);

  if (isLoading || isLoadingInvoices || !invoices) {
    return <Loader />;
  }
  if (isError && !invoices) return <div>Error</div>;

  const appealData = data?.data;

  if (appealData)
    return (
      <div className="p-5 flex flex-col gap-6">
        <div className="flex gap-3 flex-col">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <p className="text-[#2C3E50] text-[28px]">All Details</p>
            <div className="flex gap-2 flex-wrap">
              <button
                className="bg-[#F60000] text-white px-4 py-2 rounded-[8px]"
                onClick={() => dispatch(setDeleteAppealData(appealData))}
              >
                Delete
              </button>
              <button
                className="bg-[#1A73E8] text-white px-4 py-2 rounded-[8px]"
                onClick={() => dispatch(setEditAppealData(appealData))}
              >
                Edit
              </button>
              <button
                className={`px-4 py-2 rounded-[8px]  cursor-pointer bg-[#1A73E833] ${appealData.certf_error_sent ? "text-[#80838E] cursor-not-allowed " : ""}`}
                onClick={() => {
                  if (!appealData.certf_error_sent)
                    dispatch(setCertificateErrorAppealData(appealData));
                }}
                disabled={appealData.certf_error_sent}
              >
                Send Certificate Error
              </button>
              <button
                className={`px-4 py-2 rounded-[8px] cursor-pointer bg-[#1A73E833] ${!appealData.certf_error_sent ? "text-[#80838E] cursor-not-allowed " : ""}`}
                onClick={() =>
                  appealData.certf_error_sent &&
                  dispatch(
                    setDocumentsCertificateErrorStatusAppealModel(appealData)
                  )
                }
              >
                Certificate Error Status
              </button>
              <button
                className={`px-4 py-2 rounded-[8px] cursor-pointer bg-[#1A73E833] ${appealData.signature_sent ? "text-[#80838E] cursor-not-allowed " : ""}`}
                onClick={() => {
                  if (!appealData.signature_sent)
                    dispatch(setFormsAppeal(appealData));
                }}
                disabled={appealData.signature_sent}
              >
                Send Forms
              </button>
              <button
                className={`px-4 py-2 rounded-[8px] cursor-pointer bg-[#1A73E833] ${!appealData.signature_sent ? "text-[#80838E] cursor-not-allowed " : ""}`}
                onClick={() =>
                  appealData.signature_sent &&
                  dispatch(setDocumentsStatusAppealModel(appealData))
                }
              >
                Signature Status
              </button>
            </div>
          </div>
          <div className="border rounded-[10px] border-[#1A73E833] p-4 flex flex-col  gap-10 h-max">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="gap-4 w-full grid grid-cols-2">
                <Files appealData={appealData} />
              </div>
              <div className="border mt-5 w-full md:w-[40%] max-w-[400px] !h-[240px] md:h-auto relative rounded-[16px] overflow-hidden">
                <PropertyImageSlider
                  defaultImages={appealData.default_image}
                  pin={appealData.pin}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {appealKeys.map((row, rowIndex) =>
                row[0].key === "owner_first_name" ? (
                  appealData.appeal_type === "Commercial" && (
                    <div
                      key={rowIndex}
                      className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between  border-b border-[#D5EBF9] py-2 last:border-b-0"
                    >
                      {row.map((item) => (
                        <div key={item.id} className="flex gap-2 items-center">
                          <p className="text-[#2C3E50] text-[20px]">
                            {item.title} :
                          </p>
                          <p className="text-[#80838E] text-[16px]">
                            {item.display(appealData)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div
                    key={rowIndex}
                    className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between  border-b border-[#D5EBF9] py-2 last:border-b-0"
                  >
                    {row.map((item) => (
                      <div key={item.id} className="flex gap-2 items-center">
                        <p className="text-[#2C3E50] text-[20px]">
                          {item.title} :
                        </p>
                        <p className="text-[#80838E] text-[16px]">
                          {item.display(appealData)}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="border rounded-[8px]">
          <div className="flex justify-between items-center">
            <p className="text-[20px] font-bold p-4">Invoices Data </p>
            <button
              className="bg-[#1A73E8] text-white px-4 py-2 rounded-[8px] m-4"
              onClick={() => dispatch(addAppealToInvoice(appealData))}
            >
              Add Invoice
            </button>
          </div>
          <InvoicesTable
            columns={invoicesTableData}
            invoices={invoices ? { data: invoices } : []}
          />{" "}
        </div>
        {editAppealData && <EditAppeal fetchData={fetchData} />}
        {deleteAppealData && <DeleteAppealModel refetch={fetchData} />}
        {formsAppeal && <SendFormModel />}
        {appealToInvoice && (
          <AddInvoice
            hideButton={true}
            open={appealToInvoice}
            setOpen={(e) => dispatch(addAppealToInvoice(e))}
          />
        )}

        {editInvoiceData && <EditInvoice />}
        {deleteInvoiceData && <DeleteInvoiceModel />}
        {documentsStatusAppealModel && <DocumentsStatusAppealModel />}
        {certificateErrorAppealData && (
          <CertificateErrorModel refetch={fetchData} />
        )}
        {documentsCertificateErrorStatusAppealModel && (
          <DocumentsCertificateErrorStatus refetch={fetchData} />
        )}
      </div>
    );
};

export default Appeal;
