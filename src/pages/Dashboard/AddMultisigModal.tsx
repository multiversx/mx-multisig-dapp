import React from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ProposeInputAddress from "../MultisigDetails/Propose/ProposeInputAddress";

interface AddMultisigModalType {
  show: boolean;
  handleClose: () => void;
  handleAdd: (address: Address) => void;
}

const AddMultisigModal = ({
  show,
  handleClose,
  handleAdd,
}: AddMultisigModalType) => {
  const { t } = useTranslation();

  const [address, setAddress] = React.useState(Address.Zero());

  const onAddressParamChange = (newAddress: Address) => {
    setAddress(newAddress);
  };

  const onAddClicked = () => {
    handleAdd(address);
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            {t("Add Multisig")}
          </p>

          <div className="p-spacer">
            <ProposeInputAddress handleParamsChange={onAddressParamChange} />
          </div>

          <div>
            <button onClick={onAddClicked} className="btn btn-primary mb-3">
              {t("Add")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddMultisigModal;
