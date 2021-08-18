import { Redirect } from 'react-router-dom';
import { Address } from '@elrondnetwork/erdjs';
import { useContext as useDappContext } from '@elrondnetwork/dapp';
import React from 'react';
import { useContext, useDispatch } from 'context';
import MultisigListItem from 'pages/Dashboard/MultisigListItem';
import AddMultisigModal from './AddMultisigModal';
import { useDeployContract } from 'contracts/DeployContract';
import { useManagerContract } from 'contracts/ManagerContract';
import { hexToAddress, hexToString } from 'helpers/converters';
import { tryParseTransactionParameter } from 'helpers/urlparameters';
import DeployStepsModal from './DeployMultisigModal';
import { useTranslation } from 'react-i18next';
import { ActionTypes } from '../../context/reducer';

const Index = () => {
  const { multisigDeployerContracts, multisigContracts, multisigManagerContract } = useContext();
  const { loggedIn, address, apiAddress } = useDappContext();
  const dispatch = useDispatch();
  const { sendDeployTransaction } = useDeployContract();
  const { mutateRegisterMultisigContractName, mutateRegisterMultisigContract, queryContracts } =
    useManagerContract();
  const { t } = useTranslation();
  const [showAddMultisigModal, setShowAddMultisigModal] = React.useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = React.useState(false);
  const [currentDeploymentStep, setCurrentDeploymentStep] = React.useState(0);

  const onDeployClicked = async () => {
    setCurrentDeploymentStep(0);
    setShowDeployMultisigModal(true);
  };

  const onDeployStepConfirmed = async (name: string) => {
    if (currentDeploymentStep === 0) {
      await sendDeployTransaction(1, [new Address(address)]);
    } else if (currentDeploymentStep === 1) {
      let multisigAddressHex = sessionStorage.getItem('multisigAddressHex');
      if (!multisigAddressHex) {
        return;
      }

      let multisigAddress = new Address(multisigAddressHex);
      await mutateRegisterMultisigContractName(multisigAddress, name);
    } else if (currentDeploymentStep === 2) {
      let multisigAddressHex = sessionStorage.getItem('multisigAddressHex');
      if (!multisigAddressHex) {
        return;
      }

      let multisigAddress = new Address(multisigAddressHex);
      await mutateRegisterMultisigContract(multisigAddress);
    }
  };

  const onAddMultisigClicked = async () => {
    setShowAddMultisigModal(true);
  };

  const onAddMultisigFinished = async (address: Address) => {
    await mutateRegisterMultisigContract(address);

    setShowAddMultisigModal(false);
  };

  const readMultisigContracts = async () => {
    let contracts = await queryContracts();
    dispatch({
      type: ActionTypes.setMultisigContracts,
      contracts,
    });
  };

  const tryParseUrlParams = async () => {
    let parameters = await tryParseTransactionParameter(apiAddress);
    if (parameters === null) {
      return;
    }

    if (multisigDeployerContracts.includes(parameters.receiver.bech32())) {
      if (parameters.functionName === 'deployContract') {
        if (
          parameters.outputParameters.length === 2 &&
          hexToString(parameters.outputParameters[0]) === 'ok'
        ) {
          let multisigAddress = hexToAddress(parameters.outputParameters[1]);
          if (multisigAddress !== null) {
            onDeployContract(multisigAddress);
          }
        }
      }
    } else if (parameters.receiver.bech32() === multisigManagerContract) {
      if (parameters.functionName === 'registerMultisigName') {
        if (
          parameters.outputParameters.length === 1 &&
          hexToString(parameters.outputParameters[0]) === 'ok'
        ) {
          onRegisterMultisigName();
        }
      } else if (parameters.functionName === 'registerMultisigContract') {
        if (
          parameters.outputParameters.length === 1 &&
          hexToString(parameters.outputParameters[0]) === 'ok'
        ) {
          onRegisterMultisigContract();
        }
      }
    }
  };

  const onDeployContract = async (multisigAddress: Address) => {
    sessionStorage.setItem('multisigAddressHex', multisigAddress.hex());

    setCurrentDeploymentStep(1);
    setShowDeployMultisigModal(true);
  };

  const onRegisterMultisigName = async () => {
    setCurrentDeploymentStep(2);
    setShowDeployMultisigModal(true);
  };

  const onRegisterMultisigContract = async () => {
    sessionStorage.removeItem('multisigAddressHex');
  };

  React.useEffect(() => {
    tryParseUrlParams();
    if (address && address !== '') {
      readMultisigContracts();
    }
  }, [address]);
  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <div className="owner w-100">
        <div className="card">
          <div className="card-body">
            <div className="p-spacer">
              <button onClick={onDeployClicked} className="btn btn-primary mb-3 mr-2">
                {t('Deploy Multisig')}
              </button>

              <button onClick={onAddMultisigClicked} className="btn btn-primary mb-3">
                {t('Add Existing Multisig')}
              </button>
            </div>

            <div className="card border-0">
              <div className="card-body pt-0 px-spacer pb-spacer">
                <h2 className="text-center my-5">{t('Your Multisig Wallets')}</h2>
              </div>

              {multisigContracts.length > 0 ? (
                multisigContracts.map((contract) => (
                  <MultisigListItem
                    key={contract.address.hex()}
                    address={contract.address}
                    name={contract.name}
                  />
                ))
              ) : (
                <div className="m-auto text-center py-spacer">
                  <div className="state m-auto p-spacer text-center">
                    <p className="h4 mt-2 mb-1">{t('No Multisig Wallet Yet')}</p>
                    <div className="mb-3">{t('Welcome to our platform!')}</div>
                    <div>
                      <button onClick={onDeployClicked} className="btn btn-primary mb-3 mr-2">
                        {t('Deploy Multisig')}
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
          currentStep={currentDeploymentStep}
          handleClose={() => setShowDeployMultisigModal(false)}
          handleStep={onDeployStepConfirmed}
        />
      </div>
    </>
  );
};

export default Index;
