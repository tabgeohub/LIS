export type TimesliderItemDetailKind = "point" | "geometry";

/** Relative path + query for `/images` (same origin → shared session / localStorage). */
export function buildTimesliderItemDetailHref(params: {
  kind: TimesliderItemDetailKind;
  id: number;
  dateFrom: string;
  dateTo: string;
}): string {
  const search = new URLSearchParams({
    kind: params.kind,
    id: String(params.id),
    from: params.dateFrom,
    to: params.dateTo,
  });
  return `/images?${search.toString()}`;
}
