import React from "react";
import { Ui } from "@elrondnetwork/dapp-utils";
import { faExternalLinkAlt, faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Wallet } from "assets/img/wallet-logo.svg";
import TrustedBadge from "components/TrustedBadge";
import { network } from "config";
import { updateMultisigContract } from "redux/slices/multisigContractsSlice";
import { MultisigContractInfoType } from "types/multisigContracts";
import { removeContractFromMultisigContractsList } from "../../apiCalls/multisigContractsCalls";

const MultisigCard = ({ contract }: { contract: MultisigContractInfoType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function ontTrustVerificationComplete(isContractTrusted: boolean) {
    dispatch(
      updateMultisigContract({
        address: contract.address,
        isTrusted: isContractTrusted,
      }),
    );
  }

  const onEnterClicked = () => {
    navigate("/multisig/" + contract.address);
  };

  const onUnregisterClicked = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await removeContractFromMultisigContractsList(contract.address);
  };

  return (
    <button onClick={onEnterClicked} className="bg-white">
      <div
        onClick={onUnregisterClicked}
        className={"position-absolute unregister-icon"}
      >
        <FontAwesomeIcon
          icon={faTimes}
          size="lg"
          className="link-second-style"
        />
      </div>
      <div className="d-flex icon">
        <Wallet className="logo" />
      </div>
      <div className="align-items-center justify-content-between mb-2">
        <div className="wallet-details">
          <h5 className="name mb-20">{contract.name}</h5>

          <div className="d-flex wallet-address">
            <TrustedBadge
              contractAddress={contract.address}
              onVerificationComplete={ontTrustVerificationComplete}
              initialValue={contract.isTrusted}
            />
            <Ui.Trim text={contract.address} />
            <a
              href={`${network.explorerAddress}accounts/${contract.address}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              rel="noreferrer"
              className="link-second-style ml-2"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} size="lg" />
            </a>
          </div>
        </div>
      </div>
    </button>
  );
};

export default MultisigCard;
