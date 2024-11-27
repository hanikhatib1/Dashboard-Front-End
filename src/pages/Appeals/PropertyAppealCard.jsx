import { formatePin } from "@/utiles/formatePin";
import { MapPin, Trash2 } from "lucide-react";
import PropTypes from "prop-types";

const PropertyAppealCard = ({ property, setProperty }) => {
  return (
    <div className="bg-[#D9D9D9] p-4 rounded-[4px] bg-opacity-15 flex gap-[12px] relative">
      <div className="w-[120px] h-[75px] rounded-[4px] overflow-hidden">
        <img src={property.default_image} />
      </div>
      <div className="flex flex-col items-start justify-center">
        <p>{property.address}</p>
        <p className="flex gap-1">
          <MapPin className="w-[20px] h-[20px]" color="#80838E" />
          <span className="text-[#00061D] text-opacity-50">
            {formatePin(property?.pin)}
          </span>
        </p>
      </div>
      <i
        className="absolute top-2 right-2 z-[1000] cursor-pointer rounded-full"
        onClick={() => setProperty(null)}
      >
        <Trash2 color="#80838E" />
      </i>
    </div>
  );
};

PropertyAppealCard.propTypes = {
  property: PropTypes.object.isRequired,
  setProperty: PropTypes.func.isRequired,
};

export default PropertyAppealCard;
