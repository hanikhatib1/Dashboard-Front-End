import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setEditAppealData } from "@/redux/features/AppealSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateAppealMutation } from "@/redux/apiSlice";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import PropTypes from "prop-types";
import Fill_EDIT_API from "./PDFs/Fill_EDIT_API";
import AppealStatusSelect from "./AppealStatusSelect";
import UploadFile from "./UploadFile";
import DownloadedFileItem from "./DownloadedFileItem";
import { Input } from "@/components/ui/input";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AppealPDF from "@/AppealPDF";
import { Download } from "lucide-react";

const EditAppeal = ({ fetchData }) => {
  const [open, setOpen] = useState(true);
  const { editAppealData } = useSelector((state) => state.appeals);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [ccoaFile, setCcoaFile] = useState(null);
  const [borFile, setBorFile] = useState(null);
  const [lourFile, setLourFile] = useState(null);
  const [ranFile, setRanFile] = useState(null);
  const [sqFile, setSqFile] = useState(null);
  const [saFile, setSaFile] = useState(null);
  const [anFile, setAnFile] = useState(null);

  const [status, setStatus] = useState({ status: "New" });
  const [updateAppeal, { isLoading }] = useUpdateAppealMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      ccoa: "",
      bor: "",
      sa: "",
      lour: "",
      ran: null,
      sq: null,
      an: null,
      deleted_ccoa: "", // editAppealData.ccoa ? editAppealData.ccoa.real_id :
      deleted_bor: "", // editAppealData.bor ? editAppealData.bor.real_id :
      deleted_sa: "",
      deleted_lour: "",
      deleted_ran: "",
      deleted_sq: "",
      deleted_an: "",
      note: editAppealData.note ? editAppealData.note : "",
      appeal_status_id: editAppealData.appeal_status_id
        ? editAppealData.appeal_status_id
        : 1,
      appeal_number: editAppealData?.appeal_number
        ? editAppealData?.appeal_number
        : "",
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      /* if(data[key] === null) continue */
      formData.append(key, data[key]);
    }

    const res = await updateAppeal({
      id: editAppealData.id,
      body: formData,
    });

    if ("data" in res) {
      if (fetchData) fetchData();
      toast({
        title: "Success",
        description: "Appeal updated successfully",
        variant: "success",
      });

      setOpen(false);

      dispatch(setEditAppealData(null));
    }

    if ("error" in res) {
      toast({
        title: "Error",
        description: "Error updating appeal",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      Object.keys(errors).forEach((key) => {
        toast({
          title: "Error",
          description: errors[key].message,
          variant: "error",
        });
      });
    }
  }, [errors]);

  useEffect(() => {
    console.log(editAppealData);
    setStatus(editAppealData?.appeal_status);
  }, [editAppealData]);

  const sampleData = {
    taxpayer: "Carmen Servin",
    address: "2612 Harvey Ave, Berwyn, IL 60402",
    pin: "16-29-302-023-0000",
    attorneyId: "11352",
    attorneyName: "Hani H. Khatib",
    seller: "Juan Valerio Corpus",
    buyer: "Carmen Servin",
    purchaseDate: "May 03, 2024",
    purchasePrice: 296000,
    landAV: 46310,
    buildingAV: 249690,
    totalAV: 296000,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
  };

  return (
    <Dialog
      defaultOpen={editAppealData}
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        dispatch(setEditAppealData(null));
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-heading_1">Edit Appeal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 ">
            <div className="border-b pb-5 flex flex-col gap-3">
              <p>Files</p>
              <div className="flex flex-wrap flex-col gap-5">
                {editAppealData.ccoa && (
                  <DownloadedFileItem
                    title="POA CCA :"
                    file={editAppealData.ccoa}
                    deletedFileValue={watch("deleted_ccoa")}
                    setValue={setValue}
                    deletedFileKey="deleted_ccoa"
                  />
                )}
                {editAppealData.bor && (
                  <DownloadedFileItem
                    title="POA BOR :"
                    file={editAppealData.bor}
                    deletedFileValue={watch("deleted_bor")}
                    setValue={setValue}
                    deletedFileKey="deleted_bor"
                  />
                )}
                {editAppealData.lour && (
                  <DownloadedFileItem
                    title="Report :"
                    file={editAppealData.lour}
                    deletedFileValue={watch("deleted_lour")}
                    setValue={setValue}
                    deletedFileKey="deleted_lour"
                  />
                )}

                {editAppealData.ran && (
                  <DownloadedFileItem
                    title="Residential Appeal Narrative :"
                    file={editAppealData.ran}
                    deletedFileValue={watch("deleted_ran")}
                    setValue={setValue}
                    deletedFileKey="deleted_ran"
                  />
                )}

                {editAppealData.sq && (
                  <DownloadedFileItem
                    title="Sales Questionnaire :"
                    file={editAppealData.sq}
                    deletedFileValue={watch("deleted_sq")}
                    setValue={setValue}
                    deletedFileKey="deleted_sq"
                  />
                )}
                {editAppealData.sa && (
                  <DownloadedFileItem
                    title="Representation Agreement :"
                    file={editAppealData.sa}
                    deletedFileValue={watch("deleted_sa")}
                    setValue={setValue}
                    deletedFileKey="deleted_sa"
                  />
                )}
                {editAppealData.an && (
                  <DownloadedFileItem
                    title="Board of Review Appeal :"
                    file={editAppealData.an}
                    deletedFileValue={watch("deleted_an")}
                    setValue={setValue}
                    deletedFileKey="deleted_an"
                  />
                )}
              </div>
            </div>
            <div className="pb-5 flex flex-col gap-3">
              <p>Export Files</p>

              <Fill_EDIT_API
                client_email={editAppealData.client_email}
                pin1={editAppealData.pin1}
                pin2={editAppealData.pin2}
                pin3={editAppealData.pin3}
                appeal_number={editAppealData.appeal_number}
                appeal_id={editAppealData.id}
              />
            </div>

            <div className="pb-5 flex flex-col gap-3">
              <p>Import Files</p>
              <div className="flex flex-col flex-wrap gap-6">
                <UploadFile
                  file={ccoaFile}
                  setFile={setCcoaFile}
                  title="Import POA CCA"
                  setValue={setValue}
                  _key={"ccoa"}
                />
                <UploadFile
                  file={borFile}
                  setFile={setBorFile}
                  title="Import POA BOR"
                  setValue={setValue}
                  _key={"bor"}
                />
                <UploadFile
                  file={lourFile}
                  setFile={setLourFile}
                  title="Import Report"
                  setValue={setValue}
                  _key={"lour"}
                />
                <UploadFile
                  file={saFile}
                  setFile={setSaFile}
                  title="Import Representation Agreement"
                  setValue={setValue}
                  _key={"sa"}
                />
                <UploadFile
                  file={ranFile}
                  setFile={setRanFile}
                  title="Import RAN"
                  setValue={setValue}
                  _key={"ran"}
                />
                <UploadFile
                  file={sqFile}
                  setFile={setSqFile}
                  title="Import Sales Questionnaire"
                  setValue={setValue}
                  _key={"sq"}
                />
                <UploadFile
                  file={anFile}
                  setFile={setAnFile}
                  //title="Import Appeal Narrative"
                  title="Import Board of Review Appeal"
                  setValue={setValue}
                  _key={"an"}
                />
              </div>
            </div>

            <div className="sm:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
              <label
                htmlFor="appeal_number"
                className="text-body text-[#80838E]"
              >
                Appeal Number
              </label>
              <Input
                id="appeal_number"
                type="text"
                className="rounded-[8px] h-[48px]"
                name="appeal_number"
                {...register("appeal_number")}
              />
            </div>

            <AppealStatusSelect
              status={status}
              setStatus={setStatus}
              setValue={setValue}
              keyOfValue="appeal_status_id"
            />

            <div>
              <label htmlFor="notes" className="text-body">
                Notes
              </label>
              <textarea
                id="notes"
                value={watch("note")}
                className="w-full h-[100px] border rounded-[8px] p-2"
                {...register("note")}
                name="note"
              ></textarea>
            </div>
          </div>

          <DialogFooter className="!justify-start gap-2">
            <Button
              type="submit"
              className="bg-primary rounded-[8px] w-[250px] text-white"
            >
              {isLoading ? <Loader /> : <span>Save Changes</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditAppeal.propTypes = {
  fetchData: PropTypes.func,
};

export default EditAppeal;
