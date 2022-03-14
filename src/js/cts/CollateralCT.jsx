import React, { useState } from "react";
import BulkFieldsInput from "../common/BulkFieldsInput";
import Curve from "../common/Curve";
import CollateralTable from "../common/CollateralTable";
import OptionalCT from "../common/OptionalCT";
import { getBaseFeeCurve } from "../common/BasePIPGridHelper";
import { useStringChoices } from "../common/StringChoicesContext";
import {
  COLLAT_TBL_CT,
  DOUBLE_INPUT,
  STRING_CHOICES_SELECTOR_INPUT,
} from "../common/constants";

export default function CollateralCT(props) {
  const curveId = "collateralSectionFeeCurveGrid";
  const collateralTableId = "collateralSectionCollateralTable";

  const baseCollateralCT = {
    denominated: "",
    "mult liquidation factor": 0,
    "added liquidation factor": 0,
    "fx data source": "",
    "collateral table": [],
    "additional collateral curve": getBaseFeeCurve(),
    __type: COLLAT_TBL_CT,
  };

  const bulkFieldInputs = [
    {
      title: "Mult liquidation factor",
      fieldPath: "mult liquidation factor",
      type: DOUBLE_INPUT,
    },
    {
      title: "Added liquidation factor",
      fieldPath: "added liquidation factor",
      type: DOUBLE_INPUT,
    },
    {
      title: "Denominated",
      fieldPath: "denominated",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "FX data source",
      fieldPath: "fx data source",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  const stringChoices = useStringChoices(
    { __type: COLLAT_TBL_CT },
    [],
    ["denominated", "fx data source"]
  );

  const [hasCollateralCT, setHasCollateralCT] = useState(false);

  return (
    <div className="container">
      <OptionalCT
        contents={props.contents}
        baseCT={baseCollateralCT}
        context={setHasCollateralCT}
        dispatch={props.dispatch}
        path={props.path}
      >
        {hasCollateralCT && (
          <>
            <BulkFieldsInput
              fieldNames={bulkFieldInputs}
              values={props.contents}
              dispatch={props.dispatch}
              path={props.path}
              stringCho
              ices={stringChoices}
            />
            <Curve
              id={curveId}
              rows={props.contents("additional collateral curve")}
              gridName="Fee curve"
              rowClass="row table-grid"
              gridClass="col-sm-8 table-grid-column"
              field="additional collateral curve"
              dispatch={props.dispatch}
              path={props.path}
            />
            <CollateralTable
              id={collateralTableId}
              rows={props.contents["collateral table"]}
              gridName="Collateral table"
              rowClass="row table-grid"
              gridClass="col-sm-8 table-grid-column"
              stringChoices={stringChoices}
              field="collateral table"
              dispatch={props.dispatch}
              path={props.path}
            />
          </>
        )}
      </OptionalCT>
    </div>
  );
}
