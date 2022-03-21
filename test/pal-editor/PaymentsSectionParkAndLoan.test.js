import React from "react";
import { shallow } from "enzyme";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import PaymentsSectionParkAndLoan from "../../src/js/pal-editor/PaymentsSectionParkAndLoan";
import { INFINITY_KEY } from "../../src/js/common/constants";

describe("baseComponent", () => {
  // Tests the component when it does not have a payments section already
  let dispatchCalls = [];

  const dispatchFunction = (dispatchObject) => {
    dispatchCalls.push(dispatchObject);
  };

  const contents = {
    "settings ct": { "initial invoice pay day count": INFINITY_KEY },
  };

  const component = shallow(
    <PaymentsSectionParkAndLoan
      contents={contents}
      path={[]}
      dispatch={dispatchFunction}
    />
  );

  const button = component.find("button");

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual(" Payments");
  });

  // Tests checkHasPaymentsSection resolves to false
  test("shouldHaveAnAddPaymentsSectionButtonToggleOffIcon", () => {
    const fontAwesomeIcon = component.find("FontAwesomeIcon");
    expect(button.length).toEqual(1);
    expect(fontAwesomeIcon.length).toEqual(1);
    expect(fontAwesomeIcon.props().icon).toEqual(faToggleOff);
  });

  test("shouldNotHaveABulkFieldsInput", () => {
    expect(component.find("BuIkFieldsInput").length).toEqual(0);
  });

  // Tests addPaymentsSection
  test("clickAddPaymentsSectionButton", () => {
    button.simulate("click");
    expect(dispatchCalls.length).toEqual(1);
    expect(dispatchCalls[0].value).toEqual({
      "initial invoice pay day count": 0,
      "interim invoice pay day count": 0,
      "closing invoice pay day count": 0,
    });

    // Tests hasPaymentsSection is now set to true
    const fontAwesomeIcon = component.find("FontAwesomeIcon");
    expect(fontAwesomeIcon.length).toEqual(1);
    // Should now appear as an faToggleOn icon
    expect(fontAwesomeIcon.props().icon).toEqual(faToggleOn);

    // Should now have a BulkFieldsInput
    const bulkFieldsInput = component.find("BulkFieldsInput");
    expect(bulkFieldsInput.length).toEqual(1);
    expect(bulkFieldsInput.props().fieldNames.length).toEqual(2);
    expect(bulkFieldsInput.props().values).toEqual({
      "initial invoice pay day count": 0,
      "interim invoice pay day count": 0,
      "closing invoice pay day count": 0,
    });
  });
});

describe("baseComponentWithPaymentsSection", () => {
  // Tests the component when it has a payments section already
  let dispatchCalls = [];

  const dispatchFunction = (dispatchObject) => {
    dispatchCalls.push(dispatchObject);
  };

  const contents = {
    "settings ct": { "initial invoice pay day count": 123 },
  };

  const component = shallow(
    <PaymentsSectionParkAndLoan
      contents={contents}
      path={[]}
      dispatch={dispatchFunction}
    />
  );

  const button = component.find("button");

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Payments");
  });

  // Tests checkHasPaymentsSection resolves to true
  test("shouldHaveARemovePaymentsSectionButtonToggleOnIcon", () => {
    const fontAwesomeIcon = component.find("FontAwesomeIcon");
    expect(button.length).toEqual(1);
    expect(fontAwesomeIcon.length).toEqual(1);
    expect(fontAwesomeIcon.props().icon).toEqual(faToggleOn);
  });

  test("shouldHaveABulkFieldsInput", () => {
    const bulkFieldsInput = component.find("BulkFieldsInput");
    expect(bulkFieldsInput.length).toEqual(1);
    expect(bulkFieldsInput.props().fieldNames.length).toEqual(2);
    expect(bulkFieldsInput.props().values).toEqual({
      "initial invoice pay day count": 123,
    });
  });

  // Tests removePaymentsSection
  test("clickRemovePaymentsSectionButton", () => {
    button.simulate("click");
    expect(dispatchCalls.length).toEqual(1);
    expect(dispatchCalls[0].value).toEqual({
      "initial invoice pay day count": INFINITY_KEY,
      "interim invoice pay day count": INFINITY_KEY,
      "closing invoice pay day count": INFINITY_KEY,
    });

    // Tests hasPaymentsSection is now set to false
    const fontAwesomeIcon = component.find("FontAwesomeIcon");
    expect(fontAwesomeIcon.length).toEqual(1);
    // Should now appear as an faToggleOff icon
    expect(fontAwesomeIcon.props().icon).toEqual(faToggleOff);

    // Should now not have a BulkFieldsInput
    const bulkFieldsInput = component.find("BulkFieldsInput");
    expect(bulkFieldsInput.length).toEqual(0);
  });
});
