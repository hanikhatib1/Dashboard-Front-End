import PropTypes from "prop-types";
import Header from "./Header";
import PagePreview from "./PagePreview";
import SideBar from "./SideBar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [expand, setExpand] = useState(false);

  return (
    <div className="flex w-full">
      <SideBar expand={expand} setExpand={setExpand} />
      <div className="flex-1 overflow-x-hidden">
        <Header expand={expand} setExpand={setExpand} />
        <PagePreview>{children}</PagePreview>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
