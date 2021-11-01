import { BigUIntValue, Address } from "@elrondnetwork/erdjs";
import i18next from "i18next";
import denominate from "../components/Denominate/denominate";
import { denomination } from "../config";
import { MultisigAction } from "./MultisigAction";

import { MultisigActionType } from "./MultisigActionType";

export class MultisigUpgradeContractFromSource extends MultisigAction {
  address: Address;
  amount: BigUIntValue;
  source: Address;
  upgradeable: boolean;
  payable: boolean;
  readable: boolean;

  constructor(
    address: Address,
    amount: BigUIntValue,
    source: Address,
    upgradeable = false,
    payable = false,
    readable = false,
  ) {
    super(MultisigActionType.SCUpgradeFromSource);
    this.address = address;
    this.amount = amount;
    this.source = source;
    this.upgradeable = upgradeable;
    this.payable = payable;
    this.readable = readable;
  }

  title() {
    return `${i18next.t("Upgrade Contract")} ${
      this.address
    } from ${this.source.bech32()}`;
  }

  description() {
    const denominatedAmount = denominate({
      input: this.amount.valueOf().toString(),
      denomination: denomination,
      decimals: 4,
      showLastNonZeroDecimal: true,
    });
    return `${i18next.t("Amount")}: ${denominatedAmount}`;
  }
  tooltip(): string {
    return ` upgradeable: ${this.upgradeable}
 payable: ${this.payable} 
 readable: ${this.readable} 
    `;
  }
}
