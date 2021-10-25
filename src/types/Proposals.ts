export enum ProposalsTypes {
  "change_quorum" = "change_quorum",
  "add_proposer" = "add_proposer",
  "add_board_member" = "add_board_member",
  "remove_user" = "remove_user",
  "send_egld" = "send_egld",
  "issue_token" = "issue_token",
  "send_token" = "send_token",
  "smart_contract_call" = "smart_contract_call",
  "multiselect_proposal_options" = "multiselect_proposal_options",
  "deploy_contract" = "deploy_contract",
}

export interface RemoveUserOptionType {
  option: ProposalsTypes.remove_user;
  address: string;
}

export interface SimpleSelectedOptionType {
  option: ProposalsTypes;
}

export type SelectedOptionType =
  | SimpleSelectedOptionType
  | RemoveUserOptionType
  | null
  | undefined;
