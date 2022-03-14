import moment from "moment";
import numeral from "numeral";
import {
  ALL_FORMULA_NAMES,
  DATE_FORMAT,
  DATE_FORMAT_LONG,
  DATE_INTERVAL_START_DATE,
  DATE_INTERVAL_END_DATE,
  DATE_INTERVAL_TYPE,
  EMPTY_CT_OBJECT,
  GRADE_ADJUST_FORMULA_NAME,
  INV_GRD_ADJ_CT,
  INV_PERIOD_CT,
  INV_PRICE_CT,
  INV_PX_AVG_CT,
  INV_PX_CMP_CT,
  INV_PX_RND_CT,
  INFINITY_KEY,
  RDATE_KEY,
  UN_NAMED_FORMULA,
  VALIDATION_NUMBER,
  DATE_INTERVAL_START_DATE_LONG,
  DATE_INTERVAL_END_DATE_LONG,
} from "./constants";
import { changeHandlerBasic } from "./useDeepObject";
import { DATE_KEY } from "./constants";
import { validNumberCheck } from "./ValidationToolTip";
import { cloneDeep } from "lodash";

export const numberValidation = {
  isValid: validNumberCheck,
  validationText: VALIDATION_NUMBER,
  parserFunction: parseDouble,
};

export function parseTextIfApplicableAndUpdate(
  dispatch,
  path,
  component,
  value
) {
  if (component.parser) {
    value = component.parser(value);
  }

  changeHandlerBasic(dispatch, path, component.fieldPath, value);

  if (component.postUpdateAction) {
    component.postUpdateAction(value, path);
  }
}

export function parseTextIfApplicableAndGet(value, component) {
  if (component.getter) {
    return component.getter(value);
  }

  return value;
}

export function parseToRDate(date) {
  return { [RDATE_KEY]: date };
}

export function parseFromRDate(value) {
  return value[RDATE_KEY];
}

export function formatToDate(date) {
  let parsedDate = "";
  if (!date) {
    parsedDate = "";
  } else {
    date = moment(date, [DATE_FORMAT], true);
    if (date.isValid()) {
      parsedDate = date.format(DATE_FORMAT_LONG);
    }
  }

  return { [DATE_KEY]: parsedDate };
}

export function formatFromDate(date) {
  if (date === undefined || !date) {
    return "";
  } else {
    if (!moment(date, DATE_FORMAT_LONG).isValid()) {
      return "";
    }

    return moment(date).format(DATE_FORMAT);
  }
}

export function parseSpecialDate(formattedDate, dateIntervalBound) {
  if (
    formattedDate &&
    formattedDate.toUpperCase() === DATE_INTERVAL_START_DATE
  ) {
    return dateIntervalBound && dateIntervalBound.toUpperCase() === "START"
      ? "Start"
      : "End";
  }

  if (formattedDate && formattedDate.toUpperCase() === DATE_INTERVAL_END_DATE) {
    return dateIntervalBound && dateIntervalBound.toUpperCase() === "END"
      ? "End"
      : "Start";
  }

  return "";
}

export function parseDouble(stringDouble) {
  if (
    stringDouble === undefined ||
    stringDouble === null ||
    stringDouble === ""
  ) {
    return "";
  }

  const parsed = numeral(stringDouble).value();

  if (parsed === undefined || parsed === null) {
    return "";
  }

  return parsed;
}

export function indexSort(a, b) {
  if (a["index name"] > b["index name"]) {
    return 1;
  }

  if (a["index name"] < b["index name"]) {
    return -1;
  }

  return 0;
}

export function getAllProductNames(contractTerms) {
  return contractTerms["inventory cts"].map(
    (inv) => inv["product ct"]["product name"]
  );
}

export function resolveDefaultProductName(contents, currentIndex) {
  if (currentIndex !== -1 && contents.length > currentIndex) {
    return currentIndex;
  }

  if (contents.length) {
    return 0;
  }

  return -1;
}

export function resolveFilteredQuantities(contents) {
  let applications = {};

  contents.map((application, index) => {
    if (application.application && application.application.length) {
      applications[application.application] = {};
      applications[application.application].expanded = false;
      applications[application.application].index = index;
    }
  });

  return applications;
}

export function getNewInventoryPeriod(selectedSection, startDate, endDate) {
  return {
    "period end date": { [DATE_KEY]: endDate },
    "period name": selectedSection,
    "period start date": { [DATE_KEY]: startDate },
    "price cts": [],
    "quantity type": "final scheduled quantity",
    __type: INV_PERIOD_CT,
  };
}

