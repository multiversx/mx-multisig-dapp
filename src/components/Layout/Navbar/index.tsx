import React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { faMinus, faBars } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar as BsNavbar, NavItem, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ElrondLogo } from "assets/img/elrond.svg";
import { dAppName } from "config";
import { isSidebarOpenSelector } from "redux/selectors/layoutSelector";
import { setIsSidebarOpen } from "redux/slices/layoutSlice";
import Account from "./Account";
import Settings from "./Settings";
const Navbar = () => {
  const { loggedIn } = useDappContext();
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(isSidebarOpenSelector);

  const handleToggleMenu = () => dispatch(setIsSidebarOpen(!isSidebarOpen));

  return (
    <BsNavbar className="bg-white border-bottom px-4 py-3">
      <div className="container-fluid">
        <button
          className="navbar-toggler mx-3"
          type="button"
          data-toggle="collapse"
          data-target="#navbarToggleExternalContent"
          aria-controls="navbarToggleExternalContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleToggleMenu}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faMinus : faBars} />
        </button>

        <NavItem className="d-flex align-items-center">
          <ElrondLogo className="elrond-logo" />
          <span className="dapp-name">{dAppName}</span>
        </NavItem>

        <Nav className="ml-auto">
          {loggedIn && (
            <div
              className="d-flex align-items-center logged-in"
              style={{ minWidth: 0 }}
            >
              <Account />
              <Settings />
            </div>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
