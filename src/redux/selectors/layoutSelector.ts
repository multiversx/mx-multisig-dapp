import { RootState } from "../store";
import { createDeepEqualSelector } from "./helpers";

const mainSelector = (state: RootState) => state.layout;

export const isSidebarOpenSelector = createDeepEqualSelector(
  mainSelector,
  (state) => state.isSidebarOpen,
);
