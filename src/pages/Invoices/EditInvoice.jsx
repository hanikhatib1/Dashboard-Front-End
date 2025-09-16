import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import SearchAppeal from "./SearchAppeal";
import { Trash2 } from "lucide-react";
import { useEditInvoiceMutation } from "@/redux/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setEditInvoiceData } from "@/redux/features/Invoices";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InvoicePDF from "@/assets/PDFs/Invoice.pdf";
import { PDFDocument } from "pdf-lib";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formattedNumber } from "@/utiles/formattedNumber";

const schema = yup
  .object({
    actual_saving: yup.string().required(),
    appeal_id: yup.number().positive().integer().required(),
  })
  .required();

const EditInvoice = ({ fetchData }) => {
  const { toast } = useToast();
  const [appeal, setAppeal] = useState(null);
  const [editInvoice, { isLoading }] = useEditInvoiceMutation();
  const { editInvoiceData } = useSelector((state) => state.invoices);
  const dispatch = useDispatch();

  const fillForm = async (taxSaving, invoiceNumber) => {
    const formUrl = InvoicePDF;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    setFieldPDF(form, "property_address1", `${appeal.address}`);
    setFieldPDF(form, "mailing_address1", `${appeal.client_address}`);
    setFieldPDF(
      form,
      "invoice_date",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(
      form,
      "due_date",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(form, "tax_savings", `$${formattedNumber(Number(taxSaving))}`);
    setFieldPDF(
      form,
      "amount_due",
      `$${formattedNumber(Number(taxSaving) * 0.25)}`
    );
    setFieldPDF(form, "invoice_number", `${invoiceNumber}`);

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
    /* const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Representation_Agreement_Client.pdf`;
    link.click(); */
  };

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_methode: editInvoiceData.payment_methode,
      actual_saving: editInvoiceData.actual_saving,
      appeal_id: editInvoiceData?.appeal?.id || 0,
      document: null,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (data.actual_saving) {
      data.actual_saving = data.actual_saving
        .toString()
        .replace("$ ", "")
        .split(",")
        .join("");
    }
    data.actual_saving = Number(data.actual_saving);
    const invoivePDF = await fillForm(
      data.actual_saving,
      editInvoiceData.invoice_number
    );

    const formData = new FormData();
    formData.append(
      "document",
      new Blob([invoivePDF], { type: "application/pdf" })
    );
    formData.append("actual_saving", data.actual_saving);
    formData.append("appeal_id", data.appeal_id);
    formData.append("payment_methode", data.payment_methode);
    formData.append("real_id", editInvoiceData.invoice_number);

    const res = await editInvoice({
      body: formData,
      id: editInvoiceData.id,
    });
    if ("data" in res) {
      dispatch(setEditInvoiceData(null));
      if (fetchData) fetchData();
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: res.error.data.detail,
        variant: "error",
      });
    }
  };

  useEffect(() => {
    setAppeal(editInvoiceData.appeal);
  }, [editInvoiceData]);

  useEffect(() => {
    if (errors.actual_saving) {
      toast({
        title: "Error",
        description: "Actual saving is required",
        variant: "destructive",
      });
    }
    if (errors.appeal_id) {
      toast({
        title: "Error",
        description: "Appeal is required",
        variant: "destructive",
      });
    }
  }, [errors, toast]);

  useEffect(() => {
    if (appeal) {
      setValue("appeal_id", appeal.id);
    }
  }, [appeal, setValue]);

  return (
    <Dialog
      defaultOpen={editInvoiceData}
      open={editInvoiceData}
      onOpenChange={(open) => dispatch(setEditInvoiceData(open))}
    >
      <DialogContent className="h-[calc(100vh-40%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 justify-between"
        >
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle className="text-heading_1">Edit Invoice</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className=" w-full flex flex-col gap-2 flex-2">
                  <label
                    htmlFor="Disabled"
                    className="text-body text-[#80838E]"
                  >
                    Payment Method
                  </label>
                  <Select onValueChange={(e) => setValue("payment_methode", e)}>
                    <SelectTrigger className="w-full h-[48px] rounded-[8px]">
                      <SelectValue placeholder="Online Payment" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectItem value="Online Payment">
                          Online Payment
                        </SelectItem>
                        <SelectItem value="Paid Now">Paid Now</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className=" w-full flex flex-col gap-2 flex-2">
                  <label
                    htmlFor="actual_saving"
                    className="text-body text-[#80838E]"
                  >
                    Actual Saving
                  </label>
                  <Input
                    id="actual_saving"
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="annual income"
                    value={`$ ${Number(watch("actual_saving").toString().replace("$", "").split(",").join("")).toLocaleString()}`}
                    onChange={(e) => {
                      setValue("actual_saving", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <SearchAppeal setAppeal={setAppeal} />
              </div>
              {appeal && (
                <div className="flex gap-4 justify-between items-center w-full border p-2 rounded-[8px]">
                  <div>
                    <p className="text-body ">{`${appeal.client_address}`}</p>
                    <p className="text-body text-[#80838E]">{appeal.pin1}</p>
                    <p className="text-body text-[#80838E]">
                      {appeal.client_first_name} {appeal.client_last_name}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <Trash2
                      color="#80838E"
                      onClick={() => setAppeal(null)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="!justify-start items-end gap-2">
            <Button
              type="submit"
              className="bg-primary rounded-[8px] w-[250px] text-white"
            >
              {isLoading ? <Loader /> : <span>Save</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoice;
