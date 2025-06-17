import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useEditBlogMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Linkify from "react-linkify";

const EditModel = ({ editBlogData, setEditBlog, refetch }) => {
  const [image, setImage] = React.useState(null);
  const [editBlog, { isLoading, reset }] = useEditBlogMutation();
  const { toast } = useToast();

  const {
    register,
    setValue,
    formState: { isValid },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      title: editBlogData.title,
      description: editBlogData.description,
      short_description: editBlogData.short_description,
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

    const res = await editBlog({ body: formData, id: editBlogData.id });
    if ("data" in res) {
      reset();
      toast({
        title: "Blog Edited",
        description: "Blog has been edited successfully",
        type: "success",
      });
      refetch();
      setEditBlog(false);
    }
    if ("error" in res) {
      toast({
        title: "Error",
        message: res.error.data.detail,
        type: "error",
      });
    }
  };

  useEffect(() => {
    setImage(editBlogData.image);
  }, [editBlogData]);

  return (
    <Dialog
      defaultOpen={editBlogData}
      open={editBlogData}
      onOpenChange={(open) => setEditBlog(open)}
    >
      <DialogContent className="sm:max-w-[900px] max-w-[calc(100%-36px)] !p-0 !border-none max-h-[calc(100vh-20%)] bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form
          className="flex flex-col gap-6 mb-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
            className={`w-full h-[370px] bg-primary flex justify-center items-center relative ${image ? "[&>label]:hover:z-50 [&>label]:hover:text-black [&>img]:hover:!bg-black [&>img]:hover:opacity-[0.2]" : ""}`}
          >
            {image && (
              <img
                src={image}
                alt="blog"
                className="absolute top-0 left-0 w-full h-full"
              />
            )}
            <label htmlFor="upload" className="text-white cursor-pointer ">
              {image ? "Change Image" : "Upload Image"}
            </label>
            <input
              type="file"
              id="upload"
              className="hidden"
              onChange={(e) => handleUploadedFile(e)}
            />
          </div>
          <div className="flex flex-col gap-4 px-8">
            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="title" className="text-body text-[#80838E]">
                Title
              </label>
              <Input
                id="title"
                type="text"
                className="rounded-[8px] h-[48px]"
                {...register("title", { required: true })}
              />
            </div>
            <div className="w-full flex flex-col gap-2 flex-2">
              <label
                htmlFor="Short_description"
                className="text-body text-[#80838E]"
              >
                Short description
              </label>
              <Input
                id="Short_description"
                type="text"
                className="rounded-[8px] h-[48px]"
                {...register("short_description", { required: true })}
              />
            </div>
            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="Description" className="text-body text-[#80838E]">
                Description
              </label>

              <Textarea
                id="Description"
                type=""
                className="rounded-[8px] h-[380px]"
                {...register("description", { required: true })}
              />
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-primary text-white rounded-[8px]"
                disabled={!isValid || !image}
                type="submit"
              >
                {isLoading ? "Loading..." : "Update Blog"}
              </Button>
              <Button
                className="bg-white text-primary rounded-[8px] border border-primary hover:text-white"
                onClick={() => {
                  setEditBlog(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditModel.propTypes = {
  editBlogData: PropTypes.object,
  setEditBlog: PropTypes.func,
};

export default EditModel;
