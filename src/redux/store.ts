import { configureStore } from "@reduxjs/toolkit";
import multisigContracts from "./slices/multisigContractsSlice";
import signTransactions from "./slices/signTransactionsSlice";
import toasts from "./slices/toastsSlice";

export const store = configureStore({
  reducer: {
    multisigContracts,
    signTransactions,
    toasts,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
