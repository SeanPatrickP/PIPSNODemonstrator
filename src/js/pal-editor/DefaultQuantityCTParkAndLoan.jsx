import React, { useEffect, useState } from "react";
import BulkFieldsInput from "../common/BulkFieldsInput";
import { useStringChoices } from "../common/StringChoicesContext";
import {
  DOUBLE_INPUT,
  INV_QUANTITY_CT,
  RISK,
  STRING_CHOICES_SELECTOR_INPUT,
} from "../common/constants";
import { changeHandlerBasic } from "../common/useDeepObject";
import { resolveFilteredQuantities } from "../common/InputHelper";

export default function DefaultQuantityCTParkAndLoan(props) {
  const stringChoices = useStringChoices(
    { __type: INV_QUANTITY_CT },
    [],
    ["unit"]
  );

  const bulkFieldInputs = [
    {
      title: "Quantity",
      fieldPath: "max quantity",
      type: DOUBLE_INPUT,
    },
    {
      title: "Unit",
      fieldPath: "unit",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  const updateAllQuantities = (newQuantity, productIndex, removeRisk) => {
    let newDefaultQuantities = [];

    props.contents[productIndex]["default quantity cts"].forEach(
      (defaultQuantities) => {
        if (
          !removeRisk ||
          (removeRisk &&
            defaultQuantities.application &&
            defaultQuantities.application !== RISK)
        ) {
          defaultQuantities["min quantity"] = newQuantity;
          defaultQuantities["max quantity"] = newQuantity;
          defaultQuantities["base volume"] = newQuantity;
          newDefaultQuantities.push(defaultQuantities);
        }
      }
    );

    props.contents[productIndex]["default quantity cts"] = newDefaultQuantities;

    changeHandlerBasic(
      props.dispatch,
      [...props.path, productIndex],
      "default quantity cts",
      newDefaultQuantities
    );
  };

  const updateAllUnits = (newUnit, productIndex) => {
    let newDefaultQuantities =
      props.contents[productIndex]["default quantity cts"];

    newDefaultQuantities.forEach((defaultQuantities) => {
      defaultQuantities["unit"] = newUnit;
    });

    props.contents[productIndex]["default quantity cts"] = newDefaultQuantities;

    changeHandlerBasic(
      props.dispatch,
      [...props.path, productIndex],
      "default quantity cts",
      newDefaultQuantities
    );
  };

  const getFundingDefaultQuantitiesIndex = (contents) => {
    const filteredQuantites = resolveFilteredQuantities(contents);

    if (filteredQuantites && filteredQuantites.Funding) {
      return filteredQuantites.Funding.index;
    }

    return -1;
  };

  const [fundingDefaultQuantitiesIndex, setFundingDefaultQuantitiesIndex] =
    useState(
      getFundingDefaultQuantitiesIndex(
        props.contents[props.selectedProductIndex]["default quantity cts"]
      )
    );

  useEffect(() => {
    if (fundingDefaultQuantitiesIndex !== -1) {
      updateAllQuantities(
        props.contents[props.selectedProductIndex]["default quantity cts"][
          fundingDefaultQuantitiesIndex
        ]["max quantity"],
        props.selectedProductIndex,
        false
      );
    }
  }, [
    props.contents[props.selectedProductIndex]["default quantity cts"][
      fundingDefaultQuantitiesIndex
    ] &&
      props.contents[props.selectedProductIndex]["default quantity cts"][
        fundingDefaultQuantitiesIndex
      ]["max quantity"],
  ]);

  useEffect(() => {
    if (fundingDefaultQuantitiesIndex !== -1) {
      updateAllUnits(
        props.contents[props.selectedProductIndex]["default quantity cts"][
          fundingDefaultQuantitiesIndex
        ]["unit"],
        props.selectedProductIndex
      );
    }
  }, [
    props.contents[props.selectedProductIndex]["default quantity cts"][
      fundingDefaultQuantitiesIndex
    ] &&
      props.contents[props.selectedProductIndex]["default quantity cts"][
        fundingDefaultQuantitiesIndex
      ]["unit"],
  ]);

  useEffect(() => {
    for (let index = 0; index < props.contents.length; index++) {
      const fundingIndex = getFundingDefaultQuantitiesIndex(
        props.contents[index]["default quantity cts"]
      );

      if (index === props.selectedProductIndex) {
        setFundingDefaultQuantitiesIndex(fundingIndex);
      }

      if (fundingIndex !== -1) {
        updateAllQuantities(
          props.contents[index]["default quantity cts"][fundingIndex][
            "max quantity"
          ],
          index,
          true
        );

        updateAllUnits(
          props.contents[index]["default quantity cts"][fundingIndex][" unit"],
          index
        );
      }
    }
  }, []);

  return (
    <div className="container nested-ct nested-ct-bottom">
      <div className="expanded-section-header">
        <h1>Default quantities</h1>
      </div>
      {fundingDefaultQuantitiesIndex !== -1 && (
        <BulkFieldsInput
          fieldNames={bulkFieldInputs}
          values={
            props.contents[props.selectedProductIndex]["default quantity cts"][
              fundingDefaultQuantitiesIndex
            ]
          }
          dispatch={props.dispatch}
          path={[
            ...props.path,
            props.selectedProductIndex,
            "default quantity cts",
            fundingDefaultQuantitiesIndex,
          ]}
          stringChoices={stringChoices}
        />
      )}
    </div>
  );
}
