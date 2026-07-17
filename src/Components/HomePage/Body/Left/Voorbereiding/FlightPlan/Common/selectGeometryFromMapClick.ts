import { Geometry } from "hooks/features/useGeometriesStore";
import { toggleGeometrySelection } from "./geometryHerhalen";

export async function selectGeometryFromMapClick(input: {
  mapView: __esri.MapView;
  event: __esri.ViewClickEvent;
  geometries: Geometry[];
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
}): Promise<void> {
  input.event.stopPropagation();
  const hitTestResults = await input.mapView.hitTest(input.event);
  const existingFeature = hitTestResults.results.find(
    (result) => (result as __esri.GraphicHit).graphic
  );
  const attributes = (existingFeature as __esri.GraphicHit | undefined)
    ?.graphic?.attributes;

  if (!attributes || attributes.type !== "geometry" || !attributes.geometryId) {
    return;
  }

  const geometry = input.geometries.find(
    (item) => item.id === attributes.geometryId
  );
  if (!geometry) return;

  input.setSelectedGeometries(
    toggleGeometrySelection(input.selectedGeometries, geometry.id)
  );
}
