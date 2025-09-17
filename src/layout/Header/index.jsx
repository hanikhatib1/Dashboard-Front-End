import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import {
  Backpack,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  Menu,
  UserRound,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = ({ expand, setExpand, setShowSideBarMenu, showSideBarMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [canGoBack, setCanGoBack] = useState(false);
  const pathname = useLocation().pathname;

  const currentPage = location.pathname.split("/")[1]
    ? location.pathname.split("/")[1].split("-").join(" ")
    : "Home";

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    console.log("user", user);
  }, [user, currentPage]);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, [pathname]);

  return (
    <div
      className={`fixed z-50 flex justify-between items-center p-4 top-0 left-0 w-full ${
        expand
          ? "md:left-[250px] md:w-[calc(100vw-250px)]"
          : "md:left-[60px] md:w-[calc(100vw-60px)]"
      }  h-[60px] bg-[#FCFCFC]`}
    >
      <div className="flex gap-4 items-center">
        <div
          className="gap-4 p-4 items-center cursor-pointer flex md:hidden"
          onClick={() => setShowSideBarMenu(true)}
        >
          <Menu
            onClick={() => {
              setShowSideBarMenu(true);
              setExpand(true);
            }}
            size={28}
            color="#1A73E8"
            className="cursor-pointer md:hidden block"
          />
          <img src="/assets/logo.png" alt="" className="w-[120px] h-[40px]" />
        </div>
        <div className="hidden md:flex p-4 items-center cursor-pointer gap-3">
          {expand ? (
            <ChevronRight
              onClick={() => setExpand(!expand)}
              className="hover:bg-primary border rounded-[8px] p-2 w-[32px] h-[32px] hover:text-white cursor-pointer bg-[#f0f0f3]"
            />
          ) : (
            <ChevronLeft
              onClick={() => setExpand(!expand)}
              className="hover:bg-primary border rounded-[8px] p-2 w-[32px] h-[32px] hover:text-white cursor-pointer bg-[#f0f0f3]"
            />
          )}
          <button
            onClick={() => navigate(-1)}
            disabled={!canGoBack}
            className={`${!canGoBack ? "" : "hover:bg-primary hover:text-white"}  border rounded-[8px] flex justify-center items-center w-[32px] h-[32px]  cursor-pointer bg-[#f0f0f3]`}
          >
            <ChevronsLeft />
          </button>
        </div>
        <p className="capitalize text-heading_1 text-[#00061D]  md:block hidden">
          {currentPage.replace("_", " ")}
        </p>
      </div>
      <div className="flex gap-4 items-center">
        <Avatar className="border flex justify-center items-center">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.first_name} />
          ) : (
            <UserRound className="w-3/4 h-3/4" />
          )}
        </Avatar>
        <p className="text-body">{user.first_name + " " + user.last_name}</p>
        <Menu
          onClick={() => {
            setShowSideBarMenu(true);
            setExpand(true);
          }}
          size={28}
          color="#1A73E8"
          className="cursor-pointer md:hidden block"
        />
      </div>
      {showSideBarMenu && (
        <div
          className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-60 cursor-pointer block md:hidden"
          onClick={() => setShowSideBarMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default Header;