export function getNewInventoryPeriodPriceComponentsCTs(weight) {
  const roundingSchema = {
    precision: INFINITY_KEY,
    "index native unit precision": INFINITY_KEY,
    __type: INV_PX_RND_CT,
  };

  const averagingSchema = {
    "averaging type": "",
    "averaging days type": "",
    "date interval": {
      "start date": { [DATE_KEY]: DATE_INTERVAL_START_DATE_LONG },
      "end date": { [DATE_KEY]: DATE_INTERVAL_END_DATE_LONG },
      __type: DATE_INTERVAL_TYPE,
    },
    "fixing event": "",
    __type: INV_PX_AVG_CT,
  };

  return {
    adjustment: 0,
    averaging: averagingSchema,
    "component name": "",
    "conversion factor": 1,
    currency: "USO",
    index: "",
    "rounding config": roundingSchema,
    unit: "US barrel",
    weight: weight,
    __type: INV_PX_CMP_CT,
  };
}

export function getNewInventoryPeriodPriceCTs(formulaName) {
  return {
    "formula name": formulaName,
    "settlement ct": cloneDeep(EMPTY_CT_OBJECT),
    "price component cts": [],
    __type: INV_PRICE_CT,
  };
}

export function getCheckedInventoryPeriodFormulaeOptions(priceCts) {
  let checkedOptions = {};

  priceCts.map((priceCt, index) => {
    let priceCtName = UN_NAMED_FORMULA;
    if (
      priceCt["formula name"] &&
      ALL_FORMULA_NAMES.includes(priceCt["formula name"])
    ) {
      priceCtName = priceCt["formula name"];
    } else if (priceCt.__type === INV_GRD_ADJ_CT) {
      priceCtName = GRADE_ADJUST_FORMULA_NAME;
    }

    checkedOptions[priceCtName] = index;
  });

  return checkedOptions;
}

export function isEmptyArray(array) {
  return !array || array.length === 0;
}

export function copyTextToClipboard(text) {
  const clipboard = document.createElement("input");
  clipboard.setAttribute("id", "clipboard");
  clipboard.value = text;
  document.body.appendChild(clipboard);
  clipboard.select();
  document.execCommand("copy");
  document.body.removeChild(clipboard);
}

export function resolveModalClass(primaryModal, secondaryModal) {
  // This function is for when we have two mod als open, the non active one gets greyed out
  if (
    !document.getElementsByClassName("modal") ||
    document.getElementsByClassName("modal") === 0 ||
    !document.getElementsByClassName("modal")[0]
  ) {
    return;
  }

  if (primaryModal && secondaryModal) {
    return document
      .getElementsByClassName("modal")[0]
      .classlist.add("secondary-modal");
  }

  if (primaryModal) {
    document
      .getElementsByClassName("modal")[0]
      .classlist.remove("secondary-modaI");
  }
}

export function parseSelectedListValue(choices, selectedValue) {
  if (selectedValue === undefined) {
    return "";
  }

  for (let index = 0; index < choices.length; index++) {
    if (choices[index].toUpperCase() === selectedValue.toUpperCase()) {
      return choices[index];
    }
  }

  return "";
}

export function getSelectedListValue(choices, selectedValue) {
  const parsedChoice = parseSelectedListValue(choices, selectedValue);

  if (
    (parsedChoice !== undefined && parsedChoice.length) ||
    selectedValue === undefined
  ) {
    return parsedChoice;
  }

  return selectedValue;
}

export function getListChoices(choices, selectedValue, setterFunction) {
  let newChoices = cloneDeep(choices);

  if (choices === undefined) {
    newChoices = [];
  }

  const parsedSelectedValue = parseSelectedListValue(newChoices, selectedValue);

  if (
    parsedSelectedValue !== selectedValue &&
    parsedSelectedValue !== "" &&
    setterFunction
  ) {
    setterFunction(parsedSelectedValue);
  }

  if (selectedValue !== undefined && parsedSelectedValue === "") {
    if (!newChoices.includes(selectedValue)) {
      newChoices.push(selectedValue);
    }
  }

  if (newChoices.includes(undefined)) {
    const index = newChoices.indexOf(undefined);
    newChoices.splice(index, 1);

    if (!newChoices.includes("")) {
      newChoices.push("");
    }
  }

  return newChoices.sort((a, b) => {
    if (a && !b) {
      return 1;
    } else if (b && !a) {
      return -1;
    } else if (!a && !b) {
      return 0;
    } else {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
  });
}
