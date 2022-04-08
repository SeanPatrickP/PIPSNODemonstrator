import {
  BASE_VOLUME_FORMULA,
  GRADE_ADJUST_FORMULA_NAME,
  INV_GRD_ADJ_CT,
  PROVISIONAL,
  DATE_KEY,
  RDATE_KEY,
  UN_NAMED_FORMULA,
} from "../../src/js/common/constants";
import {
  parseTextIfApplicableAndUpdate,
  parseTextIfApplicableAndGet,
  parseToRDate,
  parseFromRDate,
  formatToDate,
  formatFromDate,
  parseSpecialDate,
  parseDouble,
  indexSort,
  getAllProductNames,
  resolveDefaultProductName,
  resolveFilteredQuantities,
  getNewInventoryPeriod,
  getNewInventoryPeriodPriceComponentsCTs,
  getNewInventoryPeriodPriceCTs,
  getCheckedInventoryPeriodFormulaeOptions,
  isEmptyArray,
  getSelectedListValue,
  parseSelectedListValue,
  getListChoices,
} from "../../src/js/common/InputHelper";

import { changeHandlerBasic } from "../../src/js/common/useDeepObject";

// The below must be called at this top level
jest.mock("../../src/js/common/useDeepObject");

describe("testParseTextIfApplicableAndUpdate", () => {
  const updateAction = jest.fn((value) => {
    return value;
  });

  test("callsChangeHandlerBasic", () => {
    parseTextIfApplicableAndUpdate(
      "testDispatch",
      "testPath",
      { fieldPath: "testFieldPath" },
      "testValue"
    );

    expect(changeHandlerBasic).toHaveBeenCalledWith(
      "testDispatch",
      "testPath",
      "testFieldPath",
      "testValue"
    );
  });

  test("callsChangeHandlerBasicAndParses", () => {
    parseTextIfApplicableAndUpdate(
      "testDispatch",
      "testPath",
      {
        fieldPath: "testFieldPath",
        parser: (text) => {
          return `${text}-${text}`;
        },
      },
      "testValue"
    );

    expect(changeHandlerBasic).toHaveBeenCalledWith(
      "testDispatch",
      "testPath",
      "testFieldPath",
      "testValue-testValue"
    );
  });

  test("callsChangeHandlerBasicAndNotifies", () => {
    parseTextIfApplicableAndUpdate(
      "testDispatch",
      "testPath",
      {
        fieldPath: "testFieldPath",
        postUpdateAction: updateAction,
      },
      "testValue"
    );

    expect(changeHandlerBasic).toHaveBeenCalledWith(
      "testDispatch",
      "testPath",
      "testFieldPath",
      "testValue"
    );

    expect(updateAction.mock.calls.length).toEqual(1);
  });

  test("callsChangeHandlerBasicAndParsesAndNotifies", () => {
    parseTextIfApplicableAndUpdate(
      "testDispatch",
      "testPath",
      {
        fieldPath: "testFieldPath",
        parser: (text) => {
          return `${text}-${text}`;
        },
        postUpdateAction: updateAction,
      },
      "testValue"
    );

    expect(changeHandlerBasic).toHaveBeenCalledWith(
      "testDispatch",
      "testPath",
      "testFieldPath",
      "testValue-testValue"
    );

    expect(updateAction.mock.calls.length).toEqual(1);
  });
});

describe("testParseTextIfApplicableAndGet", () => {
  test("getterNotPresent", () => {
    const parserFunction = {};

    expect(parseTextIfApplicableAndGet("test", parserFunction)).toEqual("test");
  });

  test("getterPresent", () => {
    const parserFunction = {
      getter: (text) => {
        return `${text}-${text}`;
      },
    };

    expect(parseTextIfApplicableAndGet("test", parserFunction)).toEqual(
      "test-test"
    );
  });
});

