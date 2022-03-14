import React from "react";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";
import BaseDataGrid from "./BaseDataGrid";
import { numberCellClassRules, CheckBoxCell } from "./BasePIPGridHelper";
import {
  CANNOT_COPY,
  CHECKBOX,
  DOUBLE_INPUT,
  TEXT_INPUT,
  WATERFALL_ROW_CT,
} from "./constants";
import { numberValidation } from "./InputHelper";
import { changeHandlerBasic } from "./useDeepObject";

export default function WaterfallTable(props) {
  const rowSchemaTypes = {
    rank: DOUBLE_INPUT,
    "product name": TEXT_INPUT,
    "is comingled": CHECKBOX,
    "require full volume": CHECKBOX,
    "adjust factor": DOUBLE_INPUT,
    "properties values": CANNOT_COPY,
  };

  const frameworkComponents = {
    CheckBoxCell: CheckBoxCell,
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const validationDefs = {
    rank: numberValidation,
    "adjust factor": numberValidation,
  };

  const getRowSchema = () => {
    let propertiesValues = [];

    if (props.propertyNames && props.propertyNames.length) {
      for (let index = 0; index < props.propertyNames.length; index++) {
        propertiesValues.push("");
      }
    }

    return {
      rank: 0,
      "product name": "",
      "is comingled": 0,
      "require full volume": 0,
      "adjust factor": 1,
      "properties values": propertiesValues,
      __type: WATERFALL_ROW_CT,
    };
  };

  const getColumnDefs = () => {
    let columnDefs = [
      {
        headerName: "Rank",
        field: "rank",
        tooltipComponent: "ValidationToolTipComponent",
        tooltipComponentParams: validationDefs["rank"],
        cellClassRules: numberCellClassRules,
        tooltipValueGetter: (params) => toolTipValueGetter(params),
      },
      {
        headerName: "Product name",
        field: "product name",
      },
      {
        headerName: "Is comingled",
        field: "is comingled",
        cellRenderer: "CheckBoxCell",
        editable: false,
        cellRendererParams: () => {
          return {
            field: "is comingled",
          };
        },
        cellStyle: {
          padding: 0,
        },
      },
      {
        headerName: "Require full volume",
        field: "require full volume",
        cellRenderer: "CheckBoxCell",
        editable: false,
        cellRendererParams: () => {
          return {
            field: "require full volume",
          };
        },
        cellStyle: { padding: 0 },
      },
      {
        headerName: "Adjust factor",
        field: "adjust factor",
        filter: "agNumberColumnFilter",
        tooltipComponent: "ValidationToolTipComponent",
        tooltipComponentParams: validationDefs["adjust factor"],
        cellClassRules: numberCellClassRules,
        tooltipValueGetter: (params) => toolTipValueGetter(params),
      },
    ];

    if (props.propertyNames && props.propertyNames.length) {
      props.propertyNames.map((propertyName, index) => {
        columnDefs.push({
          headerName: propertyName,
          field: "properties values",
          valueGetter: (params) => {
            return params.data["properties values"][index];
          },

          valueSetter: (params) => {
            let updatedValue = params.data["properties values"];
            updatedValue[index] = params.newValue;

            changeHandlerBasic(
              props.dispatch,
              [...props.path, props.field, params.node.rowIndex],
              "properties values",
              updatedValue
            );

            return true;
          },
        });
      });
    }

    return columnDefs;
  };

  props.columnDefsFunction.current = getColumnDefs;

  return (
    <BaseDataGrid
      rows={props.rows}
      rowSchema={getRowSchema()}
      rowSchemaTypes={rowSchemaTypes}
      dispatch={props.dispatch}
      path={props.path}
      field={props.field}
      columnDefs={getColumnDefs()}
      frameworkComponents={frameworkComponents}
      validationDefs={validationDefs}
      id={props.id}
      gridName={props.gridName}
      gridClass={props.gridClass}
      rowClass={props.rowClass}
      gridApi={props.gridApi}
    />
  );
}
