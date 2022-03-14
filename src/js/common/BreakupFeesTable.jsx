import React from "react";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";
import {
  BREAKUP_KNOT_CT,
  DOUBLE_INPUT,
  DATE,
  DATE_KEY,
  STRING_CHOICES_SELECTOR_INPUT,
} from "./constants";
import { numberValidation } from "./InputHelper";
import Date from "./Date";
import { CellDropDownList } from "./BasePIPGridHelper";
import { numberCellClassRules } from "./BasePIPGridHelper";
import BaseDataGrid from "./BaseDataGrid";

export default function BreakupFeesTable(props) {
  const rowSchema = {
    __type: BREAKUP_KNOT_CT,
    "knot date": {
      [DATE_KEY]: "",
    },
    "interpolation rule": 2,
    "fee spread": 0,
  };

  const rowSchemaTypes = {
    "knot date": DATE,
    "interpolation rule": STRING_CHOICES_SELECTOR_INPUT,
    "fee spread": DOUBLE_INPUT,
  };

  const frameworkComponents = {
    Date: Date,
    CellDropDownList: CellDropDownList,
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const interpolationRuleChoices = {
    "Reduces Ratably Until The Next Date": 2,
    "Remains Constant Until The Next Date": 8,
  };

  const validationDefs = {
    "fee spread": numberValidation,
  };

  const columnDefs = [
    {
      headerName: "Knot date",
      field: "knot date",
      cellRenderer: "Date",
      editable: false,

      cellRendererParams: () => {
        return { cellDate: true, field: "knot date" };
      },
      cellStyle: { padding: 0 },
    },
    {
      headerName: "Interpolation rule",
      field: "interpolation rule",
      cellRenderer: "CellDropDownList",
      editable: false,
      cellRendererParams: () => {
        return {
          field: "interpolation rule",

          choices: Object.keys(interpolationRuleChoices),
          customValueSetter: setInterpolationRule,
        };
      },
      cellStyle: { padding: 0 },
      valueGetter: (params) => {
        return getInterpolationRuleById(params.data("interpolation rule"));
      },
    },
    {
      headerName: "Fee spread",
      field: "fee spread",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["fee spread"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
  ];

  const getInterpolationRuleById = (id) => {
    const byId = {};

    for (const [key, value] of Object.entries(interpolationRuleChoices)) {
      byId[value] = key;
    }

    if (id in byId) {
      return byId[id];
    }

    return "";
  };

  const setInterpolationRule = (value, rowIndex, field, rows) => {
    if (rows && rows[rowIndex] && field) {
      let updatedBreakupFees = rows[rowIndex];
      let updatedRows = rows;

      updatedBreakupFees[field] = interpolationRuleChoices[value];

      updatedRows[rowIndex] = updatedBreakupFees;

      return updatedRows;
    }
  };

  return (
    <BaseDataGrid
      rows={props.rows}
      rowSchema={rowSchema}
      rowSchemaTypes={rowSchemaTypes}
      dispatch={props.dispatch}
      path={props.path}
      field={props.fieId}
      columnDefs={columnDefs}
      frameworkComponents={frameworkComponents}
      validationDefs={validationDefs}
      id={props.id}
      gridName={props.gridName}
      gridClass={props.gridClass}
      rowClass={props.rowClass}
    />
  );
}
