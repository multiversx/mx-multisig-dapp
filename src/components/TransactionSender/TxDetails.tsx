import * as React from "react";
import { faCheck } from "@fortawesome/pro-regular-svg-icons/faCheck";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons/faSpinnerThird";
import { faTimes } from "@fortawesome/pro-regular-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyButton from "components/CopyButton";
import ExplorerLink from "components/ExplorerLink";
import Trim from "components/Trim";

interface Status {
  isPending: boolean;
  isSuccessful: boolean;
}

const Icon = ({ status }: { status: Status }) => {
  switch (true) {
    case status.isPending:
      return (
        <FontAwesomeIcon
          icon={faSpinnerThird}
          className="mr-1 text-secondary fa-spin slow-spin"
        />
      );
    case status.isSuccessful:
      return <FontAwesomeIcon icon={faCheck} className="mr-1 text-secondary" />;
    default:
      return <FontAwesomeIcon icon={faTimes} className="mr-1 text-secondary" />;
  }
};

const TxDetails = ({
  transactions,
  title,
}: {
  title?: React.ReactNode;
  transactions: { hash: string; status: Status }[];
}) => {
  return (
    <>
      {title && <div className="mb-0">{title}</div>}
      <div className="mb-2 mt-1">
        {transactions.filter((t) => !t.status.isPending).length} /{" "}
        {transactions.length} transactions processed
      </div>
      {transactions.map(({ hash, status }) => (
        <div
          className="tx-description d-flex justify-content-start align-items-center"
          key={hash}
        >
          <Icon status={status} />
          <span
            className="text-nowrap trim-fs-sm mr-3"
            data-testid="toastTxHash"
            style={{ width: "10rem" }}
          >
            <Trim text={hash} />
          </span>
          <CopyButton text={hash} />
          {!status.isPending && <ExplorerLink page={`transactions/${hash}`} />}
        </div>
      ))}
    </>
  );
};

export default TxDetails;
