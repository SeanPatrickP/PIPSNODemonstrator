import { CLOSE_EDITOR, HEARTBEAT, POST } from "./constants";

export function processHeartbeat(
  dataId,
  heartbeatPayload,
  onCompletionCallback,
  increaseHeartbeatErrorCount
) {
  fetch(`/api/contract-terms-editor/browser-heartbeat?type=sno&id=${dataId}`, {
    method: POST,
    body: JSON.stringify(heartbeatPayload),
  })
    .then((response) => (response.ok && response.json()) || Promise.reject())
    .then((response) => {
      var op = (response && response.op) || "";
      if (op === CLOSE_EDITOR) {
        window.close();
      }
      onCompletionCallback(response);
    })
    .catch(() => {
      if (increaseHeartbeatErrorCount) {
        increaseHeartbeatErrorCount();
      }
    });
}

export function startHeartbeats(
  dataId,
  onCompletionCallback,
  setHeartbeatKeepaliveId,
  increaseHeartbeatErrorCount
) {
  const heartbeatKeepaliveId = setInterval(function () {
    processHeartbeat(
      dataId,
      { op: HEARTBEAT },
      onCompletionCallback,
      increaseHeartbeatErrorCount
    );
  }, 1000);

  setHeartbeatKeepaliveId(heartbeatKeepaliveId);
}
