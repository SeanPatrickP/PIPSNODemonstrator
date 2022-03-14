import React, { forwardRef, useImperativeHandle, useState } from "react";
import { parseDouble } from "./InputHelper";

const ValidationToolTip = forwardRef((props, ref) => {
  const [isValid] = useState(props.isValid(props.value));

  useImperativeHandle(ref, () => {
    return {
      getReactContainerClasses() {
        if (isValid) {
          return ["hidden-tooltip"];
        } else {
          return ["custom-tooltip"];
        }
      },
    };
  });

  return (
    <>
      {!isValid && (
        <div className="custom-tooltip">
          <p>{props.validationText}</p>
        </div>
      )}
    </>
  );
});

ValidationToolTip.displayName = "ValidationToolTip";

export default ValidationToolTip;

export function validNumberCheck(toCheck) {
  if (toCheck === undefined || toCheck === null || toCheck === "") {
    return false;
  }

  const parsed = parseDouble(toCheck);

  if (parsed === undefined || parsed === null || parsed === "") {
    return false;
  }

  return !isNaN(parsed);
}

export function toolTipValueGetter(params) {
  if (
    params.value === undefined ||
    params.value === null ||
    params.value.length === 0
  ) {
    return "";
  }

  return params.value;
}

export function validateEventOnRows(
  event,
  validationDefs,
  inputValidationErrors
) {
  const field = event.colDef.field;

  if (field in validationDefs && validationDefs[field].isValid) {
    if (!validationDefs[field].isValid(event.value)) {
      inputValidationErrors++;
    }

    event.api.refreshCells();
  }

  return inputValidationErrors;
}
