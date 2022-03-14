import React, { useState } from "react";
import Double from "../common/Double";
import OptionalList from "../common/OptionalList";
import StartEndDate from "../common/StartEndDate";
import Curve from "../common/Curve";
import SettlementTiersTable from "../common/SettlementTiersTable";
import PriceComponentsTable from "../common/PriceComponentsTable";
import DoubleCurveSwitcher from "../common/DoubleCurveSwitcher";
import FeeDateOffset from "../common/FeeDateOffset";
import Rate from "../common/Rate";
import Spread from "../common/Spread";
import Date from "../common/Date";
import StringChoicesContext, {
  useStringChoices,
} from "../common/StringChoicesContext";
import StringChoicesSelector from "../common/StringChoicesSelector";
import {
  OPTIONAL_LIST,
  DOUBLE_INPUT,
  STRING_CHOICES_SELECTOR_INPUT,
  TEXT_INPUT,
  START_END_DATE,
  CHECKBOX,
  CURVE,
  SETTLEMENT_TIERS_TABLE,
  DOUBLE_INPUT_CURVE,
  PRICE_COMPONENTS_TABLE,
  FEE_DATE_OFFSET,
  RATE,
  SPREAD,
  LIST,
  DATE,
} from "../common/constants";
import { changeHandlerBasic } from "../common/useDeepObject";
import {
  getListChoices,
  getSelectedListValue,
  parseTextIfApplicableAndGet,
  parseTextIfApplicableAndUpdate,
} from "../common/InputHelper";
import { Checkbox } from "@react/checkbox";

