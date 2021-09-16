import { RootState } from "../store";
import { createDeepEqualSelector } from "./helpers";

const mainSelector = (state: RootState) => state.signTransactions;

export const signStatusSelector = createDeepEqualSelector(
  mainSelector,
  (state) => state.signStatus,
);

export const transactionsToSignSelector = createDeepEqualSelector(
  mainSelector,
  (state) => state.transactionsToSign,
);
