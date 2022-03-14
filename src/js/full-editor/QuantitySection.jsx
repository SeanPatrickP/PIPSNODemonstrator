import React from "react";
import PeriodQuantitiesTable from "../common/PeriodQuantitiesTable";
import ProductSelector from "../common/ProductSelector";
import QuantityActionMenu from "../common/QuantityActionMenu";
import DefaultQuantityCT from "../cts/DefaultQuantityCT";

export default function QuantitySection(props) {
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
          <div className="selector"></div>
          <div className="selector-bottom">
            <QuantityActionMenu
              contents={props.contents["inventory cts"]}
              dispatch={props.dispatch}
              allProductNames={props.allProductNames}
              selectedProductIndex={props.selectedProductIndex}
            />
          </div>
          <DefaultQuantityCT
            contents={
              props.contents["inventory cts"][props.selectedProductIndex][
                "default quantity cts"
              ]
            }
            path={[
              "inventory cts",
              props.selectedProductIndex,
              "default quantity cts",
            ]}
            dispatch={props.dispatch}
            selectedProductIndex={props.selectedProductIndex}
          />
          <div className="container nested-ct nested-ct-bottom">
            <div className="expanded-section-header">
              <h1>Quantities for this period</h1>
            </div>
            <PeriodQuantitiesTable
              id="period quantities table"
              rows={
                props.contents["inventory cts"][props.selectedProductIndex][
                  "quantity cts"
                ]
              }
              gridName="Period quantities table"
              rowClass="row table-grid"
              gridClass="col-sm-8 table-grid-column"
              field="quantity cts"
              dispatch={props.dispatch}
              path={["inventory cts", props.selectedProductIndex]}
              selectedProductIndex={props.selectedProductIndex}
              dealInfo={props.contents["deal info ct"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
