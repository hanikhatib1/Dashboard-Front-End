import { LogoIcon } from "@/assets/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  useForgetPasswordMutation,
  useVerifyOtpMutation,
} from "@/redux/apiSlice";
import { auth } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordStrength from "@/components/PasswordStrength";

const passwordSchema = yup
  .object({
    new_password: yup
      .string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain at least one special character"
      ),
    confirm_new_password: yup
      .string()
      .oneOf([yup.ref("new_password")], "Passwords must match")
      .required("Please confirm your new password"),
  })
  .required();

const ForgetPassword = () => {
  const [forgetScreen, setForgetScreen] = useState(true);
  const { id } = useParams();
  const [forgetPassword] = useForgetPasswordMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const {
    register: registerVerification,
    handleSubmit: handleSubmitVerification,
    setValue: setValueVerification,
    getValues: getValuesVerification,
    watch,
    formState: { errors: verificationErrors },
  } = useForm({
    defaultValues: {
      email: "",
      verification_code: "",
      new_password: "",
      confirm_new_password: "",
      token: id,
    },
    resolver: yupResolver(passwordSchema),
  });

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    if (forgetScreen) {
      setValueVerification("email", data.email);
      const res = await forgetPassword(data);
      if ("data" in res) {
        toast({
          title: "Success",
          description:
            "Please check your email, we sent a link to reset password",
        });
      } else {
        toast({ title: "Error" });
      }
    } else {
      delete data.email;
      delete data.verification_code;
      const res = await verifyOtp(data);
      if ("data" in res) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        navigate(auth.login);
      } else {
        toast({
          title: "Error",
          description: "Invalid verification code",
        });
      }
    }
  };

  useEffect(() => {
    if (id === "set-new-password") {
      setForgetScreen(true);
    } else {
      setForgetScreen(false);
    }
  }, []);

  return (
    <div className="full-screen flex flex-col justify-between items-center">
      <div className="flex gap-1 p-4 items-center w-full z-50">
        <LogoIcon />
        <p>Cook County Tax Appeal</p>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 border-primary bg-white flex justify-between items-center gap-40 max-w-[1300px] w-full h-screen">
        <div className="flex flex-col gap-4 md:w-1/2 w-full overflow-y-auto xl:p-0 !px-2">
          <p className="text-heading_1">
            {forgetScreen ? "Forget Password" : "Set New Password"}
          </p>
          <form
            className="flex flex-col gap-4"
            onSubmit={
              forgetScreen
                ? handleSubmitLogin(onSubmit)
                : handleSubmitVerification(onSubmit)
            }
          >
            {forgetScreen ? (
              <div className="flex flex-col gap-2">
                <label className="text-body text-[#80838E]">Email</label>
                <Input
                  type="email"
                  className="rounded-[8px] h-[48px]"
                  placeholder="Enter your Email"
                  {...registerLogin("email", { required: "Email is required" })}
                />
                {loginErrors.email && (
                  <p className="text-red-500 text-sm">
                    {loginErrors.email.message?.toString()}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-body text-[#80838E]">
                    New Password
                  </label>
                  <Input
                    type="password"
                    className="rounded-[8px] h-[48px]"
                    placeholder="Enter your New Password"
                    {...registerVerification("new_password")}
                  />
                  {verificationErrors.new_password && (
                    <p className="text-red-500 text-sm">
                      {verificationErrors.new_password.message?.toString()}
                    </p>
                  )}

                  <PasswordStrength password={newPassword} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-body text-[#80838E]">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    className="rounded-[8px] h-[48px]"
                    placeholder="Confirm New Password"
                    {...registerVerification("confirm_new_password")}
                  />
                  {verificationErrors.confirm_new_password && (
                    <p className="text-red-500 text-sm">
                      {verificationErrors.confirm_new_password.message?.toString()}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                type="submit"
                className="w-full h-[48px] bg-primary text-white rounded-[8px]"
              >
                Send
              </Button>
              <Link to={auth.login} className="underline">
                Login
              </Link>
            </div>
          </form>
        </div>

        <div className="hidden md:flex w-1/2 justify-center">
          <div className="bg-primary absolute top-0 right-0 w-1/3 h-full -z-10"></div>
          <img src="/login-image.png" className="w-3/4 h-3/4" />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
