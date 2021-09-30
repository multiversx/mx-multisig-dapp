import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { Container } from "react-bootstrap";
import SignTransactions from "components/SignTransactions";
import routes, { routeNames } from "routes";
import NotificationModal from "../NotificationModal";
import ToastMessages from "../ToastMessages";
import TransactionSender from "../TransactionSender";
import TxSubmittedModal from "../TxSubmittedModal";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = Dapp.useContext();
  const refreshAccount = Dapp.useRefreshAccount();

  React.useEffect(() => {
    if (loggedIn) {
      refreshAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <div className="bg-light d-flex flex-column flex-fill wrapper">
      <Navbar />

      <main className="d-flex flex-column position-relative flex-grow-1">
        <Sidebar />
        <Dapp.Authenticate routes={routes} unlockRoute={routeNames.unlock}>
          {children}
          <SignTransactions />
          <TransactionSender />
          <NotificationModal />
          <TxSubmittedModal />
          <ToastMessages />
        </Dapp.Authenticate>
      </main>
    </div>
  );
};

export default Layout;
