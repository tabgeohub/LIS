export type DeviceStatus =
  | "unknown"
  | "checking"
  | "up_to_date"
  | "updates_available"
  | "updating"
  | "reboot_required"
  | "failed";

export type DeviceCommand = "CHECK_STATUS" | "UPDATE";

export type CommandState = "queued" | "in_progress" | "completed" | "failed";

export type GetacDevice = {
  id: string;
  hostname: string;
  machine_id: string;
  windows_version: string | null;
  os_build: string | null;
  status: DeviceStatus;
  pending_update_count: number;
  pending_command: DeviceCommand | null;
  command_status: CommandState | null;
  last_error: string | null;
  last_seen_at: string | null;
  last_checked_at: string | null;
  last_updated_at: string | null;
  registered_at: string;
};

export type AgentReportBody = {
  status: DeviceStatus;
  windows_version?: string;
  os_build?: string;
  pending_update_count?: number;
  reboot_required?: boolean;
  error?: string;
  command_completed?: boolean;
};
