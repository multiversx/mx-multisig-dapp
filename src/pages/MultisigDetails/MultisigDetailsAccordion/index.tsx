import React from "react";
import { Address } from "@elrondnetwork/erdjs";
import {
  faMinus,
  faPlus,
  faChevronCircleDown,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CopyButton from "components/CopyButton";
import StatCard from "components/StatCard";
import { setProposeModalSelectedOption } from "redux/slices/modalsSlice";
import { ProposalsTypes } from "types/Proposals";

import { ContractInfo } from "../MultisigDetailsPage";
import "./multisigDetailsAccordion.scss";

const MultisigDetailsAccordion = ({
  contractInfo,
}: {
  contractInfo: ContractInfo;
}) => {
  const {
    totalBoardMembers,
    totalProposers,
    quorumSize,
    boardMembersAddresses,
    proposersAddresses,
  } = contractInfo;

  const [expanded, setExpanded] = React.useState(false);

  const handleToggleExpanded = () => setExpanded((prev) => !prev);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onAddBoardMember = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.add_board_member,
      }),
    );
  const onAddProposers = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.add_proposer,
      }),
    );
  const onRemoveUser = (address: Address) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.remove_user,
        address: address.bech32(),
      }),
    );
  const onChangeQuorum = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.change_quorum,
      }),
    );

  const renderAddress = (address: Address) => (
    <Card.Header key={address.bech32()}>
      <div>
        {address.bech32()}
        <CopyButton text={address.bech32()} />
      </div>
      <button
        onClick={() => onRemoveUser(address)}
        className={"action-remove m-lg-1 order-1"}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
    </Card.Header>
  );

  const boardMembersContent = boardMembersAddresses != null && (
    <div className={"boards-members-content"}>
      <Card.Header>
        <span>Board Members</span>
        <button
          onClick={onAddBoardMember}
          className={"action-add m-lg-1 order-3"}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </Card.Header>

      <Card.Body>{boardMembersAddresses.map(renderAddress)}</Card.Body>
    </div>
  );

  const proposersContent = proposersAddresses != null && (
    <div className={"boards-members-content"}>
      <Card.Header>
        <span>Proposers</span>
        <button
          onClick={onAddProposers}
          className={"action-add m-lg-1 order-3"}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </Card.Header>

      <Card.Body>{proposersAddresses.map(renderAddress)}</Card.Body>
    </div>
  );
  return (
    <Accordion className={"multisig-details-accordion"}>
      <Accordion.Toggle
        onClick={handleToggleExpanded}
        as={Card}
        eventKey="0"
        className="cards d-flex flex-wrap "
      >
        <StatCard
          title={t("Board Members")}
          value={totalBoardMembers.toString()}
          color="orange"
          svg=""
        />
        <StatCard
          title={t("Proposers")}
          value={totalProposers.toString()}
          valueUnit=""
          color="orange"
          svg="clipboard-list.svg"
        />
        <StatCard
          title={t("Quorum Size")}
          value={`${quorumSize.toString()} / ${totalBoardMembers} `}
          valueUnit=""
          color="orange"
          onEditAction={onChangeQuorum}
          svg="quorum.svg"
        />
      </Accordion.Toggle>
      <div className={"expand-icon"}>
        <FontAwesomeIcon
          icon={expanded ? faChevronCircleUp : faChevronCircleDown}
        />
      </div>
      <Card>
        <Accordion.Collapse eventKey="0">
          <div className={"cards-collapse-content"}>{boardMembersContent}</div>
        </Accordion.Collapse>
        <Accordion.Collapse eventKey="0">
          <div className={"cards-collapse-content"}>{proposersContent}</div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default MultisigDetailsAccordion;
