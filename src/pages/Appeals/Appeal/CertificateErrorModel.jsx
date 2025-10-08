import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSendCertificateErrorOfAppealMutation } from "@/redux/apiSlice";
import { setCertificateErrorAppealData } from "@/redux/features/AppealSlice";
import { useDispatch, useSelector } from "react-redux";

const CertificateErrorModel = ({ refetch }) => {
  const dispatch = useDispatch();
  const { certificateErrorAppealData } = useSelector((state) => state.appeals);
  const [sendCertificateErrorOfAppeal, { isLoading }] =
    useSendCertificateErrorOfAppealMutation();
  const { toast } = useToast();

  const handleSendCertificateErrorOfAppeal = async () => {
    const res = await sendCertificateErrorOfAppeal(
      certificateErrorAppealData.id
    );
    if ("error" in res)
      return toast({
        title: "Error",
        description: "Something went wrong",
        variant: "error",
      });

    if ("data" in res) {
      toast({
        title: "Success",
        description: "Send certificate error successfully",
        variant: "error",
      });
      dispatch(setCertificateErrorAppealData(null));
      refetch();
    }
  };

  return (
    <Dialog
      open={certificateErrorAppealData}
      defaultOpen={certificateErrorAppealData}
      onOpenChange={(open) => dispatch(setCertificateErrorAppealData(open))}
    >
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100%-32px)] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Send Certificate Error</DialogTitle>
          <DialogDescription>
            Are you sure you want to send the certificate error of this appeal?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 rounded-[8px]  text-white"
            onClick={() => handleSendCertificateErrorOfAppeal()}
          >
            {isLoading ? <Loader /> : <span>Send</span>}
          </Button>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => dispatch(setCertificateErrorAppealData(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateErrorModel;
