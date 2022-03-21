import React from "react";
import { shallow } from "enzyme";
import RedBox from "../../src/js/editor-presenter/RedBox";
import {
  ERROR,
  FAIL,
  KEY_MAP_ERROR,
  VALIDATION_ERRORS,
  VALIDATION_FAILURE,
} from "../../src/js/common/constants";

const onToggleFunction = jest.fn(() => {
  return true;
});

describe("baseComponent", () => {
  // Tests the bare-bones init of the component this means no issues
  const component = shallow(<RedBox onToggle={onToggleFunction} />);

  test("shouldHaveAToggleButton", () => {
    const button = component.find("button");
    expect(button.length).toEqual(1);

    button.simulate("click");
    expect(onToggleFunction.mock.calls.length).toEqual(1);
  });

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Issues");
  });

  test("shouldHaveNoIssues", () => {
    const b = component.find("b");
    expect(b.length).toEqual(1);
    expect(b.text()).toEqual("No Issues");

    const span = component.find("span");
    expect(span.length).toEqual(0);
  });
});

describe("baseComponentValidationErrorsAndPath", () => {
  // Tests the component with validation errors and a path given where the error occured
  const errors = [{ errors: ["testError1", "testError2"], path: "testPath" }];

  const component = shallow(
    <RedBox
      onToggle={onToggleFunction}
      errorType={VALIDATION_ERRORS}
      errors={errors}
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
    expect(h1.text()).toEqual("Issues");
  });

  test("shouldHaveIssueComponentsAndAPath", () => {
    const b = component.find("b");
    expect(b.length).toEqual(3);
    expect(b.at(0).text()).toEqual("Error: ");
    expect(b.at(1).text()).toEqual("Error: ");
    expect(b.at(2).text()).toEqual("Path: ");

    const span = component.find("span");
    expect(span.length).toEqual(3);
    expect(span.at(0).text()).toEqual("testError1");
    expect(span.at(1).text()).toEqual("testError2");
    expect(span.at(2).text()).toEqual("testPath");
  });
});

describe("baseComponentValidationErrorsNoPath", () => {
  // Tests the component with validation errors but no path
  const errors = [{ errors: ["testError1", "testError2"] }];

  const component = shallow(
    <RedBox
      onToggle={onToggleFunction}
      errorType={VALIDATION_ERRORS}
      errors={errors}
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
    expect(h1.text()).toEqual("Issues");
  });

  test("shouldHaveIssueComponentsAndNoPath", () => {
    const b = component.find("b");
    expect(b.length).toEqual(2);
    expect(b.at(0).text()).toEqual("Error: ");
    expect(b.at(1).text()).toEqual("Error: ");

    const span = component.find("span");
    expect(span.length).toEqual(2);
    expect(span.at(0).text()).toEqual("testError1");
    expect(span.at(1).text()).toEqual("testError2");
  });
});

describe("baseComponentValidationFailuresAndJobID", () => {
  // Tests the component with validation failures and a job id given specific to the validation failure
  const component = shallow(
    <RedBox
      onToggle={onToggleFunction}
      errorType={VALIDATION_FAILURE}
      failures={"testFailure"}
      joblD={"testJobID"}
    />
  );

  test("shouldHaveAToggleButton", () => {
    const button = component.find("button");
    expect(button.length).toEqual(1);

    button.simulate("click");
    expect(onToggleFunction.mock.calls.length).toEqua(1);
  });

  test("shouldHaveAHeader", () => {
    const h1 = component.find("h1");
    expect(h1.length).toEqual(1);
    expect(h1.text()).toEqual("Issues");
  });

  test("shouldHaveIssueComponentsAndAJobID", () => {
    const b = component.find("b");
    expect(b.length).toEqual(2);
    expect(b.at(0).text()).toEqual("Faiiure: ");
    expect(b.at(1).text()).toEqual("Job ID: ");

    const span = component.find("span");
    expect(span.length).toEqual(2);
    expect(span.at(0).text()).toEqual("testFailure");
    expect(span.at(1).text()).toEqual("testJobID");
  });
});

describe("baseComponentValidationFailuresNoJobID", () => {
  // Tests the component with validation failures but no job id
  const component = shallow(
    <RedBox
      onToggle={onToggleFunction}
      errorType={VALIDATION_FAILURE}
      failures={"testFailure"}
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
    expect(h1.text()).toEqual("Issues");
  });

  test("shouldHaveIssueComponentsAndNoJobID", () => {
    const b = component.find("b");
    expect(b.length).toEqual(1);
    expect(b.at(0).text()).toEqual("Failure:");

    const span = component.find("span");
    expect(span.length).toEqual(1);
    expect(span.at(0).text()).toEqual("testFailure");
  });
});

describe("baseComponentFail", () => {
  // Tests the component with fail status
  const component = shallow(
    <RedBox onToggle={onToggleFunction} errorType={FAIL} />
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
    expect(h1.text()).toEqual("Issues");
  });

  test("shouldHaveIssueComponents", () => {
    const b = component.find("b");
    expect(b.length).toEqual(1);
    expect(b.at(0).text()).toEqual("Failure: ");

    const span = component.find("span");
    expect(span.length).toEqual(1);
    expect(span.at(0).text()).toEqual(
      "HTTP error occured. Please contact tech."
    );
  });
});

describe("baseComponentError", () => {
  // Tests the component with error status
  const component = shallow(
    <RedBox
      onToggle={onToggleFunction}
      calcErrorType={ERROR}
      calcError={"testCalcError"}
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
    expect(h1.text()).toEquaI("Issues");
  });

  test("shouldHaveIssueComponents", () => {
    const b = component.find("b");
    expect(b.length).toEqual(1);
    expect(b.at(0).text()).toEqual("Dollar Price Error: ");

    const span = component.find("span");
    expect(span.length).toEqual(1);
    expect(span.at(0).text()).toEqual("testCalcError");
  });
});

describe("baseComponentKeyMapError", () => {
  // Tests the component with key map error status
  const component = shallow(
    <RedBox
      onToggle={onToggleFunction}
      calcErrorType={KEY_MAP_ERROR}
      calcError={"testCalcError"}
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
    expect(h1.text()).toEqual("Issues");
  });

  test("shouldHavelssueComponents", () => {
    const b = component.find("b");
    expect(b.length).toEqual(1);
    expect(b.at(0).text()).toEqual("Dollar Price Error: ");

    const span = component.find("span");
    expect(span.length).toEqual(1);
    expect(span.at(0).text()).toEqual("testCalcError");
  });
});
