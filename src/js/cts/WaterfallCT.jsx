import React, { useState, useEffect, useRef } from "react";
import OptionalCT from "../common/OptionalCT";
import OptionalList from "../common/OptionalList";
import BulkFieldsInput from "../common/BulkFieldsInput";
import WaterfallTable from "../common/WaterfallTable";
import {
  TEXT_INPUT,
  DOUBLE_INPUT,
  INFINITY_KEY,
  WATERFALL_TBL_CT,
} from "../common/constants";

export default function WaterfallCT(props) {
  const [hasWaterfallCT, setHasWaterfallCT] = useState(false);
  const [propertyNames, setPropertyNames] = useState(
    props.contents["property names"]
  );

  const gridApi = useRef(null);
  const columnDefsFunction = useRef(null);

  const waterfallTableId = "collateralSectionFeeCurveGrid";

  const baseWaterfallCT = {
    "comingled facility column name": "None",
    "waterfall table": [],
    "max number of full volume facilities": INFINITY_KEY,
    "property names": [],
    __type: WATERFALL_TBL_CT,
  };

  const bulkFieldInputs = [
    {
      title: "Max number of full volume facilities",
      fieldPath: "max number of full volume facilities",
      type: DOUBLE_INPUT,
    },
    {
      title: "Comingled facility column name",
      fieldPath: "comingled facility column name",
      type: TEXT_INPUT,
    },
  ];

  const setPropertyAndOptionalColumnNames = (propertyNames) => {
    setPropertyNames(propertyNames);
    if (
      gridApi &&
      gridApi.current &&
      columnDefsFunction &&
      columnDefsFunction.current
    ) {
      gridApi.current.setColumnDefs(columnDefsFunction.current());
      gridApi.current.sizeColumnsToFit();
    }
  };

  useEffect(() => {
    gridApi.current = null;
    setPropertyAndOptionalColumnNames([]);
  }, [hasWaterfallCT]);

  return (
    <div className="container">
      <OptionalCT
        contents={props.contents}
        baseCT={baseWaterfallCT}
        context={setHasWaterfallCT}
        dispatch={props.dispatch}
        path={["waterfall ct"]}
      />
      {hasWaterfallCT && (
        <>
          <BulkFieldsInput
            fieldNames={bulkFieldInputs}
            values={props.contents}
            dispatch={props.dispatch}
            path={props.path}
          />
          <OptionalList
            dispatch={props.dispatch}
            currentList={propertyNames}
            path={props.path}
            fieldPath="property names"
            title="Property names"
            setter={setPropertyAndOptionalColumnNames}
            linkedColumn="properties values"
            linkedTable="waterfall table"
            linkedRows={props.contents["waterfall table"]}
            input={TEXT_INPUT}
          />
          <WaterfallTable
            id={waterfallTableId}
            rows={props.contents["waterfall table"]}
            gridName="Waterfall table"
            rowClass="row table-grid"
            gridClass="col-sm-8 table-grid-column"
            field="waterfall table"
            dispatch={props.dispatch}
            path={props.path}
            propertyNames={propertyNames}
            gridApi={gridApi}
            columnDefsFunction={columnDefsFunction}
          />
        </>
      )}
    </div>
  );
}
