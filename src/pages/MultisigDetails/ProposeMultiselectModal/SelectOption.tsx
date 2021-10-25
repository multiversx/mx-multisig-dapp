import React from "react";
import { ProposalsTypes } from "types/Proposals";

interface SelectOptionPropsType {
  onSelected: (option: ProposalsTypes) => void;
}

const availableOptions = [
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
];

export default function SelectOption({ onSelected }: SelectOptionPropsType) {
  return (
    <div className="card select-options-list">
      {availableOptions.map((option) => (
        <button
          key={option.type}
          className="selectable-option"
          onClick={() => onSelected(option.type)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
