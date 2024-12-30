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
import { setFormsAppeal } from "@/redux/features/AppealSlice";
import { useDispatch, useSelector } from "react-redux";
import Fill_Form_Client from "./PDFs/Fill_Form_Client";

const SendFormModel = () => {
  const dispatch = useDispatch();
  const { formsAppeal } = useSelector((state) => state.appeals);

  return (
    <Dialog
      open={formsAppeal}
      defaultOpen={formsAppeal}
      onOpenChange={(open) => dispatch(setFormsAppeal(open))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Appeal Forms</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white !rounded-[8px] flex flex-col gap-10 p-4">
        <DialogHeader>
          <DialogTitle>Send Forms</DialogTitle>
          <DialogDescription>
            Are you sure you want to send forms for this appeal?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Fill_Form_Client
            pin1={formsAppeal.pin1}
            pin2={formsAppeal.pin2}
            pin3={formsAppeal.pin3}
            client_email={formsAppeal.client_email}
          />
          <Button
            type="submit"
            className="bg-white rounded-[8px]  text-primary border border-primary hover:bg-primary hover:text-white"
            onClick={() => dispatch(setFormsAppeal(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendFormModel;
