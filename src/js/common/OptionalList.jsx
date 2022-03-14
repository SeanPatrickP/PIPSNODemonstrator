import React, { useEffect, useState } from "react";
import Double from "./Double";
import { changeHandlerBasic } from "./useDeepObject";
import { cloneDeep } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faBackspace,
  faPencilAlt,
  faBan,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  DOUBLE_INPUT,
  SELECTION_INPUT,
  INFINITY_KEY,
  TEXT_INPUT,
} from "./constants";

export default function OptionalList(props) {
  const [toAdd, setToAdd] = useState(props.blankPlaceholder || "");
  const [toEdit, setToEdit] = useState("");
  const [canAdd, setCanAdd] = useState(false);
  const [resetValue, setResetValue] = useState(false);

  const [cancelButtonClass, setCancelButtonClass] = useState("hidden");
  const [feeId, setFeeId] = useState(props.feeId);

  const disallowedValues = [INFINITY_KEY, null];

  const cancelEdit = () => {
    setToEdit("");
    setToAdd(props.blankPlaceholder || "");
    setResetValue(true);
    setCancelButtonClass("hidden");
  };

  const addItem = () => {
    let currentList = props.currentList;

    if (!currentList) {
      currentList = [];
    }

    if (!currentList.includes(toAdd)) {
      if (toEdit.toString().length > 0 && currentList.indexOf(toEdit) !== -1) {
        const index = currentList.indexOf(toEdit);
        currentList[index] = toAdd;
      } else {
        currentList.push(toAdd);

        if (props.linkedColumn && props.linkedTable && props.linkedRows) {
          let updatedRows = [];

          props.linkedRows.forEach((row) => {
            row[props.linkedColumn].push("");
            updatedRows.push(row);
          });

          changeHandlerBasic(
            props.dispatch,
            props.path,
            props.linkedTable,
            updatedRows
          );
        }
      }

      changeHandlerBasic(
        props.dispatch,
        props.path,
        props.fieldPath,
        currentList
      );

      if (props && props.setter) {
        props.setter(currentList);
      }

      cancelEdit();
    }
  };

  const getInputType = () => {
    if (props && props.input) {
      return props.input;
    }
    return TEXT_INPUT;
  };

  const getChoices = (choices) => {
    let newChoices = cloneDeep(choices);

    if (newChoices.indexOf(undefined) !== -1) {
      newChoices[newChoices.indexOf(undefined)] = "";
    } else if (newChoices.indexOf("") === -1) {
      newChoices.unshift("");
    }

    return newChoices;
  };

  const [inputType] = useState(getInputType());

  useEffect(() => {
    if (
      String(toAdd).length > 0 &&
      !disallowedValues.includes(toAdd) &&
      !props.currentList.includes(toAdd)
    ) {
      setCanAdd(true);
    } else {
      setCanAdd(false);
    }
  }, [toAdd, props.currentList.length]);

  useEffect(() => {
    // Used when called from the fees section, to reset a field that is not set on the ct
    if (props.feeId !== feeId) {
      setToAdd(props.blankPlaceholder || "");
      setResetValue(true);
      setFeeId(props.feeId);
    }
  }, [props.feeId]);

  return (
    <>
      <div className="row" key={`optional list ${props.title}`}>
        <div className="col-sm-3">{props.title}:</div>
        <div className="col-sm-8">
          {DOUBLE_INPUT === inputType && (
            <Double
              value={toAdd}
              dispatch={props.dispatch}
              path={props.path}
              field={props.fieldPath}
              editable={true}
              setter={setToAdd}
              resetValue={resetValue}
              setResetValue={setResetValue}
              blankPlaceholder={props.blankPlaceholder}
            />
          )}
          {TEXT_INPUT === inputType && (
            <input
              className="form-control"
              value={toAdd}
              onChange={(event) => setToAdd(event.target.value)}
            />
          )}
          {SELECTION_INPUT === inputType && (
            <select
              className="form-control"
              value={toAdd}
              onChange={(event) => setToAdd(event.target.value)}
            >
              {getChoices(props.choices).map((choice) => (
                <option key={choice}>{choice}</option>
              ))}
            </select>
          )}
        </div>
        <div className="col-sm-1 button-col-right">
          <button
            className="small-action-button"
            onClick={addItem}
            disabled={!canAdd}
            title="Add value"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="button-icon" />
          </button>
          {props.tooltip &&
            props.tooltip.length &&
            ((props.tooltipShowFunction &&
              props.tooltipShowFunction(props.currentlist, props.index)) ||
              !props.tooltipShowFunction) && (
              <button
                className="small-action-button small-action-button-tooltip"
                title={props.tooltip}
              >
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  className="button-icon"
                />
              </button>
            )}
          <button
            className={`small-action-button ${cancelButtonClass}`}
            onClick={cancelEdit}
            title="Cancel edit"
          >
            <FontAwesomeIcon icon={faBan} className="button-icon" />
          </button>
        </div>
      </div>
      <CurrentItems
        currentList={props.currentList}
        dispatch={props.dispatch}
        path={props.path}
        fieldPath={props.fieldPath}
        setToAdd={setToAdd}
        setToEdit={setToEdit}
        setCaneeIButtonClass={setCancelButtonClass}
        cancelEdit={cancelEdit}
        linkedColumn={props.linkedColumn}
        linkedTable={props.linkedTable}
        linkedRows={props.linkedRows}
        setter={props.setter}
        lockRemovalIfJustOne={props.lockRemovalIfJustOne}
      />
    </>
  );
}

export function CurrentItems(props) {
  let components = [];

  let currentList = props.currentList;

  if (!currentList) {
    currentList = [];
  }

  const removeItem = (toRemove) => {
    if (currentList.includes(toRemove)) {
      const index = currentList.indexOf(toRemove);
      currentList.splice(index, 1);

      changeHandlerBasic(
        props.dispatch,
        props.path,
        props.fieldPath,
        currentList
      );

      if (props.linkedColumn && props.linkedTable && props.linkedRows) {
        let updatedRows = [];

        props.linkedRows.forEach((row) => {
          row[props.linkedColumn].splice(index, 1);
          updatedRows.push(row);
        });

        changeHandlerBasic(
          props.dispatch,
          props.path,
          props.linkedTable,
          updatedRows
        );
      }

      if (props && props.setter) {
        props.setter(currentList);
      }

      props.cancelEdit();
    }
  };

  const editItem = (toEdit) => {
    if (currentList.includes(toEdit)) {
      props.setToEdit(toEdit);
      props.setToAdd(toEdit);
      props.setCancelButtonClass("");
    }
  };

  currentList.forEach((item) =>
    components.push(
      <div className="row" key={item}>
        <div className="col-sm-3" />
        <div className="col-sm-7">{item}</div>
        <div className="col-sm-2 button-col-right">
          <button
            className="small-action-button"
            onClick={() => editItem(item)}
            title="Edit value"
          >
            <FontAwesomeIcon icon={faPencilAlt} className="button-icon" />
          </button>
          <button
            className="small-action-button"
            onClick={() => removeItem(item)}
            title="Delete value"
            disabled={
              props.lockRemovalIfJustOne &&
              currentList &&
              currentList.length === 1
            }
          >
            <FontAwesomeIcon icon={faBackspace} className="button-icon" />
          </button>
        </div>
      </div>
    )
  );

  return components;
}
