import React, { useEffect, useState } from "react";
import StringChoicesContext from "../common/StringChoicesContext";
import StringChoicesSelector from "../common/StringChoicesSelector";
import { useStringChoices } from "../common/StringChoicesContext";
import { Modal, ModalHeader, ModalBody } from "@react/modal";
import { NETTING_CMPNT_CT, SUCCESS } from "../common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { changeHandlerBasic } from "../common/useDeepObject";
import { cloneDeep } from "lodash";

export default function NettingTermsSettings(props) {
  const [showModal, setShowModal] = useState(false);
  const [stringChoices, setStringChoices] = useState({});
  const [ready, setReady] = useState(false);

  useStringChoices(
    { __type: NETTING_CMPNT_CT },
    [],
    ("component", "type"),
    setStringChoices
  );

  const nettingSchema = {
    __type: NETTING_CMPNT_CT,
    component: "",
    type: "",
  };

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  const resolveNettingGroupOfInterestIndex = (nettingGroup) => {
    for (
      let index = 0;
      index < props.contents["netting terms ct"]["netting group cts"].length;
      index++
    ) {
      if (
        props.contents["netting terms ct"]["netting group cts"][index][
          "netting group"
        ] === nettingGroup
      ) {
        return index;
      }
    }

    return -1;
  };

  const addPair = (nettingGroup) => {
    const outerIndex = resolveNettingGroupOfInterestIndex(nettingGroup);

    if (outerIndex === -1) {
      return;
    }

    let newSelectors =
      props.contents["netting terms ct"]["netting group cts"][outerIndex][
        "netting components ct"
      ];

    newSelectors.push(cloneDeep(nettingSchema));

    changeHandlerBasic(
      props.dispatch,
      [...props.path, "netting terms ct", "netting group cts", outerIndex],
      "netting components ct",
      newSelectors
    );
  };

  const deletePair = (outerIndex, innerIndex) => {
    let newSelectors =
      props.contents["netting terms ct"]["netting group cts"][outerIndex][
        "netting components ct"
      ];

    newSelectors.splice(innerIndex, 1);

    changeHandlerBasic(
      props.dispatch,

      [...props.path, "netting terms ct", "netting group cts", outerIndex],
      "netting components ct",
      newSelectors
    );
  };

  const getBiSelectors = (nettingGroup) => {
    let components = [];
    let outerIndex = resolveNettingGroupOfInterestIndex(nettingGroup);

    if (outerIndex === -1) {
      return components;
    }

    const nettingGroupOfInterest =
      props.contents["netting terms ct"]["netting group cts"][outerIndex];

    if (
      nettingGroupOfInterest &&
      nettingGroupOfInterest["netting components ct"]
    ) {
      nettingGroupOfInterest["netting components ct"].map(
        (nettingComponent, innerIndex) => {
          components.push(
            <div
              className="bi-dropdown-outer"
              key={`netting terms outer ${nettingGroup} ${innerIndex}`}
            >
              <div
                className="row bi-dropdown-item"
                key={`netting terms component ${nettingGroup} ${innerIndex}`}
              >
                <div className="col-sm-3">Component:</div>
                <StringChoicesContext.Provider value={stringChoices}>
                  <div className="col-sm-8">
                    <StringChoicesSelector
                      value={nettingComponent.component}
                      dispatch={props.dispatch}
                      path={[
                        ...props.path,
                        "netting terms ct",
                        "netting group cts",
                        outerIndex,
                        "netting components ct",
                        innerIndex,
                      ]}
                      field="component"
                    />
                  </div>
                </StringChoicesContext.Provider>
              </div>
              <div
                className="row bi-dropdown-item"
                key={`netting terms value ${nettingGroup} ${innerIndex}`}
              >
                <div className="col-sm-3">Value:</div>
                <StringChoicesContext.Provider value={stringChoices}>
                  <div className="col-sm-8">
                    <StringChoicesSelector
                      value={nettingComponent.type}
                      dispatch={props.dispatch}
                      path={[
                        ...props.path,
                        "netting terms ct",
                        "netting group cts",
                        outerIndex,
                        "netting components ct",
                        innerIndex,
                      ]}
                      field="type"
                    />
                  </div>
                  <div className="col-sm-1 button-col-right">
                    <button
                      className="small-action-button"
                      onClick={() => {
                        deletePair(outerIndex, innerIndex);
                      }}
                      title="Delete pair"
                    >
                      <FontAwesomeIcon
                        icon={faBackspace}
                        className="button-icon"
                      />
                    </button>
                  </div>
                </StringChoicesContext.Provider>
              </div>
            </div>
          );
        }
      );
    }

    return components;
  };

  useEffect(() => {
    if (
      stringChoices.status &&
      stringChoices.status.toLowerCase() === SUCCESS
    ) {
      setReady(true);
    }
  }, [stringChoices.status]);

  return (
    <>
      <a href="#!">
        <div className="nav-link" onClick={toggleShowModal}>
          {" "}
          Netting terms
        </div>
      </a>
      {showModal && ready && (
        <Modal
          visible={showModal}
          onVisibilityToggle={toggleShowModal}
          placement="center"
          className="modal-container-large"
        >
          <ModalHeader onDismissButtonClick={toggleShowModal}>
            {" "}
            Netting terms
          </ModalHeader>
          <ModalBody>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">
                  {" "}
                  Monthly true up settlements
                </h1>
                <button
                  className="small-action-button settings-button"
                  onClick={() => {
                    addPair("Monthly True Up Settlements");
                  }}
                  title="Add monthly true up settlements pair"
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    className="button-icon"
                  />
                </button>
              </div>
              <div className="container">
                {getBiSelectors("Monthly True Up Settlements")}
              </div>
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">
                  {" "}
                  Provisional settlements
                </h1>
                <button
                  className="small-action-button settings-button"
                  onClick={() => {
                    addPair("Provisional Settlements");
                  }}
                  title="Add provisional settlements pair"
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    className="button-icon"
                  />
                </button>
              </div>
              <div className="container">
                {getBiSelectors("Provisional Settlements")}
              </div>
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">Stepin settlements</h1>
                <button
                  className="small-action-button settings-button"
                  onClick={() => {
                    addPair("Stepin Settlements");
                  }}
                  title="Add stepin settlements pair"
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    className="button-icon"
                  />
                </button>
              </div>
              <div className="container">
                {getBiSelectors("Stepin Settlements")}
              </div>
            </div>
            <div className="container nested-ct">
              <div className="row">
                <h1 className="modal-settings-header">Stepout settlements</h1>
                <button
                  className="small-action-button settings-button"
                  onClick={() => {
                    addPair("Stepout Settlements");
                  }}
                  title="Add stepout settlements pair"
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    className="button-icon"
                  />
                </button>
              </div>
              <div className="container">
                {getBiSelectors("Stepout Settlements")}
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}
