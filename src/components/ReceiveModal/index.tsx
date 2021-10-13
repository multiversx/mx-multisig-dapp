import React from "react";
import QrCode from "qrcode.react";
import { Modal } from "react-bootstrap";
import CopyButton from "../CopyButton";
import ExplorerLink from "../ExplorerLink";
import { faQrcode } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ReceiveModal = ({ address }: { address?: string }) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (address == null) {
    return null;
  }

  return (
    <>
      <button onClick={handleOpenModal} className="btn btn-primary">
        <span>
          <FontAwesomeIcon icon={faQrcode} />
        </span>
        Receive
      </button>
      <Modal
        show={showModal}
        size="lg"
        onHide={handleCloseModal}
        className="modal-container"
        animation={false}
        centered
      >
        <div className="card">
          <div className="card-body text-center receive">
            <p className="h3 mb-spacer" data-testid="delegateTitle">
              Receive
            </p>

            <QrCode value={address} size={256} />
            <div
              className="h6 mb-spacer copy-address"
              data-testid="delegateSubTitle"
            >
              <p> {address} </p>
              <span className={""}>
                <CopyButton text={address} />
                {/* <ExplorerLink page={`accounts/${address}`} className="ml-2" /> */}
              </span>
            </div>
            <div className="modal-action-btns">
              <button onClick={handleCloseModal} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReceiveModal;
