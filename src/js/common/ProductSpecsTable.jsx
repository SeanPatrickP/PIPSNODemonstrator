import React, { useState, useEffect, useRef } from "react";
import ValidationToolTipComponent, {
  toolTipValueGetter,
} from "./ValidationToolTip";
import BaseDataGrid from "./BaseDataGrid";
import { useStringChoices } from "./StringChoicesContext";
import {
  numberCellClassRules,
  StringChoicesCell,
  StringChoicesCellLinked,
} from "./BasePIPGridHelper";
import {
  SUCCESS,
  DOUBLE_INPUT,
  STRING_CHOICES_SELECTOR_INPUT,
  TEXT_INPUT,
  INV_PRD_SPEC_CT,
} from "./constants";
import { numberValidation } from "./InputHelper";

export default function ProductSpecsTable(props) {
  const [stringChoices, setStringChoices] = useState({});
  const [ready, setReady] = useState(false);
  const [newMaterialSelected, setNewMaterialSelected] = useState("");

  const gridApi = useRef(null);

  useStringChoices(
    { __type: INV_PRD_SPEC_CT },
    [],
    ["event type", "material", "conversion unit from", "conversion unit to"],
    setStringChoices
  );

  const rowSchema = {
    "event type": "",
    material: "",
    grade: "",
    __type: INV_PRD_SPEC_CT,
  };

  const rowSchemaTypes = {
    "event type": STRING_CHOICES_SELECTOR_INPUT,
    material: STRING_CHOICES_SELECTOR_INPUT,
    grade: STRING_CHOICES_SELECTOR_INPUT,
    origins: TEXT_INPUT,
    "origins option": TEXT_INPUT,
    "conversion ratio": DOUBLE_INPUT,
    "conversion unit from": STRING_CHOICES_SELECTOR_INPUT,
    "conversion unit to": STRING_CHOICES_SELECTOR_INPUT,
  };

  const frameworkComponents = {
    StringChoicesCell: StringChoicesCell,
    StringChoicesCellLinked: StringChoicesCellLinked,
    ValidationToolTipComponent: ValidationToolTipComponent,
  };

  const validationDefs = {
    "conversion ratio": numberValidation,
  };

  const originsColumn = { headerName: "Origins", field: "origins" };

  const originsOptionColumn = {
    headerName: "Origins option",
    field: "origins option",
  };

  const conversionRatioColumn = {
    headerName: "Conversion ratio",
    field: "conversion ratio",
    filter: "agNumberColumnFilter",
    tooltipComponent: "ValidationToolTipComponent",
    tooltipComponentParams: validationDefs["conversion ratio"],
    cellClassRules: numberCellClassRules,
    tooltipValueGetter: (params) => toolTipValueGetter(params),
  };

  const convertFromColumn = {
    headerName: "Convert from",
    field: "conversion unit from",
    cellRenderer: "StringChoicesCell",
    editable: false,
    cellRendererParams: () => {
      return {
        stringChoices: stringChoices,
        field: "conversion unit from",
      };
    },
    cellStyle: { padding: 0 },
  };

  const convertToColumn = {
    headerName: "Convert to",
    field: "conversion unit to",
    cellRenderer: "StringChoicesCell",
    editable: false,
    cellRendererParams: () => {
      return {
        stringChoices: stringChoices,
        field: "conversion unit to",
      };
    },
    cellStyle: { padding: 0 },
  };

  const getValue = (rowIndex, key) => {
    if (gridApi.current) {
      let currentRows = [];

      gridApi.current.forEachNode((node) => {
        currentRows.push(node.data);
      });

      if (currentRows[rowIndex] && currentRows[rowIndex][key]) {
        return currentRows[rowIndex][key];
      }
    }

    return "";
  };

  const getColumnExclusionList = () => {
    let removalList = [];

    if (
      props.product &&
      props.product["product type"] &&
      props.product["product type"].length
    ) {
      if (props.product["product type"] === "Physical Coal") {
        removalList.push("conversion ratio");
        removalList.push("conversion unit from");
        removalList.push("conversion unit to");
      } else if (
        props.product["product type"] === "Physical Oil & Products" ||
        props.product["product type"] === "Physical Base Metals"
      ) {
        removalList.push("origins");
        removalList.push("origins option");
      }
    }

    return removalList;
  };

  const getColumnDefs = () => {
    let columnDefs = [
      {
        headerName: "Event",
        field: "event type",
        cellRenderer: "StringChoicesCell",
        editable: false,
        cellRendererParams: () => {
          return {
            stringChoices: stringChoices,
            field: "event type",
          };
        },
        cellStyle: { padding: 0 },
      },
      {
        headerName: "Material",
        field: "material",
        cellRenderer: "StringChoicesCell",
        editable: false,
        cellRendererParams: () => {
          return {
            stringChoices: stringChoices,
            field: "material",
            setter: setNewMaterialSelected,
          };
        },
        cellStyle: { padding: 0 },
      },
      {
        headerName: "Grade",
        field: "grade",
        cellRenderer: "StringChoicesCellLinked",
        editable: false,
        cellRendererParams: (params) => {
          return {
            stringChoices: stringChoices,
            field: "grade",
            linkedField: "material",
            stringChoicesType: INV_PRD_SPEC_CT,
            material: getValue(params.rowIndex, "material"),
          };
        },
        cellStyle: { padding: 0 },
      },
    ];

    if (
      props.product &&
      props.product["product type"] &&
      props.product["product type"].length
    ) {
      if (props.product["product type"] === "Physical Coal") {
        columnDefs.push(originsColumn);
        columnDefs.push(originsOptionColumn);
      } else if (
        props.product["product type"] === "Physical Oil & Products" ||
        props.product["product type"] === "Physical Base Metals"
      ) {
        columnDefs.push(conversionRatioColumn);
        columnDefs.push(convertFromColumn);
        columnDefs.push(convertToColumn);
      }
    }

    return columnDefs;
  };

  useEffect(() => {
    if (
      stringChoices.status &&
      stringChoices.status.toLowerCase() === SUCCESS
    ) {
      setReady(true);
    }
  }, [stringChoices.status]);

  useEffect(() => {
    if (gridApi && gridApi.current) {
      gridApi.current.refreshCells({ force: true, columns: ["grade"] });
    }
  }, [newMaterialSelected]);

  useEffect(() => {
    if (gridApi && gridApi.current) {
      const removalList = getColumnExclusionList();
      props.rows.forEach((row) => {
        removalList.forEach((elementToRemove) => {
          if (elementToRemove in row) {
            delete row[elementToRemove];
          }
        });
      });

      gridApi.current.setColumnDefs(getColumnDefs());
      gridApi.current.sizeColumnsToFit();
    }
  }, [props.product["product type"]]);

  return (
    <>
      {ready && (
        <BaseDataGrid
          rows={props.rows}
          rowSchema={rowSchema}
          rowSchemaTypes={rowSchemaTypes}
          dispatch={props.dispatch}
          path={props.path}
          field={props.field}
          columnDefs={getColumnDefs()}
          frameworkComponents={frameworkComponents}
          validationDefs={validationDefs}
          id={props.id}
          gridName={props.gridName}
          gridClass={props.gridClass}
          rowClass={props.rowClass}
          gridApi={gridApi}
        />
      )}
    </>
  );
}
