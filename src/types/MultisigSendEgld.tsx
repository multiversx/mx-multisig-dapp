import React from "react";
import { Ui } from "@elrondnetwork/dapp-utils";
import { Address, BinaryCodec } from "@elrondnetwork/erdjs/out";
import {
  BigUIntType,
  BigUIntValue,
  BytesValue,
  U32Type,
  U32Value,
} from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { faExternalLinkAlt } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import i18next from "i18next";
import ExplorerLink from "components/ExplorerLink";
import { MultisigAction } from "./MultisigAction";

import { MultisigActionType } from "./MultisigActionType";
import { multisigContractFunctionNames } from "./multisigFunctionNames";

export class MultisigSendEgld extends MultisigAction {
  address: Address;
  amount: BigUIntValue;
  data: string;
  args: BytesValue[];
  endpointName: string | null;

  constructor(
    address: Address,
    amount: BigUIntValue,
    data: string,
    args: BytesValue[] = [],
  ) {
    super(MultisigActionType.SendEgld);
    this.address = address;
    this.amount = amount;
    this.data = data;
    this.args = args;
    this.endpointName = args?.length > 0 ? data : null;
  }

  tooltip() {
    switch (this.endpointName) {
      case multisigContractFunctionNames.issue:
        return this.getIssueTokenToolTip();
    }

    return "";
  }

  getData() {
    switch (this.endpointName) {
      case multisigContractFunctionNames.issue:
      case multisigContractFunctionNames.ESDTTransfer:
        return null;
    }
    return this.data;
  }

  title() {
    switch (this.endpointName) {
      case multisigContractFunctionNames.issue:
        return i18next.t("Issue Token");
      case multisigContractFunctionNames.ESDTTransfer:
        return i18next.t("Send Token");
    }
    return i18next.t("Transfer EGLD");
  }

  description() {
    switch (this.endpointName) {
      case multisigContractFunctionNames.issue:
        return this.getIssueTokenDescription();
      case multisigContractFunctionNames.ESDTTransfer:
        return this.getSendTokenDescription();
    }
    return (
      <>
        <div className="d-flex flex-wrap transaction">
          <span className="mr-1 text-body">
            <Ui.Denominate
              value={this.amount.valueOf().toString()}
              showLastNonZeroDecimal
              showLabel
            />
          </span>
          <span className="mr-1">{i18next.t("to")}</span>
          <div className="address">
            <Ui.Trim text={this.address.bech32()} />
            <ExplorerLink
              page={`accounts/${this.address.bech32()}`}
              text={<FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />}
              className="link-second-style"
            />
          </div>
        </div>
        {/* {this.data !== "" && (
          <div>
            Data: <span className="text-body">{this.data}</span>
          </div>
        )} */}
      </>
    );
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
