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

export function parseAgentReportBody(body: Record<string, unknown>): AgentReportBody {
  return {
    status: String(body.status || "") as DeviceStatus,
    windows_version: body.windows_version
      ? String(body.windows_version)
      : undefined,
    os_build: body.os_build ? String(body.os_build) : undefined,
    pending_update_count:
      body.pending_update_count !== undefined
        ? Number(body.pending_update_count)
        : undefined,
    reboot_required: Boolean(body.reboot_required),
    error: body.error ? String(body.error) : undefined,
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
