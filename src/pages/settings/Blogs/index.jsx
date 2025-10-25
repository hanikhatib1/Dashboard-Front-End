import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Edit, User } from "lucide-react";
import Blog from "./Blog";
import { useGetAllBlogsQuery, useGetBlogsInfoQuery } from "@/redux/apiSlice";
import Loader from "@/components/Loader";
import AddBlogModel from "./AddBlogModel";
import EditModel from "./EditModel";
import DeleteBlogModel from "./DeleteBlogModel";
import Pagination from "@/components/Pagination";

const Blogs = () => {
  const [page, setPage] = useState(1);
  const { data, isFetching, isError, refetch } = useGetAllBlogsQuery(
    `sort=-date&limit=20&page=${page}`
  );
  const {
    data: blogInfo,
    isLoading: blogInfoLoading,
    isError: blogInfoError,
  } = useGetBlogsInfoQuery();
  const [editBlog, setEditBlog] = React.useState(null);
  const [deleteBlog, setDeleteBlog] = React.useState(null);

  useEffect(() => {
    refetch(`sort=-date&limit=20&page=${page}`);
    window.scrollTo(0, {
      top: 0,
      behavior: "smooth",
    });
  }, [page, refetch]);

  return (
    <div className="p-8 flex flex-col gap-8">
      {blogInfoLoading ? (
        <Loader />
      ) : blogInfoError ? (
        <div>Error</div>
      ) : (
        blogInfo && (
          <div className="flex flex-col md:flex-row gap-8">
            <Card
              item={{
                title: "Total Blogs",
                Value: blogInfo.data.total_blogs,
                icon: <Edit width={50} height={50} color="#4693D6" />,
              }}
            />
            <Card
              item={{
                title: "Users",
                Value: blogInfo.data.total_intster,
                icon: (
                  <User width={50} height={50} color="#4693D6" opacity={50} />
                ),
              }}
            />
          </div>
        )
      )}

      <div className="flex justify-end">
        <AddBlogModel refetch={refetch} />
      </div>
      <div className="flex flex-wrap gap-6 justify-center md:justify-start min-h-[40vh]">
        {isFetching ? (
          <Loader />
        ) : isError ? (
          <div>Error</div>
        ) : (
          data &&
          data.data.length > 0 &&
          data.data.map((item) => (
            <Blog
              key={item.id}
              blogData={item}
              setEditBlog={setEditBlog}
              setDeleteBlog={setDeleteBlog}
            />
          ))
        )}
      </div>
      {data && (
        <Pagination
          page={data.pagination.page}
          setPage={setPage}
          total_pages={data.pagination.total_pages}
        />
      )}
      {editBlog && (
        <EditModel
          editBlogData={editBlog}
          setEditBlog={setEditBlog}
          refetch={refetch}
        />
      )}
      {deleteBlog && (
        <DeleteBlogModel
          deleteBlogData={deleteBlog}
          setDeleteBlog={setDeleteBlog}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default Blogs;
