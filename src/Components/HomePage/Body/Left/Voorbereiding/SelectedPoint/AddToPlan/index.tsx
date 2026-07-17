/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";

import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { useTabState } from "@helpers/ZustandStates/tabState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";

import Step1 from "./Step1";
import StepYes from "./StepYes";
import StepNo from "./StepNo";
import StepMultiplePoints from "./StepMultiplePoints";
import { startPolygonDrawer } from "./polygonDrawer";

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

  const initPolygonDrawer = useCallback(async () => {
    if (!mapView?.map) return;
    await startPolygonDrawer({
      mapView,
      cleanupSketch,
      sketchRef,
      graphicsLayerRef,
      createHandleRef,
      points,
      setPolygonPoints,
    });
  }, [mapView, cleanupSketch, points, setPolygonPoints]);

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
