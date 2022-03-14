import React, { useState } from "react";
import BulkFieldsInput from "./BulkFieldsInput";
import { Modal, ModalHeader, ModalBody } from "@react/modal";
import { useStringChoices } from "../common/StringChoicesContext";
import { INV_PX_AVG_CT, STRING_CHOICES_SELECTOR_INPUT } from "./constants";
import { setNewValueForNestedRow } from "./BasePIPGridHelper";
import StartEndDate from "./StartEndDate";

export default function CellCTModalAveraging(props) {
  const [showModal, setShowModal] = useState(false);

  const stringChoices = useStringChoices(
    { __type: INV_PX_AVG_CT },
    [],
    ["averaging days type", "averaging type", "fixing event"]
  );

  const bulkFieldInputs = [
    {
      title: "Days Type",
      fieldPath: "averaging days type ",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Type",
      fieldPath: "averaging type",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Fixing Event",
      fieldPath: "fixing event",
      type: STRING_CHOICES_SELECTOR_INPUT,
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
          Averaging
        </div>
      </a>
      <Modal
        visible={showModal}
        onVisibilityToggle={toggleShowModal}
        placement="center"
      >
        <ModalHeader onDismissButtonClick={toggleShowModal}>
          {" "}
          Averaging
        </ModalHeader>
        <ModalBody>
          {
            <>
              <BulkFieldsInput
                fieldNames={bulkFieldInputs}
                values={props.data.averaging}
                dispatch={props.dispatch}
                stringChoices={stringChoices}
                setter={updateValue}
              />
              <StartEndDate
                value={props.data.averaging["date interval"]}
                dispatch={props.dispatch}
                path={props.path}
                field="date interval"
                editable={true}
                setter={updateValue}
              />
            </>
          }
        </ModalBody>
      </Modal>
    </div>
  );
}
