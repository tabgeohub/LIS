const INTERNAL_FIELDS = new Set([
  "fid",
  "shape",
  "shape_length",
  "shape_area",
  "globalid",
  "global_id",
  "created_user",
  "created_date",
  "createddate",
  "last_edited_user",
  "lastediteduser",
  "last_edited_date",
  "lastediteddate",
]);

export function formatPopupFieldName(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatPopupValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "Ja" : "Nee";
  if (typeof value === "number") {
    return value > 1_000_000_000_000
      ? new Date(value).toLocaleString("nl-NL")
      : value.toString();
  }
  if (typeof value === "string") {
    return /^\d{4}-\d{2}-\d{2}/.test(value)
      ? new Date(value).toLocaleString("nl-NL")
      : value;
  }
  return typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
}

export function buildPopupDisplayAttributes(
  attributes: Record<string, unknown>
) {
  return Object.entries(attributes)
    .filter(([key]) => {
      const normalized = key.toLowerCase();
      return !key.startsWith("OBJECTID") && !INTERNAL_FIELDS.has(normalized);
    })
    .map(([key, value]) => ({
      label: formatPopupFieldName(key),
      value: formatPopupValue(value),
    }))
    .filter((item) => item.value !== "");
}

export function resolvePopupPosition(screenPoint: { x: number; y: number }) {
  return { x: screenPoint.x + 20, y: screenPoint.y - 50 };
}
