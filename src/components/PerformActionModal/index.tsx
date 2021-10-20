import React from "react";
import { Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { gasLimit, maxGasLimit } from "config";
import { useMultisigContract } from "contracts/MultisigContract";
import { selectedPerformedActionId } from "redux/selectors/modalsSelector";
import { setSelectedPerformedActionId } from "redux/slices/modalsSlice";
import { faTimes, faCheck } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PerformActionModal = () => {
  const selectedActionId = useSelector(selectedPerformedActionId);
  const [selectedGasLimit, setSelectedGasLimit] = React.useState(gasLimit);
  const [error, setError] = React.useState<string | null>(null);
  const { mutatePerformAction } = useMultisigContract();
  const dispatch = useDispatch();
  if (selectedActionId == null) {
    return null;
  }
  const handleClose = () => {
    dispatch(setSelectedPerformedActionId(null));
  };

  const onPerformAction = () => {
    mutatePerformAction(selectedActionId, selectedGasLimit);
    handleClose();
  };

  const handleChangeGasLimit = (e: any) => {
    const newValue = Number(e.target.value);
    if (newValue < gasLimit) {
      setError(`Gas limit must be greater or equal to ${gasLimit}`);
      setSelectedGasLimit(gasLimit);
      return;
    }
    if (newValue > maxGasLimit) {
      setError(`Gas limit must be lower or equal to ${maxGasLimit}`);
      setSelectedGasLimit(maxGasLimit);

      return;
    }
    setError(null);
    setSelectedGasLimit(newValue);
  };

  if (selectedActionId == null) {
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
                type="number"
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

              <button onClick={onPerformAction} className="btn btn-primary">
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
