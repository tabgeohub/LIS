const STALE_COMMAND_SET = `
  status = 'failed',
  pending_command = NULL,
  command_status = 'failed',
  last_error = 'Command timed out. Click Check Status to try again.',
  updated_at = NOW()
`;

export function buildStaleCommandUpdateSql(input: {
  staleAfterMinutes: number;
  deviceId?: string;
}): { query: string; params: unknown[] } {
  if (input.deviceId) {
    return {
      query: `
        UPDATE lis.getac_devices
        SET ${STALE_COMMAND_SET}
        WHERE id = $1
          AND command_status IN ('queued', 'in_progress')
          AND updated_at < NOW() - ($2 * INTERVAL '1 minute');
      `,
      params: [input.deviceId, input.staleAfterMinutes],
    };
  }

  return {
    query: `
      UPDATE lis.getac_devices
      SET ${STALE_COMMAND_SET}
      WHERE command_status IN ('queued', 'in_progress')
        AND updated_at < NOW() - ($1 * INTERVAL '1 minute');
    `,
    params: [input.staleAfterMinutes],
  };
}
