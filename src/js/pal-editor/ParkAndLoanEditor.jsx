import React, { useEffect, useState } from "react";
import DealInfoSection from "../full-editor/DealInfoSection";
import InventorySection from "../full-editor/InventorySection";
import HiddenSectionDueToProduct from "../common/HiddenSectionDueToProduct";
import QuantitySectionParkAndLoan from "./QuantitySectionParkAndLoan";
import PaymentsSectionParkAndLoan from "./PaymentsSectionParkAndLoan";
import InventoryPeriodSectionParkAndLoan from "./InventoryPeriodSectionParkAndLoan";
import { resolveDefaultProductName } from "../common/InputHelper";
import InvoicingSection from "../full-editor/InvoicingSection";

export default function ParkAndLoanEditor({
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
          showPalProvisionals={true}
        />
        <InventorySection
          {...sectionProps}
          allProductNames={allProductNames}
          selectedProductIndex={selectedProductIndex}
          setSelectedProductIndex={setSelectedProductIndex}
          setAllProductNames={setAllProductNames}
          productTypes={productTypes}
          showTargetNominations={false}
          showHaircutRates={false}
        />
        {selectedProductIndex === -1 && (
          <HiddenSectionDueToProduct sectionName="Quantity" />
        )}
        {selectedProductIndex !== -1 && (
          <QuantitySectionParkAndLoan
            {...sectionProps}
            allProductNames={allProductNames}
            selectedProductIndex={selectedProductIndex}
            setSelectedProductIndex={setSelectedProductIndex}
          />
        )}
        {selectedProductIndex === -1 && (
          <HiddenSectionDueToProduct sectionName="Pricing" />
        )}
        {selectedProductIndex !== -1 && (
          <InventoryPeriodSectionParkAndLoan
            {...sectionProps}
            allProductNames={allProductNames}
            selectedProductindex={selectedProductIndex}
            setSelectedProductIndex={setSelectedProductIndex}
          />
        )}
        <InvoicingSection {...sectionProps} allProductNames={allProductNames} />
        <PaymentsSectionParkAndLoan {...sectionProps} />
      </div>
    </div>
  );
}
