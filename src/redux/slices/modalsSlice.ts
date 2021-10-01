import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons/faInfoCircle";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProposalsTypes } from "../../types/Proposals";
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

interface PerformActionModal {
  selectedActionId: number | null;
}

interface ProposeModal {
  selectedOption?: ProposalsTypes | null;
}

export interface ModalsSliceState {
  txSubmittedModal?: TxSubmittedModal;
  notificationModal?: NotificationModal;
  proposeModal: ProposeModal;
  performActionModal: PerformActionModal;
}

const initialState: ModalsSliceState = {
  proposeModal: {
    selectedOption: null,
  },
  performActionModal: {
    selectedActionId: null,
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
    clearTxSubmittedModal: (state: ModalsSliceState) => {
      state.txSubmittedModal = undefined;
    },
    clearNotificationModal: (state: ModalsSliceState) => {
      state.notificationModal = undefined;
    },
    setProposeModalSelectedOption: (
      state: ModalsSliceState,
      action: PayloadAction<ProposalsTypes | null>,
    ) => {
      state.proposeModal.selectedOption = action.payload;
    },
    setSelectedPerformedActionId: (
      state: ModalsSliceState,
      action: PayloadAction<number | null>,
    ) => {
      state.performActionModal.selectedActionId = action.payload;
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
  clearTxSubmittedModal,
  clearNotificationModal,
  setProposeModalSelectedOption,
  setSelectedPerformedActionId,
} = modalsSlice.actions;

export default modalsSlice.reducer;
