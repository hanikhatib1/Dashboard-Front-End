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
import {
  useDeleteBlogMutation,
  useDeleteWorkerMutation,
} from "@/redux/apiSlice";
import PropTypes from "prop-types";

const DeleteWorkerModel = ({ deletedWorker, setDeletedWorker, refetch }) => {
  const [deleteWorker, { isLoading }] = useDeleteWorkerMutation();
  const { toast } = useToast();

  const handleDeleteBlog = async () => {
    const res = await deleteWorker(deletedWorker.id);
    if ("data" in res) {
      refetch();
      toast({
        title: "Worker Deleted",
        description: "Worker has been deleted successfully",
        type: "success",
      });
      setDeletedWorker(null);
    } else {
      toast({
        title: "Error",
        description: res.error.message,
        type: "error",
      });
    }
  };

  return (
    <Dialog
      open={deletedWorker}
      defaultOpen={deletedWorker}
      onOpenChange={(open) => setDeletedWorker(open)}
    >
      <DialogContent className="sm:max-w-[425px] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Worker</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Worker?
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
            onClick={() => setDeletedWorker(null)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

DeleteWorkerModel.propTypes = {
  deletedWorker: PropTypes.object,
  setDeletedWorker: PropTypes.func,
  refetch: PropTypes.func,
};

export default DeleteWorkerModel;
