import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Stepper from "react-stepper-horizontal";

interface DeployStepsModalType {
  show: boolean;
  handleClose: () => void;
  handleStep: (name: string) => void;
  currentStep: number;
}

const DeployStepsModal = ({
  show,
  handleClose,
  handleStep,
  currentStep,
}: DeployStepsModalType) => {
  const { t } = useTranslation();

  const steps = [
    { title: t("Deploy") },
    { title: t("Register Name") },
    { title: t("Attach") },
  ];

  const [name, setName] = useState("");

  const onConfirmClicked = () => {
    handleStep(name);
  };

  React.useEffect(() => {
    setName("");
  }, [currentStep]);

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

          <div className="pb-5">
            <Stepper
              steps={steps}
              activeStep={currentStep}
              defaultTitleOpacity="1"
              defaultColor="gray"
              defaultOpacity="1"
              activeColor="#655959"
              activeTitleColor="grey"
              completeTitleColor="grey"
              completeColor="#00FF0066"
              completeBarColor="white"
            />
          </div>

          {currentStep === 1 ? (
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
          ) : null}

          <div>
            <button onClick={onConfirmClicked} className="btn btn-primary mb-3">
              {steps[currentStep].title}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeployStepsModal;
