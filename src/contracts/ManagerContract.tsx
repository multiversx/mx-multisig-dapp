import {
  getAccountProviderType,
  getNetworkProxy,
  useGetAccountInfo,
} from "@elrondnetwork/dapp-core";
import { transactionServices } from "@elrondnetwork/dapp-core";
import {
  Address,
  AddressValue,
  BytesValue,
  ContractFunction,
  SmartContract,
  TypedValue,
  U8Value,
} from "@elrondnetwork/erdjs";
import {
  Balance,
  CodeMetadata,
  DeployArguments,
  GasLimit,
  Nonce,
} from "@elrondnetwork/erdjs/out";
import { Code } from "@elrondnetwork/erdjs/out/smartcontracts/code";
import { Query } from "@elrondnetwork/erdjs/out/smartcontracts/query";

import { gasLimit, multisigManagerContract } from "config";
import { smartContractCode } from "helpers/constants";
import { multisigContractFunctionNames } from "types/multisigFunctionNames";
import { buildTransaction } from "./transactionUtils";

export const deployContractGasLimit = 150_000_000;

const { sendTransactions } = transactionServices;

export function useManagerContract() {
  const { address, account } = useGetAccountInfo();
  const providerType = getAccountProviderType();

  const smartContract = new SmartContract({
    address: new Address(multisigManagerContract ?? ""),
  });

  async function deployMultisigContract(contractName: string) {
    const multisigAddressHex = SmartContract.computeAddress(
      new Address(address),
      new Nonce(account.nonce),
    );

    const multisigAddress = new Address(multisigAddressHex);

    const boardMembers = [new AddressValue(new Address(account.address))];
    const quorum = 1;
    const deployTransaction = getDeployContractTransaction(
      quorum,
      boardMembers,
    );
    const registerMultisigNameTransaction = getRegisterContractNameTransaction(
      multisigAddress,
      contractName,
    );

    const transactions = [deployTransaction, registerMultisigNameTransaction];
    sendTransactions({ transactions, minGasLimit: deployContractGasLimit });
  }

  function getDeployContractTransaction(
    quorum: number,
    boardMembers: AddressValue[],
  ) {
    const contract = new SmartContract({});
    const code = Code.fromBuffer(Buffer.from(smartContractCode, "hex"));
    const codeMetadata = new CodeMetadata(false, true, true);
    const quorumTyped = new U8Value(quorum);
    const initArguments: TypedValue[] = [quorumTyped, ...boardMembers];
    const value = Balance.Zero();
    const deployArguments: DeployArguments = {
      code,
      codeMetadata,
      initArguments,
      value,
      gasLimit: new GasLimit(deployContractGasLimit),
    };
    return contract.deploy(deployArguments);
  }

  function getRegisterContractNameTransaction(
    multisigAddress: Address,
    name: string,
  ) {
    return buildTransaction(
      0,
      multisigContractFunctionNames.registerMultisigName,
      providerType,
      smartContract,
      gasLimit,
      new AddressValue(multisigAddress),
      BytesValue.fromUTF8(name),
    );
  }

  async function mutateUnregisterMultisigContract(multisigAddress: Address) {
    const transaction = buildTransaction(
      0,
      multisigContractFunctionNames.unregisterMultisigContract,
      providerType,
      smartContract,
      gasLimit,
      new AddressValue(multisigAddress),
    );
    sendTransactions({ transactions: transaction });
  }

  async function queryContractName(multisigAddress: Address) {
    return queryString(
      multisigContractFunctionNames.getMultisigContractName,
      new AddressValue(multisigAddress),
    );
  }

  async function queryString(
    functionName: string,
    ...args: Array<TypedValue>
  ): Promise<string> {
    const result = await query(functionName, ...args);

    return Buffer.from(result.returnData[0], "base64").toString();
  }

  async function query(functionName: string, ...args: TypedValue[]) {
    const newQuery = new Query({
      address: smartContract.getAddress(),
      func: new ContractFunction(functionName),
      args: args,
    });
    const proxy = getNetworkProxy();
    return await proxy.queryContract(newQuery);
  }

  return {
    deployMultisigContract,
    mutateUnregisterMultisigContract,
    queryContractName,
  };
}
