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
import { Query } from "@elrondnetwork/erdjs/out/smartcontracts/query";
import {
  multisigDeployerContracts,
  multisigManagerContract,
} from "helpers/constants";
import { parseContractInfo } from "helpers/converters";
import useSendTransactions from "hooks/useSendTransactions";
import { MultisigContractInfoType } from "types/multisigContracts";
import { buildTransaction } from "./transactionUtils";

export function useManagerContract() {
  const { address, dapp } = useDappContext();
  const sendTransactionsToBeSigned = useSendTransactions();

  const smartContract = new SmartContract({
    address: new Address(multisigManagerContract ?? ""),
  });
  const transactionAddress = new Address(address);

  function sendTransaction(functionName: string, ...args: TypedValue[]) {
    const transaction = buildTransaction(
      0,
      functionName,
      smartContract,
      ...args,
    );
    return sendTransactionsToBeSigned({ transactions: [transaction] });
  }

  function deployMultisigContract(quorum: number, boardMembers: Address[]) {
    const randomInt = Math.floor(
      Math.random() * multisigDeployerContracts.length,
    );
    const multisigDeployerContract = multisigDeployerContracts[randomInt];
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
    return buildTransaction(
      0,
      "registerMultisigContract",
      smartContract,
      new AddressValue(multisigAddress),
    );
  }

  async function mutateUnregisterMultisigContract(multisigAddress: Address) {
    return sendTransaction(
      "unregisterMultisigContract",
      new AddressValue(multisigAddress),
    );
  }

  function mutateRegisterMultisigContractName(
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
    mutateRegisterMultisigContract,
    mutateUnregisterMultisigContract,
    mutateRegisterMultisigContractName,
    queryContracts,
    queryContractName,
    queryMultisigContractInfoArray,
  };
}