describe("testParseToRDate", () => {
  test("ok", () => {
    expect(parseToRDate("test")).toEqual({ [RDATE_KEY]: "test" });
  });
});

describe("testParseFromRDate", () => {
  test("ok", () => {
    expect(parseFromRDate({ [RDATE_KEY]: "test" })).toEqual("test");
  });
});

describe("testFormatToDate", () => {
  test("nullDate", () => {
    expect(formatToDate(null)).toEqual({ [DATE_KEY]: "" });
  });

  test("invalidDate", () => {
    expect(formatToDate("01-J-2000")).toEqual({ [DATE_KEY]: "" });
  });

  test("correctDate", () => {
    expect(formatToDate("01-JUN-2000")).toEqual({
      [DATE_KEY]: "2000-06-01T00:00:00",
    });
  });
});

describe("testFormatFromDate", () => {
  test("nullDate", () => {
    expect(formatFromDate(null)).toEqual("");
  });

  test("undefinedDate", () => {
    expect(formatFromDate(undefined)).toEqual("");
  });

  test("invalidDate", () => {
    expect(formatFromDate("2000-JUN-01T00:00:00")).toEqual("");
  });

  test("correctDate", () => {
    expect(formatFromDate("2000-06-01T00:00:00")).toEqual("01-Jun-2000");
  });
});

describe("testParseSpecialDate", () => {
  test("nullDate", () => {
    expect(parseSpecialDate(null)).toEqual("");
  });

  test("nonSpecialDate", () => {
    expect(parseSpecialDate("01-JUN-2000")).toEqual("");
  });

  test("specialDate1", () => {
    expect(parseSpecialDate("31-DEC-2952")).toEqual("End");
  });

  test("specialDate2", () => {
    expect(parseSpecialDate("01-JAN-1952")).toEqual("Start");
  });

  test("specialDateOppositeBound1", () => {
    expect(parseSpecialDate("31-DEC-2952", "start")).toEqual("Start");
  });

  test("specialDateOppositeBound2", () => {
    expect(parseSpecialDate("01-JAN-1952", "end")).toEqual("End");
  });
});

describe("testParseDouble", () => {
  test("nullDobule", () => {
    expect(parseDouble(null)).toEqual("");
  });

  test("undefinedDouble", () => {
    expect(parseDouble(undefined)).toEqual("");
  });

  test("emptyDouble", () => {
    expect(parseDouble("")).toEqual("");
  });

  test("invalidDouble", () => {
    expect(parseDouble("foo")).toEqual("");
  });

  test("correctDouble", () => {
    expect(parseDouble("1234")).toEqual(1234);
  });
});

describe("testIndexSort", () => {
  test("greaterThan", () => {
    expect(indexSort({ "index name": "bcd" }, { "index name": "abc" })).toEqual(
      1
    );
  });

  test("lessThan", () => {
    expect(indexSort({ "index name": "abc" }, { "index name": "bcd" })).toEqual(
      -1
    );
  });

  test("equalTo", () => {
    expect(indexSort({ "index name": "abc" }, { "index name": "abc" })).toEqual(
      0
    );
  });
});

describe("testGetAllProductNames", () => {
  test("ok", () => {
    expect(
      getAllProductNames({
        "inventory cts": [
          { "product ct": { "product name": "test1" } },
          { "product ct": { "product name": "test2" } },
        ],
      })
    ).toEqual(["test1", "test2"]);
  });
});

describe("testResolveDefaultProductName", () => {
  test("hasCurrentIndex", () => {
    expect(resolveDefaultProductName(["foo"], 100)).toEqual(0);
  });

  test("hasLengthLessThanCurrentIndex", () => {
    expect(resolveDefaultProductName(["foo"], 0)).toEqual(0);
  });

  test("hasLengthEqualToTheCurrentIndex", () => {
    expect(resolveDefaultProductName(["foo"], 1)).toEqual(0);
  });

  test("hasLengthGreaterThanCurrentIndex", () => {
    expect(resolveDefaultProductName(["foo", "bar"], 1)).toEqual(1);
  });

  test("hasNoLength", () => {
    expect(resolveDefaultProductName([], -1)).toEqual(-1);
  });

  test("hasLength", () => {
    expect(resolveDefaultProductName(["foo", "bar"], -1)).toEqual(0);
  });
});

