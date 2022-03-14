import React from "react";
import Curve from "./Curve";
import BulkFieldsInput from "./BulkFieldsInput";
import { parseToRDate, parseFromRDate } from "./InputHelper";
import { useStringChoices } from "./StringChoicesContext";
import {
  DOUBLE_INPUT,
  INDEX,
  STRING_CHOICES_SELECTOR_INPUT,
  TEXT_INPUT,
  WC_FEE_RATE_CT,
} from "./constants";

export default function Rate(props) {
  const path = [...props.path, props.fieldPath];

  const stringChoices = useStringChoices(
    { __type: WC_FEE_RATE_CT },
    [],
    [INDEX.toLowerCase(), "fixing avg type"]
  );

  const bulkFieldInputs = [
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
    <div className="inline-nested-ct nested-ct">
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
        id={`rate floor curve ${props.id}`}
        rows={props.values["rate floor curve"]}
        gridName="Rate floor curve"
        rowClass="row table-grid"
        gridClass="col-sm-8 table-grid-column"
        field="rate floor curve"
        dispatch={props.dispatch}
        path={path}
        feeslength={props.feeslength}
      />
      <Curve
        id={`rate capital curve ${props.id}`}
        rows={props.values["rate cap curve"]}
        gridName="Rate capital curve"
        rowClass="row table-grid"
        gridClass="col-sm-8 table-grid-column"
        field="rate cap curve"
        dispatch={props.dispatch}
        path={path}
        feeslength={props.feesLength}
      />
    </div>
  );
}
