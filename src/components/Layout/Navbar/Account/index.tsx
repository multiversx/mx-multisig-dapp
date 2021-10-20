import React from "react";
import {
  localstorage as dappLocalstorage,
  useContext as useDappContext,
  useLogout as useDappLogout,
} from "@elrondnetwork/dapp";
import { faUserCircle, faPowerOff } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

import Trim from "components/Trim";
import { logoutAction } from "redux/commonActions";
import { usernameSelector } from "redux/selectors/accountSelector";
import { routeNames } from "routes";

const Account = () => {
  const { address } = useDappContext();
  const dappLogout = useDappLogout();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>();
  const intervalRef = React.useRef<any>();
  const username = useSelector(usernameSelector);

  const logOut = () => {
    dappLogout({ callbackUrl: `${window.location.origin}${routeNames.home}` });
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "";
    dispatch(logoutAction());
  };

  const logoutOnSessionExpire = () => {
    intervalRef.current = setInterval(() => {
      const loggedIn = dappLocalstorage.getItem("address");
      if (!loggedIn && isLoggedIn === true) {
        window.location.reload();
      }
      if (loggedIn) {
        setIsLoggedIn(true);
      }
    }, 2000);
    return () => {
      clearInterval(intervalRef.current);
    };
  };

  React.useEffect(logoutOnSessionExpire, [isLoggedIn]);

  const onDisconnectClick = () => {
    setIsLoggedIn(false);
    logOut();
  };

  return (
    <div className="connect-btns">
      <button
        className="btn address-btn btn-light d-flex flex-row align-items-center"
        onClick={onDisconnectClick}
      >
        <FontAwesomeIcon icon={faUserCircle} size="lg" />
        <FontAwesomeIcon icon={faPowerOff} size="lg" className="hide" />
        <div className="navbar-address d-none d-lg-block">
          <span className="address">
            {username ? (
              `@${username.replace(".elrond", "")}`
            ) : (
              <Trim text={address} />
            )}
          </span>
          <span className="disconnect">Disconnect</span>
        </div>
      </button>
    </div>
  );
};

export default Account;
