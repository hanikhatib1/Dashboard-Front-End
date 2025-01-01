import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setDocumentsStatusAppealModel } from "@/redux/features/AppealSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Fill_Form_Client from "./PDFs/Fill_Form_Client";
import { useGetAppealDocumentsStatusMutation } from "@/redux/apiSlice";
import { useEffect } from "react";
import { formatDate } from "date-fns";

const DocumentsStatusAppealModel = () => {
  const { documentsStatusAppealModel } = useSelector((state) => state.appeals);
  const dispatch = useDispatch();
  const [getAppealsDocumentsStatus, { isLoading, isError, data }] =
    useGetAppealDocumentsStatusMutation();

  useEffect(() => {
    if (documentsStatusAppealModel) {
      getAppealsDocumentsStatus(documentsStatusAppealModel.signature_doc_id);
    }
  }, [
    documentsStatusAppealModel,
    documentsStatusAppealModel.signature_doc_id,
    getAppealsDocumentsStatus,
  ]);

  return (
    <Dialog
      open={documentsStatusAppealModel ?? false}
      onOpenChange={(open) => dispatch(setDocumentsStatusAppealModel(open))}
    >
      <DialogHeader>
        <DialogTitle>Signature Status</DialogTitle>
      </DialogHeader>

      <DialogContent
        className="sm:max-w-[525px] bg-white !rounded-[8px]"
      >
        <DialogHeader>
          <DialogTitle>Signature Status</DialogTitle>
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
                    {data.email_statuses[data.email_statuses.length - 1].last_reaction_at

                    }
                  </p>
                </div>
                <Link
                  to={`${data.link}`}
                  target="_blank"
                  className="text-primary underline rounded-[8px] p-2"
                >
                  View Documents
                </Link>
                <hr />

                <div className="flex flex-col gap-4">
                  <p className="text-[#80838E]">
                    You can send this form to client
                  </p>
                  <div className="w-[180px]">
                    <Fill_Form_Client
                      pin1={documentsStatusAppealModel.pin1}
                      pin2={documentsStatusAppealModel.pin2}
                      pin3={documentsStatusAppealModel.pin3}
                      client_email={documentsStatusAppealModel.client_email}
                      isOpenToSendDocument={true}
                      text="Send Form again"
                      className="bg-white rounded-[8px]  !text-primary border border-primary hover:bg-primary hover:!text-white py-2"
                    />
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
            onClick={() => dispatch(setDocumentsStatusAppealModel(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentsStatusAppealModel;