export default function ExpandedFeeSection(props) {
  const [schema] = useState(props.presets);

  const stringChoices = useStringChoices(
    { __type: props.type },
    [],
    props.stringChoicesByType
  );

  const isEditable = (component) => {
    if (component && component.editable !== undefined) {
      return component.editable;
    }
    return true;
  };

  return (
    <StringChoicesContext.Provider value={stringChoices}>
      <div className="container">
        {schema.map(function (component) {
          return (
            <div key={component.fieldPath}>
              {SPREAD === component.type && (
                <Spread
                  id={`spread ${props.index}`}
                  title={component.title}
                  values={props.contents[props.index][component.fieldPath]}
                  dispatch={props.dispatch}
                  path={props.path}
                  fieldPath={component.fieldPath}
                  feesLength={props.contents.length}
                />
              )}
              {RATE === component.type && (
                <Rate
                  id={`rate ${props.index}`}
                  title={component.title}
                  values={props.contents[props.index][component.fieldPath]}
                  dispatch={props.dispatch}
                  path={props.path}
                  fieldPath={component.fieldPath}
                  feesLength={props.contents.length}
                />
              )}
              {FEE_DATE_OFFSET === component.type && (
                <FeeDateOffset
                  title={component.title}
                  values={props.contents[props.index][component.fieldPath]}
                  dispatch={props.dispatch}
                  path={props.path}
                  fieldPath={component.fieldPath}
                />
              )}
              {OPTIONAL_LIST === component.type && (
                <OptionalList
                  dispatch={props.dispatch}
                  currentList={props.contents[props.index][component.fieldPath]}
                  path={props.path}
                  fieldPath={component.fieldPath}
                  title={component.title}
                  input={component.input}
                  feeId={props.feeId}
                  choices={component.choices}
                  blankPlaceholder={component.blankPlaceholder}
                  lockRemovalIfJustOne={component.lockRemovalIfJustOne}
                  tooltip={component.tooltip}
                  tooltipShowFunction={component.tooltipShowFunction}
                  index={props.index}
                />
              )}
              {DOUBLE_INPUT === component.type && (
                <div className="row" key={`expanded fee ${component.title}`}>
                  <div className="col-sm-3">{component.title}:</div>
                  <div className="col-sm-8">
                    <Double
                      value={props.contents[props.index][component.fieldPath]}
                      dispatch={props.dispatch}
                      path={props.path}
                      field={component.fieldPath}
                      editable={isEditable(component)}
                    />
                  </div>
                </div>
              )}
              {STRING_CHOICES_SELECTOR_INPUT === component.type && (
                <div className="row" key={`expanded fee ${component.title}`}>
                  <div className="col-sm-3">{component.title}:</div>
                  <div className="col-sm-8">
                    <StringChoicesSelector
                      value={props.contents[props.index][component.fieldPath]}
                      dispatch={props.dispatch}
                      path={props.path}
                      field={component.fieldPath}
                      linkedField={component.linkedField}
                    />
                  </div>
                </div>
              )}
              {DATE === component.type && (
                <div className="row" key={`expanded fee ${component.title}`}>
                  <div className="col-sm-3">{component.title}:</div>
                  <Date
                    vaIue={props.contents[props.index][component.fieldPath]}
                    dispatch={props.dispatch}
                    path={props.path}
                    field={component.fieldPath}
                    editable={isEditable(component)}
                  />
                </div>
              )}
              {START_END_DATE === component.type && (
                <StartEndDate
                  value={props.contents[props.index][component.fieldPath]}
                  dispatch={props.dispatch}
                  path={props.path}
                  field={component.fieldPath}
                  editable={isEditable(component)}
                  title={component.title}
                />
              )}
              {CURVE === component.type && (
                <Curve
                  id={`curve ${props.index}`}
                  rows={props.contents[props.index][component.fieldPath]}
                  gridName="Spread curve"
                  rowClass="row table-grid"
                  gridClass="col-sm-8 table-grid-column"
                  field={component.fieldPath}
                  dispatch={props.dispatch}
                  path={props.path}
                  feesLength={props.contents.length}
                  tooltip={component.tooltip}
                  tooltipShowFunction={component.tooltipShowFunction}
                />
              )}
              {SETTLEMENT_TIERS_TABLE === component.type && (
                <SettlementTiersTable
                  id={`settlement tiers table ${props.index}`}
                  rows={props.contents[props.index][component.fieldPath]}
                  gridName="Settlement tiers"
                  rowClass="row table-grid"
                  gridClass="col-sm-8 table-grid-column"
                  field={component.fieldPath}
                  dispatch={props.dispatch}
                  path={props.path}
                  feesLength={props.contents.length}
                />
              )}
              {PRICE_COMPONENTS_TABLE === component.type && (
                <PriceComponentsTable
                  id={`price components table ${props.index}`}
                  rows={props.contents[props.index][component.fieldPath]}
                  contents={props.contents}
                  gridName="Price components"
                  rowClass="row table-grid"
                  gridClass="col-sm-8 table-grid-column"
                  field={component.fieldPath}
                  dispatch={props.dispatch}
                  path={props.path}
                  itemCount={props.contents.length}
                  index={props.index}
                  productType="undefined"
                />
              )}
              {DOUBLE_INPUT_CURVE === component.type && (
                <DoubleCurveSwitcher
                  title={component.title}
                  component={component}
                  values={props.contents[props.index]}
                  dispatch={props.dispatch}
                  path={props.path}
                  feesLength={props.contents.length}
                  index={props.index}
                  doubleTooltip={component.doubleTooltip}
                  doubleTooltipShowFunction={
                    component.doubleTooltipShowFunction
                  }
                  curveTooltip={component.curveTooltip}
                  curveTooltipShowFunction={component.curveTooltipShowFunction}
                />
              )}
              {TEXT_INPUT === component.type && (
                <div className="row" key={`expanded fee ${component.title}`}>
                  <div className="col-sm-3">{component.title}:</div>
                  <div className="col-sm-8">
                    <input
                      className="form-control"
                      value={
                        parseTextIfApplicableAndGet(
                          props.contents[props.index][component.fieldPath],
                          component
                        ) || ""
                      }
                      disabled={!isEditable(component)}
                      onChange={(event) =>
                        parseTextIfApplicableAndUpdate(
                          props.dispatch,
                          props.path,
                          component,
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>
              )}
              {LIST === component.type && (
                <div className="row" key={`expanded fee ${component.title}`}>
                  <div className="col-sm-3">{component.title}:</div>
                  <div className="col-sm-8">
                    <select
                      className="form-control"
                      value={getSelectedListValue(
                        component.choices,
                        props.contents[props.index][component.fieldPath]
                      )}
                      onChange={(event) =>
                        changeHandlerBasic(
                          props.dispatch,
                          props.path,
                          component.fieldPath,
                          event.target.value
                        )
                      }
                    >
                      {getListChoices(
                        component.choices,
                        props.contents[props.index][component.fieldPath]
                      ).map((choice) => (
                        <option key={choice}>{choice}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {CHECKBOX === component.type && (
                <div className="row" key={`expanded fee ${component.title}`}>
                  <div className="col-sm-3">{component.title}:</div>
                  <div className="col-sm-8">
                    <Checkbox
                      checked={
                        props.contents[props.index][component.fieldPath] ? 1 : 0
                      }
                      onChange={() =>
                        changeHandlerBasic(
                          props.dispatch,
                          props.path,
                          component.fieldPath,
                          !props.contents[props.index][component.fieldPath]
                            ? 1
                            : 0
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </StringChoicesContext.Provider>
  );
}
