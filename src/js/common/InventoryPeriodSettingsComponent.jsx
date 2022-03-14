import React, { useState, useEffect } from "react";
import StringChoicesContext, { useStringChoices } from "./StringChoicesContext";
import StringChoicesSelector from "./StringChoicesSelector";
import { Modal, ModalHeader, ModalBody } from "@react/modal";
import {
  ALL_FORMULA_NAMES,
  DATE_INPUT,
  GRADE_ADJUST_FORMULA_NAME,
  INV_PERIOD_CT,
  INV_GRD_ADJ_CT,
  PROVISIONAL_PERIOD_NAMES,
  INFINITY_KEY,
  UN_NAMED_FORMULA,
  FIRST_MONTH_START_DATE,
  LAST_MONTH_END_DATE,
  DATE_INTERVAL_START_DATE,
  DATE_INTERVAL_END_DATE,
} from "./constants";
import BulkFieldsInput from "./BulkFieldsInput";
import {
  formatToDate,
  getCheckedInventoryPeriodFormulaeOptions,
  getNewInventoryPeriodPriceCTs,
} from "./InputHelper";
import { changeHandlerBasic } from "./useDeepObject";
import { cloneDeep } from "lodash";
import { Checkbox } from "@react/checkbox";

export default function InventoryPeriodSettingsComponent(props) {
  const [selectedSection, setSelectedSection] = useState(props.selectedSection);

  const stringChoices = useStringChoices(
    { __type: INV_PERIOD_CT },
    [],
    ["quantity type"]
  );

  const getStartDateTitle = () => {
    if (
      props.dealInfo &&
      props.dealInfo["granular pricing"] &&
      props.inventoryPeriodName &&
      PROVISIONAL_PERIOD_NAMES.indexOf(props.inventoryPeriodName) !== -1
    ) {
      return "First Flow Date";
    }

    return FIRST_MONTH_START_DATE;
  };

  const getEndDateTitle = () => {
    if (
      props.dealInfo &&
      props.dealInfo["granular pricing"] &&
      props.inventoryPeriodName &&
      PROVISIONAL_PERIOD_NAMES.indexOf(props.inventoryPeriodName) !== -1
    ) {
      return "Last Flow Date";
    }

    return LAST_MONTH_END_DATE;
  };

  const bulkFieldInputs = [
    {
      title: getStartDateTitle(),
      fieldPath: "period start date",
      type: DATE_INPUT,
      linkedDate: "period end date",
    },
    {
      title: getEndDateTitle(),
      fieldPath: "period end date",
      type: DATE_INPUT,
      linkedDate: "period start date",
    },
  ];

  const getGradeAdjustmentSchema = (formulaName) => {
    return {
      "formula name": formulaName,
      adjustments: [],
      "use fifo queue": 0,
      precision: INFINITY_KEY,
      __type: INV_GRD_ADJ_CT,
    };
  };

  const selectEntireDealRange = () => {
    changeHandlerBasic(
      props.dispatch,
      props.path,
      "period start date",
      formatToDate(DATE_INTERVAL_START_DATE)
    );

    changeHandlerBasic(
      props.dispatch,
      props.path,
      "period end date",
      formatToDate(DATE_INTERVAL_END_DATE)
    );
  };

  const selectDeSelectFormulaeOption = (formulaName) => {
    let currentFormulae = props.contents["price cts"];

    if (formulaName in checkedOptions) {
      currentFormulae.splice(checkedOptions[formulaName], 1);
    } else {
      if (formulaName === UN_NAMED_FORMULA) {
        formulaName = "";
      }

      if (formulaName === GRADE_ADJUST_FORMULA_NAME) {
        currentFormulae.push(getGradeAdjustmentSchema(formulaName));
      } else {
        currentFormulae.push(getNewInventoryPeriodPriceCTs(formulaName));
      }
    }

    changeHandlerBasic(
      props.dispatch,
      props.path,
      "price cts",
      currentFormulae
    );

    setCheckedOptions(
      getCheckedInventoryPeriodFormulaeOptions(currentFormulae)
    );
  };

  const getFormulaeOptions = () => {
    let formulaNames = cloneDeep(ALL_FORMULA_NAMES);
    let formulaeOptions = [];

    if (UN_NAMED_FORMULA in checkedOptions) {
      formulaNames.unshift(UN_NAMED_FORMULA);
    }

    formulaNames.map((formulaName, index) => {
      formulaeOptions.push(
        <div
          className="row"
          key={`inventory period period name selector ${index}`}
        >
          <div className="col-sm-3">{formulaName}:</div>
          <div className="col-sm-8">
            <Checkbox
              checked={formulaName in checkedOptions}
              onChange={() => selectDeSelectFormulaeOption(formulaName)}
            />
          </div>
        </div>
      );
    });

    return formulaeOptions;
  };

  const [checkedOptions, setCheckedOptions] = useState(
    getCheckedInventoryPeriodFormulaeOptions(props.contents["price cts"])
  );

  useEffect(() => {
    if (props.selectedSection !== selectedSection) {
      setSelectedSection(props.selectedSection);
      setCheckedOptions(
        getCheckedInventoryPeriodFormulaeOptions(props.contents["price cts"])
      );
    }
  }, [props.selectedSection]);

  return (
    <StringChoicesContext.Provider value={stringChoices}>
      <Modal
        visible={props.showSettingsModal}
        onVisibilityToggle={props.toggleShowSettingsModal}
        placement="center"
        className="modal-container-large"
      >
        <ModalHeader onDismissButtonClick={props.toggleShowSettingsModal}>
          {" "}
          Inventory period settings
        </ModalHeader>
        <ModalBody>
          <div className="container nested-ct">
            <div className="row" key="general settings">
              <h1 className="modal-settings-header">General settings</h1>
            </div>
            <BulkFieldsInput
              fieldNames={bulkFieldInputs}
              values={props.contents}
              dispatch={props.dispatch}
              path={props.path}
            />
            <div
              className="row"
              key="expanded inventory period entire date range button"
            >
              <div className="col-sm-3"></div>
              <div className="col-sm-8">
                <a href="#!">
                  <div onClick={selectEntireDealRange}>
                    <h3 className="entire-date-range-selector-text header-row-text cell-click-text">
                      {" "}
                      Select entire deal range dates
                    </h3>
                  </div>
                </a>
              </div>
            </div>
            <div
              className="row"
              key="string choices quantity type expanded inventory period selector"
            >
              <div className="col-sm-3">Quantity type:</div>
              <div className="col-sm-8">
                <StringChoicesSelector
                  value={props.contents["quantity type"]}
                  dispatch={props.dispatch}
                  path={props.path}
                  field="quantity type"
                />
              </div>
            </div>
          </div>
          <div className="container nested-ct">
            <div className="row" key="formulae settings">
              <h1 className="modal-settings-header">Formulae settings</h1>
            </div>
            {getFormulaeOptions()}
          </div>
        </ModalBody>
      </Modal>
    </StringChoicesContext.Provider>
  );
}
