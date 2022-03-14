import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@react/modal";

export default function ConfirmationModal(props) {
  const getActionButtons = () => {
    return (
      <>
        <button
          className="btn btn-primary row-action-button"
          onClick={() => {
            props.dangerActionFunction();
            props.toggleShowModal();
          }}
        >
          {props.dangerActionButtonText}
        </button>
        <button
          className="btn btn-danger row-action-button"
          onClick={() => props.toggleShowModal()}
        >
          Cancel
        </button>
      </>
    );
  };

  return (
    <>
      {props.showModal && (
        <>
          <Modal
            visible={props.showModal}
            onVisibilityToggle={props.toggleShowModal}
            placement="center"
          >
            <ModalHeader onDismissButt onClick={props.toggleShowModal}>
              {props.header}
            </ModalHeader>
            <ModalBody>
              <p>{props.confirmationText}</p>
            </ModalBody>
            <ModalFooter className="modal-footer">
              {getActionButtons()}
            </ModalFooter>
          </Modal>
        </>
      )}
    </>
  );
}
