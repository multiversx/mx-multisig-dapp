import { MultisigActionType } from './MultisigActionType';

export abstract class MultisigAction {
    type: MultisigActionType = MultisigActionType.Nothing;
  
    constructor(type: MultisigActionType) {
      this.type = type;
    }
  
    abstract title(): string;
    abstract description(): string;
    abstract tooltip(): string;
  }