import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@react/modal";
import moment from "moment";
import StatusBar from "./StatusBar";
import ParkAndLoanEditor from "../pal-editor/ParkAndLoanEditor";
import FullEditor from "../full-editor/FullEditor";
import useDeepObject, { changeHandlerBasic } from "../common/useDeepObject";
import { Header } from "@react/header";
import { cloneDeep } from "lodash";
import { getAllProductNames } from "../common/InputHelper";
import {
  BAD_BOOKMARK,
  BOOKMARKING,
  CALCULATING,
  CLOSED,
  DELETE,
  DOLLAR_PRICE,
  ERROR,
  FAIL,
  HEARTBEATS_LOST,
  KEEP,
  KERBEROS_NOT_DETECTED,
  KEY_MAP_ERROR,
  LOADING,
  NO_DATA,
  OK,
  PARK_AND_LOAN,
  PARK_AND_LOAN_BASE,
  PARK_AND_LOAN_FIEIdS_QUANTITY,
  PARK_AND_LOAN_REMOVAL_FIEIdS_PRODUCT,
  POST,
  REQUIRED,
  RPC_NOT_RESPONDING,
  DB_SESSION_KEY_LENGTH,
  SITE_NAME,
  SUCCESS,
  SUPPLY_AND_OFFTAKE,
  SUPPORT_EMAIL,
  UPDATING,
  VALIDATION_ERRORS,
  VALIDATION_FAILURE,
} from "../common/constants";
import ViewConfiguration from "./ViewConfiguration";
import {
  processHeartbeat,
  startHeartbeats,
} from "../common/HeartbeatProcessor";
import { Alert } from "@react/alert";
import { AlertContext } from "../common/AlertContext";

