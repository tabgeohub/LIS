import type { Geometry } from "hooks/features/useGeometriesStore";
import {
  calculateCenterAndZoom,
  goToLonLatZoom,
} from "Components/HomePage/helpers/ArcGISHelpers/calculateCenterAndZoom";
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

  const points = collectFiniteLatLonPoints(geometry.points);
  if (points.length === 0) return;

  const { center, zoom } = calculateCenterAndZoom(points);
  goToLonLatZoom({ mapView, center, zoom });
}

function hasFiniteLatLon(point: {
  latitude?: unknown;
  longitude?: unknown;
}): point is { latitude: number; longitude: number } {
  return (
    typeof point.latitude === "number" &&
    typeof point.longitude === "number" &&
    Number.isFinite(point.latitude) &&
    Number.isFinite(point.longitude)
  );
}

function collectFiniteLatLonPoints(
  points: Geometry["points"]
): Array<{ latitude: number; longitude: number }> {
  return points.filter(hasFiniteLatLon).map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
  }));
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
