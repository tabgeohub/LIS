import { pool } from "../../db";
import type {
  AgentReportBody,
  DeviceCommand,
  DeviceStatus,
  GetacDevice,
} from "./types";

let schemaReady: Promise<void> | null = null;

export function ensureDevicesUpdatesSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pool
      .query(`
        CREATE TABLE IF NOT EXISTS lis.getac_devices (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          device_token TEXT UNIQUE NOT NULL,
          hostname TEXT NOT NULL,
          machine_id TEXT UNIQUE NOT NULL,
          windows_version TEXT,
          os_build TEXT,
          status TEXT NOT NULL DEFAULT 'unknown',
          pending_update_count INT NOT NULL DEFAULT 0,
          pending_command TEXT,
          command_status TEXT,
          last_error TEXT,
          last_seen_at TIMESTAMPTZ,
          last_checked_at TIMESTAMPTZ,
          last_updated_at TIMESTAMPTZ,
          registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `)
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

function mapRow(row: Record<string, unknown>): GetacDevice {
  return {
    id: String(row.id),
    hostname: String(row.hostname),
    machine_id: String(row.machine_id),
    windows_version: row.windows_version ? String(row.windows_version) : null,
    os_build: row.os_build ? String(row.os_build) : null,
    status: row.status as DeviceStatus,
    pending_update_count: Number(row.pending_update_count ?? 0),
    pending_command: row.pending_command
      ? (String(row.pending_command) as DeviceCommand)
      : null,
    command_status: row.command_status
      ? (String(row.command_status) as GetacDevice["command_status"])
      : null,
    last_error: row.last_error ? String(row.last_error) : null,
    last_seen_at: row.last_seen_at
      ? new Date(String(row.last_seen_at)).toISOString()
      : null,
    last_checked_at: row.last_checked_at
      ? new Date(String(row.last_checked_at)).toISOString()
      : null,
    last_updated_at: row.last_updated_at
      ? new Date(String(row.last_updated_at)).toISOString()
      : null,
    registered_at: new Date(String(row.registered_at)).toISOString(),
  };
}

export async function registerDevice(input: {
  machineId: string;
  hostname: string;
  deviceToken: string;
  windowsVersion?: string;
  osBuild?: string;
}): Promise<{ device: GetacDevice; deviceToken: string }> {
  await ensureDevicesUpdatesSchema();

  const existing = await pool.query(
    `SELECT * FROM lis.getac_devices WHERE machine_id = $1 LIMIT 1`,
    [input.machineId]
  );

  if (existing.rows[0]) {
    const result = await pool.query(
      `
        UPDATE lis.getac_devices
        SET
          hostname = $2,
          windows_version = COALESCE($3, windows_version),
          os_build = COALESCE($4, os_build),
          last_seen_at = NOW(),
          updated_at = NOW()
        WHERE machine_id = $1
        RETURNING *;
      `,
      [
        input.machineId,
        input.hostname,
        input.windowsVersion ?? null,
        input.osBuild ?? null,
      ]
    );

    return {
      device: mapRow(result.rows[0]),
      deviceToken: String(existing.rows[0].device_token),
    };
  }

  const result = await pool.query(
    `
      INSERT INTO lis.getac_devices (
        device_token, hostname, machine_id, windows_version, os_build, last_seen_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `,
    [
      input.deviceToken,
      input.hostname,
      input.machineId,
      input.windowsVersion ?? null,
      input.osBuild ?? null,
    ]
  );

  return {
    device: mapRow(result.rows[0]),
    deviceToken: input.deviceToken,
  };
}

export async function getDeviceByToken(
  deviceToken: string
): Promise<(GetacDevice & { device_token: string }) | null> {
  await ensureDevicesUpdatesSchema();

  const result = await pool.query(
    `SELECT * FROM lis.getac_devices WHERE device_token = $1 LIMIT 1`,
    [deviceToken]
  );

  if (!result.rows[0]) return null;
  return { ...mapRow(result.rows[0]), device_token: deviceToken };
}

export async function listDevices(): Promise<GetacDevice[]> {
  await ensureDevicesUpdatesSchema();

  const result = await pool.query(
    `SELECT * FROM lis.getac_devices ORDER BY hostname ASC`
  );
  return result.rows.map(mapRow);
}

export async function getDeviceById(id: string): Promise<GetacDevice | null> {
  await ensureDevicesUpdatesSchema();

  const result = await pool.query(
    `SELECT * FROM lis.getac_devices WHERE id = $1 LIMIT 1`,
    [id]
  );
  if (!result.rows[0]) return null;
  return mapRow(result.rows[0]);
}

export async function queueDeviceCommand(
  id: string,
  command: DeviceCommand
): Promise<GetacDevice | null> {
  await ensureDevicesUpdatesSchema();

  const result = await pool.query(
    `
      UPDATE lis.getac_devices
      SET
        pending_command = $2,
        command_status = 'queued',
        status = CASE WHEN $2 = 'CHECK_STATUS' THEN 'checking' ELSE 'updating' END,
        last_error = NULL,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `,
    [id, command]
  );

  if (!result.rows[0]) return null;
  return mapRow(result.rows[0]);
}

export async function claimPendingCommand(deviceId: string): Promise<DeviceCommand | null> {
  await ensureDevicesUpdatesSchema();

  const result = await pool.query(
    `
      UPDATE lis.getac_devices
      SET
        command_status = 'in_progress',
        last_seen_at = NOW(),
        updated_at = NOW()
      WHERE id = $1 AND pending_command IS NOT NULL AND command_status = 'queued'
      RETURNING pending_command;
    `,
    [deviceId]
  );

  if (!result.rows[0]?.pending_command) return null;
  return String(result.rows[0].pending_command) as DeviceCommand;
}

export async function touchDeviceSeen(deviceId: string): Promise<void> {
  await pool.query(
    `
      UPDATE lis.getac_devices
      SET last_seen_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `,
    [deviceId]
  );
}

export async function applyAgentReport(
  deviceId: string,
  report: AgentReportBody,
  completedCommand: DeviceCommand | null
): Promise<GetacDevice | null> {
  await ensureDevicesUpdatesSchema();

  const status: DeviceStatus = report.reboot_required
    ? "reboot_required"
    : report.status;

  const clearCommand = report.command_completed === true;

  const result = await pool.query(
    `
      UPDATE lis.getac_devices
      SET
        status = $2,
        windows_version = COALESCE($3, windows_version),
        os_build = COALESCE($4, os_build),
        pending_update_count = COALESCE($5, pending_update_count),
        last_error = $6,
        last_seen_at = NOW(),
        last_checked_at = CASE WHEN $7 = 'CHECK_STATUS' THEN NOW() ELSE last_checked_at END,
        last_updated_at = CASE WHEN $7 = 'UPDATE' THEN NOW() ELSE last_updated_at END,
        pending_command = CASE WHEN $8 THEN NULL ELSE pending_command END,
        command_status = CASE
          WHEN $8 THEN 'completed'
          WHEN $6 IS NOT NULL THEN 'failed'
          ELSE command_status
        END,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `,
    [
      deviceId,
      status,
      report.windows_version ?? null,
      report.os_build ?? null,
      report.pending_update_count ?? null,
      report.error ?? null,
      completedCommand,
      clearCommand,
    ]
  );

  if (!result.rows[0]) return null;
  return mapRow(result.rows[0]);
}
