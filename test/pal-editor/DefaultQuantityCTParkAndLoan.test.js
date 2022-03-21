import React from "react";
import { shallow, mount } from "enzyme";
import DefaultQuantityCTParkAndLoan from "../../src/js/pal-editor/DefaultQuantityCTParkAndLoan";

describe("baseComponent", () => {
  // Tests the bare-bones init of the component
  const contents = [{ "default quantity cts": [] }];

  const component = shallow(
    <DefaultQuantityCTParkAndLoan
      selectedProductIndex={0}
      contents={contents}
    />
  );

  test("shouldHaveATitle", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Default quantities");
  });

  // Should not have a bulk fields input as no default quantities
  test("shouldNotHaveABulkFieldsInput", () => {
    expect(component.find("BulkFieldsInput").length).toEqual(0);
  });
});

describe("baseComponentWithDefaultQuantitiesSection", () => {
  // Tests that the below default quantities are initialised correctly
  let dispatchCalls = [];

  const dispatchFunction = (dispatchObject) => {
    dispatchCalls.push(dispatchObject);
  };

  const contents = [
    {
      "default quantity cts": [
        {
          application: "Funding",
          "max quantity": "123.0foo",
          unit: "testUnit123",
        },
        {
          application: "Risk",
          "max quantity": 1234,
          unit: "testUnit1234",
        },
      ],
    },
  ];

  const component = mount(
    <DefaultQuantityCTParkAndLoan
      selectedProductIndex={0}
      contents={contents}
      dispatch={dispatchFunction}
      path={[]}
    />
  );

  test("shouldHaveATitle", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Default quantities");
  });

  test("shouldHaveABulkFieldsInput", () => {
    expect(component.find("BulkFieldsInput").length).toEqual(1);
  });

  test("shouldHaveADoubleEqualToTheFundingQuantity", () => {
    const double = component.find("Double");
    expect(double.length).toEqual(1);
    expect(double.props().value).toEqual("123.0foo");
  });

  test("shouldHaveAStringChoicesSelectorEqualToTheFundingUnit", () => {
    const stringChoicesSelector = component.find("StringChoicesSelector");
    expect(stringChoicesSelector.length).toEqual(1);
    expect(stringChoicesSelector.props().value).toEqual("testUnit123");
  });

  test("dispatchCalledWithCorrectArguments", () => {
    // Below call tests that the value is correctly parsed and updated from the string given
    expect(dispatchCalls[0]).toEqual({
      type: "update",
      value: 123,
      path: [0, "default quantity cts", 0, "max quantity"],
    });
    // In the below, the double values are not parsed as the dispatch function is mocked out
    expect(dispatchCalls[1]).toEqual({
      type: "update",
      value: [
        {
          application: "Funding",
          "max quantity": "123.0foo",
          unit: "testUnit123",
          "min quantity": "123.0foo",
          "base volume": "123.0foo",
        },
        {
          application: "Risk",
          "max quantity": "123.0foo",
          unit: "testUnit123",
          "min quantity": "123.0foo",
          "base volume": "123.0foo",
        },
      ],
      path: [0, "default quantity cts"],
    });
    // In the below, the double values are not parsed as the dispatch function is mocked out
    expect(dispatchCalls[2]).toEqual({
      type: "update",
      value: [
        {
          application: "Funding",
          "max quantity": "123.0foo",
          unit: "testUnit123",
          "min quantity": "123.0foo",
          "base volume": "123.0foo",
        },
        {
          application: "Risk",
          "max quantity": "123.0foo",
          unit: "testUnit123",
          "min quantity": "123.0foo",
          "base volume": "123.0foo",
        },
      ],
      path: [0, "default quantity cts"],
    });
    // In the below, the double values are not parsed as the dispatch function is mocked out
    // Should remove Risk default quantities
    expect(dispatchCalls[3]).toEqual({
      type: "update",
      value: [
        {
          application: "Funding",
          "max quantity": "123.0foo",
          unit: "testUnit123",
          "min quantity": "123.0foo",
          "base volume": "123.0foo",
        },
      ],
      path: [0, "default quantity cts"],
    });
    // In the below, the double values are not parsed as the dispatch function is mocked out
    // Should remove Risk default quantities
    expect(dispatchCalls[4]).toEqual({
      type: "update",
      value: [
        {
          application: "Funding",
          "max quantity": "123.0foo",
          unit: "testUnit123",
          "min quantity": "123.0foo",
          "base volume": "123.0foo",
        },
      ],
      path: [0, "default quantity cts"],
    });
  });
});
