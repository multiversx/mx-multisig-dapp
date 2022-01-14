import React, { useEffect } from "react";
import {
  AuthenticatedRoutesWrapper,
  refreshAccount,
  useGetAccountInfo,
  useGetLoginInfo,
  DappUI,
} from "@elrondnetwork/dapp-core";
import {
  AccessTokenManager,
  services,
} from "@elrondnetwork/dapp-core-internal";
import { useDispatch } from "react-redux";
import { getAccountData } from "apiCalls/accountCalls";
import { getEconomicsData } from "apiCalls/economicsCalls";
import { getUserMultisigContractsList } from "apiCalls/multisigContractsCalls";
import { maiarIdApi } from "config";
import { uniqueContractAddress, uniqueContractName } from "multisigConfig";
import { setAccountData } from "redux/slices/accountSlice";
import { setEconomics } from "redux/slices/economicsSlice";
import { setMultisigContracts } from "redux/slices/multisigContractsSlice";
import routes, { routeNames } from "routes";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loginMethod, tokenLogin } = useGetLoginInfo();
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();

  const loggedIn = loginMethod != "";
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

  useEffect(() => {
    readMultisigContracts();
  }, [address]);

  async function readMultisigContracts(retries = 0) {
    if (uniqueContractAddress) {
      dispatch(
        setMultisigContracts([
          { address: uniqueContractAddress, name: uniqueContractName ?? "" },
        ]),
      );
      return;
    }

    if (address) {
      try {
        //sometimes, immediately after login, the token is not yet set, so the API will throw
        //this will make sure that the token is set in localstorage before attempting the call, to avoid a 403
        await services.maiarId.getAccessToken({
          address,
          maiarIdApi,
        });
        const contracts = await getUserMultisigContractsList();
        dispatch(setMultisigContracts(contracts));
      } catch (err) {
        if (err === "Access token not found" && retries < 6) {
          setTimeout(() => readMultisigContracts(retries + 1), 200);
        }
        console.log(err);
      }
    }
  }

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
        <DappUI.TransactionsToastList />
      </main>
    </div>
  );
};

export default Layout;
