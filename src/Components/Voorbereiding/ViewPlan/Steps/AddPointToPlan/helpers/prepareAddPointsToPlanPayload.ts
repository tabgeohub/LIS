import {
  buildUniquePointIds,
  getGeometryVertexIds,
  mergeGeometries,
  resolveStandalonePoints,
} from "./planSelection";
import type { SubmitAddPointsToPlanInput } from "./submitAddPointsToPlanTypes";

export function prepareAddPointsToPlanPayload(
  input: SubmitAddPointsToPlanInput
) {
  const uniquePointIds = buildUniquePointIds({
    plan: input.selectedPlan,
    selectedPointIds: input.selectedPointIds,
    selectedGeometryIds: input.selectedGeometryIds,
    dbGeometries: input.dbGeometries,
  });
  const updatedGeometries = mergeGeometries({
    existing: input.selectedPlan.geometries,
    newlySelectedIds: input.selectedGeometryIds,
    allGeometries: input.dbGeometries,
  });
  const standalonePoints = resolveStandalonePoints({
    allPointIds: uniquePointIds,
    dbPoints: input.dbPoints,
    geometries: updatedGeometries,
  });
  const vertexIds = getGeometryVertexIds(updatedGeometries);
  const newlySelectedStandalonePoints = input.dbPoints.filter(
    (p) => input.selectedPointIds.includes(p.id) && !vertexIds.has(p.id)
  );
  return {
    uniquePointIds,
    standalonePoints,
    updatedGeometries,
    newlySelectedStandalonePoints,
  };
}
