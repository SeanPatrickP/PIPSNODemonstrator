import {
  changeHandlerBasic,
  followPath,
  reducer,
} from "../../src/js/common/useDeepObject";

describe("testChangeHandlerBasic", () => {
  const dispatch = jest.fn((dispatchObject) => {
    return dispatchObject;
  });

  test("ok", () => {
    changeHandlerBasic(
      dispatch,
      ["testPath1", "testPath2"],
      "testFieldName",
      "testValue"
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: "update",
      value: "testValue",
      path: ["testPath1", "testPath2", "testFieldName"],
    });
  });
});

describe("testFollowPath", () => {
  test("ok", () => {
    expect(followPath({ test: { foo: "bar" } }, ["test", "foo"])).toEqual([
      { foo: "bar" },
      "foo",
    ]);
  });
});

describe("testReducer", () => {
  test("update", () => {
    expect(
      reducer(
        { test: { foo: "bar" } },
        { type: "update", path: ["test", "foo"], value: "baz" }
      )
    ).toEqual({ test: { foo: "baz" } });
  });

  test("delete", () => {
    expect(
      reducer(
        { test: { foo: "bar", bar: "baz" } },
        { type: "delete", path: ["test", "foo"] }
      )
    ).toEqual({ test: { bar: "baz" } });
  });

  test("ctNoCt", () => {
    expect(
      reducer(
        { test: { bar: "baz" } },
        { type: "ct", path: ["test", "foo"], ct: "testCt" }
      )
    ).toEqual({ test: { bar: "baz", foo: { type: "testCt" } } });
  });

  test("ctHasCt", () => {
    expect(
      reducer(
        { test: { foo: { bar: "baz" } } },
        { type: "ct", path: ["test", "foo"], ct: "testCt" }
      )
    ).toEqual({ test: { foo: { bar: "baz", __type: "testCt" } } });
  });

  test("new", () => {
    expect(
      reducer(
        { test: { foo: "bar", bar: "baz" } },
        { type: "new", value: { test: { foo: "bar" } } }
      )
    ).toEqual({ test: { foo: "bar" } });
  });
});
