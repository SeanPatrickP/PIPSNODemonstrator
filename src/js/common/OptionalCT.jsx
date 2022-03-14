import React, { useEffect, useState } from "react";
import { EMPTY_CT, EMPTY_CT_OBJECT } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { cloneDeep } from "lodash";

export default function OptionalCT(props) {
  const hasCTSetOnProps = () => {
    if (!props.contents) {
      return false;
    }

    if (props.contents && props.contents.__type === EMPTY_CT) {
      return false;
    }

    return true;
  };

  const [hasCT, setHasCT] = useState(hasCTSetOnProps());

  const addCT = () => {
    props.dispatch({ type: "update", value: props.baseCT, path: props.path });
    setHasCT(true);
  };

  const removeCT = () => {
    props.dispatch({
      type: "update",
      value: cloneDeep(EMPTY_CT_OBJECT),
      path: props.path,
    });

    setHasCT(false);
  };

  useEffect(() => {
    props.context(hasCT);
  }, [hasCT]);

  return (
    <div>
      <div className="row">
        <div className="col-sm-10">
          {!hasCT && (
            <button
              className="small-action-button"
              onClick={addCT}
              title="Add CT"
            >
              <FontAwesomeIcon icon={faToggleOff} className="button-icon" />
            </button>
          )}
          {hasCT && (
            <button
              className="small-action-button"
              onClick={removeCT}
              title="Remove CT"
            >
              <FontAwesomeIcon icon={faToggleOn} className="button-icon" />
            </button>
          )}
        </div>
      </div>
      {hasCT && props.children}
    </div>
  );
}
