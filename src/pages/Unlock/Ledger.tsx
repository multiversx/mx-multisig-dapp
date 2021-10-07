import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { useLocation } from "react-router-dom";
import ModalContainer from "components/ModalContainer";
import { routeNames } from "routes";

const Ledger = () => {
  const location = useLocation();
  const state = location.state as any;
  const token: string | undefined = state ? state.token : "";

  return (
    <ModalContainer title="Ledger Login">
      <Dapp.Pages.Ledger callbackRoute={routeNames.dashboard} token={token} />
    </ModalContainer>
  );
};

export default Ledger;
