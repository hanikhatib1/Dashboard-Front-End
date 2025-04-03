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
import { useMigrateTownshipMutation } from "@/redux/apiSlice";
import { setMigrateTownshipData } from "@/redux/features/Township";
import { useDispatch, useSelector } from "react-redux";

const MigrateTownship = () => {
  const dispatch = useDispatch();
  const { migrateTownshipData } = useSelector((state) => state.townships);
  const [migrateTownship, { isLoading }] = useMigrateTownshipMutation();
  const { toast } = useToast();

  const handleDeleteAppeal = async () => {
    const res = await migrateTownship(migrateTownshipData.id);
    if ("error" in res)
      return toast({
        title: "Error",
        description: res.error.data.detail,
        variant: "error",
      });

    if ("data" in res) {
      dispatch(setMigrateTownshipData(null));
      toast({
        title: "Success",
        description: "Township migrated successfully",
        variant: "success",
      });
    }
  };
  return (
    <Dialog
      open={migrateTownshipData}
      defaultOpen={migrateTownshipData}
      onOpenChange={(open) => dispatch(setMigrateTownshipData(open))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Migrate Township</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Migrate Township</DialogTitle>
          <DialogDescription>
            Are you sure you want to migrate this township?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 rounded-[8px]  text-white"
            onClick={() => handleDeleteAppeal()}
          >
            {isLoading ? <Loader /> : <span>Migrate</span>}
          </Button>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => dispatch(setMigrateTownshipData(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MigrateTownship;
