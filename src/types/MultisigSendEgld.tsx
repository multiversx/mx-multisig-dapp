import React from "react";
import { Ui } from "@elrondnetwork/dapp-utils";
import { Address } from "@elrondnetwork/erdjs/out";
import { BigUIntValue } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import i18next from "i18next";
import ExplorerLink from "components/ExplorerLink";
import { MultisigAction } from "./MultisigAction";
import { MultisigActionType } from "./MultisigActionType";
import { faExternalLinkAlt } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class MultisigSendEgld extends MultisigAction {
  address: Address;
  amount: BigUIntValue;
  data: string;

  constructor(address: Address, amount: BigUIntValue, data: string) {
    super(MultisigActionType.SendEgld);
    this.address = address;
    this.amount = amount;
    this.data = data;
  }

  title() {
    return i18next.t("Transfer EGLD");
  }

  description() {
    return (
      <>
        <div className="d-flex flex-wrap">
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
          </div>
          <ExplorerLink
            page={`accounts/${this.address.bech32()}`}
            text={<FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />}
            className="link-second-style"
          />
        </div>
        {/* {this.data !== "" && (
          <div>
            Data: <span className="text-body">{this.data}</span>
          </div>
        )} */}
      </>
    );
  }

  tooltip() {
    return "";
  }
}
