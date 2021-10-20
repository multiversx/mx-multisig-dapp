import React from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import {
  faInfoCircle,
  faTimes,
  faThumbsUp,
  faThumbsDown,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { useMultisigContract } from "contracts/MultisigContract";
import { setSelectedPerformedActionId } from "../../redux/slices/modalsSlice";

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
  data: string;
  signers: Address[];
}

const MultisigProposalCard = ({
  type = 0,
  actionId = 0,
  data = "N/A",
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
    <div className="statcard text-black py-3 px-4 mb-spacer">
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
          <p className="mb-0">Data</p>
          <p className="text mb-0">{data}</p>
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
              <FontAwesomeIcon icon={faThumbsDown} />
              <span>{t("Withdraw")}</span>
            </button>
          )}
          {canPerformAction && (
            <button
              style={{ whiteSpace: "nowrap" }}
              onClick={performAction}
              className="btn action perform "
            >
              <FontAwesomeIcon icon={faCheck} />
              {t("Perform")}
            </button>
          )}
          {canDiscardAction && (
            <button
              style={{ whiteSpace: "nowrap" }}
              onClick={discardAction}
              className="btn action remove"
            >
              <FontAwesomeIcon icon={faTimes} />
              {t("Discard")}
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
