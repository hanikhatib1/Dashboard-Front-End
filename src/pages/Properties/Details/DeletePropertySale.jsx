import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDeletePropertySaleMutation } from "@/redux/apiSlice";
import { steDeletePurchaseProperty } from "@/redux/features/Properties";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";

const DeletePropertySale = () => {
  const [deleteProperty, { isLoading }] = useDeletePropertySaleMutation();
  const { deletePurchaseProperty } = useSelector((state) => state.properties);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleDeleteAppeal = async () => {
    const res = await deleteProperty(deletePurchaseProperty.id);
    if ("error" in res)
      return toast({
        title: "Error",
        description: "Something went wrong",
        variant: "error",
      });

    if ("data" in res) {
      dispatch(steDeletePurchaseProperty(null));
    }
  };

  return (
    <Dialog
      open={deletePurchaseProperty}
      onOpenChange={(open) => dispatch(steDeletePurchaseProperty(open))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Delete Appeal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100%-32px)] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Property Sale</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this property sale?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-4 ">
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
            onClick={() => dispatch(steDeletePurchaseProperty(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePropertySale;
