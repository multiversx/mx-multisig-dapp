import { MultisigActionType } from "./MultisigActionType";

export abstract class MultisigAction {
  type: MultisigActionType = MultisigActionType.Nothing;
  data?: string;
  code?: string;

  constructor(type: MultisigActionType) {
    this.type = type;
  }

  abstract title(): any;
  abstract description(): any;
  abstract tooltip(): any;
}
