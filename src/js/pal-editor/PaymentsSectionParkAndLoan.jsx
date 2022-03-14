import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import {
  CLOSING_EXCHANGE,
  DOUBLE_INPUT,
  INITIAL_EXCHANGE,
  INFINITY_KEY,
} from "../common/constants";
import BulkFieldsInput from "../common/BulkFieldsInput";
import { changeHandlerBasic } from "../common/useDeepObject";

export default function PaymentsSectionParkAndLoan(props) {
  const bulkFieldInputs = [
    {
      title: INITIAL_EXCHANGE,
      fieldPath: "initial invoice pay day count",
      type: DOUBLE_INPUT,
    },
    {
      title: CLOSING_EXCHANGE,
      fieldPath: "closing invoice pay day count",
      type: DOUBLE_INPUT,
    },
  ];

  const addPaymentsSection = () => {
    const newSettings = props.contents["settings ct"];

    newSettings["initial invoice pay day count"] = 0;
    newSettings["interim invoice pay day count"] = 0;
    newSettings["closing invoice pay day count"] = 0;

    changeHandlerBasic(props.dispatch, props.path, "settings ct", newSettings);

    setHasPaymentsSection(true);
  };

  const removePaymentsSection = () => {
    const newSettings = props.contents["settings ct"];

    newSettings["initial invoice pay day count"] = INFINITY_KEY;
    newSettings["interim invoice pay day count"] = INFINITY_KEY;
    newSettings["closing invoice pay day count"] = INFINITY_KEY;

    changeHandlerBasic(props.dispatch, props.path, "settings ct", newSettings);

    setHasPaymentsSection(false);
  };

  const checkHasPaymentsSection = () => {
    if (
      props.contents["settings ct"]["initial invoice pay day count"] !==
        INFINITY_KEY &&
      props.contents["settings ct"]["interim invoice pay day count"] !==
        INFINITY_KEY &&
      props.contents["settings ct"]["closing invoice pay day count"] !==
        INFINITY_KEY
    ) {
      return true;
    }

    return false;
  };

  const [hasPaymentsSection, setHasPaymentsSection] = useState(
    checkHasPaymentsSection()
  );

  useEffect(() => {
    setHasPaymentsSection(checkHasPaymentsSection());
  }, [
    props.contents["settings ct"]["initial invoice pay day count"],
    props.contents["settings ct"]["interim invoice pay day count"],
    props.contents["settings ct"]["closing invoice pay day count"],
  ]);

  return (
    <div className="row">
      <div className="col-sm-2">
        <h1>Payments</h1>
      </div>
      <div className="col-sm-10">
        <div className="container">
          {!hasPaymentsSection && (
            <div className="row">
              <button
                className="small-action-button"
                onClick={addPaymentsSection}
                title="Add payments section"
              >
                <FontAwesomeIcon icon={faToggleOff} className="button-icon" />
              </button>
            </div>
          )}
          {hasPaymentsSection && (
            <>
              <div className="row">
                <button
                  className="small-action-button"
                  onClick={removePaymentsSection}
                  title="Remove payments section"
                >
                  <FontAwesomeIcon icon={faToggleOn} className="button-icon" />
                </button>
              </div>
              <BulkFieldsInput
                fieldNames={bulkFieldInputs}
                values={props.contents["settings ct"]}
                dispatch={props.dispatch}
                path={[...props.path, "settings ct"]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
