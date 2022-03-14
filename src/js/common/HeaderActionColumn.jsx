import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faMinusCircle,
  faBackspace,
  faCopy,
  faCog,
  faComments,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import InventoryPeriodSettingsComponent from "./InventoryPeriodSettingsComponent";
import { changeHandlerBasic } from "./useDeepObject";
import { cloneDeep } from "lodash";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@react/modal";
import ConfirmationModal from "./ConfirmationModal";

export default function HeaderActionColumn(props) {
  const [selectedSection, setSelectedSection] = useState(props.selectedSection);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const toggleShowCommentsModal = () => {
    setShowCommentsModal(!showCommentsModal);
  };

  const toggleShowConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const toggleShowSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const copyItem = () => {
    let clone = {};

    if (props.customClone) {
      clone = props.customClone(props.contents[props.index]);
    } else {
      clone = cloneDeep(props.contents[props.index]);
    }

    props.contents.push(clone);
    changeHandlerBasic(
      props.dispatch,
      props.path,
      props.fieldName,
      props.contents
    );
  };

  const deleteItem = () => {
    let contents = props.contents;

    if (props.customDelete) {
      contents = props.customDelete(props.contents, props.index);
    } else {
      contents.splice(props.index, 1);
    }
    if (props.filteredItems[props.index].expanded) {
      expandCollapseItem();
    }

    changeHandlerBasic(props.dispatch, props.path, props.fieldName, contents);
  };

  const collapseItem = () => {
    props.filteredItems[props.index].expanded = false;
    props.setFilteredItems(cloneDeep(props.filteredItems));
  };

  const expandCollapseItem = () => {
    if (props.filteredItems[props.index].expanded) {
      return collapseItem();
    } else {
      props.filteredItems[props.index].expanded = true;
    }

    props.setFilteredItems(cloneDeep(props.filteredItems));
  };

  const getExpandCollapseIcon = () => {
    const expanded = props.filteredItems[props.index].expanded;
    if (expanded) {
      return faMinusCircle;
    } else {
      return faPlusCircle;
    }
  };

  const getExpandCollapseIconTooltip = () => {
    const expanded = props.filteredItems[props.index].expanded;
    if (expanded) {
      return "Collapse section";
    } else {
      return "Expand section";
    }
  };

  const getCommentsModalActionButtons = () => {
    return (
      <>
        <button
          className="btn btn-primary row-action-button"
          onClick={() => {
            changeHandlerBasic(
              props.dispatch,
              props.commentPath,
              "comment",
              document.getElementById("comments-textarea").value
            );
            toggleShowCommentsModal();
          }}
        >
          Save comments
        </button>
        <button
          className="btn btn-danger row-action-button"
          onClick={() => toggleShowCommentsModal()}
        >
          Cancel
        </button>
      </>
    );
  };

  useEffect(() => {
    if (props.disabled && props.filteredItems[props.index].expanded) {
      collapseItem();
    }
  }, [props.disabled]);

  useEffect(() => {
    if (props.selectedSection !== selectedSection) {
      setSelectedSection(props.selectedSection);
    }
  }, [props.selectedSection]);

  return (
    <>
      {showCommentsModal && (
        <>
          <Modal
            visible={showCommentsModal}
            onVisibilityToggle={toggleShowCommentsModal}
            placement="center"
          >
            <ModalHeader onDismissButtonClick={toggleShowCommentsModal}>
              {" "}
              Comments
            </ModalHeader>
            <ModalBody>
              <textarea
                id="comments-textarea"
                className="form-control"
                style={{ resize: "vertical", height: "100px" }}
                defaultValue={props.contents[props.index]["comment"]}
              />
            </ModalBody>
            <ModalFooter className="modal-footer">
              {getCommentsModalActionButtons()}
            </ModalFooter>
          </Modal>
        </>
      )}
      <ConfirmationModal
        showModal={showConfirmationModal}
        toggleShowModal={toggleShowConfirmationModal}
        dangerActionFunction={deleteItem}
        dangerActionButtonText="Delete section"
        header="Confirm delete section"
        confirmationText="Please note, this action is not reversible and the section will be permanently deleted."
      />
      <div className="col-sm-12 collapsible-ct">
        <button
          className="small-action-button secondary-button collapsible-ct-action"
          onClick={expandCollapseItem}
          disabled={props.disabled}
          title={getExpandCollapseIconTooltip()}
        >
          <FontAwesomeIcon
            icon={getExpandCollapseIcon()}
            className="button-icon"
          />
        </button>
        {props.disabled &&
          props.disabledTooltip &&
          props.disabledTooltip.length && (
            <button
              className="small-action-button small-action-button-tooltip collapsible-ct-action"
              title={props.disabledTooltip}
            >
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="button-icon"
              />
            </button>
          )}
        {!props.hideActionButtons && (
          <>
            <button
              className="small-action-button collapsible-ct-action float-right"
              onClick={toggleShowConfirmationModal}
              title="Delete section"
            >
              <FontAwesomeIcon icon={faBackspace} className="button-icon" />
            </button>

            {props.copyEnabled && (
              <button
                className="small-action-button collapsible-ct-action secondary-button float-right"
                onClick={copyItem}
                title="Copy section"
              >
                <FontAwesomeIcon icon={faCopy} className="button-icon" />
              </button>
            )}
          </>
        )}
        {props.showPeriodSettings && (
          <>
            <InventoryPeriodSettingsComponent
              dispatch={props.dispatch}
              contents={props.contents[props.index]}
              path={[...props.path, "inventory period cts", props.index]}
              showSettingsModal={showSettingsModal}
              toggleShowSettingsModal={toggleShowSettingsModal}
              selectedSection={props.selectedSection}
              dealInfo={props.dealInfo}
              inventoryPeriodName={props.inventoryPeriodName}
            />
            <button
              className="small-action-button collapsible-ct-action secondary-button float-right"
              onClick={toggleShowSettingsModal}
              title="Open settings for section"
            >
              <FontAwesomeIcon icon={faCog} className="button-icon" />
            </button>
          </>
        )}
        {props.showCommentButton && props.commentPath && (
          <button
            className="small-action-button collapsible-ct-action secondary-button float-right"
            onClick={toggleShowCommentsModal}
            title="Show section comments"
          >
            <FontAwesomeIcon icon={faComments} className="button-icon" />
          </button>
        )}
        <h2 className="collapsible-ct-action">{props.itemName}</h2>
      </div>
    </>
  );
}
