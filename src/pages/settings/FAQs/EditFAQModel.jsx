import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateFAQMutation } from "@/redux/apiSlice";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import RenameLinks from "../Blogs/RenameLinks";

const EditFAQModel = ({ refetch, faq, setSelectedEditFAQ }) => {
  const [editFAQ, { isLoading }] = useUpdateFAQMutation();
  const { toast } = useToast();

  const { handleSubmit, register, watch, setValue } = useForm({
    defaultValues: {
      question: faq.question || "",
      answer: faq.answer || "",
      meta_description: faq.meta_description || "",
      rename_links: faq.rename_links || null,
      sort: faq.sort || null,
      title: faq.title || "",
    },
  });

  const onSubmit = async (data) => {
    const res = await editFAQ({ body: data, id: faq.id });
    if ("data" in res) {
      refetch();
      setSelectedEditFAQ(null);
      toast({
        title: "FAQ Updated",
        description: "FAQ has been updated successfully",
        type: "success",
      });
    } else {
      toast({
        title: "Error",
        description: res.error.data.message || "Failed to update FAQ",
        type: "error",
      });
    }
  };

  return (
    <Dialog
      defaultOpen={faq}
      open={faq}
      onOpenChange={(open) => setSelectedEditFAQ(open)}
    >
      <DialogTrigger asChild className="!flex-1">
        <Button
          className={`bg-primary rounded-[8px] text-white flex justify-center items-center gap-1`}
        >
          <p>Edit New FAQ</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-w-[calc(100%-32px)] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form>
          <DialogHeader>
            <DialogTitle className="text-heading_1">Edit Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="title" className="text-body text-[#80838E]">
                Title
              </label>
              <Input
                id="title"
                type="text"
                className="rounded-[8px] h-[48px]"
                placeholder="Enter Title"
                {...register("title")}
              />
            </div>
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
            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="Sort" className="text-body text-[#80838E]">
                Sort
              </label>
              <Input
                id="Sort"
                type="text"
                className="rounded-[8px] h-[48px]"
                {...register("sort", { required: true })}
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
              {isLoading ? <Loader /> : <span>Save Changes</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFAQModel;
