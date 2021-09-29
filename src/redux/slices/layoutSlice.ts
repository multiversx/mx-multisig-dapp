import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logoutAction } from "../commonActions";

export interface StateType {
  isSidebarOpen: boolean;
}

const initialState: StateType = {
  isSidebarOpen: false,
};

export const layoutSlice = createSlice({
  name: "layoutSlice",
  initialState,
  reducers: {
    setIsSidebarOpen(state: StateType, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  },
});

export const { setIsSidebarOpen } = layoutSlice.actions;

export default layoutSlice.reducer;
