import React, { useState } from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Address, Balance } from "@elrondnetwork/erdjs";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";
import { useConfirmModal } from "components/ConfirmModal/ConfirmModalPayload";
import DepositModal from "components/DepositModal/DepositModal";
import StatCard from "components/StatCard";
import State from "components/State";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { useManagerContract } from "contracts/ManagerContract";
import { useMultisigContract } from "contracts/MultisigContract";
import { hexToNumber, hexToString } from "helpers/converters";
import { PlainAddress } from "helpers/plainObjects";
import { tryParseTransactionParameter } from "helpers/urlparameters";
import MultisigProposalCard from "pages/MultisigDetails/MultisigProposalCard";
import {
  currentMultisigAddressSelector,
  multisigContractsFetchedSelector,
} from "redux/selectors/multisigContractsSelectors";
import { refetchSelector } from "redux/selectors/toastSelector";
import {
  setCurrentMultisigAddress,
  setMultisigContractsFetched,
} from "redux/slices/multisigContractsSlice";
import { MultisigActionDetailed } from "types/MultisigActionDetailed";
import ProposeAction from "./Propose/ProposeAction";

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
}

const MultisigDetailsPage = () => {
  const [
    {
      totalBoardMembers,
      totalProposers,
      quorumSize,
      userRole,
      allActions,
      multisigBalance,
      multisigName,
    },
    setContractInfo,
  ] = useState<ContractInfo>({
    totalBoardMembers: 0,
    totalProposers: 0,
    quorumSize: 0,
    userRole: 0,
    multisigBalance: Balance.fromString("0"),
    multisigName: "",
    allActions: [],
  });

  const contractsFetched = useSelector(multisigContractsFetchedSelector);
  const currentMultisigAddress = useSelector(currentMultisigAddressSelector);

  const { address, apiAddress, dapp, egldLabel } = useDappContext();
  const {
    queryBoardMembersCount,
    queryProposersCount,
    queryQuorumCount,
    queryUserRole,
    queryAllActions,
    queryActionValidSignerCount,
    mutatePerformAction,
    mutateDiscardAction,
  } = useMultisigContract();
  const { queryContractName } = useManagerContract();
  const dispatch = useDispatch();
  const { multisigAddressParam } = useParams<MultisigDetailsPageParams>();
  const confirmModal = useConfirmModal();
  const refetch = useSelector(refetchSelector);
  const { t } = useTranslation();
  const [showDepositModal, setShowDepositModal] = useState(false);
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
      ] = await Promise.all([
        queryBoardMembersCount(),
        queryProposersCount(),
        queryQuorumCount(),
        queryUserRole(new Address(address).hex()),
        queryAllActions(),
        queryContractName(currentMultisigAddress!),
        dapp.proxy.getAccount(currentMultisigAddress!),
      ]);
      const contractInfo: ContractInfo = {
        totalBoardMembers: newTotalBoardMembers,
        totalProposers: newTotalProposers,
        quorumSize: newQuorumSize,
        userRole: newUserRole,
        allActions: newAllActions,
        multisigBalance: account.balance,
        multisigName: contractName,
      };

      setContractInfo(contractInfo);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setMultisigContractsFetched(true));
    }
  };

  const onDepositClicked = () => {
    setShowDepositModal(true);
  };

  const onCloseDepositModal = () => {
    setShowDepositModal(false);
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
        await mutatePerformAction(actionId);
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

  if (address === null) {
    return <Redirect to="/" />;
  }

  if (!parseMultisigAddress()) {
    return <Redirect to="/multisig" />;
  }
  return (
    <MultisigDetailsContext.Provider value={{ quorumSize }}>
      <div className="dashboard w-100">
        <div className="card border-0">
          <div className="header card-header d-flex align-items-center border-0 justify-content-between px-spacer">
            <div className="py-spacer text-truncate">
              <p className="opacity-6 mb-0">{multisigName}</p>
              <span className="text-truncate">
                {currentMultisigAddress?.bech32()}
              </span>
            </div>
            <div className="d-flex justify-content-center align-items-center justify-content-between">
              <button
                onClick={onDepositClicked}
                className="btn btn-primary mr-3"
              >
                {t("Deposit")}
              </button>
              <Link to="/multisig" className="btn btn-primary btn-sm">
                {t("Manage Multisigs")}
              </Link>
            </div>
          </div>

          <div className="cards d-flex flex-wrap mr-spacer">
            <StatCard
              title={t("Balance")}
              value={multisigBalance
                .toDenominated()
                .toString()
                .slice(
                  0,
                  multisigBalance.toDenominated().toString().length - 16,
                )}
              valueUnit={egldLabel}
              color="orange"
              svg="money.svg"
            />
            <StatCard
              title={t("Board Members")}
              value={totalBoardMembers.toString()}
              color="orange"
              svg="clipboard-check.svg"
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
              value={quorumSize.toString()}
              valueUnit=""
              color="orange"
              svg="quorum.svg"
            />
            <StatCard
              title={t("User Role")}
              value={t(userRoleAsString())}
              valueUnit=""
              color="orange"
              svg="user.svg"
            />
          </div>

          <div className="card-body pt-0 px-spacer pb-spacer">
            {!contractsFetched ? (
              <State icon={faCircleNotch} iconClass="fa-spin text-primary" />
            ) : (
              <div className="card mt-spacer">
                <div className="card-body p-spacer">
                  <div className="d-flex flex-wrap align-items-center justify-content-between">
                    <p className="h6 mb-3">{t("Proposals")}</p>
                    <div className="d-flex flex-wrap">
                      {isProposer ? <ProposeAction /> : null}
                    </div>
                  </div>

                  {allActions.map((action) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDepositModal && <DepositModal onClose={onCloseDepositModal} />}
    </MultisigDetailsContext.Provider>
  );
};

export default MultisigDetailsPage;
