import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import i18next from 'i18next';

export class MultisigChangeQuorum extends MultisigAction {
    newSize: number;
  
    constructor(newSize: number) { 
        super(MultisigActionType.ChangeQuorum);
        this.newSize = newSize;
    }
  
    title() {
      return i18next.t('Change Quorum');
    }
  
    description() {
      return i18next.t('New Quorum Size') + ': ' + this.newSize.toString();
    }

    tooltip() {
      return '';
    }
  }