import { BigUIntValue, Address } from "@elrondnetwork/erdjs";
import i18next from "i18next";
import denominate from "../components/Denominate/denominate";
import { denomination } from "../config";
import { MultisigAction } from "./MultisigAction";
import { MultisigActionType } from "./MultisigActionType";

export class MultisigUpgradeContract extends MultisigAction {
  address: Address;
  amount: BigUIntValue;
  code: string;
  upgradeable: boolean;
  payable: boolean;
  readable: boolean;

  constructor(
    address: Address,
    amount: BigUIntValue,
    code: string,
    upgradeable = false,
    payable = false,
    readable = false,
  ) {
    super(MultisigActionType.SCUpgrade);
    this.address = address;
    this.amount = amount;
    this.code = code;
    this.upgradeable = upgradeable;
    this.payable = payable;
    this.readable = readable;
  }

  getData() {
    return this.code;
  }

  title() {
    return `${i18next.t("Upgrade Contract")} ${this.address}`;
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
