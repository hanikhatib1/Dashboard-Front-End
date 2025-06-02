import { formatePin } from "@/utiles/formatePin";
import { Pin } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { DeleteIcon } from "@/assets/Icons";
import { useDispatch } from "react-redux";
import {
  deletePropertiesById,
  deletePropertyDetailsDataById,
} from "@/redux/features/Properties";
import PropertyImageSlider from "../PropertyImageSlider";

const PropertyCard = ({
  className,
  property,
  classNameImage = "h-[144px]",
  hasDelete = true,
}) => {
  const dispatch = useDispatch();

  return (
    <div
      className={`relative bg-white p-4 rounded-[16px] h-[230px] min-w-[262px] max-w-[300px] flex flex-col gap-2 shadow-custom ${className}`}
    >
      {/*  <Link
        to={`https://www.cookcountyassessor.com/pin/${property.pin}`}
        target="_blank"
        className={`w-full  relative ${classNameImage}`}
      >
        <img
          src={property?.picked_image ?? property?.default_image}
          alt=""
          className="absolute w-full h-full object-cover rounded-[8px]"
        />
      </Link> */}
      <PropertyImageSlider
        replaceImageAction={false}
        defaultImages={property.default_image}
        pin={property.pin}
      />
      {hasDelete && (
        <i
          className="absolute top-5 right-5 z-[1]"
          onClick={() => {
            dispatch(deletePropertiesById(property.pin));
            dispatch(deletePropertyDetailsDataById(property.pin));
          }}
        >
          <DeleteIcon />
        </i>
      )}
      <div>
        <Link to={`/properties/${property.pin}`} className="hover:underline">
          <p className="flex gap-1">
            <Pin
              className="w-[20px]  h-[20px] rotate-[45deg]"
              color="#80838E"
            />
            <span className="text-[#53ABF9]">{formatePin(property?.pin)}</span>
          </p>
        </Link>

        <p className="text-[12px] leading-[18px] font-[500]">
          {property.address}
        </p>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  className: PropTypes.string,
  property: PropTypes.object.isRequired,
  classNameImage: PropTypes.string,
  hasDelete: PropTypes.bool,
};

export default PropertyCard;
