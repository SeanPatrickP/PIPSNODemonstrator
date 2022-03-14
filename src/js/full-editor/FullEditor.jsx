import React, { useEffect, useState } from "react";
import DealInfoSection from "./DealInfoSection";
import InventorySection from "./InventorySection";
import QuantitySection from "./QuantitySection";
import InventoryPeriodSection from "./InventoryPeriodSection";
import FeeSection from "./FeeSection";
import WaterfallSection from "./WaterfallSection";
import CollateralSection from "./CollateralSection";
import InvoicingSection from "./InvoicingSection";
import MiscellaneousFeeSection from "./MiscellaneousFeeSection";
import AncillaryTermSection from "./ AncillaryTermSection";
import HiddenSectionDueToProduct from "../common/HiddenSectionDueToProduct";
import { resolveDefaultProductName } from "../common/InputHelper";

export default function FullEditor({
  contents,
  dispatch,
  allProductNames,
  setAllProductNames,
  productTypes,
}) {
  const [selectedProductIndex, setSelectedProductIndex] = useState(
    resolveDefaultProductName(allProductNames, -1)
  );

  const sectionProps = { contents, dispatch, path: [] };

  useEffect(() => {
    setSelectedProductIndex(
      resolveDefaultProductName(allProductNames, selectedProductIndex)
    );
  }, [allProductNames.length]);

  return (
    <div className="container full-editor">
      <div className="container-fluid editor-sections">
        <DealInfoSection
          {...sectionProps}
          allProductNames={allProductNames}
          showPalProvisionals={false}
        />
        <InventorySection
          {...sectionProps}
          allProductNames={allProductNames}
          selectedProductIndex={selectedProductIndex}
          setSelectedProductIndex={setSelectedProductIndex}
          setAllProductNames={setAllProductNames}
          productTypes={productTypes}
          showTargetNominations={true}
          showHaircutRates={true}
        />
        {selectedProductIndex === -1 && (
          <HiddenSectionDueToProduct sectionName="Quantity" />
        )}
        {selectedProductIndex !== -1 && (
          <QuantitySection
            {...sectionProps}
            allProductNames={allProductNames}
            selectedProductIndex={selectedProductIndex}
            setSelectedProductIndex={setSelectedProductIndex}
          />
        )}
        {selectedProductIndex === -1 && (
          <HiddenSectionDueToProduct sectionName="Inventory periods" />
        )}
        {selectedProductIndex !== -1 && (
          <InventoryPeriodSection
            {...sectionProps}
            allProductNames={allProductNames}
            selectedProductIndex={selectedProductIndex}
            setSelectedProductIndex={setSelectedProductIndex}
          />
        )}
        <FeeSection {...sectionProps} allProductNames={allProductNames} />
        <WaterfallSection {...sectionProps} />
        <CollateralSection {...sectionProps} />
        <InvoicingSection {...sectionProps} allProductNames={allProductNames} />
        <MiscellaneousFeeSection {...sectionProps} />
        <AncillaryTermSection {...sectionProps} />
      </div>
    </div>
  );
}
