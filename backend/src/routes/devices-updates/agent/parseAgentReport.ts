import type { AgentReportBody } from "../types";
import type { DeviceCommand, DeviceStatus } from "../../../shared/devices";

const VALID_STATUSES = new Set<DeviceStatus>([
  "unknown",
  "checking",
  "up_to_date",
  "updates_available",
  "updating",
  "reboot_required",
  "failed",
]);

export function parseDeviceStatus(value: unknown): DeviceStatus | null {
  const status = String(value || "") as DeviceStatus;
  return VALID_STATUSES.has(status) ? status : null;
}

function optionalString(value: unknown): string | undefined {
  return value ? String(value) : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return value !== undefined ? Number(value) : undefined;
}

export function parseAgentReportBody(body: Record<string, unknown>): AgentReportBody {
  return {
    status: String(body.status || "") as DeviceStatus,
    windows_version: optionalString(body.windows_version),
    os_build: optionalString(body.os_build),
    pending_update_count: optionalNumber(body.pending_update_count),
    reboot_required: Boolean(body.reboot_required),
    error: optionalString(body.error),
    command_completed: Boolean(body.command_completed),
  };
}

export function parseCompletedCommand(
  value: unknown
): DeviceCommand | null {
  return value ? (String(value) as DeviceCommand) : null;
}

export function resolveReportedDeviceStatus(
  report: AgentReportBody
): DeviceStatus {
  return report.reboot_required ? "reboot_required" : report.status;
}
