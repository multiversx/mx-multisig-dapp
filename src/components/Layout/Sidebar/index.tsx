import React from "react";
import { useSelector } from "react-redux";
import { isSidebarOpenSelector } from "../../../redux/selectors/layoutSelector";

function Sidebar() {
  const isSidebarOpen = useSelector(isSidebarOpenSelector);
  console.log(isSidebarOpen);
  return isSidebarOpen ? (
    <div
      style={{
        position: "absolute",
        width: "20vw",
        height: "100%",
        background: "grey",
        zIndex: 10000,
      }}
    />
  ) : null;
}

export default Sidebar;
