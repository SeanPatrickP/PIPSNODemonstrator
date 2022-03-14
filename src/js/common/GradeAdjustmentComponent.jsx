import { Checkbox } from "@react/checkbox";
import React from "react";
import BaseDataGrid from "./BaseDataGrid";
import { numberCellClassRules } from "./BasePIPGridHelper";
import { DOUBLE_INPUT, GRD_ADJ_ROW_CT, TEXT_INPUT } from "./constants";
import { numberValidation } from "./InputHelper";
import { changeHandlerBasic } from "./useDeepObject";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";

export default function GradeAdjustmentComponent(props) {
  const rowSchema = {
    grade: "",
    unit: "USD/BBL",
    diff: 0,
    __type: GRD_ADJ_ROW_CT,
  };

  const rowSchemaTypes = {
    grade: TEXT_INPUT,
    unit: TEXT_INPUT,
    diff: DOUBLE_INPUT,
  };

  const frameworkComponents = {
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const validationDefs = {
    diff: numberValidation,
  };

  const getColumnDefs = () => [
    {
      headerName: "Grade",
      field: "grade",
    },
    {
      headerName: "Unit",
      field: "unit",
    },
    {
      headerName: "Diff",
      field: "diff",
      tooltipComponent: "ValidationToolTipComponent",
      tooltipComponentParams: validationDefs["diff"],
      cellClassRules: numberCellClassRules,
      tooltipValueGetter: (params) => toolTipValueGetter(params),
    },
  ];

  return (
    <>
      <div className="row" key="grade adjustment fifo">
        <div className="col-sm-3">Use FIFO queue:</div>
        <div className="col-sm-8">
          <Checkbox
            checked={props.contents["use fifo queue"] ? 1 : 0}
            onChange={() =>
              changeHandlerBasic(
                props.dispatch,
                props.path,
                "use fifo queue",
                !props.contents["use fifo queue"] ? 1 : 0
              )
            }
          />
        </div>
      </div>
      <BaseDataGrid
        rows={props.contents["adjustments"]}
        rowSchema={rowSchema}
        rowSchemaTypes={rowSchemaTypes}
        dispatch={props.dispatch}
        path={props.path}
        field={props.field}
        columnDefs={getColumnDefs()}
        frameworkComponents={frameworkComponents}
        validationDefs={validationDefs}
        id={props.id}
        itemCount={props.formulaCount}
        gridName={props.gridName}
        gridClass={props.gridClass}
        rowClass={props.rowClass}
      />
    </>
  );
}
