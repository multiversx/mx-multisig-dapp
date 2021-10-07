import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { faArrowRight, faInfoCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { network } from "config";
import { routeNames } from "routes";
import Ledger from "./Ledger";
import Maiar from "./Maiar";

declare global {
  interface Window {
    elrondWallet: { extensionId: string };
  }
}

const UnlockTitle = () => (
  <div className="unlock-title mb-spacer">
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
  </div>
);

const Unlock = () => {
  const webWalletLogin = Dapp.useWebWalletLogin({
    callbackRoute: routeNames.dashboard,
  });

  const extensionWalletLogin = Dapp.useExtensionLogin({
    callbackRoute: routeNames.dashboard,
  });

  return (
    <div className="unlock-page m-auto">
      <div className="card p-spacer m-spacer text-center">
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
              <div className="title">Maiar DeFi Wallet</div>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </button>
        )}
        <Link
          to={routeNames.walletconnect}
          className="btn btn-unlock btn-block"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="title">Maiar App</div>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </Link>

        <Link to={routeNames.ledger} className="btn btn-unlock btn-block">
          <div className="d-flex justify-content-between align-items-center">
            <div className="title">Ledger</div>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </Link>

        <button onClick={webWalletLogin} className="btn btn-unlock btn-block">
          <div className="d-flex justify-content-between align-items-center">
            <div className="title">Elrond Web Wallet</div>
            <FontAwesomeIcon icon={faArrowRight} />
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
