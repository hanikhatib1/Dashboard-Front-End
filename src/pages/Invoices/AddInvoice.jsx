import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAddInvoiceMutation, useGetInvoiveNumberMutation } from "@/redux/apiSlice";
import { DialogTitle } from "@radix-ui/react-dialog";
import { SelectValue } from "@radix-ui/react-select";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import SearchAppeal from "./SearchAppeal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
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

const AddInvoice = ({ hideButton = false, open, setOpen, defaultAppeal }) => {
  const [addInvoice, { isLoading }] = useAddInvoiceMutation();
  const { toast } = useToast();
  const [appeal, setAppeal] = React.useState(null);
  const { appealToInvoice } = useSelector((state) => state.appeals);
  const [getInvoiveNumber] = useGetInvoiveNumberMutation();

  const fillForm = async (taxSaving, invoiceNumber) => {
    const formUrl = InvoicePDF;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    setFieldPDF(
      form,
      "property_address1",
      `${appeal.address}`
    );
    setFieldPDF(
      form,
      "mailing_address1",
      `${appeal.client_address}`
    );
    setFieldPDF(form, "invoice_date", `${currentMonth + 1}/${currentDay}/${currentYear}`);
    setFieldPDF(form, "due_date", `${currentYear}/${currentMonth + 1}/${currentDay}`);
    setFieldPDF(form, "tax_savings", `$${formattedNumber(Number(taxSaving))}`);
    setFieldPDF(form, "amount_due", `$${formattedNumber(Number(taxSaving) * 0.25)}`);
    setFieldPDF(form, "invoice_number", `${invoiceNumber}`);

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  };

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_methode: "Online Payment",
      actual_saving: "",
      appeal_id: null,
      real_id: null,
      document: null,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const invoiveRes = await getInvoiveNumber();
    if ('error' in invoiveRes) {
      toast({
        title: "Error",
        description: "An error occurred while getting invoice number",
        variant: "destructive",
      });
      return;
    }
    const invoiceNumber = invoiveRes.data.data;
    if (data.actual_saving) {
      data.actual_saving = data.actual_saving
        .toString()
        .replace("$ ", "")
        .split(",")
        .join("");
    }
    const invoivePDF = await fillForm(data.actual_saving, invoiceNumber);
    data.actual_saving = Number(data.actual_saving);
    data.document = invoivePDF;
    data.invoice_number = invoiceNumber;

    const formData = new FormData();
    formData.append("document", new Blob([invoivePDF], { type: "application/pdf" }));
    formData.append("actual_saving", data.actual_saving);
    formData.append("appeal_id", data.appeal_id);
    formData.append("payment_methode", data.payment_methode);
    formData.append("real_id", data.invoice_number);

    const res = await addInvoice(formData);
    if ('error' in res) {
      toast({
        title: "Error",
        description: res.error.data.detail,
        variant: "destructive",
      });
      return;
    }
    if ('data' in res) {
      toast({
        title: "Success",
        description: "Invoice added successfully",
        variant: "success",
      });
      setOpen(false);
    }
  };

  useEffect(() => {
    if (appeal) {
      setValue("appeal_id", appeal.id);
    }
  }, [appeal, setValue]);

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
    if (appealToInvoice) {
      console.log("appealToInvoice", appealToInvoice);
      setAppeal(appealToInvoice);
      setValue("appeal_id", appealToInvoice.id);
    }
  }, [appealToInvoice, setValue]);

  return (
    <Dialog defaultOpen={open} open={open} onOpenChange={setOpen}>
      {!hideButton && (
        <DialogTrigger asChild>
          <Button
            className="bg-primary rounded-[8px] text-white flex justify-center items-center gap-1 "
            onClick={() => setOpen(true)}
          >
            <Plus color="#ffffff" />
            <p>Add Invoice</p>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="h-[calc(100vh-40%)] w-[calc(100%-32px)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 justify-between"
        >
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle className="text-heading_1">
                Add New Invoice
              </DialogTitle>
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
                        <SelectItem value="Online Payment">Online Payment</SelectItem>
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

AddInvoice.propTypes = {
  fetchData: PropTypes.func,
};

export default AddInvoice;
