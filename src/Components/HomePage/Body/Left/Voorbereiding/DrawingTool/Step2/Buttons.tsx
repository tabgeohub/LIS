import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useEffect, useState } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import Point from "@arcgis/core/geometry/Point";
import { useCreateData } from "utils/useCreateData";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";

export default function Buttons() {
  const {
    setStep,
    clear,
    omschrijving,
    organisatie,
    vertrouwelijk,
    herhalen,
    activiteit,
    specifiekLettenOp,
    graphicsDrawn,
  } = useDrawingStore();
  const { mapView } = useMapViewState();
  const { user } = useAuth();
  const content = useContent();
  const { create, loading } = useCreateData("/geometries");
  const { fetchGeometries } = useGeometriesStore();
  const [graphicsLayer, setGraphicsLayer] = useState<GraphicsLayer | null>(
    null
  );

  // Find the graphics layer used for drawing
  useEffect(() => {
    if (!mapView) return;

    const findGraphicsLayer = () => {
      const layers = mapView.map.layers;
      for (let i = 0; i < layers.length; i++) {
        const layer = layers.getItemAt(i);


        if (layer instanceof GraphicsLayer && layer.title === "Tekeninglaag") {
          setGraphicsLayer(layer);
          return;
        }
      }
    };

    findGraphicsLayer();
  }, [mapView]);

  const clearGraphics = () => {
    if (!mapView) return;

    // Find the graphics layer directly
    const layers = mapView.map.layers;
    for (let i = 0; i < layers.length; i++) {
      const layer = layers.getItemAt(i);
      if (layer instanceof GraphicsLayer && layer.title === "Tekeninglaag") {
        layer.removeAll();
        return;
      }
    }
  };

  function handleBack() {
    clearGraphics();
    setStep(1);
  }

  function handleCancel() {
    clearGraphics();
    clear();
  }

  async function handleSubmit() {
    if (!graphicsDrawn || graphicsDrawn.length === 0) {
      return;
    }

    // Create array of points
    const pointsArray: Array<{
      omschrijving: string;
      regio_id: string | undefined;
      xcoordinaat_rd: number;
      ycoordinaat_rd: number;
      longitude: number;
      latitude: number;
      user_id: number | undefined;
      herhalen: number;
      organisatie: string;
      omschrijving_original: string;
      vertrouwelijk: number;
      activiteit: string;
      specifiekLettenOp: string;
      geometry_type: string;
    }> = [];

    let pointOrder = 1;

    // Iterate through all drawn shapes
    graphicsDrawn.forEach((shape) => {
      // Iterate through all points in the shape
      shape.points.forEach((point) => {
        const [x, y] = point;

        // Coordinates are in Web Mercator (EPSG:3857), convert to WGS84 first
        const webMercatorPoint = new Point({
          x: x,
          y: y,
          spatialReference: { wkid: 3857 }, // Web Mercator
        });

        // Convert Web Mercator to WGS84 (geographic)
        const wgs84Point = webMercatorUtils.webMercatorToGeographic(
          webMercatorPoint
        ) as Point;

        const longitude = wgs84Point.longitude;
        const latitude = wgs84Point.latitude;

        // Skip if coordinates are invalid
        if (
          typeof longitude !== "number" ||
          typeof latitude !== "number" ||
          !isFinite(longitude) ||
          !isFinite(latitude)
        ) {
          return;
        }

        // Transform WGS84 to RD coordinates
        const rdCoords = getTransformedCoordinates(
          "WGS84",
          "RD",
          longitude,
          latitude
        );

        pointsArray.push({
          omschrijving: `${omschrijving}_point_${pointOrder}`,
          regio_id: user?.role,
          xcoordinaat_rd: rdCoords.x,
          ycoordinaat_rd: rdCoords.y,
          longitude: longitude,
          latitude: latitude,
          user_id: user?.user_id,
          herhalen: herhalen ? 1 : 0,
          organisatie: organisatie,
          omschrijving_original: omschrijving,
          vertrouwelijk: vertrouwelijk ? 1 : 0,
          activiteit: activiteit,
          specifiekLettenOp: specifiekLettenOp,
          geometry_type: shape.type,
        });

        pointOrder++;
      });
    });

    // Get unique geometry types (or use the first one if all are the same)
    const geometryTypes = graphicsDrawn.map((shape) => shape.type);
    const uniqueGeometryTypes = Array.from(new Set(geometryTypes));
    // Use the first geometry type, or combine them if multiple
    const geometryType = uniqueGeometryTypes.length === 1
      ? uniqueGeometryTypes[0]
      : uniqueGeometryTypes.join(", ");

    // Call API to create geometry and points
    const result = await create(
      {
        omschrijving,
        organisatie,
        vertrouwelijk,
        herhalen,
        activiteit,
        specifiekLettenOp,
        geometry_type: geometryType,
        regio_id: user?.role,
        points: pointsArray,
      },
      async () => {
        // Success callback - clear graphics and reset after successful creation
        clearGraphics();
        clear();
        
        // Refetch geometries to update the map immediately
        await fetchGeometries({
          regio: user?.role && user.role !== "admin" ? user.role : undefined,
        });
      }
    );

    // Only clear if creation was successful (result is not null)
    if (result !== null) {
      // Success toast is already shown by useCreateData hook
      // Graphics cleared in success callback above
      // Geometries refetched in success callback above
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={handleBack}
          disabled={loading}
          className="gray-button"
        >
          {content.common.vorige}
        </button>

        <button
          disabled={omschrijving === "" || organisatie === "" || loading}
          onClick={handleSubmit}
          className="gray-button"
        >
          {loading ? "Opslaan..." : content.common.opslaan}
        </button>

        <button
          onClick={handleCancel}
          disabled={loading}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm z-10 flex justify-center items-center rounded">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-600 text-sm">Bezig met opslaan...</p>
          </div>
        </div>
      )}
    </div>
  );
}
