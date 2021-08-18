import { StateType } from './state';

export type DispatchType = (action: ActionType) => void;

export enum ActionTypes {
  loading,
  setCurrentMultisigAddress,
  setMultisigContracts,
}

export type ActionType =
  | { type: ActionTypes.loading; loading: StateType['loading'] }
  | {
      type: ActionTypes.setCurrentMultisigAddress;
      currentMultisigAddress: StateType['currentMultisigAddress'];
    }
  | { type: ActionTypes.setMultisigContracts; contracts: StateType['multisigContracts'] };

export function reducer(state: StateType, action: any): StateType {
  switch (action.type) {
    case ActionTypes.loading: {
      const { loading } = action;
      return {
        ...state,
        loading,
      };
    }
    case ActionTypes.setCurrentMultisigAddress: {
      const { currentMultisigAddress } = action;
      return {
        ...state,
        currentMultisigAddress,
      };
    }
    case ActionTypes.setMultisigContracts: {
      return {
        ...state,
        multisigContracts: action.contracts,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action?.type}`);
    }
  }
}
