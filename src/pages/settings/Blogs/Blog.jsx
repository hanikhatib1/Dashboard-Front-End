import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Blog = ({ blogData, setEditBlog, setDeleteBlog }) => {
  return (
    <div className="flex flex-col gap-6 h-[350px] w-[250px] relative">
      <div className="relative w-[225px] h-[200px] rounded-[8px] overflow-hidden border border-[#eee]">
        <img
          src={blogData.image}
          alt={blogData.title}
          className="absolute w-full h-full object-cover rounded-lg top-0 left-0"
        />
      </div>
      <div className="flex flex-col gap-1 relative">
        <p className="text-[#333333] text-[24px] leading-[150%] font-bold truncate">
          {blogData.title}
        </p>
        <p className="text-[#465668] text-[18px] leading-[150%] font-[400] truncate">
          {blogData.description}
        </p>
        <Link
          target="_blank"
          to={`${import.meta.env.VITE_PUBLIC_WEB_SITE_URL}/blogs/${blogData.id}`}
          className="text-[#4693D6] text-[16px] leading-[150%] underline"
        >
          Read More
        </Link>
        <div className="absolute top-0 cursor-pointer right-0 w-[40px] h-[40px] flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="!bg-white min-w-[180px]"
            >
              <DropdownMenuItem
                className="hover:bg-slate-100 cursor-pointer"
                onClick={() => setEditBlog(blogData)}
              >
                Edit{" "}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setDeleteBlog(blogData)}
                className="hover:bg-slate-100 cursor-pointer text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blogData: PropTypes.object,
  setEditBlog: PropTypes.func,
  setDeleteBlog: PropTypes.func,
};

export default Blog;
