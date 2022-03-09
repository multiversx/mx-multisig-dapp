import React, { useState } from 'react';

import { nominate } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { network } from 'config';
import { MultisigSendToken } from 'types/MultisigSendToken';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken) => void;
}

const ProposeSendToken = ({ handleChange }: ProposeSendTokenType) => {
  const { t } = useTranslation();

  const [address, setAddress] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('');

  const getProposal = async (): Promise<MultisigSendToken | null> => {
    try {
      const values = [amount, address, identifier];

      if (values.every((value) => value !== '')) {
        const amountNumeric = Number(amount);
        const parsedAddress = new Address(address);

        if (isNaN(amountNumeric)) {
          return null;
        }

        const token = await axios.get(
          `${network.apiAddress}/tokens/${identifier}`
        );

        setDecimals(token.data.decimals);

        const tokens = nominate(amount, token.data.decimals);

        return new MultisigSendToken(
          parsedAddress,
          identifier,
          parseInt(tokens)
        );
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  const refreshProposal = () => {
    setTimeout(async () => {
      const proposal = await getProposal();

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
  }, [address, identifier, amount]);

  return (
    <div>
      <div className='modal-control-container'>
        <label>{t('Address')}: </label>
        <input
          type='text'
          className='form-control'
          value={address}
          autoComplete='off'
          onChange={onAddressChanged}
        />
      </div>
      <div className='modal-control-container'>
        <label>{t('Identifier')}: </label>
        <input
          type='text'
          className={`form-control ${decimals !== '' && 'mb-0'}`}
          value={identifier}
          autoComplete='off'
          onChange={onIdentifierChanged}
        />

        {decimals !== '' && <span className='mt-2'>{decimals} decimals</span>}
      </div>
      <div className='modal-control-container'>
        <label>{t('Amount')}: </label>
        <input
          type='number'
          className='form-control'
          value={amount}
          autoComplete='off'
          onChange={onAmountChanged}
        />
      </div>
    </div>
  );
};

export default ProposeSendToken;
