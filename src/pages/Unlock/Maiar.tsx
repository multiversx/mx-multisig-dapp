import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { useLocation } from "react-router-dom";
import ModalContainer from "components/ModalContainer";
import { routeNames } from "routes";

const Maiar = () => {
  const location = useLocation();
  const state = location.state as any;
  const token: string | undefined = state ? state.token : "";

  return (
    <ModalContainer title="Maiar Login">
      <Dapp.Pages.WalletConnect
        callbackRoute={routeNames.dashboard}
        logoutRoute={routeNames.home}
        title="Maiar Login"
        lead="Scan the QR code using Maiar"
        token={token}
      />
    </ModalContainer>
  );
};

export default Maiar;
