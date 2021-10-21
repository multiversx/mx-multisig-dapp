import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons/faInfoCircle";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MultisigActionType } from "types/MultisigActionType";
import { ProposalsTypes } from "types/Proposals";
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

export interface SelectedActionToPerform {
  id: number;
  actionType?: MultisigActionType;
}
interface PerformActionModal {
  selectedAction: SelectedActionToPerform | null;
}

export interface RemoveUserOptionType {
  option: ProposalsTypes.remove_user;
  address: string;
}

interface SimpleSelectedOptionType {
  option: ProposalsTypes;
}

export type SelectedOptionType =
  | SimpleSelectedOptionType
  | RemoveUserOptionType
  | null
  | undefined;

interface ProposeModal {
  selectedOption?: SelectedOptionType;
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
    selectedAction: null,
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
      action: PayloadAction<SelectedOptionType | null>,
    ) => {
      state.proposeModal.selectedOption = action.payload;
    },
    setSelectedPerformedAction: (
      state: ModalsSliceState,
      action: PayloadAction<SelectedActionToPerform | null>,
    ) => {
      state.performActionModal.selectedAction = action.payload;
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
  setSelectedPerformedAction,
} = modalsSlice.actions;

export default modalsSlice.reducer;
