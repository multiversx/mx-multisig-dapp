import React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Address } from "@elrondnetwork/erdjs";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useManagerContract } from "contracts/ManagerContract";
import MultisigListItem from "pages/Dashboard/MultisigListItem";
import { multisigContractsSelector } from "redux/selectors/multisigContractsSelectors";
import { refetchSelector } from "redux/selectors/toastSelector";
import { setMultisigContracts } from "redux/slices/multisigContractsSlice";
import getProviderType from "../../components/SignTransactions/helpers/getProviderType";
import { providerTypes } from "../../helpers/constants";
import AddMultisigModal from "./AddMultisigModal";
import DeployStepsModal from "./DeployMultisigModal";
import wawe from "assets/img/wawe.svg";
import CreateWallet from "assets/img/create-wallet.svg";
import OpenWallet from "assets/img/open-wallet.svg";
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Index = () => {
  const multisigContracts = useSelector(multisigContractsSelector);
  const { loggedIn, dapp, address } = useDappContext();
  const dispatch = useDispatch();
  const refetch = useSelector(refetchSelector);
  const {
    deployMultisigContract,
    queryContracts,
    mutateRegisterMultisigContract,
  } = useManagerContract();
  const { t } = useTranslation();
  const [showAddMultisigModal, setShowAddMultisigModal] = React.useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] =
    React.useState(false);

  const providerType = getProviderType(dapp.provider);

  const isWalletProvider = providerType === providerTypes.wallet;

  const onDeployClicked = async () => {
    setShowDeployMultisigModal(true);
  };

  const onDeploy = async (name: string) => {
    deployMultisigContract(name);
  };
  const onAddMultisigClicked = async () => {
    setShowAddMultisigModal(true);
  };

  const onAddMultisigFinished = async (newAddress: Address) => {
    mutateRegisterMultisigContract(newAddress);

    setShowAddMultisigModal(false);
  };

  const readMultisigContracts = async () => {
    const contracts = await queryContracts();
    dispatch(setMultisigContracts(contracts));
  };

  React.useEffect(() => {
    if (address && address !== "") {
      readMultisigContracts();
    }
  }, [address, refetch]);

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  const deployButton = (
    <button
      disabled={isWalletProvider}
      onClick={onDeployClicked}
      className="rounded1 shadow-sm"
      style={{ pointerEvents: isWalletProvider ? "none" : "auto" }}
    >
      <figure>
        <img src={CreateWallet} alt="create-wallet-icon" />
      </figure>
      <p className="action">
        {t("Create wallet")}
        <FontAwesomeIcon icon={faArrowRight} />
      </p>
      <p className="info-text">Search and explore existing organizations</p>
    </button>
  );

  const deployButtonContainer = isWalletProvider ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={(props) => {
        return (
          <Tooltip id="deploy-button-tooltip" {...props}>
            {t("Please use another login method to deploy a contract")}
          </Tooltip>
        );
      }}
    >
      <span className="d-inline-block">{deployButton}</span>
    </OverlayTrigger>
  ) : (
    deployButton
  );

  return (
    <>
      <div className="owner w-100 d-flex justify-content-center align-items-center flex-column">
        <div className="my-wallets">
          <div className="welcome text-center">
            <h2>
              Welcome to Multisig
              <span>
                <img src={wawe} alt="wawe-icon" width="36" height="36" />
              </span>
            </h2>
            <p>Create your own organization in a few minutes</p>
          </div>

          {multisigContracts.length == 0 ? (
            <div className="wallet-card">
              <div className="d-flex wallet-spacer">
                {deployButtonContainer}

                <button
                  onClick={onAddMultisigClicked}
                  className="rounded14 shadow-sm"
                >
                  <figure>
                    <img src={OpenWallet} alt="create-wallet-icon" />
                  </figure>
                  <p className="action">
                    {t("Open wallet")}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </p>
                  <p className="info-text">
                    Search and explore existing organizations
                  </p>
                </button>
              </div>
            </div>
          ) : (
            multisigContracts.map((contract) => (
              <MultisigListItem
                key={contract.address.hex}
                contract={contract}
              />
            ))
          )}
        </div>

        <AddMultisigModal
          show={showAddMultisigModal}
          handleClose={() => {
            setShowAddMultisigModal(false);
          }}
          handleAdd={onAddMultisigFinished}
        />
        <DeployStepsModal
          show={showDeployMultisigModal}
          handleClose={() => setShowDeployMultisigModal(false)}
          handleDeploy={onDeploy}
        />
        <p className="info-msg">
          New to Multisig?&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="">Learn more</a>
        </p>
      </div>
    </>
  );
};

export default Index;
