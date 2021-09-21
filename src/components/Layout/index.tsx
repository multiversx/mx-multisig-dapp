import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import SignTransactions from "components/SignTransactions";
import routes, { routeNames } from "routes";
import ToastMessages from "../ToastMessages";
import TransactionSender from "../TransactionSender";
import Footer from "./Footer";
import Navbar from "./Navbar";

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
      <main className="d-flex flex-column flex-grow-1">
        <Dapp.Authenticate routes={routes} unlockRoute={routeNames.unlock}>
          {children}
          <SignTransactions />
          <TransactionSender />
          <ToastMessages />
        </Dapp.Authenticate>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
