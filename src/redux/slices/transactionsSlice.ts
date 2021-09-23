import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RawTransactionType } from "helpers/types";
import { logoutAction } from "../commonActions";

export interface SignTransactionsType {
  transactions: RawTransactionType[];
  callbackRoute: string;
  sessionId: string;
}

interface SignStatusType {
  [sessionId: string]: {
    transactions?: RawTransactionType[];
    status?: "signed" | "failed" | "cancelled" | "pending";
  };
}

export interface SignTransactionsStateType {
  signStatus: SignStatusType;
  transactionsToSign?: SignTransactionsType;
}

const initialState: SignTransactionsStateType = {
  signStatus: {},
  transactionsToSign: undefined,
};

export const signTransactionsSlice = createSlice({
  name: "signTransactions",
  initialState,
  reducers: {
    updateSignStatus: (
      state: SignTransactionsStateType,
      action: PayloadAction<SignStatusType>,
    ) => {
      state.signStatus = { ...state.signStatus, ...action.payload };
    },

    setTransactionsToSign: (
      state: SignTransactionsStateType,
      action: PayloadAction<SignTransactionsType>,
    ) => {
      state.transactionsToSign = action.payload;
    },
    clearSignTransactions: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  },
});

export const {
  updateSignStatus,
  setTransactionsToSign,
  clearSignTransactions,
} = signTransactionsSlice.actions;

export default signTransactionsSlice.reducer;
