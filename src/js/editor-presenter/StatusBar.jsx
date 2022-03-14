import React, { useEffect, useState } from "react";
import GreenBox from "./GreenBox";
import BlueBox from "./BlueBox";
import RedBox from "./RedBox";
import {
  BOOKMARKING,
  CALCULATING,
  ERROR,
  FAIL,
  KEY_MAP_ERROR,
  OK,
  REQUIRED,
  SUCCESS,
  SUPPLY_AND_OFFTAKE,
  UPDATING,
  VALIDATION_ERRORS,
  VALIDATION_FAILURE,
} from "../common/constants";
import numeral from "numeral";

export default function StatusBar(props) {
  const [redBoxVisible, setRedBoxVisible] = useState(props.redBoxVisible);
  const [blueBoxVisible, setBlueBoxVisible] = useState(props.blueBoxVisible);
  const [greenBoxVisible, setGreenBoxVisible] = useState(props.greenBoxVisible);
  const [redBoxButtonText, setRedBoxButtonText] = useState("");
  const [blueBoxButtonText, setBlueBoxButtonText] = useState("");
  const [greenBoxButtonText, setGreenBoxButtonText] = useState("");

  const setAllOtherBoxesAsClosed = (red, green, blue) => {
    if (!red) {
      setRedBoxVisible(false);
      setRedBoxButtonText("Show errors");
    }

    if (!green) {
      setGreenBoxVisible(false);
      setGreenBoxButtonText("Show diffs");
    }

    if (!blue) {
      setBlueBoxVisible(false);
      setBlueBoxButtonText("Setup risk hints");
    }
  };

  const toggleGreenBox = () => {
    setGreenBoxVisible((prev) => !prev);
    setAllOtherBoxesAsClosed(false, true, false);

    if (greenBoxVisible) {
      setGreenBoxButtonText("Show diffs");
    } else {
      setGreenBoxButtonText("Hide diffs");
    }

    props.onToggleGreenBox && props.onToggleGreenBox();
  };

  const toggleRedBox = () => {
    setRedBoxVisible((prev) => !prev);
    setAllOtherBoxesAsClosed(true, false, false);

    if (redBoxVisible) {
      setRedBoxButtonText("Show errors");
    } else {
      setRedBoxButtonText("Hide errors");
    }

    props.onToggleRedBox && props.onToggleRedBox();
  };

  const toggleBlueBox = () => {
    setBlueBoxVisible((prev) => !prev);
    setAllOtherBoxesAsClosed(false, false, true);

    if (blueBoxVisible) {
      setBlueBoxButtonText("Setup risk hints");
    } else {
      setBlueBoxButtonText("Hide risk hints setup");
    }
    props.onToggleBlueBox && props.onToggleBlueBox();
  };

  const getStateButtonText = (updateStatus, ifTrue, ifFalse, currentStatus) => {
    if (currentStatus && currentStatus.toLowerCase() === updateStatus) {
      return ifTrue;
    }

    return ifFalse;
  };

  const getStateButtonClass = (
    updateStatus,
    buttonClass,
    floatClass,
    currentStatus,
    disableOverride
  ) => {
    if (
      (currentStatus && currentStatus.toLowerCase() === updateStatus) ||
      disableOverride
    ) {
      return `${floatClass} btn btn-secondary disabled disabled-update-button`;
    }

    return `${floatClass} btn ${buttonClass}`;
  };

  const getRedBoxButton = () => {
    return (
      <button
        className="btn btn-secondary red-button-text"
        onClick={toggleRedBox}
      >
        {redBoxButtonText}
      </button>
    );
  };

  const getGreenBoxButton = () => {
    return (
      <button
        className="btn btn-secondary green-button-text"
        onClick={toggleGreenBox}
      >
        {greenBoxButtonText}
      </button>
    );
  };

  const getBlueBoxButton = () => {
    return (
      <button
        className={getStateButtonClass(
          CALCULATING,
          "btn-secondary blue-button-text",
          "float-left",
          props.calcStatus,
          !props.connectedToDBSession ||
            !props.bookmarkContractId ||
            !props.bookmarkContractId.length
        )}
        onClick={toggleBlueBox}
      >
        {blueBoxButtonText}
      </button>
    );
  };

  const getValidationErrorText = () => {
    if (props.validationErrorCount === 1) {
      return `${props.validationErrorCount} Validation error`;
    }
    return `${props.validationErrorCount} Validation errors`;
  };

  const getRiskHints = () => {
    return {
      "path set": SUPPLY_AND_OFFTAKE.toLowerCase(),
      heuristic: props.selectedRiskHint,
    };
  };

  useEffect(() => {
    if (
      (props.updateStatus &&
        (props.updateStatus.toLowerCase() === VALIDATION_ERRORS ||
          props.updateStatus.toLowerCase() === VALIDATION_FAILURE ||
          props.updateStatus.toLowerCase() === FAIL)) ||
      (props.calcStatus &&
        (props.calcStatus.toLowerCase() === ERROR ||
          props.calcStatus.toLowerCase() === KEY_MAP_ERROR))
    ) {
      setRedBoxVisible(true);
      setRedBoxButtonText("Hide errors");
      setAllOtherBoxesAsClosed(true, false, false);
    } else {
      setAllOtherBoxesAsClosed(false, false, false);
    }
  }, [props.updateStatus, props.calcStatus]);

  return (
    <>
      {props.editorStatus && props.editorStatus.toLowerCase() === OK && (
        <div className="action-outer">
          {!props.editorReadOnly && (
            <>
              <div className="action-panel">
                <button
                  className={getStateButtonClass(
                    BOOKMARKING,
                    "btn-primary",
                    "float-right",
                    props.bookmarkStatus,
                    !props.bookmarkContractId ||
                      !props.bookmarkContractId.length
                  )}
                  onClick={() => props.onSaveDraft(BOOKMARKING)}
                >
                  {getStateButtonText(
                    BOOKMARKING,
                    "Bookmarking...",
                    "Bookmark",
                    props.bookmarkStatus
                  )}
                </button>
                {(!props.calcStatus ||
                  (props.calcStatus &&
                    props.calcStatus.toLowerCase() !== CALCULATING)) && (
                  <button
                    className={getStateButtonClass(
                      UPDATING,
                      "btn-primary",
                      "float-right",
                      props.updateStatus
                    )}
                    onClick={props.onUpdateContractTerms}
                  >
                    {getStateButtonText(
                      UPDATING,
                      "Updating...",
                      "Update",
                      props.updateStatus
                    )}
                  </button>
                )}
                {props.updateStatus &&
                  props.updateStatus.toLowerCase() === SUCCESS && (
                    <div className="float-right">{getGreenBoxButton()}</div>
                  )}
                {props.updateStatus &&
                  props.updateStatus.toLowerCase() === VALIDATION_ERRORS && (
                    <div className="float-right">
                      {getGreenBoxButton()}
                      {getRedBoxButton()}
                    </div>
                  )}
                {props.updateStatus &&
                  props.updateStatus.toLowerCase() === VALIDATION_FAILURE && (
                    <div className="float-right">{getRedBoxButton()}</div>
                  )}
                {props.updateStatus &&
                  props.updateStatus.toLowerCase() === FAIL && (
                    <div className="float-right">{getRedBoxButton()}</div>
                  )}
                {props.calcStatus &&
                  (props.calcStatus.toLowerCase() === REQUIRED ||
                    props.calcStatus.toLowerCase() === CALCULATING) && (
                    <button
                      className={getStateButtonClass(
                        CALCULATING,
                        "btn-primary",
                        "float-left",
                        props.calcStatus,
                        !props.connectedToDBSession ||
                          !props.bookmarkContractId ||
                          !props.bookmarkContractId.length
                      )}
                      onClick={() => {
                        props.onCalculateDollarPrice(false, getRiskHints());
                      }}
                    >
                      {getStateButtonText(
                        CALCULATING,
                        "Calculating...",
                        "Calculate dollar price",
                        props.calcStatus
                      )}
                    </button>
                  )}
                {props.calcStatus &&
                  (props.calcStatus.toLowerCase() === SUCCESS ||
                    props.calcStatus.toLowerCase() === ERROR) && (
                    <button
                      className="float-left btn btn-primary"
                      onClick={() => {
                        props.onCalculateDollarPrice(false, getRiskHints());
                      }}
                    >
                      Re-calculate dollar price
                    </button>
                  )}
                {props.calcStatus &&
                  props.calcStatus.toLowerCase() === KEY_MAP_ERROR && (
                    <button
                      className="float-left btn btn-primary"
                      onClick={() => {
                        props.onCalculateDollarPrice(true, getRiskHints());
                      }}
                    >
                      Re-calculate dollar price
                    </button>
                  )}
                {props.calcStatus &&
                  props.calcStatus.toLowerCase() !== CALCULATING && (
                    <div>{getBlueBoxButton()}</div>
                  )}
                {props.calcStatus &&
                  (props.calcStatus.toLowerCase() === ERROR ||
                    props.calcStatus.toLowerCase() === KEY_MAP_ERROR) && (
                    <div className="float-left">{getRedBoxButton()}</div>
                  )}
              </div>
              <div className="status-panel">
                {props.calcStatus &&
                  props.calcStatus.toLowerCase() === SUCCESS && (
                    <>
                      {props.dollarPrice >= 0 && (
                        <div className="action-result action-success">
                          {" "}
                          Dollar priced as{" "}
                          {numeral(props.dollarPrice).format("$0,0")}
                        </div>
                      )}
                      {props.dollarPrice < 0 && (
                        <div className="action-result action-success red-result-outer">
                          {" "}
                          Dollar priced as{" "}
                          {numeral(props.dollarPrice).format("$0,0")}
                        </div>
                      )}
                    </>
                  )}
                {props.calcStatus &&
                  (props.calcStatus.toLowerCase() === ERROR ||
                    props.calcStatus.toLowerCase() === KEY_MAP_ERROR) && (
                    <div className="action-result action-error">
                      {" "}
                      Dollar price error
                    </div>
                  )}
                {props.updateStatus &&
                  props.updateStatus.toLowerCase() === SUCCESS && (
                    <div className="action-result action-success">
                      {" "}
                      Update successful
                    </div>
                  )}
                {props.updateStatus &&
                  props.updateStatus.toLowerCase() === FAIL && (
                    <div className="action-result action-error">
                      {" "}
                      Update failed
                    </div>
                  )}
                {props.updateStatus &&
                  props.updateStatus.toLowerCase() === VALIDATION_ERRORS && (
                    <div className="action-result action-error">
                      {getValidationErrorText()}
                    </div>
                  )}
                {props.updateStatus &&
                  props.updateStatus.toLowerCase() === VALIDATION_FAILURE && (
                    <div className="action-result action-error">
                      {" "}
                      Validation failed
                    </div>
                  )}
                {props.bookmarkStatus &&
                  props.bookmarkStatus.toLowerCase() === SUCCESS && (
                    <div className="action-result action-success">
                      {" "}
                      Bookmarked as {props.savedBookmarkName}
                    </div>
                  )}
                {props.bookmarkStatus &&
                  props.bookmarkStatus.toLowerCase() === ERROR && (
                    <div className="action-result action-error">
                      Bookmark failed
                    </div>
                  )}
              </div>
            </>
          )}
        </div>
      )}
      {redBoxVisible && (
        <RedBox
          onToggle={toggleRedBox}
          errors={props.validationErrors}
          failures={props.validationFailure}
          calcError={props.calcError}
          jobID={props.jobID}
          errorType={props.updateStatus}
          calcErrorType={props.calcStatus}
        />
      )}
      {greenBoxVisible && (
        <GreenBox onToggle={toggleGreenBox} dataId={props.dataId} />
      )}
      {blueBoxVisible && (
        <BlueBox
          onToggle={toggleBlueBox}
          selectedRiskHint={props.selectedRiskHint}
          setSelectedRiskHint={props.setSelectedRiskHint}
        />
      )}
    </>
  );
}
