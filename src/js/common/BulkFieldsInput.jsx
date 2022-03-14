import React from "react";
import StringChoicesContext from "./StringChoicesContext";
import Date from "./Date";
import Double from "./Double";
import StringChoicesSelector from "./StringChoicesSelector";
import {
  parseTextIfApplicableAndGet,
  parseTextIfApplicableAndUpdate,
} from "../common/InputHelper";
import {
  TEXT_INPUT,
  DATE_INPUT,
  DOUBLE_INPUT,
  STRING_CHOICES_SELECTOR_INPUT,
  CHECKBOX,
} from "./constants";
import { Checkbox } from "@react/checkbox";
import { changeHandlerBasic } from "./useDeepObject";

export default function BulkFieldsInput(props) {
  let inputs = [];

  props.fieldNames.forEach((field) =>
    inputs.push(
      <div className="row" key={`bulk field ${field.title}`}>
        <div className="col-sm-3">{field.title}:</div>

        {field.type === TEXT_INPUT && (
          <div className="col-sm -8 ">
            <input
              className="form-control"
              value={
                parseTextIfApplicableAndGet(
                  props.values[field.fieldPath],
                  field
                ) || ""
              }
              onChange={(event) =>
                parseTextIfApplicableAndUpdate(
                  props.dispatch,
                  props.path,
                  field,
                  event.target.value
                )
              }
              disabled={field.disabled}
            />
          </div>
        )}

        {field.type === DATE_INPUT && (
          <Date
            value={props.values[field.fieldPath]}
            dispatch={props.dispatch}
            path={props.path}
            field={field.fieldPath}
            editable={field.editable}
            linkedDateValue={props.values[field.linkedDate]}
            linkedDate={field.linkedDate}
          />
        )}

        {field.type === DOUBLE_INPUT && (
          <div className="col-sm-8">
            <Double
              value={props.values[field.fieldPath]}
              dispatch={props.dispatch}
              path={props.path}
              field={field.fieldPath}
              editable={field.editable}
              setter={props.setter}
            />
          </div>
        )}

        {field.type === STRING_CHOICES_SELECTOR_INPUT && (
          <StringChoicesContext.Provider value={props.stringChoices}>
            <div className="col-sm-8">
              <StringChoicesSelector
                value={props.values[field.fieldPath]}
                dispatch={props.dispatch}
                path={props.path}
                field={field.fieldPath}
                setter={props.setter}
              />
            </div>
          </StringChoicesContext.Provider>
        )}

        {field.type === CHECKBOX && (
          <div className="col-sm-8">
            <Checkbox
              checked={props.values[field.fieldPath] ? 1 : 0}
              onChange={() =>
                changeHandlerBasic(
                  props.dispatch,
                  props.path,
                  field.fieldPath,
                  !props.values[field.fieldPath] ? 1 : 0
                )
              }
            />
          </div>
        )}
      </div>
    )
  );

  return inputs;
}
