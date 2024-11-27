import { useState } from "react";
import PropTypes from "prop-types";

const Taps = ({ tapsData }) => {
  const [activeTab, setActiveTab] = useState(tapsData[0]);

  return (
    <div>
      <div className="flex gap-6 pb-4">
        {tapsData.map((item) => (
          <button
            key={item.key}
            className={`text-heading_3  border-b-2  ${
              item.key === activeTab.key
                ? "border-primary text-primary"
                : "border-white text-[#054985]"
            }`}
            onClick={() => setActiveTab(item)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="flex gap-6">{activeTab.component}</div>
    </div>
  );
};

Taps.prototype = {
  tapsData: PropTypes.array.isRequired,
};

export default Taps;
