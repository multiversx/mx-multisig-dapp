export interface PlainTransactionStatus {
  isPending: boolean;
  isSuccessful: boolean;
  isFailed: boolean;
  isInvalid: boolean;
  isExecuted: boolean;
}

export interface TransactionToastType {
  toastSignSession: string;
  transactions: {
    [hash: string]: PlainTransactionStatus;
  };
  processingMessage?: string;
  errorMessage?: string;
  successMessage?: string;
  submittedMessage?: string;
  submittedMessageShown?: boolean;
  pendingFarmAddress?: string;
  pendingPoolAddress?: string;
  pendingNftTransactions?: string;
  startTime: number;
  endTime: number;
}
