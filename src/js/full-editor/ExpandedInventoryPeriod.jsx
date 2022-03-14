import React, { useState, useEffect } from "react";
import {
  FORMULA_COMPONENT,
  GRADE_ADJUST_FORMULA_NAME,
  GRADE_ADJUSTMENT_FORMULA_COMPONENT,
  ALL_PERIOD_NAMES,
  INV_GRD_ADJ_CT,
} from "../common/constants";
import FormulaComponent from "../common/FormulaComponent";
import GradeAdjustmentComponent from "../common/GradeAdjustmentComponent";
import { cloneDeep } from "lodash";
import { changeHandlerBasic } from "../common/useDeepObject";
import {
  getCheckedInventoryPeriodFormulaeOptions,
  getNewInventoryPeriod,
  resolveModalClass,
} from "../common/InputHelper";
import ConfirmationModal from "../common/ConfirmationModal";
import ModalCopyMenu from "../common/ModalCopyMenu";

export default function ExpandedInventoryPeriod(props) {
  const [
    showFormulaCopyConfirmationModal,
    setShowFormulaCopyConfirmationModal,
  ] = useState(false);
  const [
    showGradeAdjustmentCopyConfirmationModal,
    setShowGradeAdjustmentCopyConfirmationModal,
  ] = useState(false);
  const [showGradeAdjustmentCopyModal, setShowGradeAdjustmentCopyModal] =
    useState(false);
  const [
    copyGradeAdjustmentToOtherInventoryPeriodsCheckedOptions,
    setCopyGradeAdjustmentToOtherInventoryPeriodsCheckedOptions,
  ] = useState({});
  const [currentFormulaIndex, setCurrentFormulaIndex] = useState(-1);
  const [formulaCount, setFormulaCount] = useState(props.formulaCount);
  const [copyTriggered, setCopyTriggered] = useState(false);

  const fieldsToCopy = [
    "currency",
    "max quantity",
    "price cap",
    "price component cts",
  ];

  const toggleShowFormulaCopyConfirmationModal = (formulaIndex) => {
    setCurrentFormulaIndex(formulaIndex);
    setShowFormulaCopyConfirmationModal(!showFormulaCopyConfirmationModal);
  };

  const toggleShowGradeAdjustmentCopyConfirmationModal = () => {
    setShowGradeAdjustmentCopyConfirmationModal(
      !showGradeAdjustmentCopyConfirmationModal
    );
  };

  const toggleShowGradeAdjustmentCopyModal = (formulaIndex) => {
    setCopyGradeAdjustmentToOtherInventoryPeriodsCheckedOptions({});
    setCurrentFormulaIndex(formulaIndex);
    setShowGradeAdjustmentCopyModal(!showGradeAdjustmentCopyModal);
  };

  const copyFormulaeToAllInPeriod = (indexToCopyFrom) => {
    if (indexToCopyFrom === -1) {
      return;
    }

    const source =
      props.contents[props.inventoryPeriodIndex]["price cts"][indexToCopyFrom];
    let allFormulaeForPeriod =
      props.contents[props.inventoryPeriodIndex]["price cts"];

    allFormulaeForPeriod.map((formula, index) => {
      if (index !== indexToCopyFrom) {
        fieldsToCopy.forEach((field) => {
          if (field in source) {
            formula[field] = cloneDeep(source[field]);
          }
        });
      }
    });

    changeHandlerBasic(
      props.dispatch,
      [...props.path, props.fieldName, props.inventoryPeriodIndex],
      "price cts",
      allFormulaeForPeriod
    );

    setCopyTriggered(true);
  };

  const copyGradeAdjustmentToOtherInventoryPeriodsInProduct = (
    indexToCopyFrom
  ) => {
    if (indexToCopyFrom === -1) {
      return;
    }

    const sourceToCopyFrom =
      props.contents[props.inventoryPeriodIndex]["price cts"][indexToCopyFrom];
    let allInventoryPeriodsForProduct = props.contents;
    let localCheckedOptions = cloneDeep(
      copyGradeAdjustmentToOtherInventoryPeriodsCheckedOptions
    );

    allInventoryPeriodsForProduct.map((inventoryPeriod, index) => {
      let indexToReplace = -1;
      if (
        index !== props.inventoryPeriodIndex &&
        inventoryPeriod["period name"] &&
        inventoryPeriod["period name"] in
          copyGradeAdjustmentToOtherInventoryPeriodsCheckedOptions
      ) {
        inventoryPeriod["price cts"].map((formula, formulaeIndex) => {
          if (formula["formula name"] === GRADE_ADJUST_FORMULA_NAME) {
            indexToReplace = formulaeIndex;
          }
        });

        if (indexToReplace !== -1) {
          inventoryPeriod["price cts"][indexToReplace] =
            cloneDeep(sourceToCopyFrom);
        } else {
          inventoryPeriod["price cts"].push(cloneDeep(sourceToCopyFrom));
        }
        delete localCheckedOptions[inventoryPeriod["period name"]];
      }
    });

    if (Object.keys(localCheckedOptions).length) {
      Object.keys(localCheckedOptions).forEach((checkedOption) => {
        let newPeriod = cloneDeep(getNewInventoryPeriod(checkedOption, "", ""));
        newPeriod["price cts"].push(cloneDeep(sourceToCopyFrom));
        allInventoryPeriodsForProduct.push(newPeriod);
        delete localCheckedOptions[checkedOption];
      });
    }

    changeHandlerBasic(
      props.dispatch,
      props.path,
      props.fieldName,
      allInventoryPeriodsForProduct
    );

    toggleShowGradeAdjustmentCopyModal();
  };

  const getFormulaComponent = (title, index, type) => {
    return {
      title: title,
      index: index,
      type: type,
    };
  };

  const getFormulaeComponentSchema = (checkedOptions) => {
    let schema = [];

    Object.keys(checkedOptions).forEach((formulaName) => {
      let formulaComponent = FORMULA_COMPONENT;

      if (formulaName === GRADE_ADJUST_FORMULA_NAME) {
        formulaComponent = GRADE_ADJUSTMENT_FORMULA_COMPONENT;
      }

      schema.push(
        getFormulaComponent(
          formulaName,
          checkedOptions[formulaName],
          formulaComponent
        )
      );
    });

    return schema;
  };

  const getInventoryPeriodsWithActiveGradeAdjustment = () => {
    let active = [];

    props.contents.forEach((inventoryPeriod) => {
      if (
        inventoryPeriod &&
        inventoryPeriod["price cts"] &&
        inventoryPeriod["price cts"].length &&
        inventoryPeriod["period name"] &&
        inventoryPeriod["period name"].length
      ) {
        inventoryPeriod["price cts"].forEach((priceCt) => {
          if (priceCt && priceCt.__type && priceCt.__type === INV_GRD_ADJ_CT) {
            active.push(inventoryPeriod["period name"].toUpperCase());
          }
        });
      }
    });

    return active;
  };

  const [checkedOptions, setCheckedOptions] = useState(
    getCheckedInventoryPeriodFormulaeOptions(
      props.contents[props.inventoryPeriodIndex]["price cts"]
    )
  );

  const [formulaeSchema, setFormulaSchema] = useState(
    getFormulaeComponentSchema(checkedOptions)
  );

  useEffect(() => {
    if (props.formulaCount !== formulaCount) {
      setFormulaCount(props.formulaCount);
      const updatedCheckedOptions = getCheckedInventoryPeriodFormulaeOptions(
        props.contents[props.inventoryPeriodlndex]["price cts"]
      );

      setCheckedOptions(updatedCheckedOptions);
      setFormulaSchema(getFormulaeComponentSchema(updatedCheckedOptions));
    }
  }, [props.formulaCount]);

  useEffect(() => {
    setCopyTriggered(false);
  }, [copyTriggered]);

  return (
    <div className="container">
      <ConfirmationModal
        showModal={showFormulaCopyConfirmationModal}
        toggleShowModal={toggleShowFormulaCopyConfirmationModal}
        dangerActionFunction={() =>
          copyFormulaeToAllInPeriod(currentFormulaIndex)
        }
        dangerActionButtonText="Copy to all formulae in this inventory period"
        header="Confirm copy to all formulae in this inventory period"
        confirmationText="Please note, this action will overwrite the existing formulae (except for grade adjustment) in the inventory period you are copying within."
      />
      <ConfirmationModal
        showModal={showGradeAdjustmentCopyConfirmationModal}
        toggleShowModal={toggleShowGradeAdjustmentCopyConfirmationModal}
        dangerActionFunction={() =>
          copyGradeAdjustmentToOtherInventoryPeriodsInProduct(
            currentFormulaIndex
          )
        }
        dangerActionButtonText="Copy grade adjustment to other inventory period(s)"
        header="Confirm copy grade adjustment to other inventory period(s)"
        confirmationText="Please note, this action will overwrite the existing grade adjustment in the inventory period(s) you are copying to."
      />
      <ModalCopyMenu
        header="Copy grade adjustment to other inventory period(s)"
        showModal={showGradeAdjustmentCopyModal}
        toggleShowModal={toggleShowGradeAdjustmentCopyModal}
        copyFunction={toggleShowGradeAdjustmentCopyConfirmationModal}
        options={ALL_PERIOD_NAMES}
        selectedSection={props.inventoryPeriodName}
        checkedOptions={
          copyGradeAdjustmentToOtherInventoryPeriodsCheckedOptions
        }
        setCheckedOptions={
          setCopyGradeAdjustmentToOtherInventoryPeriodsCheckedOptions
        }
        onShow={() =>
          resolveModalClass(
            showGradeAdjustmentCopyModal,
            showGradeAdjustmentCopyConfirmationModal
          )
        }
        populatedSections={getInventoryPeriodsWithActiveGradeAdjustment()}
        tooltipPopulated="Indicates an inventory period that has an active grade adjustment formula"
        tooltipUnpopulated="Indicates an inventory period that has an inactive grade adjustment formula"
      />
      {formulaeSchema.map(function (formulaSchema) {
        return (
          <div key={`expanded inventory period outer ${formulaSchema.index}`}>
            {props.contents[props.inventoryPeriodIndex]["price cts"].length >
              formulaSchema.index && (
              <div
                className="inline-nested-ct nested-ct"
                key={`expanded inventory period formulae ${formulaSchema.index}`}
              >
                <div className="expanded-section-header">
                  {formulaSchema.type === FORMULA_COMPONENT && (
                    <button
                      className="btn btn-primary row-action-button float-right"
                      onClick={() =>
                        toggleShowFormulaCopyConfirmationModal(
                          formulaSchema.index
                        )
                      }
                    >
                      Copy to all formulae in this {props.inventoryPeriodName}
                    </button>
                  )}
                  {formulaSchema.type ===
                    GRADE_ADJUSTMENT_FORMULA_COMPONENT && (
                    <button
                      className="btn btn-primary row-action-button float-right"
                      onClick={() => {
                        toggleShowGradeAdjustmentCopyModal(formulaSchema.index);
                      }}
                    >
                      Copy Grade Adjustment to other inventory period(s) in{" "}
                      {props.allProductNames[props.selectedProductIndex]}
                    </button>
                  )}
                  <h1>{formulaSchema.title}</h1>
                </div>
                {formulaSchema.type === FORMULA_COMPONENT && (
                  <FormulaComponent
                    index={formulaSchema.index}
                    contents={
                      props.contents[props.inventoryPeriodIndex]["price cts"]
                    }
                    dispatch={props.dispatch}
                    path={[
                      ...props.path,
                      props.fieldName,
                      props.inventoryPeriodIndex,
                      "price cts",
                      formulaSchema.index,
                    ]}
                    field="price component cts"
                    id={`formulaComponentGrid ${props.index} ${formulaSchema.index}`}
                    formulaCount={props.formulaCount}
                    productType={props.productType}
                    copyTriggered={copyTriggered}
                  />
                )}
                {formulaSchema.type === GRADE_ADJUSTMENT_FORMULA_COMPONENT && (
                  <GradeAdjustmentComponent
                    contents={
                      props.contents[props.inventoryPeriodIndex]["price cts"][
                        formulaSchema.index
                      ]
                    }
                    dispatch={props.dispatch}
                    path={[
                      ...props.path,
                      props.fieldName,
                      props.inventoryPeriodIndex,
                      "price cts",
                      formulaSchema.index,
                    ]}
                    field="adjustments"
                    id={`GradeAdjustmentGrid ${props.index} ${formulaSchema.index}`}
                    formulaCount={props.formulaCount}
                    productType={props.productType}
                    gridName="Grade adjustment table"
                    rowClass="row table-grid"
                    gridClass="col-sm-8 table-grid-column"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
