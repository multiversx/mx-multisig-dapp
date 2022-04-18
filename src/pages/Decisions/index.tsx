import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DecisionsActionsCards from 'components/DecisionsComponents/decisionsActionsCards';
import DecisionsHeader from 'components/DecisionsComponents/decisionsHeader';
import DecisionsStatus from 'components/DecisionsComponents/decisionsStatus';
import ProgressBarsSection from 'components/DecisionsComponents/progressBarsSection';
import './decisions.scss';

const Decisions = () => {
  return (
    <Box
      className={
        'd-flex flex-fill justify-content-center align-items-center flex-column decisions-wrapper'
      }
    >
      <DecisionsHeader />
      <ProgressBarsSection />
      <DecisionsStatus />
      <DecisionsActionsCards />
    </Box>
  );
};

export default Decisions;