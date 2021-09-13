import { configureStore } from "@reduxjs/toolkit";
import multisigContracts from "./slices/multisigContractsSlice";

export const store = configureStore({
  reducer: {
    multisigContracts,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
