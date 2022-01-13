import React, { useEffect, useState } from "react";
import { transactionServices } from "@elrondnetwork/dapp-core";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { addContractToMultisigContractsList } from "../../apiCalls/multisigContractsCalls";
import { deployMultisigContract } from "../../contracts/ManagerContract";
import { MultisigContractInfoType } from "../../types/multisigContracts";

interface DeployStepsModalType {
  show: boolean;
  handleClose: () => void;
  setNewContracts: (contracts: MultisigContractInfoType[]) => void;
}

interface PendingDeploymentContractData {
  multisigAddress: string;
  transactionId: string | null;
}

const DeployStepsModal = ({
  show,
  handleClose,
  setNewContracts,
}: DeployStepsModalType) => {
  const { t } = useTranslation();

  const [name, setName] = useState("");

  const [pendingDeploymentContractData, setPendingDeploymentContractData] =
    useState<PendingDeploymentContractData | null>(null);

  const transactionStatus = transactionServices.useTrackTransactionStatus(
    pendingDeploymentContractData?.transactionId || null,
  );

  useEffect(() => {
    const { isSuccessful } = transactionStatus;
    if (isSuccessful && pendingDeploymentContractData != null) {
      onAddMultisigFinished();
    }
  }, [transactionStatus?.isSuccessful]);

  async function onAddMultisigFinished() {
    const { multisigAddress } = pendingDeploymentContractData!;
    const newContracts = await addContractToMultisigContractsList({
      address: multisigAddress,
      name,
    });
    setNewContracts(newContracts);
    handleClose();
  }

  async function onDeploy() {
    const { multisigAddress, sessionId } = await deployMultisigContract();
    setPendingDeploymentContractData({
      multisigAddress,
      transactionId: sessionId,
    });
  }

  const loading = Boolean(transactionStatus?.isPending);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body p-spacer ">
          <p className="h3 text-center" data-testid="delegateTitle">
            {t("Multisig Deployment")}
          </p>

          <div className="modal-control-container">
            <label>{t("Name")}: </label>
            <input
              disabled={loading}
              type="text"
              className="form-control"
              value={name}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-action-btns">
            <button
              disabled={loading}
              onClick={handleClose}
              className="btn btn-primary btn-light "
            >
              <FontAwesomeIcon icon={faTimes} />
              {t("Cancel")}
            </button>
            <button
              onClick={onDeploy}
              disabled={loading}
              className="btn btn-primary mb-3"
            >
              {loading && (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              Sign and Deploy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeployStepsModal;
