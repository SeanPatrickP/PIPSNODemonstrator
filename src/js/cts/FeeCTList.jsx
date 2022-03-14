import React, { useEffect, useState } from "react";
import HeaderActionColumn from "../common/HeaderActionColumn";
import ExpandedFeeSection from "../full-editor/ExpandedFeeSection";
import { changeHandlerBasic } from "../common/useDeepObject";
import {
  ALL_FEE_TYPES,
  PRODUCT_DIFF_FEE,
  MONTHLY_FIXED_FEE,
  DEFERRED_PAYMENT_FEE,
  PER_BARREL_FEE,
  PER_BARREL_MULTI_FEE,
  OPTIONAL_LIST,
  TEXT_INPUT,
  DOUBLE_INPUT,
  STRING_CHOICES_SELECTOR_INPUT,
  SELECTION_INPUT,
  CHECKBOX,
  HIDDEN,
  START_END_DATE,
  CURVE,
  SETTLEMENT_TIERS_TABLE,
  PRICE_COMPONENTS_TABLE,
  DOUBLE_INPUT_CURVE,
  FIXED_FEE,
  ROLL_FEE,
  INFINITY_KEY,
  RDATE_KEY,
  WORKING_CAPITAL_FEE,
  FEE_DATE_OFFSET,
  RATE,
  SPREAD,
  CURVE_KEY,
  LIST,
  DATE_INTERVAL_TYPE,
  WC_FEE_RATE_CT,
  FEE_DATE_OFFSET_TYPE,
  INV_QUANTITY_CT,
  DATE,
  PER_BARREL_MULTI_FEES_TEXT,
  PER_BARREL_FEES_TEXT,
} from "../common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getBaseFeeCurve } from "../common/BasePIPGridHelper";
import {
  parseToRDate,
  parseFromRDate,
  isEmptyArray,
} from "../common/InputHelper";
import { Icon } from "@react/icon-font";
import { cloneDeep } from "lodash";

