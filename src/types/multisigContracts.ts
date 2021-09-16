export interface MultisigContractInfoType {
  address: PlainMultisigAddressType;
  name: string;
}

export interface PlainMultisigAddressType {
  hex: string;
  bech32: string;
  pubKey: string;
}
