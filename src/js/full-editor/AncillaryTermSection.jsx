import React from "react";
import AncillaryCT from "../cts/AncillaryCT";

export default function AncillaryTermSection(props) {
  return (
    <div className="row">
      <div className="col-sm-2">
        <h1>Ancillary terms</h1>
      </div>
      <div className="col-sm-10">
        <AncillaryCT
          contents={props.contents["ancillary ct"]}
          dispatch={props.dispatch}
          path={["ancillary ct"]}
        />
      </div>
    </div>
  );
}
