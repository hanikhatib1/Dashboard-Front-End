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
import { useDeleteInvoiceMutation } from "@/redux/apiSlice";
import { setDeleteInvoiceData } from "@/redux/features/Invoices";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

const DeleteInvoiceModel = ({ refetch }) => {
  const { deleteInvoiceData } = useSelector((state) => state.invoices);
  const dispatch = useDispatch();
  const [deleteInvoice, { isLoading }] = useDeleteInvoiceMutation();
  const { toast } = useToast();

  const handleDeleteInvoice = async () => {
    const res = await deleteInvoice(deleteInvoiceData.id);
    if ("error" in res)
      return toast({
        title: "Error",
        description: res.error.data.detail,
        variant: "error",
      });

    if ("data" in res) {
      dispatch(setDeleteInvoiceData(null));
      refetch();
    }
  };

  return (
    <Dialog
      open={deleteInvoiceData}
      defaultOpen={deleteInvoiceData}
      onOpenChange={(open) => dispatch(setDeleteInvoiceData(open))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Delete Appeal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100%-32px)] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Invoice</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this invoice?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-4 ">
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 rounded-[8px]  text-white"
            onClick={() => handleDeleteInvoice()}
          >
            {isLoading ? <Loader /> : <span>Delete</span>}
          </Button>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => dispatch(setDeleteInvoiceData(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

DeleteInvoiceModel.propTypes = {
  refetch: PropTypes.func,
};

export default DeleteInvoiceModel;
