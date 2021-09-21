import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MultisigContractInfoType,
  PlainMultisigAddressType,
} from "types/multisigContracts";
import { logoutAction } from "../commonActions";

interface StateType {
  loading: boolean;
  multisigContracts: MultisigContractInfoType[];
  currentMultisigAddress?: PlainMultisigAddressType;
}

const initialState: StateType = {
  multisigContracts: [],
  loading: true,
  currentMultisigAddress: undefined,
};

export const multisigContractsSlice = createSlice({
  name: "multisigContracts",
  initialState,
  reducers: {
    setMultisigContractsLoading: (
      state: StateType,
      action: PayloadAction<boolean>,
    ) => {
      state.loading = action.payload;
    },
    setMultisigContracts: (
      state: StateType,
      action: PayloadAction<MultisigContractInfoType[]>,
    ) => {
      state.multisigContracts = action.payload;
    },
    setCurrentMultisigAddress: (
      state: StateType,
      action: PayloadAction<PlainMultisigAddressType>,
    ) => {
      state.currentMultisigAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  },
});

export const {
  setMultisigContractsLoading,
  setCurrentMultisigAddress,
  setMultisigContracts,
} = multisigContractsSlice.actions;

export default multisigContractsSlice.reducer;
