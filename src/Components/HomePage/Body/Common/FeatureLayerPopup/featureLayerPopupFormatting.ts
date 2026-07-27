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

function formatPopupNumber(value: number): string {
  if (value > 1_000_000_000_000) {
    return new Date(value).toLocaleString("nl-NL");
  }
  return value.toString();
}

function formatPopupString(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return new Date(value).toLocaleString("nl-NL");
  }
  return value;
}

function formatPopupObject(value: unknown): string {
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function formatPopupBoolean(value: boolean): string {
  return value ? "Ja" : "Nee";
}

const POPUP_TYPE_FORMATTERS: Record<string, (value: unknown) => string> = {
  boolean: (value) => formatPopupBoolean(value as boolean),
  number: (value) => formatPopupNumber(value as number),
  string: (value) => formatPopupString(value as string),
};

export function formatPopupValue(value: unknown): string {
  if (value == null) return "";
  const format = POPUP_TYPE_FORMATTERS[typeof value];
  return format ? format(value) : formatPopupObject(value);
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
