import { useState } from "react";
import { TapsData } from "./TapsData";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import TapChildren from "./TapChildren";

const Taps = ({ expand }) => {
  const [activeTap, setACtiveTap] = useState(null);

  return (
    <div className="scroll-right flex flex-col gap-2 py-4 h-[calc(100vh-150px)] overflow-y-auto">
      {TapsData.map((tap, index) => {
        if (tap.children) {
          return (
            <TapChildren
              key={index}
              tap={tap}
              index={index}
              expand={expand}
              activeTap={activeTap}
              setACtiveTap={setACtiveTap}
            />
          );
        }
        return (
          <div key={index} className={`${expand ? "px-4" : "px-2"} relative`}>
            <NavLink
              to={tap.url}
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
              {tap.Icon}
              {expand && <p className="text-body ">{tap.name}</p>}
            </NavLink>
            {expand && (
              <span
                className={`${
                  activeTap === index ? "bg-primary" : ""
                } absolute top-0 left-0 w-[6px]  rounded-[10px] rounded-tl-none rounded-bl-none h-full `}
              ></span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Taps;
