type ValidatedPoint = {
  id: number;
  omschrijving: string;
};

export function validateFinishedPlanPoint(
  point: unknown,
  index: number
): { ok: true; point: ValidatedPoint } | { ok: false; reason: string } {
  if (typeof point !== "object" || point === null) {
    return { ok: false, reason: `points[${index}] must be an object.` };
  }

  const typed = point as ValidatedPoint;
  if (typeof typed.id !== "number") {
    return { ok: false, reason: `points[${index}].id must be a number.` };
  }
  if (typeof typed.omschrijving !== "string") {
    return { ok: false, reason: `points[${index}].omschrijving must be a string.` };
  }

  return { ok: true, point: typed };
}
