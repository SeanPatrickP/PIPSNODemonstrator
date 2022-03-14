import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ERROR,
  FAIL,
  KEY_MAP_ERROR,
  VALIDATION_ERRORS,
  VALIDATION_FAILURE,
} from "../common/constants";

export default function RedBox(props) {
  const getErrorComponents = () => {
    if (
      props.errorType &&
      props.errorType.toLowerCase() === VALIDATION_ERRORS
    ) {
      let components = [];

      props.errors.map((error, index) => {
        let errorComponents = [];

        if ("errors" in error && error.errors.length) {
          error.errors.map((innerError, innerIndex) => {
            errorComponents.push(
              <p
                key={`error context ${index} ${innerIndex}`}
                className="info-box-text"
              >
                <b>Error: </b>
                <span>{innerError}</span>
              </p>
            );
          });
        }

        if ("path" in error && error.path.length) {
          errorComponents.push(
            <p key={`error path ${index}`} className="info-box-text">
              <b>Path: </b>
              <span>{error.path}</span>
            </p>
          );
        }

        components.push(
          <div key={`error outer ${index}`} className="info-box-block">
            {errorComponents}
          </div>
        );
      });

      return components;
    } else if (
      props.errorType &&
      props.errorType.toLowerCase() === VALIDATION_FAILURE
    ) {
      let components = [];

      let failureComponents = [];

      failureComponents.push(
        <p key="failure context" className="info-box-text">
          <b>Failure: </b>
          <span>{props.failures}</span>
        </p>
      );

      if (props.jobID) {
        failureComponents.push(
          <p key="failure job id" className="info-box-text">
            <b>Job ID: </b>
            <span>{props.jobID}</span>
          </p>
        );
      }

      components.push(
        <div key="failure outer" className="info-box-block">
          {failureComponents}
        </div>
      );

      return components;
    } else if (props.errorType && props.errorType.toLowerCase() === FAIL) {
      return (
        <div key="failure outer" className="info-box-block">
          <p key="failure context" className="info-box-text">
            <b>Failure: </b>
            <span>HTTP error occured. Please contact tech.</span>
          </p>
        </div>
      );
    } else if (
      props.calcErrorType &&
      (props.calcErrorType.toLowerCase() === ERROR ||
        props.calcErrorType.toLowerCase() === KEY_MAP_ERROR)
    ) {
      return (
        <div key="failure outer" className="info-box-block">
          <p key="failure context" className="info-box-text">
            <b>Dollar Price Error: </b>
            <span>{props.calcError}</span>
          </p>
        </div>
      );
    } else {
      return <b>No Issues</b>;
    }
  };

  const getRedBoxLocationClass = () => {
    // Calc error red box should appear to left of status bar
    if (props.calcErrorType) {
      return "";
    }

    return "red-box-right";
  };

  return (
    <div className={`info-box ${getRedBoxLocationClass()} red-box`}>
      <div className="info-box-header red-box-header">
        <button
          className="small-action-button float-right info-box-close"
          onClick={props.onToggle}
          title="Close issues"
        >
          <FontAwesomeIcon icon={faTimes} className="button-icon" />
        </button>
        <h1>Issues</h1>
      </div>
      <div className="info-box-contents">{getErrorComponents()}</div>
    </div>
  );
}
