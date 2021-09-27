import React from "react";
import { useContext as useDappContext, useLogout } from "@elrondnetwork/dapp";
import { Navbar as BsNavbar, NavItem, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ReactComponent as ElrondLogo } from "assets/img/elrond.svg";
import { dAppName } from "config";
import { logoutAction } from "redux/commonActions";

const Navbar = () => {
  const { loggedIn } = useDappContext();
  const dappLogout = useLogout();
  const dispatch = useDispatch();

  const logOut = (e: React.MouseEvent) => {
    e.preventDefault();
    dappLogout({ callbackUrl: `${window.location.origin}/` });
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "";
    dispatch(logoutAction());
  };

  return (
    <BsNavbar className="bg-white border-bottom px-4 py-3">
      <div className="container-fluid">
        <NavItem className="d-flex align-items-center">
          <ElrondLogo className="elrond-logo" />
          <span className="dapp-name text-muted">{dAppName}</span>
        </NavItem>

        <Nav className="ml-auto">
          {loggedIn && (
            <NavItem>
              <button className="btn btn-primary mb-3" onClick={logOut}>
                Log out
              </button>
            </NavItem>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
