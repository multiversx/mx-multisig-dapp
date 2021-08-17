import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import i18next from 'i18next';

export class MultisigAddBoardMember extends MultisigAction {
    address: Address;
  
    constructor(address: Address) {
        super(MultisigActionType.AddBoardMember);
        this.address = address;
    }
  
    title() {
      return i18next.t('Add Board Member');
    }
  
    description() {
      return this.address.bech32();
    }

    tooltip() {
      return '';
    }
  }