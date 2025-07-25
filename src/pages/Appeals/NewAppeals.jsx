import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { Download, Edit2, Plus, Trash2 } from "lucide-react";
import PropertyAppealCard from "./PropertyAppealCard";
import PinInput from "./PinInput";
import { useForm } from "react-hook-form";
import AddNewClientModal from "../Clients/AddNewClientModal";
import SearchPropertiesComponent from "../Properties/SearchProperties";
import SearchClient from "./SearchClient";
import PropTypes from "prop-types";
import { useAddAppealMutation } from "@/redux/apiSlice";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FillPOC_CCA from "./PDFs/FillPOC_CCA";
import FillPOC_BOR from "./PDFs/FillPOC_BOR";

import UploadFile from "./UploadFile";
import AppealStatusSelect from "./AppealStatusSelect";
import Fill_SA from "./PDFs/Fill_SA";
import Fill_Appeal_Narrative from "./PDFs/Fill_Appeal_Narrative";
import Fill_Sales_Questions from "./PDFs/Fill_Sales_Questions";
import Fill_EDIT_API from "./PDFs/Fill_EDIT_API";
import EditClientModal from "../Clients/EditClientModal";
import { setEditClientData } from "@/redux/features/Clients";
import { useDispatch } from "react-redux";
import Fill_All_PDFs from "./PDFs/Fill_All_PDFs";
import { Input } from "@/components/ui/input";

const schema = yup
  .object({
    pin1: yup.string().required("Please choose a property"),
    client_id: yup.string().required("Please choose a client"),
  })
  .required();

