import { Address, Balance, BinaryCodec } from '@elrondnetwork/erdjs/out';
import {
  BigUIntType,
  BigUIntValue,
  BytesValue,
  U32Type,
  U32Value,
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import i18next from 'i18next';

export class MultisigSmartContractCall extends MultisigAction {
  address: Address;
  amount: BigUIntValue;
  endpointName: string;
  args: BytesValue[];

  constructor(address: Address, amount: BigUIntValue, endpointName: string, args: BytesValue[]) {
    super(MultisigActionType.SCCall);
    this.address = address;
    this.amount = amount;
    this.endpointName = endpointName;
    this.args = args;
  }

  title() {
    switch (this.endpointName) {
      case 'issue':
        return i18next.t('Issue Token');
      case 'ESDTTransfer':
        return i18next.t('Send Token');
    }

    return i18next.t('Smart Contract Call');
  }

  description() {
    switch (this.endpointName) {
      case 'issue':
        return this.getIssueTokenDescription();
      case 'ESDTTransfer':
        return this.getSendTokenDescription();
    }

    return `${this.endpointName}: ${new Balance(
      this.amount.valueOf().toString()
    ).toCurrencyString()} to ${this.address.bech32()}`;
  }

  tooltip() {
    switch (this.endpointName) {
      case 'issue':
        return this.getIssueTokenToolTip();
    }

    return '';
  }

  getIssueTokenToolTip(): string {
    let extraProperties = [];
    let index = 4;
    while (index < this.args.length) {
      let name = this.args[index++].valueOf();
      let value = this.args[index++].valueOf();

      extraProperties.push({ name, value });
    }

    return extraProperties.map((x) => `${x.name}: ${x.value}`).join('\n');
  }

  getSendTokenDescription(): string {
    let identifier = this.args[0].valueOf().toString();
    let codec = new BinaryCodec();
    let amount = codec
      .decodeTopLevel<BigUIntValue>(this.args[1].valueOf(), new BigUIntType())
      .valueOf();

    return `${i18next.t('Identifier')}: ${identifier}, ${i18next.t('Amount')}: ${amount}`;
  }

  getIssueTokenDescription(): string {
    let name = this.args[0].valueOf().toString();
    let identifier = this.args[1].valueOf().toString();

    let codec = new BinaryCodec();
    let amount = codec
      .decodeTopLevel<BigUIntValue>(this.args[2].valueOf(), new BigUIntType())
      .valueOf();
    let decimals = codec
      .decodeTopLevel<U32Value>(this.args[3].valueOf(), new U32Type())
      .valueOf()
      .toNumber();

    let amountString = amount.toString().slice(0, amount.toString().length - decimals);

    return `${i18next.t('Name')}: ${name}, ${i18next.t('Identifier')}: ${identifier}, ${i18next.t(
      'Amount'
    )}: ${amountString}, ${i18next.t('Decimals')}: ${decimals}`;
  }
}
