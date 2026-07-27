import { Geometry } from "hooks/features/useGeometriesStore";

export function matchesHerhalenValue(input: {
  geometryHerhalen: Geometry["herhalen"] | string;
  herhalen: boolean;
}): boolean {
  const herhalenValue = input.herhalen ? 1 : 0;
  if (typeof input.geometryHerhalen === "number") {
    return input.geometryHerhalen === herhalenValue;
  }
  if (typeof input.geometryHerhalen === "string") {
    return input.geometryHerhalen === String(herhalenValue);
  }
  return input.geometryHerhalen === input.herhalen;
}

export function filterPointsForStepContent<
  T extends { id: number; herhalen: number; omschrijving: string }
>(input: {
  dbPoints: T[];
  herhalen: boolean;
  selectedPlanPointIds: number[];
}): T[] {
  const herhalenValue = input.herhalen ? 1 : 0;
  const planIds = new Set(input.selectedPlanPointIds);

  return input.dbPoints
    .filter((point) => point.herhalen === herhalenValue)
    .filter((point) => !planIds.has(point.id));
}

export function filterDisplayedPoints(input: {
  points: Array<{ id: number; omschrijving: string }>;
  filterTerm: string;
  selectedPlanPointIds: number[];
}) {
  const planIds = new Set(input.selectedPlanPointIds);
  const term = input.filterTerm.toLowerCase();

  return input.points
    .filter((point) => point.omschrijving.toLowerCase().includes(term))
    .filter((point) => !planIds.has(point.id));
}

export function filterDisplayedGeometries(
  geometries: Geometry[],
  filterTerm: string
) {
  const term = filterTerm.toLowerCase();
  return geometries.filter((geometry) =>
    geometry.omschrijving.toLowerCase().includes(term)
  );
}
