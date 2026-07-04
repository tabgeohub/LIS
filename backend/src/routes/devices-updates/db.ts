import { pool } from "../../db";
import type {
  AgentReportBody,
  DeviceCommand,
  GetacDevice,
} from "./types";
import { upsertRegisteredDevice } from "./upsertRegisteredDevice";
import { mapGetacDeviceRow } from "./mapGetacDeviceRow";
import { buildApplyAgentReportQuery } from "./applyAgentReportSql";
import { buildStaleCommandUpdateSql } from "./staleCommandSql";

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

export async function registerDevice(input: {
  machineId: string;
  hostname: string;
  deviceToken: string;
  windowsVersion?: string;
  osBuild?: string;
}): Promise<{ device: GetacDevice; deviceToken: string }> {
  await ensureDevicesUpdatesSchema();
  return upsertRegisteredDevice(input);
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
  return { ...mapGetacDeviceRow(result.rows[0]), device_token: deviceToken };
}

export async function listDevices(): Promise<GetacDevice[]> {
  await ensureDevicesUpdatesSchema();
  await releaseStaleCommands(1);

  const result = await pool.query(
    `SELECT * FROM lis.getac_devices ORDER BY hostname ASC`
  );
  return result.rows.map(mapGetacDeviceRow);
}

export async function getDeviceById(id: string): Promise<GetacDevice | null> {
  await ensureDevicesUpdatesSchema();

  const result = await pool.query(
    `SELECT * FROM lis.getac_devices WHERE id = $1 LIMIT 1`,
    [id]
  );
  if (!result.rows[0]) return null;
  return mapGetacDeviceRow(result.rows[0]);
}

export async function releaseStaleCommands(
  staleAfterMinutes = 3,
  deviceId?: string
): Promise<void> {
  await ensureDevicesUpdatesSchema();

  const { query, params } = buildStaleCommandUpdateSql({
    staleAfterMinutes,
    deviceId,
  });
  await pool.query(query, params);
}

export async function resetDeviceCommand(id: string): Promise<GetacDevice | null> {
  await ensureDevicesUpdatesSchema();

  const result = await pool.query(
    `
      UPDATE lis.getac_devices
      SET
        pending_command = NULL,
        command_status = NULL,
        status = CASE WHEN status IN ('checking', 'updating') THEN 'unknown' ELSE status END,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `,
    [id]
  );

  if (!result.rows[0]) return null;
  return mapGetacDeviceRow(result.rows[0]);
}

export async function queueDeviceCommand(
  id: string,
  command: DeviceCommand
): Promise<GetacDevice | null> {
  await ensureDevicesUpdatesSchema();
  await releaseStaleCommands(1, id);

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
  return mapGetacDeviceRow(result.rows[0]);
}

export async function claimPendingCommand(deviceId: string): Promise<DeviceCommand | null> {
  await ensureDevicesUpdatesSchema();
  await releaseStaleCommands(1, deviceId);

  const result = await pool.query(
    `
      UPDATE lis.getac_devices
      SET
        command_status = 'in_progress',
        updated_at = NOW()
      WHERE id = $1
        AND pending_command IS NOT NULL
        AND command_status = 'queued'
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
      SET last_seen_at = NOW()
      WHERE id = $1
    `,
    [deviceId]
  );
}

export type ApplyAgentReportInput = {
  deviceId: string;
  report: AgentReportBody;
  completedCommand: DeviceCommand | null;
};

export async function applyAgentReport(
  input: ApplyAgentReportInput
): Promise<GetacDevice | null> {
  await ensureDevicesUpdatesSchema();
  const { query, params } = buildApplyAgentReportQuery(input);
  const result = await pool.query(query, params);

  if (!result.rows[0]) return null;
  return mapGetacDeviceRow(result.rows[0]);
}
