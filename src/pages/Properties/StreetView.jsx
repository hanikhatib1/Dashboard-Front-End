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
import React from "react";
import StreetViewMap from "./StreetViewMap";

const StreetView = ({ address }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} defaultOpen={open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="bg-white text-primary absolute bottom-0 left-0 m-2 p-2 rounded-[8px]"
        >
          Street View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1400px] bg-white !rounded-[8px]">
        <div>
          <StreetViewMap address={address} />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StreetView;
