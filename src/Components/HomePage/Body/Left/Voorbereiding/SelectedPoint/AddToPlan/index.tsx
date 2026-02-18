/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";

import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import Polygon from "@arcgis/core/geometry/Polygon";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";

import { useTabState } from "@helpers/ZustandStates/tabState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";

import Step1 from "./Step1";
import StepYes from "./StepYes";
import StepNo from "./StepNo";
import StepMultiplePoints from "./StepMultiplePoints";

import { EnrichedPointType } from "Types";

export default function AddToPlan() {
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { mapView, setTopMessage } = useMapViewState();

  const [answer, setAnswer] = useState("radio2");
  const [step, setStep] = useState(1);
  const sketchRef = useRef<SketchViewModel | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
  const createHandleRef = useRef<__esri.Handle | null>(null);
  const { points, polygonPoints, setPolygonPoints } = usePointsStore();

  // Draw yellow markers for polygon-selected points
  useDrawYellowMarkers({
    selectedPointIds: polygonPoints?.map((p) => p.id) || [],
    points: polygonPoints || [],
  });

  const cleanupSketch = useCallback(() => {
    createHandleRef.current?.remove();
    createHandleRef.current = null;

    if (sketchRef.current) {
      sketchRef.current.cancel();
      sketchRef.current.destroy();
      sketchRef.current = null;
    }

    if (graphicsLayerRef.current) {
      graphicsLayerRef.current.removeAll();
      if (mapView?.map) {
        mapView.map.remove(graphicsLayerRef.current);
      }
      graphicsLayerRef.current = null;
    }
  }, [mapView]);

  useEffect(() => {
    if (step === 3) {
      setTopMessage({
        message: "Schets veelhoek op de kaart. Sluit af met dubbelklik.",
        show: true,
      });
      setPolygonPoints([]);
      initPolygonDrawer();
    } else {
      setTopMessage({ message: "", show: false });
      cleanupSketch();
    }
  }, [step]);

  function isPointInPolygon(point: __esri.Point, ring: number[][]): boolean {
    const x = point.x;
    const y = point.y;

    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    for (const [px, py] of ring) {
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }

    if (x < minX || x > maxX || y < minY || y > maxY) {
      return false;
    }

    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0],
        yi = ring[i][1];
      const xj = ring[j][0],
        yj = ring[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  const initPolygonDrawer = useCallback(async () => {
    if (!mapView) return;

    try {
      if (!projection.isLoaded()) {
        await projection.load();
      }
    } catch (error) {
      console.error("Failed to load projection module:", error);
      return;
    }

    cleanupSketch();

    const graphicsLayer = new GraphicsLayer({ listMode: "hide" });
    graphicsLayerRef.current = graphicsLayer;
    mapView.map.add(graphicsLayer);

    const sketchViewModel = new SketchViewModel({
      view: mapView,
      layer: graphicsLayer,
      defaultCreateOptions: { mode: "click" },
    });

    sketchRef.current = sketchViewModel;

    createHandleRef.current = sketchViewModel.on("create", (event) => {
      if (event.state !== "complete") return;

      const polygon = event.graphic.geometry as __esri.Polygon;
      if (!polygon) return;

      const projectedPolygon = projection.project(
        polygon,
        new SpatialReference({ wkid: 4326 })
      ) as Polygon;

      const ring = projectedPolygon?.rings?.[0];
      if (!ring) return;

      const selected: EnrichedPointType[] = [];

      points.forEach((point) => {
        if (
          typeof point.longitude !== "number" ||
          typeof point.latitude !== "number"
        ) {
          return;
        }

        const pt = new Point({
          longitude: point.longitude,
          latitude: point.latitude,
        });

        if (isPointInPolygon(pt as __esri.Point, ring)) {
          selected.push(point);
        }
      });

      setPolygonPoints(selected);
    });

    sketchViewModel.create("polygon");
  }, [mapView, cleanupSketch, points, setPolygonPoints]);

  useEffect(() => {
    return () => {
      cleanupSketch();
    };
  }, [cleanupSketch]);

  return (
    <div className="mt-2 p-1">
      <div className="flex justify-between items-center p-1">
        <p></p>

        <p className="text-gray-400">Aandachtspunt toevoegen</p>

        <button
          onClick={() => {
            setSelectedTab("none");
            setSelectedBottomTab("Kaartlagenlijst");
          }}
        >
          <CgClose className="text-gray-400" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-200 mt-2" />

      {step === 1 && (
        <Step1 answer={answer} setAnswer={setAnswer} setStep={setStep} />
      )}

      {step === 2 && <StepNo setStep={setStep} />}

      {step === 3 && <StepYes setStep={setStep} />}

      {step === 4 && <StepMultiplePoints setStep={setStep} />}
    </div>
  );
}
