import React from "react";
import WaterfallCT from "../cts/WaterfallCT";

export default function WaterfallSection(props) {
  return (
    <div className="row">
      <div className="col-sm-2">
        <h1>Waterfall</h1>
      </div>
      <div className="col-sm-10">
        <WaterfallCT
          contents={props.contents["waterfall ct"]}
          dispatch={props.dispatch}
          path={["waterfall ct"]}
        />
      </div>
    </div>
  );
}
