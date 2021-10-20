import React from "react";
import { Address } from "@elrondnetwork/erdjs";
import {
  faMinus,
  faPlus,
  faPencilAlt,
  faExternalLinkAlt,
  faChevronCircleDown,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, useAccordionToggle, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ReactComponent as NoPoposalsIcon } from "assets/img/no-proposals-icon.svg";
import StatCard from "components/StatCard";
import { setProposeModalSelectedOption } from "redux/slices/modalsSlice";
import { ProposalsTypes } from "types/Proposals";

import { ContractInfo } from "../MultisigDetailsPage";
import "./multisigDetailsAccordion.scss";
import { Ui } from "@elrondnetwork/dapp-utils";

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

  const decoratedOnClick = useAccordionToggle("0", handleToggleExpanded);

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
      <div className="user-item">
        <span className="address text d-flex">
          <Ui.Trim text={address.bech32()} />
        </span>
        {/* <CopyButton text={address.bech32()} /> */}
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="link-second-style  ml-2"
        >
          <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
        </a>
      </div>
      <div className="btns">
        <button
          onClick={() => onRemoveUser(address)}
          className={"action-remove action remove"}
        >
          <FontAwesomeIcon icon={faMinus} />
          <span className="name">Remove</span>
        </button>
      </div>
    </Card.Header>
  );

  const boardMembersContent = boardMembersAddresses != null && (
    <div className={"actions-card boards-members-content"}>
      <Card.Header>
        <span className="h5">Board Members</span>
        <div className="btns">
          <button
            onClick={onAddBoardMember}
            className={"btn action-add action unsign"}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="name">Add member</span>
          </button>
          <button
            onClick={onChangeQuorum}
            className={"btn action-add action unsign"}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
            <span className="name">Edit quorum</span>
          </button>
        </div>
      </Card.Header>

      {Object.keys(boardMembersAddresses).length > 0 ? (
        <Card.Body>{boardMembersAddresses.map(renderAddress)}</Card.Body>
      ) : (
        <div className=" w-100 no-active-proposals">
          <p className="d-flex flex-column align-items-center mb-3">
            <NoPoposalsIcon className=" " />
            {t("Currently there are no proposers.")}
          </p>
        </div>
      )}
    </div>
  );

  const proposersContent = proposersAddresses != null && (
    <div className={"actions-card proposals-content"}>
      <Card.Header>
        <span className="h5">Proposers</span>
        <div className="btns">
          <button
            onClick={onAddProposers}
            className={"action-add action unsign"}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="name">Add proposer</span>
          </button>
        </div>
      </Card.Header>
      {Object.keys(proposersAddresses).length > 0 ? (
        <Card.Body></Card.Body>
      ) : (
        <div className=" w-100 no-active-proposals">
          <p className="d-flex flex-column align-items-center mb-3">
            <NoPoposalsIcon className=" " />
            {t("Currently there are no proposers.")}
          </p>
        </div>
      )}
    </div>
  );
  return (
    <Accordion className={"multisig-details-accordion"}>
      <Accordion.Toggle
        onClick={decoratedOnClick}
        as={Card}
        eventKey="0"
        className="cards d-flex flex-wrap border-n"
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
          value={`${quorumSize.toString()}/${totalBoardMembers} `}
          valueUnit=""
          color="orange"
          svg="quorum.svg"
        />
      </Accordion.Toggle>

      <Accordion.Toggle
        eventKey={"0"}
        onClick={decoratedOnClick}
        className={"expand-icon"}
      >
        <FontAwesomeIcon
          icon={expanded ? faChevronCircleUp : faChevronCircleDown}
        />
      </Accordion.Toggle>
      <div className="owner-actions">
        <Card>
          <Accordion.Collapse eventKey="0">
            <div className="inset-shadow">
              <div className={"cards-collapse-content "}>
                {boardMembersContent}
              </div>
            </div>
          </Accordion.Collapse>
          <Accordion.Collapse eventKey="0">
            <div className={"cards-collapse-content"}>{proposersContent}</div>
          </Accordion.Collapse>
        </Card>
      </div>
    </Accordion>
  );
};

export default MultisigDetailsAccordion;
