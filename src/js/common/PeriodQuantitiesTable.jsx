import React from "react";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";
import Date from "./Date";
import BaseDataGrid from "./BaseDataGrid";
import {
  DATE_INTERVAL_TYPE,
  DOUBLE_INPUT,
  FUNDING,
  INV_QUANTITY_CT,
  FIRST_MONTH_START_DATE,
  LAST_MONTH_END_DATE,
  DATE_INTERVAL_START_DATE_LONG,
  DATE_INTERVAL_END_DATE_LONG,
  RISK,
  DATE_KEY,
  STRING_CHOICES_SELECTOR_INPUT,
} from "./constants";
import { numberValidation } from "./InputHelper";
import { CellDropDownList, setNewValueForNestedRow } from "./BasePIPGridHelper";
import { numberCellClassRules } from "./BasePIPGridHelper";
import { cloneDeep } from "lodash";

export default function PeriodQuantitiesTable(props) {
  const getDateInterval = () => {
    if (
      props.dealInfo &&
      props.dealInfo[FIRST_MONTH_START_DATE.toLowerCase()] &&
      props.deallnfo[LAST_MONTH_END_DATE.toLowerCase()]
    ) {
      return {
        __type: DATE_INTERVAL_TYPE,
        "start date": props.dealInfo[FIRST_MONTH_START_DATE.toLowerCase()],
        "end date": props.dealInfo[LAST_MONTH_END_DATE.toLowerCase()],
      };
    }

    return {
      __type: DATE_INTERVAL_TYPE,
      "start date": {
        [DATE_KEY]: DATE_INTERVAL_START_DATE_LONG,
      },
      "end date": {
        [DATE_KEY]: DATE_INTERVAL_END_DATE_LONG,
      },
    };
  };

  const rowSchema = {
    __type: INV_QUANTITY_CT,
    "quantity period": cloneDeep(getDateInterval()),
    "max quantity": 0,
    "min quantity": 0,
    application: FUNDING,
  };

  const rowSchemaTypes = {
    "start date": DATE_INTERVAL_TYPE,
    "end date": DATE_INTERVAL_TYPE,
    "max quantity": DOUBLE_INPUT,
    "min quantity": DOUBLE_INPUT,
    application: STRING_CHOICES_SELECTOR_INPUT,
  };

  const frameworkComponents = {
    Date: Date,
    CellDropDownList: CellDropDownList,
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const validationDefs = {
    "max quantity": numberValidation,
    "min quantity": numberValidation,
  };

  const columnDefs = [
    {
      headerName: "Start date",
      field: "start date",
      cellRenderer: "Date",
      editable: false,
      cellRendererParams: () => {
        return {
          cellDate: true,
          field: "start date",
          customValueSetter: setPeriodDates,
        };
      },
      cellStyle: { padding: 0 },
      valueGetter: (params) => {
        return params.data["quantity period"]["start date"];
      },
    },
    {
      headerName: "End date",
      field: "end date",
      cellRenderer: "Date",
      editable: false,
      cellRendererParams: () => {
        return {
          cellDate: true,
          field: "end date",
          customValueSetter: setPeriodDates,
        };
      },
      cellStyle: { padding: 0 },
      valueGetter: (params) => {
        return params.data["quantity period"]["end date"];
      },
    },
    {
      headerName: "Min quantity",
      field: "min quantity",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["min quantity"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
    {
      headerName: "Max quantity",
      field: "max quantity",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["max quantity"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
    {
      headerName: "Application",
      field: "application",
      cellRenderer: "CellDropDownList",
      editable: false,
      cellRendererParams: () => {
        return {
          field: "application",
          choices: [FUNDING, RISK],
        };
      },
      cellStyle: { padding: 0 },
    },
  ];

  const copyRowForAlternativeApplication = (
    rows,
    selectedRows,
    processRowsUpdateFunction,
    onRowSelectionChangedFunction,
    dynamicButtonStates
  ) => {
    let newRows = [];
    let copyRows = [];
    let selected = [];

    selectedRows.forEach((row) => {
      selected.push(row.rowIndex);
    });

    for (let index = 0; index < rows.length; index++) {
      if (
        selected.includes(index) &&
        rows[index]["application"] &&
        rows[index]["application"].length
      ) {
        const clone = cloneDeep(rows[index]);
        clone["application"] =
          clone["application"] === FUNDING ? RISK : FUNDING;

        copyRows.push(clone);
      }
      newRows.push(rows[index]);
    }

    processRowsUpdateFunction(newRows.concat(copyRows));

    onRowSelectionChangedFunction([], dynamicButtonStates);
  };

  return (
    <BaseDataGrid
      rows={props.rows}
      rowSchema={rowSchema}
      rowSchemaTypes={rowSchemaTypes}
      dateIntervalKey="quantity period"
      dispatch={props.dispatch}
      path={props.path}
      field={props.field}
      columnDefs={columnDefs}
      frameworkComponents={frameworkComponents}
      validationDefs={validationDefs}
      id={props.id}
      gridName={props.gridName}
      gridClass={props.gridClass}
      rowClass={props.rowClass}
      selectedProductIndex={props.selectedProductIndex}
      bespokeCopyRowText="for other application"
      bespokeCopyRowFunction={copyRowForAlternativeApplication}
    />
  );
}

export function setPeriodDates(value, rowIndex, field, rows) {
  return setNewValueForNestedRow(
    value,
    rowIndex,
    field,
    rows,
    "quantity period"
  );
}
