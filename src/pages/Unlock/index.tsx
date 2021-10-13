import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { faArrowRight, faInfoCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { network } from "config";
import { routeNames } from "routes";
import Ledger from "./Ledger";
import Maiar from "./Maiar";
import { ReactComponent as IconElrond } from "assets/img/icon-elrond.svg";
import { ReactComponent as IconMaiar } from "assets/img/icon-maiar.svg";
import { ReactComponent as IconLedger } from "assets/img/icon-ledger.svg";

declare global {
  interface Window {
    elrondWallet: { extensionId: string };
  }
}

const UnlockTitle = () => (
  <h5 className="unlock-title mb-spacer">
    Connect to a wallet{" "}
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={(props) => (
        <Tooltip id="connect-to-wallet-tooltip" {...props}>
          Connect securely using one of the provided options
        </Tooltip>
      )}
    >
      <a
        href="/#"
        onClick={(e) => {
          e.preventDefault();
        }}
        data-testid="infoConnect"
      >
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="i-icon text-secondary"
        />
      </a>
    </OverlayTrigger>
  </h5>
);

const Unlock = () => {
  const { loggedIn } = Dapp.useContext();

  const webWalletLogin = Dapp.useWebWalletLogin({
    callbackRoute: routeNames.dashboard,
  });

  const extensionWalletLogin = Dapp.useExtensionLogin({
    callbackRoute: routeNames.dashboard,
  });

  if (loggedIn) {
    return <Redirect to={routeNames.dashboard} />;
  }

  return (
    <div className="unlock-page m-auto">
      <div className="card unlock p-spacer text-center">
        <UnlockTitle />
        {!window.elrondWallet && (
          <Link
            to={{
              pathname:
                "https://chrome.google.com/webstore/detail/dngmlblcodfobpdpecaadgfbcggfjfnm?authuser=0&hl=en",
            }}
            target="_blank"
            className="btn btn-unlock btn-block"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="title">Maiar DeFi Wallet</div>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </Link>
        )}

        {window.elrondWallet && (
          <button
            onClick={extensionWalletLogin}
            className="btn btn-unlock btn-block"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-row method">
                <IconMaiar />
                <div className="title">Maiar DeFi Wallet</div>
              </div>

              <FontAwesomeIcon icon={faArrowRight} className="arrow" />
            </div>
          </button>
        )}
        <Link
          to={routeNames.walletconnect}
          className="btn btn-unlock btn-block"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconMaiar />
              <div className="title">Maiar App</div>
            </div>

            <FontAwesomeIcon icon={faArrowRight} className="arrow" />
          </div>
        </Link>

        <Link to={routeNames.ledger} className="btn btn-unlock btn-block">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconLedger />
              <div className="title">Ledger</div>
            </div>

            <FontAwesomeIcon icon={faArrowRight} className="arrow" />
          </div>
        </Link>

        <button onClick={webWalletLogin} className="btn btn-unlock btn-block">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconElrond />
              <div className="title">Elrond Web Wallet</div>
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="arrow" />
          </div>
        </button>

        <div className="mt-spacer">
          <span className="text-secondary">New to Elrond?</span>
        </div>
        <div className="mt-1">
          <a
            className="link-style"
            href={`${network.walletAddress}/create`}
            {...{ target: "_blank" }}
          >
            Learn How to setup a wallet
          </a>
        </div>
      </div>
    </div>
  );
};

export { Ledger, Maiar };

export default Unlock;
