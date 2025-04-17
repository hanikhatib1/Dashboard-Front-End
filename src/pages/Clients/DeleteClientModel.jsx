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
import { useDeleteClientMutation } from "@/redux/apiSlice";
import { setDeleteClientData } from "@/redux/features/Clients";
import { useDispatch, useSelector } from "react-redux";

const DeleteClientModel = ({ refetch }) => {
  const { deleteClientData } = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const [deleteClient, { isLoading }] = useDeleteClientMutation();
  const { toast } = useToast();

  const deleteClientHandler = async () => {
    const res = await deleteClient(deleteClientData.id);
    console.log(res);
    if ("data" in res) {
      if (refetch) refetch();
      dispatch(setDeleteClientData(null));
      toast({
        title: "Client Deleted",
        description: "Client Deleted Successfully",
        type: "success",
      });
    } else
      toast({
        title: "Error",
        description: res.error.data.detail,
      });
  };

  return (
    <Dialog
      open={deleteClientData}
      defaultOpen={deleteClientData}
      onOpenChange={(open) => dispatch(setDeleteClientData(open))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Delete Client</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100%-32px)] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this client?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-4 ">
          <Button
            className="bg-red-500 hover:bg-red-600 rounded-[8px]  text-white"
            onClick={() => deleteClientHandler()}
          >
            {isLoading ? <Loader /> : <span>Delete</span>}
          </Button>
          <Button
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => dispatch(setDeleteClientData(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClientModel;
