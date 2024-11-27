import PropTypes from "prop-types";

const PagePreview = ({ children }) => {
  return (
    <div className="scroll-right mt-[60px] min-h-[calc(100vh-60px)] w-full  bg-[#FCFCFC] overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  );
};

PagePreview.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PagePreview;
