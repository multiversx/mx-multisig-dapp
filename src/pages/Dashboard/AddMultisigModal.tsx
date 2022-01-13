import React from "react";
import { Address } from "@elrondnetwork/erdjs";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { addContractToMultisigContractsList } from "../../apiCalls/multisigContractsCalls";
import { MultisigContractInfoType } from "../../types/multisigContracts";
import ProposeInputAddress from "../MultisigDetails/ProposeModal/ProposeInputAddress";

interface AddMultisigModalType {
  show: boolean;
  loading?: boolean;
  handleClose: () => void;
  setNewContracts: (contracts: MultisigContractInfoType[]) => void;
}

const AddMultisigModal = ({
  show,
  loading,
  handleClose,
  setNewContracts,
}: AddMultisigModalType) => {
  const { t } = useTranslation();

  const [address, setAddress] = React.useState(Address.Zero());
  const [submitDisabled, setSubmitDisabled] = React.useState(false);
  const [name, setName] = React.useState("");

  async function onAddressParamChange(newAddress: Address) {
    setAddress(newAddress);
  }
  async function onContractNameChange(e: any) {
    setName(e.target.value);
  }
  async function onAddClicked() {
    const contractAddress = address.bech32();
    const newContracts = await addContractToMultisigContractsList({
      address: contractAddress,
      name,
    });
    setNewContracts(newContracts);
    handleClose();
  }

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
            disabled={loading}
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={onAddressParamChange}
          />{" "}
          <div className="modal-control-container">
            <label>{t("Name (optional)")} </label>
            <input
              type="text"
              disabled={loading}
              className="form-control"
              value={name}
              autoComplete="off"
              onChange={onContractNameChange}
            />
          </div>
          <div className="modal-action-btns">
            <button
              onClick={handleClose}
              disabled={loading}
              className="btn btn-primary btn-light "
            >
              <FontAwesomeIcon icon={faTimes} />
              {t("Cancel")}
            </button>
            <button
              disabled={submitDisabled || loading}
              onClick={onAddClicked}
              className="btn btn-primary mb-3"
            >
              {loading && (
                <div className="spinner-border " role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              {t("Add")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddMultisigModal;
