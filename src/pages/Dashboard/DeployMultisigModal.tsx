import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { faTimes, faHandPaper } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <div className="card-body p-spacer ">
          <p className="h3 text-center" data-testid="delegateTitle">
            {t("Multisig Deployment")}
          </p>

          <div className="modal-control-container">
            <label>{t("Name")}: </label>
            <input
              type="text"
              className="form-control"
              value={name}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-action-btns">
            <button
              onClick={handleClose}
              className="btn btn-primary btn-light "
            >
              <FontAwesomeIcon icon={faTimes} />
              {t("Cancel")}
            </button>
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
