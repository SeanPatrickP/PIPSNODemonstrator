import React, { useEffect, useState } from "react";
import InventoryPeriodCTList from "../cts/InventoryPeriodCTList";
import VerticalSelectionList from "../common/VerticalSelectionList";
import ProductSelector from "../common/ProductSelector";
import InventoryPeriodBulkCopyMenu from "../common/InventoryPeriodBulkCopyMenu";
import {
  ALL_PERIOD_NAMES,
  FIRST_MONTH_START_DATE,
  INDICATES_AN_ACTIVE_INVENTORY_PERIOD,
  INDICATES_AN_INACTIVE_INVENTORY_PERIOD,
  LAST_MONTH_END_DATE,
} from "../common/constants";

export default function InventoryPeriodSection(props) {
  const [selectedSection, setSelectedSection] = useState("");
  const [populatedSections, setPopulatedSections] = useState([]);

  useEffect(() => {
    let activeSections = [];

    props.contents["inventory cts"][props.selectedProductIndex][
      "inventory period cts"
    ].forEach((inventoryPeriodSection) => {
      if (inventoryPeriodSection && inventoryPeriodSection["period name"])
        activeSections.push(
          inventoryPeriodSection["period name"].toUpperCase()
        );
    });

    setPopulatedSections(activeSections);
  }, [
    props.contents["inventory cts"][props.selectedProductIndex][
      "inventory period cts"
    ].length,
  ]);

  return (
    <div className="row" key="inventory periods section">
      <div className="col-sm-2">
        <h1>Inventory periods</h1>
        <VerticalSelectionList
          sections={ALL_PERIOD_NAMES}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          populatedSections={populatedSections}
          tooltipPopulated={INDICATES_AN_ACTIVE_INVENTORY_PERIOD}
          tooltipUnpopulated={INDICATES_AN_INACTIVE_INVENTORY_PERIOD}
        />
      </div>
      <div className="col-sm-10 inventory-periods-col">
        <ProductSelector
          allProductNames={props.allProductNames}
          selectedProductIndex={props.selectedProductIndex}
          setSelectedProductIndex={props.setSelectedProductIndex}
        />
        <div className="selector"></div>
        <div className="selector-bottom">
          <InventoryPeriodBulkCopyMenu
            contents={props.contents["inventory cts"]}
            dispatch={props.dispatch}
            allProductNames={props.allProductNames}
            selectedProductIndex={props.selectedProductIndex}
            selectedSection={selectedSection}
            populatedSections={populatedSections}
          />
        </div>
        <InventoryPeriodCTList
          contents={
            props.contents["inventory cts"][props.selectedProductIndex][
              "inventory period cts"
            ]
          }
          productType={
            props.contents["inventory cts"][props.selectedProductIndex][
              "product ct"
            ]["product type"]
          }
          dispatch={props.dispatch}
          selectedSection={selectedSection}
          dealStartDate={props.contents["deal info ct"]["start date"]}
          dealEndDate={props.contents["deal info ct"]["end date"]}
          dealMonthStartDate={
            props.contents["deal info ct"][FIRST_MONTH_START_DATE.toLowerCase()]
          }
          dealMonthEndDate={
            props.contents["deal info ct"][LAST_MONTH_END_DATE.toLowerCase()]
          }
          allProductNames={props.allProductNames}
          selectedProductIndex={props.selectedProductIndex}
          dealInfo={props.contents["deal info ct"]}
          populatedSections={populatedSections}
        />
      </div>
    </div>
  );
}
