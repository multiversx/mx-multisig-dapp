import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RawTransactionType } from "helpers/types";

export interface TransactionInfoSlice {
  processingMessage: string;
  errorMessage: string;
  successMessage: string;
  submittedMessage: string;
  submittedMessageShown: string;
  grouping: Number[];
}

export type StateType = TransactionInfoSlice | void;

const initialState: StateType = undefined;

export const signTransactionsSlice = createSlice({
  name: "signTransactions",
  initialState,
  reducers: {
    setTransactionInfo(
      state: StateType,
      action: PayloadAction<TransactionInfoSlice>,
    ) {
      return { ...state, ...action.payload };
    },
    clearTransactionsInfo: () => initialState,
  },
});

export const { clearTransactionsInfo, setTransactionInfo } =
  signTransactionsSlice.actions;

export default signTransactionsSlice.reducer;
