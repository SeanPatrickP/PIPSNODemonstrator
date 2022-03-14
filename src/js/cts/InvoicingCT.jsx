import React from "react";
import BulkFieldsInput from "../common/BulkFieldsInput";
import { changeHandlerBasic } from "../common/useDeepObject";
import { useStringChoices } from "../common/StringChoicesContext";
import {
  CHECKBOX,
  DATE_INPUT,
  SELECTION_INPUT,
  STRING_CHOICES_SELECTOR_INPUT,
  TEXT_INPUT,
} from "../common/constants";
import OptionalList from "../common/OptionalList";
import { getListChoices, getSelectedListValue } from "../common/InputHelper";

export default function InvoicingCT(props) {
  const bulkFieldInputs = [
    {
      title: "Holidays",
      fieldPath: "invoice holidays",
      type: TEXT_INPUT,
      disabled: true,
    },
    {
      title: "Overridable payment dates",
      fieldPath: "payment dates overridable",
      type: CHECKBOX,
    },
    {
      title: "Group name",
      fieldPath: "group name",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Flow start date",
      fieldPath: "flow start date",
      type: DATE_INPUT,
      linkedDate: "flow end date",
    },
    {
      title: "Flow end date",
      fieldPath: "flow end date",
      type: DATE_INPUT,
      linkedDate: "flow start date",
    },
    {
      title: "Collapsed",
      fieldPath: "collapsed",
      type: CHECKBOX,
    },
  ];

  const stringChoices = useStringChoices(props.contents, [], ["group name"]);

  return (
    <div className="invoicing-ct">
      <div className="container">
        <BulkFieldsInput
          fieldNames={bulkFieldInputs}
          values={props.contents}
          dispatch={props.dispatch}
          path={props.path}
          stringChoices={stringChoices}
        />
        <div className="row">
          <div className="col-sm-3">Payment frequency:</div>
          <div className="col-sm-8">
            <select
              className="form-control"
              value={getSelectedListValue(
                ["Daily", "Weekly"],
                props.contents["payment frequency"]
              )}
              onChange={(event) =>
                changeHandlerBasic(
                  props.dispatch,
                  props.path,
                  "payment frequency",
                  event.target.value
                )
              }
            >
              {getListChoices(
                ["Daily", "Weekly"],
                props.contents["payment frequency"]
              ).map((paymentFrequencyType) => (
                <option key={paymentFrequencyType}>
                  {paymentFrequencyType}
                </option>
              ))}
            </select>
          </div>
        </div>
        <OptionalList
          dispatch={props.dispatch}
          currentList={props.contents["product name list"]}
          path={props.path}
          fieldPath="product name list"
          title="Pricing month products"
          input={SELECTION_INPUT}
          choices={props.allProductNames}
        />
      </div>
    </div>
  );
}
