import { useLocation } from "react-router-dom";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Backpack, ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Header = ({ expand, setExpand }) => {
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1]
    ? location.pathname.split("/")[1].split("-").join(" ")
    : "Home";

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    console.log("user", user);
  }, [user, currentPage]);

  return (
    <div
      className={`fixed z-50 flex justify-between items-center p-4 top-0 ${
        expand
          ? "left-[250px] w-[calc(100vw-250px)]"
          : "left-[60px] w-[calc(100vw-60px)]"
      }  h-[60px] bg-[#FCFCFC]`}
    >
      <div className="flex gap-4 items-center">
        <>
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
        </>
        <p className="capitalize text-heading_1 text-[#00061D]">
          {currentPage}
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
      </div>
    </div>
  );
};

export default Header;
