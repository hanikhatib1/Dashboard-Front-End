import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Plus, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { formatDate } from "date-fns";
import { useAddClientMutation } from "../../redux/apiSlice";
import "react-day-picker/style.css";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import PropTypes from "prop-types";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import DatePicker from "react-datepicker";
import AddressSearch from "@/components/AddressSearch";

const AddNewClientModal = ({ buttonClassName, refetch }) => {
  const [addressData, setAddressData] = useState({
    city: "",
    state: "",
    zip_code: "",
    address: "",
  });
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState();
  const { toast } = useToast();
  const [addClient, { isLoading }] = useAddClientMutation();
  const [hasEntity, setHasEntity] = useState(false);

  const { handleSubmit, register, setValue, watch } = useForm({
    defaultValues: {
      image: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      birth_date: null,
      annual_income: 0,
      disability_year: null,
      Veteran: false,
      disability: false,
      entity_name: "",
      relation_ship: "",
      entity_type: "",
    },
  });

  const onSubmit = async (data) => {
    const obj = data;
    Object.keys(obj).forEach(
      (key) => obj[key] === "" || (obj[key] === null && delete obj[key])
    );
    obj.phone = obj.phone.split("-").join("").substring(0, 10);
    if (obj.annual_income) {
      obj.annual_income = obj.annual_income
        .toString()
        .replace("$", "")
        .split(",")
        .join("");
    }

    const object = new FormData();
    for (const key in obj) {
      object.append(key, data[key]);
    }

    const res = await addClient(object);
    if ("data" in res) {
      if (refetch) refetch();
      toast({
        title: "Client Added",
        description: "Client Added Successfully",
        type: "success",
      });
      setOpen(false);
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
    Object.keys(addressData).forEach((key) => {
      setValue(key, addressData[key]);
    });
  }, [addressData, setValue]);

  return (
    <Dialog defaultOpen={open} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="!flex-1">
        <Button
          className={`bg-primary rounded-[8px] text-white flex justify-center items-center gap-1 ${buttonClassName}`}
          onClick={() => setOpen(true)}
        >
          <Plus color="#ffffff" />
          <p>Add New Client</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form>
          <DialogHeader>
            <DialogTitle className="text-heading_1">Add New Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/*  */}
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
                  <label htmlFor="phone" className="text-body text-[#80838E]">
                    Phone
                  </label>
                  <Input
                    id="phone"
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
                  <AddressSearch setAddressData={setAddressData} />
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
                  <label
                    htmlFor="Zip_Code"
                    className="text-body text-[#80838E]"
                  >
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
                      className="w-[310px] h-[48px] rounded-[8px] border !flex-1 px-2"
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
                        setValue(
                          "birth_date",
                          formatDate(previousDay, "yyyy-MM-dd")
                        );
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
                        <SelectValue placeholder="No" />
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
                        <SelectValue placeholder="No" />
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
                              <SelectValue />
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
              onClick={handleSubmit(onSubmit)}
              className="bg-primary rounded-[8px] text-white"
            >
              {isLoading && <Loader />}
              <span>Save Client</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddNewClientModal.propTypes = {
  buttonClassName: PropTypes.string,
};

export default AddNewClientModal;
