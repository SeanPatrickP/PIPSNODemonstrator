import React from "react";
import MiscellaneousFeesCT from "../cts/MiscellaneousFeesCT";

export default function MiscellaneousFeeSection(props) {
  return (
    <div className="row">
      <div className="col-sm-2">
        <h1>Miscellaneous other fees</h1>
      </div>
      <div className="col-sm-10">
        <MiscellaneousFeesCT
          contents={props.contents["miscellaneous fees ct"]}
          dispatch={props.dispatch}
          path={["miscellaneous fees ct"]}
        />
      </div>
    </div>
  );
}
