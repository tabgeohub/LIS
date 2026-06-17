export const LOG_INSERT_COLUMNS = [
  "flight_id",
  "message",
  "userid",
  "userName",
  "userRole",
  "planId",
  "pointId",
  "date",
  "isOnline",
  "gpsConnected",
  "oldData",
  "newData",
  "currentLocation",
] as const;

export type LogInsertInput = {
  message?: unknown;
  userId?: unknown;
  userName?: unknown;
  userRole?: unknown;
  planId?: unknown;
  pointId?: unknown;
  date?: unknown;
  isOnline?: unknown;
  gpsConnected?: unknown;
  oldData?: unknown;
  newData?: unknown;
  currentLocation?: unknown;
};

export function buildLogInsertQuery(): string {
  const placeholders = LOG_INSERT_COLUMNS.map((_, index) => `$${index + 1}`).join(
    ", "
  );

  return `
        INSERT INTO lis.logging (
          ${LOG_INSERT_COLUMNS.join(",\n          ")}
        ) VALUES (${placeholders})
        RETURNING id;
      `;
}

export function buildLogInsertValues(
  flightId: number,
  log: LogInsertInput
): unknown[] {
  return [
    flightId,
    log.message || "",
    log.userId || "",
    log.userName || "",
    log.userRole || "",
    log.planId || 0,
    log.pointId || 0,
    log.date || "",
    log.isOnline || false,
    log.gpsConnected || false,
    JSON.stringify(log.oldData),
    JSON.stringify(log.newData),
    JSON.stringify(log.currentLocation),
  ];
}

export function logsFailureMessage(err: unknown): string {
  return `Failed to create logs: ${
    err instanceof Error ? err.message : String(err)
  }`;
}
