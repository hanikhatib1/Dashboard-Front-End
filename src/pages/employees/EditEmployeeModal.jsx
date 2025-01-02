import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { UserRound } from "lucide-react";
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
  useEditEmployeeMutation,
  useGetPermissionsQuery,
} from "@/redux/apiSlice";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditEmployeeData,
  updateEmployeeById,
} from "@/redux/features/Employee";
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

const EditEmployeeModal = () => {
  const [image, setImage] = useState();
  const { toast } = useToast();
  const { editEmployeeData } = useSelector((state) => state.employee);
  const [groupPermissionName, setGroupPermissionName] = useState("");
  const [addressData, setAddressData] = useState({
    city: editEmployeeData.city,
    state: editEmployeeData.state,
    zip_code: editEmployeeData.zip_code,
    address: editEmployeeData.address,
  });
  const dispatch = useDispatch();
  const [editEmployee, { isLoading }] = useEditEmployeeMutation();
  const { handleSubmit, register, setValue, watch } = useForm({
    defaultValues: {
      first_name: editEmployeeData.first_name,
      last_name: editEmployeeData.last_name,
      email: editEmployeeData.email,
      phone: editEmployeeData.phone ? editEmployeeData.phone : "",
      start_date: editEmployeeData.start_date,
      address: editEmployeeData.address,
      city: editEmployeeData.city,
      state: editEmployeeData.state,
      zip_code: editEmployeeData.zip_code ? editEmployeeData.zip_code : "",
      group_permission_id:
        editEmployeeData.role === "super_admin"
          ? 1
          : editEmployeeData.group_permission
            ? editEmployeeData.group_permission.id
            : "",
    },
  });
  const { data: permissions, isSuccess: isPermissionsSuccess } =
    useGetPermissionsQuery();

  const onSubmit = async (data) => {
    const newData = { ...editEmployeeData, ...data };
    const form_data = new FormData();
    for (var key in data) {
      form_data.append(key, data[key]);
    }

    const res = await editEmployee({
      id: editEmployeeData.id,
      body: form_data,
    });

    if ("data" in res) {
      toast({
        title: "Success",
        description: res.data.message,
        variant: "success",
      });
      dispatch(setEditEmployeeData(null));
      dispatch(updateEmployeeById(newData));
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
    if (editEmployeeData) {
      setImage(editEmployeeData.image);
      setGroupPermissionName(
        editEmployeeData.group_permission
          ? editEmployeeData.group_permission.name
          : ""
      );
    }
  }, [editEmployeeData]);

  useEffect(() => {
    Object.keys(addressData).forEach((key) => {
      setValue(key, addressData[key]);
    });
  }, [addressData, setValue]);

  return (
    <Dialog
      defaultOpen={editEmployeeData}
      onOpenChange={() => {
        dispatch(setEditEmployeeData(null));
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-heading_1">
              Edit New Employee{" "}
            </DialogTitle>
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
                <div className="sm:w-[calc(50%-16px)] w-full flex flex-col gap-2 flex-2">
                  <label htmlFor="Phone" className="text-body text-[#80838E]">
                    Phone
                  </label>
                  <Input
                    id="Phone"
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="phone"
                    value={ (watch("phone"))}
                    onChange={(e) => setValue("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-heading_3">Address</p>

              <div className="flex gap-4 flex-wrap justify-between my-4">
                <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2 h-[48px]">
                  <AddressSearch
                    setAddressData={setAddressData}
                    defaultAddress={addressData.address}
                  />
                </div>
                <CustomInput
                  label="City"
                  name="City"
                  register={register("city")}
                />
                <div className="sm:w-[calc(50%-4px)] w-full flex justify-between gap-0 flex-2">
                  <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                    <label htmlFor="state" className="text-body text-[#80838E]">
                      State
                    </label>
                    <Input
                      id="state"
                      type="text"
                      className="rounded-[8px] h-[48px]"
                      name="state"
                      {...register("state")}
                    />
                  </div>
                  <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                    <label
                      htmlFor="zip_code"
                      className="text-body text-[#80838E]"
                    >
                      Zip Code
                    </label>
                    <Input
                      id="zip_code"
                      type="text"
                      className="rounded-[8px] h-[48px]"
                      name="zip_code"
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
                        const getPermissionValue = permissions
                          ? permissions.data.find(
                              (permission) => permission.id == value
                            )
                          : "";
                        setGroupPermissionName(
                          getPermissionValue.name ? getPermissionValue.name : ""
                        );
                      }}
                    >
                      <SelectTrigger className=" rounded-[8px]">
                        <SelectValue placeholder={groupPermissionName}>
                          {groupPermissionName}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-[8px] bg-white">
                        <SelectGroup>
                          {permissions.data &&
                            permissions.data.map((permission) => (
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

export default EditEmployeeModal;
