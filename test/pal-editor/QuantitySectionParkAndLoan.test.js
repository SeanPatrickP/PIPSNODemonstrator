import React from "react";
import { shallow } from "enzyme";
import QuantitySectionParkAndLoan from "../../src/js/pal-editor/QuantitySectionParkAndLoan";

describe("baseComponent", () => {
  // Tests the bare-bones init of the component
  const contents = { "inventory cts": [] };

  const component = shallow(<QuantitySectionParkAndLoan contents={contents} />);

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Quantity");
  });

  test("shouldHaveAProductSelector", () => {
    expect(component.find("ProductSelector").length).toEqual(1);
  });

  test("shouldHaveADefaultQuantityCTParkAndLoan", () => {
    expect(component.find("DefaultQuantityCTParkAndloan").length).toEqual(1);
  });
});
