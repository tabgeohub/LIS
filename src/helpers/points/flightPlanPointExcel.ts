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

export function buildFlightPlanPointExportRows(
  plan: FlightPlanType
): FlightPlanPointExportRow[] {
  const points = (plan.points as EnrichedPointType[]) ?? [];
  return points.map((point) => ({
    geometry: `X: ${point.longitude}, Y: ${point.latitude}`,
    omschrijving: point.omschrijving ?? "",
    regio_id: point.regio_id ?? "",
    xcoordinaat_rd: normalizeExportNumber(point.xcoordinaat_rd),
    ycoordinaat_rd: normalizeExportNumber(point.ycoordinaat_rd),
    latitude: normalizeExportNumber(point.latitude),
    longitude: normalizeExportNumber(point.longitude),
    herhalen: normalizeJaNee(point.herhalen),
    vertrouwelijk: normalizeJaNee(point.vertrouwelijk),
    indiener_id: point.user_id,
    activiteit_id: point.activiteit_id ?? plan.activiteit_id ?? "",
    organisatie_id: point.organisatie_id ?? plan.organisatie_id ?? "",
    specifiek_letten_op: point.specifiek_letten_op ?? "",
    datum: point.created_at,
  }));
}
