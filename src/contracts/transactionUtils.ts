import {
  ContractFunction,
  Transaction,
  TransactionPayload,
  Balance,
  GasLimit,
  SmartContract,
  TypedValue,
  ChainID,
} from "@elrondnetwork/erdjs";
import { chainID } from "config";

const standardGasLimit = 60000000;

export function buildTransaction(
  value: number,
  functionName: string,
  contract: SmartContract,
  ...args: TypedValue[]
): Transaction {
  const func = new ContractFunction(functionName);

  const payload = TransactionPayload.contractCall()
    .setFunction(func)
    .setArgs(args)
    .build();

  return new Transaction({
    chainID: new ChainID(chainID),
    receiver: contract.getAddress(),
    value: Balance.egld(value),
    gasLimit: new GasLimit(standardGasLimit),
    data: payload,
  });
}
