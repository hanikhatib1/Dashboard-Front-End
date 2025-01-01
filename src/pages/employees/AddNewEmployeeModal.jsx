import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Plus, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddEmployeeMutation,
  useGetPermissionsQuery,
} from "@/redux/apiSlice";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import AddressSearch from "@/components/AddressSearch";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";

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

const AddNewEmployeeModal = () => {
  const [image, setImage] = useState();
  const [open, setOpen] = useState(false);
  const [groupPermissionName, setGroupPermissionName] = useState("");
  const [addressData, setAddressData] = useState({
    city: "",
    state: "",
    zip_code: "",
    address: "",
  });
  const { toast } = useToast();
  const { data: permissions, isSuccess: isPermissionsSuccess } =
    useGetPermissionsQuery();
  const [addEmployee, { isLoading }] = useAddEmployeeMutation();
  const { handleSubmit, register, getValues, setValue, watch } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      start_date: "2024-01-01",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      group_permission_id: "",
    },
  });

  const onSubmit = async (data) => {
    data['phone'] = data['phone'].split("-").join("");
    const form_data = new FormData();
    for (var key in data) {
      form_data.append(key, data[key]);
    }

    const res = await addEmployee(form_data);
    if ("data" in res) {
      setOpen(false);
      toast({
        title: "Success",
        description: res.data.message,
        variant: "success",
      });
    } else
      toast({
        title: "Error",
        description: res.error.data.detail
          ? res.error.data.detail
          : "Something went wrong",
        variant: "error",
      });
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
    <Dialog open={open} defaultOpen={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <Button
          className="bg-primary rounded-[8px] text-white flex justify-center items-center gap-1"
          onClick={() => setOpen(true)}
        >
          <Plus color="#ffffff" />
          <p>Add New Employee</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-heading_1">
              Add New Employee{" "}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-heading_3 text-[#80838E]">
                Profile Picture Upload{" "}
              </p>
              <div className="flex gap-4 items-center mt-6">
                <div className="flex gap-4 items-center w-1/3 overflow-hidden">
                  {getValues("image.name") ? (
                    <img
                      src={URL.createObjectURL(getValues("image"))}
                      className="border rounded-full w-[56px] h-[56px]"
                    />
                  ) : (
                    <UserRound
                      width={56}
                      height={56}
                      className="border rounded-full"
                    />
                  )}

                  <p className="text-[#80838E]">{getValues("image.name")}</p>
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
              <p className="text-heading_3">Employee Information</p>

              <div className="flex gap-4 flex-wrap justify-between my-4">
                <CustomInput
                  label="First Name"
                  name="First_Name"
                  register={register("first_name")}
                />
                <CustomInput
                  label="Last Name"
                  name="Last_Name"
                  register={register("last_name")}
                />
                <CustomInput
                  label="Email Address"
                  name="Email_Address"
                  type="email"
                  register={register("email")}
                />
                {/* <CustomInput
                  label="Phone"
                  name="Phone "
                  register={register("phone")}
                /> */}
                <div className="sm:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
                  <label htmlFor="Phone" className="text-body text-[#80838E]">
                    Phone
                  </label>
                  <Input
                    id="Phone"
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="phone"
                    value={formatPhoneNumber(watch('phone'))}
                    onChange={e => setValue('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-heading_3">Address</p>

              <div className="flex gap-4 flex-wrap justify-between my-4">
                <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2 h-[48px]">
                  <AddressSearch setAddressData={setAddressData} />
                </div>

                <CustomInput
                  label="City"
                  name="City"
                  register={register("city")}
                />
                <div className="sm:w-[calc(50%-4px)] w-full flex justify-between gap-0 flex-2">
                  <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                    <label htmlFor={name} className="text-body text-[#80838E]">
                      State
                    </label>
                    <Input
                      id="State"
                      type="text"
                      className="rounded-[8px] h-[48px]"
                      name="state"
                      {...register("state")}
                    />
                  </div>
                  <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                    <label htmlFor="" className="text-body text-[#80838E]">
                      Zip Code
                    </label>
                    <Input
                      id="Zip_Code"
                      type="text"
                      className="rounded-[8px] h-[48px]"
                      name="Zip_Code"
                      {...register("zip_code")}
                    />
                  </div>
                </div>
                {isPermissionsSuccess && (
                  <div className="sm:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
                    <label
                      htmlFor="User_Group"
                      className="text-body text-[#80838E]"
                    >
                      User Permission
                    </label>
                    <Select
                      className="rounded-[8px] sm:w-[calc(50%-16px)] w-full"
                      {...register("group_permission_id")}
                      onValueChange={(value) => {
                        setValue("group_permission_id", value);
                        const getPermissionValue = permissions.data.find(
                          (permission) => permission.id == value
                        );

                        setGroupPermissionName(getPermissionValue.name);
                      }}
                    >
                      <SelectTrigger className="rounded-[8px] h-[48px]">
                        <SelectValue placeholder={groupPermissionName}>
                          {groupPermissionName}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-[8px] bg-white">
                        <SelectGroup>
                          {permissions.data.map((permission) => (
                            <SelectItem
                              key={permission.id}
                              value={permission.id}
                              onClick={() => {
                                console.log(permission.id);
                              }}
                            >
                              {permission.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="!justify-start gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary rounded-[8px] text-white flex gap-1"
            >
              {isLoading && <Loader />}

              <span>Save Employee</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewEmployeeModal;
