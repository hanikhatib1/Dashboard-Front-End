import { logout } from "@/redux/features/UserSlice";
import { LogoIcon, LogoutIcon } from "../../assets/Icons";
import Taps from "./Taps";
import "./styles.css";
import { useDispatch } from "react-redux";
const SideBar = ({ expand }) => {
  const dispatch = useDispatch();

  return (
    <div
      className={`${
        expand ? "w-[250px]" : "w-[60px]"
      } border overflow-hidden duration-300 ease-in-out`}
    >
      <div
        className={`fixed border top-0 left-0 ${
          expand ? "w-[250px]" : "w-[60px]"
        } h-[100vh] shadow-custom overflow-hidden duration-300 ease-in-out`}
      >
        <div className="flex gap-1 p-4 items-center cursor-pointer">
          <img src="/assets/logo.png" alt="" className="w-[180px] h-[50px]"/>
        </div>
        <Taps expand={expand} />

        <button
          className={`flex justify-between items-center  py-2 fixed bottom-4 left-4 ${
            expand ? " w-[245px] px-6" : "w-[60px]"
          }`}
          onClick={() => {
            dispatch(logout());
            localStorage.clear();
            window.location.reload();
          }}
        >
          {expand && <p className="text-body text-[#00061DCC]">Logout</p>}
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
