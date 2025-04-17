import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateWorkerMutation } from "@/redux/apiSlice";
import { UserRound } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditWorkerModel = ({ editWorkerData, setEditWorker, refetch }) => {
  const [image, setImage] = useState(null);
  const [editWorker, { isLoading, reset }] = useUpdateWorkerMutation();
  const { toast } = useToast();

  const {
    register,
    setValue,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    defaultValues: {
      first_name: editWorkerData.first_name,
      last_name: editWorkerData.last_name,
      description: editWorkerData.description,
      job_title: editWorkerData.job_title,
      image: editWorkerData.job_title ? "" : "oooo",
      sort: editWorkerData.sort,
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

    const res = await editWorker({ body: formData, id: editWorkerData.id });
    if ("data" in res) {
      reset();
      toast({
        title: "Worker Edited",
        description: "Worker has been edited successfully",
        type: "success",
      });
      refetch();
      setEditWorker(false);
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: res.error.data.detail,
        type: "error",
      });
    }
  };

  useEffect(() => {
    setImage(editWorkerData.image);
  }, [editWorkerData]);

  return (
    <Dialog
      defaultOpen={editWorkerData}
      open={editWorkerData}
      onOpenChange={(open) => setEditWorker(open)}
    >
      <DialogContent className="sm:max-w-[500px]  max-w-[calc(100%-32px)] !p-0 !border-none max-h-[calc(100vh-20%)] bg-white !rounded-[8px] overflow-y-auto scroll-right">
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
                        setValue("image", "oooo");
                        setImage("");
                      }}
                      className="bg-white text-center px-4 flex justify-center items-center rounded-[8px] h-[48px] text-black border border-[#CCCDD2] hover:bg-white  hover:text-black"
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
                  {isLoading ? "Loading..." : "Update Worker"}
                </Button>
                <Button
                  className="bg-white text-primary rounded-[8px] border border-primary hover:text-white"
                  onClick={() => {
                    setEditWorker(false);
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

EditWorkerModel.propTypes = {
  editWorkerData: PropTypes.object,
  setEditWorker: PropTypes.func,
  refetch: PropTypes.func,
};

export default EditWorkerModel;
