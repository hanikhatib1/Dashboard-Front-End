import BlogDescription from "@/components/BlogDescription";
import Loader from "@/components/Loader";
import { useGetOneBlogQuery } from "@/redux/apiSlice";
import { formatDateMonth } from "@/utiles/formatDateMonth";
import { useParams } from "react-router-dom";

const BlogPage = () => {
  const { id } = useParams();
  const { data: blogData, isLoading, isError } = useGetOneBlogQuery(id);
  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  if (isError) return <div className="text-red-500">Error loading blog</div>;

  return (
    blogData && (
      <div className="flex flex-col gap-6 py-3 px-10">
        <div className="flex justify-between bg-[#FFF8F6] px-6 items-center py-3 rounded-[20px]">
          <h1 className="font-[700] text-[#181A20] text-[22px] md:text-[40px] flex-1">
            {blogData.data.title}
          </h1>
          <div className="w-[65px] h-[65ox] rounded-[8px] bg-white shadow-md flex flex-col items-center justify-center">
            <p className="font-[400] text-[#181A20] text-[13px]">
              {formatDateMonth(blogData.data.date).month}
            </p>
            <p className="font-[600] text-[#181A20] text-[20px]">
              {formatDateMonth(blogData.data.date).day}
            </p>
          </div>
        </div>
        <div className="relative w-full h-[330px] md:h-[600px] rounded-[20px] p-6 bg-[#FFF8F6]">
          <div className="w-full h-full relative rounded-[20px] overflow-hidden">
            <img
              alt={blogData.data?.alt_image || "Blog Image"}
              src={blogData.data.image}
              className="w-full h-full object-contain absolute top-0 left-0 "
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <p className="font-[500] text-[#181A20] text-[22px] md:text-[28px] leading-[120%] bg-[#FFF8F6] px-6 items-center py-3 rounded-[20px]">
            {blogData.data.short_description}
          </p>
          <div className="bg-[#FFF8F6] px-6 items-center py-3 rounded-[20px]">
            <BlogDescription
              description={blogData.data.description}
              renameLinks={blogData.data.rename_links || []}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default BlogPage;
