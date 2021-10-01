import React from "react";
import QrCode from "qrcode.react";
import { Modal } from "react-bootstrap";
import CopyButton from "../CopyButton";
import ExplorerLink from "../ExplorerLink";

const ReceiveModal = ({ address }: { address?: string }) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (address == null) {
    return null;
  }

  return (
    <>
      <button onClick={handleOpenModal} className="btn btn-primary mb-3">
        Deposit
      </button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="modal-container"
        animation={false}
        centered
      >
        <div className="card">
          <div className="card-body p-spacer text-center">
            <p className="h6 " data-testid="delegateTitle">
              Receive
            </p>
            <p className="h6 mb-spacer" data-testid="delegateSubTitle">
              Here is the QR code and your wallet address.
            </p>
            <QrCode value={address} />
            <p className="h6 mb-spacer" data-testid="delegateSubTitle">
              {address}
              <div className={"mx-3"}>
                <CopyButton text={address} />
                <ExplorerLink page={`accounts/${address}`} />
              </div>
            </p>
            <button onClick={handleCloseModal} className="btn btn-primary mb-3">
              Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReceiveModal;
