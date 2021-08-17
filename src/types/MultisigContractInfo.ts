import { Address } from '@elrondnetwork/erdjs/out';

export class MultisigContractInfo {
    address: Address;
    name: string;
  
    constructor(address: Address, name: string) {
      this.address = address;
      this.name = name;
    }
  }