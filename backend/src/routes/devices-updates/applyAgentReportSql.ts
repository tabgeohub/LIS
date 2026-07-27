import type { AgentReportBody } from "./types";
import type { DeviceCommand } from "../../shared/devices";
import { resolveReportedDeviceStatus } from "./agent/parseAgentReport";

export type ApplyAgentReportParams = {
  deviceId: string;
  report: AgentReportBody;
  completedCommand: DeviceCommand | null;
};

const APPLY_AGENT_REPORT_SQL = `
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
`;

function coalesceNull(value: unknown): unknown {
  return value ?? null;
}

export function buildApplyAgentReportParams(input: ApplyAgentReportParams): unknown[] {
  const { deviceId, report, completedCommand } = input;
  return [
    deviceId,
    resolveReportedDeviceStatus(report),
    coalesceNull(report.windows_version),
    coalesceNull(report.os_build),
    coalesceNull(report.pending_update_count),
    coalesceNull(report.error),
    completedCommand,
    report.command_completed === true,
  ];
}

export function buildApplyAgentReportQuery(input: ApplyAgentReportParams): {
  query: string;
  params: unknown[];
} {
  return {
    query: APPLY_AGENT_REPORT_SQL,
    params: buildApplyAgentReportParams(input),
  };
}
