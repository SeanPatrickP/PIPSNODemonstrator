import React, { useState } from "react";
import BulkFieldsInput from "./BulkFieldsInput";
import { Modal, ModalHeader, ModalBody } from "@react/modal";
import { DOUBLE_INPUT } from "./constants";
import { setNewValueForNestedRow } from "./BasePIPGridHelper";

export default function CellCTModalRounding(props) {
  const [showModal, setShowModal] = useState(false);

  const bulkFieldInputs = [
    {
      title: "Precision",
      fieldPath: "precision",
      type: DOUBLE_INPUT,
    },
    {
      title: "Index Native Precision",
      fieldPath: "index native unit precision",
      type: DOUBLE_INPUT,
    },
  ];

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  const setNewChoice = (value, rowIndex, field, rows) => {
    return setNewValueForNestedRow(value, rowIndex, field, rows, props.field);
  };

  const updateValue = (value, field) => {
    return props.context({
      value: value,
      index: props.node.rowIndex,
      field: field,
      customValueSetter: setNewChoice,
    });
  };

  return (
    <div className="container">
      <a href="#!">
        <div className="cell-click-text" onClick={toggleShowModal}>
          {" "}
          Rounding
        </div>
      </a>
      <Modal
        visible={showModal}
        onVisibilityToggle={toggleShowModal}
        placement="center"
      >
        <ModalHeader onDismissButtonClick={toggleShowModal}>
          {" "}
          Rounding
        </ModalHeader>
        <ModalBody>
          <BulkFieldsInput
            fieldNames={bulkFieldInputs}
            values={props.data[props.field]}
            dispatch={props.dispatch}
            setter={updateValue}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
