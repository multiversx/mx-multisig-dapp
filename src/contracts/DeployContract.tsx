import { useSendTransaction as useSendDappTransaction } from "@elrondnetwork/dapp";
import {
  Address,
  SmartContract,
  U8Value,
  AddressValue,
} from "@elrondnetwork/erdjs";
import { multisigDeployerContracts } from "helpers/constants";
import { routeNames } from "../routes";
import { buildTransaction } from "./transactionUtils";

export function useDeployContract(
  callbackRoute = window.location?.pathname ?? routeNames.dashboard,
) {
  const sendTransaction = useSendDappTransaction();

  const sendDeployTransaction = (quorum: number, boardMembers: Address[]) => {
    const randomInt = Math.floor(
      Math.random() * multisigDeployerContracts.length,
    );
    const multisigDeployerContract = multisigDeployerContracts[randomInt];
    const contract = new SmartContract({
      address: new Address(multisigDeployerContract ?? ""),
    });
    const transaction = buildTransaction(
      0,
      "deployContract",
      contract,
      new U8Value(quorum),
      ...boardMembers.map((x) => new AddressValue(x)),
    );
    sendTransaction({ transaction, callbackRoute });
  };

  return { sendDeployTransaction };
}
