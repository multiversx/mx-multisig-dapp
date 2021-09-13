import { Address, Balance, BinaryCodec } from "@elrondnetwork/erdjs/out";
import {
  BigUIntType,
  BigUIntValue,
  BytesValue,
  U32Type,
  U32Value,
} from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import i18next from "i18next";
import { MultisigAction } from "./MultisigAction";
import { MultisigActionType } from "./MultisigActionType";

export class MultisigSmartContractCall extends MultisigAction {
  address: Address;
  amount: BigUIntValue;
  endpointName: string;
  args: BytesValue[];

  constructor(
    address: Address,
    amount: BigUIntValue,
    endpointName: string,
    args: BytesValue[],
  ) {
    super(MultisigActionType.SCCall);
    this.address = address;
    this.amount = amount;
    this.endpointName = endpointName;
    this.args = args;
  }

  title() {
    switch (this.endpointName) {
      case "issue":
        return i18next.t("Issue Token");
      case "ESDTTransfer":
        return i18next.t("Send Token");
    }

    return i18next.t("Smart Contract Call");
  }

  description() {
    switch (this.endpointName) {
      case "issue":
        return this.getIssueTokenDescription();
      case "ESDTTransfer":
        return this.getSendTokenDescription();
    }

    return `${this.endpointName}: ${new Balance(
      this.amount.valueOf().toString(),
    ).toCurrencyString()} to ${this.address.bech32()}`;
  }

  tooltip() {
    switch (this.endpointName) {
      case "issue":
        return this.getIssueTokenToolTip();
    }

    return "";
  }

  getIssueTokenToolTip(): string {
    const extraProperties = [];
    let index = 4;
    while (index < this.args.length) {
      const name = this.args[index++].valueOf();
      const value = this.args[index++].valueOf();

      extraProperties.push({ name, value });
    }

    return extraProperties.map((x) => `${x.name}: ${x.value}`).join("\n");
  }

  getSendTokenDescription(): string {
    const identifier = this.args[0].valueOf().toString();
    const codec = new BinaryCodec();
    const amount = codec
      .decodeTopLevel<BigUIntValue>(this.args[1].valueOf(), new BigUIntType())
      .valueOf();

    return `${i18next.t("Identifier")}: ${identifier}, ${i18next.t(
      "Amount",
    )}: ${amount}`;
  }

  getIssueTokenDescription(): string {
    const name = this.args[0].valueOf().toString();
    const identifier = this.args[1].valueOf().toString();

    const codec = new BinaryCodec();
    const amount = codec
      .decodeTopLevel<BigUIntValue>(this.args[2].valueOf(), new BigUIntType())
      .valueOf();
    const decimals = codec
      .decodeTopLevel<U32Value>(this.args[3].valueOf(), new U32Type())
      .valueOf()
      .toNumber();

    const amountString = amount
      .toString()
      .slice(0, amount.toString().length - decimals);

    return `${i18next.t("Name")}: ${name}, ${i18next.t(
      "Identifier",
    )}: ${identifier}, ${i18next.t("Amount")}: ${amountString}, ${i18next.t(
      "Decimals",
    )}: ${decimals}`;
  }
}