const NewAppeals = ({
  buttonClassName,
  defaultProperty = null,
  hasIcon = true,
  textButton = "Add New Appeal",
  fetchData,
  fillByAPI = false,
}) => {
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState(defaultProperty);
  const [client, setClient] = useState(null);
  const [addAppeal, { isLoading }] = useAddAppealMutation();
  const { toast } = useToast();
  const [status, setStatus] = useState({ status: "New" });
  const [ccoaFile, setCcoaFile] = useState(null);
  const [borFile, setBorFile] = useState(null);
  const [lourFile, setLourFile] = useState(null);
  const [ranFile, setRanFile] = useState(null);
  const [sqFile, setSqFile] = useState(null);
  const [saFile, setSaFile] = useState(null);
  const [anFile, setAnFile] = useState(null);

  const dispatch = useDispatch();
  const [openEditClientModel, setOpenEditClientModel] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      pin1: "",
      pin2: "",
      pin3: "",
      client_id: null,
      ccoa: null,
      bor: null,
      lour: null,
      sa: null,
      ran: null,
      sq: null,
      an: null,
      note: "",
      appeal_status_id: 1,
      appeal_number: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      /* if (data[key] === null) continue; */
      formData.append(key, data[key]);
    }
    const res = await addAppeal(formData);
    if ("error" in res)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "error",
      });
    if ("data" in res) {
      if (fetchData) fetchData();
      toast({
        title: "Success",
        description: "Appeal added successfully",
        variant: "success",
      });
      setOpen(false);
    }
  };
  const handleOpenEditClient = () => {
    setOpenEditClientModel(true);
    dispatch(setEditClientData(client));
  };

  useEffect(() => {
    if (property) setValue("pin1", property.pin);
    else setValue("pin1", null);
  }, [property]);

  useEffect(() => {
    if (client) {
      setValue("client_id", client.id);
    } else {
      setValue("client_id", null);
      dispatch(setEditClientData(null));
      setOpenEditClientModel(false);
    }
  }, [client]);

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

  return (
    <Dialog defaultOpen={open} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`bg-primary rounded-[8px] text-white flex justify-center items-center gap-1 ${buttonClassName}`}
          onClick={() => setOpen(true)}
        >
          {hasIcon && <Plus color="#ffffff" />}

          <p>{textButton}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-heading_1">Add New Appeal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="h-[52px] flex items-center justify-center relative">
              <SearchPropertiesComponent
                className="z-20 !max-w-full flex-1"
                containerClassName="flex-1 w-full"
                isState
                setProperty={setProperty}
              />
            </div>
            {property && (
              <PropertyAppealCard
                property={property}
                setProperty={setProperty}
              />
            )}

            <div className="flex gap-4">
              <PinInput
                label="Pin 2"
                register={register}
                name="pin2"
                setValue={setValue}
                value={watch("pin2")}
              />
              <PinInput
                label="Pin 3"
                register={register}
                name="pin3"
                setValue={setValue}
                value={watch("pin3")}
              />
            </div>
            <div className="flex gap-4">
              <SearchClient setClient={setClient} />
              <AddNewClientModal buttonClassName="w-[120px] h-[40px] flex-1" />
            </div>
            {client && (
              <div className="flex gap-4 justify-between items-center w-full border p-2 rounded-[8px]">
                <div>
                  <p className="text-body ">{`${client.first_name} ${client.last_name}`}</p>
                  <p className="text-body text-[#80838E]">{client.email}</p>
                </div>
                <div className="flex gap-6">
                  <Edit2
                    color="#80838E"
                    onClick={() => handleOpenEditClient()}
                    className="cursor-pointer"
                  />
                  <Trash2
                    color="#80838E"
                    onClick={() => setClient(null)}
                    className="cursor-pointer"
                  />
                </div>
                {openEditClientModel && (
                  <EditClientModal
                    client={client}
                    onClose={() => setOpenEditClientModel(false)}
                    setClient={setClient}
                  />
                )}
              </div>
            )}

            <div className="border-b pb-5 flex flex-col gap-3 relative">
              <p>Export Files</p>
              {fillByAPI ? (
                <Fill_EDIT_API
                  client_email={client?.email ?? ""}
                  pin1={property.pin}
                  pin2={watch("pin2")}
                  pin3={watch("pin3")}
                  appeal_number={watch("appeal_number")}
                  appeal_id={""}
                />
              ) : (
                <div className="flex flex-wrap [&>div]:w-full  md:[&>div]:w-[calc(50%-16px)] gap-6">
                  <FillPOC_CCA
                    property={property}
                    client={client}
                    pin2={watch("pin2")}
                    pin3={watch("pin3")}
                    appeal_number={watch("appeal_number")}
                  />
                  <FillPOC_BOR
                    property={property}
                    client={client}
                    pin2={watch("pin2")}
                    pin3={watch("pin3")}
                    appeal_number={watch("appeal_number")}
                  />
                  <Fill_SA
                    property={property}
                    client={client}
                    pin2={watch("pin2")}
                    pin3={watch("pin3")}
                    appeal_number={watch("appeal_number")}
                  />
                  <Fill_Appeal_Narrative
                    property={property}
                    client={client}
                    pin2={watch("pin2")}
                    pin3={watch("pin3")}
                    appeal_number={watch("appeal_number")}
                  />
                  <Fill_Sales_Questions
                    property={property}
                    client={client}
                    pin2={watch("pin2")}
                    pin3={watch("pin3")}
                    appeal_number={watch("appeal_number")}
                  />
                  <Fill_All_PDFs
                    property={property}
                    client={client}
                    pin2={watch("pin2")}
                    pin3={watch("pin3")}
                    appeal_number={watch("appeal_number")}
                  />
                  <div
                    className={`flex gap-2 !p-1 !bg-white !text-black items-center  border border-white `}
                  >
                    <Download color="#80838E" />
                    <p className={`text-[16px] font-medium text-[#80838E]`}>
                      Export Board of Review Appeal
                    </p>
                  </div>
                </div>
              )}
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
                  title="Import Residential Appeal Narrative"
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
                {/* ///// */}
                <UploadFile
                  file={anFile}
                  setFile={setAnFile}
                  //title="Import Appeal Narrative"
                  title="Board of Review Appeal"
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
                className="w-full h-[100px] border rounded-[8px] p-2"
                {...register("note")}
                name="notes"
              ></textarea>
            </div>
          </div>
          <DialogFooter className="!justify-start gap-2">
            <Button
              type="submit"
              className="bg-primary rounded-[8px] w-[250px] text-white"
            >
              {isLoading ? <Loader /> : <span>Save</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
NewAppeals.propTypes = {
  buttonClassName: PropTypes.string,
  defaultProperty: PropTypes.object,
  hasIcon: PropTypes.bool,
  textButton: PropTypes.string,
  fetchData: PropTypes.func,
};

export default NewAppeals;