describe("testResolveFilteredQuantities", () => {
  test("hasNoQuantities", () => {
    expect(resolveFilteredQuantities([])).toEqual({});
  });

  test("hasQuantitiesOneNoLength", () => {
    expect(
      resolveFilteredQuantities([{ application: "foo" }, { application: "" }])
    ).toEqual({
      foo: { expanded: false, index: 0 },
    });
  });

  test("hasQuantities", () => {
    expect(
      resolveFilteredQuantities([
        { application: "foo" },
        { application: "bar" },
      ])
    ).toEqual({
      foo: { expanded: false, index: 0 },
      bar: { expanded: false, index: 1 },
    });
  });
});

describe("testGetNewInventoryPeriod", () => {
  test("ok", () => {
    const result = getNewInventoryPeriod(
      "testSelectedSection",
      "testStartDate",
      "testEndDate"
    );

    expect(result("period name")).toEqual("testSelectedSection");
    expect(result["period start date"]).toEqual({
      [DATE_KEY]: "testStartDate",
    });

    expect(result["period end date"]).toEqual({
      [DATE_KEY]: "testEndDate",
    });
  });
});

describe("testGetNewInventoryPeriodPriceComponentsCTs", () => {
  test("ok", () => {
    const result = getNewInventoryPeriodPriceComponentsCTs("testWeight");

    expect(result["weight"]).toEqual("testWeight");
  });
});

describe("testGetNewInventoryPeriodPriceCTs", () => {
  test("ok", () => {
    const result = getNewInventoryPeriodPriceCTs("testFormulaName");

    expect(result["formula name"]).toEqual("testFormulaName");
  });
});

describe("testGetCheckedInventoryPeriodFormulaeOptions", () => {
  test("noPriceCts", () => {
    expect(getCheckedInventoryPeriodFormulaeOptions([])).toEqual({});
  });

  test("priceCtsUnknownName", () => {
    expect(
      getCheckedInventoryPeriodFormulaeOptions([{ "formula name": "foo" }])
    ).toEqual({ [UN_NAMED_FORMULA]: 0 });
  });

  test("priceCtsOneUnknownName", () => {
    expect(
      getCheckedInventoryPeriodFormulaeOptions([
        { "formula name": "foo" },
        { "formula name": BASE_VOLUME_FORMULA },
      ])
    ).toEqual({ [UN_NAMED_FORMULA]: 0, [BASE_VOLUME_FORMULA]: 1 });
  });

  test("priceCtsGradeAdjustOveride", () => {
    expect(
      getCheckedInventoryPeriodFormulaeOptions([
        { "formula name": "foo", __type: INV_GRD_ADJ_CT },
      ])
    ).toEqual({ [GRADE_ADJUST_FORMULA_NAME]: 0 });
  });

  test("priceCtsKnownName", () => {
    expect(
      getCheckedInventoryPeriodFormulaeOptions([
        { "formula name": PROVISIONAL },
        { "formula name": BASE_VOLUME_FORMULA },
      ])
    ).toEqual({ [PROVISIONAL]: 0, [BASE_VOLUME_FORMULA]: 1 });
  });
});

describe("testIsEmptyArray", () => {
  test("emptyArray", () => {
    expect(isEmptyArray([])).toEqual(true);
  });

  test("undefined", () => {
    expect(isEmptyArray(undefined)).toEqual(true);
  });

  test("notEmptyArray", () => {
    expect(isEmptyArray(["foo", "bar"])).toEqual(false);
  });
});

