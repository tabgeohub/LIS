import Polygon from "@arcgis/core/geometry/Polygon";
import { validateMapView } from "Components/HomePage/helpers/ArcGISHelpers/validateMapView";
import { EnrichedPointType } from "Types";

export function zoomMapToPointsTable(input: {
  mapView: __esri.MapView | null;
  pointsTable: EnrichedPointType[] | null | undefined;
  logAction: (input: { message: string; step: string }) => void;
}) {
  const { mapView, pointsTable, logAction } = input;
  if (!validateMapView(mapView) || !pointsTable || pointsTable.length === 0)
    return;
  const lats = pointsTable.map((p) => p.latitude);
  const lons = pointsTable.map((p) => p.longitude);
  mapView!.goTo(
    new Polygon({
      rings: [
        [
          [Math.min(...lons), Math.max(...lats)],
          [Math.max(...lons), Math.max(...lats)],
          [Math.max(...lons), Math.min(...lats)],
          [Math.min(...lons), Math.min(...lats)],
          [Math.min(...lons), Math.max(...lats)],
        ],
      ],
      spatialReference: { wkid: 4326 },
    })
  );
  logAction({
    message: "User clicked 'Zoom to all points' button",
    step: "Clicked table functions",
  });
}
