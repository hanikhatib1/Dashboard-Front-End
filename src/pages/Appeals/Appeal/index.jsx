import Loader from "@/components/Loader";
import {
  useGetAppealQuery,
  useGetInvoiceFromAppealMutation,
} from "@/redux/apiSlice";
import {
  addAppealToInvoice,
  setDeleteAppealData,
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

const Appeal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
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
            <div className="flex gap- flex-wrap">
              <button
                className="bg-[#F60000] text-white px-4 py-2 rounded-[8px]"
                onClick={() => dispatch(setDeleteAppealData(appealData))}
              >
                Delete
              </button>
              <button
                //className="bg-[#1A73E833] text-[#2C3E50] px-4 py-2 rounded-[8px] ml-3"
                className={`px-4 py-2 rounded-[8px] ml-3 cursor-pointer bg-[#1A73E833] ${appealData.signature_sent ? "text-[#80838E] cursor-not-allowed " : ""}`}
                onClick={() =>
                  !appealData.signature_sent &&
                  dispatch(setFormsAppeal(appealData))
                }
                disabled={appealData.signature_sent}
              >
                Send Forms
              </button>
              <button
                className={`px-4 py-2 rounded-[8px] ml-3 cursor-pointer bg-[#1A73E833] ${!appealData.signature_sent ? "text-[#80838E] cursor-not-allowed " : ""}`}
                onClick={() =>
                  appealData.signature_sent &&
                  dispatch(setDocumentsStatusAppealModel(appealData))
                }
              >
                Signature Status
              </button>
              <button
                className="bg-[#1A73E8] text-white px-4 py-2 rounded-[8px] ml-3"
                onClick={() => dispatch(setEditAppealData(appealData))}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="border rounded-[10px] border-[#1A73E833] p-4 flex flex-col  gap-10 h-max">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <p>Name :</p>
                  <p className="text-[#80838E]">
                    {`${appealData.client_first_name} ${appealData.client_last_name}`}
                  </p>
                </div>
                {tableData.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <p>{item.title} :</p>
                    <p className="text-[#80838E]">
                      {item.key.split(".").reduce((o, i) => o[i], appealData)}
                    </p>
                  </div>
                ))}
                <div className="flex gap-4">
                  <p>Assessor Appeal Date :</p>
                  <p className="text-[#80838E]">
                    {`${reverseDate(appealData.reassessment_notice_date)} -
              ${reverseDate(appealData.last_file_date)}`}
                  </p>
                </div>
                <div className="flex gap-4">
                  <p>Signature Sent :</p>
                  <p className="text-[#80838E]">
                    {appealData.signature_sent ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div className="border mt-5 w-full md:w-[40%] h-[200px] md:h-auto relative rounded-[16px] overflow-hidden">
                <PropertyImageSlider
                  defaultImages={appealData.default_image}
                  pin={appealData.pin}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-8">
              <Files appealData={appealData} />
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
      </div>
    );
};

export default Appeal;
