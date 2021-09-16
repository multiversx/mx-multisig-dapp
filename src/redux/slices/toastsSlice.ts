import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionToastType, ToastType } from "types/toasts";
import { logoutAction } from "../commonActions";

export interface ToastsState {
  toasts: ToastType[];
  toastSignSessions: string[];
  transactionToasts: TransactionToastType[];
  refetch: number;
}

const initialState: ToastsState = {
  toasts: [],
  toastSignSessions: [],
  transactionToasts: [],
  refetch: Date.now(),
};

export const toastsSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    addToast: (state: ToastsState, action: PayloadAction<ToastType>) => {
      const toast = action.payload;
      const timestamp = Date.now();
      const toastAlreadyExists = state.toasts.some((t) => t.id === toast.id);
      if (!toastAlreadyExists) {
        state.toasts.unshift({ ...toast, timestamp });
      } else {
        //if the toast already exists, update it
        state.toasts = state.toasts.map((existingToast) => {
          if (existingToast.id === toast.id) {
            return {
              ...existingToast,
              ...toast,
            };
          }
          return existingToast;
        });
      }
    },
    updateToast: (
      state: ToastsState,
      action: PayloadAction<Partial<ToastType>>,
    ) => {
      const toast = action.payload;
      state.toasts = state.toasts.map((existingToast) => {
        if (existingToast.id === toast.id) {
          return {
            ...existingToast,
            ...toast,
          };
        }
        return existingToast;
      });
    },
    removeToast: (state: ToastsState, action: PayloadAction<string>) => {
      const removedToastId = action.payload;
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== removedToastId,
      );
    },
    setTransactionToasts: (
      state: ToastsState,
      action: PayloadAction<TransactionToastType[]>,
    ) => {
      state.transactionToasts = action.payload;
    },
    addToastSignSession: (
      state: ToastsState,
      action: PayloadAction<string>,
    ) => {
      const toastSignSession = action.payload;
      if (!state.toastSignSessions.includes(toastSignSession)) {
        state.toastSignSessions.unshift(toastSignSession);
      }
    },
    updateToastsRefetch: (state: ToastsState) => {
      state.refetch = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  },
});

export const {
  addToast,
  updateToast,
  removeToast,
  setTransactionToasts,
  addToastSignSession,
  updateToastsRefetch,
} = toastsSlice.actions;

export default toastsSlice.reducer;
