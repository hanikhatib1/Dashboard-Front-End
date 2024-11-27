import Svgs from "../assets/Icons";
import PropTypes from "prop-types";


const Icon = ({
  name = "dashboard-icon",
  size = "24px",
  color,
  fillColor,
  strokeColor,
}) => {
  const SvgIcon = Svgs[name];

  return (
    <SvgIcon
      color={color}
      size={size}
      fillColor={fillColor}
      strokeColor={strokeColor}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
};

export default Icon;
