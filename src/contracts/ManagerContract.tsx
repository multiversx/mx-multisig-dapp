import {
  ContractFunction,
  Address,
  SmartContract,
  AddressValue,
  BytesValue,
  TypedValue,
} from '@elrondnetwork/erdjs';
import { Query } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import { useContext } from 'context';
import { parseContractInfo } from 'helpers/converters';
import { MultisigContractInfo } from 'types/MultisigContractInfo';
import { buildTransaction } from './transactionUtils';
import {
  useSendTransaction as useSendDappTransaction,
  useContext as useDappContext,
} from '@elrondnetwork/dapp';
import { routeNames } from '../routes';

export function useManagerContract(callbackRoute = routeNames.dashboard) {
  const { dapp, multisigManagerContract } = useContext();
  const { address } = useDappContext();
  const sendDappTransaction = useSendDappTransaction();

  const smartContract = new SmartContract({ address: new Address(multisigManagerContract ?? '') });
  const transactionAddress = new Address(address);

  function sendTransaction(functionName: string, ...args: TypedValue[]) {
    const transaction = buildTransaction(0, functionName, smartContract, ...args);
    return sendDappTransaction({ transaction, callbackRoute });
  }

  async function mutateRegisterMultisigContract(multisigAddress: Address) {
    return sendTransaction('registerMultisigContract', new AddressValue(multisigAddress));
  }

  async function mutateUnregisterMultisigContract(multisigAddress: Address) {
    return sendTransaction('unregisterMultisigContract', new AddressValue(multisigAddress));
  }

  async function mutateRegisterMultisigContractName(multisigAddress: Address, name: string) {
    return sendTransaction(
      'registerMultisigName',
      new AddressValue(multisigAddress),
      BytesValue.fromUTF8(name)
    );
  }

  async function queryMultisigContractInfoArray(
    functionName: string,
    ...args: TypedValue[]
  ): Promise<MultisigContractInfo[]> {
    let result = await query(functionName, ...args);

    let contractInfos = [];
    for (let buffer of result.outputUntyped()) {
      let contractInfo = parseContractInfo(buffer);
      if (contractInfo !== null) {
        contractInfos.push(contractInfo);
      }
    }

    return contractInfos;
  }

  async function queryContracts() {
    return queryMultisigContractInfoArray(
      'getMultisigContracts',
      new AddressValue(transactionAddress)
    );
  }

  async function queryContractName(multisigAddress: Address) {
    return queryString('getMultisigContractName', new AddressValue(multisigAddress));
  }

  async function queryString(functionName: string, ...args: Array<TypedValue>): Promise<string> {
    let result = await query(functionName, ...args);

    return Buffer.from(result.returnData[0], 'base64').toString();
  }

  async function query(functionName: string, ...args: TypedValue[]) {
    const query = new Query({
      address: smartContract.getAddress(),
      func: new ContractFunction(functionName),
      args: args,
    });

    return await dapp.proxy.queryContract(query);
  }

  return {
    mutateRegisterMultisigContract,
    mutateUnregisterMultisigContract,
    mutateRegisterMultisigContractName,
    queryContracts,
    queryContractName,
    queryMultisigContractInfoArray,
  };
}
