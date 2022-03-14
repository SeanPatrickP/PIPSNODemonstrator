import React, { useEffect, useState } from "react";
import { DATE_INTERVAL_TYPE, DATE_KEY } from "./constants";
import { formatFromDate, parseSpecialDate } from "./InputHelper";
import Date from "./Date";
import { changeHandlerBasic } from "./useDeepObject";

export default function StartEndDate(props) {
  const [startDate, setStartDate] = useState(
    props.value && props.value["start date"]
  );
  const [endDate, setEndDate] = useState(
    props.value && props.value["end date"]
  );

  const createStartEndDateObject = (startDate, endDate) => {
    return {
      __type: DATE_INTERVAL_TYPE,
      "start date": startDate,
      "end date": endDate,
    };
  };

  const setStartAndLinkedDate = (parsedDate) => {
    if (
      endDate &&
      parseSpecialDate(formatFromDate(endDate[DATE_KEY])) !== "" &&
      parseSpecialDate(formatFromDate(parsedDate[DATE_KEY])) === ""
    ) {
      setEndDate({ [DATE_KEY]: "" });
    }

    setStartDate(parsedDate);
  };

  const setEndAndLinkedDate = (parsedDate) => {
    if (
      startDate &&
      parseSpecialDate(formatFromDate(startDate[DATE_KEY])) !== "" &&
      parseSpecialDate(formatFromDate(parsedDate[DATE_KEY])) === ""
    ) {
      setStartDate({ [DATE_KEY]: "" });
    }

    setEndDate(parsedDate);
  };

  const getStartDateTitle = () => {
    if (props.title && props.title.length) {
      return `${props.title} start date:`;
    }

    return "Start date:";
  };

  const getEndDateTitle = () => {
    if (props.title && props.title.length) {
      return `${props.title} end date:`;
    }

    return "End date:";
  };

  useEffect(() => {
    const parsed = createStartEndDateObject(startDate, endDate);

    if (props.setter) {
      return props.setter(parsed, props.field);
    }

    changeHandlerBasic(props.dispatch, props.path, props.field, parsed);
  }, [startDate, endDate]);

  useEffect(() => {
    const localStartDate = (props.value && props.value["start date"]) || "";

    if (startDate !== localStartDate) {
      setStartDate(localStartDate);
    }
  }, [props.value && props.value["start date"]]);

  useEffect(() => {
    const localEndDate = (props.value && props.value["end date"]) || "";

    if (endDate !== localEndDate) {
      setEndDate(localEndDate);
    }
  }, [props.value && props.value["end date"]]);

  return (
    <>
      <div className="row" key={`start date ${props.field}`}>
        <div className="col-sm-3">{getStartDateTitle()}</div>
        <Date
          value={startDate}
          editable={props.editable}
          setter={setStartAndLinkedDate}
        />
      </div>
      <div className="row" key={`end date ${props.field}`}>
        <div className="col-sm-3">{getEndDateTitle()}</div>
        <Date
          value={endDate}
          editable={props.editable}
          setter={setEndAndLinkedDate}
        />
      </div>
    </>
  );
}
