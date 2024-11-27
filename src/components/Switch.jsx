import React, { useState } from "react";

const Switch = ({ toggle, setToggle }) => {
  const toggleClass = " transform translate-x-4";
  return (
    <div
      className={`
        w-10 h-5 flex items-center  rounded-full p-1 cursor-pointer
        ${toggle ? "bg-[#4693D6] " : "bg-[#80838E] "}
        `}
      onClick={() => {
        setToggle(!toggle);
      }}
    >
      <div
        className={
          "bg-white h-4 w-4 rounded-full shadow-md transform" +
          (toggle ? toggleClass : null)
        }
      ></div>
    </div>
  );
};

export default Switch;
