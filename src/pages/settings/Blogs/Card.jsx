import { Edit, User } from "lucide-react";
import PropTypes from "prop-types";
import React from "react";

const Card = ({ item }) => {
  return (
    <div className="shadow-custom py-6 px-8 flex justify-between items-center rounded-[16px] w-full md:w-[300px]">
      <div>
        <p className="text-[20px] text-[#333333]">{item.title}</p>
        <p className="text-[#4693D6] text-[30px]">{item.Value}</p>
      </div>
      <div>{item.icon}</div>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.object,
};

export default Card;
