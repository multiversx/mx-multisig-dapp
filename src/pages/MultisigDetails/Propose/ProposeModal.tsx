import React, { useState } from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import { faTimes, faHandPaper } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMultisigContract } from "contracts/MultisigContract";
import { proposeModalSelectedOptionSelector } from "redux/selectors/modalsSelector";
import {
  SelectedOptionType,
  setProposeModalSelectedOption,
} from "redux/slices/modalsSlice";
import { MultisigAction } from "types/MultisigAction";
import { MultisigIssueToken } from "types/MultisigIssueToken";
import { MultisigSendEgld } from "types/MultisigSendEgld";
import { MultisigSendToken } from "types/MultisigSendToken";
import { ProposalsTypes } from "types/Proposals";
import ProposeChangeQuorum from "./ProposeChangeQuorum";
import ProposeInputAddressType from "./ProposeInputAddress";
import ProposeIssueToken from "./ProposeIssueToken";
import ProposeRemoveUser from "./ProposeRemoveUser";
import ProposeSendEgld from "./ProposeSendEgld";
import ProposeSendToken from "./ProposeSendToken";

const titles = {
  [ProposalsTypes.send_egld]: "send egld",
  [ProposalsTypes.add_proposer]: "add proposer",
  [ProposalsTypes.add_board_member]: "add board Member",
  [ProposalsTypes.remove_user]: "remove user",
  [ProposalsTypes.change_quorum]: "change quorum",
  [ProposalsTypes.issue_token]: "issue token",
  [ProposalsTypes.send_token]: "send token",
};

const ProposeModal = () => {
  const {
    mutateSendEgld,
    mutateEsdtSendToken,
    mutateEsdtIssueToken,
    mutateProposeChangeQuorum,
    mutateProposeAddProposer,
    mutateProposeAddBoardMember,
    mutateProposeRemoveUser,
  } = useMultisigContract();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedOption: SelectedOptionType = useSelector(
    proposeModalSelectedOptionSelector,
  );
  const [selectedNumericParam, setSelectedNumericParam] = useState(1);
  const [selectedAddressParam, setSelectedAddressParam] = useState(
    new Address(),
  );
  const [selectedProposal, setSelectedProposal] =
    useState<MultisigAction | null>(null);

  const onProposeClicked = () => {
    if (selectedProposal instanceof MultisigSendEgld) {
      mutateSendEgld(
        selectedProposal.address,
        selectedProposal.amount,
        selectedProposal.data,
      );
      return;
    } else if (selectedProposal instanceof MultisigIssueToken) {
      mutateEsdtIssueToken(selectedProposal as MultisigIssueToken);
      return;
    } else if (selectedProposal instanceof MultisigSendToken) {
      mutateEsdtSendToken(selectedProposal as MultisigSendToken);
      return;
    }

    switch (selectedOption?.option) {
      case ProposalsTypes.change_quorum:
        mutateProposeChangeQuorum(selectedNumericParam);
        break;
      case ProposalsTypes.add_proposer:
        mutateProposeAddProposer(selectedAddressParam);
        break;
      case ProposalsTypes.add_board_member:
        mutateProposeAddBoardMember(selectedAddressParam);
        break;
      case ProposalsTypes.remove_user:
        mutateProposeRemoveUser(selectedAddressParam);
        break;
      default:
        console.error(`Unrecognized option ${selectedOption}`);
        break;
    }
    handleClose();
  };

  const handleNumericParamChange = (value: number) => {
    setSelectedNumericParam(value);
  };

  const handleAddressParamChange = (value: Address) => {
    setSelectedAddressParam(value);
  };

  const handleProposalChange = (proposal: MultisigAction) => {
    setSelectedProposal(proposal);
  };

  const handleClose = () => {
    dispatch(setProposeModalSelectedOption(null));
  };
  if (selectedOption == null) {
    return null;
  }

  const getModalContent = () => {
    switch (selectedOption?.option) {
      case ProposalsTypes.change_quorum: {
        return (
          <ProposeChangeQuorum handleParamsChange={handleNumericParamChange} />
        );
      }
      case ProposalsTypes.add_proposer:
      case ProposalsTypes.add_board_member:
        return (
          <ProposeInputAddressType
            handleParamsChange={handleAddressParamChange}
          />
        );
      case ProposalsTypes.remove_user:
        return (
          <ProposeRemoveUser
            handleSetAddress={handleAddressParamChange}
            selectedOption={selectedOption}
          />
        );
      case ProposalsTypes.send_egld:
        return <ProposeSendEgld handleChange={handleProposalChange} />;
      case ProposalsTypes.issue_token:
        return <ProposeIssueToken handleChange={handleProposalChange} />;
      case ProposalsTypes.send_token:
        return <ProposeSendToken handleChange={handleProposalChange} />;
    }
  };
  return (
    <Modal
      show
      size="lg"
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body">
          <p className="h3 mb-spacer text-center" data-testid="delegateTitle">
            {`${t("Make a proposal")}`}
          </p>

          <div className="">
            {getModalContent()}
            <div className="modal-action-btns">
              <button
                onClick={handleClose}
                className="btn btn-primary btn-light "
              >
                <FontAwesomeIcon icon={faTimes} />
                {t("Cancel")}
              </button>
              <button onClick={onProposeClicked} className="btn btn-primary ">
                <FontAwesomeIcon icon={faHandPaper} />
                {t("Propose")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProposeModal;
