import React from "react";
import { DATE, TERM_KNOT_CT } from "./constants";
import Date from "./Date";
import BaseDataGrid from "./BaseDataGrid";

export default function TerminationDatesTable(props) {
  const rowSchema = {
    __type: TERM_KNOT_CT,
    "termination date": {
      _date_: "",
    },
    "exercise date": {
      _date_: "",
    },
  };

  const rowSchemaTypes = {
    "termination date": DATE,
    "exercise date": DATE,
  };

  const frameworkComponents = { Date: Date };

  const columnDefs = [
    {
      headerName: "Termination date",
      field: "termination date",
      cellRenderer: "Date",
      editable: false,
      cellRendererParams: () => {
        return {
          cellDate: true,
          field: "termination date",
        };
      },
      cellStyle: { padding: 0 },
    },
    {
      headerName: "Exercise date",
      field: "exercise date",
      cellRenderer: "Date",
      editable: false,
      cellRendererParams: () => {
        return {
          cellDate: true,
          field: "exercise date",
        };
      },
      cellStyle: { padding: 0 },
    },
  ];

  return (
    <BaseDataGrid
      rows={props.rows}
      rowSchema={rowSchema}
      rowSchemaTypes={rowSchemaTypes}
      dispatch={props.dispatch}
      path={props.path}
      field={props.field}
      columnDefs={columnDefs}
      frameworkComponents={frameworkComponents}
      id={props.id}
      gridName={props.gridName}
      gridClass={props.gridClass}
      rowClass={props.rowClass}
    />
  );
}
