import React from "react";
import { faTimes, faCheck } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { gasLimit as defaultGasLimit, maxGasLimit } from "config";
import { useMultisigContract } from "contracts/MultisigContract";
import {
  SelectedActionToPerform,
  setSelectedPerformedAction,
} from "redux/slices/modalsSlice";
import { MultisigActionType } from "types/MultisigActionType";

const gasLimits = {
  [MultisigActionType.Nothing]: 60000000,
  [MultisigActionType.AddBoardMember]: 60000001,
  [MultisigActionType.AddProposer]: 600000002,
  [MultisigActionType.RemoveUser]: 60000003,
  [MultisigActionType.SCDeploy]: 120000004,
  [MultisigActionType.SendEgld]: 60000005,
  [MultisigActionType.ChangeQuorum]: 60000006,
  [MultisigActionType.SCCall]: 120000007,
};

interface PerformActionModalPropsType {
  selectedAction: SelectedActionToPerform;
}

const PerformActionModal = ({
  selectedAction,
}: PerformActionModalPropsType) => {
  const gasLimit =
    selectedAction?.actionType != null
      ? gasLimits[selectedAction.actionType] ?? defaultGasLimit
      : defaultGasLimit;
  const [selectedGasLimit, setSelectedGasLimit] = React.useState(gasLimit);
  const [error, setError] = React.useState<string | null>(null);
  const { mutatePerformAction } = useMultisigContract();
  const dispatch = useDispatch();
  if (selectedAction == null) {
    return null;
  }

  const handleClose = () => {
    dispatch(setSelectedPerformedAction(null));
  };

  const onPerformAction = () => {
    const isGasLimitValid = validateGasLimit();
    if (isGasLimitValid) {
      mutatePerformAction(selectedAction.id, selectedGasLimit);
      handleClose();
    }
  };

  const handleChangeGasLimit = (e: any) => {
    const newValue = Number(e.target.value);
    if (Number.isNaN(newValue)) {
      setError("Invalid number");
      return false;
    }
    setError(null);
    setSelectedGasLimit(newValue);
  };

  const validateGasLimit = () => {
    if (selectedGasLimit < gasLimit) {
      setError(`Gas limit must be greater or equal to ${gasLimit}`);
      setSelectedGasLimit(gasLimit);
      return false;
    }
    if (selectedGasLimit > maxGasLimit) {
      setError(`Gas limit must be lower or equal to ${maxGasLimit}`);
      setSelectedGasLimit(maxGasLimit);

      return false;
    }
    return true;
  };

  if (selectedAction == null) {
    return null;
  }

  return (
    <Modal
      show
      size="lg"
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body">
          <div className="modal-control-container">
            <p className="h3 mb-spacer text-center">Perform</p>
            <div className="group-center ">
              <label>Select gas limit:</label>
              <Form.Control
                className="form-control"
                value={selectedGasLimit}
                autoComplete="off"
                isInvalid={error != null}
                onChange={handleChangeGasLimit}
              />
              {error != null && (
                <Form.Control.Feedback type={"invalid"}>
                  {error}
                </Form.Control.Feedback>
              )}
            </div>
          </div>
          <div>
            <div className="modal-action-btns">
              <button
                onClick={handleClose}
                className="btn btn-primary btn-light "
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>

              <button
                onClick={onPerformAction}
                disabled={error != null}
                className="btn btn-primary"
              >
                <FontAwesomeIcon icon={faCheck} />
                Perform
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PerformActionModal;
