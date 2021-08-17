import React, { useState, useEffect } from 'react';
import { useContext } from 'context';
import { useTranslation } from 'react-i18next';

interface ProposeChangeQuorumType {
  handleParamsChange: (params: number) => void;
}

const ProposeChangeQuorum = ({ handleParamsChange } : ProposeChangeQuorumType) => {
  const { quorumSize } = useContext();
  const { t } = useTranslation();

  const [newQuorumSize, setNewQuorumSize] = useState(0);

  const handleNewQuorumSizeChanged = (event: any) => {
    setNewQuorumSize(event.target.value);

    handleParamsChange(event.target.value);
  };

  useEffect(() => {
    setNewQuorumSize(quorumSize);
  }, [quorumSize]);

  return (
    <div className="modal-control-container">
      <span>{t('Quorum Size')}: </span>
      <input 
        style={{width: 250}}
        type="number"
        className='form-control'
        value={newQuorumSize}
        autoComplete="off"
        onChange={handleNewQuorumSizeChanged}
      />
    </div>
  );
};

export default ProposeChangeQuorum;