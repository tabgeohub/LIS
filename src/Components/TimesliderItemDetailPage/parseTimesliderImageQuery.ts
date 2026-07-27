export type ParsedTimesliderQuery =
  | {
      ok: true;
      kind: "point" | "geometry";
      id: number;
      from: string;
      to: string;
      planId: number | null;
    }
  | { ok: false; reason: string };

function parsePositiveId(value: string | null): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function hasDateFormat(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function parseOptionalPlanId(value: string | null) {
  if (value == null || value === "") {
    return { ok: true as const, value: null };
  }
  const parsed = parsePositiveId(value);
  return parsed === null
    ? { ok: false as const }
    : { ok: true as const, value: parsed };
}

function isTimesliderKind(
  kind: string | null
): kind is "point" | "geometry" {
  return kind === "point" || kind === "geometry";
}

function failTimesliderQuery(reason: string): ParsedTimesliderQuery {
  return { ok: false, reason };
}

function parseDateRange(searchParams: URLSearchParams):
  | { ok: true; from: string; to: string }
  | { ok: false } {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!hasDateFormat(from) || !hasDateFormat(to)) {
    return { ok: false };
  }
  return { ok: true, from, to };
}

export function parseTimesliderImageQuery(
  searchParams: URLSearchParams
): ParsedTimesliderQuery {
  const kind = searchParams.get("kind");
  if (!isTimesliderKind(kind)) {
    return failTimesliderQuery("Ongeldige link (kind).");
  }

  const id = parsePositiveId(searchParams.get("id"));
  if (id === null) {
    return failTimesliderQuery("Ongeldige link (id).");
  }

  const range = parseDateRange(searchParams);
  if (!range.ok) {
    return failTimesliderQuery("Ongeldige link (periode).");
  }

  const planId = parseOptionalPlanId(searchParams.get("plan_id"));
  if (!planId.ok) return failTimesliderQuery("Ongeldige link (plan_id).");

  return {
    ok: true,
    kind,
    id,
    from: range.from,
    to: range.to,
    planId: planId.value,
  };
}
