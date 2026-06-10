export function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
}

export function getMissingFields(
  source: Record<string, unknown>,
  fields: string[]
): string[] {
  return fields.filter((field) => !hasValue(source[field]));
}

export function requireId(value: unknown): boolean {
  return hasValue(value);
}

export function requireNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}

export function requireArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
