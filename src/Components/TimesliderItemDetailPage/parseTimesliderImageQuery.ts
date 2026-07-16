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

export function parseTimesliderImageQuery(
  searchParams: URLSearchParams
): ParsedTimesliderQuery {
  const kind = searchParams.get("kind");
  const idStr = searchParams.get("id");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (kind !== "point" && kind !== "geometry") {
    return { ok: false, reason: "Ongeldige link (kind)." };
  }

  const id = parsePositiveId(idStr);
  if (id === null) {
    return { ok: false, reason: "Ongeldige link (id)." };
  }

  if (!hasDateFormat(from) || !hasDateFormat(to)) {
    return { ok: false, reason: "Ongeldige link (periode)." };
  }

  const planId = parseOptionalPlanId(searchParams.get("plan_id"));
  if (!planId.ok) return { ok: false, reason: "Ongeldige link (plan_id)." };

  return { ok: true, kind, id, from, to, planId: planId.value };
}
