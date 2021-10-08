import React from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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
    <div className="statcard shadow-sm text-black py-3 px-4 mb-spacer rounded">
      <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
        <div className="icon my-1 fill-dark">
          {type === MultisigActionType.AddBoardMember ||
          type === MultisigActionType.AddProposer ? (
            <AddUser />
          ) : type === MultisigActionType.RemoveUser ? (
            <DeleteUser />
          ) : type === MultisigActionType.ChangeQuorum ? (
            <Quorum />
          ) : type === MultisigActionType.SCCall ? (
            <Token />
          ) : type === MultisigActionType.SendEgld ? (
            <Logo style={{ width: 20, height: 20 }} />
          ) : null}
        </div>
        <div>
          {signers.map((_, index) => (
            <Done
              className={"done-icon"}
              key={index}
              style={{
                marginRight: index === signers.length - 1 ? 4 : 8,
              }}
            />
          ))}

          {quorumSize > 0 &&
            [...Array(quorumSize - signers.length)].map((index) => (
              <Circle
                key={index + signers.length}
                style={{ width: 30, height: 30 }}
              />
            ))}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div>
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
          <span className="opacity-6">{value}</span>
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
        <div className="d-flex align-items-center">
          {canSign && (
            <button onClick={sign} className="btn btn-primary mb-3 mr-2">
              {t("Sign")}
            </button>
          )}

          {canUnsign && (
            <button onClick={unsign} className="btn btn-primary mb-3 mr-2">
              {t("Unsign")}
            </button>
          )}

          {canPerformAction && (
            <button
              style={{ whiteSpace: "nowrap" }}
              onClick={performAction}
              className="btn btn-primary mb-3 mr-2"
            >
              {t("Perform Action")}
            </button>
          )}

          {canDiscardAction && (
            <button
              style={{ whiteSpace: "nowrap" }}
              onClick={discardAction}
              className="btn btn-primary mb-3 mr-2"
            >
              {t("Discard Action")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultisigProposalCard;
