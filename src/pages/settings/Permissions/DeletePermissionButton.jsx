import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDeletePermissionMutation } from "@/redux/apiSlice";

const DeletePermissionButton = ({ id }) => {
  const [deletePermission, { isLoading: deletePermissionLoading }] =
    useDeletePermissionMutation();
  const { toast } = useToast();
  const handleDeletePermission = async () => {
    const res = await deletePermission(id);
    if ("data" in res)
      toast({
        title: "Success",
        description: "Permission deleted successfully",
        type: "success",
      });
    else
      toast({
        title: "Error",
        description: "Failed to delete permission",
        type: "success",
      });
  };
  return (
    <Button
      onClick={() => handleDeletePermission()}
      className="flex gap-2 items-center text-primary border border-primary rounded-[8px] !bg-white"
    >
      {deletePermissionLoading ? <Loader /> : "Delete"}
    </Button>
  );
};

export default DeletePermissionButton;
