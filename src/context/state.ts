import {
  IDappProvider,
  ProxyProvider,
  ApiProvider,
  WalletProvider,
  Address,
  Balance,
} from '@elrondnetwork/erdjs';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import { denomination, decimals, network, NetworkType } from '../config';
import { getItem } from '../storage/session';

interface ScResultType {
  callType: string;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  prevTxHash: string;
  receiver?: string;
  sender: string;
  value: string;
  data?: string;
  returnMessage?: string;
}

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

type TxStatusType = 'pending' | 'notExecuted' | 'success' | 'fail';

export interface TransactionType {
  fee?: string;
  blockHash: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  gasUsed: string;
  txHash: string;
  miniBlockHash: string;
  nonce: number;
  receiver: string;
  receiverShard: number;
  round: number;
  sender: string;
  senderShard: number;
  signature: string;
  status: TxStatusType;
  timestamp: number;
  value: string;
  scResults?: ScResultType[];
}

export interface DappState {
  provider: IDappProvider;
  proxy: ProxyProvider;
  apiProvider: ApiProvider;
  apiUrl: string;
}

export interface StateType {
  dapp: DappState;
  loading: boolean;
  error: string;
  loggedIn: boolean;
  address: string;
  egldLabel: string;
  denomination: number;
  decimals: number;
  account: AccountType;
  explorerAddress: string;
  multisigContract?: string;
  multisigDeployerContracts: string[];
  multisigManagerContract?: string;
  totalBoardMembers: number;
  totalProposers: number;
  quorumSize: number;
  userRole: number;
  allActions: MultisigActionDetailed[];
  currentMultisigAddress?: Address;
  multisigBalance: Balance;
  multisigName: string;
  transactions: TransactionType[];
  transactionsFetched: boolean | undefined;
}

export const emptyAccount: AccountType = {
  balance: '...',
  nonce: 0,
};

export const initialState = () => {
  const sessionNetwork = network || defaultNetwork;
  return {
    denomination: denomination,
    decimals: decimals,
    dapp: {
      provider: new WalletProvider(sessionNetwork.walletAddress),
      proxy: new ProxyProvider(
        sessionNetwork.gatewayAddress !== undefined
          ? sessionNetwork?.gatewayAddress
          : 'https://gateway.elrond.com/',
        { timeout: 4000 }
      ),
      apiProvider: new ApiProvider(
        sessionNetwork.apiAddress !== undefined
          ? sessionNetwork?.apiAddress
          : 'https://api.elrond.com/',
        { timeout: 4000 }
      ),
      apiUrl:
        sessionNetwork.apiAddress !== undefined
          ? sessionNetwork?.apiAddress
          : 'https://api.elrond.com/',
    },
    loading: false,
    error: '',
    loggedIn: !!getItem('logged_in'),
    address: getItem('address'),
    account: emptyAccount,
    egldLabel: sessionNetwork?.egldLabel,
    explorerAddress: sessionNetwork.explorerAddress || 'https://explorer.elrond.com',
    multisigContract: '',
    multisigDeployerContracts: sessionNetwork.multisigDeployerContracts,
    multisigManagerContract: sessionNetwork.multisigManagerContract,
    totalBoardMembers: 0,
    totalProposers: 0,
    quorumSize: 0,
    userRole: 0,
    multisigBalance: new Balance('0'),
    multisigName: '',
    allActions: [],
    transactions: [],
    transactionsFetched: undefined,
  };
};

export interface AccountType {
  balance: string;
  nonce: number;
}
