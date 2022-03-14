import React from "react";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";
import BaseDataGrid from "./BaseDataGrid";
import Date from "./Date";
import {
  numberCellClassRules,
  parseFromCurve,
  parseToCurve,
} from "./BasePIPGridHelper";
import { DOUBLE_INPUT, DATE, DATE_KEY, VALUE } from "./constants";
import { numberValidation } from "./InputHelper";

export default function Curve(props) {
  const rowSchema = { date: { [DATE_KEY]: "" }, value: 0 };
  const rowSchemaTypes = { date: DATE, value: DOUBLE_INPUT };
  const frameworkComponents = {
    Date: Date,
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const validationDefs = { value: numberValidation };

  const columnDefs = [
    {
      headerName: "Date",
      field: "date",
      cellRenderer: "Date",
      editable: false,
      cellRendererParams: () => {
        return { cellDate: true, field: "date" };
      },
      cellStyle: { padding: 0 },
    },
    {
      headerName: VALUE,
      field: VALUE.toLowerCase(),
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs(VALUE.toLowerCase()),
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
  ];

  return (
    <BaseDataGrid
      rows={props.rows}
      rowSchema={rowSchema}
      rowSchemaTypes={rowSchemaTypes}
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
      parserFrom={parseFromCurve}
      parserTo={parseToCurve}
      itemCount={props.feesLength}
      tooltip={props.tooltip}
      tooltipShowFunction={props.tooltipShowFunction}
    />
  );
}
