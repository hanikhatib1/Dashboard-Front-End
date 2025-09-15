import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAddFAQMutation } from "@/redux/apiSlice";
import { useForm } from "react-hook-form";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import RenameLinks from "../Blogs/RenameLinks";

const AddNewFAQ = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [addFAQ, { isLoading }] = useAddFAQMutation();
  const { toast } = useToast();

  const { handleSubmit, register, watch, setValue } = useForm({
    defaultValues: {
      question: "",
      answer: "",
      meta_description: "",
      rename_links: null,
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const res = await addFAQ(data);
    if ("data" in res) {
      toast({
        title: "FAQ Added",
        description: "FAQ has been added successfully",
        type: "success",
      });
      setOpen(false);
      refetch();
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: res.error.data.message || "Failed to add FAQ",
        type: "error",
      });
    }
  };

  return (
    <Dialog defaultOpen={open} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="!flex-1">
        <Button
          className={`bg-primary rounded-[8px] text-white flex justify-center items-center gap-1`}
          onClick={() => setOpen(true)}
        >
          <Plus color="#ffffff" />
          <p>Add New FAQ</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-w-[calc(100%-32px)] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form>
          <DialogHeader>
            <DialogTitle className="text-heading_1">
              Add New Question
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="Question" className="text-body text-[#80838E]">
                Question
              </label>
              <Input
                id="Question"
                type="text"
                className="rounded-[8px] h-[48px]"
                placeholder="Enter Question"
                {...register("question")}
              />
            </div>
            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="Answer" className="text-body text-[#80838E]">
                Answer
              </label>
              <Textarea
                id="Answer"
                type="text"
                className="rounded-[8px] h-[48px]"
                placeholder="Enter Answer"
                {...register("answer")}
              />
            </div>
            <div className="w-full flex flex-col gap-2 flex-2">
              <label
                htmlFor="Short_description"
                className="text-body text-[#80838E]"
              >
                Meta Description
              </label>
              <Input
                id="meta_description"
                type="text"
                className="rounded-[8px] h-[48px]"
                {...register("meta_description", { required: true })}
              />
            </div>
            <RenameLinks
              rename_links={watch("rename_links")}
              setRenameLinks={(e) => setValue("rename_links", e)}
            />
          </div>
          <DialogFooter className="!justify-start gap-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-primary rounded-[8px] text-white"
            >
              {isLoading && <Loader />}
              <span>Save FAQ</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewFAQ;
