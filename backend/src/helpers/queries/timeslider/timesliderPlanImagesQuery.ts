export { buildTimesliderPlanImagesQuery } from "../../repositories/finishedPlansTimesliderQuery";

export const TIMESLIDER_REGIO_FILTER = {
  caseInsensitiveAdmin: true,
  when: "provided" as const,
  castAsText: true,
};

export type FetchTimesliderPlanImagesOptions = {
  filter: "point" | "geometry";
  paramName: "point_id" | "geometry_id";
  responseIdKey: "point_id" | "geometry_id";
  invalidParamMessage: string;
  logLabel: string;
  failureMessage: string;
};

export function parsePositiveIntQueryParam(
  raw: unknown,
  paramName: string
): number | null {
  const value =
    typeof raw === "string"
      ? parseInt(raw, 10)
      : Array.isArray(raw)
        ? parseInt(String(raw[0]), 10)
        : NaN;
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}
