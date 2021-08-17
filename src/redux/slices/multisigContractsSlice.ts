import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultisigContractInfo } from '../../types/MultisigContractInfo';

export type MultisigContractsState = MultisigContractInfo[];
const initialState: MultisigContractsState = [];
export const multisigContractsSlice = createSlice({
  name: 'multisigContracts',
  initialState,
  reducers: {
    setMultisigContracts: (state, action: PayloadAction<MultisigContractInfo[]>) => {
      return action.payload;
    },
  },
});

export const { setMultisigContracts } = multisigContractsSlice.actions;
export default multisigContractsSlice.reducer;
