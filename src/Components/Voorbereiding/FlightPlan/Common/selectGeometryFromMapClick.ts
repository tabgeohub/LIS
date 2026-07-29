import { Geometry } from "hooks/features";
import { toggleGeometrySelection } from "./geometryHerhalen";

function geometryIdFromHitTest(
  hitTestResults: __esri.HitTestResult
): number | null {
  const existingFeature = hitTestResults.results.find(
    (result) => (result as __esri.GraphicHit).graphic
  );
  const attributes = (existingFeature as __esri.GraphicHit | undefined)
    ?.graphic?.attributes;

  if (!attributes || attributes.type !== "geometry" || !attributes.geometryId) {
    return null;
  }

  return attributes.geometryId as number;
}

export async function selectGeometryFromMapClick(input: {
  mapView: __esri.MapView;
  event: __esri.ViewClickEvent;
  geometries: Geometry[];
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
}): Promise<void> {
  input.event.stopPropagation();
  const hitTestResults = await input.mapView.hitTest(input.event);
  const geometryId = geometryIdFromHitTest(hitTestResults);
  if (geometryId == null) return;

  const geometry = input.geometries.find((item) => item.id === geometryId);
  if (!geometry) return;

  input.setSelectedGeometries(
    toggleGeometrySelection(input.selectedGeometries, geometry.id)
  );
}
