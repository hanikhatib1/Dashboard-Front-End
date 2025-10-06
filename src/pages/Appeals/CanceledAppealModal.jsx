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
import { toast } from "@/components/ui/use-toast";
import { useUpdateAppealMutation } from "@/redux/apiSlice";
import {
  setCanceledAppeal,
  setLastAppealIdUpdated,
} from "@/redux/features/AppealSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CanceledAppealModal = () => {
  const dispatch = useDispatch();
  const { canceledAppeal } = useSelector((state) => state.appeals);
  const [updateAppeal, { isLoading }] = useUpdateAppealMutation();
  const [reason, setReason] = useState("No Comparables");

  const handleChangeReason = async (_reason) => {
    setReason(_reason);
    /* console.log("Reason for canceling appeal:", {
      ...canceledAppeal,
      body: { ...canceledAppeal?.body, cancel_reason: _reason },
    }); */
  };

  const handleCancelAppeal = async () => {
    const defaultValue = { ...canceledAppeal?.body, cancel_reason: reason };
    const formData = new FormData();
    Object.keys(defaultValue).forEach((key) => {
      formData.append(key, defaultValue[key]);
    });
    const res = await updateAppeal({
      id: canceledAppeal.id,
      body: formData,
    });
    if ("data" in res) {
      toast({
        title: "Success",
        description: "Status updated successfully",
        variant: "success",
      });
      dispatch(setCanceledAppeal(null));
      dispatch(setLastAppealIdUpdated(`${canceledAppeal.id}-${Date.now()}`));
    } else {
      toast({
        title: "Error",
        description: res.error.data?.detail || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={canceledAppeal}
      defaultOpen={canceledAppeal}
      onOpenChange={(open) => dispatch(setCanceledAppeal(open))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Cancel Appeal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100%-32px)] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Cancel Appeal</DialogTitle>
          <DialogDescription>
            What is the reason for canceling the appeal?
          </DialogDescription>
        </DialogHeader>
        <div>
          {/* make three check bok for there reasons */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="reason"
                value="No Comparables"
                className="cursor-pointer w-[18px] h-[18px]"
                onChange={(e) => handleChangeReason(e.target.value)}
                checked={reason === "No Comparables"}
              />
              <label className="cursor-pointer">No Comparables</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="reason"
                value="Filed with someone else"
                className="cursor-pointer w-[18px] h-[18px]"
                onChange={(e) => handleChangeReason(e.target.value)}
                checked={reason === "Filed with someone else"}
              />
              <label className="cursor-pointer">Filed with someone else</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="reason"
                value="Failure to continue"
                className="cursor-pointer w-[18px] h-[18px]"
                onChange={(e) => handleChangeReason(e.target.value)}
                checked={reason === "Failure to continue"}
              />
              <label className="cursor-pointer">Failure to continue</label>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 rounded-[8px]  text-white"
            onClick={() => handleCancelAppeal()}
          >
            {isLoading ? <Loader /> : <span>Cancel Appeal</span>}
          </Button>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => dispatch(setCanceledAppeal(null))}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CanceledAppealModal;
