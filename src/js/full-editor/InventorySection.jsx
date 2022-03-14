import React from "react";
import InventoryCT from "../cts/InventoryCT";

export default function InventorySection(props) {
  return (
    <div className="row">
      <div className="col-sm-2">
        <h1>Inventories</h1>
      </div>
      <div className="col-sm-10">
        <InventoryCT
          contents={props.contents}
          dispatch={props.dispatch}
          path={["inventory cts"]}
          allProductNames={props.allProductNames}
          selectedProductIndex={props.selectedProductIndex}
          setSelectedProductIndex={props.setSelectedProductIndex}
          setAllProductNames={props.setAllProductNames}
          productTypes={props.productTypes}
          showTargetNominations={props.showTargetNominations}
          showHaircutRates={props.showHaircutRates}
        />
      </div>
    </div>
  );
}
