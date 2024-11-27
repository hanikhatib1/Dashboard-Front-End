import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteStatusMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";

const DeleteStatusButton = ({ refetch, status }) => {
  const [deleteStatus, { isLoading: isLoadingDelete }] =
    useDeleteStatusMutation();
  const { toast } = useToast();

  const handleDeleteStatus = async (id) => {
    try {
      const res = await deleteStatus(id);
      if ("error" in res)
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "error",
        });
      if ("data" in res) {
        toast({
          title: "Success",
          description: "Status deleted successfully",
          variant: "success",
        });
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      className="flex gap-2 items-center text-primary border-primary border rounded-[8px] bg-white hover:!bg-white  px-4 py-2 cursor-pointer"
      onClick={() => handleDeleteStatus(status.id)}
    >
      {isLoadingDelete ? "Loading..." : "Delete"}
    </Button>
  );
};

DeleteStatusButton.propTypes = {
  refetch: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
};

export default DeleteStatusButton;
