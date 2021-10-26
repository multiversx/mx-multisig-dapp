import { BigUIntValue } from "@elrondnetwork/erdjs";
import i18next from "i18next";
import { MultisigAction } from "./MultisigAction";
import { MultisigActionType } from "./MultisigActionType";

export class MultisigDeployContract extends MultisigAction {
  amount: BigUIntValue;
  code: string;
  upgradeable = false;
  payable = false;
  readable = false;

  constructor(amount: BigUIntValue, code: string) {
    super(MultisigActionType.SCDeploy);
    this.amount = amount;
    this.code = code;
  }

  title() {
    return i18next.t("Deploy Contract");
  }

  description() {
    return this.description;
  }

  tooltip() {
    return "";
  }
}
