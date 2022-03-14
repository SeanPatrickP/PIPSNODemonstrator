import React, { useState, useEffect } from "react";
import OptionalCT from "../common/OptionalCT";
import { changeHandlerBasic } from "../common/useDeepObject";
import OptionalList from "../common/OptionalList";
import { Checkbox } from "@react/checkbox";
import { MISC_FEES_CT, TEXT_INPUT } from "../common/constants";

export default function MiscellaneousFeesCT(props) {
  const [hasMiscellaneousFeesCT, setHasMiscellaneousFeesCT] = useState(false);
  const [feeNames, setFeeNames] = useState(props.contents["fee names"]);

  const baseMiscellaneousFeesCT = {
    __type: MISC_FEES_CT,
  };

  useEffect(() => {
    setFeeNames([]);
  }, [hasMiscellaneousFeesCT]);

  return (
    <div className="container">
      <OptionalCT
        {...props}
        baseCT={baseMiscellaneousFeesCT}
        context={setHasMiscellaneousFeesCT}
      />
      {hasMiscellaneousFeesCT && (
        <div>
          <div className="row">
            <div className="col-sm-3">Has ad-hoc fees:</div>
            <div className="col-sm-8">
              <Checkbox
                checked={props.contents["has adhoc fees"] ? 1 : 0}
                onChange={() =>
                  changeHandlerBasic(
                    props.dispatch,
                    props.path,
                    "has adhoc fees",
                    !props.contents["has adhoc fees"] ? 1 : 0
                  )
                }
              />
            </div>
          </div>
          <OptionalList
            dispatch={props.dispatch}
            currentList={feeNames}
            path={props.path}
            fieldPath="fee names"
            title="Fee names"
            setter={setFeeNames}
            input={TEXT_INPUT}
          />
        </div>
      )}
    </div>
  );
}
