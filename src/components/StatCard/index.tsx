import React from "react";
import {
  faInfoCircle,
  faMinus,
  faPlus,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { ReactComponent as BoardMember } from "assets/img/clipboard-check.svg";
import { ReactComponent as Proposer } from "assets/img/clipboard-list.svg";
import { ReactComponent as Money } from "assets/img/money.svg";
import { ReactComponent as Quorum } from "assets/img/quorum.svg";
import { ReactComponent as User } from "assets/img/user.svg";

export interface StatCardType {
  title?: string;
  value?: string;
  valueUnit?: string;
  svg?: string;
  color?: string;
  percentage?: string;
  tooltipText?: string;
  children?: any;
  onAddAction?: () => void;
  onRemoveAction?: () => void;
  onEditAction?: () => void;
}

const StatCard = ({
  title = "",
  value = "0",
  valueUnit = "",
  svg = "",
  percentage = "",
  tooltipText = "",
  children = null,
  onAddAction,
  onRemoveAction,
  onEditAction,
}: StatCardType) => {
  return (
    <div className={"statcard text-black"}>
      <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
        {/* <div className="icon my-1 statcard-item ">
          {svg === "clipboard-check.svg" ? (
            <BoardMember style={{ width: 32, height: 32 }} />
          ) : svg === "clipboard-list.svg" ? (
            <Proposer style={{ width: 32, height: 32 }} />
          ) : svg === "quorum.svg" ? (
            <Quorum style={{ width: 32, height: 32 }} />
          ) : svg === "user.svg" ? (
            <User style={{ width: 32, height: 32 }} />
          ) : svg === "money.svg" ? (
            <Money style={{ width: 32, height: 32 }} />
          ) : (
            <SVG
              src={process.env.PUBLIC_URL + "/" + svg}
              className="text-black"
            ></SVG>
          )}
        </div> */}
        <div>{children}</div>
      </div>
      <span className="h5 title">{title}</span>

      <small className="opacity-5">
        {percentage}
        {tooltipText !== "" && (
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) => (
              <Tooltip id="button-tooltip" {...props}>
                {tooltipText}
              </Tooltip>
            )}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="text-black ml-1" />
          </OverlayTrigger>
        )}
      </small>
      <div className={"d-flex justify-content-center actions"}>
        <p className="h5 mb-0 order-2 centering value">
          {value} {valueUnit}
        </p>
        {onEditAction != null && (
          <button
            onClick={onEditAction}
            className={"action-edit m-lg-2 order-2"}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
        )}

        {onRemoveAction != null && (
          <button
            onClick={onRemoveAction}
            className={"action-remove m-lg-1 order-1"}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
        )}
        {onAddAction != null && (
          <button onClick={onAddAction} className={"action-add m-lg-1 order-3"}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StatCard;
