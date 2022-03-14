import React, { useEffect, useState, useRef, useContext } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@react/modal";
import { validateEventOnRows } from "./ValidationToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
import { getTableOptions, onRowSelectionChanged } from "./BasePIPGridHelper";
import { DataGrid } from "@react/datagrid";
import { changeHandlerBasic } from "./useDeepObject";
import { cloneDeep } from "lodash";
import {
  CANNOT_COPY,
  CHECKBOX,
  DOUBLE_INPUT,
  DATE,
  STRING_CHOICES_SELECTOR_INPUT,
  DATE_KEY,
  TRUE,
  VALUE,
  INDEX,
  FIELD,
  DATE_INTERVAL_TYPE,
} from "./constants";
import { formatToDate, parseDouble, resolveModalClass } from "./inputHelper";
import { AlertContext } from "./AlertContext";
import ConfirmationModal from "./ConfirmationModal";

export default function BaseDataGrid(props) {
  const [rowDeleteButtonText, setRowDeleteButtonText] = useState("Remove row");
  const [rowDeleteButtonEnabled, setRowDeleteButtonEnabled] = useState(false);
  const [rowCopyButtonText, setRowCopyButtonText] = useState("Copy row");
  const [rowCopyButtonEnabled, setRowCopyButtonEnabled] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showEnlargedGridModal, setShowEnlargedGridModal] = useState(false);
  const [customUpdater, setCustomUpdater] = useState({});
  const [itemCount, setItemCount] = useState(props.itemCount);

  const [setAlertMessage, setOnAlertShowCallback] = useContext(AlertContext);

  const gridApi = useRef(null);

  const dynamicButtonStates = [
    {
      setterText: setRowDeleteButtonText,
      pluralText: "Remove rows",
      singularText: "Remove row",
      setterEnabled: setRowDeleteButtonEnabled,
    },

    {
      setterText: setRowCopyButtonText,
      pluralText: "Copy rows",
      singularText: "Copy row",
      setterEnabled: setRowCopyButtonEnabled,
    },
  ];

  const toggleShowConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const toggleShowEnlargedGridModal = () => {
    onRowSelectionChanged([], dynamicButtonStates);
    setShowEnlargedGridModal(!showEnlargedGridModal);
  };

  const alertDismiss = () => {
    setAlertMessage("");
    setOnAlertShowCallback(null);
  };

  const timeoutAlert = () => {
    setTimeout(alertDismiss, 5000);
  };

  const formatPastedValueIfApplicable = (value, columnName) => {
    let parsedValue;
    let defaulted = false;

    switch (props.rowSchemaTypes[columnName]) {
      case DATE_INTERVAL_TYPE:
      case DATE: {
        parsedValue = formatToDate(value);
        if (parsedValue[DATE_KEY] === "") {
          defaulted = true;
        }
        break;
      }

      case DOUBLE_INPUT: {
        parsedValue = parseDouble(value);

        if (parsedValue === null || isNaN(parsedValue)) {
          parsedValue = props.rowSchema[columnName];
          defaulted = true;
        }
        break;
      }

      case CANNOT_COPY: {
        parsedValue = props.rowSchema[columnName];
        defaulted = true;
        break;
      }

      case CHECKBOX: {
        parsedValue = value.toLowerCase() === TRUE;
        break;
      }

      case STRING_CHOICES_SELECTOR_INPUT: {
        // Cannot copy and paste for this type of field currently
        parsedValue = props.rowSchema[columnName];
        defaulted = true;
        break;
      }

      default: {
        parsedValue = value;
        break;
      }
    }

    if (defaulted) {
      setAlertMessage(
        "Some values could not be pasted and have been defaulted if they could."
      );

      setOnAlertShowCallback(timeoutAlert);
    }

    return parsedValue;
  };

  const processPaste = (params) => {
    let currentRows = [];

    gridApi.current.forEachNode((node) => {
      currentRows.push(node.data);
    });

    if (params && params.data) {
      if (!params.data.length) {
        return;
      }

      if (
        params.data[params.data.length - 1][0] === "" &&
        params.data[params.data.length - 1].length === 1
      ) {
        params.data.splice(params.data.length - 1, 1);
      }

      const cellRanges = gridApi.current.getCellRanges();

      if (!cellRanges || cellRanges.length > 1) {
        return;
      }

      const focusedTopColumnNames = cellRanges[0].columns;

      const startRow = cellRanges[0].startRow.rowIndex;
      const endRow = cellRanges[0].endRow.rowIndex;
      let focusedTopRowIndex;

      if (startRow > endRow) {
        focusedTopRowIndex = endRow;
      } else {
        focusedTopRowIndex = startRow;
      }

      params.data.map((row) => {
        let focusedTopColumnIndex = 0;

        if (focusedTopRowIndex >= currentRows.length) {
          currentRows.push(cloneDeep(props.rowSchema));
        }

        let formattedValueToMerge = cloneDeep(currentRows[focusedTopRowIndex]);

        row.map((value) => {
          const focusedTopColumnName =
            focusedTopColumnNames[focusedTopColumnIndex].colDef.field;

          let formattedValue = formatPastedValueIfApplicable(
            value,
            focusedTopColumnName
          );

          if (
            props.rowSchemaTypes[focusedTopColumnName] === DATE_INTERVAL_TYPE &&
            props.dateIntervalKey &&
            props.dateIntervalKey.length
          ) {
            formattedValueToMerge[props.dateIntervalKey][focusedTopColumnName] =
              formattedValue;
          } else {
            formattedValueToMerge[focusedTopColumnName] = formattedValue;
          }

          focusedTopColumnIndex++;
        });

        currentRows[focusedTopRowIndex] = formattedValueToMerge;
        focusedTopRowIndex++;
      });
    }

    processRowsUpdate(currentRows);
  };

  const gridOptions = getTableOptions(props.columnDefs);

  const onGridReady = (params) => {
    gridApi.current = params.api;

    gridApi.current.sizeColumnsToFit();
    if (props.gridApi) {
      props.gridApi.current = params.api;
    }
  };

  const processRowEdit = (event) => {
    if (event.colDef.valueSetter) {
      return;
    }

    const field = event.colDef.field;
    const rowIndex = event.rowIndex;

    let inputValidationErrors = 0;

    let valueToUpdate = event.value;

    if (field in props.validationDefs) {
      inputValidationErrors = validateEventOnRows(
        event,
        props.validationDefs,
        inputValidationErrors
      );

      valueToUpdate = props.validationDefs[field].parserFunction(valueToUpdate);
    }

    if (inputValidationErrors === 0) {
      updateValue(valueToUpdate, rowIndex, field);
      gridApi.current.refreshCells();
    }
  };

  const updateValue = (value, rowIndex, field) => {
    if (rows && rows[rowIndex] && field) {
      rows[rowIndex][field] = value;
      processRowsUpdate(rows);
    }
  };

  const initRows = (currentRows) => {
    if (currentRows === undefined) {
      return [];
    }

    return currentRows;
  };

  const applyParserFromIfApplicable = (rowsToParse) => {
    if (props.filterRows) {
      return props.filterRows(rowsToParse);
    }

    if (props.parserFrom) {
      return props.parserFrom(rowsToParse);
    }

    return rowsToParse;
  };

  const applyParserToIfApplicable = (rowsToParse) => {
    if (props.parserTo) {
      return props.parserTo(rowsToParse);
    }

    return rowsToParse;
  };

  const processRowsUpdate = (rows) => {
    const parsed = applyParserToIfApplicable(rows);
    changeHandlerBasic(props.dispatch, props.path, props.field, parsed);

    setRows(rows);
  };

  const addRow = () => {
    let newRows = [];
    rows.forEach((row) => {
      newRows.push(row);
    });

    const newRow = cloneDeep(props.rowSchema);
    newRows.push(newRow);

    processRowsUpdate(newRows);
  };

  const removeRows = () => {
    const selectedRows = gridApi.current.getSelectedNodes();
    let newRows = [];

    let selected = [];
    selectedRows.forEach((row) => {
      selected.push(row.rowIndex);
    });

    for (let index = 0; index < rows.length; index++) {
      if (selected.includes(index)) {
        continue;
      }

      newRows.push(rows[index]);
    }

    processRowsUpdate(newRows);

    onRowSelectionChanged([], dynamicButtonStates);
  };

  const copyRows = () => {
    const selectedRows = gridApi.current.getSelectedNodes();
    let newRows = [];
    let copyRows = [];

    let selected = [];
    selectedRows.forEach((row) => {
      selected.push(row.rowIndex);
    });

    for (let index = 0; index < rows.length; index++) {
      if (selected.includes(index)) {
        const clone = cloneDeep(rows[index]);
        copyRows.push(clone);
      }

      newRows.push(rows[index]);
    }

    processRowsUpdate(newRows.concat(copyRows));

    onRowSelectionChanged([], dynamicButtonStates);
  };

  const processSortChange = () => {
    let sortedRowData = Array(gridApi.current.getDisplayedRowCount());

    gridApi.current.forEachNode((node) => {
      sortedRowData[node.rowIndex] = node.data;
    });

    processRowsUpdate(sortedRowData);
  };

  const getDataGrid = () => {
    return (
      <DataGrid
        id={props.id}
        rowData={rows}
        onRowSelected={() =>
          onRowSelectionChanged(
            gridApi.current.getSelectedRows(),
            dynamicButtonStates
          )
        }
        gridOptions={gridOptions}
        context={setCustomUpdater}
        frameworkComponents={props.frameworkComponents}
        onGridReady={onGridReady}
        tooltipShowDelay={0}
        enableRangeSelection={true}
        suppressRowClickSelection={true}
        onCellValueChanged={(event) => processRowEdit(event)}
        processDataFromClipboard={(params) => processPaste(params)}
        onGridSizeChanged={() => gridApi.current.sizeColumnsToFit()}
        onSortChanged={processSortChange}
      />
    );
  };

  const getActionButtons = () => {
    return (
      <>
        <button className="btn btn-primary row-action-button" onClick={addRow}>
          {" "}
          Add row
        </button>

        <button
          className="btn btn-danger row-action-button"
          onClick={toggleShowConfirmationModal}
          disabled={!rowDeleteButtonEnabled}
        >
          {rowDeleteButtonText}
        </button>

        <button
          className="btn btn-secondary row-action-button"
          onClick={copyRows}
          disabled={!rowCopyButtonEnabled}
        >
          {rowCopyButtonText}
        </button>

        {props.bespokeCopyRowText &&
          props.bespokeCopyRowText.length &&
          props.bespokeCopyRowFunction && (
            <button
              className="btn btn-secondary row-action-button"
              onClick={() =>
                props.bespokeCopyRowFunction(
                  rows,
                  gridApi.current.getSeIectedNodes(),
                  processRowsUpdate,
                  onRowSelectionChanged,
                  dynamicButtonStates
                )
              }
              disabled={!rowCopyButtonEnabled}
            >
              {`${rowCopyButtonText} ${props.bespokeCopyRowText}`}
            </button>
          )}
      </>
    );
  };

  const [rows, setRows] = useState(
    applyParserFromIfApplicable(initRows(props.rows))
  );

  useEffect(() => {
    if (
      customUpdater &&
      VALUE.toLowerCase() in customUpdater &&
      INDEX.toLowerCase() in customUpdater &&
      FIELD.toLowerCase() in customUpdater
    ) {
      if (customUpdater.customValueSetter) {
        const updatedRows = customUpdater["customValueSetter"](
          customUpdater.value,
          customUpdater.index,
          customUpdater.field,
          rows
        );

        processRowsUpdate(updatedRows);
      } else {
        updateValue(
          customUpdater.value,
          customUpdater.index,
          customUpdater.field
        );
      }

      setCustomUpdater({});

      onRowSelectionChanged([], dynamicButtonStates);
    }
  }, [customUpdater.value]);

  useEffect(() => {
    if (props.itemCount !== itemCount || props.copyTriggered) {
      setItemCount(props.itemCount);
      setRows(applyParserFromIfApplicable(initRows(props.rows)));
    }
  }, [props.itemCount, props.copyTriggered]);

  useEffect(() => {
    setRows(applyParserFromIfApplicable(initRows(props.rows)));
  }, [props.selectedProductIndex]);

  return (
    <>
      <ConfirmationModal
        showModal={showConfirmationModal}
        toggleShowModal={toggleShowConfirmationModal}
        dangerActionFunction={removeRows}
        dangerActionButtonText={rowDeleteButtonText}
        header={`Confirm ${rowDeleteButtonText.toLowerCase()}`}
        confirmationText="Please note, this action is not reversible and once deleted, cannot be restored."
      />
      {showEnlargedGridModal && (
        <Modal
          visible={showEnlargedGridModal}
          onVisibilityToggle={toggleShowEnlargedGridModal}
          placement="center"
          className="modal-container-large"
          onShow={resolveModalClass(
            showEnlargedGridModal,
            showConfirmationModal
          )}
        >
          <ModalHeader onDismissButtonClick={toggleShowEnlargedGridModal}>
            {props.gridName}
          </ModalHeader>

          <ModalBody>
            <div className="modal-table-container">
              <div className="col table-grid-column">{getDataGrid()}</div>
            </div>
          </ModalBody>

          <ModalFooter className="modal-footer">
            {getActionButtons()}
          </ModalFooter>
        </Modal>
      )}

      {!showEnlargedGridModal && (
        <>
          <div className={props.rowClass}>
            <div className="col-sm-3">{props.gridName}:</div>
            <div className={props.gridClass}>{getDataGrid()}</div>
            <button
              className="small-action-button"
              onClick={toggleShowEnlargedGridModal}
              title="Enlarge grid"
            >
              <FontAwesomeIcon icon={faSearchPlus} className="button-icon" />
            </button>

            {props.tooltip &&
              props.tooltip.length &&
              ((props.tooltipShowFunction && props.tooltipShowFunction(rows)) ||
                !props.tooltipShowFunction) && (
                <button
                  className="small-action-button small-action-button-tooltip"
                  title={props.tooltip}
                >
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="button-icon"
                  />
                </button>
              )}
          </div>

          <div className="row" key="table action buttons">
            <div className="col-sm-3" />

            <div className="col-sm-8 row-action-buttons">
              {getActionButtons()}
            </div>
          </div>
        </>
      )}
    </>
  );
}
