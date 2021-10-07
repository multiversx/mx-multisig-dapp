import React from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as Wallet } from "assets/img/wallet-logo.svg";
import TrustedBadge from "components/TrustedBadge";
import { useManagerContract } from "contracts/ManagerContract";
import { updateMultisigContract } from "redux/slices/multisigContractsSlice";
import { MultisigContractInfoType } from "types/multisigContracts";
import { faExternalLinkAlt } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Trim from "components/Trim";

const MultisigCard = ({ contract }: { contract: MultisigContractInfoType }) => {
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

  const onUnregisterClicked = async () => {
    await mutateUnregisterMultisigContract(new Address(contract.address.hex));
  };

  return (
    <button
      onClick={onEnterClicked}
      className="shadow-sm text-black rounded bg-white"
    >
      <div className=" position-relative ">
        <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
          <div className="d-flex icon">
            <Wallet className="logo" />
          </div>
        </div>
        <div className="align-items-center justify-content-between mb-2">
          <div className="wallet-details">
            <div className="h5 mb-0">{contract.name}</div>

            <div className="d-flex wallet-address">
              <TrustedBadge
                contractAddress={contract.address.bech32}
                onVerificationComplete={ontTrustVerificationComplete}
                initialValue={contract.isTrusted}
              />
              <Trim text={contract.address.bech32} />
              <FontAwesomeIcon icon={faExternalLinkAlt} size="lg" />
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </button>
  );
};

export default MultisigCard;
