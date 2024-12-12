import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteBlogMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";

const DeleteBlogModel = ({ deleteBlogData, setDeleteBlog, refetch }) => {
  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();
  const { toast } = useToast();

  const handleDeleteBlog = async () => {
    const res = await deleteBlog(deleteBlogData.id);
    if ("data" in res) {
      refetch();
      toast({
        title: "Blog Deleted",
        message: "Blog has been deleted successfully",
        type: "success",
      });
      setDeleteBlog(null);
    } else {
      toast({
        title: "Error",
        message: res.error.message,
        type: "error",
      });
    }
  };

  return (
    <Dialog
      open={deleteBlogData}
      defaultOpen={deleteBlogData}
      onOpenChange={(open) => setDeleteBlog(open)}
    >
      {/* <DialogTrigger asChild>
        <Button variant="outline">Delete Blog</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Blog</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this blog?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 rounded-[8px]  text-white"
            onClick={() => handleDeleteBlog()}
          >
            {isLoading ? <Loader /> : <span>Delete</span>}
          </Button>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => setDeleteBlog(null)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

DeleteBlogModel.propTypes = {
  deleteBlogData: PropTypes.object,
  setDeleteBlog: PropTypes.func,
  refetch: PropTypes.func,
};

export default DeleteBlogModel;
