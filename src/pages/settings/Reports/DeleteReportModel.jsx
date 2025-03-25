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
import { useDeleteReportMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";

const DeleteReportModel = ({ deletedReport, setDeletedReport, refetch }) => {
  const [deleteReport, { isLoading }] = useDeleteReportMutation();
  const { toast } = useToast();

  const handleDeleteBlog = async () => {
    const res = await deleteReport(deletedReport.id);
    if ("data" in res) {
      refetch();
      toast({
        title: "Worker Deleted",
        description: "Worker has been deleted successfully",
        type: "success",
      });
      setDeletedReport(null);
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
      open={deletedReport}
      defaultOpen={deletedReport}
      onOpenChange={(open) => setDeletedReport(open)}
    >
      <DialogContent className="sm:max-w-[425px] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Report</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Report?
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
            onClick={() => setDeletedReport(null)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

DeleteReportModel.propTypes = {
  deletedReport: PropTypes.object,
  setDeletedReport: PropTypes.func,
  refetch: PropTypes.func,
};

export default DeleteReportModel;
