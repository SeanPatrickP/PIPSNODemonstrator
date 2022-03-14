import React, { useEffect, useState } from "react";
import BulkFieldsInput from "../common/BulkFieldsInput";
import HeaderActionColumn from "../common/HeaderActionColumn";
import { useStringChoices } from "../common/StringChoicesContext";
import { cloneDeep } from "lodash";
import { changeHandlerBasic } from "../common/useDeepObject";
import {
  DOUBLE_INPUT,
  FUNDING,
  INV_QUANTITY_CT,
  RISK,
  STRING_CHOICES_SELECTOR_INPUT,
  TEXT_INPUT,
} from "../common/constants";
import { resolveFilteredQuantities } from "../common/InputHelper";

export default function DefaultQuantityCT(props) {
  const stringChoices = useStringChoices(
    { __type: INV_QUANTITY_CT },
    [],
    ["unit", "tolerance unit"]
  );

  const bulkFieldInputs = [
    {
      title: "Min quantity",
      fieldPath: "min quantity",
      type: DOUBLE_INPUT,
    },
    {
      title: "Max quantity",
      fieldPath: "max quantity",
      type: DOUBLE_INPUT,
    },
    {
      title: "Max increase",
      fieldPath: "max increase",
      type: DOUBLE_INPUT,
    },
    {
      title: "Max decrease",
      fieldPath: "max decrease",
      type: DOUBLE_INPUT,
    },
    {
      title: "Base volume",
      fieldPath: "base volume",
      type: DOUBLE_INPUT,
    },
    {
      title: "Quantity tolerance",
      fieldPath: "tolerance",
      type: DOUBLE_INPUT,
    },
    {
      title: "Quantity netting group",
      fieldPath: "quantity netting group",
      type: TEXT_INPUT,
    },
    {
      title: "Unit",
      fieldPath: "unit",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
    {
      title: "Tolerance unit",
      fieldPath: "tolerance unit",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  const copyDefualtQuantities = (sourceApplication) => {
    let source = props.contents;

    if (sourceApplication === FUNDING) {
      let newDefaultQuantity = cloneDeep(
        source[filteredQuantites.Funding.index]
      );

      newDefaultQuantity.application = RISK;
      source[filteredQuantites.Risk.index] = newDefaultQuantity;
    } else if (sourceApplication === RISK) {
      let newDefaultQuantity = cloneDeep(source[filteredQuantites.Risk.index]);
      newDefaultQuantity.application = FUNDING;
      source[filteredQuantites.Funding.index] = newDefaultQuantity;
    }

    changeHandlerBasic(
      props.dispatch,
      ["inventory cts", props.selectedProductIndex],
      "default quantity cts",
      source
    );
  };

  const generateHeaderTitle = (data, prefix, isFunding, hasRisk) => {
    const minQuantity = `${data["min quantity"]}`;
    const maxQuantity = `${data["max quantity"]}`;
    const unit = data.unit;

    if (isFunding && !hasRisk) {
      prefix = `Funding And Risk ${prefix}`;
    } else if (isFunding) {
      prefix = `Funding ${prefix}`;
    } else {
      prefix = `Risk ${prefix}`;
    }

    if (
      minQuantity &&
      minQuantity.length &&
      maxQuantity &&
      maxQuantity.length &&
      unit &&
      unit.length
    ) {
      return (
        <p>
          {prefix} (From: <b>{minQuantity}</b> To: <b>{maxQuantity}</b>{" "}
          <i>{unit}</i>)
        </p>
      );
    }
  };

  const [filteredQuantites, setFilteredQuantites] = useState(
    resolveFilteredQuantities(props.contents)
  );

  useEffect(() => {
    setFilteredQuantites(resolveFilteredQuantities(props.contents));
  }, [props.selectedProductIndex, props.contents.length]);

  return (
    <div className="container container-with-bottom-panel">
      {FUNDING in filteredQuantites &&
        props.contents[filteredQuantites.Funding.index] && (
          <div className="row" key="Funding Default Quantity Section">
            <HeaderActionColumn
              itemName={generateHeaderTitle(
                props.contents[filteredQuantites.Funding.index],
                "default quantities",
                true,
                RISK in filteredQuantites
              )}
              index={FUNDING}
              setFilteredItems={setFilteredQuantites}
              filteredItems={filteredQuantites}
              selectedSection={props.selectedProductIndex}
              hideActionButtons={true}
            />
            {filteredQuantites.Funding.expanded && (
              <div className="container">
                <div className="inline-nested-ct nested-ct">
                  <div className="expanded-section-header">
                    {RISK in filteredQuantites && (
                      <button
                        className="btn btn-primary row-action-button float-right"
                        onClick={() => {
                          copyDefualtQuantities(FUNDING);
                        }}
                      >
                        Copy funding default quantities to risk
                      </button>
                    )}
                    {RISK in filteredQuantites && <h1>Funding</h1>}
                    {!(RISK in filteredQuantites) && <h1>Funding and risk</h1>}
                  </div>
                  <BulkFieldsInput
                    fieldNames={bulkFieldInputs}
                    values={props.contents[filteredQuantites.Funding.index]}
                    dispatch={props.dispatch}
                    path={[...props.path, filteredQuantites.Funding.index]}
                    stringChoices={stringChoices}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      {RISK in filteredQuantites &&
        props.contents[filteredQuantites.Risk.index] && (
          <div className="row" key="Risk Default Quantity Section">
            <HeaderActionColumn
              itemName={generateHeaderTitle(
                props.contents[filteredQuantites.Risk.index],
                "default quantities",
                false,
                false
              )}
              index={RISK}
              setFilteredItems={setFilteredQuantites}
              filteredItems={filteredQuantites}
              selectedSection={props.selectedProductIndex}
              hideActionButtons={true}
            />
            {filteredQuantites.Risk.expanded && (
              <div className="container">
                <div className="inline-nested-ct nested-ct">
                  <div className="expanded-section-header">
                    {FUNDING in filteredQuantites && (
                      <button
                        className="btn btn-primary row-action-button float-right"
                        onClick={() => {
                          copyDefualtQuantities(RISK);
                        }}
                      >
                        Copy risk default quantities to funding
                      </button>
                    )}
                    <h1>Risk</h1>
                  </div>
                  <BulkFieldsInput
                    fieldNames={bulkFieldInputs}
                    values={props.contents[filteredQuantites.Risk.index]}
                    dispatch={props.dispatch}
                    path={[...props.path, filteredQuantites.Risk.index]}
                    stringChoices={stringChoices}
                  />
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
