import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setDocumentsCertificateErrorStatusAppealModel } from "@/redux/features/AppealSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useGetAppealDocumentsStatusMutation,
  useOpenToSendCertificateErrorMutation,
} from "@/redux/apiSlice";
import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

const DocumentsCertificateErrorStatus = ({ refetch }) => {
  const ref = useRef();
  const [useOpenToSendCertificateError, { isLoading: openToSendIsLoading }] =
    useOpenToSendCertificateErrorMutation();
  const { documentsCertificateErrorStatusAppealModel } = useSelector(
    (state) => state.appeals
  );
  const dispatch = useDispatch();
  const [getAppealsDocumentsStatus, { isLoading, isError, data }] =
    useGetAppealDocumentsStatusMutation();

  const handleOpenToSendCertificateError = async () => {
    const res = await useOpenToSendCertificateError(
      documentsCertificateErrorStatusAppealModel.id
    );
    if ("error" in res) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "error",
      });
      return;
    }
    if ("data" in res) {
      toast({
        title: "Success",
        description: "Open to send certificate error successfully",
        variant: "success",
      });
      dispatch(setDocumentsCertificateErrorStatusAppealModel(null));
      refetch();
    }
  };

  useEffect(() => {
    if (documentsCertificateErrorStatusAppealModel && !ref.current) {
      getAppealsDocumentsStatus(
        documentsCertificateErrorStatusAppealModel.signature_doc_id
      );
      ref.current = true;
    }
  }, [
    documentsCertificateErrorStatusAppealModel,
    documentsCertificateErrorStatusAppealModel.signature_doc_id,
    getAppealsDocumentsStatus,
  ]);

  return (
    <Dialog
      open={documentsCertificateErrorStatusAppealModel ?? false}
      onOpenChange={(open) =>
        dispatch(setDocumentsCertificateErrorStatusAppealModel(open))
      }
    >
      <DialogHeader>
        <DialogTitle>Certificate Error Status</DialogTitle>
      </DialogHeader>

      <DialogContent className="sm:max-w-[525px] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Certificate Error Status</DialogTitle>
        </DialogHeader>
        <div>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <p>Error</p>
          ) : (
            data && (
              <div className="py-8 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p>Form Name :</p>
                  <p className="text-[#80838E]">{data.doc_name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Status :</p>
                  <p className="bg-[#D9D9D9] text-[#80838E] px-2 py-1 rounded-[8px]">
                    {data.email_statuses[data.email_statuses.length - 1].status}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Send Date :</p>
                  <p className=" text-[#80838E] px-2 py-1 rounded-[8px]">
                    {data.doc_created_at}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Last Update Date :</p>
                  <p className=" text-[#80838E] px-2 py-1 rounded-[8px]">
                    {
                      data.email_statuses[data.email_statuses.length - 1]
                        .last_reaction_at
                    }
                  </p>
                </div>
                <Link
                  to={`${data.link}`}
                  target="_blank"
                  className="text-primary underline rounded-[8px] p-2 w-max"
                >
                  View Documents
                </Link>
                <hr />

                <div className="flex flex-col gap-4">
                  <p className="text-[#80838E]">
                    You can send this form to client
                  </p>
                  <div className="w-[180px]">
                    <Button
                      onClick={() => handleOpenToSendCertificateError()}
                      disable={openToSendIsLoading}
                      className="text-white rounded-[8px] "
                    >
                      {openToSendIsLoading ? "Sending..." : "Open to Send"}
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() =>
              dispatch(setDocumentsCertificateErrorStatusAppealModel(null))
            }
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentsCertificateErrorStatus;
