import { Address } from "@elrondnetwork/erdjs";
import { PlainMultisigAddress } from "./address";

export class MultisigContractInfo {
  address: PlainMultisigAddress;
  name: string;

  constructor(address: Address, name: string) {
    this.address = address.toJSON() as PlainMultisigAddress;
    this.name = name;
  }
}
