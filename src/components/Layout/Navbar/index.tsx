import React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Navbar as BsNavbar, NavItem, Nav } from "react-bootstrap";
import { ReactComponent as ElrondLogo } from "assets/img/elrond.svg";
import { dAppName } from "config";
import Account from "./Account";
import Settings from "./Settings";
const Navbar = () => {
  const { loggedIn } = useDappContext();

  return (
    <BsNavbar className="bg-white shadow-sm px-4 py-3">
      <div className="container">
        <NavItem className="d-flex align-items-center nav-logo">
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
