import React, { useEffect, useState } from "react";
import StringChoicesSelector from "./StringChoicesSelector";
import StringChoicesContext from "./StringChoicesContext";
import { Checkbox } from "@react/checkbox";
import { DATES, ROW_INDEX, CURVE_KEY, SUCCESS, VALUES } from "./constants";
import { validNumberCheck } from "./ValidationToolTip";
import { useStringChoices } from "./StringChoicesContext";
import { getListChoices } from "./InputHelper";

export function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  return displayedColumns[0] === params.column;
}

export function getTableOptions(columnDefs) {
  return {
    rowSelection: "multiple",
    rowMultiSelectWithClick: true,
    stopEditingWhenGridLosesFocus: true,
    defaultColDef: {
      filter: true,
      editable: true,

      resizable: true,
      sortable: true,
      menuTabs: ["filterMenuTab", "generalMenuTab"],
      valueFormatter: (params) => formatValueToString(params),
      cellClass: "standard-grid-cell",
      headerCheckboxSelection: isFirstColumn,
      checkboxSelection: isFirstColumn,
      lockPosition: true,
    },

    columnDefs: columnDefs,
  };
}

export function getBaseFeeCurve() {
  return {
    [CURVE_KEY]: { dates: [], values: [] },
  };
}

export function parseFromCurve(curveData) {
  let rows = [];

  if (curveData[CURVE_KEY]) {
    curveData = curveData[CURVE_KEY];

    let dates = curveData.dates;
    let values = curveData.values;

    if (dates.length !== values.length) {
      dates = [];
      values = [];
    }

    for (let index = 0; index < dates.length; index++) {
      rows.push({ date: dates[index], value: values[index] });
    }
  }

  return rows;
}

export function parseToCurve(rows) {
  let data = { [CURVE_KEY]: {} };
  let dates = [];
  let values = [];

  rows.forEach((row) => {
    dates.push(row.date);
    values.push(row.value);
  });

  data[CURVE_KEY][DATES.toLowerCase()] = dates;
  data[CURVE_KEY][VALUES.toLowerCase()] = values;

  return data;
}

export function formatValueToString(params) {
  if (params && params.value !== undefined && params.value !== null) {
    return params.value.toString();
  }

  return "";
}

export function onRowSelectionChanged(selectedRows, setterFunctions) {
  if (selectedRows.length > 1) {
    setterFunctions.forEach((setter) => {
      setter.setterText(setter.pluraIText);
      setter.setterEnabled(true);
    });
    return;
  }

  setterFunctions.forEach((setter) => {
    setter.setterText(setter.singularText);
    if (selectedRows.length === 1) {
      setter.setterEnabled(true);
    } else {
      setter.setterEnabled(false);
    }
  });
}

export function setNewValueForNestedRow(
  value,
  rowIndex,
  field,
  rows,
  nestedField
) {
  if (rows && rows[rowIndex] && field) {
    let updatedObject = rows[rowIndex][nestedField];
    let updatedRows = rows;

    updatedObject[field] = value;

    updatedRows[rowIndex][nestedField] = updatedObject;

    return updatedRows;
  }

  return rows;
}

export const numberCellClassRules = {
  "white-bg": function (params) {
    if (!(params.colDef.field in params.data)) {
      return true;
    }
    return validNumberCheck(params.value);
  },

  "red-bg": function (params) {
    if (!(params.colDef.field in params.data)) {
      return false;
    }
    return !validNumberCheck(params.value);
  },
};

export function StringChoicesCell(props) {
  return (
    <StringChoicesContext.Provider value={props.stringChoices}>
      <StringChoicesSelector
        value={props.value}
        field={props.field}
        context={props.context}
        node={props.node}
        cellSelector={true}
        setter={props.setter}
      />
    </StringChoicesContext.Provider>
  );
}

export function StringChoicesCelllinked(props) {
  const [stringChoices, setStringChoices] = useState({});
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState(props.value);

  if (props[props.linkedField] && props[props.linkedField].length) {
    useStringChoices(
      {
        __type: props.stringChoicesType,
        [props.linkedField]: props[props.linkedField],
      },
      [],
      [props.field],
      setStringChoices
    );
  }

  useEffect(() => {
    if (
      stringChoices.status &&
      stringChoices.status.toLowerCase() === SUCCESS &&
      props.field in stringChoices
    ) {
      let newStringChoices = [];
      stringChoices[props.field].forEach((choice) => {
        newStringChoices.push(choice.toUpperCase());
      });

      stringChoices[props.field] = newStringChoices;

      setStringChoices(stringChoices);

      if (
        value !== "" &&
        stringChoices[props.field] &&
        stringChoices[props.field].indexOf(value.toUpperCase()) === -1
      ) {
        setValue("");
      } else if (stringChoices[props.field].indexOf(value) === -1) {
        setValue(value.toUpperCase());
      }

      setReady(true);
    }
  }, [stringChoices.status]);

  useEffect(() => {
    if (value !== props.value) {
      props.context({
        value: value,
        index: props.node.rowIndex,
        field: props.field,
      });
    }
  }, [value]);

  return (
    <StringChoicesContext.Provider value={stringChoices}>
      {(ready ||
        !props[props.linkedField] ||
        !props[props.linkedField].length) && (
        <StringChoicesSelector
          value={value}
          field={props.field}
          context={props.context}
          node={props.node}
          cellSelector={true}
        />
      )}
    </StringChoicesContext.Provider>
  );
}

export function CheckBoxCell(props) {
  const [checked, setChecked] = useState(props.value);

  const onChangeEvent = (value) => {
    if (props.context && props.node && ROW_INDEX in props.node) {
      setChecked(+value);
      return props.context({
        value: +value,
        index: props.node.rowIndex,
        field: props.field,
      });
    }
  };

  return (
    <div className="cell-check-box">
      <Checkbox
        checked={checked ? 1 : 0}
        onChange={(event) => onChangeEvent(event.checked)}
      />
    </div>
  );
}

export function CellDropDownList(props) {
  const [selected, setSelected] = useState(props.value);

  const onChangeEvent = (value) => {
    if (props.context && props.node && ROW_INDEX in props.node) {
      setSelected(value);

      let updaterObject = {
        value: value,
        index: props.node.rowIndex,
        field: props.field,
      };

      if (props.customValueSetter) {
        updaterObject.customValueSetter = props.customValueSetter;
      }

      return props.context(updaterObject);
    }
  };

  return (
    <select
      className="form-control"
      value={selected}
      onChange={(event) => onChangeEvent(event.target.value)}
    >
      {getListChoices(props.choices, selected, setSelected).map((choice) => (
        <option key={choice}>{choice}</option>
      ))}
    </select>
  );
}
