import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const TapChildren = ({
  expand,
  tap,
  index,
  activeTap,
  setACtiveTap,
  setShowSideBarMenu,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${expand ? "px-4" : "px-2"} relative`}>
      <Button
        onClick={() => setOpen(!open)}
        className={`!bg-transparent w-full !text-start flex items-start gap-2 justify-between !px-0 ${
          expand ? "px-1" : "!justify-center"
        }`}
      >
        <div className="flex items-center gap-2">
          {tap.Icon}
          {expand && <p>{tap.name}</p>}
          {expand && (
            <span
              className={`${
                activeTap === index ? "bg-primary" : ""
              } absolute top-0 left-0 w-[6px]  rounded-[10px] rounded-tl-none rounded-bl-none h-full `}
            ></span>
          )}
        </div>
        {expand ? open ? <ChevronUp /> : <ChevronDown /> : ""}
      </Button>
      <ul
        className={`flex flex-col gap-2 transition-all duration-700  ${
          open ? "h-auto" : "h-0"
        } overflow-hidden`}
      >
        {tap.children.map((child, index) => (
          <li key={index}>
            <NavLink
              to={child.url}
              onClick={() => setShowSideBarMenu(false)}
              className={({ isActive }) => {
                if (isActive) setACtiveTap(index);
                return isActive
                  ? `flex relative items-center gap-2 py-2 ${
                      expand ? "px-1" : "justify-center"
                    }    text-[#00061DCC] rounded-[8px] bg-primary text-white`
                  : `flex relative items-center gap-2 py-2 ${
                      expand ? "px-1" : "justify-center"
                    }  text-[#00061DCC] rounded-[8px]  hover:bg-primary hover:text-white`;
              }}
            >
              {child.Icon}
              {expand && <p className="text-body ">{child.name}</p>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

TapChildren.propTypes = {
  expand: PropTypes.bool,
  tap: PropTypes.object,
  index: PropTypes.number,
  activeTap: PropTypes.number,
  setACtiveTap: PropTypes.func,
};

export default TapChildren;
