import React, { useState, useEffect } from "react";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";
import BaseDataGrid from "./BaseDataGrid";
import IndexCellSelectorModal from "./IndexCellSelectorModal";
import CellCTModalAveraging from "./CellCTModalAveraging";
import { StringChoicesCell } from "./BasePIPGridHelper";
import { useStringChoices } from "./StringChoicesContext";
import { numberCellClassRules } from "./BasePIPGridHelper";
import {
  CANNOT_COPY,
  DOUBLE_INPUT,
  INDEX,
  INV_PX_CMP_CT,
  STRING_CHOICES_SELECTOR_INPUT,
  SUCCESS,
  TEXT_INPUT,
} from "./constants";
import {
  getNewInventoryPeriodPriceComponentsCTs,
  indexSort,
  numberValidation,
} from "./InputHelper";
import CellCTModalRounding from "./CellCTModalRounding";

export default function PriceComponentsTable(props) {
  const [stringChoices, setStringChoices] = useState({});
  const [ready, setReady] = useState(false);

  useStringChoices(
    { __type: INV_PX_CMP_CT },
    [],
    ["unit", "currency"],
    setStringChoices
  );

  const rowSchemaTypes = {
    adjustment: DOUBLE_INPUT,
    averaging: CANNOT_COPY,
    "component name": TEXT_INPUT,
    "conversion factor": DOUBLE_INPUT,
    currency: STRING_CHOICES_SELECTOR_INPUT,
    index: CANNOT_COPY,
    "rounding config": CANNOT_COPY,
    unit: STRING_CHOICES_SELECTOR_INPUT,
    weight: DOUBLE_INPUT,
  };

  const frameworkComponents = {
    StringChoicesCell: StringChoicesCell,
    IndexCellSelectorModal: IndexCellSelectorModal,
    CellCTModalAveraging: CellCTModalAveraging,
    CellCTModalRounding: CellCTModalRounding,
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const validationDefs = {
    weight: numberValidation,
    "conversion factor": numberValidation,
  };

  const getValidationDefs = () => {
    if (
      props.additionalValidationDefs &&
      Object.keys(props.additionalValidationDefs).length
    ) {
      return Object.assign(props.additionalValidationDefs, validationDefs);
    }

    return validationDefs;
  };

  const getColumnDefs = () => {
    let productType = "undefined";
    let columnDefs = [];

    if (props.productType && props.productType.length) {
      productType = props.productType;
    }

    if (props.additionalColumnDefs && props.additionalColumnDefs.length) {
      columnDefs = props.additionalColumnDefs;
    }

    return columnDefs.concat([
      {
        headerName: INDEX,
        field: INDEX.toLowerCase(),
        cellRenderer: "IndexCellSelectorModal",
        editable: false,
        cellRendererParams: () => {
          return {
            gridName: "Index",
            field: INDEX.toLowerCase(),
            url: `/api/contract-terms-editor/settlement-indices?productType=${encodeURIComponent(
              productType
            )}`,
            dataField: "types",
            sortFunction: indexSort,
          };
        },
        cellStyle: { padding: 0 },
      },
      {
        headerName: "Unit",
        field: "unit",
        cellRenderer: "StringChoicesCell",
        editable: false,
        cellRendererParams: () => {
          return {
            stringChoices: stringChoices,
            field: "unit",
          };
        },
        cellStyle: { padding: 0 },
      },
      {
        headerName: "Currency",
        field: "currency",
        cellRenderer: "StringChoicesCell",
        editable: false,
        cellRendererParams: () => {
          return {
            stringChoices: stringChoices,
            field: "currency",
          };
        },
        cellStyle: { padding: 0 },
      },
      {
        headerName: "Weight",
        field: "weight",
        tooltipComponent: "ValidationToolTipComponent",
        tooltipComponentParams: validationDefs["weight"],
        cellClassRules: numberCellClassRules,
        tooltipValueGetter: (params) => toolTipValueGetter(params),
      },
      {
        headerName: "Conversion factor",
        field: "conversion factor",
        tooltipComponent: "ValidationToolTipComponent",
        tooltipComponentParams: validationDefs["conversion factor"],
        cellClassRules: numberCellClassRules,
        tooltipValueGetter: (params) => toolTipValueGetter(params),
      },
      {
        headerName: "Averaging",
        field: "averaging",
        cellRenderer: "CellCTModalAveraging",
        editable: false,
        cellRendererParams: () => {
          return {
            field: "averaging",
            dispatch: props.dispatch,
          };
        },
        cellStyle: { padding: 0 },
      },
      {
        headerName: "Rounding",
        field: "rounding config",
        cellRenderer: "CellCTModalRounding",
        editable: false,
        cellRendererParams: () => {
          return {
            field: "rounding config",
            dispatch: props.dispatch,
          };
        },
        cellStyle: { padding: 0 },
      },
    ]);
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
      {ready && (
        <BaseDataGrid
          rows={props.rows}
          rowSchema={getNewInventoryPeriodPriceComponentsCTs(1)}
          rowSchemaTypes={rowSchemaTypes}
          dispatch={props.dispatch}
          path={props.path}
          field={props.field}
          columnDefs={getColumnDefs()}
          frameworkComponents={frameworkComponents}
          validationDefs={getValidationDefs()}
          id={props.id}
          gridName={props.gridName}
          gridClass={props.gridClass}
          rowClass={props.rowClass}
          itemCount={props.itemCount}
          copyTriggered={props.copyTriggered}
          selectedProductIndex={props.selectedProductIndex}
        />
      )}
    </>
  );
}
