import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAddBlogMutation } from "@/redux/apiSlice";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TiptapEditor from "./pages/settings/Blogs/TestBuilder/Editor";
import LivePreview from "./pages/settings/Blogs/TestBuilder/LivePreview";
import AIToolsSidebar from "./pages/settings/Blogs/TestBuilder/AIToolsSidebar";
import SeoAnalyzer from "./pages/settings/Blogs/TestBuilder/SeoAnalyzer";
import NewAddBlogBuilder from "./pages/settings/Blogs/NewAddBlogBuilder";

const HomeTest = () => {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [addBlog, { isLoading, reset }] = useAddBlogMutation();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);

  const {
    register,
    setValue,
    formState: { isValid },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      short_description: "",
      image: null,
      meta_description: "",
      rename_links: [],
    },
  });
  const title = watch("title");
  const metaDescription = watch("metaDescription");

  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    const urlImage = URL.createObjectURL(file);
    setImage(urlImage);
    setValue("image", file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    data.description = content;
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("description", content);

    console.log("Form Data:", data);
    const res = await addBlog(formData);
    if ("data" in res) {
      reset();
      toast({
        title: "Blog Added",
        message: "Blog has been added successfully",
        type: "success",
      });
      //refetch();
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

  const handleEditorChange = (html) => {
    setContent(html);
  };

  return <></>;
};

export default HomeTest;
