import React from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as Wallet } from "assets/img/wallet.svg";
import TrustedBadge from "components/TrustedBadge";
import { useManagerContract } from "contracts/ManagerContract";
import { updateMultisigContract } from "redux/slices/multisigContractsSlice";
import { MultisigContractInfoType } from "types/multisigContracts";

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
    <div className="col-md-4 statcard position-relative card-bg-grey text-black py-3 px-4 mb-spacer ml-spacer rounded mx-4">
      <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
        <div className="icon my-1 fill-black">
          <Wallet className="logo" />
        </div>
      </div>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-2">
        <div>
          <div className="h5 mb-0">{contract.name}</div>
          <div className="opacity-6">{contract.address.bech32}</div>
        </div>
        <div>
          <button
            onClick={onEnterClicked}
            className="btn btn-primary mb-3 mr-2"
          >
            {t("Enter")}
          </button>
          <button
            onClick={onUnregisterClicked}
            className="btn btn-primary  mb-3 mr-2"
          >
            {t("Unregister")}
          </button>
        </div>
      </div>
      <TrustedBadge
        contractAddress={contract.address.bech32}
        onVerificationComplete={ontTrustVerificationComplete}
        initialValue={contract.isTrusted}
      />
    </div>
  );
};

export default MultisigCard;
