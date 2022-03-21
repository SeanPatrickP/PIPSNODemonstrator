import React from "react";
import { shallow, mount } from "enzyme";
import InventoryPeriodSectionParkAndLoan from "../../src/js/pal-editor/InventoryPeriodSectionParkAndLoan";
import {
  BASE_VOLUME_FORMULA,
  EMPTY_CT_OBJECT,
  INITIAL_EXCHANGE,
  INTERIM_EXCHANGE,
  INV_PRICE_CT,
} from "../../src/js/common/constants";

describe("baseComponent", () => {
  // Tests the bare-bones init of the component
  const component = shallow(<InventoryPeriodSectionParkAndLoan />);

  test("shouldHaveATitle", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Inventory periods");
  });

  test("shouldHaveAProductSelector", () => {
    expect(component.find("ProductSelector").length).toEqual(1);
  });
});

describe("baseComponentWithMinimalInventoryPeriodSection", () => {
  // Tests that the below inventory periods are initialised correctly
  let dispatchCalls = [];

  const dispatchFunction = (dispatchObject) => {
    dispatchCalls.push(dispatchObject);
  };

  const contents = {
    "inventory cts": [
      { "inventory period cts": [{ "period name": INITIAL_EXCHANGE }] },
    ],
  };

  const productNames = ["foo"];

  const component = mount(
    <InventoryPeriodSectionParkAndLoan
      selectedProductIndex={0}
      contents={contents}
      allProductNames={productNames}
      dispatch={dispatchFunction}
    />
  );

  const h1 = component.find("h1");

  const forumlaComponent = component.find("FormulaComponent");

  test("shouldHaveATitle", () => {
    expect(h1.at(0).text()).toEqual("Inventory periods");
  });

  test("shouldHaveAProductSelector", () => {
    expect(component.find("ProductSelector").length).toEqual(1);
  });

  test("shouldHaveATitleForEachInventoryPeriodSection", () => {
    expect(h1.at(1).text()).toEqual("Initial price");
    expect(h1.at(2).text()).toEqual("Initial provisional");
    expect(h1.at(3).text()).toEqual("Closing price");
    expect(h1.at(4).text()).toEqual("Closing provisional");
  });

  test("shouldHaveFourFormulaComponents", () => {
    expect(forumlaComponent.length).toEqual(4);
  });

  test("useEffectInitInventoryPeriods", () => {
    // Tests getPriceCTsIndexAndRemoveUnUsed
    for (
      let inventoryPeriodIndex = 0;
      inventoryPeriodIndex < 4;
      inventoryPeriodIndex++
    ) {
      const propsContents = forumlaComponent.at(inventoryPeriodIndex).props()
        .contents[0];

      expect(propsContents["formula name"]).toEqual(BASE_VOLUME_FORMULA);
      expect(propsContents["settlement ct"]).toEqual(EMPTY_CT_OBJECT);
      expect(propsContents["price component cts"].length).toEqual(1);
      expect(propsContents["price component cts"][0].weight).toEqual(1);
      expect(propsContents["__type"]).toEqual(INV_PRICE_CT);
    }
  });

  test("dispatchCalledWithFiveInventoryPeriods", () => {
    expect(dispatchCalls.length).toEqual(1);
    expect(dispatchCalls[0].value.length).toEqual(5);
  });

  test("dispatchCalledWithCorrectInventoryPeriodWeights", () => {
    let interimExchangeHits = 0;
    let standardInventoryPeriodHits = 0;

    dispatchCalls[0].value.forEach((inventoryPeriod) => {
      expect(inventoryPeriod["price cts"].length).toEqual(1);
      expect(
        inventoryPeriod["price cts"][0]["price component cts"].length
      ).toEqual(1);

      if (inventoryPeriod["period name"] === INTERIM_EXCHANGE) {
        interimExchangeHits++;
        expect(
          inventoryPeriod["price cts"][0]["price component cts"][0].weight
        ).toEqual(0);
      } else {
        standardInventoryPeriodHits++;
        expect(
          inventoryPeriod["price cts"][0]["price component cts"][0].weight
        ).toEqual(1);
      }
    });

    expect(interimExchangeHits).toEqual(1);
    expect(standardInventoryPeriodHits).toEqual(4);
  });
});

