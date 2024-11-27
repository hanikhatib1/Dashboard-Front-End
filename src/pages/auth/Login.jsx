import { LogoIcon } from "@/assets/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLoginMutation } from "@/redux/apiSlice";
import { login } from "@/redux/features/UserSlice";
import { auth, homepage } from "@/routes/paths";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [loginUser, { isSuccess }] = useLoginMutation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const res = await loginUser(data);
    if ("data" in res) {
      localStorage.setItem("token", res.data.token);
      dispatch(login(res.data.data));
      navigate("/");
      console.log(res.data);
    } else
      toast({
        title: "Error",
        description: res.error.data.detail,
        variant: "error",
      });
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
          <p className="text-heading_1">Login</p>
          <form
            className="flex flex-col gap-4 px-1"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                {...register("email", { minLength: 5, required: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-body text-[#80838E]">
                Password
              </label>
              <Input
                id=""
                type="password"
                className="rounded-[8px] h-[48px]"
                name="email"
                placeholder="Enter your Password"
                {...register("password", { required: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                type="submit"
                className="w-full h-[48px] bg-primary text-white rounded-[8px]"
              >
                Login
              </Button>
            </div>
          </form>
          <Link to={auth.forgetPassword} className="text-body text-[#80838E] px-1">
            Forget Password?
          </Link>
        </div>
        <div className="hidden md:flex w-1/2 justify-center">
          <div className="bg-primary absolute top-0 -right-2 w-1/3 h-full -z-10"></div>
          <img src="/login-image.png" className="w-3/4 h-3/4" />
        </div>
      </div>
    </div>
  );
};

export default Login;
