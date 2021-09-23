import React from "react";
import { faCheck } from "@fortawesome/pro-regular-svg-icons/faCheck";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PageState from "components/PageState";
import { txSubmittedModalSelector } from "redux/selectors/modalsSelector";
import { clearTxSubmittedModal } from "../../redux/slices/modalsSlice";

const TxSubmittedModal = () => {
  const txSubmittedModal = useSelector(txSubmittedModalSelector);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (txSubmittedModal?.sessionId !== "") {
      setShowModal(true);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hideModal = () => {
    dispatch(clearTxSubmittedModal());
    setShowModal(false);
  };

  return (
    <>
      {txSubmittedModal != null && showModal && (
        <Modal
          show={showModal}
          backdrop={true}
          onHide={hideModal}
          className="modal-container"
          animation={false}
          centered
        >
          <div className="card w-100 tx-sent-modal">
            <PageState
              icon={faCheck}
              iconClass="text-primary"
              iconBgClass="p-4 rounded-bg-circle"
              iconSize="4x"
              title={txSubmittedModal.submittedMessage}
              description="Please allow a few moments for the transactions to be processed"
              action={
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Done
                </button>
              }
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default TxSubmittedModal;
