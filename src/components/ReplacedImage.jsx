import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit, Image } from "lucide-react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useEditPropertyImageMutation } from "@/redux/apiSlice";
import { useToast } from "./ui/use-toast";
import Loader from "./Loader";

const ReplacedImage = ({ pickedImage, defaultImage, pin }) => {
  const [replaceImage, setReplaceImage] = useState(false);
  const [image, setImage] = useState(pickedImage ?? defaultImage);
  const [savedImage, setSavedImage] = useState(pickedImage ?? defaultImage);
  const [editImage, { isLoading }] = useEditPropertyImageMutation();
  const { toast } = useToast();
  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      image: "",
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
    formData.append("image", data.image);
    const res = await editImage({ body: formData, pin: pin });
    if ("data" in res) {
      setReplaceImage(false);
      if (image) setSavedImage(image);
      else setSavedImage(defaultImage);
      toast({
        title: "Image Updated",
        message: "The image has been updated successfully",
        type: "success",
      });
    } else {
      toast({
        title: "Error",
        message: "There was an error updating the image",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full h-full relative">
      <img
        src={savedImage}
        alt=""
        className="absolute top-0 left-0 w-full h-full"
      />
      <Dialog
        open={replaceImage}
        onOpenChange={(e) => {
          setImage(savedImage);
          setReplaceImage(e);
        }}
      >
        <DialogTrigger>
          <Button
            onClick={() => setReplaceImage(true)}
            className={`bg-white rounded-[8px] text-primary cursor-pointer hover:bg-white flex justify-center items-center gap-1  absolute top-2 right-2 p-1`}
          >
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
          <DialogHeader>
            <DialogTitle className="text-heading_1">Edit Image</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-20 items-center my-6">
              <div className="flex gap-4 items-center w-1/3 overflow-hidden">
                {image ? (
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    className="rounded-[8px] w-full h-full"
                  />
                ) : (
                  <Image
                    width="100%"
                    height="100%"
                    className="rounded-[8px]"
                    color="#80838E"
                  />
                )}

                {/* <p className="text-[#80838E]">{getValues("image.name")}</p> */}
              </div>
              <div className="flex gap-4">
                {image && (
                  <Button
                    onClick={() => {
                      setValue("image", "");
                      setImage("");
                    }}
                    className="bg-white rounded-[8px] h-[48px] text-black border border-[#CCCDD2] hover:bg-white  hover:text-black"
                  >
                    Delete
                  </Button>
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

            <DialogFooter className="!justify-start gap-2">
              <Button className="bg-primary rounded-[8px] text-white">
                {isLoading && <Loader />}
                <span>Save Image</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ReplacedImage.propTypes = {
  pickedImage: PropTypes.string,
  defaultImage: PropTypes.string,
  pin: PropTypes.string,
};

export default ReplacedImage;
