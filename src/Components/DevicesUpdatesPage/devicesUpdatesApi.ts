import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { GetacDevice } from "Types/devices";

const API_BASE = `${getBackEndUrl()}/api/devices-updates`;

async function parseError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  throw new Error(body?.error || fallback);
}

export async function fetchDevicesUpdates(): Promise<GetacDevice[]> {
  const response = await fetch(`${API_BASE}/devices`, { credentials: "include" });
  if (!response.ok) await parseError(response, "Failed to fetch devices");
  const body = (await response.json()) as { devices: GetacDevice[] };
  return body.devices;
}

export async function resetDeviceUpdate(deviceId: string) {
  const response = await fetch(`${API_BASE}/devices/${deviceId}/reset`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) await parseError(response, "Reset failed");
}

export async function queueDeviceAction(
  deviceId: string,
  action: "check-status" | "update"
) {
  const response = await fetch(`${API_BASE}/devices/${deviceId}/${action}`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) await parseError(response, "Action failed");
}

export function isWaitingForDeviceCommand(device: GetacDevice) {
  return (
    device.command_status === "queued" || device.command_status === "in_progress"
  );
}

export const DEVICE_POLL_TIMEOUT_MS = {
  update: 15 * 60 * 1000,
  "check-status": 90 * 1000,
} as const;

export const DEVICE_POLL_TIMEOUT_MESSAGE = {
  update:
    "Update timed out after 15 minutes. Check the agent terminal, then click Reset if needed.",
  "check-status":
    "Command timed out after 90 seconds. Click Reset, then try again.",
} as const;
