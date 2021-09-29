import React from "react";
import {
  localstorage as dappLocalstorage,
  useContext as useDappContext,
  useLogout as useDappLogout,
  useRefreshAccount,
} from "@elrondnetwork/dapp";
import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";

import CopyButton from "components/CopyButton";
import Trim from "components/Trim";
import { logoutAction } from "redux/commonActions";

const Account = () => {
  const { address, explorerAddress } = useDappContext();
  const refreshAccount = useRefreshAccount();
  const dappLogout = useDappLogout();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>();
  const intervalRef = React.useRef<any>();

  const logOut = () => {
    dappLogout({ callbackUrl: `${window.location.origin}/` });
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
    setShowModal(false);
    logOut();
  };

  const toggleModal = (show: boolean) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (show) {
      refreshAccount();
    }
    setShowModal(show);
  };
  return (
    <>
      <button
        className="btn address-btn btn-light mr-2 d-flex flex-row align-items-center"
        onClick={toggleModal(true)}
      >
        <FontAwesomeIcon icon={faUserCircle} size="lg" />
        <div className="navbar-address ml-2 d-none d-lg-block">
          <Trim text={address} />
        </div>
      </button>
      {showModal && (
        <Modal
          show={showModal}
          backdrop={true}
          onHide={toggleModal(false)}
          className="modal-container"
          animation={false}
          centered
        >
          <div className="card w-100 account">
            <div className="card-header px-3 px-sm-spacer pt-3 pt-sm-spacer pb-4">
              <h4 className="mb-4">Account details</h4>

              <div className="d-flex flex-wrap justify-content-between mb-2">
                <label className="text-secondary mb-0">Your wallet</label>
              </div>

              <div className="address-holder-container d-flex flex-row justify-content-between align-items-center border rounded px-3 py-2 mb-4">
                <div className="address-holder trim-fs-sm text-primary-highlight">
                  <Trim text={address} />
                </div>
                <div className="border-left ml-3 pl-3 text-secondary">
                  <CopyButton text={address} className="align-end-flex" />
                </div>
              </div>
            </div>

            <div className="card-footer px-3 px-sm-spacer pt-2">
              <div className="mx-n2 d-flex flex-wrap flex-sm-nowrap justify-content-between">
                <a
                  {...{ target: "_blank" }}
                  href={`${explorerAddress}accounts/${address}`}
                  className="btn btn-lg btn-primary btn-block mx-2 mt-3"
                >
                  View on Explorer
                </a>
                <button
                  className="btn btn-lg btn-primary btn-block mx-2 mt-3"
                  onClick={onDisconnectClick}
                >
                  Disconnect
                </button>
              </div>
              <div className="d-flex justify-content-center ">
                <a
                  onClick={toggleModal(false)}
                  href="/#"
                  data-testid="closeModal"
                  className="link-style my-3"
                >
                  Close
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Account;
