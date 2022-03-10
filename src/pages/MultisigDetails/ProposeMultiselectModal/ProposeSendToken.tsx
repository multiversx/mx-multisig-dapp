import React, { useState } from 'react';

import { nominate } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { getTokenData } from 'apiCalls/tokenCalls';
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
      const allInput = values.every(Boolean);

      if (allInput) {
        const amountNumeric = Number(amount);
        const parsedAddress = new Address(address);

        if (isNaN(amountNumeric)) {
          return null;
        }

        const token = await getTokenData(identifier);

        if (token) {
          setDecimals(token.decimals);
        }

        const tokens = token ? nominate(amount, token.decimals) : amount;

        return new MultisigSendToken(
          parsedAddress,
          identifier,
          parseInt(tokens)
        );
      } else {
        if (!Boolean(identifier)) {
          setDecimals('');
        }

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
          className={classNames('form-control', {
            'mb-0': Boolean(decimals)
          })}
          value={identifier}
          autoComplete='off'
          onChange={onIdentifierChanged}
        />

        {Boolean(decimals) && <span className='mt-2'>{decimals} decimals</span>}
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
