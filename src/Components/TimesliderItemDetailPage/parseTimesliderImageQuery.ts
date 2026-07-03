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

  const id = idStr != null ? Number(idStr) : NaN;
  if (!Number.isFinite(id) || id <= 0) {
    return { ok: false, reason: "Ongeldige link (id)." };
  }

  if (
    !from ||
    !to ||
    !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(to)
  ) {
    return { ok: false, reason: "Ongeldige link (periode)." };
  }

  const planIdStr = searchParams.get("plan_id");
  let planId: number | null = null;
  if (planIdStr != null && planIdStr !== "") {
    const pid = Number(planIdStr);
    if (!Number.isFinite(pid) || pid <= 0) {
      return { ok: false, reason: "Ongeldige link (plan_id)." };
    }
    planId = pid;
  }

  return { ok: true, kind, id, from, to, planId };
}
