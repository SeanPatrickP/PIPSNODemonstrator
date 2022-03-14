import React, { useEffect, useState, useRef } from "react";
import { changeHandlerBasic } from "./useDeepObject";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackspace,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "@react/datepicker";
import { Input, InputIcon } from "@react/input";
import {
  DATE_FORMAT,
  DATE_FORMAT_SHORT_CODE,
  ROW_INDEX,
  DATE_KEY,
} from "./constants";
import { formatToDate, formatFromDate, parseSpecialDate } from "./InputHelper";

export default function Date(props) {
  const [propsUpdateOccurred, setPropsUpdateOccured] = useState(false);

  const valueProps = useRef(props.value);
  const isInitialMount = useRef(true);
  const dateComponent = useRef(null);

  const onDateChange = (selectedDates, dateSelected) => {
    if (selectedDates.length === 1) {
      setFormattedDate(dateSelected);
    }
  };

  const getDatePickerOptions = () => {
    return {
      wrap: true,
      dateFormat: DATE_FORMAT_SHORT_CODE,
      defaultDate: formattedDate,
      onChange: onDateChange,
    };
  };

  const clearDate = () => {
    dateComponent.current.flatpickr.clear();
    setFormattedDate("");
  };

  const isDateDisabled = () => {
    return props.editable !== undefined && !props.editable;
  };

  const isClearButtonDisabled = () => {
    return formattedDate.length === 0;
  };

  const resolveClass = (baseClass) => {
    return isDateDisabled() ? baseClass.concat(" disabled") : baseClass;
  };

  const [formattedDate, setFormattedDate] = useState(
    formatFromDate(props.value && props.value[DATE_KEY])
  );

  useEffect(() => {
    if (propsUpdateOccurred || isInitialMount.current) {
      isInitialMount.current = false;
      setPropsUpdateOccured(false);
      return;
    }

    const parsed = formatToDate(formattedDate);
    valueProps.current = parsed;

    if (
      props.context &&
      props.node &&
      props.cellDate &&
      ROW_INDEX in props.node
    ) {
      let updaterObject = {
        value: parsed,
        index: props.node.rowIndex,
        field: props.field,
      };

      if (props.customValueSetter) {
        updaterObject.customValueSetter = props.customValueSetter;
      }

      return props.context(updaterObject);
    }

    if (props.setter) {
      props.setter(parsed);
    } else {
      changeHandlerBasic(props.dispatch, props.path, props.field, parsed);

      // The below will set the linked date value to "" if the current date in question was set to a special date and now being changed to a regular one
      if (
        parseSpecialDate(
          props.value &&
            props.value[DATE_KEY] &&
            formatFromDate(props.value[DATE_KEY])
        ) !== "" &&
        parseSpecialDate(formattedDate) === "" &&
        props.linkedDate &&
        props.linkedDateValue &&
        parseSpecialDate(formatFromDate(props.linkedDateValue[DATE_KEY])) !== ""
      ) {
        changeHandlerBasic(props.dispatch, props.path, props.linkedDate, {
          [DATE_KEY]: "",
        });
      }
    }
  }, [formattedDate]);

  useEffect(() => {
    if (props.value && props.value[DATE_KEY] === "") {
      return clearDate();
    }

    if (props.value && valueProps.current[DATE_KEY] !== props.value[DATE_KEY]) {
      setPropsUpdateOccured(true);
      const formatted = formatFromDate(props.value[DATE_KEY]);
      setFormattedDate(formatted);
      valueProps.current = props.value[DATE_KEY];
    }
  }, [props.value]);

  const getDateComponent = () => {
    return (
      <DatePicker options={getDatePickerOptions()} ref={dateComponent}>
        {!isDateDisabled() && !props.cellDate && (
          <div className="date-icon-container">
            <Input
              className={resolveClass("date-picker")}
              data-input
              placeholder={DATE_FORMAT}
              type="text"
              name="date"
              readOnly={isDateDisabled()}
              value={formattedDate}
              leadingContent={<InputIcon name="calendar-today" type="filled" />}
            />
          </div>
        )}
        {isDateDisabled() ||
          (props.cellDate && (
            <Input
              className={resolveClass("date-picker")}
              data-input
              placeholder={DATE_FORMAT}
              type="text"
              name="date"
              readOnly={isDateDisabled()}
              value={formattedDate}
            />
          ))}
      </DatePicker>
    );
  };

  return (
    <>
      {props.cellDate && getDateComponent()}
      {!props.cellDate && (
        <>
          <div className="col-sm-8">{getDateComponent()}</div>
          <div className="col-sm-1 button-col-right">
            <button
              className="small-action-button"
              onClick={clearDate}
              disabled={isDateDisabled() || isClearButtonDisabled()}
              title="Delete date"
            >
              <FontAwesomeIcon icon={faBackspace} className="button-icon" />
            </button>
            {parseSpecialDate(formattedDate) !== "" && (
              <button
                className="small-action-button  small-action-button-tooltip"
                title="These are special dates that represent an empty date interval in the database"
              >
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  className="button-icon"
                />
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
