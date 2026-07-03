import { Geometry } from "hooks/features/useGeometriesStore";

export function matchesHerhalenValue(
  geometryHerhalen: Geometry["herhalen"],
  herhalen: boolean
): boolean {
  const herhalenValue = herhalen ? 1 : 0;
  if (typeof geometryHerhalen === "number") {
    return geometryHerhalen === herhalenValue;
  }
  if (typeof geometryHerhalen === "string") {
    return geometryHerhalen === String(herhalenValue);
  }
  return geometryHerhalen === herhalen;
}

export function filterPointsForStepContent(input: {
  dbPoints: Array<{ id: number; herhalen: number; omschrijving: string }>;
  herhalen: boolean;
  selectedPlanPointIds: number[];
}) {
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
