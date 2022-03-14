import React, { useContext, useEffect, useRef, useState } from "react";
import StringChoicesContext from "./StringChoicesContext";
import { changeHandlerBasic } from "./useDeepObject";
import { cloneDeep } from "lodash";
import { ROW_INDEX } from "./constants";
import { getListChoices } from "./InputHelper";

export default function StringChoicesSelector(props) {
  const isInitialRender = useRef(true);

  const getChoices = (fromServer) => {
    let choices = [];

    if (fromServer && fromServer[props.field]) {
      choices = cloneDeep(fromServer[props.field]) || [];
    }

    return getListChoices(choices, selectedValue, setSelectedValue);
  };

  const onChangeEvent = (value) => {
    setSelectedValue(value);

    if (
      props.context &&
      props.node &&
      props.cellSelector &&
      ROW_INDEX in props.node &&
      !isInitialRender.current
    ) {
      // The below is used for a linked string choices cell renderer
      if (props.setter) {
        props.setter(`${value} ${props.node.rowIndex}`, props.field);
      }

      return props.context({
        value: value,
        index: props.node.rowIndex,
        field: props.field,
      });
    }

    if (props.setter && !isInitialRender.current) {
      return props.setter(value, props.field);
    }

    if (
      props.dispatch &&
      props.path &&
      props.field &&
      !isInitialRender.current
    ) {
      changeHandlerBasic(props.dispatch, props.path, props.field, value);
    }

    if (
      props.linkedField &&
      value &&
      value.length &&
      !isInitialRender.current
    ) {
      changeHandlerBasic(props.dispatch, props.path, props.linkedField, value);
    }
  };

  const fromServer = useContext(StringChoicesContext);

  const [selectedValue, setSelectedValue] = useState(props.value || "");

  useEffect(() => {
    if (selectedValue !== (props.value || "")) {
      onChangeEvent(props.value || "");
    }
  }, [props.value]);

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  return (
    <select
      className="form-control"
      value={selectedValue || ""}
      onChange={(event) => onChangeEvent(event.target.value || "")}
    >
      {getChoices(fromServer).map((choice) => (
        <option key={choice}>{choice}</option>
      ))}
    </select>
  );
}
