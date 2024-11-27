import Loader from "@/components/Loader";
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
import { useRemoveDuplicatePropertiesMutation } from "@/redux/apiSlice";

import { useState } from "react";
import { Button } from "react-day-picker";

const DuplicateProperties = () => {
  const [open, setOpen] = useState(false);
  const [removeDuplicateProperties, { isLoading }] =
    useRemoveDuplicatePropertiesMutation();
  const { toast } = useToast();
  const handleRemoveDuplicateProperties = async () => {
    const res = await removeDuplicateProperties();
    if ("error" in res) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "error",
      });
    } else {
      toast({
        title: "Success",
        description:
          "Duplicated Properties removed successfully Process in Background",
        variant: "success",
      });
    }
  };

  return (
    <Dialog open={open} defaultOpen={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-500 p-3 border rounded-[8px]"
        >
          Remove Duplicated Properties
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Remove Duplicated Properties</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove Duplicated Properties?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 rounded-[8px] py-2 px-4  text-white"
            onClick={() => handleRemoveDuplicateProperties()}
          >
            {isLoading ? <Loader /> : <span>Remove Duplicated Properties</span>}
          </Button>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  py-2 px-4 text-white"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateProperties;
