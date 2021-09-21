import * as React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ExplorerLink = ({ page, text }: { page: string; text?: string }) => {
  const { explorerAddress } = useDappContext();
  return (
    <a
      href={`${explorerAddress}${page}`}
      {...{
        target: "_blank",
      }}
      className="link-style ml-2"
    >
      {text ? (
        <>{text}</>
      ) : (
        <FontAwesomeIcon icon={faSearch} className="text-secondary" />
      )}
    </a>
  );
};

export default ExplorerLink;
