import React, { useState } from "react";
import { changeHandlerBasic } from "./useDeepObject";
import { cloneDeep } from "lodash";
import { INV_QUANTITY_CT, RISK, INFINITY_KEY } from "./constants";
import ModalCopyMenu from "./ModalCopyMenu";
import ConfirmationModal from "./ConfirmationModal";
import { resolveModalClass } from "./InputHelper";

export default function QuantityActionMenu(props) {
  const [showCopyConfirmationModal, setShowCopyConfirmationModal] =
    useState(false);

  const [showConvergeConfirmationModal, setShowConvergeConfirmationModal] =
    useState(false);

  const [showCopyToOtherProductsModal, setShowCopyToOtherProductsModal] =
    useState(false);

  const [
    copyToOtherProductsCheckedOptions,
    setCopyToOtherProductsCheckedOptions,
  ] = useState({});

  const riskDefaultQuantities = {
    __type: INV_QUANTITY_CT,
    application: RISK,
    "max quantity": 10000,
    "max decrease": INFINITY_KEY,
    "max increase": INFINITY_KEY,
    "min quantity": 1000,
    tolerance: 100,
    "tolerance unit": "US barrel",
    unit: "US barrel",
    "base volume": INFINITY_KEY,
  };

  const toggleShowCopyConfirmationModal = () => {
    setShowCopyConfirmationModal(!showCopyConfirmationModal);
  };

  const toggleShowConvergeConfirmationModal = () => {
    setShowConvergeConfirmationModal(!showConvergeConfirmationModal);
  };

  const toggleShowCopyToOtherProductsModal = () => {
    setCopyToOtherProductsCheckedOptions({});
    setShowCopyToOtherProductsModal(!showCopyToOtherProductsModal);
  };

  const copyDefaultQuantitiesToOtherProducts = () => {
    let products = props.contents;
    let sourceToCopyFrom =
      products[props.selectedProductIndex]["default quantity cts"];

    products.map((productData, index) => {
      if (
        index !== props.selectedProductIndex &&
        productData["product ct"]["product name"] &&
        productData["product ct"]["product name"] in
          copyToOtherProductsCheckedOptions
      ) {
        products[index]["default quantity cts"] = cloneDeep(sourceToCopyFrom);
      }

      changeHandlerBasic(props.dispatch, [], "inventory cts", products);
    });

    toggleShowCopyToOtherProductsModal();
  };

  const addRiskDefaultQuantitiesToProduct = () => {
    let newDefaultQuantities =
      props.contents[props.selectedProductIndex]["default quantity cts"];

    newDefaultQuantities.push(cloneDeep(riskDefaultQuantities));

    changeHandlerBasic(
      props.dispatch,
      ["inventory cts", props.selectedProductIndex],
      "default quantity cts",
      newDefaultQuantities
    );
  };

  const removeRiskDefaultQuantitiesFromProduct = () => {
    let newDefaultQuantities =
      props.contents[props.selectedProductIndex]["default quantity cts"];
    let riskDefaultQuantitiesIndex = -1;

    newDefaultQuantities.map((defaultQuantities, index) => {
      if (defaultQuantities.application === RISK) {
        riskDefaultQuantitiesIndex = index;
      }
    });

    if (riskDefaultQuantitiesIndex !== -1) {
      newDefaultQuantities.splice(riskDefaultQuantitiesIndex, 1);

      changeHandlerBasic(
        props.dispatch,
        ["inventory cts", props.selectedProductIndex],
        "default quantity cts",
        newDefaultQuantities
      );
    }
  };

  return (
    <>
      <ConfirmationModal
        showModal={showCopyConfirmationModal}
        toggleShowModal={toggleShowCopyConfirmationModal}
        dangerActionFunction={copyDefaultQuantitiesToOtherProducts}
        dangerActionButtonText="Copy default quantities to selected product(s)"
        header="Confirm copy default quantities to other product(s)"
        confirmationText="Please note, this action will overwrite existing default quantities in the product(s) you are copying to."
      />
      <ConfirmationModal
        showModal={showConvergeConfirmationModal}
        toggleShowModal={toggleShowConvergeConfirmationModal}
        dangerActionFunction={removeRiskDefaultQuantitiesFromProduct}
        dangerActionButtonText="Converge funding and risk default quantities"
        header="Confirm converge funding and risk default quantities"
        confirmationText="Please note, this action will delete the risk default quantity, leaving just the funding default quantity."
      />
      <ModalCopyMenu
        header="Copy to other product(s)"
        showModal={showCopyToOtherProductsModal}
        toggleShowModal={toggleShowCopyToOtherProductsModal}
        copyFunction={toggleShowCopyConfirmationModal}
        options={props.allProductNames}
        selectedSection={props.allProductNames[props.seIectedProductIndex]}
        checkedOptions={copyToOtherProductsCheckedOptions}
        setCheckedOptions={setCopyToOtherProductsCheckedOptions}
        onShow={() =>
          resolveModalClass(
            showCopyToOtherProductsModal,
            showCopyConfirmationModal
          )
        }
      />
      {props.allProductNames.length > 1 && (
        <div className="selector">
          <button
            className="btn btn-primary"
            onClick={toggleShowCopyToOtherProductsModal}
            key={`${props.selectedProductIndex} copy default quantities to other products button`}
          >
            Copy {props.allProductNames[props.selectedProductIndex]}
            {"'s "}
            default quantities to other product(s)
          </button>
          {props.contents[props.selectedProductIndex]["default quantity cts"]
            .length === 1 && (
            <button
              className="btn btn-secondary secondary-button"
              onClick={addRiskDefaultQuantitiesToProduct}
              key={`${props.selectedProductIndex} add risk default quantities to product button`}
            >
              Split funding and risk default quantities for{""}
              {props.allProductNames[props.selectedProductIndex]}
            </button>
          )}
          {props.contents[props.selectedProductIndex]["default quantity cts"]
            .length === 2 && (
            <button
              className="btn btn-secondary secondary-button"
              onClick={toggleShowConvergeConfirmationModal}
              key={`${props.selectedProductIndex} remove risk default quantities from product button`}
            >
              Converge funding and risk default quantities for{" "}
              {props.allProductNames[props.selectedProductIndex]}
            </button>
          )}
        </div>
      )}
    </>
  );
}
