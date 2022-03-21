import { waitFor } from "@testing-library/react";
import { CLOSE_EDITOR, HEARTBEAT } from "../../src/js/common/constants";
import * as HeartbeatProcessor from "../../src/js/common/HeartbeatProcessor";

// The below is required for regeneratorRuntime, for the fetch mocks that are async
require("babel-polyfill");

let errorCount = 0;

beforeEach(() => {
  fetch.resetMocks();
  errorCount = 0;
});

const onCompletionCallbackFunction = jest.fn((response) => {
  return response;
});

const increaseHeartbeatErrorCountFunction = jest.fn(() => {
  errorCount++;
});

const setHeartbeatKeepaliveIdFunction = jest.fn((heartbeatKeepaliveId) => {
  return heartbeatKeepaliveId;
});

describe("testProcessHeartbeat", () => {
  test("correctResponseInvokeCompletionCallback", async () => {
    const responsePayload = { op: "testOperation" };

    fetch.mockResponseOnce(JSON.stringify(responsePayload));

    HeartbeatProcessor.processHeartbeat(
      "testDataId",
      { op: HEARTBEAT },
      onCompletionCallbackFunction,
      increaseHeartbeatErrorCountFunction
    );

    await waitFor(() => {
      // Wait for the async fetch mock to complete
      expect(onCompletionCallbackFunction.mock.calls.length).toEqual(1);
      expect(onCompletionCallbackFunction.mock.calls[0].length).toEqual(1);
      expect(onCompletionCallbackFunction.mock.calls[0][0]).toEqual(
        responsePayload
      );
    });
  });

  test("correctResponseInvokeWindowClose", async () => {
    const responsePayload = { op: CLOSE_EDITOR };

    window.close = jest.fn();
    fetch.mockResponseOnce(JSON.stringify(responsePayload));

    HeartbeatProcessor.processHeartbeat(
      "testDataId",
      { op: HEARTBEAT },
      onCompletionCallbackFunction,
      increaseHeartbeatErrorCountFunction
    );

    await waitFor(() => {
      // Wait for the async fetch mock to complete
      expect(window.close.mock.calls.length).toEqual(1);
      expect(onCompletionCallbackFunction.mock.calls.length).toEqual(0);
    });
  });

  test("badResponseInvokeIncreaseHeartbeatErrorCount", async () => {
    const responsePayload = { op: "testOperation" };

    fetch.mockResponseOnce(responsePayload);

    HeartbeatProcessor.processHeartbeat(
      "testDataId",
      { op: HEARTBEAT },
      onCompletionCallbackFunction,
      increaseHeartbeatErrorCountFunction
    );

    await waitFor(() => {
      // Wait for the async fetch mock to complete
      expect(increaseHeartbeatErrorCountFunction.mock.calls.length).toEqual(1);
      expect(errorCount).toEqual(1);
    });
  });
});

describe("testStartHeartbeats", () => {
  test("shouldCallProcessHeartBeat", async () => {
    jest.useFakeTimers();

    const responsePayload = { op: "testOperation" };

    fetch.mockResponse(JSON.stringify(responsePayload));

    HeartbeatProcessor.startHeartbeats(
      "testDataId",
      onCompletionCallbackFunction,
      setHeartbeatKeepaliveIdFunction,
      increaseHeartbeatErrorCountFunction
    );

    await waitFor(() => {
      // Wait for the async fetch mock to complete
      expect(setHeartbeatKeepaliveIdFunction.mock.calls.length).toEqual(1);
      expect(setHeartbeatKeepaliveIdFunction.mock.calls[0].length).toEqual(1);
    });
  });

  test("shouldCallProcessHeartBeatEverySecond", async () => {
    jest.useFakeTimers();

    const processHeartbeatSpy = jest
      .spyOn(HeartbeatProcessor, "processHeartbeat")
      .mockImplementation();

    HeartbeatProcessor.startHeartbeats(
      "testDataId",
      onCompletionCallbackFunction,
      setHeartbeatKeepaliveIdFunction,
      increaseHeartbeatErrorCountFunction
    );

    jest.advanceTimersByTime(24000);

    // The nature of setInterval is that it spawns the next iteration on resoloution of the current iteration
    // This means 24 iterations + 24 = 48 spawned iterations that would have happened later
    expect(processHeartbeatSpy.mock.calls.length).toEqual(48);
  });
});
