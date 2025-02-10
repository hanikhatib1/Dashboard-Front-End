import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import { formatDate } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { setEditPurchaseProperty } from "@/redux/features/Properties";
import { useEditPropertySaleMutation } from "@/redux/apiSlice";
import { useParams } from "react-router-dom";
import { date } from "yup";

const EditPropertySale = () => {
  const { editPurchaseProperty } = useSelector((state) => state.properties);
  const dispatch = useDispatch();
  const [editPropertySale, { isLoading }] = useEditPropertySaleMutation();
  const { toast } = useToast();
  console.log("editPurchaseProperty", editPurchaseProperty);
  const { id } = useParams();
  const { handleSubmit, register, watch, setValue } = useForm({
    defaultValues: {
      pin: id,
      sale_price: editPurchaseProperty.purchase_price,
      sale_date: editPurchaseProperty.purchase_date,
      sale_seller_name: editPurchaseProperty.seller_Name,
      sale_buyer_name: editPurchaseProperty.buyer_name,
      sale_type: editPurchaseProperty.type_of_deed,
    },
  });

  const onSubmit = async (data) => {
    delete data.year;
    date.sale_price = parseInt(data.sale_price);
    console.log("data", data);
    const res = await editPropertySale({
      body: data,
      id: editPurchaseProperty.id,
    });
    if ("data" in res) {
      dispatch(setEditPurchaseProperty(null));
      toast({
        title: "Property Sale Edited",
        description: "Property Sale has been edited successfully",
        type: "success",
      });
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: "An error occurred while editing property sale",
        type: "error",
      });
    }
  };

  return (
    <Dialog
      open={editPurchaseProperty}
      onOpenChange={(e) => {
        if (!e) {
          dispatch(setEditPurchaseProperty(null));
        }
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <DialogHeader>
          <DialogTitle className="text-heading_1">
            Edit Property Sale
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-[45%] flex flex-col gap-2">
              <label htmlFor="price" className="text-body text-[#80838E]">
                Price
              </label>
              <Input
                id="price"
                type="text"
                className="rounded-[8px] h-[48px] bg-[#F7F8FA]"
                {...register("sale_price", {
                  required: true,
                })}
              />
            </div>
            <div className="w-full md:w-[45%] flex flex-col gap-2">
              <label htmlFor="date" className="text-body text-[#80838E]">
                Date
              </label>
              <div className="flex justify-between items-center gap-2">
                <DatePicker
                  id="date"
                  selected={watch("sale_date")}
                  onChange={(date) => {
                    setValue("sale_date", formatDate(date, "yyyy-MM-dd"));
                  }}
                  renderYearContent={(year) => {
                    const tooltipText = `Tooltip for year: ${year}`;
                    return <span title={tooltipText}>{year}</span>;
                  }}
                  dateFormat="MM-dd-yyyy"
                  className="w-[310px] h-[48px] rounded-[8px] border !flex-1 px-2"
                />
                <Trash2
                  className="cursor-pointer text-gray-400"
                  onClick={() => {
                    setValue("sale_date", null);
                  }}
                />
              </div>
            </div>
            <div className="w-full md:w-[45%] flex flex-col gap-2">
              <label htmlFor="seller" className="text-body text-[#80838E]">
                Seller&apos;s Name
              </label>
              <Input
                id="seller"
                type="text"
                className="rounded-[8px] h-[48px]"
                {...register("sale_seller_name")}
              />
            </div>
            <div className="w-full md:w-[45%] flex flex-col gap-2">
              <label htmlFor="buyer" className="text-body text-[#80838E]">
                Buyer&apos;s Name
              </label>
              <Input
                id="buyer"
                type="text"
                className="rounded-[8px] h-[48px]"
                {...register("sale_buyer_name")}
              />
            </div>
            <div className="w-full md:w-[45%] flex flex-col gap-2">
              <label htmlFor={name} className="text-body text-[#80838E]">
                Type
              </label>
              <Select onValueChange={(e) => setValue("sale_type", e)}>
                <SelectTrigger className="w-full h-[48px] rounded-[8px]">
                  <SelectValue placeholder="Warranty Deed" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="Warranty Deed">Warranty Deed</SelectItem>
                    <SelectItem value="Trustee's Deed">
                      Trustee&apos;s Deed
                    </SelectItem>
                    <SelectItem value="Quit Claim">Quit Claim</SelectItem>
                    <SelectItem value="Executor's Deed">
                      Executor&apos;s Deed
                    </SelectItem>
                    <SelectItem value="Special Warranty Deed">
                      Special Warranty Deed
                    </SelectItem>
                    <SelectItem value="Administrator's Deed">
                      Administrator&apos;s Deed
                    </SelectItem>
                    <SelectItem value="Sheriff's Deed">
                      Sheriff&apos;s Deed
                    </SelectItem>
                    <SelectItem value="Conservator's Deed">
                      Conservator&apos;s Deed
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="!justify-start gap-2">
            <Button className="bg-primary rounded-[8px] text-white">
              {isLoading && <Loader />}
              <span>Edit Property Sale</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertySale;
