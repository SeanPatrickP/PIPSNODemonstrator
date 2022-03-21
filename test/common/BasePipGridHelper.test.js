import { CURVE_KEY } from "../../src/js/common/constants";
import {
  getTableOptions,
  getBaseFeeCurve,
  parseFromCurve,
  parseToCurve,
  formatValueToString,
  onRowSelectionChanged,
  setNewValueForNestedRow,
} from "../../src/js/common/BasePIPGridHelper";

describe("testGetTableOptions", () => {
  test("containsColumnDefs", () => {
    const tableOptions = getTableOptions(["foo", "bar"]);

    expect(tableOptions.columnDefs).toEqual(["foo", "bar"]);
  });
});

describe("testGetBaseFeeCurve", () => {
  test("ok", () => {
    expect(getBaseFeeCurve()).toEqual({
      [CURVE_KEY]: { dates: [], values: [] },
    });
  });
});

describe("testParseFromCurve", () => {
  test("noData", () => {
    expect(parseFromCurve({})).toEqual([]);
  });

  test("incorrectDataKey", () => {
    expect(parseFromCurve({ foo: "bar" })).toEqual([]);
  });

  test("mimatchingDatesToValues", () => {
    expect(
      parseFromCurve({
        [CURVE_KEY]: { dates: ["foo", "bar"], values: 1 },
      })
    ).toEqual([]);
  });

  test("parsesCorrectly", () => {
    expect(
      parseFromCurve({
        [CURVE_KEY]: { dates: ["foo", "bar"], values: [1, 2] },
      })
    ).toEqual([
      { date: "foo", value: 1 },
      { date: "bar", value: 2 },
    ]);
  });
});

describe("testParseToCurve", () => {
  test("noRows", () => {
    expect(parseToCurve([])).toEqual({
      [CURVE_KEY]: { dates: [], values: [] },
    });
  });

  test("parsesCorrectly", () => {
    expect(
      parseToCurve([
        { date: "foo", value: 1 },
        { date: "bar", value: 2 },
      ])
    ).toEqual({ [CURVE_KEY]: { dates: ["foo", "bar"], values: [1, 2] } });
  });
});

describe("testFormatValueToString", () => {
  test("noKeyOrValue", () => {
    expect(formatValueToString()).toEqual("");
  });

  test("noKey", () => {
    expect(formatValueToString(1)).toEqual("");
  });

  test("nullValue", () => {
    expect(formatValueToString({ value: null })).toEqual("");
  });

  test("formatsCorrectly", () => {
    expect(formatValueToString({ value: 1 })).toEqual("1");
  });
});

const setterTextTestFunction = jest.fn((text) => {
  return text;
});

const setterEnabledTestFunction = jest.fn((boolean) => {
  return boolean;
});

describe("testOnRowSelectionChanged", () => {
  test("setterNoRows", () => {
    const selectedRows = [];
    const setterFunctions = [
      {
        singularText: "testSingular",
        setterText: setterTextTestFunction,
        setterEnabled: setterEnabledTestFunction,
      },
    ];

    onRowSelectionChanged(selectedRows, setterFunctions);

    expect(setterTextTestFunction.mock.calls.length).toEqual(1);
    expect(setterEnabledTestFunction.mock.calls.length).toEqual(1);
    expect(setterTextTestFunction.mock.calls[0][0]).toEqual("testSingular");
    expect(setterEnabledTestFunction.mock.calls[0][0]).toEqual(false);
  });

  test("setterSingular", () => {
    const selectedRows = [{ row: 1 }];
    const setterFunctions = [
      {
        singularText: "testSingular",
        setterText: setterTextTestFunction,
        setterEnabled: setterEnabledTestFunction,
      },
    ];

    onRowSelectionChanged(selectedRows, setterFunctions);

    expect(setterTextTestFunction.mock.calls.length).toEqual(1);
    expect(setterEnabledTestFunction.mock.calls.length).toEqual(1);
    expect(setterTextTestFunction.mock.calls[0][0]).toEqual("testSingular");
    expect(setterEnabledTestFunction.mock.calls[0][0]).toEqual(true);
  });

  test("setterPlural", () => {
    const selectedRows = [{ row: 1 }, { row: 2 }];
    const setterFunctions = [
      {
        pluralText: "testPlural",
        setterText: setterTextTestFunction,
        setterEnabled: setterEnabledTestFunction,
      },
    ];

    onRowSelectionChanged(selectedRows, setterFunctions);

    expect(setterTextTestFunction.mock.calls.length).toEqual(1);
    expect(setterEnabledTestFunction.mock.calls.length).toEqual(1);
    expect(setterTextTestFunction.mock.calls[0][0]).toEqual("testPlural");
    expect(setterEnabledTestFunction.mock.calls[0][0]).toEqual(true);
  });

  test("multipleSetters", () => {
    const selectedRows = [{ row: 1 }, { row: 2 }];
    const setterFunctions = [
      {
        pluralText: "testPlural1",
        setterText: setterTextTestFunction,
        setterEnabled: setterEnabledTestFunction,
      },
      {
        pluralText: "testPlural2",
        setterText: setterTextTestFunction,
        setterEnabled: setterEnabledTestFunction,
      },
    ];

    onRowSelectionChanged(selectedRows, setterFunctions);

    expect(setterTextTestFunction.mock.calls.length).toEqual(2);
    expect(setterEnabledTestFunction.mock.calls.Iength).toEqual(2);
    expect(setterTextTestFunction.mock.calls[0][0]).toEqual("testPlural1");
    expect(setterEnabledTestFunction.mock.calls[0][0]).toEqual(true);
    expect(setterTextTestFunction.mock.calls[1][0]).toEqual("testPlural2");
    expect(setterEnabledTestFunction.mock.calls[1][0]).toEqual(true);
  });
});

describe("testSetNewValueForNestedRow", () => {
  test("unknownRowIndex", () => {
    expect(
      setNewValueForNestedRow(
        "value",
        "foo",
        "field",
        { rowIndex: { nestedField: { field: "foo" } } },
        "nestedField"
      )
    ).toEqual({ rowIndex: { nestedField: { field: "foo" } } });
  });

  test("noRowField", () => {
    expect(
      setNewValueForNestedRow(
        "value",
        null,
        "rowIndex",
        { rowIndex: { nestedField: { field: "foo" } } },
        "nestedField"
      )
    ).toEqual({ rowIndex: { nestedField: { field: "foo" } } });
  });

  test("unknownRowIndexAndNoRowField", () => {
    expect(
      setNewValueForNestedRow(
        "value",
        null,
        "field",
        { rowIndex: { nestedField: { field: "foo" } } },
        "nestedField"
      )
    ).toEqual({ rowIndex: { nestedField: { field: "foo" } } });
  });

  test("setsValueCorrectly", () => {
    expect(
      setNewValueForNestedRow(
        "value",
        "rowIndex",
        "field",
        { rowIndex: { nestedField: { field: "foo" } } },
        "nestedField"
      )
    ).toEqual({ rowIndex: { nestedField: { field: "value" } } });
  });
});
