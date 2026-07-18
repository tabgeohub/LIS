import { FlightPlanType } from "Types";

export const FLIGHT_PLAN_COLUMN_KEY_MAP: Record<
  string,
  keyof FlightPlanType
> = {
  "aanmaker vlieplan": "user_id",
  "aanmaker datum": "datum",
  vluchtnummer: "vluchtnummer",
  omschrijving: "omschrijving",
  waarnemer: "waarnemer",
  piloot: "piloot",
  inspectiedatum: "datum",
  regio: "regio_id",
  "aantal passagiers": "passagiers",
  "doel en hoofdthema": "hoofdthema",
  "aanvullende informatie": "aanvullende",
  "geplande vliegduur": "vliegduur",
  status: "status",
  "begintijd en datum": "startTime",
  "eindtijd en datum": "endTime",
  "werkelijke vliegduur": "spoed",
  "gevlogen afstand": "flightDuration",
};

export function formatFlightPlanCellValue(
  plan: FlightPlanType,
  col: string
): string | number {
  const dbKey =
    FLIGHT_PLAN_COLUMN_KEY_MAP[col.toLowerCase()] || col.toLowerCase();
  const value = plan[dbKey as keyof typeof plan];
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return value as string | number;
}
