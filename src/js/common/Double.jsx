import React, { useEffect, useState } from "react";
import numeral from "numeral";
import { changeHandlerBasic } from "./useDeepObject";
import { INFINITY_KEY } from "./constants";
import { parseDouble } from "./InputHelper";

export default function Double(props) {
  const [previewDouble, setPreviewDouble] = useState("");
  const [cellBg, setCellBg] = useState("form-control");

  const formatFromDouble = (double) => {
    if (
      double === "" ||
      double === INFINITY_KEY ||
      double === props.blankPlaceholder
    ) {
      return "";
    }

    return numeral(double).format("0,0[.]000[000]");
  };

  const formatToDouble = (double, update) => {
    let parsed = "";
    let previewDoubleParsed = "";
    let allowUpdate = false;

    if (!double) {
      if (props.blankPlaceholder) {
        parsed = props.blankPlaceholder;
      } else {
        parsed = INFINITY_KEY;
      }

      allowUpdate = true;
    } else {
      parsed = parseDouble(double);

      if (!isNaN(parsed) && parsed !== null) {
        allowUpdate = true;
      }
    }

    previewDoubleParsed = parsed;

    if (parsed === INFINITY_KEY && props.setter) {
      parsed = "";
    }

    if (allowUpdate) {
      setCellBg("form-control");
    } else {
      setCellBg("form-control red-bg");
    }

    if (
      update &&
      allowUpdate &&
      props.setter &&
      (props.editable || props.editable === undefined)
    ) {
      props.setter(parsed, props.field);
      setPreviewDouble(previewDoubleParsed);
    } else if (
      update &&
      allowUpdate &&
      (props.editable || props.editable === undefined)
    ) {
      changeHandlerBasic(props.dispatch, props.path, props.field, parsed);
      setPreviewDouble(previewDoubleParsed);
    }

    return parsed;
  };

  const [formattedDouble, setFormattedDouble] = useState(
    formatFromDouble(props.value)
  );

  useEffect(() => {
    formatToDouble(formattedDouble, true);
  }, [formattedDouble]);

  useEffect(() => {
    if (props.resetValue) {
      setFormattedDouble("");
      props.setResetValue(false);
    }
  }, [props.resetValue]);

  useEffect(() => {
    const newValueFormatted = formatFromDouble(props.value);

    if (newValueFormatted !== formatFromDouble(formattedDouble)) {
      setFormattedDouble(newValueFormatted);
    }
  }, [props.value]);

  return (
    <>
      {(props.editable || props.editable === undefined) && (
        <>
          <input
            type="text"
            className={cellBg}
            value={formattedDouble}
            onChange={(event) => setFormattedDouble(event.target.value)}
          />
          {previewDouble !== INFINITY_KEY && (
            <input
              type="text"
              className="form-control"
              value={previewDouble}
              readOnly={true}
              disabled={true}
            />
          )}
        </>
      )}
      {props.editable !== undefined && !props.editable && (
        <span className="readonly">{formattedDouble}</span>
      )}
    </>
  );
}
