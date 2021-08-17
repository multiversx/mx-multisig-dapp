import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { BigUIntValue } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import i18next from 'i18next';

export class MultisigSendEgld extends MultisigAction {
    address: Address;
    amount: BigUIntValue;
    data: string;
  
    constructor(address: Address, amount: BigUIntValue, data: string,) { 
        super(MultisigActionType.SendEgld);
        this.address = address;
        this.amount = amount;
        this.data = data;
    }
  
    title() {
      return i18next.t('Send eGLD');
    }
  
    description() {
      let description = `${new Balance(this.amount.valueOf().toString()).toCurrencyString()} to ${this.address.bech32()}`;
  
      if (this.data !== '') {
        description += ` (${this.data})`;
      }
  
      return description;
    }

    tooltip() {
      return '';
    }
  }