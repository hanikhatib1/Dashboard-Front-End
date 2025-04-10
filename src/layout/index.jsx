import PropTypes from "prop-types";
import Header from "./Header";
import PagePreview from "./PagePreview";
import SideBar from "./SideBar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [expand, setExpand] = useState(false);
  const [showSideBarMenu, setShowSideBarMenu] = useState(false);

  return (
    <div className="flex w-full">
      <SideBar
        expand={expand}
        setExpand={setExpand}
        showSideBarMenu={showSideBarMenu}
        setShowSideBarMenu={setShowSideBarMenu}
      />
      <div
        className={`w-full ${
          expand ? "md:w-[calc(100%-250px)]" : "md:w-[calc(100%-60px)]"
        } overflow-hidden absolute top-0 left-0 z-0 ${
          expand ? "md:left-[250px]" : "md:left-[60px]"
        }`}
      >
        <Header
          expand={expand}
          setExpand={setExpand}
          setShowSideBarMenu={setShowSideBarMenu}
          showSideBarMenu={showSideBarMenu}
        />
        <PagePreview>{children}</PagePreview>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
