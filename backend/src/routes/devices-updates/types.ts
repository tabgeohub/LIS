import type { DeviceStatus } from "../../shared/devices";

export type AgentReportBody = {
  status: DeviceStatus;
  windows_version?: string;
  os_build?: string;
  pending_update_count?: number;
  reboot_required?: boolean;
  error?: string;
  command_completed?: boolean;
};
