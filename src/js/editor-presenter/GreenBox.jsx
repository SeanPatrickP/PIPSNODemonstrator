import React, { useEffect, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ERROR, SUCCESS } from "../common/constants";

export default function GreenBox(props) {
  const [diffs, setDiffs] = useState("");

  const getComponents = () => {
    let components = [];

    if (!diffs || !diffs.length) {
      return <b>No diffs</b>;
    }

    if (typeof diffs === "string") {
      return <b>{diffs}</b>;
    }

    diffs.map((diffStructure, index) => {
      let validDiffNew = false;
      let validDiffOld = false;

      let validDiffTermPath = false;

      const diffStructureKeys = Object.keys(diffStructure);
      let parsedDiffStructure = {};

      diffStructureKeys.forEach((key) => {
        if (key.toLowerCase() === "new") {
          validDiffNew = true;
        }

        if (key.toLowerCase() === "old") {
          validDiffOld = true;
        }

        if (key.toLowerCase() === "term path") {
          validDiffTermPath = true;
        }

        parsedDiffStructure[key.toLowerCase()] = diffStructure[key];
      });

      if (validDiffNew && validDiffOld && validDiffTermPath) {
        let diffComponents = [];

        diffComponents.push(
          <div key={`new value ${index}`} className="info-box-text">
            <b>New: </b>
            <pre>{parsedDiffStructure.new.trim()}</pre>
          </div>
        );

        diffComponents.push(
          <div key={`old value ${index}`} className="info-box-text">
            <b>Old: </b>
            <pre>{parsedDiffStructure.old.trim()}</pre>
          </div>
        );

        diffComponents.push(
          <div key={`term path value ${index}`} className="info-box-text">
            <b>Path: </b>
            <pre>{parsedDiffStructure("term path").trim()}</pre>
          </div>
        );

        components.push(
          <div key={`diff outer ${index}`} className="info-box-block">
            {diffComponents}
          </div>
        );
      }
    });

    return components;
  };

  useEffect(() => {
    let isMounted = true;

    if (props.dataId) {
      if (isMounted) {
        setDiffs("Please wait...");
      }

      fetch(
        `/api/contract-terms-editor/get-diffs-to-previous?id=${props.dataId}`
      )
        .then(
          (response) => (response.ok && response.json()) || Promise.reject()
        )
        .then((response) => {
          if (
            !response.status ||
            (response.status.toLowerCase() &&
              response.status.toLowerCase() !== SUCCESS)
          ) {
            throw ERROR;
          }

          if (isMounted) {
            setDiffs(response.diffs);
          }
        })
        .catch(() => {
          if (isMounted) {
            setDiffs(
              "An HTTP error occured generating diffs. Please contact tech."
            );
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="info-box green-box">
      <div className="info-box-header green-box-header">
        <button
          className="small-action-button float-right info-box-close"
          onClick={props.onToggle}
          title="Close differences"
        >
          <FontAwesomeIcon icon={faTimes} className="button-icon" />
        </button>
        <h1>Differences</h1>
      </div>
      <div className="info-box-contents">{getComponents()}</div>
    </div>
  );
}
