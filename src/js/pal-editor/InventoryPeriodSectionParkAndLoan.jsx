import React, { useEffect, useState } from "react";
import ProductSelector from "../common/ProductSelector";
import FormulaComponent from "../common/FormulaComponent";
import { cloneDeep } from "lodash";
import {
  getNewInventoryPeriod,
  getNewInventoryPeriodPriceCTs,
  getNewInventoryPeriodPriceComponentsCTs,
} from "../common/InputHelper";
import {
  INITIAL_EXCHANGE,
  INTERIM_EXCHANGE,
  INITIAL_PROVISIONAL,
  CLOSING_EXCHANGE,
  CLOSING_PROVISIONAL,
  BASE_VOLUME_FORMULA,
  DATE_INTERVAL_START_DATE_LONG,
  DATE_INTERVAL_END_DATE_LONG,
} from "../common/constants";
import { changeHandlerBasic } from "../common/useDeepObject";

export default function InventoryPeriodSectionParkAndLoan(props) {
  const getBasePriceCTsIndexMap = (productIndex) => {
    return {
      [INITIAL_EXCHANGE]: -1,
      //Interim Exchange is hidden from the park and loan view
      [INTERIM_EXCHANGE]: -1,
      [INITIAL_PROVISIONAL]: -1,
      [CLOSING_EXCHANGE]: -1,
      [CLOSING_PROVISIONAL]: -1,
      selectedProductIndex: productIndex,
    };
  };

  const getNewInventoryPeriodWithPriceCT = (key, weight) => {
    let newInventoryPeriod = cloneDeep(
      getNewInventoryPeriod(
        key,
        DATE_INTERVAL_START_DATE_LONG,
        DATE_INTERVAL_END_DATE_LONG
      )
    );

    let newPriceCTs = cloneDeep(
      getNewInventoryPeriodPriceCTs(BASE_VOLUME_FORMULA)
    );

    newPriceCTs["price component cts"].push(
      cloneDeep(getNewInventoryPeriodPriceComponentsCTs(weight))
    );

    newInventoryPeriod["price cts"].push(newPriceCTs);

    return newInventoryPeriod;
  };

  const getPriceCTsIndexAndRemoveUnUsed = (indexMap, index) => {
    let newIndex = 0;
    let newInventoryPeriods = [];

    props.contents["inventory cts"][index]["inventory period cts"].forEach(
      (inventoryPeriod) => {
        const key = inventoryPeriod["period name"];

        if (
          key in indexMap &&
          indexMap[key] === -1 &&
          key !== INTERIM_EXCHANGE
        ) {
          if (
            !inventoryPeriod["price cts"] ||
            !inventoryPeriod["price cts"].length
          ) {
            newInventoryPeriods.push(getNewInventoryPeriodWithPriceCT(key, 1));
          } else {
            newInventoryPeriods.push(inventoryPeriod);
          }

          indexMap[key] = newIndex;
          newIndex = newIndex + 1;
        }
      }
    );

    for (const [key, value] of Object.entries(indexMap)) {
      if (value === -1) {
        if (key === INTERIM_EXCHANGE) {
          newInventoryPeriods.push(getNewInventoryPeriodWithPriceCT(key, 0));
        } else {
          newInventoryPeriods.push(getNewInventoryPeriodWithPriceCT(key, 1));
        }

        indexMap[key] = newIndex;
        newIndex = newIndex + 1;
      }
    }

    props.contents["inventory cts"][index]["inventory period cts"] =
      newInventoryPeriods;

    changeHandlerBasic(
      props.dispatch,
      ["inventory cts", index],
      "inventory period cts",
      newInventoryPeriods
    );

    return indexMap;
  };

  const [priceCTsIndexMap, setPriceCTsIndexMap] = useState(
    getBasePriceCTsIndexMap(props.selectedProductIndex)
  );

  useEffect(() => {
    for (
      let index = 0;
      index < props.contents["inventory cts"].length;
      index++
    ) {
      const priceCTsIndex = getPriceCTsIndexAndRemoveUnUsed(
        getBasePriceCTsIndexMap(index),
        index
      );

      if (index === props.selectedProductIndex) {
        setPriceCTsIndexMap(priceCTsIndex);
      }
    }
  }, []);

  useEffect(() => {
    if (
      priceCTsIndexMap &&
      props.selectedProductIndex !== priceCTsIndexMap.selectedProductIndex
    ) {
      setPriceCTsIndexMap(
        getPriceCTsIndexAndRemoveUnUsed(
          getBasePriceCTsIndexMap(props.selectedProductIndex),
          props.selectedProductIndex
        )
      );
    }
  }, [props.selectedProductIndex]);

  return (
    <div className="row" key="inventory periods section park and loan">
      <div className="col-sm-2">
        <h1>Inventory periods</h1>
      </div>
      <div className="col-sm-10">
        <ProductSelector
          allProductNames={props.allProductNames}
          selectedProductIndex={priceCTsIndexMap.selectedProductIndex}
          setSelectedProductIndex={props.setSelectedProductIndex}
        />
        {INITIAL_EXCHANGE in priceCTsIndexMap &&
          priceCTsIndexMap[INITIAL_EXCHANGE] !== -1 &&
          props.contents["inventory cts"][
            priceCTsIndexMap.selectedProductIndex
          ]["inventory period cts"][priceCTsIndexMap[INITIAL_EXCHANGE]] && (
            <div className="container nested-ct">
              <div className="expanded-section-header">
                <h1>Initial price</h1>
              </div>
              <FormulaComponent
                index={0}
                contents={
                  props.contents["inventory cts"][
                    priceCTsIndexMap.selectedProductIndex
                  ]["inventory period cts"][priceCTsIndexMap[INITIAL_EXCHANGE]][
                    "price cts"
                  ]
                }
                dispatch={props.dispatch}
                path={[
                  "inventory cts",
                  priceCTsIndexMap.selectedProductIndex,
                  "inventory period cts",
                  priceCTsIndexMap[INITIAL_EXCHANGE],
                  "price cts",
                  0,
                ]}
                field="price component cts"
                id={`formulaComponentGrid 0 ${priceCTsIndexMap[INITIAL_EXCHANGE]}`}
                justFormulaTable={true}
                selectedProductIndex={priceCTsIndexMap.selectedProductIndex}
              />
            </div>
          )}
        {INITIAL_PROVISIONAL in priceCTsIndexMap &&
          priceCTsIndexMap[INITIAL_PROVISIONAL] !== -1 &&
          props.contents["inventory cts"][
            priceCTsIndexMap.selectedProductIndex
          ]["inventory period cts"][priceCTsIndexMap[INITIAL_PROVISIONAL]] && (
            <div className="container nested-ct">
              <div className="expanded-section-header">
                <h1>Initial provisional</h1>
              </div>
              <FormulaComponent
                index={0}
                contents={
                  props.contents["inventory cts"][
                    priceCTsIndexMap.selectedProductIndex
                  ]["inventory period cts"][
                    priceCTsIndexMap[INITIAL_PROVISIONAL]
                  ]["price cts"]
                }
                dispatch={props.dispatch}
                path={[
                  "inventory cts",
                  priceCTsIndexMap.selectedProductIndex,
                  "inventory period cts",
                  priceCTsIndexMap[INITIAL_PROVISIONAL],
                  "price cts",
                  0,
                ]}
                field="price component cts"
                id={`formulaComponentGrid 0 ${priceCTsIndexMap[INITIAL_PROVISIONAL]}`}
                justFormulaTable={true}
                selectedProductIndex={priceCTsIndexMap.selectedProductIndex}
              />
            </div>
          )}
        {CLOSING_EXCHANGE in priceCTsIndexMap &&
          priceCTsIndexMap[CLOSING_EXCHANGE] !== -1 &&
          props.contents["inventory cts"][
            priceCTsIndexMap.selectedProductIndex
          ]["inventory period cts"][priceCTsIndexMap[CLOSING_EXCHANGE]] && (
            <div className="container nested-ct">
              <div className="expanded-section-header">
                <h1>Closing price</h1>
              </div>
              <FormulaComponent
                index={0}
                contents={
                  props.contents["inventory cts"][
                    priceCTsIndexMap.selectedProductIndex
                  ]["inventory period cts"][priceCTsIndexMap[CLOSING_EXCHANGE]][
                    "price cts"
                  ]
                }
                dispatch={props.dispatch}
                path={[
                  "inventory cts",
                  priceCTsIndexMap.selectedProductIndex,
                  "inventory period cts",
                  priceCTsIndexMap[CLOSING_EXCHANGE],
                  "price cts",
                  0,
                ]}
                field="price component cts"
                id={`formulaComponentGrid 0 ${priceCTsIndexMap[CLOSING_EXCHANGE]}`}
                justFormulaTable={true}
                selectedProductIndex={priceCTsIndexMap.selectedProductIndex}
              />
            </div>
          )}
        {CLOSING_PROVISIONAL in priceCTsIndexMap &&
          priceCTsIndexMap[CLOSING_PROVISIONAL] !== -1 &&
          props.contents["inventory cts"][
            priceCTsIndexMap.selectedProductIndex
          ]["inventory period cts"][priceCTsIndexMap[CLOSING_PROVISIONAL]] && (
            <div className="container nested-ct">
              <div className="expanded-section-header">
                <h1>Closing provisional</h1>
              </div>
              <FormulaComponent
                index={0}
                contents={
                  props.contents["inventory cts"][
                    priceCTsIndexMap.selectedProductIndex
                  ]["inventory period cts"][
                    priceCTsIndexMap[CLOSING_PROVISIONAL]
                  ][" price cts"]
                }
                dispatch={props.dispatch}
                path={[
                  "inventory cts",
                  priceCTsIndexMap.selectedProductIndex,
                  "inventory period cts",
                  priceCTsIndexMap[CLOSING_PROVISIONAL],
                  "price cts",
                  0,
                ]}
                field="price component cts"
                id={`formulaComponentGrid 0 ${priceCTsIndexMap[CLOSING_PROVISIONAL]}`}
                justFormulaTable={true}
                selectedProductIndex={priceCTsIndexMap.selectedProductIndex}
              />
            </div>
          )}
      </div>
    </div>
  );
}
