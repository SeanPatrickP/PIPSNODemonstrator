import React from "react";
import DefaultQuantityCTParkAndLoan from "./DefaultQuantityCTParkAndLoan";
import ProductSelector from "../common/ProductSelector";

export default function QuantitySectionParkAndLoan(props) {
  return (
    <div className="row" key="quantity section">
      <div className="col-sm-2">
        <h1>Quantity</h1>
      </div>
      <div className="col-sm-10">
        <div>
          <ProductSelector
            allProductNames={props.allProductNames}
            selectedProductIndex={props.selectedProductIndex}
            setSelectedProductIndex={props.setSelectedProductIndex}
          />
          <DefaultQuantityCTParkAndLoan
            contents={props.contents["inventory cts"]}
            path={["inventory cts"]}
            dispatch={props.dispatch}
            selectedProductIndex={props.selectedProductIndex}
          />
        </div>
      </div>
    </div>
  );
}
