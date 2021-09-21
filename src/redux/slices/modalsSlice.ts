import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons/faInfoCircle";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logoutAction } from "../commonActions";

interface TxSubmittedModal {
  sessionId: string;
  submittedMessage: string;
}

interface NotificationModal {
  icon: typeof faInfoCircle;
  iconClassName: string;
  title: string;
  description: string;
}

export interface ModalsSliceState {
  txSubmittedModal: TxSubmittedModal;
  notificationModal?: NotificationModal;
}

const initialState: ModalsSliceState = {
  txSubmittedModal: {
    sessionId: "",
    submittedMessage: "",
  },
};

export const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setTxSubmittedModal: (
      state: ModalsSliceState,
      action: PayloadAction<TxSubmittedModal>,
    ) => {
      state.txSubmittedModal = action.payload;
    },
    setNotificationModal: (
      state: ModalsSliceState,
      action: PayloadAction<NotificationModal>,
    ) => {
      state.notificationModal = action.payload;
    },
    clearNotificationModal: (state: ModalsSliceState) => {
      state.notificationModal = undefined;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  },
});

export const {
  setTxSubmittedModal,
  setNotificationModal,
  clearNotificationModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
