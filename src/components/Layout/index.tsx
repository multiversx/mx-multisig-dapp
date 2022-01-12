import React from "react";
import {
  AuthenticatedRoutesWrapper,
  getIsLoggedIn,
  refreshAccount,
  useGetAccountInfo,
  useGetLoginInfo,
} from "@elrondnetwork/dapp-core";
import { AccessTokenManager } from "@elrondnetwork/dapp-core-internal";
import { useDispatch } from "react-redux";
import { getAccountData } from "apiCalls/accountCalls";
import { getEconomicsData } from "apiCalls/economicsCalls";
import { maiarIdApi } from "config";
import { setAccountData } from "redux/slices/accountSlice";
import { setEconomics } from "redux/slices/economicsSlice";
import routes, { routeNames } from "routes";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loginMethod, tokenLogin } = useGetLoginInfo();
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();
  const loggedIn = getIsLoggedIn();

  React.useEffect(() => {
    if (loggedIn) {
      refreshAccount();
      fetchAccountData();
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

  async function fetchAccountData() {
    const accountData = await getAccountData(address);
    if (accountData !== null) {
      dispatch(setAccountData(accountData));
    }
  }

  return (
    <div className="bg-light d-flex flex-column flex-fill wrapper">
      <Navbar />

      <main className="d-flex flex-row flex-fill position-relative justify-center  container">
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={routeNames.unlock}
        >
          {children}
        </AuthenticatedRoutesWrapper>
        <AccessTokenManager
          loggedIn={loggedIn}
          loginMethod={loginMethod}
          userAddress={address}
          tokenLogin={tokenLogin}
          maiarIdApi={maiarIdApi}
        />
      </main>
    </div>
  );
};

export default Layout;
