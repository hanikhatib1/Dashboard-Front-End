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
import { useAddPropertySaleMutation } from "@/redux/apiSlice";
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

const AddPropertySale = ({ pin, refetch }) => {
  const [open, setOpen] = useState(false);
  const [addPropertySale, { isLoading }] = useAddPropertySaleMutation();
  const { toast } = useToast();

  const { handleSubmit, register, watch, setValue } = useForm({
    defaultValues: {
      pin: null,
      sale_price: null,
      sale_date: null,
      sale_seller_name: null,
      sale_buyer_name: null,
      sale_document_num: null,
      sale_type: "Warranty Deed",
    },
  });

  const onSubmit = async (data) => {
    const res = await addPropertySale({ ...data, pin });
    if ("data" in res) {
      setOpen(false);
      if(refetch) refetch();
      toast({
        title: "Property Sale Added",
        description: "Property Sale has been added successfully",
        type: "success",
      });
    }
    if ("error" in res) {
      toast({
        title: "Error",
        message: "An error occurred while adding property sale",
        type: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          setOpen(false);
        }
      }}
    >
      <DialogTrigger>
        <Button
          className="bg-white hover:bg-primary hover:text-white text-primary rounded-[8px] h-[40px]"
          onClick={() => setOpen(true)}
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <DialogHeader>
          <DialogTitle className="text-heading_1">
            Add Property Sale
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
              <span>Add Property Sale</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertySale;
