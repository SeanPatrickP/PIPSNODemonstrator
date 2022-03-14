import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "@react/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { cloneDeep } from "lodash";
import { NO_INDEX, ROW_INDEX } from "./constants";

export default function IndexCellSelectorModal(props) {
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [choices, setChoices] = useState([]);

  const [filteredChoices, setFilteredChoices] = useState([]);

  const [expandedConfirmLanguages, setExpandedConfirmLanguages] = useState({});
  const [ready, setReady] = useState(null);

  const toggleShowModal = () => {
    setExpandedConfirmLanguages({});
    setShowModal(!showModal);
  };

  const resolveClickTextName = (text) => {
    if (text && text.length) {
      return text;
    }

    return NO_INDEX;
  };

  const onChangeEvent = (value) => {
    if (props.context && props.node && ROW_INDEX in props.node) {
      if (value === NO_INDEX) {
        value = "";
      }

      props.context({
        value: value,
        index: props.node.rowIndex,
        field: props.field,
      });

      toggleShowModal();
      setSelectedOption(resolveClickTextName(value));
    }
  };

  const resolveIndexName = (option) => {
    if (option && option["index name"] && option["index name"].length) {
      return option["index name"];
    } else {
      return NO_INDEX;
    }
  };

  const resolveIndexShortName = (option) => {
    if (
      option &&
      option["index name"] &&
      option["index name"].length &&
      option["index short name"] &&
      option["index short name"].length &&
      option["material"] &&
      option["material"].length
    ) {
      return option["index short name"];
    }

    return "";
  };

  const resolveIndexShortNameHTML = (option) => {
    const shortName = resolveIndexShortName(option);

    if (shortName.length) {
      return (
        <>
          <b>{shortName}</b>
          {` (${option["material"]})`}
        </>
      );
    }

    return "";
  };

  const hasConfirmLanguage = (option) => {
    if (
      option &&
      option["confirm language"] &&
      option["confirm language"].length
    ) {
      return true;
    }

    return false;
  };

  const getConfirmLanguage = (option) => {
    if (
      option &&
      option["confirm language"] &&
      option["confirm language"].length
    ) {
      return option["confirm language"];
    }

    return "";
  };

  const expandCollapseConfirmLanguage = (index) => {
    if (index in expandedConfirmLanguages) {
      delete expandedConfirmLanguages[index];
    } else {
      expandedConfirmLanguages[index] = true;
    }

    setExpandedConfirmLanguages(cloneDeep(expandedConfirmLanguages));
  };

  const getFilteredChoices = (searchText) => {
    if (searchText.length && choices.length) {
      let newFilteredChoices = [];
      choices.forEach((choice) => {
        if (
          resolveIndexName(choice)
            .toUppercase()
            .indexOf(searchText.toUpperCase()) > -1
        ) {
          newFilteredChoices.push(choice);
        }
      });

      return newFilteredChoices;
    } else if (!searchText.length) {
      return choices;
    }
  };

  const getChoiceComponents = () => {
    return (
      <div className="container" key="modal cell selector container">
        <div className="row cell-selector-search-bar">
          <div className="col-sm-11">
            <input
              className="form-control"
              value={searchText}
              placeholder="Search for an index..."
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <div className="col-sm-1 button-col-right">
            <button
              className="small-action-button"
              onClick={() => setSearchText("")}
              title="Delete search text"
              disabled={!searchText || searchText.length === 0}
            >
              <FontAwesomeIcon icon={faBackspace} className="button-icon" />
            </button>
          </div>
        </div>
        {filteredChoices.map((option, index) => (
          <div
            className="cell-selector-outer"
            key={`${option["index name"]} outer`}
          >
            <a href="#!">
              <div
                className="row header-row"
                key={option["index name"]}
                onClick={(event) => onChangeEvent(event.target.innerText)}
              >
                <h3 className="header-row-text cell-click-text">
                  {resolveIndexName(option)}
                </h3>
              </div>
            </a>
            <div className="row nested-row" key={option["index short name"]}>
              <p className="nested-row-text">
                {resolveIndexShortNameHTML(option)}
              </p>
              {hasConfirmLanguage(option) && (
                <button
                  className="small-action-button-adjacent"
                  onClick={() => expandCollapseConfirmLanguage(index)}
                  title="Show confirm language"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                </button>
              )}
            </div>
            {index in expandedConfirmLanguages && (
              <div
                className="row nested-row active-row-definition"
                key={`${option["index short name"]} confirm language`}
              >
                <p>{getConfirmLanguage(option)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const [selectedOption, setSelectedOption] = useState(
    resolveClickTextName(props.value)
  );

  useEffect(() => {
    if (showModal && selectedOption && selectedOption !== NO_INDEX) {
      setSearchText(selectedOption);
      setFilteredChoices(getFilteredChoices(selectedOption));
    }
  }, [showModal]);

  useEffect(() => {
    setFilteredChoices(getFilteredChoices(searchText));
  }, [searchText]);

  useEffect(() => {
    let isMounted = true;
    let allChoices = [
      {
        "index name": null,
        "index short name": null,
        material: null,
      },
    ];

    fetch(props.url)
      .then((response) => (response.ok && response.json()) || Promise.reject())

      .then((response) => {
        let choices = response[props.dataField];
        choices.sort(props.sortFunction);
        allChoices = allChoices.concat(choices);

        if (isMounted) {
          setReady(true);
          setChoices(allChoices);
          setFilteredChoices(allChoices);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <a href="#!">
        <div className="cell-click-text" onClick={toggleShowModal}>
          {selectedOption}
        </div>
      </a>
      {showModal && (
        <Modal
          visible={showModal}
          onVisibilityToggle={toggleShowModal}
          placement="center"
          className="modal-container-large"
        >
          <ModalHeader onDismissButtonClick={toggleShowModal}>
            {props.gridName}
          </ModalHeader>
          {ready && <ModalBody>{getChoiceComponents()}</ModalBody>}
        </Modal>
      )}
    </>
  );
}
