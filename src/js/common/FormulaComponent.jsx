import React from "react";
import PriceComponentsTable from "./PriceComponentsTable";
import BulkFieldsInput from "./BulkFieldsInput";
import { DOUBLE_INPUT } from "./constants";
import { toolTipValueGetter } from "./ValidationToolTip";
import { numberValidation } from "./InputHelper";
import { numberCellClassRules } from "./BasePIPGridHelper";

export default function FormulaComponent(props) {
  const bulkFieldInputs = [
    {
      title: "Price cap",
      fieldPath: "price cap",
      type: DOUBLE_INPUT,
    },
    {
      title: "Maximum quantity",
      fieldPath: "max quantity",
      type: DOUBLE_INPUT,
    },
  ];

  const validationDefs = { adjustment: numberValidation };

  const additionalColumnDefs = [
    {
      headerName: "Name",
      field: "component name",
    },
    {
      headerName: "Adjustment",
      field: "adjustment",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["adjustment"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
  ];

  return (
    <>
      {!props.justFormulaTable && (
        <BulkFieldsInput
          fieldNames={bulkFieldInputs}
          values={props.contents[props.index]}
          dispatch={props.dispatch}
          path={props.path}
        />
      )}
      <PriceComponentsTable
        id={props.id}
        rows={props.contents[props.index][props.field]}
        contents={props.contents}
        gridName="Formula table"
        rowClass="row table-grid"
        gridClass="col-sm-8 table-grid-column"
        field={props.field}
        dispatch={props.dispatch}
        path={props.path}
        itemCount={props.formulaCount}
        index={props.index}
        productType={props.productType}
        additionalColumnDefs={additionalColumnDefs}
        additionalValidationDefs={validationDefs}
        copyTriggered={props.copyTriggered}
        selectedProductIndex={props.selectedProductIndex}
      />
    </>
  );
}
