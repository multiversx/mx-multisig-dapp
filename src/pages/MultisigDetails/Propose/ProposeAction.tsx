import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProposeModal from './ProposeModal';

const ProposeAction = () => {
  const [showProposeModal, setShowProposeModal] = useState(false);
  const { t } = useTranslation();

  return (
    <div>
      <button
        onClick={() => {
          setShowProposeModal(true);
        }}
        className="btn btn-primary mb-3"
      >
        {t('Propose')}
      </button>
      <ProposeModal
        show={showProposeModal}
        handleClose={() => {
          setShowProposeModal(false);
        }}
      />
    </div>
  );
};

export default ProposeAction;
