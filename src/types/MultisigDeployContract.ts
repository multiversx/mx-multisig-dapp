import i18next from "i18next";
import { MultisigAction } from "./MultisigAction";
import { MultisigActionType } from "./MultisigActionType";

export class MultisigDeployContract extends MultisigAction {
  amount: number;
  code: string;
  upgradeable = false;
  payable = false;
  readable = false;

  constructor(amount: number, code: string) {
    super(MultisigActionType.DeployContract);
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
