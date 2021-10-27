import { BigUIntValue } from "@elrondnetwork/erdjs";
import i18next from "i18next";
import denominate from "../components/Denominate/denominate";
import { denomination } from "../config";
import { MultisigAction } from "./MultisigAction";
import { MultisigActionType } from "./MultisigActionType";

export class MultisigDeployContract extends MultisigAction {
  amount: BigUIntValue;
  code: string;
  upgradeable: boolean;
  payable: boolean;
  readable: boolean;

  constructor(
    amount: BigUIntValue,
    code: string,
    upgradeable = false,
    payable = false,
    readable = false,
  ) {
    super(MultisigActionType.SCDeploy);
    this.amount = amount;
    this.code = code;
    this.upgradeable = upgradeable;
    this.payable = payable;
    this.readable = readable;
  }

  title() {
    return i18next.t("Deploy Contract");
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
