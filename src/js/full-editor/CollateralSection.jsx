import React from "react";
import CollateralCT from "../cts/CollateralCT";

export default function CollateralSection(props) {
  return (
    <div className="row">
      <div className="col-sm-2">
        <h1>Collateral</h1>
      </div>
      <div className="col-sm-10">
        <CollateralCT
          contents={props.contents["collateral ct"]}
          path={["collateral ct"]}
          dispatch={props.dispatch}
        />
      </div>
    </div>
  );
}
