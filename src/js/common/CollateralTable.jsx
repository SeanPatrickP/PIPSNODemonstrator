import React, { useState, useEffect } from "react";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";
import BaseDataGrid from "./BaseDataGrid";
import { useStringChoices } from "./StringChoicesContext";
import { numberCellClassRules, StringChoicesCell } from "./BasePIPGridHelper";
import {
  SUCCESS,
  TEXT_INPUT,
  DOUBLE_INPUT,
  STRING_CHOICES_SELECTOR_INPUT,
  COLLAT_TBL_CT,
  COLLAT_ROW_CT,
} from "./constants";
import { numberValidation } from "./InputHelper";

export default function CollateralTable(props) {
  const [stringChoices, setStringChoices] = useState({});
  const [ready, setReady] = useState(false);

  useStringChoices({ __type: COLLAT_TBL_CT }, [], ["cml"], setStringChoices);

  const rowSchema = {
    cml: "",
    "price multiplier": 1,
    "added diff erentials": 0,
    "product name": "",
    __type: COLLAT_ROW_CT,
  };

  const rowSchemaTypes = {
    cml: STRING_CHOICES_SELECTOR_INPUT,
    "price multiplier": DOUBLE_INPUT,
    "added differentials": DOUBLE_INPUT,
    "product name": TEXT_INPUT,
  };

  const frameworkComponents = {
    StringChoicesCell: StringChoicesCell,
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const validationDefs = {
    "price multiplier": numberValidation,
    "added differentials": numberValidation,
  };

  const getColumnDefs = () => [
    {
      headerName: "CML",
      field: "cml",
      cellRenderer: "StringChoicesCell",
      editable: false,
      cellRendererParams: () => {
        return {
          stringChoices: stringChoices,
          field: "cml",
        };
      },
      cellStyle: { padding: 0 },
    },
    {
      headerName: "Price multiplier",
      field: "price multiplier",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["price multiplier"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
    {
      headerName: "Added differentials",
      field: "added differentials",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["price multiplier"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
    {
      headerName: "Product name",
      field: "product name",
    },
  ];

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
      {ready && (
        <BaseDataGrid
          rows={props.rows}
          rowSchema={rowSchema}
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
        />
      )}
    </>
  );
}
