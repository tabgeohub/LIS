import type { EnrichedPointType, FlightPlanType } from "Types";
import { POINT_EXPORT_COLUMNS } from "./pointColumnKeys";

export type FlightPlanPointExportRow = {
  [Key in (typeof POINT_EXPORT_COLUMNS)[number]]: string | number | undefined;
};

export function normalizeJaNee(value: unknown): "ja" | "nee" {
  if (typeof value === "boolean") return value ? "ja" : "nee";
  if (typeof value === "number") return value === 1 ? "ja" : "nee";
  const normalized = String(value ?? "").trim().toLowerCase();
  return ["1", "true", "ja", "yes"].includes(normalized) ? "ja" : "nee";
}

export function normalizeExportNumber(value: unknown): number | "" {
  const parsed =
    typeof value === "string"
      ? parseFloat(value.replace(",", ".").replace(/\s/g, ""))
      : Number(value);
  return Number.isFinite(parsed) ? parsed : "";
}

function stringOrEmpty(value: unknown): string {
  return (value as string | undefined | null) ?? "";
}

function pointOrPlanField(
  pointValue: unknown,
  planValue: unknown
): string | number {
  return (pointValue as string | number | undefined | null) ??
    (planValue as string | number | undefined | null) ??
    "";
}

function buildExportGeometry(point: EnrichedPointType): string {
  return `X: ${point.longitude}, Y: ${point.latitude}`;
}

function buildExportCoordinateFields(point: EnrichedPointType) {
  return {
    xcoordinaat_rd: normalizeExportNumber(point.xcoordinaat_rd),
    ycoordinaat_rd: normalizeExportNumber(point.ycoordinaat_rd),
    latitude: normalizeExportNumber(point.latitude),
    longitude: normalizeExportNumber(point.longitude),
  };
}

function buildExportFlagFields(point: EnrichedPointType) {
  return {
    herhalen: normalizeJaNee(point.herhalen),
    vertrouwelijk: normalizeJaNee(point.vertrouwelijk),
  };
}

export function mapPointToExportRow(
  point: EnrichedPointType,
  plan: FlightPlanType
): FlightPlanPointExportRow {
  return {
    geometry: buildExportGeometry(point),
    omschrijving: stringOrEmpty(point.omschrijving),
    regio_id: stringOrEmpty(point.regio_id),
    ...buildExportCoordinateFields(point),
    ...buildExportFlagFields(point),
    indiener_id: point.user_id,
    activiteit_id: pointOrPlanField(point.activiteit_id, plan.activiteit_id),
    organisatie_id: pointOrPlanField(
      point.organisatie_id,
      plan.organisatie_id
    ),
    specifiek_letten_op: stringOrEmpty(point.specifiek_letten_op),
    datum: point.created_at,
  };
}

export function buildFlightPlanPointExportRows(
  plan: FlightPlanType
): FlightPlanPointExportRow[] {
  const points = (plan.points as EnrichedPointType[]) ?? [];
  return points.map((point) => mapPointToExportRow(point, plan));
}
