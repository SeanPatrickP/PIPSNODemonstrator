import React, { useState } from "react";
import { DOUBLE_INPUT, CURVE } from "./constants";
import Double from "./Double";
import Curve from "./Curve";
import { changeHandlerBasic } from "./useDeepObject";
import { getBaseFeeCurve } from "./BasePIPGridHelper";
import { Checkbox } from "@react/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default function DoubleCurveSwitcher(props) {
  let [inputType, setInputType] = useState(DOUBLE_INPUT);

  const resolveInputType = () => {
    let type;
    if (
      props.component.curveFieldPath &&
      props.values[props.component.curveFieldPath]
    ) {
      type = CURVE;
    } else if (
      props.component.doubleFieldPath &&
      props.values[props.component.doubleFieldPath] !== undefined
    ) {
      type = DOUBLE_INPUT;
    }
    if (type !== inputType) {
      setInputType(type);
    }

    return true;
  };

  const switchInputType = () => {
    if (inputType === CURVE) {
      delete props.values[props.component.curveFieldPath];
      props.values[props.component.doubleFieldPath] =
        props.component.doubleDefaultValue;
    } else if (inputType === DOUBLE_INPUT) {
      props.values[props.component.doubleFieldPath] =
        props.component.curveDoubleDefaultValue;

      props.values[props.component.curveFieldPath] = getBaseFeeCurve();
    }

    changeHandlerBasic(
      props.dispatch,
      [props.path[0]],
      props.path[1],
      props.values
    );
  };

  return (
    <>
      {resolveInputType() && (
        <>
          <div className="row" key="expanded fee double curve switcher">
            <div className="col-sm-3">Use curve:</div>
            <div className="col-sm-8">
              <Checkbox
                checked={CURVE === inputType}
                onChange={() => switchInputType()}
              />
            </div>
          </div>
          {DOUBLE_INPUT === inputType && (
            <div className="row" key={`expanded fee ${props.title}`}>
              <div className="col-sm-3">{props.title}:</div>
              <div className="col-sm-8">
                <Double
                  value={props.values[props.component.doubleFieldPath]}
                  dispatch={props.dispatch}
                  path={props.path}
                  field={props.component.doubleFieldPath}
                  editable={true}
                />
              </div>
              {props.doubleTooltip &&
                props.doubleTooltip.length &&
                ((props.doubleTooltipShowFunction &&
                  props.doubleTooltipShowFunction(
                    props.values[props.component.doubleFieldPath]
                  )) ||
                  !props.doubleTooltipShowFunction) && (
                  <div className="col-sm-1 button-col-right">
                    <button
                      className="small-action-button small-action-button-tooltip"
                      title={props.doubleTooltip}
                    >
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="button-icon"
                      />
                    </button>
                  </div>
                )}
            </div>
          )}
          {CURVE === inputType && (
            <Curve
              id={`curve ${props.index}`}
              rows={props.values[props.component.curveFieldPath]}
              gridName={props.title}
              rowClass="row table-grid"
              gridClass="col-sm-8 table-grid-column"
              dispatch={props.dispatch}
              path={props.path}
              field={props.component.curveFieldPath}
              feeslength={props.feeslength}
              tooltip={props.curveTooltip}
              tooltipShowFunction={props.curveTooltipShowFunction}
            />
          )}
        </>
      )}
    </>
  );
}
