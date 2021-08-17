import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import i18next from 'i18next';

export class MultisigSendToken extends MultisigAction {
    address: Address;
    identifier: string;
    amount: number;
  
    constructor(address: Address, identifier: string, amount: number) { 
        super(MultisigActionType.SCCall);
        this.address = address;
        this.identifier = identifier;
        this.amount = amount;
    }
  
    title() {
      return i18next.t('Send token');
    }
  
    description() {
      return `${this.amount} (${this.description})`;
    }

    tooltip() {
      return '';
    }
  }