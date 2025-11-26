import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import PropTypes from "prop-types";
import "react-circular-progressbar/dist/styles.css";
import { formattedNumber } from "@/utiles/formattedNumber";
import ReplacedImage from "@/components/ReplacedImage";
import StreetView from "./StreetView";
import PropertyImageSlider from "./PropertyImageSlider";
import LatestTaxBillButton from "@/components/LatestTaxBillButton";
import PreviousTaxBillButton from "@/components/PreviousTaxBillButton";
import { Link } from "react-router-dom";

const PropertyAnalysis = ({ property }) => {
  const data = new Date(property.data.last_update);
  const currentDate = data.toLocaleDateString("en-US");

  return (
    <div className="h-max md:h-[426px] flex flex-col md:flex-row gap-8 justify-between">
      <div className="h-[350px] md:h-full  flex flex-col gap-4 w-full md:!w-[580px]">
        <div className="flex justify-between items-center">
          <p className="text-heading_3">{property.data.address}</p>
          {/* <LatestTaxBillButton pin={property.data.pin} /> */}
        </div>
        <div className="bg-gray-200 rounded-[8px] !h-[372px] border flex-1 relative overflow-hidden">
          {/* <ReplacedImage
            defaultImage={property.data.default_image}
            pickedImage={property.data.picked_image}
            pin={property.data.pin}
          /> */}
          <Link
            to={`https://www.cookcountyassessor.com/pin/${property.pin}`}
            target="_blank"
            className={`w-full  relative `}
          >
            <PropertyImageSlider
              defaultImages={property.data.default_image}
              pin={property.data.pin}
            />
          </Link>
          <StreetView address={property.data.address} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <LatestTaxBillButton pin={property.data.pin} />
        <PreviousTaxBillButton pin={property.data.pin} />
      </div>
      <div className="h-full w-full md:w-[431px] flex flex-col">
        <div className="flex justify-between mb-4">
          <p className="text-body text-[#9291A5]">Last Update</p>
          <p className="text-body text-[#9291A5]">{currentDate}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-body text-[#9291A5]">Statistics</p>
        </div>
        <p className="text-heading_2">Expected tax savings per year </p>
        <hr className="w-full mt-5 mb-6 bg-primary" />
        <div className="h-[256px] w-[250px] flex-1 flex flex-col  gap-6 justify-center m-auto mt-4 text-center ">
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
