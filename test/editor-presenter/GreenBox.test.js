import React from "react";
import { shallow, mount } from "enzyme";
import { waitFor } from "@testing-library/react";
import GreenBox from "../../src/js/editor-presenter/GreenBox";
import { SUCCESS } from "../../src/js/common/constants";

// The below is required for regeneratorRuntime
require("babel-polyfill");

beforeEach(() => {
  fetch.resetMocks();
});

const onToggleFunction = jest.fn(() => {
  return true;
});

describe("baseComponent", () => {
  // Tests the bare-bones init of the component
  const component = shallow(<GreenBox onToggle={onToggleFunction} />);

  test("shouldHaveAToggleButton", () => {
    const button = component.find("button");
    expect(button.length).toEqual(1);

    button.simulate("click");
    expect(onToggleFunction.mock.calls.length).toEqual(1);
  });

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Differences");
  });

  test("shouldHaveNoDiffs", () => {
    const b = component.find("b");
    expect(b.length).toEqual(1);
    expect(b.text()).toEqual("No diffs");
  });
});

describe("baseComponentStringDiffs", () => {
  // Tests the component with a diff of string type
  let component = null;

  test("shouldWaitForRender", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ diffs: "testStringDiffs", status: SUCCESS })
    );

    component = mount(<GreenBox onToggle={onToggleFunction} dataId={"test"} />);

    await waitFor(() => {
      // A html b tag indicates a diff component has been added to the dom and async useEffect init hook has completed
      expect(component.find("b").length).toEqual(1);
    });
  });

  test("shouldHaveAToggleButton", () => {
    const button = component.find("button");
    expect(button.length).toEqual(1);

    button.simulate("click");
    expect(onToggleFunction.mock.calls.length).not.toEqual(0);
  });

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Differences");
  });

  test("shouldHaveStringDiffs", () => {
    const b = component.find("b");
    expect(b.length).toEqual(1);
    expect(b.text()).toEqual("testStringDiffs");
  });
});

describe("baseComponentStructuredDiffs", () => {
  // Tests the component with a diff of object type
  let component = null;

  test("shouldWaitForRender", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        diffs: [
          {
            new: "testNewValue1",
            old: "testOldValue1",
            "term path": "testTermPath1",
          },
          {
            new: "testNewValue2",
            old: "testOldValue2",
            "term path": "testTermPath2",
          },
        ],
        status: SUCCESS,
      })
    );

    component = mount(<GreenBox onToggle={onToggleFunction} datald={"test"} />);

    await waitFor(() => {
      // A html b tag indicates a diff component has been added to the dom and async useEffect init hook has completed
      expect(component.find("b").length).not.toEqual(0);
    });
  });

  test("shouldHaveAToggleButton", () => {
    const button = component.find("button");
    expect(button.length).toEqual(1);

    button.simulate("click");
    expect(onToggleFunction.mock.calls.length).toEqual(1);
  });

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Differences");
  });

  test("shouldHaveStructuredDiffs", () => {
    const b = component.find("b");
    expect(b.length).toEqual(6);
    expect(b.at(0).text()).toEqual("New: ");
    expect(b.at(1).text()).toEqual("Old: ");
    expect(b.at(2).text()).toEqual("Path: ");
    expect(b.at(3).text()).toEqual("New: ");
    expect(b.at(4).text()).toEqual("Old: ");
    expect(b.at(5).text()).toEqual("Path: ");

    const pre = component.find("pre");
    expect(pre.length).toEqual(6);
    expect(pre.at(0).text()).toEqual("testNewValue1");
    expect(pre.at(1).text()).toEqual("testOldValue1");
    expect(pre.at(2).text()).toEqual("testTermPath1");
    expect(pre.at(3).text()).toEqual("testNewValue2");
    expect(pre.at(4).text()).toEqual("testOldValue2");
    expect(pre.at(5).text()).toEqual("testTermPath2");
  });
});
