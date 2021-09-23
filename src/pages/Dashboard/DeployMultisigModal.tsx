import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface DeployStepsModalType {
  show: boolean;
  handleClose: () => void;
  handleDeploy: (name: string) => void;
}

const DeployStepsModal = ({
  show,
  handleClose,
  handleDeploy,
}: DeployStepsModalType) => {
  const { t } = useTranslation();

  const [name, setName] = useState("");

  const onConfirmClicked = () => {
    handleDeploy(name);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            {t("Multisig Deployment")}
          </p>

          <div className="modal-control-container pb-3">
            <span>{t("Name")}: </span>
            <input
              style={{ width: 280 }}
              type="text"
              className="form-control"
              value={name}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <button onClick={onConfirmClicked} className="btn btn-primary mb-3">
              Sign and Deploy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeployStepsModal;
