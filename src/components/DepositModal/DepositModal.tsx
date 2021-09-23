import React from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMultisigContract } from "contracts/MultisigContract";

interface DepositModalType {
  onClose: () => void;
}

const DepositModal = ({ onClose }: DepositModalType) => {
  const { deposit } = useMultisigContract();
  const [amount, setAmount] = React.useState(0);
  const onConfirmClicked = async () => {
    await deposit(amount);
    onClose();
  };

  const onChangeAmount = (e: any) => {
    setAmount(e.target.value);
  };

  const { t } = useTranslation();

  return (
    <Modal
      show
      onHide={onClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            {`${t("Deposit")} EGLD`}
          </p>
          <div className={"mb-spacer"}>
            <input
              value={amount}
              onChange={onChangeAmount}
              placeholder={"enter amount"}
            />
          </div>
          <div>
            <button
              disabled={amount <= 0}
              onClick={onConfirmClicked}
              className="btn btn-primary mb-3 mr-3"
            >
              {t("Confirm")}
            </button>
            <button onClick={onClose} className="btn btn-primary mb-3">
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DepositModal;
