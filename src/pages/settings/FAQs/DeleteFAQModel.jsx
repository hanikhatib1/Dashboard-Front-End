import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteFAQMutation } from "@/redux/apiSlice";
import { useDispatch } from "react-redux";

const DeleteFAQModel = ({ refetch, faq, setSelectedDeleteFAQ }) => {
  const { toast } = useToast();
  const [deleteFAQ, { isLoading }] = useDeleteFAQMutation();

  const handleDeleteAppeal = async () => {
    const res = await deleteFAQ(faq.id);
    if ("data" in res) {
      toast({
        title: "FAQ Deleted",
        description: "FAQ has been deleted successfully",
        type: "success",
      });
      refetch();
      setSelectedDeleteFAQ(null);
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: res.error.data.message || "Failed to delete FAQ",
        type: "error",
      });
    }
  };

  return (
    <Dialog
      open={faq}
      defaultOpen={faq}
      onOpenChange={(open) => setSelectedDeleteFAQ(open)}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Delete Question</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100%-32px)] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Question?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 rounded-[8px]  text-white"
            onClick={() => handleDeleteAppeal()}
          >
            {isLoading ? <Loader /> : <span>Delete</span>}
          </Button>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => setSelectedDeleteFAQ(null)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFAQModel;
