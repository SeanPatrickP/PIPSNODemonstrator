import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox } from "@react/checkbox";

export default function BlueBox(props) {
  const riskHints = ["Min", "Max", ""];

  const getChoiceComponents = () => {
    let components = [];

    riskHints.map((riskHint, index) => {
      let riskHintDisplay = riskHint;

      if (riskHint === "") {
        riskHintDisplay = "None";
      }

      components.push(
        <div className="risk-hint-outer" key={`risk hint outer ${index}`}>
          <p className="blue-box-risk-hint-title">
            <b>{riskHintDisplay}</b>
          </p>
          <Checkbox
            className="blue-box-check-box"
            checked={props.selectedRiskHint === riskHint}
            onChange={() => props.setSelectedRiskHint(riskHint)}
          />
        </div>
      );
    });

    return components;
  };

  return (
    <div className="info-box blue-box">
      <div className="info-box-header blue-box-header">
        <button
          className="small-action-button float-right info-box-close"
          onClick={props.onToggle}
          title="Close risk hints for quantity"
        >
          <FontAwesomeIcon icon={faTimes} className="button-icon" />
        </button>
        <h1>Risk hints for quantity</h1>
      </div>

      <div className="info-box-contents">{getChoiceComponents()}</div>
    </div>
  );
}
