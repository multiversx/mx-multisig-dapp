import React from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ProposeInputAddress from "../MultisigDetails/ProposeModal/ProposeInputAddress";

interface AddMultisigModalType {
  show: boolean;
  handleClose: () => void;
  handleAdd: (address: Address, name: string) => void;
}

const AddMultisigModal = ({
  show,
  handleClose,
  handleAdd,
}: AddMultisigModalType) => {
  const { t } = useTranslation();

  const [address, setAddress] = React.useState(Address.Zero());
  const [submitDisabled, setSubmitDisabled] = React.useState(false);
  const [contractName, setContractName] = React.useState("");

  const onAddressParamChange = (newAddress: Address) => {
    setAddress(newAddress);
  };
  const onContractNameChange = (e: any) => {
    setContractName(e.target.value);
  };
  const onAddClicked = () => {
    handleAdd(address, contractName);
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
        <div className="card-body ">
          <p className="h3 text-center" data-testid="delegateTitle">
            {t("Add Multisig")}
          </p>
          <ProposeInputAddress
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={onAddressParamChange}
          />{" "}
          <div className="modal-control-container">
            <label>{t("Name (optional)")} </label>
            <input
              type="text"
              className="form-control"
              value={contractName}
              autoComplete="off"
              onChange={onContractNameChange}
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
            <button
              disabled={submitDisabled}
              onClick={onAddClicked}
              className="btn btn-primary mb-3"
            >
              {t("Add")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddMultisigModal;
