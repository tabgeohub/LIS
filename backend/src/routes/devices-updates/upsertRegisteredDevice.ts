import { pool } from "../../db";
import type { GetacDevice } from "../../shared/devices";
import { mapGetacDeviceRow } from "./mapGetacDeviceRow";

type RegisterDeviceInput = {
  machineId: string;
  hostname: string;
  deviceToken: string;
  windowsVersion?: string;
  osBuild?: string;
};

async function updateExistingDevice(
  input: RegisterDeviceInput,
  existingToken: string
): Promise<{ device: GetacDevice; deviceToken: string }> {
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
    device: mapGetacDeviceRow(result.rows[0]),
    deviceToken: existingToken,
  };
}

async function insertNewDevice(
  input: RegisterDeviceInput
): Promise<{ device: GetacDevice; deviceToken: string }> {
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
    device: mapGetacDeviceRow(result.rows[0]),
    deviceToken: input.deviceToken,
  };
}

export async function upsertRegisteredDevice(
  input: RegisterDeviceInput
): Promise<{ device: GetacDevice; deviceToken: string }> {
  const existing = await pool.query(
    `SELECT * FROM lis.getac_devices WHERE machine_id = $1 LIMIT 1`,
    [input.machineId]
  );

  if (existing.rows[0]) {
    return updateExistingDevice(input, String(existing.rows[0].device_token));
  }

  return insertNewDevice(input);
}
