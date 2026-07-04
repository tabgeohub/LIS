import type { AgentReportBody, DeviceCommand } from "./types";
import { resolveReportedDeviceStatus } from "./agent/parseAgentReport";

export type ApplyAgentReportParams = {
  deviceId: string;
  report: AgentReportBody;
  completedCommand: DeviceCommand | null;
};

export function buildApplyAgentReportQuery(input: ApplyAgentReportParams): {
  query: string;
  params: unknown[];
} {
  const { deviceId, report, completedCommand } = input;
  const status = resolveReportedDeviceStatus(report);
  const clearCommand = report.command_completed === true;

  return {
    query: `
      UPDATE lis.getac_devices
      SET
        status = $2,
        windows_version = COALESCE($3, windows_version),
        os_build = COALESCE($4, os_build),
        pending_update_count = COALESCE($5, pending_update_count),
        last_error = $6,
        last_seen_at = NOW(),
        last_checked_at = CASE WHEN $7::text = 'CHECK_STATUS' THEN NOW() ELSE last_checked_at END,
        last_updated_at = CASE WHEN $7::text = 'UPDATE' THEN NOW() ELSE last_updated_at END,
        pending_command = CASE WHEN $8::boolean THEN NULL ELSE pending_command END,
        command_status = CASE
          WHEN $8::boolean THEN 'completed'
          WHEN $6::text IS NOT NULL THEN 'failed'
          ELSE command_status
        END,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `,
    params: [
      deviceId,
      status,
      report.windows_version ?? null,
      report.os_build ?? null,
      report.pending_update_count ?? null,
      report.error ?? null,
      completedCommand,
      clearCommand,
    ],
  };
}
