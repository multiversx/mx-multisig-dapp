import React from "react";
import {
  faHandPaper,
  faTimes,
  faArrowLeft,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useMultisigContract } from "contracts/MultisigContract";
import { setProposeMultiselectSelectedOption } from "redux/slices/modalsSlice";
import { MultisigAction } from "types/MultisigAction";
import { MultisigIssueToken } from "types/MultisigIssueToken";
import { MultisigSendEgld } from "types/MultisigSendEgld";
import { MultisigSendToken } from "types/MultisigSendToken";

import { MultisigSmartContractCall } from "types/MultisigSmartContractCall";
import { ProposalsTypes, SelectedOptionType } from "types/Proposals";
import { titles } from "../constants";
import ProposeIssueToken from "./ProposeIssueToken";
import ProposeSendEgld from "./ProposeSendEgld";
import ProposeSendToken from "./ProposeSendToken";
import ProposeSmartContractCall from "./ProposeSmartContractCall";
import SelectOption from "./SelectOption";

import "./proposeMultiselectModal.scss";
import ProposeDeployContract from "./ProposeDeployContract";
import { MultisigDeployContract } from "../../../types/MultisigDeployContract";
import { BigUIntValue } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { Balance } from "@elrondnetwork/erdjs/out";

interface ProposeMultiselectModalPropsType {
  selectedOption: SelectedOptionType;
}

const ProposeMultiselectModal = ({
  selectedOption,
}: ProposeMultiselectModalPropsType) => {
  const {
    mutateSmartContractCall,
    mutateSendEgld,
    mutateDeployContract,
    mutateEsdtIssueToken,
    mutateEsdtSendToken,
  } = useMultisigContract();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedProposal, setSelectedProposal] =
    React.useState<MultisigAction | null>(null);
  const [submitDisabled, setSubmitDisabled] = React.useState(false);

  const onProposeClicked = () => {
    console.log(selectedProposal);
    try {
      if (selectedProposal instanceof MultisigSendEgld) {
        mutateSendEgld(
          selectedProposal.address,
          selectedProposal.amount,
          selectedProposal.data,
        );
      } else if (selectedProposal instanceof MultisigIssueToken) {
        mutateEsdtIssueToken(selectedProposal as MultisigIssueToken);
      } else if (selectedProposal instanceof MultisigSendToken) {
        mutateEsdtSendToken(selectedProposal as MultisigSendToken);
      } else if (selectedProposal instanceof MultisigSmartContractCall) {
        mutateSmartContractCall(
          selectedProposal.address,
          selectedProposal.amount,
          selectedProposal.endpointName,
          selectedProposal.args,
        );
      } else if (selectedProposal instanceof MultisigDeployContract) {
        mutateDeployContract(
          new BigUIntValue(Balance.egld(selectedProposal.amount).valueOf()),
          selectedProposal.code,
          selectedProposal.upgradeable,
          selectedProposal.payable,
          selectedProposal.readable,
        );
      }
      handleClose();
    } catch (err) {}
  };
  const handleProposalChange = (proposal: MultisigAction) => {
    setSelectedProposal(proposal);
  };

  const handleOptionSelected = (option: ProposalsTypes) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
  };

  const handleClose = () => {
    dispatch(setProposeMultiselectSelectedOption(null));
  };
  const getContent = () => {
    switch (selectedOption?.option) {
      case ProposalsTypes.send_egld:
        return (
          <ProposeSendEgld
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      case ProposalsTypes.issue_token:
        return <ProposeIssueToken handleChange={handleProposalChange} />;
      case ProposalsTypes.send_token:
        return <ProposeSendToken handleChange={handleProposalChange} />;
      case ProposalsTypes.smart_contract_call:
        return (
          <ProposeSmartContractCall
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      case ProposalsTypes.deploy_contract:
        return (
          <ProposeDeployContract
            setSubmitDisabled={setSubmitDisabled}
            handleChange={handleProposalChange}
          />
        );
      default:
        return <SelectOption onSelected={handleOptionSelected} />;
    }
  };

  const proposeButton = (
    <button
      disabled={submitDisabled}
      onClick={onProposeClicked}
      className="btn btn-primary "
    >
      <FontAwesomeIcon icon={faHandPaper} />
      {t("Propose")}
    </button>
  );

  const goBackButton = (
    <button
      onClick={() =>
        handleOptionSelected(ProposalsTypes.multiselect_proposal_options)
      }
      className="btn btn-primary btn-light "
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      {t("Back")}
    </button>
  );

  const closeButton = (
    <button onClick={handleClose} className="btn btn-primary btn-light ">
      <FontAwesomeIcon icon={faTimes} />
      {t("Cancel")}
    </button>
  );
  const cancelButton =
    selectedOption?.option !== ProposalsTypes.multiselect_proposal_options
      ? goBackButton
      : closeButton;

  const actionTitle =
    selectedOption?.option != null ? `: ${titles[selectedOption?.option]}` : "";

  return (
    <Modal
      show
      size="lg"
      onHide={handleClose}
      className="modal-container proposal-modal"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body">
          <p className="h3 mb-spacer text-center" data-testid="delegateTitle">
            {`${t("Make a proposal")}${actionTitle}`}
          </p>

          {getContent()}
          <div className="modal-action-btns">
            {cancelButton}
            {selectedOption?.option !==
              ProposalsTypes.multiselect_proposal_options && proposeButton}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProposeMultiselectModal;
