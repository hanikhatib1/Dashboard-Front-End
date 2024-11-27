import PropTypes from "prop-types";

export default function Edit() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="#D9D9D9"
    >
      <circle cx="20" cy="20" r="20" fill="#D9D9D9" fillOpacity="0.1" />
    </svg>
  );
}

Edit.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
