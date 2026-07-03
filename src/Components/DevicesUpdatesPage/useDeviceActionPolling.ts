import { useCallback, useRef } from "react";
import {
  DEVICE_POLL_TIMEOUT_MESSAGE,
  DEVICE_POLL_TIMEOUT_MS,
  fetchDevicesUpdates,
  isWaitingForDeviceCommand,
} from "./devicesUpdatesApi";
import type { GetacDevice } from "Types/devices";

export function useDeviceActionPolling(input: {
  setError: (value: string | null) => void;
  setActionDeviceId: (value: string | null) => void;
  onDevicesLoaded: (devices: GetacDevice[]) => void;
}) {
  const pollRef = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (!pollRef.current) return;
    window.clearInterval(pollRef.current);
    pollRef.current = null;
  }, []);

  const startPolling = useCallback(
    (deviceId: string, action: "check-status" | "update") => {
      stopPolling();
      const startedAt = Date.now();

      pollRef.current = window.setInterval(async () => {
        if (Date.now() - startedAt > DEVICE_POLL_TIMEOUT_MS[action]) {
          stopPolling();
          input.setActionDeviceId(null);
          input.setError(DEVICE_POLL_TIMEOUT_MESSAGE[action]);
          return;
        }

        const latest = await fetchDevicesUpdates().catch(() => [] as GetacDevice[]);
        input.onDevicesLoaded(latest);

        const device = latest.find((item) => item.id === deviceId);
        if (!device || !isWaitingForDeviceCommand(device)) {
          stopPolling();
          input.setActionDeviceId(null);
        }
      }, 5000);
    },
    [input, stopPolling]
  );

  return { pollRef, stopPolling, startPolling };
}
