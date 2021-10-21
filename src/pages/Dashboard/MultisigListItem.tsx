import React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Ui } from "@elrondnetwork/dapp-utils";
import { Address } from "@elrondnetwork/erdjs/out";
import { faExternalLinkAlt, faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as Wallet } from "assets/img/wallet-logo.svg";
import TrustedBadge from "components/TrustedBadge";
import { useManagerContract } from "contracts/ManagerContract";
import { updateMultisigContract } from "redux/slices/multisigContractsSlice";
import { MultisigContractInfoType } from "types/multisigContracts";

const MultisigCard = ({ contract }: { contract: MultisigContractInfoType }) => {
  const { explorerAddress } = useDappContext();
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { mutateUnregisterMultisigContract } = useManagerContract();

  function ontTrustVerificationComplete(isContractTrusted: boolean) {
    dispatch(
      updateMultisigContract({
        address: contract.address,
        isTrusted: isContractTrusted,
      }),
    );
  }

  const onEnterClicked = () => {
    history.push("/multisig/" + contract.address.bech32);
  };

  const onUnregisterClicked = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await mutateUnregisterMultisigContract(new Address(contract.address.hex));
  };

  return (
    <button onClick={onEnterClicked} className="shadow-sm  bg-white">
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
              contractAddress={contract.address.bech32}
              onVerificationComplete={ontTrustVerificationComplete}
              initialValue={contract.isTrusted}
            />
            <Ui.Trim text={contract.address.bech32} />
            <a
              href={`${explorerAddress}accounts/${contract.address.bech32}`}
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
