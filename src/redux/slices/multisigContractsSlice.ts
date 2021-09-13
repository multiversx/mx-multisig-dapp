import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MultisigContractInfo } from "types/MultisigContractInfo";
import { PlainMultisigAddress } from "types/PlainMultisigAddress";
import { logoutAction } from "../commonActions";

interface StateType {
  loading: boolean;
  multisigContracts: MultisigContractInfo[];
  currentMultisigAddress?: PlainMultisigAddress;
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
      action: PayloadAction<MultisigContractInfo[]>,
    ) => {
      console.log(action.payload);
      state.multisigContracts = action.payload;
    },
    setCurrentMultisigAddress: (
      state: StateType,
      action: PayloadAction<PlainMultisigAddress>,
    ) => {
      console.log(action.payload);
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
