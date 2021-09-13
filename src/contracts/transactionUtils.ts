import {
  ContractFunction,
  Transaction,
  TransactionPayload,
  Balance,
  GasLimit,
  SmartContract,
  TypedValue,
} from "@elrondnetwork/erdjs";

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
    receiver: contract.getAddress(),
    value: Balance.egld(value),

    gasLimit: new GasLimit(standardGasLimit),
    data: payload,
  });
}
