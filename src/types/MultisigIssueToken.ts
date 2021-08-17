import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import i18next from 'i18next';

export class MultisigIssueToken extends MultisigAction {
    name: string;
    identifier: string;
    amount: number;
    decimals: number;
    canFreeze: boolean = false;
    canWipe: boolean = false;
    canPause: boolean = false;
    canMint: boolean = false;
    canBurn: boolean = false;
    canChangeOwner: boolean = false;
    canUpgrade: boolean = true;
  
    constructor(name: string, identifier: string, amount: number, decimals: number) { 
        super(MultisigActionType.SCCall);
        this.name = name;
        this.identifier = identifier;
        this.amount = amount;
        this.decimals = decimals;
    }
  
    title() {
      return i18next.t('Issue Token');
    }
  
    description() {
      return `${this.name} (${this.description})`;
    }

    tooltip() {
      return '';
    }
  }