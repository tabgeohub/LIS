import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { createGeometryGraphic, BaseGeometryData } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

/**
 * Base geometry interface for hover functionality
 * Compatible with both Geometry and FinishedGeometryType
 */
interface HoverableGeometry extends BaseGeometryData {
  id: number;
  points?: Array<{
    longitude?: number;
    latitude?: number;
    xcoordinaat_rd?: number;
    ycoordinaat_rd?: number;
  }>;
  omschrijving?: string;
  geometry_omschrijving?: string;
  type?: "polygon" | "line";
  geometry_type?: "polygon" | "line" | string | null;
}

/**
 * Hook for geometry hover (similar to usePointHover)
 * Handles hover effects for geometries on the map
 */
export default function useGeometryHover() {
  const { mapView } = useMapViewState();
  const setHovered = useHoveredGraphicState.getState().setHovered;

  function handleHoveredGeometry(geometry: HoverableGeometry | null | undefined) {
    if (!validateMapView(mapView) || !geometry) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    // Create hover graphic for geometry
    if (!geometry.points || geometry.points.length === 0) return;

    // Normalize geometry data for createGeometryGraphic
    const normalizedGeometry: BaseGeometryData = {
      id: geometry.id,
      type: (geometry.type || geometry.geometry_type) as "polygon" | "line" | undefined,
      omschrijving: geometry.omschrijving || geometry.geometry_omschrijving,
      points: geometry.points,
    };

    // Use createGeometryGraphic utility with hover symbol options
    const hoverGraphic = createGeometryGraphic(normalizedGeometry, {
      symbolOptions: {
        fillColor: [0, 0, 0, 0], // Transparent fill
        outlineColor: [255, 213, 0, 0.9], // Yellow outline for hover
        lineColor: [255, 213, 0, 0.9], // Yellow line for hover
        outlineWidth: 3,
        lineWidth: 4,
      },
      attributes: {
        label: "hovered-geometry",
        geometryId: geometry.id,
      },
    });

    if (hoverGraphic) {
      mapView.graphics.add(hoverGraphic);
      setHovered({
        id: geometry.id,
        label: geometry.omschrijving || geometry.geometry_omschrijving || `Geometrie ${geometry.id}`,
        point: {
          ...geometry,
          type: "geometry",
          geometryType:
            (geometry.type || geometry.geometry_type) === "polygon" ? "polygon" : "line",
        },
      });
    }
  }

  function handleRemoveHoveredGeometry() {
    if (!validateMapView(mapView)) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    setHovered(null);
  }

  return {
    handleHoveredGeometry,
    handleRemoveHoveredGeometry,
  };
}

