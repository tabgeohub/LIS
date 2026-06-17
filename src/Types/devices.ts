export type DeviceStatus =
  | "unknown"
  | "checking"
  | "up_to_date"
  | "updates_available"
  | "updating"
  | "reboot_required"
  | "failed";

export type GetacDevice = {
  id: string;
  hostname: string;
  machine_id: string;
  windows_version: string | null;
  os_build: string | null;
  status: DeviceStatus;
  pending_update_count: number;
  pending_command: "CHECK_STATUS" | "UPDATE" | null;
  command_status: "queued" | "in_progress" | "completed" | "failed" | null;
  last_error: string | null;
  last_seen_at: string | null;
  last_checked_at: string | null;
  last_updated_at: string | null;
  registered_at: string;
};
