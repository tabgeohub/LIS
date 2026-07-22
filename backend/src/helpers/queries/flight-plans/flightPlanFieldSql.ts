import {
  FLIGHT_PLAN_UPDATE_COLUMNS,
  flightPlanUpdateValues,
  normalizeFlightPlanUpdateFields,
  type FlightPlanBodySource,
} from "./flightPlanFieldNormalize";

export function buildFlightPlanUpdateSql(): string {
  const setClause = FLIGHT_PLAN_UPDATE_COLUMNS.map(
    (column, index) => `${column} = $${index + 1}`
  ).join(",\n        ");

  return `
      UPDATE lis.flightPlans SET
        ${setClause}
      WHERE id = $${FLIGHT_PLAN_UPDATE_COLUMNS.length + 1}
      RETURNING *`;
}

export function buildFlightPlanUpdateParams(
  source: FlightPlanBodySource,
  id: unknown
): unknown[] {
  return [...flightPlanUpdateValues(source), id];
}

export function buildFlightPlanInsertSql(): string {
  const headColumns = FLIGHT_PLAN_UPDATE_COLUMNS.slice(0, 10);
  const tailColumns = [
    "user_id",
    "points",
    "regio_id",
    "basemap",
    "layers",
    "status",
    "created_at",
    "copied_from",
  ];
  const columns = [...headColumns, ...tailColumns];

  return `INSERT INTO lis.flightPlans (
        ${columns.join(",\n        ")}
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, NOW(), $17
      )
      RETURNING *`;
}

export function buildFlightPlanInsertParams(source: FlightPlanBodySource): unknown[] {
  const fields = normalizeFlightPlanUpdateFields(source);

  return [
    fields.vluchtnummer,
    fields.omschrijving,
    fields.waarnemer,
    fields.piloot,
    fields.datum,
    fields.vliegduur,
    fields.luchtvaartuig,
    fields.passagiers,
    fields.hoofdthema,
    fields.aanvullende,
    source.user_id,
    fields.points,
    source.regio_id,
    source.basemap,
    JSON.stringify([source.layers]),
    fields.status ?? "prepared",
    source.copiedFrom ?? null,
  ];
}
