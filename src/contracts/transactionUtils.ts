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
import { chainID, gasPerDataByte } from "config";
import { providerTypes } from "helpers/constants";
import { multisigContractFunctionNames } from "../types/multisigFunctionNames";

interface TransactionPayloadType {
  chainID: ChainID;
  receiver: Address;
  value: Balance;
  gasLimit: GasLimit;
  data: TransactionPayload;
  options?: TransactionOptions;
  version?: TransactionVersion;
}

const calculateGasLimit = (
  payload: TransactionPayload,
  minGasLimit: number,
) => {
  const gasLimitForBytes = Number(gasPerDataByte) * payload.length();
  return gasLimitForBytes + minGasLimit;
};

const functionsWithDynamicGasLimit = [
  multisigContractFunctionNames.proposeSCDeploy,
];

export function buildTransaction(
  value: number,
  functionName: multisigContractFunctionNames,
  providerType: string,
  contract: SmartContract,
  transactionGasLimit: number,
  ...args: TypedValue[]
): Transaction {
  const func = new ContractFunction(functionName);
  const payload = TransactionPayload.contractCall()
    .setFunction(func)
    .setArgs(args)
    .build();
  const gasLimit = functionsWithDynamicGasLimit.includes(functionName)
    ? calculateGasLimit(payload, transactionGasLimit)
    : transactionGasLimit;

  const transactionPayload: TransactionPayloadType = {
    chainID: new ChainID(chainID),
    receiver: contract.getAddress(),
    value: Balance.egld(value),
    gasLimit: new GasLimit(gasLimit),
    data: payload,
  };
  if (providerType === providerTypes.ledger) {
    transactionPayload.options = TransactionOptions.withTxHashSignOptions();
    transactionPayload.version = TransactionVersion.withTxHashSignVersion();
  }
  return new Transaction(transactionPayload);
}
