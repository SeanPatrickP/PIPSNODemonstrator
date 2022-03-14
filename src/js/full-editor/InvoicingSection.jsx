import React from "react";
import InvoicingCT from "../cts/InvoicingCT";

export default function InvoicingSection(props) {
  return (
    <div className="row">
      <div className="col-sm-2">
        <h1>Invoicing</h1>
      </div>
      <div className="col-sm-10">
        <InvoicingCT
          contents={props.contents["invoicing ct"]}
          dispatch={props.dispatch}
          path={["invoicing ct"]}
          allProductNames={props.allProductNames}
        />
      </div>
    </div>
  );
}
