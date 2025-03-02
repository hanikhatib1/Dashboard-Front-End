import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAddWorkerMutation } from "@/redux/apiSlice";
import { Plus, UserRound } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

const AddWorkerModel = ({ refetch }) => {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [addWorker, { isLoading, reset }] = useAddWorkerMutation();
  const { toast } = useToast();

  const {
    register,
    setValue,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      description: "",
      image: "",
      job_title: "",
      sort: 0,
    },
  });

  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    const urlImage = URL.createObjectURL(file);
    setImage(urlImage);
    setValue("image", file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const res = await addWorker(formData);
    if ("data" in res) {
      reset();
      toast({
        title: "Worker Added",
        description: "Worker has been added successfully",
        type: "success",
      });
      refetch();
      setOpen(false);
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: res.error.data.detail,
        type: "error",
      });
    }
  };

  return (
    <Dialog defaultOpen={open} open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="w-[150px]"
        onClick={() => {
          console.log("Add New Blog");
        }}
      >
        <Button className="bg-primary rounded-[8px] text-white flex justify-center items-center gap-1">
          <Plus color="#ffffff" />
          <p>Add New Worker</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] !p-0 !border-none max-h-[calc(100vh-20%)] bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <div>
          <form
            className="flex flex-col gap-6 mb-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4 px-8">
              <div className="flex  gap-4 items-center mt-6">
                <div className="flex gap-4 items-center w-1/3 overflow-hidden ">
                  {image ? (
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      className="border rounded-full w-[56px] h-[56px]"
                    />
                  ) : (
                    <UserRound
                      width={56}
                      height={56}
                      className="border rounded-full"
                    />
                  )}
                </div>
                <div className="flex gap-4">
                  {image && (
                    <div
                      onClick={() => {
                        setValue("image", "");
                        setImage("");
                      }}
                      className="bg-white px-4 flex justify-center items-center rounded-[8px] h-[48px] text-black border border-[#CCCDD2] hover:bg-white  hover:text-black"
                    >
                      Delete
                    </div>
                  )}

                  <div className="bg-primary rounded-[8px] text-white h-[48px] leading-[48px]">
                    <label
                      htmlFor="upload_image"
                      className="bg-primary rounded-[8px] text-white p-2 h-[48px]"
                    >
                      Upload Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      name="image"
                      id="upload_image"
                      onChange={handleUploadedFile}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-2 flex-2">
                <label
                  htmlFor="first_name"
                  className="text-body text-[#80838E]"
                >
                  First Name
                </label>
                <Input
                  id="first_name"
                  type="text"
                  className="rounded-[8px] h-[48px]"
                  {...register("first_name", { required: true })}
                />
              </div>
              <div className="w-full flex flex-col gap-2 flex-2">
                <label htmlFor="last_name" className="text-body text-[#80838E]">
                  Last Name
                </label>
                <Input
                  id="last_name"
                  type="text"
                  className="rounded-[8px] h-[48px]"
                  {...register("last_name", { required: true })}
                />
              </div>
              <div className="w-full flex flex-col gap-2 flex-2">
                <label htmlFor="job_title" className="text-body text-[#80838E]">
                  Job Title
                </label>
                <Input
                  id="job_title"
                  type="text"
                  className="rounded-[8px] h-[48px]"
                  {...register("job_title", { required: true })}
                />
              </div>
              <div className="w-full flex flex-col gap-2 flex-2">
                <label
                  htmlFor="Description"
                  className="text-body text-[#80838E]"
                >
                  Description
                </label>
                <Textarea
                  id="Description"
                  type=""
                  className="rounded-[8px] h-[48px]"
                  {...register("description", { required: true })}
                />
              </div>
              <div className="w-full flex flex-col gap-2 flex-2">
                <label htmlFor="last_name" className="text-body text-[#80838E]">
                  Sort
                </label>
                <Input
                  id="sort"
                  type="number"
                  className="rounded-[8px] h-[48px]"
                  {...register("sort", { required: true })}
                />
              </div>
              <div className="flex gap-4">
                <Button
                  className="bg-primary text-white rounded-[8px]"
                  disabled={!isValid}
                  type="submit"
                >
                  {isLoading ? "Loading..." : "Add Worker"}
                </Button>
                <Button
                  className="bg-white text-primary rounded-[8px] border border-primary hover:text-white"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkerModel;
