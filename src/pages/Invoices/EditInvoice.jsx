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

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_methode: editInvoiceData.payment_methode,
      actual_saving: editInvoiceData.actual_saving,
      appeal_id: editInvoiceData.appeal.id,
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
    const res = await editInvoice({
      body: data,
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

export default EditInvoice;
