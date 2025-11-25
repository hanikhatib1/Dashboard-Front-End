import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddBlogMutation } from "../../redux/apiSlice";
import TiptapEditor from "../ui/Editor";
import * as Yup from "yup";
import "../ui/tiptap.css";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import AIToolsSidebar from "../ui/AiTools/AIToolsSidebar";
import SeoAnalyzer from "../ui/AiTools/SeoAnalyzer";
import LivePreview from "../ui/LivePreview";
const AddBlog = () => {
  const [content, setContent] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const [image, setImage] = useState();
  const [addBlog, { isLoading }] = useAddBlogMutation();

  // const schema = Yup.object().shape({
  //   sort: Yup.number()
  //     .typeError("Sort must be a number")
  //     .required("Sort order is required")
  //     .min(1, "Sort order must be at least 1")
  //     .test("unique", "Sort order must be unique", (value) => {
  //       return !blogs?.data.some((blog) => blog.sort === value);
  //     }),
  // });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: "",
      title: "",
      description: "",
      metaDescription: "",
      sort: 0,
    },
    // resolver: yupResolver(schema),
  });
  // meta description validation
  const metaDescValue = watch("metaDescription") || "";
  const metaDescLength = metaDescValue.length;
  let color;
  if (metaDescLength < 70) {
    color = "#ecec5e";
  } else if (metaDescLength <= 155) {
    color = "green";
  } else {
    color = "red";
  }

  // ✅ أي تعديل في الـ editor يروح للـ description
  useEffect(() => {
    setValue("description", content);
  }, [content, setValue]);

  // upload cover image
  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const urlImage = URL.createObjectURL(file);
      setImage(urlImage);
      setValue("image", file);
    }
  };
  // send to backend
  const onSubmit = async (data) => {
    const form_data = new FormData();
    form_data.append("image", data.image);
    form_data.append("description", data.description);
    form_data.append("metaDescription", data.metaDescription);
    form_data.append("sort", data.sort);
    form_data.append("title", data.title);

    const res = await addBlog(form_data);
    if ("data" in res) {
      toast.success(res.data.message);
    } else {
      toast.error(res.error.data.message);
    }
  };

  // every change in editor
  const handleEditorChange = (html) => {
    setContent(html);
  };
  const title = watch("title"); 
  const metaDescription = watch("metaDescription");

  return (
    <section className="mt-5 px-5 pb-10">
      <div>
        <p className="sectionsTitle">Add New Blog</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-5">
          {/* =================== Title (Full Width) =================== */}
          <div className="col-span-6">
            <label className="block mb-2 text-sm font-medium text-gray">
              Title
            </label>
            <input
              {...register("title")}
              type="text"
              className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
              placeholder="Title"
              required
            />
          </div>
          {/* =================== Sort (Full Width) =================== */}
          <div className="col-span-6">
            {errors.sort && (
              <div className="validationBox">{errors.sort.message}</div>
            )}
            <label className="block mb-2 text-sm font-medium text-gray">
              Sort Order
            </label>
            <input
              {...register("sort")}
              type="number"
              className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
              placeholder="Sort Order"
              required
            />
          </div>
          {/* =================== Meta Description (Full Width) =================== */}
          <div className="col-span-6">
            <label className="block mb-2 text-sm font-medium text-gray">
              Meta Description
            </label>
            <textarea
              {...register("metaDescription")}
              rows="4"
              className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
              placeholder="Meta Description"
              required
            />
            <p className="text-sm mt-1 font-medium" style={{ color }}>
              {metaDescLength} / 155 characters
            </p>
          </div>
          {/* =================== Image (Full Width) =================== */}
          <div className="col-span-6">
            <label className="block mb-2 text-sm font-medium text-gray">
              Image Upload
            </label>
            {image ? (
              <>
                <input
                  onChange={(e) => handleUploadedFile(e)}
                  type="file"
                  id="file-inputt"
                  name="image"
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="file-inputt"
                  className="custom-file-label relative text-blue"
                >
                  Upload Image
                  <img
                    src={image}
                    alt="Preview"
                    className="rounded absolute inset-0 top-0 h-[107px] w-full object-cover"
                  />
                </label>
              </>
            ) : (
              <>
                <input
                  onChange={(e) => handleUploadedFile(e)}
                  type="file"
                  id="file-inputt"
                  name="image"
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="file-inputt"
                  className="custom-file-label text-center text-blue"
                >
                  Upload Image
                </label>
              </>
            )}
          </div>
          {/* =================== Editor + Live Preview (Two Columns) =================== */}
          <div className="col-span-12 grid grid-cols-12 gap-5">
            {/* Editor */}
            <div className="col-span-5">
              <label className="block mb-2 text-sm font-medium text-gray">
                Blog Content
              </label>
              <TiptapEditor
                onChange={handleEditorChange}
                onReady={(editor) => setEditorInstance(editor)}
              />
            </div>

            {/* Live Preview */}

            <div className="col-span-5 border mt-7 p-5 border-gray-300 rounded-xl bg-white shadow-lg overflow-hidden">
               <LivePreview content={content} />
              {/* <div
                className="blog-content max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
                
              /> */}
            </div>
            {/* ai section */}
            <div className="col-span-2 ">
              {editorInstance && <AIToolsSidebar editor={editorInstance} />}
              <SeoAnalyzer
                title={title}
                metaDescription={metaDescription}
                contentHtml={content}

               
              />
            </div>
          </div>

          {/* Submit */}
          <div className="col-span-12">
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isLoading ? <div className="spinner"></div> : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddBlog;
