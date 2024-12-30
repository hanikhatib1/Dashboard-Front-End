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
import { useDeleteAppealMutation } from "@/redux/apiSlice";
import { setDeleteAppealData } from "@/redux/features/AppealSlice";
import { useDispatch, useSelector } from "react-redux";

const DeleteAppealModel = ({ refetch }) => {
  const dispatch = useDispatch();
  const { deleteAppealData } = useSelector((state) => state.appeals);
  const [deleteAppeal, { isLoading }] = useDeleteAppealMutation();
  const { toast } = useToast();

  const handleDeleteAppeal = async () => {
    const res = await deleteAppeal(deleteAppealData.id);
    if ("error" in res)
      return toast({
        title: "Error",
        description: "Something went wrong",
        variant: "error",
      });

    if ("data" in res) {
      dispatch(setDeleteAppealData(null));
      refetch();
    }
  };

  return (
    <Dialog
      open={deleteAppealData}
      defaultOpen={deleteAppealData}
      onOpenChange={(open) => dispatch(setDeleteAppealData(open))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Delete Appeal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Appeal</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this appeal?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
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
            onClick={() => dispatch(setDeleteAppealData(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAppealModel;
