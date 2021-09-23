import { useContext as useDappContext } from "@elrondnetwork/dapp";
import {
  ContractFunction,
  Address,
  SmartContract,
  AddressValue,
  BytesValue,
  TypedValue,
  U8Value,
} from "@elrondnetwork/erdjs";
import { Account, ProxyProvider } from "@elrondnetwork/erdjs/out";
import { Query } from "@elrondnetwork/erdjs/out/smartcontracts/query";

import { parseContractInfo } from "helpers/converters";
import useSendTransactions from "hooks/useSendTransactions";
import { MultisigContractInfoType } from "types/multisigContracts";
import {
  multisigDeployerContract,
  multisigManagerContract,
  network,
} from "../config";
import { buildTransaction } from "./transactionUtils";

export function useManagerContract() {
  const { address, dapp } = useDappContext();
  const sendTransactions = useSendTransactions();

  const smartContract = new SmartContract({
    address: new Address(multisigManagerContract ?? ""),
  });
  const transactionAddress = new Address(address);

  async function deployMultisigContract(contractName: string) {
    const deployedAccount = new Account(new Address(multisigDeployerContract));
    const provider = new ProxyProvider(network.gatewayAddress!);
    await deployedAccount.sync(provider);
    const multisigAddressHex = SmartContract.computeAddress(
      new Address(deployedAccount.address),
      deployedAccount.nonce,
    );
    const multisigAddress = new Address(multisigAddressHex);

    const boardMembers = [new Address(address)];
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
    sendTransactions(transactions);
  }

  function getDeployContractTransaction(
    quorum: number,
    boardMembers: Address[],
  ) {
    const contract = new SmartContract({
      address: new Address(multisigDeployerContract ?? ""),
    });
    return buildTransaction(
      0,
      "deployContract",
      contract,
      new U8Value(quorum),
      ...boardMembers.map((x) => new AddressValue(x)),
    );
  }

  function mutateRegisterMultisigContract(multisigAddress: Address) {
    const transaction = getRegisterMultisigContractTransaction(multisigAddress);
    sendTransactions(transaction);
  }

  function getRegisterMultisigContractTransaction(multisigAddress: Address) {
    return buildTransaction(
      0,
      "registerMultisigContract",
      smartContract,
      new AddressValue(multisigAddress),
    );
  }
  function getRegisterContractNameTransaction(
    multisigAddress: Address,
    name: string,
  ) {
    return buildTransaction(
      0,
      "registerMultisigName",
      smartContract,
      new AddressValue(multisigAddress),
      BytesValue.fromUTF8(name),
    );
  }

  async function mutateUnregisterMultisigContract(multisigAddress: Address) {
    const transaction = buildTransaction(
      0,
      "unregisterMultisigContract",
      smartContract,
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
      "getMultisigContracts",
      new AddressValue(transactionAddress),
    );
  }

  async function queryContractName(multisigAddress: Address) {
    return queryString(
      "getMultisigContractName",
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
