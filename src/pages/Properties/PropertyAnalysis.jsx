import React, { useState } from "react";
import {
  buildStyles,
  CircularProgressbar,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import PropTypes from "prop-types";
import "react-circular-progressbar/dist/styles.css";
import { formattedNumber } from "@/utiles/formattedNumber";
import ReplacedImage from "@/components/ReplacedImage";

const PropertyAnalysis = ({ property }) => {
  /* const [fov, setFov] = useState(80);
  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0);

  const handleFov = (value) => {
    if (value > 0 && fov === 120) return setFov(120);
    if (value < 0 && fov === 0) return setFov(0);

    setFov((prev) => prev + value);
  };

  const handleHeading = (value) => {
    if (value > 0 && heading === 360) return setHeading(360);
    if (value < 0 && heading === 0) return setHeading(0);
    setHeading((prev) => prev + value);
  };

  const handlePitch = (value) => {
    if (value > 0 && pitch === 360) return setPitch(360);
    if (value < 0 && pitch === 0) return setPitch(0);
    setPitch((prev) => prev + value);
  }; */

  return (
    <div className="h-[426px] flex gap-8 justify-between">
      <div className="h-full  flex flex-col gap-4 !w-[580px]">
        <p className="text-heading_3">{property.data.address}</p>
        <div className="bg-gray-200 rounded-[8px] h-[372px] border flex-1 relative overflow-hidden">
          <ReplacedImage
            defaultImage={property.data.default_image}
            pickedImage={property.data.picked_image}
            pin={property.data.pin}
          />
        </div>
      </div>
      <div className="h-full w-[431px]  flex flex-col">
        <p className="text-body text-[#9291A5]">Statistics</p>
        <p className="text-heading_2">Expected tax savings per year </p>
        <hr className="w-full mt-5 mb-6 bg-primary" />
        <div className="h-[256px] w-[250px] flex-1 flex flex-col gap-6 justify-center m-auto mt-4 text-center ">
          <CircularProgressbarWithChildren
            value={100 - property.data.fair_per}
            className=""
            styles={buildStyles({
              rotation: 0,
              strokeLinecap: "butt",
              textSize: "16px",
              pathTransitionDuration: 0.5,
              pathColor: `rgba(62, 152, 199, ${0.75})`,
              textColor: "#f88",
              trailColor: "#f5f5f5",
              backgroundColor: "#3e98c7",
            })}
          >
            <div className="-mt-">
              <p className="text-body text-[#9291A5]">Total Savings</p>
              <p className="text-[28px] font-bold text-[#1E1B39]">
                ${property.data.fair_price.toLocaleString()}
              </p>
            </div>
          </CircularProgressbarWithChildren>
          <div className="flex justify-center gap-3 items-center">
            <span className="w-[15px] h-[15px] bg-primary rounded-full"></span>
            <p>
              <span className="text-[#9291A5]">Savings</span>{" "}
              {formattedNumber(100 - property.data.fair_per)} %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

PropertyAnalysis.propTypes = {
  property: PropTypes.object,
};

export default PropertyAnalysis;
