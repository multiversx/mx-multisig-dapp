import React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Address } from "@elrondnetwork/erdjs";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useManagerContract } from "contracts/ManagerContract";
import MultisigListItem from "pages/Dashboard/MultisigListItem";
import { multisigContractsSelector } from "redux/selectors/multisigContractsSelectors";
import { refetchSelector } from "redux/selectors/toastSelector";
import { setMultisigContracts } from "redux/slices/multisigContractsSlice";
import AddMultisigModal from "./AddMultisigModal";
import DeployStepsModal from "./DeployMultisigModal";

const Index = () => {
  const multisigContracts = useSelector(multisigContractsSelector);
  const { loggedIn, address } = useDappContext();
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

  return (
    <>
      <div className="owner w-100">
        <div className="card">
          <div className="card-body">
            <div className="p-spacer">
              <button
                onClick={onDeployClicked}
                className="btn btn-primary mb-3 mr-2"
              >
                {t("Deploy Multisig")}
              </button>

              <button
                onClick={onAddMultisigClicked}
                className="btn btn-primary mb-3"
              >
                {t("Add Existing Multisig")}
              </button>
            </div>

            <div className="card border-0">
              <div className="card-body pt-0 px-spacer pb-spacer">
                <h2 className="text-center my-5">
                  {t("Your Multisig Wallets")}
                </h2>
              </div>

              {multisigContracts.length > 0 ? (
                multisigContracts.map((contract) => (
                  <MultisigListItem
                    key={contract.address.hex}
                    contract={contract}
                  />
                ))
              ) : (
                <div className="m-auto text-center py-spacer">
                  <div className="state m-auto p-spacer text-center">
                    <p className="h4 mt-2 mb-1">
                      {t("No Multisig Wallet Yet")}
                    </p>
                    <div className="mb-3">{t("Welcome to our platform!")}</div>
                    <div>
                      <button
                        onClick={onDeployClicked}
                        className="btn btn-primary mb-3 mr-2"
                      >
                        {t("Deploy Multisig")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
      </div>
    </>
  );
};

export default Index;
