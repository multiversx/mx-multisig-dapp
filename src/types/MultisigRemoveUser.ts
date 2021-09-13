import { Address } from "@elrondnetwork/erdjs/out";
import i18next from "i18next";
import { MultisigAction } from "./MultisigAction";
import { MultisigActionType } from "./MultisigActionType";

export class MultisigRemoveUser extends MultisigAction {
  address: Address;

  constructor(address: Address) {
    super(MultisigActionType.RemoveUser);
    this.address = address;
  }

  title() {
    return i18next.t("Remove User");
  }

  description() {
    return this.address.bech32();
  }

  tooltip() {
    return "";
  }
}
