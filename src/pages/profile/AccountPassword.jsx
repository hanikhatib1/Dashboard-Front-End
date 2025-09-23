import { toast } from "@/components/ui/use-toast";
import { useChangeMyPasswordMutation } from "@/redux/apiSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup
  .object({
    current_password: yup.string().required("Current password is required"),
    new_password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirm_new_password: yup
      .string()
      .oneOf([yup.ref("new_password"), null], "Passwords must match")
      .required("Please confirm your new password"),
  })
  .required();

const accountPasswordFiled = [
  {
    title: "Current Password",
    key: "current_password",
    type: "password",
    placeholder: "Enter your current password",
    display: true,
    editable: true,
  },
  {
    title: "New Password",
    key: "new_password",
    type: "password",
    placeholder: "Enter your new password",
    display: true,
    editable: true,
  },
  {
    title: "Confirm New Password",
    key: "confirm_new_password",
    type: "password",
    placeholder: "Confirm your new password",
    display: true,
    editable: true,
  },
];

const AccountPassword = () => {
  const [changePassword, { isLoading }] = useChangeMyPasswordMutation();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const res = await changePassword({
      current_password: data.current_password,
      new_password: data.new_password,
      confirm_new_password: data.confirm_new_password,
    });

    if ("data" in res) {
      toast({
        title: "Success",
        description: "Password changed successfully",
        duration: 4000,
        variant: "success",
      });
      setValue("current_password", "");
      setValue("new_password", "");
      setValue("confirm_new_password", "");
    } else {
      toast({
        title: "Error",
        description:
          res.error.data.detail || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Account Password</h1>
        <p className="text-gray-600">
          Change your account password regularly to enhance security.
        </p>
        <div className="flex flex-col gap-4">
          {accountPasswordFiled.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex flex-col gap-2">
                <label className="text-body text-[#80838E]">{item.title}</label>
             
                <input
                  type={item.type}
                  placeholder={item.placeholder}
                  className={`${errors[item.key] ? "border-red-500 focus:border-red-500 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-0" : ""}  border rounded-[8px] h-[48px] p-4 text-body text-[#00061D] placeholder:text-[#CCCDD2]`}
                  {...register(item.key)}
                />
              </div>
              {errors[item.key] && (
                <p className="text-red-500 text-sm">
                  {errors[item.key]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="bg-primary rounded-[8px] text-white h-[48px] hover:bg-primary hover:text-white w-[220px]"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPassword;
