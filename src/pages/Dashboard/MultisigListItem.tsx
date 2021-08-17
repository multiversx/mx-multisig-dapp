import React from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import { useHistory } from 'react-router-dom';
import { useManagerContract } from 'contracts/ManagerContract';
import { ReactComponent as Wallet } from '../../assets/img/wallet.svg';
import { useTranslation } from 'react-i18next';

export interface MultisigCardType {
  address: Address;
  name: string;
}

const MultisigCard = ({ address = Address.Zero(), name = '' }: MultisigCardType) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { mutateUnregisterMultisigContract } = useManagerContract();
  const onEnterClicked = () => {
    history.push('/multisig/' + address.bech32());
  };

  const onUnregisterClicked = async () => {
    await mutateUnregisterMultisigContract(address);
  };

  return (
    <div className="statcard card-bg-grey text-black py-3 px-4 mb-spacer ml-spacer rounded mx-4">
      <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
        <div className="icon my-1 fill-black">
          <Wallet className="logo" />
        </div>
      </div>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-2">
        <div>
          <div className="h5 mb-0">{name}</div>
          <div className="opacity-6">{address.bech32()}</div>
        </div>
        <div>
          <button onClick={onEnterClicked} className="btn btn-primary mb-3 mr-2">
            {t('Enter')}
          </button>
          <button onClick={onUnregisterClicked} className="btn btn-primary  mb-3 mr-2">
            {t('Unregister')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultisigCard;
