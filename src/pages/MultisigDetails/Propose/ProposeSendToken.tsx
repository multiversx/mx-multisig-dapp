import { Address } from '@elrondnetwork/erdjs/out';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MultisigSendToken } from 'types/MultisigSendToken';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken) => void;
}

const ProposeSendToken = ({ handleChange } : ProposeSendTokenType) => {
  const { t } = useTranslation();

  const [address, setAddress] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');

  const getProposal = () : MultisigSendToken | null => {
    let amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
        return null;
    }

    return new MultisigSendToken(new Address(address), identifier, amountNumeric);
  };

  const refreshProposal = () => {
    setTimeout(() => {
      let proposal = getProposal();
      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const onAddressChanged = (event: any) => {
    setAddress(event.target.value);
  };

  const onIdentifierChanged = (event: any) => {
    setIdentifier(event.target.value);
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);
  };

  React.useEffect(() => {
    refreshProposal();
  }, [ address, identifier, amount ]);

  return (
    <div>
      <div className="modal-control-container">
        <span>{t('Address')}: </span>
        <input 
          type="text"
          className='form-control'
          value={address}
          autoComplete="off"
          onChange={onAddressChanged}
        />
      </div>
      <div className="modal-control-container">
        <span>{t('Identifier')}: </span>
        <input 
          type="text"
          className='form-control'
          value={identifier}
          autoComplete="off"
          onChange={onIdentifierChanged}
        />
      </div>
      <div className="modal-control-container">
        <span>{t('Amount')}: </span>
        <input 
          type="number"
          className='form-control'
          value={amount}
          autoComplete="off"
          onChange={onAmountChanged}
        />
      </div>
    </div>
  );
};

export default ProposeSendToken;