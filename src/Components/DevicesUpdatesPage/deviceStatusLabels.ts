import type { DeviceStatus } from "Types/devices";

export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
  unknown: "Unknown",
  checking: "Checking...",
  up_to_date: "Up to date",
  updates_available: "Updates available",
  updating: "Updating...",
  reboot_required: "Reboot required",
  failed: "Failed",
};

export function formatDeviceDate(value: string | null): string {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

export function deviceStatusLabel(status: DeviceStatus): string {
  return DEVICE_STATUS_LABELS[status] ?? status;
}
