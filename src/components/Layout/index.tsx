import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { useDispatch } from "react-redux";
import SignTransactions from "components/SignTransactions";
import routes, { routeNames } from "routes";
import { getEconomicsData } from "../../apiCalls/economicsCalls";
import { setEconomics } from "../../redux/slices/economicsSlice";
import NotificationModal from "../NotificationModal";
import ToastMessages from "../ToastMessages";
import TransactionSender from "../TransactionSender";
import TxSubmittedModal from "../TxSubmittedModal";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = Dapp.useContext();
  const dispatch = useDispatch();
  const refreshAccount = Dapp.useRefreshAccount();

  React.useEffect(() => {
    if (loggedIn) {
      refreshAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  React.useEffect(() => {
    fetchEconomics();
  }, []);

  async function fetchEconomics() {
    const economics = await getEconomicsData();
    if (economics !== null) {
      dispatch(setEconomics(economics));
    }
  }

  return (
    <div className="bg-light d-flex flex-column flex-fill wrapper">
      <Navbar />

      <main className="d-flex flex-row flex-fill position-relative justify-center container">
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
