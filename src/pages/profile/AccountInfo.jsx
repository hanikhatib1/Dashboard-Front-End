import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUpdateMyAccountMutation } from "@/redux/apiSlice";
import { setUser } from "@/redux/features/UserSlice";
import { UserRound } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const userData = [
  {
    title: "First Name",
    key: "first_name",
    type: "text",
    placeholder: "Enter your first name",
    display: true,
    editable: true,
  },
  {
    title: "Last Name",
    key: "last_name",
    type: "text",
    placeholder: "Enter your last name",
    display: true,
    editable: true,
  },
  {
    title: "Email",
    key: "email",
    type: "email",
    placeholder: "Enter your email",
    display: true,
    editable: true,
  },
  // and this also (Phone Number,Birth Date, Address, City, State, Zip Code,Group Permission)
  {
    title: "Phone Number",
    key: "phone",
    type: "text",
    placeholder: "Enter your phone number",
    display: true,
    editable: true,
  },
  {
    title: "Address",
    key: "address",
    type: "text",
    placeholder: "Enter your address",
    display: true,
    editable: true,
  },
  {
    title: "City",
    key: "city",
    type: "text",
    placeholder: "Enter your city",
    display: true,
    editable: true,
  },
  {
    title: "State",
    key: "state",
    type: "text",
    placeholder: "Enter your state",
    display: true,
    editable: true,
  },
  {
    title: "Zip Code",
    key: "zip_code",
    type: "text",
    placeholder: "Enter your zip code",
    display: true,
    editable: true,
  },
  {
    title: "Group Permission",
    key: "group_permission.name",
    type: "text",
    placeholder: "Enter your group permission",
    display: true,
    editable: false,
  },
];

const AccountInfo = () => {
  const { user } = useSelector((state) => state.user);
  const [image, setImage] = React.useState();
  const [updateMyAccount, { isLoading }] = useUpdateMyAccountMutation();
  const dispatch = useDispatch();
  const [hasChanges, setHasChanges] = React.useState(false);

  const { handleSubmit, register, setValue, watch } = useForm({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone ? user.phone : "",
      address: user.address,
      city: user.city,
      state: user.state,
      zip_code: user.zip_code ? user.zip_code : "",
      image: user.image ? "" : "oooo",
      email: user.email,
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("zip_code", data.zip_code);
    if (data.image && data.image !== "oooo") {
      formData.append("image", data.image);
    }
    const res = await updateMyAccount(formData);
    if ("data" in res) {
      dispatch(setUser(res.data.data));
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: res.error.data.detail || "Something went wrong",
        variant: "destructive",
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
    const cloneUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone ? user.phone : "",
      address: user.address,
      city: user.city,
      state: user.state,
      zip_code: user.zip_code ? user.zip_code : "",
      image: user.image ? "" : "oooo",
      email: user.email,
    };

    const subscription = watch((value) => {
      if (JSON.stringify(value) !== JSON.stringify(cloneUser)) {
        setHasChanges(true);
      } else {
        setHasChanges(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, user]);

  useEffect(() => {
    if (user) {
      setImage(user.image);
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-heading_3 text-[#80838E]">Profile Picture Upload </p>
        <div className="flex gap-4 items-center mt-6">
          <div className="flex gap-4 items-center w-1/3 overflow-hidden">
            {image ? (
              <img
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                className="border rounded-full w-[110px] h-[110px]"
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
                  setValue("image", "oooo0");
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
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        {userData.map(
          (item, index) =>
            item.display && (
              <div key={index} className="flex flex-col gap-2 md:!w-[48%]">
                <p className="text-body text-[#80838E]">{item.title}</p>
                {item.editable ? (
                  <input
                    type={item.type}
                    placeholder={item.placeholder}
                    className="border rounded-[8px] h-[48px] p-4 text-body text-[#00061D] placeholder:text-[#CCCDD2]"
                    {...register(item.key)}
                    disabled={item.key === "email"}
                  />
                ) : (
                  <input
                    type={item.type}
                    placeholder={item.placeholder}
                    className="border rounded-[8px] h-[48px] p-4 text-body text-[#00061D] placeholder:text-[#CCCDD2] bg-[#F5F5F5]"
                    value={
                      item.key === "group_permission.name" &&
                      user.group_permission
                        ? user.group_permission.name
                        : watch(item.key)
                    }
                    disabled
                  />
                )}
              </div>
            )
        )}
      </div>
      <div className="flex justify-end">
        <Button
          disabled={isLoading || !hasChanges}
          onClick={handleSubmit(onSubmit)}
          className="bg-primary rounded-[8px] text-white h-[48px] hover:bg-primary hover:text-white w-[220px]"
        >
          {isLoading ? <Loader /> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default AccountInfo;
