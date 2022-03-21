import React from "react";
import { shallow } from "enzyme";
import BlueBox from "../../src/js/editor-presenter/BlueBox";

const onToggleFunction = jest.fn(() => {
  return true;
});

const setSelectedRiskHintFunction = jest.fn((riskHint) => {
  return riskHint;
});

describe("baseComponent", () => {
  // Tests the bare-bones init of the component
  const component = shallow(
    <BlueBox
      onToggle={onToggleFunction}
      setSelectedRiskHint={setSelectedRiskHintFunction}
    />
  );

  test("shouldHaveAToggleButton", () => {
    const button = component.find("button");
    expect(button.length).toEqual(1);

    button.simulate("click");
    expect(onToggleFunction.mock.calls.length).toEqual(1);
  });

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Risk hints for quantity");
  });

  test("shouldHaveThreeCheckboxes", () => {
    const checkbox = component.find("Checkbox");
    expect(checkbox.length).toEqual(3);

    checkbox.at(0).simulate("change", { target: { checked: true } });
    expect(setSelectedRiskHintFunction.mock.calls.length).toEqual(1);
    expect(setSelectedRiskHintFunction.mock.calls[0].length).toEqual(1);
    expect(setSelectedRiskHintFunction.mock.calls[0][0]).toEqual("Min");

    checkbox.at(1).simulate("change", { target: { checked: true } });
    expect(setSelectedRiskHintFunction.mock.calls.length).toEqual(2);
    expect(setSelectedRiskHintFunction.mock.calls[1].length).toEqual(1);
    expect(setSelectedRiskHintFunction.mock.calls[1][0]).toEqual("Max");

    checkbox.at(2).simulate("change", { target: { checked: true } });
    expect(setSelectedRiskHintFunction.mock.calls.length).toEqual(3);
    expect(setSelectedRiskHintFunction.mock.calls[2].length).toEqual(1);
    expect(setSelectedRiskHintFunction.mock.calls[2][0]).toEqual("");
  });
});
