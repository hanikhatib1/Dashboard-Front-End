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
import { useDeleteEmployeeMutation } from "@/redux/apiSlice";
import { setDeleteEmployeeData } from "@/redux/features/Employee";
import { useDispatch, useSelector } from "react-redux";

const DeleteEmployeeModel = ({ refetch }) => {
  const { deleteEmployeeData } = useSelector((state) => state.employee);
  const dispatch = useDispatch();
  const [deleteEmployee, { isLoading }] = useDeleteEmployeeMutation();
  const { toast } = useToast();

  const deleteEmployeeHandler = async () => {
    const res = await deleteEmployee(deleteEmployeeData.id);
    if ("data" in res) {
      if (refetch) refetch();
      toast({
        title: "Employee Deleted",
        description: "Employee Deleted Successfully",
        type: "success",
      });
      dispatch(setDeleteEmployeeData(null))
    } else
      toast({
        title: "Error",
        type: "error",
      });
  };

  return (
    <Dialog
      open={deleteEmployeeData}
      defaultOpen={deleteEmployeeData}
      onOpenChange={(open) => dispatch(setDeleteEmployeeData(open))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Delete Employee</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100%-32px)] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this employee?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-4 ">
          <Button
            className="bg-red-500 hover:bg-red-600 rounded-[8px]  text-white"
            onClick={() => deleteEmployeeHandler()}
          >
            {isLoading ? <Loader /> : <span>Delete</span>}
          </Button>
          <Button
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => dispatch(setDeleteEmployeeData(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEmployeeModel;
