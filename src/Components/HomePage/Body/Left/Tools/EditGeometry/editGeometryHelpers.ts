import type { Geometry } from "hooks/features/useGeometriesStore";
import {
  calculateCenterAndZoom,
  goToLonLatZoom,
} from "@helpers/ArcGISHelpers/calculateCenterAndZoom";
import type { GeometryEditDraft, GeometryPointRow } from "./EditForm";

export function filterGeometriesByTerm(geometries: Geometry[], filterTerm: string) {
  if (!filterTerm) return geometries;
  const term = filterTerm.toLowerCase();
  return geometries.filter((geometry) =>
    (geometry.omschrijving || `Geometrie ${geometry.id}`)
      .toLowerCase()
      .includes(term)
  );
}

export function buildGeometrySavePayload(input: {
  editingGeometry: Geometry;
  draft: GeometryEditDraft;
  points?: GeometryPointRow[];
}) {
  return {
    id: input.editingGeometry.id,
    omschrijving: input.draft.omschrijving,
    organisatie: input.draft.organisatie,
    activiteit: input.draft.activiteit,
    specifiek_letten_op: input.draft.specifiek_letten_op,
    vertrouwelijk: input.draft.vertrouwelijk ? 1 : 0,
    herhalen: input.draft.herhalen ? 1 : 0,
    points: input.points ?? input.editingGeometry.points,
  };
}

export function zoomMapToGeometryPoints(
  mapView: __esri.MapView | null | undefined,
  geometry: Geometry
) {
  if (!mapView || !geometry.points?.length) return;

  const points = geometry.points
    .filter(
      (p) =>
        typeof p.latitude === "number" &&
        typeof p.longitude === "number" &&
        Number.isFinite(p.latitude) &&
        Number.isFinite(p.longitude)
    )
    .map((p) => ({ latitude: p.latitude, longitude: p.longitude }));

  if (points.length === 0) return;

  const { center, zoom } = calculateCenterAndZoom(points);
  goToLonLatZoom(mapView, center, zoom);
}

export function patchGeometryPointInList(input: {
  geometries: Geometry[];
  geometryId: number;
  updatedPoint: GeometryPointRow;
}) {
  return input.geometries.map((g) =>
    g.id === input.geometryId
      ? {
          ...g,
          points: g.points.map((p) =>
            p.id === input.updatedPoint.id ? { ...p, ...input.updatedPoint } : p
          ),
        }
      : g
  );
}
