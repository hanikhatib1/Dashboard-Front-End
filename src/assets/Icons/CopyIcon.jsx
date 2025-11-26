const CopyIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className={className}
    width={size}
    height={size}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v2M8 16h6a2 2 0 002-2v-6a2 
           2 0 00-2-2H8m0 12v2a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
    />
  </svg>
);

export default CopyIcon;
