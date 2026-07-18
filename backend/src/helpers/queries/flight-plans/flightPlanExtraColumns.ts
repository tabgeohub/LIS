export function flightPlanExtraColumns(
  planAlias: string,
  columns: readonly string[]
): string {
  return columns.map((column) => `${planAlias}.${column}`).join(",\n        ");
}
