import React, { useState } from "react";
import { changeHandlerBasic } from "./useDeepObject";
import { cloneDeep } from "lodash";
import {
  ALL_PERIOD_NAMES,
  INDICATES_AN_ACTIVE_INVENTORY_PERIOD,
  INDICATES_AN_INACTIVE_INVENTORY_PERIOD,
} from "./constants";
import ModalCopyMenu from "./ModalCopyMenu";
import { resolveModalClass } from "./InputHelper";
import ConfirmationModal from "./ConfirmationModal";

export default function InventoryPeriodBulkCopyMenu(props) {
  const [
    showCopyToOtherProductsConfirmationModal,
    setShowCopyToOtherProductsConfirmationModal,
  ] = useState(false);

  const [
    showCopyToOtherInventoryPeriodsConfirmationModal,
    setShowCopyToOtherInventoryPeriodsConfirmationModal,
  ] = useState(false);

  const [showCopyToOtherProductsModal, setShowCopyToOtherProductsModal] =
    useState(false);

  const [
    showCopyToOtherInventoryPeriodsModal,
    setShowCopyToOtherInventoryPeriodsModal,
  ] = useState(false);

  const [
    copyToOtherProductsCheckedOptions,
    setCopyToOtherProductsCheckedOptions,
  ] = useState({});

  const [
    copyToOtherInventoryPeriodsCheckedOptions,
    setCopyToOtherInventoryPeriodsCheckedOptions,
  ] = useState({});

  const toggleShowCopyToOtherProductsConfirmationModal = () => {
    setShowCopyToOtherProductsConfirmationModal(
      !showCopyToOtherProductsConfirmationModal
    );
  };

  const toggleShowCopyToOtherInventoryPeriodsConfirmationModal = () => {
    setShowCopyToOtherInventoryPeriodsConfirmationModal(
      !showCopyToOtherInventoryPeriodsConfirmationModal
    );
  };

  const toggleShowCopyToOtherProductsModal = () => {
    setCopyToOtherProductsCheckedOptions({});
    setShowCopyToOtherProductsModal(!showCopyToOtherProductsModal);
  };

  const toggleShowCopyToOtherInventoryPeriodsModal = () => {
    setCopyToOtherInventoryPeriodsCheckedOptions({});
    setShowCopyToOtherInventoryPeriodsModal(
      !showCopyToOtherInventoryPeriodsModal
    );
  };

  const copyInventoryPeriodToOtherProducts = () => {
    let sourceToCopyFrom = [];
    let products = props.contents;

    products[props.selectedProductIndex]["inventory period cts"].forEach(
      (sourceInventoryPeriod) => {
        if (
          sourceInventoryPeriod &&
          sourceInventoryPeriod("period name") &&
          sourceInventoryPeriod["period name"] === props.selectedSection
        ) {
          sourceToCopyFrom.push(sourceInventoryPeriod);
        }
      }
    );

    products.map((productData, index) => {
      let newPeriods = [];
      if (
        index !== props.selectedProductIndex &&
        productData["product ct"]["product name"] &&
        productData["product ct"]["product name"] in
          copyToOtherProductsCheckedOptions
      ) {
        productData["inventory period cts"].forEach((inventoryPeriod) => {
          if (
            inventoryPeriod &&
            ((inventoryPeriod["period name"] &&
              inventoryPeriod["period name"] !== props.selectedSection) ||
              !inventoryPeriod["period name"])
          ) {
            newPeriods.push(inventoryPeriod);
          }
        });

        newPeriods = newPeriods.concat(cloneDeep(sourceToCopyFrom));
        products[index]["inventory period cts"] = newPeriods;
      }
    });

    changeHandlerBasic(props.dispatch, [], "inventory cts", products);

    toggleShowCopyToOtherProductsModal();
  };

  const copyInventoryPeriodsFormulaeToOtherInventoryPeriodsForProduct = () => {
    let sourceToCopyFrom = [];
    let newPeriods = [];

    let localCheckedOptions = cloneDeep(
      copyToOtherInventoryPeriodsCheckedOptions
    );

    let processedCheckedOptions = {};

    props.contents[props.selectedProductIndex]["inventory period cts"].forEach(
      (sourceInventoryPeriod) => {
        if (
          sourceInventoryPeriod &&
          sourceInventoryPeriod["period name"] &&
          sourceInventoryPeriod["period name"] === props.selectedSection
        ) {
          sourceToCopyFrom.push(sourceInventoryPeriod);
        }
      }
    );

    props.contents[props.selectedProductIndex]["inventory period cts"].forEach(
      (inventoryPeriod) => {
        if (
          inventoryPeriod &&
          inventoryPeriod["period name"] &&
          inventoryPeriod["period name"] in localCheckedOptions
        ) {
          sourceToCopyFrom.forEach((source) => {
            let replacement = cloneDeep(source);
            replacement["period name"] = inventoryPeriod["period name"];

            newPeriods.push(replacement);
          });

          delete localCheckedOptions[inventoryPeriod["period name"]];
          processedCheckedOptions[inventoryPeriod["period name"]] = true;
        } else if (
          inventoryPeriod &&
          inventoryPeriod["period name"] &&
          !(inventoryPeriod["period name"] in processedCheckedOptions)
        ) {
          newPeriods.push(inventoryPeriod);
        }
      }
    );

    if (Object.keys(localCheckedOptions).length) {
      Object.keys(localCheckedOptions).forEach((checkedOption) => {
        sourceToCopyFrom.forEach((source) => {
          let replacement = cloneDeep(source);
          replacement["period name"] = checkedOption;
          newPeriods.push(replacement);
        });

        delete localCheckedOptions[checkedOption];
      });
    }

    changeHandlerBasic(
      props.dispatch,
      ["inventory cts", props.selectedProductIndex],
      "inventory period cts",
      newPeriods
    );

    toggleShowCopyToOtherInventoryPeriodsModal();
  };

  return (
    <>
      <ConfirmationModal
        showModal={showCopyToOtherProductsConfirmationModal}
        toggleShowModal={toggleShowCopyToOtherProductsConfirmationModal}
        dangerActionFunction={copyInventoryPeriodToOtherProducts}
        dangerActionButtonText="Copy inventory period to selected product(s)"
        header="Confirm copy inventory period to other product(s)"
        confirmationText="Please note, this action will overwrite the existing inventory period in the product(s) you are copying to."
      />
      <ModalCopyMenu
        header="Copy to other product(s)"
        showModal={showCopyToOtherProductsModal}
        toggleShowModal={toggleShowCopyToOtherProductsModal}
        copyFunction={toggleShowCopyToOtherProductsConfirmationModal}
        options={props.allProductNames}
        selectedSection={props.allProductNames[props.selectedProductIndex]}
        checkedOptions={copyToOtherProductsCheckedOptions}
        setCheckedOptions={setCopyToOtherProductsCheckedOptions}
        onShow={() =>
          resolveModalClass(
            showCopyToOtherProductsModal,
            showCopyToOtherProductsConfirmationModal
          )
        }
      />
      <ConfirmationModal
        showModal={showCopyToOtherInventoryPeriodsConfirmationModal}
        toggleShowModal={toggleShowCopyToOtherInventoryPeriodsConfirmationModal}
        dangerActionFunction={
          copyInventoryPeriodsFormulaeToOtherInventoryPeriodsForProduct
        }
        dangerActionButtonText="Copy inventory period to selected other inventory period(s)"
        header="Confirm copy inventory period to selected other inventory period(s)"
        confirmationText="Please note, this action will overwrite existing period(s) in the inventory period(s) you are copying to."
      />
      <ModalCopyMenu
        header="Copy to other inventory period(s)"
        showModal={showCopyToOtherInventoryPeriodsModal}
        toggleShowModal={toggleShowCopyToOtherInventoryPeriodsModal}
        copyFunction={toggleShowCopyToOtherInventoryPeriodsConfirmationModal}
        options={ALL_PERIOD_NAMES}
        selectedSection={props.selectedSection}
        checkedOptions={copyToOtherInventoryPeriodsCheckedOptions}
        setCheckedOptions={setCopyToOtherInventoryPeriodsCheckedOptions}
        onShow={() =>
          resolveModalClass(
            showCopyToOtherInventoryPeriodsModal,
            showCopyToOtherInventoryPeriodsConfirmationModal
          )
        }
        populatedSections={props.populatedSections}
        tooltipPopulated={INDICATES_AN_ACTIVE_INVENTORY_PERIOD}
        tooltipUnpopulated={INDICATES_AN_INACTIVE_INVENTORY_PERIOD}
      />
      <div className="selector">
        {props.allProductNames.length > 1 && (
          <button
            className="btn btn-primary"
            onClick={toggleShowCopyToOtherProductsModal}
            key={`${props.selectedProductIndex} copy inventory period to other products button`}
          >
            Copy {props.allProductNames[props.selectedProductIndex]}
            {"'s "}
            {props.selectedSection} to other product(s)
          </button>
        )}
        <button
          className="btn btn-primary secondary-button"
          onClick={toggleShowCopyToOtherInventoryPeriodsModal}
          key={`${props.selectedProductIndex} copy inventory period to other inventory periods`}
        >
          Copy {props.allProductNames[props.selectedProductIndex]}
          {"'s "}
          {props.selectedSection} to other inventory period(s)
        </button>
      </div>
    </>
  );
}
