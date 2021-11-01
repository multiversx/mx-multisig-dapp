import React from "react";
import { ProposalsTypes } from "types/Proposals";

interface SelectOptionPropsType {
  onSelected: (option: ProposalsTypes) => void;
}

const proposeAvailableOptions = [
  {
    type: ProposalsTypes.send_egld,
    label: "Send EGLD",
  },
  {
    type: ProposalsTypes.send_token,
    label: "Send token",
  },
  {
    type: ProposalsTypes.issue_token,
    label: "Issue token",
  },
  {
    type: ProposalsTypes.smart_contract_call,
    label: "Smart contract call",
  },
  {
    type: ProposalsTypes.deploy_contract,
    label: "Deploy Contract",
  },
  {
    type: ProposalsTypes.deploy_contract_from_source,
    label: "Deploy Contract from source",
  },
  {
    type: ProposalsTypes.upgrade_contract,
    label: "Upgrade Contract",
  },
  {
    type: ProposalsTypes.upgrade_contract_from_source,
    label: "Upgrade Contract from source",
  },
];

const othersAvailableOptions = [
  {
    type: ProposalsTypes.attach_contract,
    label: "Transfer contract ownership",
  },
];

export default function SelectOption({ onSelected }: SelectOptionPropsType) {
  return (
    <>
      <div className="card select-options-list modal-action-btns">
        {proposeAvailableOptions.map((option) => (
          <button
            key={option.type}
            className="selectable-option btn btn-primary btn-light"
            onClick={() => onSelected(option.type)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="card select-options-list modal-action-btns">
        <p className="h4 text-center" data-testid="delegateTitle">
          Other actions
        </p>
        {othersAvailableOptions.map((option) => (
          <button
            key={option.type}
            className="selectable-option btn btn-primary btn-light"
            onClick={() => onSelected(option.type)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}
