import { Address } from '@elrondnetwork/erdjs';
import { network, NetworkType } from '../config';
import { MultisigContractInfo } from '../types/MultisigContractInfo';

export const defaultNetwork: NetworkType = {
  id: 'not-configured',
  name: 'NOT CONFIGURED',
  egldLabel: '',
  walletAddress: '',
  apiAddress: '',
  gatewayAddress: '',
  explorerAddress: '',
  multisigDeployerContracts: [],
  multisigManagerContract: '',
};

export interface StateType {
  loading: boolean;
  error: string;
  denomination: number;
  decimals: number;
  multisigContracts: MultisigContractInfo[];
  multisigContract?: string;
  multisigDeployerContracts: string[];
  multisigManagerContract?: string;
  currentMultisigAddress?: Address;
}

export const emptyAccount: AccountType = {
  balance: '...',
  nonce: 0,
};

export const initialState = () => {
  const sessionNetwork = network || defaultNetwork;
  return {
    multisigContracts: [],
    loading: true,
    error: '',
    denomination: 0,
    decimals: 0,
    multisigContract: '',
    multisigDeployerContracts: sessionNetwork.multisigDeployerContracts,
    multisigManagerContract: sessionNetwork.multisigManagerContract,
  };
};

export interface AccountType {
  balance: string;
  nonce: number;
}
