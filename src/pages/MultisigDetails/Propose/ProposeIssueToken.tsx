import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MultisigIssueToken } from 'types/MultisigIssueToken';

interface ProposeIssueTokenType {
  handleChange: (proposal: MultisigIssueToken) => void;
}

const ProposeIssueToken = ({ handleChange } : ProposeIssueTokenType) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('');
  const [canFreeze, setCanFreeze] = useState(false);
  const [canWipe, setCanWipe] = useState(false);
  const [canPause, setCanPause] = useState(false);
  const [canMint, setCanMint] = useState(false);
  const [canBurn, setCanBurn] = useState(false);
  const [canChangeOwner, setCanChangeOwner] = useState(false);
  const [canUpgrade, setCanUpgrade] = useState(true);

  const getProposal = () : MultisigIssueToken | null => {
    let amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
        return null;
    }

    let decimalsNumeric = Number(decimals);
    if (isNaN(decimalsNumeric)) {
        return null;
    }

    let result = new MultisigIssueToken(name, identifier.toUpperCase(), amountNumeric, decimalsNumeric);
    result.canFreeze = canFreeze;
    result.canWipe = canWipe;
    result.canPause = canPause;
    result.canMint = canMint;
    result.canBurn = canBurn;
    result.canChangeOwner = canChangeOwner;
    result.canUpgrade = canUpgrade;

    return result;
  };

  const refreshProposal = () => {
    let proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  const onNameChanged = (event: any) => {
    setName(event.target.value);
  };

  const onIdentifierChanged = (event: any) => {
    setIdentifier(event.target.value);
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);
  };

  const onDecimalsChanged = (event: any) => {
    setDecimals(event.target.value);
  };

  React.useEffect(() => {
    refreshProposal();
  }, [ name, identifier, amount, decimals, canFreeze, canWipe, canPause, canMint, canBurn, canChangeOwner, canUpgrade ]);

  return (
    <div>
      <div className="modal-control-container">
        <span>{t('Name')}: </span>
        <input 
          type="text"
          className='form-control'
          value={name}
          autoComplete="off"
          onChange={onNameChanged}
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
        <span>{t('Mint Amount')}: </span>
        <input 
          type="number"
          className='form-control'
          value={amount}
          autoComplete="off"
          onChange={onAmountChanged}
        />
      </div>
      <div className="modal-control-container">
        <span>{t('Decimals')}: </span>
        <input 
          type="number"
          className='form-control'
          value={decimals}
          autoComplete="off"
          onChange={onDecimalsChanged}
        />
      </div>
      <div className="modal-control-container">
        <span></span>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="checkbox" id="canFreezeCheckBox" checked={canFreeze} onChange={(e) => setCanFreeze(e.target.checked)}></input>
          <label className="form-check-label" htmlFor="canFreezeCheckBox">{t('Can Freeze')}</label>
        </div>
      </div>
      <div className="modal-control-container">
        <span></span>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="checkbox" id="canWipeCheckBox" checked={canWipe} onChange={(e) => setCanWipe(e.target.checked)}></input>
          <label className="form-check-label" htmlFor="canWipeCheckBox">{t('Can Wipe')}</label>
        </div>
      </div>
      <div className="modal-control-container">
        <span></span>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="checkbox" id="canPauseCheckBox" checked={canPause} onChange={(e) => setCanPause(e.target.checked)}></input>
          <label className="form-check-label" htmlFor="canPauseCheckBox">{t('Can Pause')}</label>
        </div>
      </div>
      <div className="modal-control-container">
        <span></span>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="checkbox" id="canMintCheckBox" checked={canMint} onChange={(e) => setCanMint(e.target.checked)}></input>
          <label className="form-check-label" htmlFor="canMintCheckBox">{t('Can Mint')}</label>
        </div>
      </div>
      <div className="modal-control-container">
        <span></span>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="checkbox" id="canBurnCheckBox" checked={canBurn} onChange={(e) => setCanBurn(e.target.checked)}></input>
          <label className="form-check-label" htmlFor="canBurnCheckBox">{t('Can Burn')}</label>
        </div>
      </div>
      <div className="modal-control-container">
        <span></span>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="checkbox" id="canChangeOwnerCheckBox" checked={canChangeOwner} onChange={(e) => setCanChangeOwner(e.target.checked)}></input>
          <label className="form-check-label" htmlFor="canChangeOwnerCheckBox">{t('Can Change Owner')}</label>
        </div>
      </div>
      <div className="modal-control-container">
        <span></span>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="checkbox" id="canUpgradeCheckBox" checked={canUpgrade} onChange={(e) => setCanUpgrade(e.target.checked)}></input>
          <label className="form-check-label" htmlFor="canUpgradeCheckBox">{t('Can Upgrade')}</label>
        </div>
      </div>
    </div>
  );
};

export default ProposeIssueToken;