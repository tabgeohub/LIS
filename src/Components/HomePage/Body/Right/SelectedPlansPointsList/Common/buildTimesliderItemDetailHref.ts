export type TimesliderItemDetailKind = "point" | "geometry";

/** Relative path + query for `/images` (same origin → shared session / localStorage). */
export function buildTimesliderItemDetailHref(params: {
  kind: TimesliderItemDetailKind;
  id: number;
  dateFrom: string;
  dateTo: string;
  /** When set, scopes images to this flight plan (matches list row). */
  planId?: number;
}): string {
  const search = new URLSearchParams({
    kind: params.kind,
    id: String(params.id),
    from: params.dateFrom,
    to: params.dateTo,
  });
  if (params.planId != null && Number.isFinite(params.planId)) {
    search.set("plan_id", String(params.planId));
  }
  return `/images?${search.toString()}`;
}
