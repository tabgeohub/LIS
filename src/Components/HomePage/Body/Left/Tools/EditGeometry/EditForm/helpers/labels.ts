/** Shared display strings for geometry rows and edit forms. */

export function geometryDisplayName(g: {
  id: number;
  omschrijving?: string | null;
}): string {
  const t = g.omschrijving?.trim();
  return t || `Geometrie ${g.id}`;
}

export function geometryTypeDutchLabel(
  type: string | undefined
): "Veelhoek" | "Lijn" {
  return type === "polygon" ? "Veelhoek" : "Lijn";
}

/** When draft value is legacy text or missing from consts API, prepend a synthetic option. */
export function selectOptionsWithFallback(
  options: { label: string; value: string }[],
  currentValue: string
): { label: string; value: string }[] {
  if (!currentValue || options.some((opt) => opt.value === currentValue)) {
    return options;
  }
  return [{ label: currentValue, value: currentValue }, ...options];
}
