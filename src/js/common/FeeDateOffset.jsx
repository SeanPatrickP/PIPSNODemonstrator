import React from "react";
import BulkFieldsInput from "./BulkFieldsInput";
import { TEXT_INPUT } from "./constants";

export default function FeeDateOffset(props) {
  const path = [...props.path, props.fieldPath];

  const bulkFieldInputs = [
    {
      title: "Date rule",
      fieldPath: "date rule",
      type: TEXT_INPUT,
    },
    {
      title: "Holiday calendar 1",
      fieldPath: "holiday calendar 1",
      type: TEXT_INPUT,
    },
    {
      title: "Holiday calendar 2",
      fieldPath: "holiday calendar 2",
      type: TEXT_INPUT,
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
      />
    </div>
  );
}
