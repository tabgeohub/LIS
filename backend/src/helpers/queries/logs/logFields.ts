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

function orFallback<T>(value: unknown, fallback: T): T {
  return (value as T) || fallback;
}

export function buildLogInsertValues(
  flightId: number,
  log: LogInsertInput
): unknown[] {
  return [
    flightId,
    orFallback(log.message, ""),
    orFallback(log.userId, ""),
    orFallback(log.userName, ""),
    orFallback(log.userRole, ""),
    orFallback(log.planId, 0),
    orFallback(log.pointId, 0),
    orFallback(log.date, ""),
    orFallback(log.isOnline, false),
    orFallback(log.gpsConnected, false),
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
