import { LogoIcon } from "@/assets/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  useForgetPasswordMutation,
  useLoginMutation,
  useVerifyOtpMutation,
} from "@/redux/apiSlice";
import { login } from "@/redux/features/UserSlice";
import { auth, homepage } from "@/routes/paths";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [forgetScreen, setForgetScreen] = useState(true);

  const [forgetPassword] = useForgetPasswordMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register: registerLogin, handleSubmit: handleSubmitLogin } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const {
    register: registerVerification,
    handleSubmit: handleSubmitVerification,
    setValue: setValueVerification,
    getValues: getValuesVerification,
  } = useForm({
    defaultValues: {
      email: "",
      verification_code: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const onSubmit = async (data) => {
    if (forgetScreen) {
      setValueVerification("email", data.email);
      const res = await forgetPassword(data);
      if ("data" in res) {
        setForgetScreen(false);
        toast({
          title: "Success",
          description: "Please check your email for verification code",
        });
      } else {
        toast({
          title: "Error",
        });
      }
    } else {
      if (
        getValuesVerification("new_password") ===
        getValuesVerification("confirm_new_password")
      ) {
        const res = await verifyOtp(data);
        if ("data" in res) {
          navigate(auth.login);
        } else {
          toast({
            title: "Error",
            description: "Invalid verification code",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Passwords do not match",
        });
      }
    }
  };

  return (
    <div className="full-screen flex flex-col justify-between items-center">
      <div className="flex gap-1 p-4 items-center w-full z-50">
        <LogoIcon />
        <p>Cook County Tax Appeal</p>
      </div>
      <div className="bg-primary absolute top-0 right-0 w-1/2 h-full -z-10"></div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2  border-primary bg-white flex justify-between items-center gap-40 max-w-[1300px] w-full h-screen">
        <div className="flex flex-col gap-4 md:w-1/2 w-full overflow-y-auto xl:p-0 p-4">
          <p className="text-heading_1">
            {forgetScreen ? "Forget Password" : "Verification"}
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
                <label htmlFor="" className="text-body text-[#80838E]">
                  Email
                </label>
                <Input
                  id=""
                  type="email"
                  className="rounded-[8px] h-[48px]"
                  name="email"
                  placeholder="Enter your Email"
                  {...registerLogin("email", { required: true })}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-body text-[#80838E]">
                    Verification Code
                  </label>
                  <Input
                    id=""
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="verification_code"
                    placeholder="Enter your verification code"
                    {...registerVerification("verification_code", {
                      required: true,
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-body text-[#80838E]">
                    New Password
                  </label>
                  <Input
                    id=""
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="new_password"
                    placeholder="Enter your New Password"
                    {...registerVerification("new_password", {
                      required: true,
                      minLength: 6,
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-body text-[#80838E]">
                    Confirm New Password
                  </label>
                  <Input
                    id=""
                    type="text"
                    className="rounded-[8px] h-[48px]"
                    name="email"
                    placeholder="Confirm New Password"
                    {...registerVerification("confirm_new_password", {
                      required: true,
                      minLength: 6,
                    })}
                  />
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
