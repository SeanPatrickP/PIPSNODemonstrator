import React from "react";
import Curve from "./Curve";
import BulkFieldsInput from "./BulkFieldsInput";
import {
  DOUBLE_INPUT,
  INDEX,
  STRING_CHOICES_SELECTOR_INPUT,
  TEXT_INPUT,
  WC_FEE_RATE_CT,
} from "./constants";
import { parseToRDate, parseFromRDate } from "./InputHelper";
import { useStringChoices } from "./StringChoicesContext";

export default function Spread(props) {
  const path = [...props.path, props.fieldPath];

  const stringChoices = useStringChoices(
    { __type: WC_FEE_RATE_CT },
    [],
    [INDEX.toLowerCase(), "fixing avg type"]
  );

  const bulkFieldInputs = [
    {
      title: "Rate value",
      fieldPath: "rate",
      type: DOUBLE_INPUT,
    },
    {
      title: "Rate floor",
      fieldPath: "rate floor",
      type: DOUBLE_INPUT,
    },
    {
      title: "Rate cap",
      fieldPath: "rate cap",
      type: DOUBLE_INPUT,
    },
    {
      title: "Tenor",
      fieldPath: "tenor",
      type: TEXT_INPUT,
      parser: parseToRDate,
      getter: parseFromRDate,
    },
    {
      title: INDEX,
      fieldPath: INDEX.toLowerCase(),
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Fixing average type",
      fieldPath: "fixing avg type",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  return (
    <div className="container inline-nested-ct">
      <div className="expanded-section-header">
        <h1>{props.title}</h1>
      </div>
      <BulkFieldsInput
        fieldNames={bulkFieldInputs}
        values={props.values}
        dispatch={props.dispatch}
        path={path}
        stringChoices={stringChoices}
      />
      <Curve
        id={props.id}
        rows={props.values["rate curve"]}
        gridName="Spread curve"
        rowClass="row table-grid"
        gridClass="col-sm-8 table-grid-column"
        field="rate curve"
        dispatch={props.dispatch}
        path={path}
        feesLength={props.feesLength}
      />
    </div>
  );
}
