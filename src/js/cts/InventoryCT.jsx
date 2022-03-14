import React, { useEffect, useState } from "react";
import HeaderActionColumn from "../common/HeaderActionColumn";
import BulkFieldsInput from "../common/BulkFieldsInput";
import ProductSpecsTable from "../common/ProductSpecsTable";
import OptionalCT from "../common/OptionalCT";
import { useStringChoices } from "../common/StringChoicesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { cloneDeep } from "lodash";
import {
  getAllProductNames,
  getListChoices,
  getSelectedListValue,
  resolveDefaultProductName,
} from "../common/InputHelper";
import { changeHandlerBasic } from "../common/useDeepObject";
import {
  DOUBLE_INPUT,
  EMPTY_CT_OBJECT,
  FUNDING,
  INVENTORY_CT,
  INV_PRODUCT_CT,
  INV_QUANTITY_CT,
  NOM_EVENT_CT,
  INFINITY_KEY,
  STRING_CHOICES_SELECTOR_INPUT,
  TEXT_INPUT,
} from "../common/constants";

export default function InventoryCT(props) {
  const stringChoices = useStringChoices(
    { __type: INV_PRODUCT_CT },
    [],
    ["governing incoterms", "incoterm", "location"]
  );

  const targetNominationsStringChoices = useStringChoices(
    { __type: NOM_EVENT_CT },
    [],
    ["nominating party", "days type", "when relative", "offset event"]
  );

  const baseTargetNominationsCT = {
    __type: NOM_EVENT_CT,
    "days count": 0,
    "days type": "Calendar Days",
    "nominated thing": "Target Level",
    "nominating party": "Buyer",
    "offset event": "",
    "when relative": "",
  };

  const getBaseProduct = (productName) => {
    return {
      __type: INVENTORY_CT,
      "inventory period cts": [],
      "product ct": {
        __type: INV_PRODUCT_CT,
        "delivery point": "",
        "governing incoterms": "",
        grade: "",
        incoterm: "",
        location: "",
        material: "",
        "product name": productName,
        "product spec list": [],
        "ending level nomination ct": cloneDeep(EMPTY_CT_OBJECT),
        "nomination ct": baseTargetNominationsCT,
      },
      "default quantity cts": [
        {
          __type: INV_QUANTITY_CT,
          application: FUNDING,
          "max quantity": 10000,
          "max decrease": INFINITY_KEY,
          "max increase": INFINITY_KEY,
          "min quantity": 1000,
          tolerance: 100,
          "tolerance unit": "US barrel",
          unit: "US barrel",
          "base volume": INFINITY_KEY,
        },
      ],
      "quantity cts": [],
    };
  };

  const onProductNameChange = (newProductName, productPath) => {
    if (productPath && productPath.length === 3) {
      let productNames = getAllProductNames(props.contents);
      productNames[productPath[1]] = newProductName;
      props.setAllProductNames(productNames);
    }
  };

  const bulkFieldInputs = [
    {
      title: "Product name",
      fieldPath: "product name",
      type: TEXT_INPUT,
      postUpdateAction: onProductNameChange,
    },
    {
      title: "Delivery point",
      fieldPath: "delivery point",
      type: TEXT_INPUT,
    },
    {
      title: "Governing incoterms",
      fieldPath: "governing incoterms",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Incoterm",
      fieldPath: "incoterm",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Location",
      fieldPath: "location",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  const haircutRatesBulkFieldInputs = [
    {
      title: "Initial haircut rate",
      fieldPath: "initial haircut rate",
      type: DOUBLE_INPUT,
    },
    {
      title: "Interim haircut rate",
      fieldPath: "interim haircut rate",
      type: DOUBLE_INPUT,
    },
  ];

  const targetNominationsBulkFieldInputs = [
    {
      title: "Party",

      fieldPath: "nominating party",

      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Days count",
      fieldPath: "days count",
      type: DOUBLE_INPUT,
    },
    {
      title: "Days type",
      fieldPath: "days type",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "When",
      fieldPath: "when relative",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Offset event",
      fieldPath: "offset event",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  const getFilteredProductNames = () => {
    let productNames = {};

    props.allProductNames.map((productName, index) => {
      productNames[index] = { expanded: false, index: index };
    });

    return productNames;
  };

  const addNewProduct = () => {
    let newInventoryCts = props.contents["inventory cts"];
    const newProduct = getBaseProduct(newInventoryNameToAdd);
    newInventoryCts.push(newProduct);
    changeHandlerBasic(props.dispatch, [], "inventory cts", newInventoryCts);
    setNewInventoryNameToAdd("");
  };

  const cloneProduct = (toClone) => {
    let clone = cloneDeep(toClone);
    let newProductName = clone["product ct"]["product name"];

    while (props.allProductNames.indexOf(newProductName) !== -1) {
      newProductName = `${newProductName} *`;
    }

    clone["product ct"]["product name"] = newProductName;

    return clone;
  };

  const deleteProduct = (contents, index) => {
    contents.splice(index, 1);
    props.setSelectedProductIndex(
      resolveDefaultProductName(contents, props.selectedProductIndex)
    );

    return contents;
  };

  const [enabledAddInventory, setEnabledAddInventory] = useState(false);
  const [newInventoryNameToAdd, setNewInventoryNameToAdd] = useState("");
  const [hasTargetNominationsCT, setHasTargetNominationsCT] = useState(false);
  const [filteredProductNames, setFilteredProductNames] = useState(
    getFilteredProductNames()
  );

  useEffect(() => {
    if (
      newInventoryNameToAdd.length &&
      props.allProductNames.indexOf(newInventoryNameToAdd) === -1
    ) {
      return setEnabledAddInventory(true);
    }

    setEnabledAddInventory(false);
  }, [newInventoryNameToAdd]);

  useEffect(() => {
    props.setAllProductNames(getAllProductNames(props.contents));
  }, [props.contents["inventory cts"].length]);

  useEffect(() => {
    setFilteredProductNames(getFilteredProductNames());
  }, [props.allProductNames.length]);

  return (
    <div className="container container-with-bottom-panel">
      {Object.values(filteredProductNames).map(function (product) {
        return (
          <div className="row" key={`product row ${product.index}`}>
            {props.contents["inventory cts"][product.index] && (
              <HeaderActionColumn
                itemName={
                  <p>
                    {props.contents["inventory cts"][product.index][
                      "product ct"
                    ]["product name"] || ""}
                  </p>
                }
                index={product.index}
                dispatch={props.dispatch}
                contents={props.contents["inventory cts"]}
                setFilteredIterns={setFilteredProductNames}
                filteredltems={filteredProductNames}
                path={[]}
                fieldName="inventory cts"
                customClone={cloneProduct}
                customDelete={deleteProduct}
                copyEnabled={true}
              />
            )}
            {product.expanded &&
              props.contents["inventory cts"][product.index] && (
                <div className="container">
                  <div className="inline-nested-ct nested-ct">
                    <div className="expanded-section-header">
                      <h1>Product details</h1>
                    </div>
                    <BulkFieldsInput
                      fieldNames={bulkFieldInputs}
                      values={
                        props.contents["inventory cts"][product.index][
                          "product ct"
                        ]
                      }
                      dispatch={props.dispatch}
                      path={[...props.path, product.index, "product ct"]}
                      stringChoices={stringChoices}
                    />
                    {props.showHaircutRates && (
                      <BulkFieldsInput
                        fieldNames={haircutRatesBulkFieldInputs}
                        values={
                          props.contents["inventory cts"][product.index][
                            "product ct"
                          ]
                        }
                        dispatch={props.dispatch}
                        path={[...props.path, product.index, "product ct"]}
                      />
                    )}
                    <div className="row">
                      <div className="col-sm-3">Product type:</div>
                      <div className="col-sm-8">
                        <select
                          className="form-control"
                          value={getSelectedListValue(
                            props.productTypes,
                            props.contents["inventory cts"][product.index][
                              "product ct"
                            ]["product type"]
                          )}
                          onChange={(event) =>
                            changeHandlerBasic(
                              props.dispatch,
                              [...props.path, product.index, "product ct"],
                              "product type",
                              event.target.value
                            )
                          }
                        >
                          {getListChoices(
                            props.productTypes,
                            props.contents["inventory cts"][product.index][
                              "product ct"
                            ]["product type"]
                          ).map((productType) => (
                            <option key={productType}>{productType}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="inline-nested-ct nested-ct">
                    <div className="expanded-section-header">
                      <h1>Product specs</h1>
                    </div>
                    <ProductSpecsTable
                      id={`productSpecsGrid ${product.index}`}
                      rows={
                        props.contents["inventory cts"][product.index][
                          "product ct"
                        ]["product spec list"]
                      }
                      product={
                        props.contents["inventory cts"][product.index][
                          "product ct"
                        ]
                      }
                      gridName="Proudct specs table"
                      rowClass="row table-grid"
                      gridClass="col-sm-8 table-grid-column"
                      field="product spec list"
                      dispatch={props.dispatch}
                      path={[...props.path, product.index, "product ct"]}
                    />
                  </div>
                  {props.showTargetNominations && (
                    <>
                      <div className="row">
                        <div className="col-sm-2">
                          <h1>Target nominations</h1>
                        </div>
                        <OptionalCT
                          contents={
                            props.contents["inventory cts"][product.index][
                              "product ct"
                            ]["nomination ct"]
                          }
                          baseCT={baseTargetNominationsCT}
                          context={setHasTargetNominationsCT}
                          dispatch={props.dispatch}
                          path={[
                            ...props.path,
                            product.index,
                            "product ct",
                            "nomination ct",
                          ]}
                        />
                      </div>
                      {hasTargetNominationsCT && (
                        <BulkFieldsInput
                          fieldNames={targetNominationsBulkFieldInputs}
                          values={
                            props.contents["inventory cts"][product.index][
                              "product ct"
                            ]["nomination ct"]
                          }
                          dispatch={props.dispatch}
                          path={[
                            ...props.path,
                            product.index,
                            "product ct",
                            "nomination ct",
                          ]}
                          stringChoices={targetNominationsStringChoices}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
          </div>
        );
      })}
      <div className="row bottom" key="inventories bottom row">
        <div className="col-sm-3">Add new inventory:</div>
        <div className="col-sm-8">
          <input
            className="form-control"
            value={newInventoryNameToAdd}
            onChange={(event) => setNewInventoryNameToAdd(event.target.value)}
          />
        </div>
        <div className="col-sm-1 button-col-right">
          <button
            className="small-action-button"
            onClick={addNewProduct}
            disabled={!enabledAddInventory}
            title="Add product"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="button-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
