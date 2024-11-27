import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { useEditClientMutation } from "../../redux/apiSlice";
import "react-day-picker/style.css";

const CustomInput = ({ register, name, label, type = "text", ...props }) => {
  return (
    <div className="sm:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
      <label htmlFor={name} className="text-body text-[#80838E]">
        {label}
      </label>
      <Input
        id={name}
        type={type}
        className="rounded-[8px] h-[48px]"
        name={name}
        {...register}
      />
    </div>
  );
};
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setEditClientData, updateClientById } from "@/redux/features/Clients";
import Loader from "@/components/Loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import DatePicker from "react-datepicker";
import { reverseDate } from "@/utiles/revserDate";
import { formatDate } from "date-fns";
import AddressSearch from "@/components/AddressSearch";

const EditClientModal = ({ onClose, setClient }) => {
  const [image, setImage] = useState();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { editClientData } = useSelector((state) => state.clients);
  const [editClient, { isLoading }] = useEditClientMutation();
  const [hasEntity, setHasEntity] = useState(false);
  const [addressData, setAddressData] = useState({
    city: editClientData.city,
    state: editClientData.state,
    zip_code: editClientData.zip_code,
    address: editClientData.address,
  });
  const { handleSubmit, register, setValue, watch } = useForm({
    defaultValues: { ...editClientData, image: "" },
  });
  const onSubmit = async (data) => {
    const newData = { ...editClientData, ...data };
    delete data.id;
    delete data.start_date;
    delete data.properties;
    delete data.property_count;
    delete data.verified;
    delete data.disability_date;
    delete data.role;

    if (data?.annual_income !== "") {
      data.annual_income = data.annual_income
        .toString()
        .replace("$", "")
        .split(",")
        .join("");
    }

    for (const key in data) {
      if (data[key] === null) delete data[key];
    }

    const object = new FormData();
    for (const key in data) {
      object.append(key, data[key]);
    }

    const res = await editClient({
      id: editClientData.id,
      body: object,
    });

    console.log("res", res);
    if ("data" in res) {
      toast({
        title: "Success",
        description: "Client updated successfully",
        type: "success",
      });
      if (setClient) setClient(res.data.data);
      if (onClose) onClose();
      dispatch(setEditClientData(null));
      dispatch(updateClientById(newData));
    } else {
      toast({
        title: "Error",
        description: res.error.data.detail
          ? res.error.data.detail
          : "Something went wrong",
      });
    }
  };

  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    const urlImage = URL.createObjectURL(file);
    setImage(urlImage);
    setValue("image", file);
  };

  useEffect(() => {
    if (editClientData) {
      setImage(editClientData.image);
      if (editClientData.entity_name) setHasEntity(true);
    }
  }, [editClientData]);

  useEffect(() => {
    if (!hasEntity) {
      setValue("entity_name", null);
      setValue("relation_ship", null);
      setValue("entity_type", null);
    } else {
      setValue("entity_name", editClientData.entity_name);
      setValue("relation_ship", editClientData.relation_ship);
      setValue("entity_type", editClientData.entity_type);
    }
  }, [
    editClientData.entity_name,
    editClientData.entity_type,
    editClientData.relation_ship,
    hasEntity,
    setValue,
  ]);

  useEffect(() => {
    Object.keys(addressData).forEach((key) => {
      setValue(key, addressData[key]);
    });
  }, [addressData, setValue]);

  return (
    <Dialog
      defaultOpen={editClientData}
      onOpenChange={() => {
        if (onClose) onClose();
        dispatch(setEditClientData(null));
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form>
          <DialogHeader>
            <DialogTitle className="text-heading_1">Edit Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-heading_3 text-[#80838E]">
                Profile Picture Upload{" "}
              </p>
              <div className="flex gap-4 items-center mt-6">
                <div className="flex gap-4 items-center w-1/3 overflow-hidden">
                  {image ? (
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      className="border rounded-full w-[56px] h-[56px]"
                    />
                  ) : (
                    <UserRound
                      width={56}
                      height={56}
                      className="border rounded-full"
                    />
                  )}

                  {/* <p className="text-[#80838E]">{getValues("image.name")}</p> */}
                </div>
                <div className="flex gap-4">
                  {image && (
                    <Button
                      onClick={() => {
                        setValue("image", "");
                        setImage("");
                      }}
                      className="bg-white rounded-[8px] h-[48px] text-black border border-[#CCCDD2] hover:bg-white  hover:text-black"
                    >
                      Delete
                    </Button>
                  )}

                  <div className="bg-primary rounded-[8px] text-white h-[48px] leading-[48px]">
                    <label
                      htmlFor="upload_image"
                      className="bg-primary rounded-[8px] text-white p-2 h-[48px]"
                    >
                      Upload Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      name="image"
                      id="upload_image"
                      onChange={handleUploadedFile}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/*  */}
            <div>
              <p className="text-heading_3">Client Information</p>

              <div className="flex gap-4 flex-wrap justify-between my-4">
                <CustomInput
                  label="First Name"
                  name="First_Name"
                  register={register("first_name", {
                    required: true,
                  })}
                />
                <CustomInput
                  label="Last Name"
                  name="Last_Name"
                  register={register("last_name", {
                    required: true,
                  })}
                />
                <CustomInput
                  label="Email Address"
                  name="Email_Address"
                  type="email"
                  register={register("email", {
                    required: true,
                  })}
                />

                <div className="sm:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
                  <label htmlFor={name} className="text-body text-[#80838E]">
                    Phone
                  </label>
                  <Input
                    id={name}
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="Phone "
                    value={formatPhoneNumber(watch("phone"))}
                    onChange={(e) => {
                      setValue("phone", e.target.value.split("-").join(""));
                    }}
                  />
                </div>
              </div>
            </div>
            {/*  */}
            <div>
              <p className="text-heading_3">Address</p>

              <div className="flex gap-4 flex-wrap justify-between my-4">
                <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2 h-[48px]">
                  <AddressSearch
                    setAddressData={setAddressData}
                    defaultAddress={editClientData.address}
                  />
                </div>
                <CustomInput
                  label="City"
                  name="City"
                  register={register("city", {
                    required: true,
                  })}
                />
                <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                  <label htmlFor="State" className="text-body text-[#80838E]">
                    State
                  </label>
                  <Input
                    id="State"
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="state"
                    {...register("state", {
                      required: true,
                    })}
                  />
                </div>
                <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                  <label htmlFor={name} className="text-body text-[#80838E]">
                    Zip Code
                  </label>
                  <Input
                    id="Zip_Code"
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="Zip_Code"
                    {...register("zip_code", {
                      required: true,
                      maxLength: 5,
                    })}
                  />
                </div>
              </div>
            </div>
            {/*  */}
            <div>
              <p className="text-heading_3">Info</p>

              <div className="flex gap-4 flex-wrap justify-between my-4">
                <div className="sm:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
                  <label
                    htmlFor="Annual_Income"
                    className="text-body text-[#80838E]"
                  >
                    Annual Income
                  </label>
                  <Input
                    id="Annual_Income"
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="annual income"
                    value={`$ ${Number(watch("annual_income").toString().replace("$", "").split(",").join("")).toLocaleString()}`}
                    onChange={(e) => {
                      setValue("annual_income", e.target.value);
                    }}
                  />
                </div>
                <div className="sm:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
                  <label
                    htmlFor="User_Group"
                    className="text-body text-[#80838E]"
                  >
                    Disability Year{" "}
                  </label>
                  <div className="flex justify-between items-center gap-2">
                    <DatePicker
                      selected={watch("disability_year")}
                      onChange={(date) => setValue("disability_year", date)}
                      renderYearContent={(year) => {
                        const tooltipText = `Tooltip for year: ${year}`;
                        return <span title={tooltipText}>{year}</span>;
                      }}
                      showYearPicker
                      dateFormat="yyyy"
                      className="w-[310px] h-[48px] rounded-[8px] border flex-1 px-2"
                    />
                    <Trash2
                      className="cursor-pointer text-gray-400"
                      onClick={() => {
                        setValue("disability_year", null);
                      }}
                    />
                  </div>
                </div>

                <div className="md:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
                  <label
                    htmlFor="User_Group"
                    className="text-body text-[#80838E]"
                  >
                    Birth Date{" "}
                  </label>
                  <div className="flex justify-between items-center gap-2">
                    <DatePicker
                      selected={watch("birth_date")}
                      onChange={(date) => {
                        const previousDay = new Date(date);
                        previousDay.setDate(previousDay.getDate() + 1);
                        setValue("birth_date", formatDate(previousDay, "yyyy-MM-dd"));
                      }}
                      renderYearContent={(year) => {
                        const tooltipText = `Tooltip for year: ${year}`;
                        return <span title={tooltipText}>{year}</span>;
                      }}
                      dateFormat="MM-dd-yyyy"
                      className="w-[310px] h-[48px] rounded-[8px] border !flex-1 px-2"
                    />
                    <Trash2
                      className="cursor-pointer text-gray-400"
                      onClick={() => {
                        setValue("birth_date", null);
                      }}
                    />
                  </div>
                </div>

                <div className="md:w-[calc(50%-16px)] w-full flex justify-between gap-2 flex-2">
                  <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                    <label
                      htmlFor="Disabled"
                      className="text-body text-[#80838E]"
                    >
                      Disabled
                    </label>
                    <Select onValueChange={(e) => setValue("disability", e)}>
                      <SelectTrigger className="w-full h-[48px] rounded-[8px]">
                        <SelectValue
                          placeholder={editClientData.disability ? "Yes" : "No"}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem value="false">No</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                    <label
                      htmlFor="Disabled"
                      className="text-body text-[#80838E]"
                    >
                      Veteran
                    </label>
                    <Select onValueChange={(e) => setValue("Veteran", e)}>
                      <SelectTrigger className="w-full h-[48px] rounded-[8px]">
                        <SelectValue
                          placeholder={editClientData.Veteran ? "Yes" : "No"}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem value="false">No</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <Collapsible open={hasEntity}>
                <CollapsibleTrigger className="w-full flex justify-between">
                  <p>Entity</p>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    <div className="flex gap-4 flex-wrap justify-between my-4">
                      <CustomInput
                        label="Entity Name"
                        name="entity_name"
                        register={register("entity_name", {
                          required: hasEntity,
                        })}
                      />
                      <CustomInput
                        label="Relation Ship"
                        name="relation_ship"
                        register={register("relation_ship", {
                          required: hasEntity,
                        })}
                      />
                      <div className="md:w-[calc(50%-16px)] w-full flex justify-between gap-2 flex-2">
                        <div className=" w-full flex flex-col gap-2 flex-2">
                          <label
                            htmlFor="Disabled"
                            className="text-body text-[#80838E]"
                          >
                            Entity Type
                          </label>
                          <Select
                            onValueChange={(e) => setValue("entity_type", e)}
                          >
                            <SelectTrigger className="w-full h-[48px] rounded-[8px]">
                              <SelectValue
                                placeholder={editClientData.entity_type}
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectGroup>
                                <SelectItem value="llc">LLC</SelectItem>
                                <SelectItem value="corporation">
                                  Corporation
                                </SelectItem>
                                <SelectItem value="partnership">
                                  Partnership
                                </SelectItem>
                                <SelectItem value="estate">Estate</SelectItem>
                                <SelectItem value="trust">Trust</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <RadioGroup
                name="entity"
                value={hasEntity}
                className="flex gap-2 items-center self-start"
              >
                <RadioGroupItem value={true} onClick={() => setHasEntity(true)}>
                  Yes
                </RadioGroupItem>
                Yes
                <RadioGroupItem
                  value={false}
                  onClick={() => setHasEntity(false)}
                >
                  No
                </RadioGroupItem>
                No
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="!justify-start gap-2">
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="bg-primary rounded-[8px] text-white"
            >
              {isLoading && <Loader />}
              <span>Save Changes</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
