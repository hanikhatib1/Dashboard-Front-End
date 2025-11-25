import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useEditBlogMutation,
  useGetOneBlogMutation,
} from "../../redux/apiSlice";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import TiptapEditor from "../ui/Editor";
import * as Yup from "yup";
import Loading from "../ui/loading";
import AIToolsSidebar from "../ui/AiTools/AIToolsSidebar";
import SeoAnalyzer from "../ui/AiTools/SeoAnalyzer";
import LivePreview from "../ui/LivePreview";
export default function EditBlogs() {
  const { id } = useParams();
  const [editBlog, { isLoading }] = useEditBlogMutation();
  const [content, setContent] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const [image, setImage] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {renaneLink: []},
  });
  const [getBlog] = useGetOneBlogMutation();
  const [blog, setBlog] = useState(null);
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

  const title = watch("title");
  const metaDescription = watch("metaDescription");
  // Fetch blog data
  async function fetchData() {
    if (!id) return;

    try {
      const res = await getBlog(id);
      if ("data" in res) {
        setBlog(res?.data.data); // save blog data in state
        console.log("Blog Data:", res.data);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);
  //   console.log(blog);
  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    // console.log(file);
    if (file) {
      const urlImage = URL.createObjectURL(file);
      setImage(urlImage); // Update local image preview
      setValue("image", file); // Set the file in the form state
    }
  };
  useEffect(() => {
    if (blog) {
      setValue("image", blog?.image);
      setValue("title", blog?.title);
      // setValue("description", blog?.description);
      setValue("metaDescription", blog?.metaDescription);
      setValue("sort", blog?.sort);
      setImage(blog.image);

      setContent(blog.description || "");
    }
  }, [setValue, blog]);

  useEffect(() => {
    setValue("description", content);
  }, [content, setValue]);
  const handleEditorChange = (html) => {
    setContent(html);
  };
  const onSubmit = async (data) => {
    // console.log(data);

    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("description", data.description);
    formData.append("metaDescription", data.metaDescription);
    formData.append("sort", data.sort);
    formData.append("title", data.title);
     formData.append("renaneLink", JSON.stringify(watch("renaneLink")));
    const res = await editBlog({ body: formData, id: blog._id });
    if ("data" in res) {
      console.log(res.data);
      toast.success(res.data.message);
    } else {
      console.log(res);
      toast.error(res.error.data.message);
    }
  };
  if (!blog) return <Loading />;
  return (
    <section className="mt-5 px-5 pb-10">
      <div>
        <p className="sectionsTitle">Edit Blog</p>
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
                content={content}
                onChange={handleEditorChange}
                onReady={(editor) => setEditorInstance(editor)}
              />
            </div>

            {/* Live Preview */}

            <div className="col-span-5 border mt-7 p-5 border-gray-300 rounded-xl bg-white shadow-lg overflow-hidden">
             <LivePreview content={content} />
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
              {isLoading ? <div className="spinner"></div> : "Edit"}
            </button>
          </div>
        </div>
      </form>
    </section>

    // <section className="mt-5 px-5 pb-10">
    //   <div>
    //     <p className="sectionsTitle">Edit Blog</p>
    //   </div>

    //   <div className="grid grid-cols-12 gap-5">
    //     {/* ✅ Form */}
    //     <div className="col-span-6">
    //       <form onSubmit={handleSubmit(onSubmit)}>
    //         {/* Image Upload */}
    //          <div>
    //             {image ? (
    //               <>
    //                 <input
    //                   onChange={(e) => handleUploadedFile(e)}
    //                   type="file"
    //                   id="file-inputt"
    //                   name="image"
    //                   accept="image/*"
    //                   style={{ display: "none" }}
    //                 />
    //                 <label
    //                   htmlFor="file-inputt"
    //                   className="custom-file-label relative"
    //                 >
    //                   Upload Image
    //                   <img
    //                     src={image}
    //                     alt="Image Preview"
    //                     className="rounded absolute inset-0 top-0 h-25 w-full object-cover"
    //                   />
    //                 </label>
    //               </>
    //             ) : (
    //               <>
    //                 <input
    //                   onChange={(e) => handleUploadedFile(e)}
    //                   type="file"
    //                   id="file-inputt"
    //                   name="image"
    //                   accept="image/*"
    //                   style={{ display: "none" }}
    //                 />
    //                 <label
    //                   htmlFor="file-inputt"
    //                   className="custom-file-label text-center"
    //                 >
    //                   Upload Image
    //                 </label>
    //               </>
    //             )}
    //           </div>

    //         {/* Title */}
    //         <div className="mt-2">
    //           <label className="block mb-2 text-sm font-medium text-gray">
    //             Title
    //           </label>
    //           <input
    //             {...register("title")}
    //             type="text"
    //             className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
    //             placeholder="Title"
    //             required
    //           />
    //         </div>

    //         {/* Meta Description */}
    //         <div className="mt-2">
    //           <label className="block mb-2 text-sm font-medium text-gray">
    //             Meta Description
    //           </label>
    //           <textarea
    //             {...register("metaDescription")}
    //             rows="4"
    //             className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
    //             placeholder="Meta Description"
    //           />
    //         </div>

    //         {/* Sort Order */}
    //         <div className="mt-2">
    //           {errors.sort && (
    //             <div className="validationBox">{errors.sort.message}</div>
    //           )}
    //           <label className="block mb-2 text-sm font-medium text-gray">
    //             Sort Order
    //           </label>
    //           <input
    //             {...register("sort")}
    //             type="number"
    //             className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
    //             placeholder="Sort Order"
    //             required
    //           />
    //         </div>

    //         {/* ✅ Editor */}
    //         <div className="mt-4">
    //           <label className="block mb-2 text-sm font-medium text-gray">
    //             Blog Content
    //           </label>
    //          <TiptapEditor content={content} onChange={handleEditorChange} />

    //         </div>

    //         {/* ✅ Submit */}
    //         <button
    //           type="submit"
    //           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    //         >
    //           Save Blog
    //         </button>
    //       </form>
    //     </div>

    //     {/* ✅ Live Preview */}
    //     <div className="col-span-6 border p-3 rounded bg-gray-50 overflow-auto">
    //       <h3 className="text-lg font-semibold mb-2">Live Preview</h3>

    //       <div
    //         className="blog-content max-w-none"
    //         dangerouslySetInnerHTML={{ __html: content }}
    //       />
    //     </div>
    //   </div>
    // </section>
  );
}
