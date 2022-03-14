import React, { useState, useEffect } from "react";
import BaseDataGrid from "./BaseDataGrid";
import { StringChoicesCell } from "./BasePIPGridHelper";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";
import { useStringChoices } from "./StringChoicesContext";
import { numberCellClassRules } from "./BasePIPGridHelper";
import {
  DOUBLE_INPUT,
  SETTLEMENT_TIERS_CT,
  STRING_CHOICES_SELECTOR_INPUT,
  SUCCESS,
  TEXT_INPUT,
} from "./constants";
import { numberValidation } from "./InputHelper";

export default function SettlementTiersTable(props) {
  const [stringChoices, setStringChoices] = useState({});
  const [ready, setReady] = useState(false);

  useStringChoices(
    { __type: SETTLEMENT_TIERS_CT },
    [],
    ["avg type", "cutoff time date"],
    setStringChoices
  );

  const rowSchema = {
    "avg type": "",
    "cutoff time date": "",
    "cutoff time hour": 0,
    "cutoff time min": 0,
    "cutoff time zone": "",
    weight: 1,
    __type: SETTLEMENT_TIERS_CT,
  };

  const rowSchemaTypes = {
    "avg type": STRING_CHOICES_SELECTOR_INPUT,
    "cutoff time date": STRING_CHOICES_SELECTOR_INPUT,
    "cutoff time hour": DOUBLE_INPUT,
    "cutoff time min": DOUBLE_INPUT,
    "cutoff time zone": TEXT_INPUT,
    weight: DOUBLE_INPUT,
  };

  const frameworkComponents = {
    StringChoicesCell: StringChoicesCell,
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const validationDefs = {
    "cutoff time hour": numberValidation,
    "cutoff time min": numberValidation,
    weight: numberValidation,
  };

  const getColumnDefs = () => [
    {
      headerName: "Averaging type",
      field: "avg type",
      cellRenderer: "StringChoicesCell",
      editable: false,
      cellRendererParams: () => {
        return {
          stringChoices: stringChoices,
          field: "avg type",
        };
      },
      cellStyle: { padding: 0 },
    },
    {
      headerName: "Cutoff date",
      field: "cutoff time date",
      cellRenderer: "StringChoicesCell",
      editable: false,
      cellRendererParams: () => {
        return {
          stringChoices: stringChoices,
          field: "cutoff time date",
        };
      },
      cellStyle: { padding: 0 },
    },
    {
      headerName: "Cutoff time hour",
      field: "cutoff time hour",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["cutoff time hour"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
    {
      headerName: "Cutoff time minute",
      field: "cutoff time min",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["cutoff time min"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
    {
      headerName: "Cutoff time zone",
      field: "cutoff time zone",
    },
    {
      headerName: "Weight",
      field: "weight",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["weight"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
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
          itemCount={props.feesLength}
        />
      )}
    </>
  );
}
