import React from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import {
  faInfoCircle,
  faTimes,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ReactComponent as AddUser } from "assets/img/add-user.svg";
import { ReactComponent as Circle } from "assets/img/circle.svg";
import { ReactComponent as DeleteUser } from "assets/img/delete-user.svg";
import { ReactComponent as Done } from "assets/img/done.svg";
import { ReactComponent as Logo } from "assets/img/logo.svg";
import { ReactComponent as Quorum } from "assets/img/quorum.svg";
import { ReactComponent as Token } from "assets/img/token.svg";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { useMultisigContract } from "contracts/MultisigContract";
import { MultisigActionType } from "types/MultisigActionType";
import { setSelectedPerformedActionId } from "../../redux/slices/modalsSlice";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

export interface MultisigProposalCardType {
  type: number;
  actionId?: number;
  tooltip?: string;
  title?: string;
  value?: string;
  canSign?: boolean;
  canUnsign?: boolean;
  canPerformAction?: boolean;
  canDiscardAction?: boolean;
  signers: Address[];
}

const MultisigProposalCard = ({
  type = 0,
  actionId = 0,
  tooltip = "",
  title = "",
  value = "0",
  canSign = false,
  canUnsign = false,
  canPerformAction = false,
  canDiscardAction = false,
  signers = [],
}: MultisigProposalCardType) => {
  const { mutateSign, mutateUnsign, mutateDiscardAction } =
    useMultisigContract();
  const { quorumSize } = React.useContext(MultisigDetailsContext);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const sign = () => {
    mutateSign(actionId);
  };

  const unsign = () => {
    mutateUnsign(actionId);
  };

  const performAction = () => {
    dispatch(setSelectedPerformedActionId(actionId));
  };

  const discardAction = () => {
    mutateDiscardAction(actionId);
  };
  return (
    <div className="statcard shadow-sm text-black py-3 px-4 mb-spacer">
      <div className="d-flex align-items-center justify-content-between proposal">
        <div className="meta">
          <p className="h5 mb-0">
            {title}
            {tooltip !== "" ? (
              <FontAwesomeIcon
                style={{ width: 16, height: 16, marginBottom: 2 }}
                icon={faInfoCircle}
                className="text-black ml-2"
                data-toggle="tooltip"
                data-html="true"
                title={tooltip}
              />
            ) : null}
          </p>
          <span className="text">{value}</span>
        </div>
        <div className="deadline">
          <p className="font-weight-bold mb-0">Data</p>
          <p className="text text-center mb-0">2</p>
        </div>

        <div className="d-flex align-items-center btns action-btns">
          {canSign && (
            <button onClick={sign} className="btn action sign">
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{t("Approve")} </span>
            </button>
          )}
          {canUnsign && (
            <button onClick={unsign} className="btn  action unsign ">
              <FontAwesomeIcon icon={faTimes} /> <span>{t("Withdraw")}</span>
            </button>
          )}
        </div>
        <div style={{ width: 72, height: 72 }} className="">
          <CircularProgressbarWithChildren
            value={signers.length}
            maxValue={quorumSize}
            strokeWidth={10}
            styles={buildStyles({
              strokeLinecap: "butt",
              pathColor: "#16D296",
            })}
          >
            <div>{`${signers.length} / ${quorumSize}`}</div>
          </CircularProgressbarWithChildren>
        </div>
      </div>
    </div>
  );
};

export default MultisigProposalCard;
