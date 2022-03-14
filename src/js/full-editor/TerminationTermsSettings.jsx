import React, { useState } from "react";
import BulkFieldsInput from "../common/BulkFieldsInput";
import { Modal, ModalHeader, ModalBody } from "@react/modal";
import {
  CHECKBOX,
  DATE_INPUT,
  TERMINATION_CT,
  TEXT_INPUT,
} from "../common/constants";
import OptionalCT from "../common/OptionalCT";
import BreakupFeesTable from "../common/BreakupFeesTable";
import TerminationDatesTable from "../common/TerminationDatesTable";

export default function TerminationTermsSettings(props) {
  const [showModal, setShowModal] = useState(false);
  const [hasTerminationCT, setHasTerminationCT] = useState(false);

  const baseTerminationCT = {
    __type: TERMINATION_CT,
  };

  const bulkFieldInputs = [
    {
      title: "Counterparty has termination option",
      fieldPath: "cpty has termination option",
      type: CHECKBOX,
    },
    {
      title: "First termination date",
      fieldPath: "first termination date",
      type: DATE_INPUT,
    },
    {
      title: "Termination date rule",
      fieldPath: "termination date rule",
      type: TEXT_INPUT,
    },
  ];

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <a href="#!">
        <div className="nav-link" onClick={toggleShowModal}>
          {" "}
          Termination terms
        </div>
      </a>
      {showModal && (
        <Modal
          visible={showModal}
          onVisibilityToggle={toggleShowModal}
          placement="center"
          className="modal-container-large"
        >
          <ModalHeader onDismissButtonClick={toggleShowModal}>
            <div className="settings-header-with-button">
              <header>Termination terms</header>
              <div className="settings-button">
                <OptionalCT
                  {...props}
                  baseCT={baseTerminationCT}
                  context={setHasTerminationCT}
                />
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="container">
              {hasTerminationCT && (
                <>
                  <BulkFieldsInput
                    fieldNames={bulkFieldInputs}
                    values={props.contents}
                    dispatch={props.dispatch}
                    path={props.path}
                  />
                  <BreakupFeesTable
                    id="breakup fees table"
                    rows={props.contents["breakup fee"]}
                    gridName="Breakup fees table"
                    rowClass="row table-grid"
                    gridClass="col-sm-8 table-grid-column"
                    field="breakup fee"
                    dispatch={props.dispatch}
                    path={props.path}
                  />
                  <TerminationDatesTable
                    id="termination dates fees table"
                    rows={props.contents["termination dates"]}
                    gridName="Termination dates table"
                    rowClass="row table-grid"
                    gridClass="col-sm-8 table-grid-column"
                    field="termination dates"
                    dispatch={props.dispatch}
                    path={props.path}
                  />
                </>
              )}
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}
