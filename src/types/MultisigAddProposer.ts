import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import i18next from 'i18next';

export class MultisigAddProposer extends MultisigAction {
  address: Address;

  constructor(address: Address) {
      super(MultisigActionType.AddProposer);
      this.address = address;
  }

  title() {
    return i18next.t('Add Proposer');
  }

  description() {
    return this.address.bech32();
  }

  tooltip() {
    return '';
  }
}