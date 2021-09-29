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
    setMultisigContractsFetched: (
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

    updateMultisigContract: (
      state: StateType,
      action: PayloadAction<Partial<MultisigContractInfoType>>,
    ) => {
      const { address } = action.payload;
      if (address == null) {
        return state;
      }
      state.multisigContracts = state.multisigContracts.map((contract) => {
        if (contract.address.bech32 === address.bech32) {
          return {
            ...contract,
            ...action.payload,
          };
        }
        return contract;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  },
});

export const {
  setMultisigContractsFetched,
  setCurrentMultisigAddress,
  updateMultisigContract,
  setMultisigContracts,
} = multisigContractsSlice.actions;

export default multisigContractsSlice.reducer;
