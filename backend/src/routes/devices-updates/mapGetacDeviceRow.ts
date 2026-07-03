import type { GetacDevice, DeviceCommand, DeviceStatus } from "./types";

function toIsoStringOrNull(value: unknown): string | null {
  return value ? new Date(String(value)).toISOString() : null;
}

function toOptionalString(value: unknown): string | null {
  return value ? String(value) : null;
}

export function mapGetacDeviceRow(row: Record<string, unknown>): GetacDevice {
  return {
    id: String(row.id),
    hostname: String(row.hostname),
    machine_id: String(row.machine_id),
    windows_version: toOptionalString(row.windows_version),
    os_build: toOptionalString(row.os_build),
    status: row.status as DeviceStatus,
    pending_update_count: Number(row.pending_update_count ?? 0),
    pending_command: row.pending_command
      ? (String(row.pending_command) as DeviceCommand)
      : null,
    command_status: row.command_status
      ? (String(row.command_status) as GetacDevice["command_status"])
      : null,
    last_error: toOptionalString(row.last_error),
    last_seen_at: toIsoStringOrNull(row.last_seen_at),
    last_checked_at: toIsoStringOrNull(row.last_checked_at),
    last_updated_at: toIsoStringOrNull(row.last_updated_at),
    registered_at: new Date(String(row.registered_at)).toISOString(),
  };
}
