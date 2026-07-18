export function buildPointsViewLengths(input: {
  tables: {
    pointsTable: unknown[];
    flightPlans: unknown[];
    geometriesTable: unknown[];
  };
  state: {
    starredPoints: unknown[];
    starredPlans: unknown[];
    starredGeometries: unknown[];
  };
}) {
  return {
    points: input.tables.pointsTable.length,
    plans: input.tables.flightPlans.length,
    geometries: input.tables.geometriesTable.length,
    starredPoints: input.state.starredPoints.length,
    starredPlans: input.state.starredPlans.length,
    starredGeometries: input.state.starredGeometries.length,
  };
}
