export function flightPlanExtraColumns(options: {
  planAlias: string;
  columns: readonly string[];
}): string {
  return options.columns
    .map((column) => `${options.planAlias}.${column}`)
    .join(",\n        ");
}