export default function SnoEditor() {
  const [dataId, setDataId] = useState("");
  const [sno, snoDispatch] = useDeepObject({});
  const [kerberos, setKerberos] = useState("");
  const [contractId, setContractId] = useState("");
  const [bookmarkContractId, setBookmarkContractId] = useState("");
  const [view, setView] = useState(SUPPLY_AND_OFFTAKE);
  const [updateStatus, setUpdateStatus] = useState("");
  const [calcStatus, setCalcStatus] = useState("");
  const [editorStatus, setEditorStatus] = useState(LOADING);
  const [redBoxShowing, setRedBoxShowing] = useState(false);
  const [greenBoxShowing, setGreenBoxShowing] = useState(false);
  const [blueBoxShowing, setBlueBoxShowing] = useState(false);
  const [lastError, setLastError] = useState("");
  const [validationErrorCount, setValidationErrorCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const [calcError, setCalcError] = useState([]);
  const [validationFailure, setValidationFailure] = useState("");
  const [jobID, setJobID] = useState("");
  const [environment, setEnvironment] = useState("");
  const [allProductNames, setAllProductNames] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [showViewSettings, setShowViewSettings] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [draftAuthor, setDraftAuthor] = useState("");
  const [draftName, setDraftName] = useState("");
  const [selectedRiskHint, setSelectedRiskHint] = useState("");
  const [lastAppliedTemplate, setlastAppliedTemplate] = useState("");
  const [savedBookmarkName, setSavedBookmarkName] = useState("");
  const [bookmarkStatus, setBookmarkStatus] = useState("");
  const [kerberosStatus, setKerberosStatus] = useState("");
  const [heartbeatRequests, setHeartbeatRequests] = useState({});
  const [heartbeatKeepaliveId, setHeartbeatKeepaliveId] = useState(0);
  const [heartbeatError, setHeartbeatError] = useState(false);
  const [dollarPrice, setDollarPrice] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [onAlertShowCallback, setOnAlertShowCallback] = useState(null);
  const [snoComponentsClass, setSnoComponentsClass] = useState("");
  const [connectedToDBSession, setConnectedToDBSession] = useState(false);
  const [showSessionInformationModal, setShowSessionInformationModal] =
    useState(false);

  let heartbeatErrorCount = 0;

  const headerOptions = {
    brand: {
      appName: SITE_NAME,
      envBadge: {
        name: environment,
      },
    },
    utilities: {
      help: {
        links: [
          {
            id: "contact support",
            icon: { name: "email", type: "outlined" },
            text: "Contact support",
            onClick: () => {
              document.location.href = `mailto:${SUPPORT_EMAIL}?subject=${SITE_NAME.replace(
                "&",
                "%26"
              )}&body=Please keep this link in your email, to help us debug: ${
                window.location.href
              }`;
            },
          },
          {
            id: "session information",

            icon: { name: "info", type: "outlined" },
            text: "Session information",
            onClick: () => {
              toggleShowSessionInformationModal();
            },
          },
        ],
      },
    },
  };

  const toggleShowSessionInformationModal = () => {
    setShowSessionInformationModal(!showSessionInformationModal);
  };

  const getKerberosForSessionInfo = () => {
    if (kerberos && kerberos.length) {
      return `${kerberos.toLowerCase().charAt(0).toUpperCase()}${kerberos
        .toLowerCase()
        .slice(1)}`;
    }

    return "Kerberos not detected";
  };

  // saveDraft performs the bookmark action
  const saveDraft = (saveType, draftName) => {
    if (dataId) {
      let seller = sno["deal info ct"].seller;

      if (!seller || !seller.length) {
        seller = kerberos;
      }

      const time = moment().format("MMMM Do YYYY, h:mm:ss a");

      if (!draftName || !draftName.length) {
        draftName = `${seller} ${time}`;
      }

      setBookmarkStatus(BOOKMARKING);
      setRedBoxShowing(false);
      setGreenBoxShowing(false);
      fetch(`/api/contract-terms-editor/save-draft?id=${dataId}`, {
        method: POST,
        body: JSON.stringify({
          "contract terms": sno,
          "user id": kerberos,
          "contract unique id": bookmarkContractId,
          "draft name": draftName,
          "save type": saveType,
        }),
      })
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
          setSavedBookmarkName(draftName);
          setBookmarkStatus(SUCCESS);
        })
        .catch(() => {
          setSavedBookmarkName("");
          setBookmarkStatus(ERROR);
        });
    }
  };

  const updateContractTerms = () => {
    if (dataId) {
      setUpdateStatus(UPDATING);
      setCalcStatus("");
      setLastError("");
      setRedBoxShowing(false);
      setGreenBoxShowing(false);
      fetch(`/api/contract-terms-editor/save-data?id=${dataId}`, {
        method: POST,
        body: JSON.stringify({
          "contract terms": sno,
          "template name": view || "",
          "user id": kerberos,
          "contract unique id": contractId,
          "view type": view,
          "save type": UPDATING,
        }),
      })
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

          const errorCount = (response[VALIDATION_ERRORS] || []).length;
          const validationFailure = response(VALIDATION_FAILURE);
          const jobID = response["jobID"];
          const updateStatus = errorCount
            ? VALIDATION_ERRORS.toLowerCase()
            : validationFailure
            ? VALIDATION_FAILURE.toLowerCase()
            : SUCCESS.toUpperCase();

          const calcStatus =
            updateStatus.toUpperCase() === SUCCESS.toUpperCase()
              ? REQUIRED
              : "";

          setValidationErrorCount(errorCount);

          setValidationFailure(validationFailure);
          setJobID(jobID);
          setValidationErrors(response[VALIDATION_ERRORS]);
          setUpdateStatus(updateStatus);
          setCalcStatus(calcStatus);

          if (validationFailure) {
            const parsedLastError = /LastError\(\) was:\s*(.*)/g.exec(
              validationFailure
            );

            setLastError((parsedLastError && parsedLastError[1]) || "");
          }
        })
        .catch(() => {
          setUpdateStatus(FAIL);
          setCalcStatus("");
        });
    }
  };

  const getEnvironment = () => {
    fetch("/api/environment")
      .then((response) => (response.ok && response.text()) || Promise.reject())
      .then(setEnvironment)
      .catch(() => console.error("Failed to get environment"));
  };

  const getProductTypes = () => {
    fetch("/api/contract-terms-editor/product-types")
      .then((response) => (response.ok && response.text()) || Promise.reject())
      .then((response) => {
        const parsedResponse = JSON.parse(response);
        if (parsedResponse && parsedResponse.types) {
          setProductTypes(parsedResponse.types);
        }
      })
      .catch(() => console.error("Failed to get product types"));
  };

  const getUserInfo = () => {
    fetch("/api/kerberos")
      .then((response) => (response.Ok && response.text()) || Promise.reject())
      .then((response) => {
        setKerberos(response);
        setKerberosStatus(OK);
      })
      .catch(() => {
        setKerberosStatus(KERBEROS_NOT_DETECTED);
        console.error("Failed to get kerberos");
      });
  };

  const onLoadTemplate = (example, viewType, contractId) => {
    if (example) {
      getContractTerms(
        `${example.toLowerCase()}_example`,
        viewType,
        contractId
      );
    }
  };

  const getContractTerms = (dataId, viewType, contractId) => {
    setEditorStatus(LOADING);
    console.info(`Retrieving data for id=${dataId}`);
    fetch(`/api/contract-terms-editor/get-data?id=${dataId}`)
      .then((response) => (response.Ok && response.json()) || Promise.reject())
      .then((response) => {
        if (!response["rpc is up"]) {
          return setEditorStatus(RPC_NOT_RESPONDING);
        }
        if (!response["contract terms"]) {
          return setEditorStatus(NO_DATA);
        }
        onContractTermsLoaded(response, viewType, contractId);
      });
  };

  const isConnectedToValidDBSession = (currentAlertMessage) => {
    if (
      dataId &&
      dataId.length &&
      dataId.replaceAll("-", "").length === DB_SESSION_KEY_LENGTH
    ) {
      return true;
    }
    if (currentAlertMessage && currentAlertMessage.length) {
      setAlertMessage(
        "No linked database session, bookmark id or contract id detected. Cannot calculate dollar price or bookmark for this session."
      );
    } else {
      setAlertMessage(
        "No linked database session detected. Cannot calculate dollar price for this session."
      );
    }
    return false;
  };

  const onContractTermsLoaded = (json, viewType, contractId) => {
    const newContractId = json["contract unique id"] || contractId || "";
    snoDispatch({ type: "new", value: json["contract terms"] });
    setView(json["view type"] || viewType || SUPPLY_AND_OFFTAKE);
    setContractId(newContractId);

    let currentAlertMessage = "";

    let bookmarkId = json["bookmark contract unique id"] || "";
    if (bookmarkId && bookmarkId.length) {
      setBookmarkContractId(bookmarkId);
    } else if (newContractId && newContractId.length) {
      // If we do not have the bookmark id, we use the contract id
      setBookmarkContractId(newContractId);
    } else {
      currentAlertMessage =
        "No bookmark id or contract id detected. Cannot bookmark or calculate dollar price for this session.";
      setAlertMessage(currentAlertMessage);
    }

    setEditorStatus(OK);
    setConnectedToDBSession(isConnectedToValidDBSession(currentAlertMessage));

    setAllProductNames(getAllProductNames(json["contract terms"]));
  };

  const manageHeartbeatErrorResponse = () => {
    setEditorStatus(HEARTBEATS_LOST);
  };

  const manageHeartbeatResponse = (response) => {
    if (response && response["cmd id"]) {
      if (response["cmd id"] in heartbeatRequests) {
        heartbeatRequests[response["cmd id"]](response);
        delete heartbeatRequests[response["cmd id"]];
      }
    }
  };

  const onCalculateDollarPriceFinish = (response) => {
    if (!response || response.error) {
      setCalcError(response.error);
      return setCalcStatus(ERROR);
    }

    if (response.keymaperror) {
      setCalcError(response.keymaperror);
      return setCalcStatus(KEY_MAP_ERROR);
    }

    if (response["dollar price"]) {
      setDollarPrice(response["dollar price"]);
      setCalcStatus(SUCCESS);
      saveDraft(CALCULATING, "Last Successful Dollar Price Update");
    }
  };

  const submitCalculateDollarPrice = (discardKeys, riskHints) => {
    setCalcStatus(CALCULATING);
    const id = new Date().toUTCString();
    const heartbeatPayload = {
      op: DOLLAR_PRICE,
      id: id,
      "risk hints": riskHints,
    };

    if (discardKeys) {
      heartbeatPayload.autoDiscardOldKeys = true;
    }

    heartbeatRequests[id] = onCalculateDollarPriceFinish;
    setHeartbeatRequests(heartbeatRequests);
    processHeartbeat(dataId, heartbeatPayload, manageHeartbeatResponse);
  };

  const increaseHeartbeatErrorCount = () => {
    heartbeatErrorCount++;
    if (heartbeatErrorCount >= 10) {
      setHeartbeatError(true);
    }
  };

  const processSwitchOnObject = (dealInfo, removalFields, exclusive) => {
    for (const [key] of Object.entries(dealInfo)) {
      if (
        (key in removalFields && exclusive && removalFields[key] === DELETE) ||
        (!(key in removalFields) && !exclusive && key !== "__type")
      ) {
        delete dealInfo[key];
      } else if (
        key in removalFields &&
        removalFields[key] !== DELETE &&
        removalFields[key] !== KEEP
      ) {
        dealInfo[key] = cloneDeep(removalFields[key]);
      }
    }

    return dealInfo;
  };

  const removeUnusedFieldsForParkAndLoanSwitch = () => {
    let newSno = sno;

    newSno["inventory cts"].forEach((inventory, index) => {
      newSno["inventory cts"][index]["product ct"] = processSwitchOnObject(
        inventory["product ct"],
        PARK_AND_LOAN_REMOVAL_FIEIdS_PRODUCT,
        true
      );
    });

    newSno["inventory cts"].forEach((inventory, inventoryIndex) => {
      inventory["default quantity cts"].forEach(
        (defaultQuantity, defaultQuantityIndex) => {
          newSno["inventory cts"][inventoryIndex]["default quantity cts"][
            defaultQuantityIndex
          ] = processSwitchOnObject(
            defaultQuantity,
            PARK_AND_LOAN_FIEIdS_QUANTITY,
            false
          );
        }
      );
    });

    newSno = processSwitchOnObject(newSno, PARK_AND_LOAN_BASE, true);

    changeHandlerBasic(snoDispatch, [], "contract terms", newSno);
  };

  const isOperationPending = () => {
    return (
      updateStatus === UPDATING ||
      bookmarkStatus === BOOKMARKING ||
      calcStatus === CALCULATING
    );
  };

  const getAlert = () => {
    if (!alertMessage || !alertMessage.length) {
      if (snoComponentsClass !== "") {
        setSnoComponentsClass("");
      }
      return;
    }

    if (snoComponentsClass !== "sno-editor-components") {
      setSnoComponentsClass("sno-editor-components");
    }

    return (
      <div className="alert-outer">
        <Alert
          status="warning"
          emphasis="bold"
          onDismiss={() => setAlertMessage("")}
          onShow={() => {
            if (onAlertShowCallback) {
              onAlertShowCallback();
            }
          }}
          className="uitk-mb-1"
          fade={false}
        >
          <b>{alertMessage}</b>
        </Alert>
      </div>
    );
  };

  useEffect(() => {
    const URL = new URLSearchParams(document.location.search);
    const dataId = URL.get("id");
    setDataId(dataId);
    getUserInfo();
    getEnvironment();
    getProductTypes();
    startHeartbeats(
      dataId,
      manageHeartbeatResponse,
      setHeartbeatKeepaliveId,
      increaseHeartbeatErrorCount
    );
  }, []);

  useEffect(() => {
    dataId && getContractTerms(dataId);
  }, [dataId]);

  useEffect(() => {
    manageHeartbeatErrorResponse();
    if (heartbeatKeepaliveId) {
      clearInterval(heartbeatKeepaliveId);
    }
  }, [heartbeatError]);

  useEffect(() => {
    if (view === PARK_AND_LOAN) {
      removeUnusedFieldsForParkAndLoanSwitch();
    }
  }, [view]);

  return (
    <AlertContext.Provider value={[setAlertMessage, setOnAlertShowCallback]}>
      <div className="header-outer">
        <Header {...headerOptions} />
      </div>
      {showSessionInformationModal && (
        <>
          <Modal
            visible={showSessionInformationModal}
            onVisibilityToggle={toggleShowSessionInformationModal}
            placement="center"
          >
            <ModalHeader
              onDismissButtonClick={toggleShowSessionInformationModal}
            >
              Session Information
            </ModalHeader>
            <ModalBody>
              <p>
                <b>Kerberos: </b>
                {getKerberosForSessionInfo()}
              </p>
              <p>
                <b>Contract Id: </b>
                {contractId}
              </p>
              <p>
                <b>Bookmark Id: </b>
                {bookmarkContractId}
              </p>
              <p>
                <b>Data Id: </b>
                {dataId}
              </p>
              <p>
                <b>Database connection status: </b>
                {connectedToDBSession ? "Connected" : "Disconnected"}
              </p>
            </ModalBody>
            <ModalFooter className="modal-footer">
              <button
                className="btn btn-primary row-action-button"
                onClick={toggleShowSessionInformationModal}
              >
                Ok
              </button>
            </ModalFooter>
          </Modal>
        </>
      )}
      <div className="directive-container">
        <div className="container sno-editor-container">
          {getAlert()}
          {dataId === null && editorStatus === LOADING && (
            <div className="editor-message">
              <h1>No ID provided.</h1>
            </div>
          )}
          {dataId !== null && editorStatus === LOADING && (
            <div className="editor-message">
              <h1>Please wait while we load your contract terms...</h1>
            </div>
          )}
          {editorStatus === CLOSED && (
            <div className="editor-message">
              <h1>
                This editor has been closed.
                <br />
                <br />
                Please re-open the editor from your Cornmod Menu.
              </h1>
            </div>
          )}
          {editorStatus === RPC_NOT_RESPONDING && (
            <div className="editor-message">
              <h1>RPC did not respond. Please contact support.</h1>
            </div>
          )}
          {editorStatus === NO_DATA && (
            <div className="editor-message">
              <h1>
                There was no data for ID {dataId}.
                <br />
                <br />
                Please re-open the editor from your Commod Menu.
              </h1>
            </div>
          )}
          {editorStatus === HEARTBEATS_LOST && (
            <div className="editor-message">
              <h1>
                This editor has lost communication with the server.
                <br />
                <br />
                Please re-open the editor from your Commod Menu.
              </h1>
            </div>
          )}
          {editorStatus === BAD_BOOKMARK && (
            <div className="editor-message">
              <h1>
                An error occured whilst loading the bookmark.
                <br />
                <br />
                Please refresh the page by pressing FS.
              </h1>
            </div>
          )}
          {kerberosStatus === KERBEROS_NOT_DETECTED && (
            <div className="editor-message">
              <h1>
                Your kerberos could not be detected.
                <br />
                <br /> Please{" "}
                <a href="" target="_blank" rel="noreferrer">
                  authenticate
                </a>{" "}
                yourself, then refresh the page by pressing FS.
              </h1>
            </div>
          )}
          {editorStatus &&
            editorStatus.toLowerCase() === OK &&
            kerberosStatus &&
            kerberosStatus.toLowerCase() === OK && (
              <div className={snoComponentsClass}>
                <ViewConfiguration
                  viewType={view}
                  onloadTemplate={onLoadTemplate}
                  onViewTypeChanged={setView}
                  bookmarkContractId={bookmarkContractId}
                  onEditorStatus={setEditorStatus}
                  showViewSettings={showViewSettings}
                  setshowViewSettings={setShowViewSettings}
                  templateName={templateName}
                  setTemplateName={setTemplateName}
                  draftName={draftName}
                  setDraftName={setDraftName}
                  draftAuthor={draftAuthor}
                  setDraftAuthor={setDraftAuthor}
                  onContractTermsloaded={onContractTermsLoaded}
                  lastAppliedTemplate={lastAppliedTemplate}
                  setlastAppliedTemplate={setlastAppliedTemplate}
                  savedBookmarkName={savedBookmarkName}
                  setCalcStatus={setCalcStatus}
                  setUpdateStatus={setUpdateStatus}
                  setBookmarkStatus={setBookmarkStatus}
                  setGreenBoxShowing={setGreenBoxShowing}
                  setRedBoxShowing={setRedBoxShowing}
                  setBlueBoxShowing={setBlueBoxShowing}
                  isOperationPending={isOperationPending}
                />
                {view === PARK_AND_LOAN && sno.__type && (
                  <ParkAndLoanEditor
                    contents={sno}
                    dispatch={snoDispatch}
                    allProductNames={allProductNames}
                    setAllProductNames={setAllProductNames}
                    productTypes={productTypes}
                  />
                )}
                {view === SUPPLY_AND_OFFTAKE && sno.__type && (
                  <FullEditor
                    contents={sno}
                    dispatch={snoDispatch}
                    allProductNames={allProductNames}
                    setAllProductNames={setAllProductNames}
                    productTypes={productTypes}
                  />
                )}
                <StatusBar
                  dataId={dataId}
                  calcStatus={calcStatus}
                  updateStatus={updateStatus}
                  editorStatus={editorStatus}
                  redBoxVisible={redBoxShowing}
                  greenBoxVisible={greenBoxShowing}
                  blueBoxVisible={blueBoxShowing}
                  lastError={lastError}
                  validationErrorCount={validationErrorCount}
                  validationErrors={validationErrors}
                  calcError={calcError}
                  validationFailure={validationFailure}
                  jobID={jobID}
                  onUpdateContractTerms={updateContractTerms}
                  onSaveDraft={saveDraft}
                  onToggleGreenBox={() => setGreenBoxShowing((prev) => !prev)}
                  onToggleRedBox={() => setRedBoxShowing((prev) => !prev)}
                  onToggleBlueBox={() => setBlueBoxShowing((prev) => !prev)}
                  onCalculateDollarPrice={submitCalculateDollarPrice}
                  selectedRiskHint={selectedRiskHint}
                  setSelectedRiskHint={setSelectedRiskHint}
                  savedBookmarkName={savedBookmarkName}
                  bookmarkStatus={bookmarkStatus}
                  dollarPrice={dollarPrice}
                  bookmarkContractId={bookmarkContractId}
                  connectedToDBSession={connectedToDBSession}
                />
              </div>
            )}
        </div>
      </div>
    </AlertContext.Provider>
  );
}
