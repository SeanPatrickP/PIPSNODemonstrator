import React from "react";
import { shallow } from "enzyme";
import ParkAndLoanEditor from "../../src/js/pal-editor/ParkAndLoanEditor";

describe("baseComponent", () => {
  // Tests the bare-bones init of the component
  const component = shallow(
    <ParkAndLoanEditor
      contents={{}}
      dispatch={{}}
      allProductNames={[]}
      setAllProductNames={{}}
      productTypes={[]}
    />
  );

  test("shouldHaveADealInfoSection", () => {
    expect(component.find("DealInfoSection").length).toEqual(1);
  });

  test("shouldHaveAnInventorySection", () => {
    const inventorySection = component.find("InventorySection");
    expect(inventorySection.length).toEqual(1);
    expect(inventorySection.props().selectedProductIndex).toEqual(-1);
  });

  // Tests that the selectedProductIndex resolves as -1
  test("shouldHaveTwoHiddenSections", () => {
    expect(component.find("HiddenSectionDueToProduct").length).toEqual(2);
  });

  test("shouldHaveAnInvoicingSection", () => {
    expect(component.find("InvoicingSection").length).toEqual(1);
  });

  test("shouldHaveAPaymentsSectionParkAndLoan", () => {
    expect(component.find("PaymentsSectionParkAndLoan").length).toEqual(1);
  });
});

describe("baseComponentWithProductNames", () => {
  // Tests the bare-bones init of the component
  const allProductNames = ["foo", "bar"];

  const component = shallow(
    <ParkAndLoanEditor
      contents={{}}
      dispatch={{}}
      allProductNames={allProductNames}
      setAllProductNames={{}}
      productTypes={[]}
    />
  );

  test("shouldHaveADealInfoSection", () => {
    expect(component.find("DealInfoSection").length).toEqual(1);
  });

  test("shouldHaveAnInventorySection", () => {
    const inventorySection = component.find("InventorySection");
    expect(inventorySection.length).toEqual(1);
    expect(inventorySection.props().selectedProductIndex).toEqual(0);
  });

  // Tests that the selectedProductIndex does not resolve as -1
  test("shouldNotHaveHiddenSections", () => {
    expect(component.find("HiddenSectionDueToProduct").length).toEqual(0);
  });

  test("shouldHaveAQuantitySectionParkAndLoan", () => {
    expect(component.find("QuantitySectionParkAndLoan").length).toEqual(1);
  });

  test("shouldHaveAnInventoryPeriodSectionParkAndLoan", () => {
    expect(component.find("InventoryPeriodSectionParkAndLoan").length).toEqual(
      1
    );
  });

  test("shouldHaveAnInvoicingSection", () => {
    expect(component.find("InvoicingSection").length).toEqual(1);
  });

  test("shouldHaveAPaymentsSectionParkAndLoan", () => {
    expect(component.find("PaymentsSectionParkAndLoan").length).toEqual(1);
  });
});
