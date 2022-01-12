import React from "react";

import {
  getIsLoggedIn,
  logout,
  useGetAccountInfo,
} from "@elrondnetwork/dapp-core";
import { faUserCircle, faPowerOff } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

import Trim from "components/Trim";
import { logoutAction } from "redux/commonActions";
import { usernameSelector } from "redux/selectors/accountSelector";
import { routeNames } from "routes";

const Account = () => {
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>();
  const intervalRef = React.useRef<any>();
  const username = useSelector(usernameSelector);

  const logOut = () => {
    logout(`${window.location.origin}${routeNames.home}`);
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "";
    dispatch(logoutAction());
  };

  const logoutOnSessionExpire = () => {
    intervalRef.current = setInterval(() => {
      const loggedIn = getIsLoggedIn();
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
        <div className="btn-name ">
          <span className="name">
            {username ? (
              <span className="address hero-tag">
                @{username.replace(".elrond", "")}
              </span>
            ) : (
              <span className="address">
                <Trim text={address} />
              </span>
            )}
          </span>
          <span className="disconnect">Disconnect</span>
        </div>
      </button>
    </div>
  );
};

export default Account;
