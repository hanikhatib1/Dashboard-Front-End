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
import { useState } from "react";

const whichPDF = [
  {
    id: 1,
    key: "all",
    name: "All Forms",
    pages: [0, 1, 2, 3, 4],
  },
  {
    id: 2,
    key: "cca",
    name: "Attorney / Representative Authorization Form",
    pages: [0, 1],
    type: "cca",
  },
  {
    id: 3,
    key: "bor",
    name: "BOR Authorization Form",
    pages: [2],
  },
  {
    id: 4,
    key: "ra",
    name: "Representation Agreement",
    pages: [3, 4],
  },
];

const SendFormModel = () => {
  const dispatch = useDispatch();
  const { formsAppeal, formsAppealArray } = useSelector(
    (state) => state.appeals
  );

  const [selectedPDF, setSelectedPDF] = useState(whichPDF[0]);

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
          <div className="flex flex-col gap-2">
            {whichPDF.map((pdf) => (
              <Button
                key={pdf.id}
                variant={selectedPDF.key === pdf.key ? "default" : "outline"}
                onClick={() => setSelectedPDF(pdf)}
                className={`!capitalize w-full justify-start ${
                  selectedPDF.key === pdf.key ? "bg-primary text-white" : ""
                }`}
              >
                {pdf.name}
              </Button>
            ))}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Fill_Form_Client
            pin1={formsAppeal.pin1}
            pin2={formsAppeal.pin2}
            pin3={formsAppeal.pin3}
            client_email={formsAppeal.client_email}
            appeals={
              typeof formsAppeal === "object"
                ? [
                    {
                      pin1: formsAppeal.pin1,
                      pin2: formsAppeal.pin2,
                      pin3: formsAppeal.pin3,
                      client_email: formsAppeal.client_email,
                      id: formsAppeal?.id,
                    },
                  ]
                : formsAppealArray
            }
            appealId={formsAppeal?.id}
            selectedPDF={selectedPDF}
            sendWithOutPDF
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