export default function FeeCTList(props) {
  const [selectedSection, setSelectedSection] = useState(props.selectedSection);
  const [feeType, setFeeType] = useState("");
  const [enabledAddFees, setEnabledAddFees] = useState(false);
  const [enabledAddFeesForEachProduct, setEnabledAddFeesForEachProduct] =
    useState(false);
  const [newFeeNameToAdd, setNewFeeNameToAdd] = useState("");
  const [filteredFees, setFilteredFees] = useState({});
  const [feeId, setFeeId] = useState(1);

  const oneFeeOrTheOther = {
    [PER_BARREL_FEE]: {
      [PER_BARREL_MULTI_FEES_TEXT]:
        'You are only able to add either a "Per Barrel Fee" or a "Per Barrel Multi Fee"',
    },
    [PER_BARREL_MULTI_FEE]: {
      [PER_BARREL_FEES_TEXT]:
        'You are only able to add either a "Per Barrel Multi Fee" or a "Per Barrel Fee"',
    },
  };

  const allowAddNewFeeForEachProduct = {
    [PRODUCT_DIFF_FEE]: true,
  };

  const multipleFeeType = {
    [PER_BARREL_MULTI_FEE]: true,
  };

  const oneFeeRestriction = {
    [PER_BARREL_FEE]: true,
    [PER_BARREL_MULTI_FEE]: true,
  };

  const feeNamePreset = {
    [WORKING_CAPITAL_FEE]: ["Financing Fee"],
    [ROLL_FEE]: ["Roll Fee"],
    [PRODUCT_DIFF_FEE]: ["Diff Reval"],
    [FIXED_FEE]: ["Fixed Fee"],
    [MONTHLY_FIXED_FEE]: ["Monthly Fixed Fee"],
    [DEFERRED_PAYMENT_FEE]: [
      "Deferral Fee",
      "Prepayment Fee",
      "Deferred Payment Availability Fee",
    ],
    [PER_BARREL_FEE]: ["Refinery Crude Purchase Fee"],
    [PER_BARREL_MULTI_FEE]: ["Refinery Crude Purchase Fee"],
  };

  const lockedFeeNames = {
    // Fixed fee has no fee name associated with it in the database
    [FIXED_FEE]: true,
  };

  const stringChoicesByType = {
    [WORKING_CAPITAL_FEE]: [
      "formula string",
      "working capital type",
      "day count fraction",
      "notional type",
      "deviation formula",
      "days type",
    ],
    [ROLL_FEE]: [
      "quantity type",
      "payment term",
      "conversion unit from",
      "conversion unit to",
    ],
    [PRODUCT_DIFF_FEE]: ["quantity type", "reval frequency"],
    [FIXED_FEE]: ["currency", "direction"],
    [MONTHLY_FIXED_FEE]: ["quantity unit", "currency", "days type"],
    [DEFERRED_PAYMENT_FEE]: [
      "deferred payment type",
      "day count fraction",
      "rate fixing avg type",
      "rate index",
      "currency",
      "formula string",
    ],
    [PER_BARREL_FEE]: ["currency"],
    [PER_BARREL_MULTI_FEE]: ["formula string"],
  };

  // If no value key provided in some of the fields below, this means they are optional.

  // Fee name is not optional, it is just passed in when the fee is added

  // String choices dropdowns should always have a value associated with them. If they are connected to a linked field then only the linked field should haave a value set however

  const schemaComponentsByType = {
    [WORKING_CAPITAL_FEE]: [
      {
        title: "Fee name",
        fieldPath: "fee name",
        type: TEXT_INPUT,
      },
      {
        fieldPath: "trade period",
        type: START_END_DATE,
        value: {
          __type: DATE_INTERVAL_TYPE,
          "start date": props.dealStartDate,
          "end date": props.dealEndDate,
        },
      },
      {
        title: "Rate",
        fieldPath: "rate ct",
        type: RATE,
        value: {
          __type: WC_FEE_RATE_CT,
          index: "LIBOR",
          tenor: { [RDATE_KEY]: "RDate Error" },
          "fixing avg type": "Last USO Business Day of the Previous Quarter",
          rate: 0,
          "rate cap": INFINITY_KEY,
          "rate floor": INFINITY_KEY,
          currency: "USO",
          "rate floor curve": {
            [CURVE_KEY]: {
              dates: [],
              values: [],
            },
          },
          "rate cap curve": {
            [CURVE_KEY]: {
              dates: [],
              values: [],
            },
          },
        },
      },
      {
        title: "Spread",
        fieldPath: "spread ct",
        type: SPREAD,
        value: {
          __type: WC_FEE_RATE_CT,
          rate: 0,
          "rate cap": INFINITY_KEY,
          tenor: { [RDATE_KEY]: "RDate Error" },
          currency: "USD",
          "rate floor": INFINITY_KEY,
          "fixing avg type":
            "averaged over whole month of contractual Shipment Period",
          "rate curve": {
            [CURVE_KEY]: {
              dates: [],

              values: [],
            },
          },
          index: "",
        },
      },
      {
        title: "First sample date",
        fieldPath: "first sample date",
        type: DATE,
      },
      {
        title: "Last sample date",
        fieldPath: "last sample date",
        type: DATE,
      },
      {
        title: "Start date for first month day count",
        fieldPath: "start date for first month day count",
        type: DATE,
      },
      {
        title: "End date for last month day count",
        fieldPath: "end date for last month day count",
        type: DATE,
      },
      {
        title: "First trueup month",
        fieldPath: "first trueup month",
        type: START_END_DATE,
      },
      {
        title: "Last trueup month",
        fieldPath: "last trueup month",
        type: START_END_DATE,
      },
      {
        title: "Price constants enabled",
        fieldPath: "price constants enabled",
        type: HIDDEN,
        value: 0,
      },
      {
        title: "Price constants",
        fieldPath: "price constants",
        type: HIDDEN,
        value: [],
      },
      {
        title: "Formula string",
        fieldPath: "formula string",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Working capital type",
        fieldPath: "working capital type",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "Max of Average Ending and Minimum",
      },
      {
        title: "Day count fraction",
        fieldPath: "day count fraction",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "Actual/360",
      },
      {
        title: "Days type",
        fieldPath: "days type",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "calendar days",
      },
      {
        title: "Notional type",
        fieldPath: "notional type",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "Working Capital Balance",
      },
      {
        title: "Notional cap",
        fieldPath: "notional cap",
        type: DOUBLE_INPUT,
        value: "",
      },
      {
        title: "Notional floor",
        fieldPath: "notional floor",
        type: DOUBLE_INPUT,
        value: "",
      },
      {
        title: "Deviation formula",
        fieldPath: "deviation formula",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Has haircut",
        fieldPath: "has haircut",
        type: CHECKBOX,
        value: 0,
      },
      {
        title: "Fee holdout",
        fieldPath: "fee holdout",
        type: DOUBLE_INPUT,
        value: 0,
      },
      {
        title: "Fee date offset",
        fieldPath: "fee date offset",
        type: FEE_DATE_OFFSET,
        value: {
          __type: FEE_DATE_OFFSET_TYPE,
          "date rule": "",
          "holiday calendar 1": "",
          "holiday calendar 2": "",
        },
      },
    ],
    [ROLL_FEE]: [
      {
        title: "Fee name",
        fieldPath: "fee name",
        type: TEXT_INPUT,
      },
      {
        fieldPath: "trade period",
        type: START_END_DATE,
        value: {
          __type: DATE_INTERVAL_TYPE,
          "start date": props.dealStartDate,
          "end date": props.dealEndDate,
        },
      },
      {
        title: "Products",
        fieldPath: "product name list",
        type: OPTIONAL_LIST,
        input: SELECTION_INPUT,
        choices: props.products,
        value: [],
        tooltip:
          "You must add at least one product for the Roll Fee to be recognised on the deal, when quantity type is set",
        tooltipShowFunction: (products, feeIndex) =>
          isEmptyArray(products) &&
          props["contents"][feeIndex]["quantity type"] &&
          props["contents"][feeIndex]["quantity type"].length,
      },
      {
        title: "Quantity type",
        fieldPath: "quantity type",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "Prior Period Nominated Quantity",
      },
      {
        title: "Quantity",
        fieldPath: "quantity ct",
        type: HIDDEN,
        value: {
          __type: INV_QUANTITY_CT,
          max: 0,
          "max decrease": 0,
          "tolerance unit": "",
          min: 0,
          tolerance: INFINITY_KEY,
          "max increase": 0,
          unit: "US barrel",
        },
      },
      {
        title: "Premium",
        fieldPath: "premium",
        type: DOUBLE_INPUT,
        value: 0,
      },
      {
        title: "Fixing",
        fieldPath: "fixing",
        type: CHECKBOX,
        value: 0,
      },
      {
        title: "Payment term",
        fieldPath: "payment term",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Conversion ratio",
        fieldPath: "conversion ratio",
        type: DOUBLE_INPUT,
      },
      {
        title: "Conversion unit from",
        fieldPath: "conversion unit from",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Conversion unit to",
        fieldPath: "conversion unit to",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Price components",
        fieldPath: "price component cts",
        type: PRICE_COMPONENTS_TABLE,
        value: [],
      },
      {
        title: "Settlement tiers",
        fieldPath: "settlement tier cts",
        type: SETTLEMENT_TIERS_TABLE,
        value: [],
      },
    ],
    [PRODUCT_DIFF_FEE]: [
      {
        title: "Fee name",
        fieldPath: "fee name",
        type: TEXT_INPUT,
      },
      {
        fieldPath: "trade period",
        type: START_END_DATE,
        value: {
          __type: DATE_INTERVAL_TYPE,
          "start date": props.dealMonthStartDate,
          "end date": props.dealMonthEndDate,
        },
      },
      {
        title: "Product name",
        fieldPath: "product name",
        type: LIST,
        choices: props.products,
        value: "",
      },
      {
        title: "Quantity type",
        fieldPath: "quantity type",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "Nominated Quantity",
      },
      {
        title: "Reval frequency",
        fieldPath: "reval frequency",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Quantity",
        fieldPath: "quantity ct",
        type: HIDDEN,
        value: {
          __type: INV_QUANTITY_CT,
          "max quantity": 0,
          "max decrease": 0,
          "tolerance unit": "",
          "min quantity": 0,
          tolerance: INFINITY_KEY,
          "max increase": 0,
          unit: "US barrel",
        },
      },
      {
        title: "Fee quantity scale factor",
        fieldPath: "fee quantity scale factor",
        type: DOUBLE_INPUT,
        value: 1,
      },
    ],
    [FIXED_FEE]: [
      {
        title: "Direction",
        fieldPath: "direction",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "Receive",
      },
      {
        title: "Currency",
        fieldPath: "currency",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "USO",
      },
      {
        title: "Payment curve",
        fieldPath: "payment curve",
        type: CURVE,
        value: getBaseFeeCurve(),
        tooltip:
          "You must add at least one knot for the Fixed Fee to be recognised on the deal",
        tooltipShowFunction: isEmptyArray,
      },
    ],
    [MONTHLY_FIXED_FEE]: [
      {
        title: "Fee name",
        fieldPath: "fee name",
        type: TEXT_INPUT,
      },
      {
        fieldPath: "trade period",
        type: START_END_DATE,
        value: {
          __type: DATE_INTERVAL_TYPE,
          "start date": props.dealStartDate,
          "end date": props.dealEndDate,
        },
      },
      {
        title: "Quantity",
        doubleFieldPath: "quantity",
        curveFieldPath: "quantity curve",
        type: DOUBLE_INPUT_CURVE,
        doubleDefaultValue: 0,
        curveDoubleDefaultValue: INFINITY_KEY,
        // Default value below is for the double
        fieldPath: "quantity",
        value: 0,
        doubleTooltip:
          "You must set quantity not as O for the Monthly Fixed Fee to be recognised on the deal",
        doubleTooltipShowFunction: (double) => double === 0,
        curveTooltip:
          "You must add at least one knot for the Monthly Fixed Fee to be recognised on the deal",
        curveTooltipShowFunction: isEmptyArray,
      },
      {
        title: "Unit",
        fieldPath: "quantity unit",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "us barrel",
      },
      {
        title: "Currency",
        fieldPath: "currency",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "USD",
      },
      {
        title: "Days till payment",
        fieldPath: "payment day count",
        type: DOUBLE_INPUT,
        value: 0,
      },
      {
        title: "Days type",
        fieldPath: "days type",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "calendar days",
      },
    ],
    [DEFERRED_PAYMENT_FEE]: [
      {
        title: "Fee name",
        fieldPath: "fee name",
        type: LIST,
        choices: feeNamePreset[DEFERRED_PAYMENT_FEE],
        value: "",
      },
      {
        fieldPath: "trade period",
        type: START_END_DATE,
        value: {
          __type: DATE_INTERVAL_TYPE,
          "start date": props.dealStartDate,
          "end date": props.dealEndDate,
        },
      },
      {
        title: "Deferred payment Type",
        fieldPath: "deferred payment type",
        type: STRING_CHOICES_SELECTOR_INPUT,
        linkedField: "fee name",
      },
      {
        title: "Rate tenor",
        fieldPath: "rate tenor",
        type: TEXT_INPUT,
        parser: parseToRDate,
        getter: parseFromRDate,
        value: { [RDATE_KEY]: "" },
      },
      {
        title: "Rate index",
        fieldPath: "rate index",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Rate fixing average type",
        fieldPath: "rate fixing avg type",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Spread rate",
        fieldPath: "spread rate",
        type: DOUBLE_INPUT,
        value: 0,
      },
      {
        title: "Spread curve",
        fieldPath: "spread curve",
        type: CURVE,
        value: getBaseFeeCurve(),
      },
      {
        title: "Receivable value",
        fieldPath: "receivable value",
        type: DOUBLE_INPUT,
        value: 0,
      },
      {
        title: "Max capacity",
        fieldPath: "max deferred payment capacity",
        type: DOUBLE_INPUT,
        value: 0,
      },
      {
        title: "Currency",
        fieldPath: "currency",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "USD",
      },
      {
        title: "Formula string",
        fieldPath: "formula string",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Day count fraction",
        fieldPath: "day count fraction",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
      {
        title: "Has prepayment option",
        fieldPath: "has prepayment option",
        type: CHECKBOX,
        value: 0,
      },
    ],
    [PER_BARREL_FEE]: [
      {
        title: "Fee name",
        fieldPath: "fee name",
        type: TEXT_INPUT,
      },
      {
        fieldPath: "trade period",
        type: START_END_DATE,
        value: {
          __type: DATE_INTERVAL_TYPE,
          "start date": props.dealStartDate,
          "end date": props.dealEndDate,
        },
      },
      {
        title: "Price",
        fieldPath: "price",
        type: DOUBLE_INPUT,
        value: 0,
      },
      {
        title: "Currency",
        fieldPath: "currency",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "USD",
      },
    ],
    [PER_BARREL_MULTI_FEE]: [
      {
        title: "Fee names",
        fieldPath: "fee names",
        type: OPTIONAL_LIST,
        input: TEXT_INPUT,
        lockRemovallfJustOne: true,
      },
      {
        fieldPath: "trade period",
        type: START_END_DATE,
        value: {
          __type: DATE_INTERVAL_TYPE,
          "start date": props.dealStartDate,
          "end date": props.dealEndDate,
        },
      },
      {
        title: "Prices",
        fieldPath: "prices",
        type: OPTIONAL_LIST,
        input: DOUBLE_INPUT,
        value: [],
        tooltip:
          "You must add at least one price for the Per Barrel Multi Fee to be recognised on the deal",
        tooltipShowFunction: isEmptyArray,
      },
      {
        title: "Min quantities",
        fieldPath: "min quantities",
        type: OPTIONAL_LIST,
        input: DOUBLE_INPUT,
        value: [],
        blankPlaceholder: "undefined",
      },
      {
        title: "Max quantities",
        fieldPath: "max quantities",
        type: OPTIONAL_LIST,
        input: DOUBLE_INPUT,
        value: [],
        blankPlaceholder: "undefined",
      },
      {
        title: "Total annual discount",
        fieldPath: "total annual discount",
        type: DOUBLE_INPUT,
        value: 0,
      },
      {
        title: "Currency",
        fieldPath: "currency",
        type: TEXT_INPUT,
        value: "USD",
        editable: false,
      },
      {
        title: "Formula string",
        fieldPath: "formula string",
        type: STRING_CHOICES_SELECTOR_INPUT,
        value: "",
      },
    ],
  };

  const setPresets = () => {
    if (feeType && feeType in allowAddNewFeeForEachProduct) {
      setEnabledAddFeesForEachProduct(true);
    } else {
      setEnabledAddFeesForEachProduct(false);
    }
    if (feeType && feeType in feeNamePreset) {
      setNewFeeNameToAdd(feeNamePreset[feeType][0]);
    } else {
      setNewFeeNameToAdd("");
    }
  };

  const getPresets = () => {
    if (feeType && feeType in schemaComponentsByType) {
      return schemaComponentsByType[feeType];
    }

    return [];
  };

  const getFeeType = () => {
    if (selectedSection && selectedSection in ALL_FEE_TYPES) {
      return ALL_FEE_TYPES[selectedSection];
    }

    return "";
  };

  const getFilteredFees = (currentFees) => {
    let fees = {};
    if (selectedSection && feeType.length > 0) {
      currentFees.forEach((fee, index) => {
        if (fee && fee.__type && fee.__type === feeType) {
          let shallowFee = {};
          shallowFee.index = index;
          shallowFee.expanded = false;
          shallowFee.feeId = feeId;
          fees[index] = shallowFee;

          setFeeId(feeId + 1);
        }
      });
    }

    return cloneDeep(fees);
  };

  const addNewFeeForEachProduct = () => {
    props.products.forEach((productName) => {
      if (productName && productName.length) {
        let newFee = generateNewFee();
        newFee["product name"] = productName;
        props.contents.push(newFee);
      }
    });

    changeHandlerBasic(props.dispatch, [], "fee cts", props.contents);
  };

  const addNewFee = () => {
    let newFee = generateNewFee();
    props.contents.push(newFee);
    changeHandlerBasic(props.dispatch, [], "fee cts", props.contents);

    if (feeType in feeNamePreset) {
      setNewFeeNameToAdd(feeNamePreset[feeType][0]);
    } else if (!(feeType in lockedFeeNames)) {
      setNewFeeNameToAdd("");
    }
  };

  const generateNewFee = () => {
    let newFee = {};

    if (feeType in multipleFeeType) {
      newFee = { __type: feeType, "fee names": [newFeeNameToAdd] };
    } else {
      newFee = { __type: feeType, "fee name": newFeeNameToAdd };
    }

    return setInitValues(newFee);
  };

  const setInitValues = (newFee) => {
    getPresets().forEach((component) => {
      if (newFee[component.fieldPath]) {
        return;
      } else if (component.value !== undefined) {
        newFee[component.fieldPath] = component.value;
      } else if (component.linkedField && newFee[component.linkedField]) {
        newFee[component.fieldPath] = newFee[component.linkedField];
      }
    });

    return newFee;
  };

  const getFeeName = (fee) => {
    if (fee && fee["fee names"] && fee["fee names"].length > 0) {
      return fee["fee names"][0];
    } else if (fee && fee["fee name"] && fee["fee name"].length) {
      return fee["fee name"];
    } else if (
      feeType in lockedFeeNames &&
      feeType in feeNamePreset &&
      feeNamePreset[feeType].length === 1
    ) {
      return feeNamePreset[feeType];
    }

    return "";
  };

  useEffect(() => {
    if (props.selectedSection !== selectedSection) {
      setSelectedSection(props.seIectedSection);
    }
  }, [props.selectedSection]);

  useEffect(() => {
    setFeeType(getFeeType());
  }, [selectedSection]);

  useEffect(() => {
    setFilteredFees(getFilteredFees(props.contents));
    setPresets();
  }, [feeType]);

  useEffect(() => {
    setFilteredFees(getFilteredFees(props.contents));
  }, [props.contents.length]);

  useEffect(() => {
    if (
      feeType in oneFeeRestriction &&
      Object.keys(filteredFees).length !== 0
    ) {
      setEnabledAddFees(false);
      return;
    } else if (feeType.length && newFeeNameToAdd.length) {
      setEnabledAddFees(true);
    }
  }, [filteredFees]);

  useEffect(() => {
    if (
      feeType.length &&
      newFeeNameToAdd.length &&
      ((feeType in oneFeeRestriction &&
        Object.keys(filteredFees).length === 0) ||
        !(feeType in oneFeeRestriction))
    ) {
      return setEnabledAddFees(true);
    }

    setEnabledAddFees(false);
  }, [feeType, newFeeNameToAdd]);

  return (
    <div className="container container-with-bottom-panel">
      {Object.values(filteredFees).map(function (fee) {
        return (
          <div className="row" key={`fee row ${fee.index}`}>
            {props.contents[fee.index] && (
              <HeaderActionColumn
                itemName={<p>{getFeeName(props.contents[fee.index])}</p>}
                index={fee.index}
                dispatch={props.dispatch}
                contents={props.contents}
                setFilteredltems={setFilteredFees}
                filteredItems={filteredFees}
                selectedSection={selectedSection}
                path={[]}
                commentPath={[...props.path, fee.index]}
                fieldName="fee cts"
                showCommentButton={true}
                copyEnabled={!(feeType in oneFeeRestriction)}
              />
            )}
            {fee.expanded && props.contents[fee.index] && (
              <ExpandedFeeSection
                type={feeType}
                index={fee.index}
                dispatch={props.dispatch}
                contents={props.contents}
                presets={getPresets()}
                stringChoicesByType={stringChoicesByType[feeType]}
                path={[...props.path, fee.index]}
                feeId={fee.feeId}
              />
            )}
          </div>
        );
      })}
      <div className="row bottom" key="fee list bottom row">
        <div className="col-sm-3">Add new fee:</div>
        <div className="col-sm-8">
          {feeType in feeNamePreset && feeNamePreset[feeType].length > 1 && (
            <select
              value={newFeeNameToAdd}
              onChange={(event) => setNewFeeNameToAdd(event.target.value)}
              className="form-control"
            >
              {feeNamePreset[feeType].map((namePreset) => (
                <option key={namePreset}>{namePreset}</option>
              ))}
            </select>
          )}
          {(!(feeType in feeNamePreset) ||
            (feeType in feeNamePreset &&
              feeNamePreset[feeType].length < 2)) && (
            <input
              className="form-control"
              value={newFeeNameToAdd}
              disabled={feeType in lockedFeeNames}
              onChange={(event) => setNewFeeNameToAdd(event.target.value)}
            />
          )}
        </div>
        <div className="col-sm-1 button-col-right">
          <button
            className="small-action-button"
            onClick={addNewFee}
            disabled={
              !enabledAddFees ||
              (feeType in oneFeeOrTheOther &&
                Object.keys(oneFeeOrTheOther[feeType]).length === 1 &&
                Object.keys(oneFeeOrTheOther[feeType])[0] &&
                props.populatedSections &&
                props.populatedSections.includes(
                  Object.keys(oneFeeOrTheOther[feeType])[0].toUpperCase()
                ))
            }
            title="Add fee"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="button-icon" />
          </button>
          {enabledAddFeesForEachProduct && (
            <button
              className="small-action-button"
              onClick={addNewFeeForEachProduct}
              disabled={
                !enabledAddFees ||
                !enabledAddFeesForEachProduct ||
                (feeType in oneFeeOrTheOther &&
                  Object.keys(oneFeeOrTheOther[feeType]).length === 1 &&
                  Object.keys(oneFeeOrTheOther[feeType])[0] &&
                  props.populatedSections &&
                  props.populatedSections.includes(
                    Object.keys(oneFeeOrTheOther[feeType])[0].toUpperCase()
                  ))
              }
              title="Add fee for all products"
            >
              <Icon name="library-add" type="filled" className="button-icon" />
            </button>
          )}
          {feeType in oneFeeOrTheOther &&
            Object.values(oneFeeOrTheOther[feeType]).length === 1 &&
            Object.keys(oneFeeOrTheOther[feeType]).length === 1 &&
            Object.keys(oneFeeOrTheOther[feeType])[0] &&
            props.populatedSections &&
            props.populatedSections.includes(
              Object.keys(oneFeeOrTheOther[feeType])[0].toUpperCase()
            ) && (
              <button
                className="small-action-button small-action-button-tooltip"
                titie={Object.values(oneFeeOrTheOther[feeType])[0]}
              >
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  className="button-icon"
                />
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
