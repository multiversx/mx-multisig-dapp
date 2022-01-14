import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MultisigContractInfoType } from "types/multisigContracts";
import { logoutAction } from "../commonActions";

interface StateType {
  fetched: boolean;
  multisigContracts: MultisigContractInfoType[];
  currentMultisigContract: MultisigContractInfoType | null;
  currentMultisigTransactionId: string | null;
}

const initialState: StateType = {
  multisigContracts: [],
  fetched: false,
  currentMultisigContract: null,
  currentMultisigTransactionId: null,
};

export const multisigContractsSlice = createSlice({
  name: "multisigContracts",
  initialState,
  reducers: {
    setMultisigContractsFetched: (
      state: StateType,
      action: PayloadAction<boolean>,
    ) => {
      state.fetched = action.payload;
    },
    setMultisigContracts: (
      state: StateType,
      action: PayloadAction<MultisigContractInfoType[]>,
    ) => {
      state.multisigContracts = action.payload;
      state.fetched = true;
    },
    setCurrentMultisigTransactionId: (
      state: StateType,
      action: PayloadAction<string | null>,
    ) => {
      state.currentMultisigTransactionId = action.payload;
    },
    setCurrentMultisigContract: (
      state: StateType,
      action: PayloadAction<string>,
    ) => {
      const contracts = state.multisigContracts;
      const currentContract = contracts.find(
        (contract) => contract.address === action.payload,
      );
      if (currentContract != null) {
        state.currentMultisigContract = currentContract;
      }
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
        if (contract.address === address) {
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
  setCurrentMultisigContract,
  setCurrentMultisigTransactionId,
  updateMultisigContract,
  setMultisigContracts,
} = multisigContractsSlice.actions;

export default multisigContractsSlice.reducer;
