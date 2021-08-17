import { Address, SmartContract, U8Value, AddressValue } from '@elrondnetwork/erdjs';
import { useSendTransaction as useSendDappTransaction } from '@elrondnetwork/dapp';
import { useContext } from 'context';
import { routeNames } from '../routes';
import { buildTransaction } from './transactionUtils';

export function useDeployContract(callbackRoute = routeNames.dashboard) {
  const { multisigDeployerContracts } = useContext();
  const sendTransaction = useSendDappTransaction();

  const sendDeployTransaction = (quorum: number, boardMembers: Address[]) => {
    let randomInt = Math.floor(Math.random() * multisigDeployerContracts.length);
    let multisigDeployerContract = multisigDeployerContracts[randomInt];
    const contract = new SmartContract({ address: new Address(multisigDeployerContract ?? '') });
    const transaction = buildTransaction(
      0,
      'deployContract',
      contract,
      new U8Value(quorum),
      ...boardMembers.map((x) => new AddressValue(x))
    );
    sendTransaction({ transaction, callbackRoute });
  };

  return { sendDeployTransaction };
}
