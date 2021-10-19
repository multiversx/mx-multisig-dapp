import React, { useState } from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Ui, operations } from "@elrondnetwork/dapp-utils";
import { Address, Balance } from "@elrondnetwork/erdjs";
import {
  faUser,
  faCalendarAlt,
  faCircleNotch,
  faHandPaper,
  faExternalLinkAlt,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { ReactComponent as WalletLogo } from "assets/img/elrond-wallet-icon.svg";
import { ReactComponent as NoPoposalsIcon } from "assets/img/no-proposals-icon.svg";
import { useConfirmModal } from "components/ConfirmModal/ConfirmModalPayload";
import PerformActionModal from "components/PerformActionModal";
import ReceiveModal from "components/ReceiveModal";
import State from "components/State";
import TrustedBadge from "components/TrustedBadge";
import { denomination, decimals } from "config";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { useManagerContract } from "contracts/ManagerContract";
import { useMultisigContract } from "contracts/MultisigContract";
import { hexToNumber, hexToString } from "helpers/converters";
import { PlainAddress } from "helpers/plainObjects";
import { tryParseTransactionParameter } from "helpers/urlparameters";
import MultisigProposalCard from "pages/MultisigDetails/MultisigProposalCard";
import { priceSelector } from "redux/selectors/economicsSelector";
import {
  currentMultisigAddressSelector,
  multisigContractsFetchedSelector,
} from "redux/selectors/multisigContractsSelectors";
import { refetchSelector } from "redux/selectors/toastSelector";
import {
  setProposeModalSelectedOption,
  setSelectedPerformedActionId,
} from "redux/slices/modalsSlice";
import {
  setCurrentMultisigAddress,
  setMultisigContractsFetched,
} from "redux/slices/multisigContractsSlice";
import { MultisigActionDetailed } from "types/MultisigActionDetailed";
import { ProposalsTypes } from "../../types/Proposals";
import MultisigDetailsAccordion from "./MultisigDetailsAccordion";
import ProposeModal from "./Propose/ProposeModal";

interface MultisigDetailsPageParams {
  multisigAddressParam: string;
}

export interface ContractInfo {
  totalBoardMembers: number;
  totalProposers: number;
  quorumSize: number;
  userRole: number;
  allActions: MultisigActionDetailed[];
  multisigBalance: Balance;
  multisigName: string;
  boardMembersAddresses?: Address[];
  proposersAddresses?: Address[];
}

const MultisigDetailsPage = () => {
  const [contractInfo, setContractInfo] = useState<ContractInfo>({
    totalBoardMembers: 0,
    totalProposers: 0,
    quorumSize: 0,
    userRole: 0,
    multisigBalance: Balance.fromString("0"),
    multisigName: "",
    allActions: [],
    boardMembersAddresses: [],
    proposersAddresses: [],
  });

  const {
    totalBoardMembers,
    quorumSize,
    userRole,
    allActions,
    multisigBalance,
    multisigName,
  } = contractInfo;

  const contractsFetched = useSelector(multisigContractsFetchedSelector);
  const currentMultisigAddress = useSelector(currentMultisigAddressSelector);

  const { address, apiAddress, dapp, egldLabel, explorerAddress } =
    useDappContext();
  const {
    queryBoardMembersCount,
    queryProposersCount,
    queryQuorumCount,
    queryUserRole,
    queryAllActions,
    queryActionValidSignerCount,
    mutateDiscardAction,
    queryBoardMemberAddresses,
    queryProposerAddresses,
  } = useMultisigContract();
  const { queryContractName } = useManagerContract();
  const dispatch = useDispatch();
  const { multisigAddressParam } = useParams<MultisigDetailsPageParams>();
  const confirmModal = useConfirmModal();
  const refetch = useSelector(refetchSelector);
  const egldPrice = useSelector(priceSelector);
  const { t } = useTranslation();
  const isProposer = userRole !== 0;
  const isBoardMember = userRole === 2;

  const parseMultisigAddress = (): Address | undefined => {
    try {
      return new Address(multisigAddressParam);
    } catch {
      return undefined;
    }
  };

  const getDashboardInfo = async () => {
    if (currentMultisigAddress === null) {
      return;
    }

    try {
      const [
        newTotalBoardMembers,
        newTotalProposers,
        newQuorumSize,
        newUserRole,
        newAllActions,
        contractName,
        account,
        boardMembersAddresses,
        proposersAddresses,
      ] = await Promise.all([
        queryBoardMembersCount(),
        queryProposersCount(),
        queryQuorumCount(),
        queryUserRole(new Address(address).hex()),
        queryAllActions(),
        queryContractName(currentMultisigAddress!),
        dapp.proxy.getAccount(currentMultisigAddress!),
        queryBoardMemberAddresses(),
        queryProposerAddresses(),
      ]);
      const newContractInfo: ContractInfo = {
        totalBoardMembers: newTotalBoardMembers,
        totalProposers: newTotalProposers,
        quorumSize: newQuorumSize,
        userRole: newUserRole,
        allActions: newAllActions,
        multisigBalance: account.balance,
        multisigName: contractName,
        boardMembersAddresses,
        proposersAddresses,
      };

      setContractInfo(newContractInfo);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setMultisigContractsFetched(true));
    }
  };

  const userRoleAsString = () => {
    switch (userRole) {
      case 0:
        return "No rights";
      case 1:
        return "Proposer";
      case 2:
        return "Proposer / Signer";
      default:
        return "Unknown";
    }
  };

  const alreadySigned = (action: MultisigActionDetailed) => {
    const typedAddress = new Address(address);
    for (const signerAddress of action.signers) {
      if (signerAddress.hex() === typedAddress.hex()) {
        return true;
      }
    }

    return false;
  };

  const canSign = (action: MultisigActionDetailed) => {
    return isBoardMember && !alreadySigned(action);
  };

  const canUnsign = (action: MultisigActionDetailed) => {
    return isBoardMember && alreadySigned(action);
  };

  const canPerformAction = (action: MultisigActionDetailed) => {
    return (
      isBoardMember &&
      alreadySigned(action) &&
      action.signers.length >= quorumSize
    );
  };

  const canDiscardAction = (action: MultisigActionDetailed) => {
    return isBoardMember && action.signers.length === 0;
  };

  const tryParseUrlParams = async () => {
    const parameters = await tryParseTransactionParameter(apiAddress);
    if (parameters === null) {
      return;
    }

    if (parameters.receiver.bech32() === currentMultisigAddress?.bech32()) {
      if (parameters.functionName.startsWith("propose")) {
        if (
          parameters.outputParameters.length === 2 &&
          hexToString(parameters.outputParameters[0]) === "ok"
        ) {
          const actionId = hexToNumber(parameters.outputParameters[1]);
          if (actionId !== null) {
            onSignOrPropose(actionId);
          }
        }
      } else if (parameters.functionName === "sign") {
        if (
          parameters.outputParameters.length === 1 &&
          hexToString(parameters.outputParameters[0]) === "ok"
        ) {
          const actionId = hexToNumber(parameters.inputParameters[0]);
          if (actionId !== null) {
            onSignOrPropose(actionId);
          }
        }
      } else if (parameters.functionName === "unsign") {
        if (
          parameters.outputParameters.length === 1 &&
          hexToString(parameters.outputParameters[0]) === "ok"
        ) {
          const actionId = hexToNumber(parameters.inputParameters[0]);
          if (actionId !== null) {
            onUnsign(actionId);
          }
        }
      }
    }
  };

  const onSignOrPropose = async (actionId: number) => {
    const validSignerCount = await queryActionValidSignerCount(actionId);
    const realQuorumSize = await queryQuorumCount();
    const realUserRole = await queryUserRole(new Address(address).hex());

    if (validSignerCount >= realQuorumSize && realUserRole === 2) {
      const success = await confirmModal.show(
        t("Confirm Perform Action"),
        t("Perform Action"),
      );
      if (success) {
        dispatch(setSelectedPerformedActionId(actionId));
      }
    }
  };

  const onUnsign = async (actionId: number) => {
    const validSignerCount = await queryActionValidSignerCount(actionId);
    const realUserRole = await queryUserRole(new Address(address).hex());

    if (validSignerCount === 0 && realUserRole === 2) {
      const success = await confirmModal.show(
        t("Confirm Discard Action"),
        t("Discard Action"),
      );
      if (success) {
        await mutateDiscardAction(actionId);
      }
    }
  };

  const onSendEgld = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.send_egld,
      }),
    );

  const onIssueToken = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.issue_token,
      }),
    );

  const onSendToken = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.send_token,
      }),
    );

  React.useEffect(() => {
    tryParseUrlParams();

    const newMultisigAddressParam = parseMultisigAddress();
    if (newMultisigAddressParam === null) {
      return;
    }

    const isCurrentMultisigAddressNotSet = !currentMultisigAddress;
    const isCurrentMultisigAddressDiferentThanParam =
      currentMultisigAddress &&
      newMultisigAddressParam &&
      currentMultisigAddress?.hex() !== newMultisigAddressParam.hex();

    if (
      (isCurrentMultisigAddressNotSet ||
        isCurrentMultisigAddressDiferentThanParam) &&
      newMultisigAddressParam != null
    ) {
      dispatch(
        setCurrentMultisigAddress(PlainAddress(newMultisigAddressParam)),
      );
    } else if (address !== null) {
      getDashboardInfo();
    }
  }, [currentMultisigAddress?.hex(), refetch, address]);

  if (!parseMultisigAddress()) {
    return <Redirect to="/multisig" />;
  }

  console.log("---multisigBalance", multisigBalance.toString());

  return (
    <MultisigDetailsContext.Provider
      value={{ quorumSize, totalBoardMembers, isProposer, multisigBalance }}
    >
      <div className="dashboard w-100">
        {/* <Link to="/multisig" className="btn btn-primary btn-sm d-block">
          <FontAwesomeIcon icon={faArrowCircleLeft} />
        </Link> */}
        <div className="card shadow-lg border-0">
          <div className="flex-column d-flex align-items-center">
            <WalletLogo className="wallet-logo " />
            <div className="w-100 user-profile">
              <div className="d-flex profile-meta">
                <div className="user-role">
                  <p className="icon">
                    <FontAwesomeIcon icon={faUser} />
                    Role: <span className="text">{t(userRoleAsString())}</span>
                  </p>
                </div>
                <div className="wallet-name position-relative">
                  <h3 className="mb-0">{multisigName} </h3>
                </div>
                <div className="created d-flex">
                  <p className="time">
                    <FontAwesomeIcon icon={faCalendarAlt} className="icon" />{" "}
                    Created: <span className="text">12/10/2021</span>
                  </p>
                </div>
              </div>
              {currentMultisigAddress && (
                <div className="address text-center d-flex align-items-center justify-content-center">
                  <TrustedBadge contractAddress={multisigAddressParam} />
                  <Ui.Trim text={currentMultisigAddress.bech32()} />
                  <a
                    href={`${explorerAddress}accounts/${currentMultisigAddress.bech32()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link-style"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
                  </a>
                </div>
              )}
            </div>
            <div className="d-flex flex-column action-panel w-100">
              <div className="balance">
                <h2 className="text-center">
                  {operations.denominate({
                    input: multisigBalance.toString(),
                    denomination,
                    decimals,
                    showLastNonZeroDecimal: true,
                  })}{" "}
                  {egldLabel}
                </h2>
                <h5 className="ex-currency text-center">
                  <Ui.UsdValue
                    amount={operations.denominate({
                      input: multisigBalance.toString(),
                      denomination,
                      decimals,
                      showLastNonZeroDecimal: true,
                      addCommas: false,
                    })}
                    usd={egldPrice}
                  />{" "}
                  USD
                </h5>
              </div>
              <div className="d-flex justify-content-center actions-btns">
                {isProposer && (
                  <button onClick={onSendEgld} className="btn btn-primarygit ">
                    <span className="icon">
                      <FontAwesomeIcon icon={faHandPaper} />
                    </span>

                    <span className="name">Propose</span>
                  </button>
                )}
                <ReceiveModal address={currentMultisigAddress?.bech32()} />
              </div>
            </div>
          </div>

          <MultisigDetailsAccordion contractInfo={contractInfo} />

          <div className="card-body">
            {!contractsFetched ? (
              <State icon={faCircleNotch} iconClass="fa-spin text-primary" />
            ) : (
              <div className="proposals-list">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  {Object.keys(allActions).length === 0 ? (
                    <div className="d-flex flex-column align-items-center w-100 no-active-proposals">
                      <NoPoposalsIcon className=" " />
                      <p className="mb-3">
                        {t("Currently there are no active proposals.")}
                      </p>
                      <a href="3">Make a proposal</a>
                    </div>
                  ) : (
                    allActions.map((action) => (
                      <MultisigProposalCard
                        key={action.actionId}
                        type={action.typeNumber()}
                        actionId={action.actionId}
                        title={action.title()}
                        tooltip={action.tooltip()}
                        value={action.description()}
                        canSign={canSign(action)}
                        canUnsign={canUnsign(action)}
                        canPerformAction={canPerformAction(action)}
                        canDiscardAction={canDiscardAction(action)}
                        signers={action.signers}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ProposeModal />
      <PerformActionModal />
    </MultisigDetailsContext.Provider>
  );
};

export default MultisigDetailsPage;
