import React, { useEffect } from "react";
import {
  AuthenticatedRoutesWrapper,
  refreshAccount,
  useGetAccountInfo,
  useGetLoginInfo,
  DappUI,
} from "@elrondnetwork/dapp-core";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAccountData } from "apiCalls/accountCalls";
import { getEconomicsData } from "apiCalls/economicsCalls";
import { getUserMultisigContractsList } from "apiCalls/multisigContractsCalls";
import { uniqueContractAddress, uniqueContractName } from "multisigConfig";
import { setAccountData } from "redux/slices/accountSlice";
import { setEconomics } from "redux/slices/economicsSlice";
import { setMultisigContracts } from "redux/slices/multisigContractsSlice";
import routes, { routeNames } from "routes";
import { accessTokenServices, storageApi } from "services/accessTokenServices";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loginMethod } = useGetLoginInfo();
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    if (uniqueContractAddress || storageApi == null) {
      dispatch(
        setMultisigContracts([
          { address: uniqueContractAddress, name: uniqueContractName ?? "" },
        ]),
      );
      navigate("/multisig/" + uniqueContractAddress);
      return;
    }
    if (address) {
      try {
        if (accessTokenServices?.maiarId) {
          //sometimes, immediately after login, the token is not yet set, so the API will throw
          //this will make sure that the token is set in localstorage before attempting the call, to avoid a 403
          await accessTokenServices?.maiarId?.getAccessToken?.({
            address,
            storageApi,
          });
        }
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
      ("");
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

        <DappUI.TransactionsToastList />
      </main>
    </div>
  );
};

export default Layout;
