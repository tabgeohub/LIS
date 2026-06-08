export function parsePlanIds(query: unknown): number[] {
  if (query == null) {
    return [];
  }

  if (Array.isArray(query)) {
    return query
      .flatMap((value) => String(value).split(","))
      .map((segment) => parseInt(segment.trim(), 10))
      .filter((id) => Number.isFinite(id) && id > 0);
  }

  return String(query)
    .split(",")
    .map((segment) => parseInt(segment.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0);
}