describe("testParseSelectedListValue", () => {
  test("emptyString", () => {
    expect(parseSelectedListValue(["Foo", "Bar"], "")).toEqual("");
  });

  test("undefined", () => {
    expect(parseSelectedListValue(["Foo", "Bar"], undefined)).toEqual("");
  });

  test("inList", () => {
    expect(parseSelectedListValue(["Foo", "Bar"], "Foo")).toEqual("Foo");
  });

  test("inListCapitalised", () => {
    expect(parseSelectedListValue(["Foo", "Bar"], "foo")).toEqual("Foo");
  });

  test("notInList", () => {
    expect(parseSelectedListValue(["Foo", "Bar"], "Baz")).toEqual("");
  });
});

describe("testGetSelectedListValue", () => {
  test("emptyString", () => {
    expect(getSelectedListValue(["Foo", "Bar"], "")).toEqual("");
  });

  test("undefined", () => {
    expect(getSelectedListValue(["Foo", "Bar"], undefined)).toEqual("");
  });

  test("inList", () => {
    expect(getSelectedListValue(["Foo", "Bar"], "Foo")).toEqual("Foo");
  });

  test("inListCapitalised", () => {
    expect(getSelectedListValue(["Foo", "Bar"], "foo")).toEqual("Foo");
  });

  test("notInList", () => {
    expect(getSelectedListValue(["Foo", "Bar"], "Baz")).toEqual("Baz");
  });
});

describe("testGetListChoices", () => {
  const setterFunction = jest.fn((value) => {
    return value;
  });

  test("emptyChoicesArrayEmptySelectedValueString", () => {
    expect(getListChoices([], "")).toEqual([""]);
  });

  test("emptyChoicesArrayUndefinedSelectedValue", () => {
    expect(getListChoices([], undefined)).toEqual([]);
  });

  test("choicesArrayContainsUndefined", () => {
    expect(getListChoices([undefined], undefined)).toEqual([""]);
  });

  test("emptyChoicesArraySelectedValueString", () => {
    expect(getListChoices([], "Foo")).toEqual(["Foo"]);
  });

  test("emptyChoicesArraySelectedValueString", () => {
    expect(getListChoices([], "Foo")).toEqual(["Foo"]);
  });

  test("choicesArraySelectedValueStringInArrayCapitalised", () => {
    expect(getListChoices(["Foo"], "foo")).toEqual(["Foo"]);
  });

  test("choicesArraySelectedValueStringInArray", () => {
    expect(getListChoices(["Foo"], "Foo")).toEqual(["Foo"]);
  });

  test("choicesArraySelectedValueStringNotInArray", () => {
    expect(getListChoices(["Foo"], "Bar")).toEqual(["Bar", "Foo"]);
  });

  test("setterFunctionInvokedChoicesArraySelectedValueStringInArrayCapitalised", () => {
    expect(getListChoices(["Foo"], "foo", setterFunction)).toEqual(["Foo"]);
    expect(setterFunction.mock.calls.length).toEqual(1);
    expect(setterFunction.mock.calls[0][0]).toEqual("Foo");
  });

  test("setterFunctionNotInvokedChoicesArraySelectedValueStringInArray", () => {
    expect(getListChoices(["Foo"], "Foo", setterFunction)).toEqual(["Foo"]);
    expect(setterFunction.mock.calls.length).toEqual(0);
  });

  test("setterFunctionNotInvokedChoicesArraySelectedValueStringNotInArray", () => {
    expect(getListChoices(["Foo"], "Bar", setterFunction)).toEqual([
      "Bar",
      "Foo",
    ]);
    expect(setterFunction.mock.calls.length).toEqual(0);
  });

  test("orderingChoices", () => {
    expect(getListChoices(["Foo", "Baz", "Bar", "Test"], "Foo")).toEqual([
      "Bar",
      "Baz",
      "Foo",
      "Test",
    ]);
  });
});
