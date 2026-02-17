import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useEffect, useState } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import Point from "@arcgis/core/geometry/Point";

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
      console.log("No graphics drawn");
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
        });

        pointOrder++;
      });
    });

    console.log("Form data:", {
      ...pointsArray,
      omschrijving,
      organisatie,
      vertrouwelijk,
      herhalen,
      activiteit,
      specifiekLettenOp,
    });

    // Clear graphics and reset
    clearGraphics();
    clear();
  }

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6">
      <button onClick={handleBack} className="gray-button">
        {content.common.vorige}
      </button>

      <button
        disabled={omschrijving === "" || organisatie === ""}
        onClick={handleSubmit}
        className="gray-button"
      >
        {content.common.opslaan}
      </button>

      <button onClick={handleCancel} className="gray-button">
        {content.common.annuleren}
      </button>
    </div>
  );
}
