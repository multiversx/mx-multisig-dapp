import { useContext as useDappContext } from "@elrondnetwork/dapp";
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
} from "@elrondnetwork/erdjs/out";
import { Code } from "@elrondnetwork/erdjs/out/smartcontracts/code";
import { Query } from "@elrondnetwork/erdjs/out/smartcontracts/query";

import { gasLimit } from "config";
import { multisigManagerContract, smartContractCode } from "helpers/constants";
import { parseContractInfo } from "helpers/converters";
import useSendTransactions from "hooks/useSendTransactions";
import { MultisigContractInfoType } from "types/multisigContracts";
import { multisigContractFunctionNames } from "types/multisigFunctionNames";
import getProviderType from "../components/SignTransactions/helpers/getProviderType";
import { buildTransaction } from "./transactionUtils";

export const deployContractGasLimit = 150_000_000;

export function useManagerContract() {
  const { address, account, dapp } = useDappContext();
  const sendTransactions = useSendTransactions();
  const providerType = getProviderType(dapp.provider);

  const smartContract = new SmartContract({
    address: new Address(multisigManagerContract ?? ""),
  });
  const transactionAddress = new Address(address);

  async function deployMultisigContract(contractName: string) {
    const multisigAddressHex = SmartContract.computeAddress(
      new Address(address),
      account.nonce,
    );

    const multisigAddress = new Address(multisigAddressHex);

    const boardMembers = [new AddressValue(new Address(address))];
    const quorum = 1;
    const deployTransaction = getDeployContractTransaction(
      quorum,
      boardMembers,
    );
    const registerMultisigNameTransaction = getRegisterContractNameTransaction(
      multisigAddress,
      contractName,
    );
    const attachMultisigTransaction =
      getRegisterMultisigContractTransaction(multisigAddress);
    const transactions = [
      deployTransaction,
      registerMultisigNameTransaction,
      attachMultisigTransaction,
    ];
    sendTransactions(transactions, deployContractGasLimit);
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

  function mutateRegisterMultisigContract(multisigAddress: Address) {
    const transaction = getRegisterMultisigContractTransaction(multisigAddress);
    sendTransactions(transaction);
  }

  function getRegisterMultisigContractTransaction(multisigAddress: Address) {
    return buildTransaction(
      0,
      multisigContractFunctionNames.registerMultisigContract,
      providerType,
      smartContract,
      gasLimit,
      new AddressValue(multisigAddress),
    );
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
    sendTransactions(transaction);
  }

  async function queryMultisigContractInfoArray(
    functionName: string,
    ...args: TypedValue[]
  ): Promise<MultisigContractInfoType[]> {
    const result = await query(functionName, ...args);

    if (result.returnData.length === 0) {
      return [];
    }
    const contractInfos = [];
    for (const buffer of result.outputUntyped()) {
      const contractInfo = parseContractInfo(buffer);
      if (contractInfo !== null) {
        contractInfos.push(contractInfo);
      }
    }
    return contractInfos;
  }

  async function queryContracts() {
    return queryMultisigContractInfoArray(
      multisigContractFunctionNames.getMultisigContracts,
      new AddressValue(transactionAddress),
    );
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
    return await dapp.proxy.queryContract(newQuery);
  }

  return {
    deployMultisigContract,
    mutateUnregisterMultisigContract,
    mutateRegisterMultisigContract,
    queryContracts,
    queryContractName,
    queryMultisigContractInfoArray,
  };
}
