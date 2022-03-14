import React, { useEffect, useState } from "react";
import { useStringChoices } from "../common/StringChoicesContext";
import { Modal, ModalHeader, ModalBody } from "@react/modal";
import {
  CHECKBOX,
  DOUBLE_INPUT,
  SELECTION_INPUT,
  SETTINGS_CT,
  STRING_CHOICES_SELECTOR_INPUT,
  SUCCESS,
  TEXT_INPUT,
} from "../common/constants";
import BulkFieldsInput from "../common/BulkFieldsInput";
import OptionalList from "../common/OptionalList";

export default function AdvancedSettings(props) {
  const [showModal, setShowModal] = useState(false);
  const [stringChoices, setStringChoices] = useState({});
  const [ready, setReady] = useState(false);

  useStringChoices(
    { __type: SETTINGS_CT },
    [],
    [
      "roll fixing payment term",
      "initial invoice days type",
      "interim invoice days type",
      "closing invoice days type",
    ],
    setStringChoices
  );

  const bulkFieldInputsActiveEventsAndStorage = [
    {
      title: "Active step in",
      fieldPath: "active step in",
      type: CHECKBOX,
    },
    {
      title: "Active step out",
      fieldPath: "active step out",
      type: CHECKBOX,
    },
    {
      title: "Active interim",
      fieldPath: "active interim",
      type: CHECKBOX,
    },
    {
      title: "Active storage",
      fieldPath: "active storage",
      type: CHECKBOX,
    },
    {
      title: "Always active physical",
      fieldPath: "always active physical",
      type: CHECKBOX,
    },
  ];

  const bulkFieldInputsSystem = [
    {
      title: "Use PIPT storage model",
      fieldPath: "use pipt storage model",
      type: CHECKBOX,
    },
    {
      title: "[OLD] Use PIPT flex storage model",
      fieldPath: "use pipt flex storage model",
      type: CHECKBOX,
    },
  ];

  const bulkFieldInputsRedZone = [
    {
      title: "Red zone fixing date",
      fieldPath: "red zone fixing date",
      type: TEXT_INPUT,
    },
  ];

  const bulkFieldInputsTargets = [
    {
      title: "Allow target above max",
      fieldPath: "allow target above max",
      type: CHECKBOX,
    },
    {
      title: "Allow target below min",
      fieldPath: "allow target below min",
      type: CHECKBOX,
    },
  ];

  const bulkFieldInputsRollFixingPayments = [
    {
      title: "Roll fixing payment term",
      fieldPath: "roll fixing payment term",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  const bulkFieldInputsTrueUpPayments = [
    {
      title: "Interim payment days",
      fieldPath: "interim payment day count",
      type: DOUBLE_INPUT,
    },
  ];

  const bulkFieldInputsInvoicePayments = [
    {
      title: "Initial invoice payment days",
      fieldPath: "initial invoice pay day count",
      type: DOUBLE_INPUT,
    },
    {
      title: "Interim invoice payment days",
      fieldPath: "interim invoice pay day count",
      type: DOUBLE_INPUT,
    },
    {
      title: "Closing invoice payment days",
      fieldPath: "closing invoice pay day count",
      type: DOUBLE_INPUT,
    },
    {
      title: "Initial invoice days type",
      fieldPath: "initial invoice days type",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Interim invoice days type",
      fieldPath: "interim invoice days type",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Closing invoice days type",
      fieldPath: "closing invoice days type",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  const bulkFieldInputsRevalOption = [
    {
      title: "GS has right to revalue inventory and adjust differentials",
      fieldPath: "reval option",
      type: CHECKBOX,
    },
  ];

  const bulkFieldInputsOther = [
    {
      title: "Document group",
      fieldPath: "document group",
      type: TEXT_INPUT,
    },
  ];

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };
  useEffect(() => {
    if (
      stringChoices.status &&
      stringChoices.status.toLowerCase() === SUCCESS
    ) {
      setReady(true);
    }
  }, [stringChoices.status]);

  return (
    <>
      <a href="#!">
        <div
          className="click-option-vertical-top nav-link"
          onClick={toggleShowModal}
        >
          Advanced settings
        </div>
      </a>
      {showModal && ready && (
        <Modal
          visible={showModal}
          onVisibilityToggle={toggleShowModal}
          placement="center"
          className="modal-container-large"
        >
          <ModalHeader onDismissButtonClick={toggleShowModal}>
            {" "}
            Advanced settings
          </ModalHeader>
          <ModalBody>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">
                  {" "}
                  Active events and storage
                </h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsActiveEventsAndStorage}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
              />
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">System</h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsSystem}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
              />
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">Targets</h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsTargets}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
              />
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">Red zone</h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsRedZone}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
                stringChoices={stringChoices}
              />
              <OptionalList
                dispatch={props.dispatch}
                currentList={props.contents["red zone products"]}
                path={props.path}
                fieldPath="red zone products"
                title="Red zone Products"
                input={SELECTION_INPUT}
                choices={props.allProductNames}
              />
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">Roll fixing payments</h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsRollFixingPayments}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
                stringChoices={stringChoices}
              />
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">True up payments</h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsTrueUpPayments}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
              />
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">Invoice payments</h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsInvoicePayments}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
                stringChoices={stringChoices}
              />
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">Reval option</h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsRevalOption}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
              />
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">Other</h1>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputsOther}
                values={props.contents}
                dispatch={props.dispatch}
                path={props.path}
              />
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}
