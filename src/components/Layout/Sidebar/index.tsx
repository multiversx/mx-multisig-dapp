import React from "react";
import { useSelector } from "react-redux";
import { isSidebarOpenSelector } from "../../../redux/selectors/layoutSelector";

function Sidebar() {
  const isSidebarOpen = useSelector(isSidebarOpenSelector);
  return isSidebarOpen ? (
    <nav id="sidebar">
      <div className="sidebar-header">
        <h3> Sidebar</h3>
      </div>

      <ul className="list-unstyled components">
        <li>
          <a className="active" href="#">
            Dashboard
          </a>
        </li>
        <li>
          <a className="active" href="#">
            Vault
          </a>
        </li>
        <li>
          <a className="active" href="#">
            Decisions
          </a>
        </li>
        <li>
          <a className="active" href="#">
            Organization
          </a>
        </li>

        <li>
          <a href="#">Tokens</a>
        </li>
        <li>
          <a href="#">FAQ</a>
        </li>
        <li>
          <a href="#">Documentation</a>
        </li>
        <li>
          <a href="#">End Session</a>
        </li>
      </ul>
    </nav>
  ) : null;
}

export default Sidebar;
