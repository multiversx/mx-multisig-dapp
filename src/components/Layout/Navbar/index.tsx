import React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Navbar as BsNavbar, NavItem, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as ElrondLogo } from "assets/img/elrond.svg";
import { ReactComponent as Union } from "assets/img/Union.svg";
import { dAppName } from "config";
import { routeNames } from "routes";
import Account from "./Account";

const Navbar = () => {
  const { loggedIn } = useDappContext();
  const history = useHistory();

  const handleRedirectToHome = () => {
    history.push("/dashboard");
  };

  return (
    <BsNavbar className="bg-white px-4 py-3">
      <div className="container">
        <NavItem
          onClick={handleRedirectToHome}
          className="d-flex align-items-center nav-logo"
        >
          <ElrondLogo className="elrond-logo" />
          <span className="dapp-name">{dAppName}</span>
        </NavItem>

        <Nav className="ml-auto">
          {loggedIn === true ? (
            <div
              className="d-flex align-items-center logged-in"
              style={{ minWidth: 0 }}
            >
              <Account />
              {/* <Settings /> */}
            </div>
          ) : (
            <div className="connect-btns ">
              <Link
                to={routeNames.unlock}
                className="btn primary"
                data-testid="loginBtn"
              >
                <Union />
                <span className="name">Connect now</span>
              </Link>
            </div>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