describe("baseComponentWithExistingInventoryPeriodSection", () => {
  // Tests that the below unknown inventory period testPeriod is removed and the Initial Exchange inventory period has {foo: bar} preserved. Also tests the other inventory periods are initialised correctly
  let dispatchCalls = [];

  const dispatchFunction = (dispatchObject) => {
    dispatchCalls.push(dispatchObject);
  };

  const contents = {
    "inventory cts": [
      {
        "inventory period cts": [
          { "period name": INITIAL_EXCHANGE, "price cts": [{ foo: "bar" }] },
          { "period name": "testPeriod" },
        ],
      },
    ],
  };

  const productNames = ["foo"];

  const component = mount(
    <InventoryPeriodSectionParkAndLoan
      selectedProductIndex={0}
      contents={contents}
      allProductNames={productNames}
      dispatch={dispatchFunction}
    />
  );

  const h1 = component.find("h1");
  const forumlaComponent = component.find("FormulaComponent");

  test("shouldHaveATitle", () => {
    expect(h1.at(0).text()).toEquaI("Inventory periods");
  });

  test("shouldHaveAProductSelector", () => {
    expect(component.find("ProductSelector").length).toEqual(1);
  });

  test("shouldHaveATitleForEachlnventoryPeriodSection", () => {
    expect(h1.at(1).text()).toEqual("Initial price");
    expect(h1.at(2).text()).toEqual("Initial provisional");
    expect(h1.at(3).text()).toEqual("Closing price");
    expect(h1.at(4).text()).toEqual("Closing provisional");
  });

  test("shouldHaveFourFormulaComponents", () => {
    expect(forumlaComponent.length).toEqual(4);
  });

  test("useEffectInitInventoryPeriods", () => {
    // Tests getPriceCTslndexAndRemoveUnUsed
    for (
      let inventoryPeriodIndex = 0;
      inventoryPeriodIndex < 4;
      inventoryPeriodIndex++
    ) {
      const propsContents = forumlaComponent.at(inventoryPeriodIndex).props()
        .contents[0];

      if (inventoryPeriodIndex === 0) {
        // This block signifies the Initial Exchange inventory period that already existed before init
        expect(propsContents).toEqual({ foo: "bar" });
      } else {
        expect(propsContents["formula name"]).toEqual(BASE_VOLUME_FORMULA);
        expect(propsContents["settlement ct"]).toEqual(EMPTY_CT_OBJECT);
        expect(propsContents["price component cts"].length).toEqual(1);
        expect(propsContents["price component cts"][0].weight).toEqual(1);
        expect(propsContents["__type"]).toEqual(INV_PRICE_CT);
      }
    }
  });

  test("dispatchCalledWithFiveInventoryPeriods", () => {
    expect(dispatchCalls.length).toEqual(1);
    expect(dispatchCalls[0].value.length).toEqual(5);
  });

  test("dispatchCalledWithCorrectInventoryPeriodWeights", () => {
    let interimExchangeHits = 0;
    let initialExchangeHits = 0;
    let standardInventoryPeriodHits = 0;

    dispatchCalls[0].value.forEach((inventoryPeriod) => {
      expect(inventoryPeriod["price cts"].length).toEqual(1);
      if (inventoryPeriod["period name"] === INTERIM_EXCHANGE) {
        interimExchangeHits++;
        expect(
          inventoryPeriod["price cts"][0]["price component cts"].length
        ).toEqual(1);
        expect(
          inventoryPeriod["price cts"][0]["price component cts"][0].weight
        ).toEqual(0);
      } else if (inventoryPeriod["period name"] === INITIAL_EXCHANGE) {
        // This block signifies the Initial Exchange inventory period that already existed before init
        initialExchangeHits++;
        expect(inventoryPeriod["price cts"][0]).toEqual({ foo: "bar" });
      } else {
        standardInventoryPeriodHits++;
        expect(
          inventoryPeriod["price cts"][0]["price component cts"].length
        ).toEqual(1);
        expect(
          inventoryPeriod["price cts"][0]["price component cts"][0].weight
        ).toEqual(1);
      }
    });

    expect(interimExchangeHits).toEqual(1);
    expect(initialExchangeHits).toEqual(1);
    expect(standardInventoryPeriodHits).toEqual(3);
  });
});
