import React, { useState } from 'react';
import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { MultisigSendEgld } from 'types/MultisigSendEgld';
import { BigUIntValue } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { useTranslation } from 'react-i18next';

interface ProposeSendEgldType {
  handleChange: (proposal: MultisigSendEgld) => void;
}

const ProposeSendEgld = ({ handleChange }: ProposeSendEgldType) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState('');
  const { t } = useTranslation();

  const getProposal = (): MultisigSendEgld | null => {
    let addressParam = new Address(address);

    let amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
      return null;
    }

    let amountParam = new BigUIntValue(Balance.egld(amountNumeric).valueOf());

    return new MultisigSendEgld(addressParam, amountParam, data);
  };

  const refreshProposal = () => {
    let proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  const onAddressChanged = (event: any) => {
    setAddress(event.target.value);
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);
  };

  const onDataChanged = (event: any) => {
    setData(event.target.value);
  };

  React.useEffect(() => {
    refreshProposal();
  }, [address, amount, data]);

  return (
    <div>
      <div className="modal-control-container">
        <span>{t('Address')}: </span>
        <input
          type="text"
          className="form-control"
          value={address}
          autoComplete="off"
          onChange={onAddressChanged}
        />
      </div>
      <div className="modal-control-container">
        <span>{t('Amount')}: </span>
        <input
          type="text"
          className="form-control"
          value={amount}
          autoComplete="off"
          onChange={onAmountChanged}
        />
      </div>
      <div className="modal-control-container">
        <span>{t('Data')}: </span>
        <input
          type="text"
          className="form-control"
          value={data}
          autoComplete="off"
          onChange={onDataChanged}
        />
      </div>
    </div>
  );
};

export default ProposeSendEgld;
