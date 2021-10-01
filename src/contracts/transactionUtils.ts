import {
  ContractFunction,
  Transaction,
  TransactionPayload,
  Balance,
  GasLimit,
  SmartContract,
  TypedValue,
  ChainID,
  TransactionOptions,
  TransactionVersion,
} from "@elrondnetwork/erdjs";
import { Address } from "@elrondnetwork/erdjs/out";
import { chainID } from "config";
import { providerTypes } from "helpers/constants";

export const deployGasLimit = 60000000;

interface TransactionPayloadType {
  chainID: ChainID;
  receiver: Address;
  value: Balance;
  gasLimit: GasLimit;
  data: TransactionPayload;
  options?: TransactionOptions;
  version?: TransactionVersion;
}

export function buildTransaction(
  value: number,
  functionName: string,
  providerType: string,
  contract: SmartContract,
  ...args: TypedValue[]
): Transaction {
  const func = new ContractFunction(functionName);

  const payload = TransactionPayload.contractCall()
    .setFunction(func)
    .setArgs(args)
    .build();
  const transactionPayload: TransactionPayloadType = {
    chainID: new ChainID(chainID),
    receiver: contract.getAddress(),
    value: Balance.egld(value),
    gasLimit: new GasLimit(deployGasLimit),
    data: payload,
  };
  if (providerType === providerTypes.ledger) {
    transactionPayload.options = TransactionOptions.withTxHashSignOptions();
    transactionPayload.version = TransactionVersion.withTxHashSignVersion();
  }
  return new Transaction(transactionPayload);
}
