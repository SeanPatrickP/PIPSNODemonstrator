import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faMinusCircle,
  faCopy,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {
  BAD_BOOKMARK,
  ERROR,
  LOADING,
  PARK_AND_LOAN,
  SUCCESS,
} from "../common/constants";
import { AlertContext } from "../common/AlertContext";
import ConfirmationModal from "../common/ConfirmationModal";
import { copyTextToClipboard } from "../common/InputHelper";

export default function ViewConfiguration(props) {
  const [templateNamesList, setTemplateNamesList] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [draftNamesList, setDraftNamesList] = useState([]);
  const [switchViewType, setSwitchViewType] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [setAlertMessage, setOnAlertShowCallback] = useContext(AlertContext);

  const toggleShowConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const getIcon = () => {
    if (props.showViewSettings) {
      return faMinusCircle;
    } else {
      return faPlusCircle;
    }
  };

  const getIconTooltip = () => {
    if (props.showViewSettings) {
      return "Close view configuration";
    } else {
      return "Show view configuration";
    }
  };

  const getTemplateNames = (viewType) => {
    fetch(
      `/api/contract-terms-editor/editing-template-names?dealType=${encodeURIComponent(
        viewType
      )}`
    )
      .then((response) => (response.ok && response.json()) || Promise.reject())
      .then((response) => {
        if (
          !response.status ||
          (response.status.toLowerCase() &&
            response.status.toLowerCase() !== SUCCESS)
        ) {
          throw ERROR;
        }

        let templateNames = [""];
        response.templates.forEach((templateName) => {
          if (templateName.length) {
            templateNames.push(templateName.toUpperCase());
          }
        });

        setTemplateNamesList(templateNames);
      })
      .catch(() => {
        setTemplateNamesList([]);
      });
  };

  const setDraftAuthorComponents = (draftAuthors, draftAuthor) => {
    setAuthors(draftAuthors);
    props.setDraftAuthor(draftAuthor);
  };

  const initDraftComponents = () => {
    if (props.bookmarkContractId && props.bookmarkContractId.length) {
      fetch(
        `/api/contract-terms-editor/draft-authors?contractId=${props.bookmarkContractId}`
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

          let draftAuthors = [];
          let draftAuthor = "";

          if (response.draftauthors.length) {
            draftAuthors = "";
            response.draftauthors.forEach((responseDraftAuthor) => {
              if (responseDraftAuthor.length) {
                draftAuthors.push(responseDraftAuthor.toUpperCase());
              }
            });
          }

          if (draftAuthors.indexOf(props.draftAuthor) !== -1) {
            draftAuthor = props.draftAuthor;
          }

          setDraftAuthorComponents(draftAuthors, draftAuthor);
          getDraftNames(draftAuthor);
        })
        .catch(() => {
          setDraftAuthorComponents([], "");
          getDraftNames("");
        });
    } else {
      setDraftAuthorComponents([], "");
      getDraftNames("");
    }
  };

  const setDraftNameComponents = (draftNames, draftName) => {
    setDraftNamesList(draftNames);
    props.setDraftName(draftName);
  };

  const getDraftNames = (userId) => {
    if (
      userId &&
      userId.length &&
      props.bookmarkContractId &&
      props.bookmarkContractId.length
    ) {
      fetch(
        `/api/contract-terms-editor/draft-names?userId=${userId}&contractId=${props.bookmarkContractId}`
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

          let draftNames = [];
          let draftName = "";

          if (response.draftnames.length) {
            response.draftnames.forEach((responseDraftName) => {
              draftNames.push(responseDraftName.toUpperCase());
            });

            if (draftNames.indexOf(props.draftName) === -1) {
              draftName = draftNames[0];
            } else {
              draftName = props.draftName;
            }
          }

          setDraftNameComponents(draftNames, draftName);
        })
        .catch(() => {
          setDraftNameComponents([], "");
        });
    } else {
      setDraftNameComponents([], "");
    }
  };

  const resetViewPostLoad = () => {
    props.setGreenBoxShowing(false);
    props.setRedBoxShowing(false);
    props.setBlueBoxShowing(false);
    props.setCalcStatus("");
    props.setUpdateStatus("");
    props.setBookmarkStatus("");
  };

  const getDraft = (event) => {
    if (
      props.draftName &&
      props.draftName.length &&
      props.draftAuthor &&
      props.draftAuthor.length &&
      props.bookmarkContractId &&
      props.bookmarkContractId.length
    ) {
      event.preventDefault();

      resetViewPostLoad();

      props.onEditorStatus(LOADING);
      console.info(`Retrieving draft for name=${props.draftName}`);
      const url = `/api/contract-terms-editor/get-draft?name=${props.draftName}&userId=${props.draftAuthor}&contractId=${props.bookmarkContractId}`;

      fetch(url)
        .then(
          (response) => (response.ok && response.json()) || Promise.reject()
        )

        .then((json) => {
          if (
            json["contract terms"] &&
            json["contract terms"]["status"] &&
            json["contract terms"]["status"].toLowerCase() === SUCCESS
          ) {
            props.onContractTermsLoaded(json, "", props.bookmarkContractId);
          } else {
            props.onEditorStatus(BAD_BOOKMARK);
          }
        });
    }
  };

  const setViewType = (viewType) => {
    props.setTemplateName("");
    resetViewPostLoad();
    setTemplateNamesList([]);
    getTemplateNames(viewType);
    props.onViewTypeChanged(viewType);
  };

  const loadTemplate = (event) => {
    event.preventDefault();

    resetViewPostLoad();

    props.onLoadTemplate(
      props.templateName,
      props.viewType,
      props.bookmarkContractId
    );
  };

  useEffect(() => {
    if (
      showConfirmationModal &&
      switchViewType &&
      switchViewType.length &&
      props.isOperationPending()
    ) {
      setOnAlertShowCallback(null);
      setAlertMessage(
        "The web editor is currently performing an operation. Please wait till this has finished to switch view type."
      );
    }
  }, [showConfirmationModal]);

  useEffect(() => {
    initDraftComponents();
  }, [props.bookmarkContractId, props.savedBookmarkName]);

  useEffect(() => {
    getTemplateNames(props.viewType);
  }, []);

  return (
    <>
      {!props.isOperationPending() && (
        <ConfirmationModal
          showModal={showConfirmationModal}
          toggleShowModal={toggleShowConfirmationModal}
          dangerActionFunction={() => setViewType(switchViewType)}
          dangerActionButtonText="Switch view type"
          header={`Confirm switch view type to ${switchViewType}`}
          confirmationText={
            "Please note, this action is not reversible and data can be lost as a result of the switch."
          }
        />
      )}
      <div className="container template-section">
        <div className="row">
          <div className="col-sm-2">
            <h1>View configuration</h1>
          </div>
          <div className="col-sm-10">
            <div className="container">
              <div className="row">
                <div className="col-sm-10">
                  <button
                    className="small-action-button collapsible-ct-action"
                    onClick={() =>
                      props.setShowViewSettings(!props.showViewSettings)
                    }
                    title={getIconTooltip()}
                  >
                    <FontAwesomeIcon icon={getIcon()} className="button-icon" />
                  </button>
                </div>
              </div>
              {props.showViewSettings && (
                <>
                  <div className="row">
                    <div className="col-sm-3">View type:</div>
                    <div className="col-sm-8">
                      <select
                        value={props.viewType}
                        onChange={(event) => {
                          setSwitchViewType(event.target.value);
                          toggleShowConfirmationModal();
                        }}
                        className="form-control"
                        disabled={props.viewType === PARK_AND_LOAN}
                      >
                        <option>Supply and Offtake</option>
                        <option>Park and Loan</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3">Template name:</div>
                    <div className="col-sm-8">
                      <select
                        value={props.templateName}
                        onChange={(event) =>
                          props.setTemplateName(event.target.value)
                        }
                        className="form-control"
                      >
                        {templateNamesList.map((name) => (
                          <option key={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-1 button-col-right">
                      <button
                        type="button"
                        className="small-action-button"
                        onClick={(event) => {
                          props.setLastAppliedTemplate(props.templateName);
                          loadTemplate(event);
                        }}
                        disabled={
                          !props.templateName || !props.templateName.length
                        }
                        title="Load"
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="button-icon"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3">Last applied template name:</div>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        disabled={true}
                        value={props.lastAppliedTemplate}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-sm-3">Bookmark draft author:</div>
                    <div className="col-sm-8">
                      <select
                        value={props.draftAuthor}
                        className="form-control"
                        disabled={!authors.length}
                        onChange={(event) => {
                          props.setDraftAuthor(event.target.value);
                          getDraftNames(event.target.value);
                        }}
                      >
                        {authors.map((author) => (
                          <option value={author} key={author}>
                            {author}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3">Bookmark draft name:</div>
                    <div className="col-sm-8">
                      <select
                        value={props.draftName}
                        className="form-control"
                        disabled={!draftNamesList.length}
                        onChange={(event) =>
                          props.setDraftName(event.target.value)
                        }
                      >
                        {draftNamesList.map((name) => (
                          <option value={name} key={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-1 button-col-right">
                      <button
                        type="button"
                        className="small-action-button"
                        onClick={getDraft}
                        disabled={
                          !props.draftAuthor ||
                          !props.draftAuthor.length ||
                          !props.draftName ||
                          !props.draftName.length
                        }
                        title="Load"
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="button-icon"
                        />
                      </button>
                      <button
                        className="small-action-button"
                        onClick={() => copyTextToClipboard(props.draftName)}
                        disabled={!props.draftName || !props.draftName.length}
                        title="Copy bookmark draft name to clipboard"
                      >
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="button-icon"
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
