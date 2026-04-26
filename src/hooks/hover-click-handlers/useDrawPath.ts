/* eslint-disable react-hooks/exhaustive-deps */
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect, useRef, useState } from "react";
import usePathPointHandlerClick from "./usePathPointHandlerClick";

export default function useDrawPath(finishedPlanLoading: boolean = false) {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, redGraphicsLayer, pointsGraphicsLayer } = useMapViewState();

  const [loadingPath, setLoadingPath] = useState(false);

  const featureLayerRef = useRef<FeatureLayer | null>(null);

  usePathPointHandlerClick();

  useEffect(() => {
    if (featureLayerRef.current && mapView) {
      if (mapView.map.layers.includes(featureLayerRef.current)) {
        mapView.map.remove(featureLayerRef.current);
      }
      featureLayerRef.current = null;
    }

    if (!selectedPlan || !mapView) {
      setLoadingPath(false);
      return;
    }

    const planPath = selectedPlan.path;

    if (!planPath || !Array.isArray(planPath) || planPath.length === 0) {
      setLoadingPath(false);
      return;
    }

    setLoadingPath(true);

    const graphics = planPath.map((p, index) => {
      return new Graphic({
        geometry: new Point({
          longitude: p.longitude,
          latitude: p.latitude,
        }),
        symbol: new SimpleMarkerSymbol({
          color: "red",
          outline: { color: "black", width: 0.5 },
          size: "6px", // Smaller than blue points to ensure blue shows on top when overlapping
        }),
        attributes: {
          OBJECTID: index,
          planId: selectedPlan.id,
          vluchtnummer: selectedPlan.vluchtnummer,
          ...p,
        },
      });
    });

    const pathLayer = new FeatureLayer({
      source: graphics,
      fields: [
        { name: "OBJECTID", type: "oid" },
        { name: "planId", type: "string" },
        { name: "vluchtnummer", type: "string" },
        { name: "latitude", type: "double" },
        { name: "longitude", type: "double" },
        { name: "altitude", type: "double" },
        { name: "speed", type: "double" },
        { name: "rotationAngle", type: "double" },
      ],
      objectIdField: "OBJECTID",
      geometryType: "point",
      spatialReference: { wkid: 4326 },
      title: "PathPoints",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          color: "red",
          size: 6, // Smaller than blue points to ensure blue shows on top when overlapping
          outline: {
            color: "black",
            width: 0.5,
          },
        },
      },
    });

    featureLayerRef.current = pathLayer;

    if (pointsGraphicsLayer) {
      const pointsLayerIndex = mapView.map.layers.indexOf(pointsGraphicsLayer);
      if (pointsLayerIndex >= 0) {
        // Add red path layer BELOW blue points layer to ensure blue points render on top
        // Inserting at pointsLayerIndex will place red below blue (blue moves up)
        mapView.map.add(pathLayer, pointsLayerIndex);
      } else {
        mapView.map.add(pathLayer);
      }
    } else {
      mapView.map.add(pathLayer);
    }

    // Ensure blue points layer is always above red path layer
    // Reorder to guarantee correct z-ordering
    if (
      pointsGraphicsLayer &&
      mapView.map.layers.includes(pointsGraphicsLayer) &&
      mapView.map.layers.includes(pathLayer)
    ) {
      const currentPathIndex = mapView.map.layers.indexOf(pathLayer);
      const currentPointsIndex =
        mapView.map.layers.indexOf(pointsGraphicsLayer);
      if (currentPointsIndex < currentPathIndex) {
        // Move blue points layer above red path layer
        mapView.map.reorder(pointsGraphicsLayer, currentPathIndex + 1);
      }
    }

    return () => {
      if (pathLayer && mapView.map.layers.includes(pathLayer)) {
        mapView.map.remove(pathLayer);
      }
      featureLayerRef.current = null;
      setLoadingPath(false);
    };
  }, [mapView, redGraphicsLayer, selectedPlan, pointsGraphicsLayer]);

  // Check if all conditions are met to set loadingPath to false
  useEffect(() => {
    // Only check if loadingPath is currently true
    if (!loadingPath) return;

    // Fallback guard: never keep loader forever due to async layer timing mismatches
    const fallbackTimeout = window.setTimeout(() => {
      setLoadingPath(false);
    }, 3000);

    // Condition 1: finishedPlan is completely fetched
    if (finishedPlanLoading) {
      return () => window.clearTimeout(fallbackTimeout);
    }

    // Condition 2: Path is fetched from flight plan and added to map
    if (!selectedPlan?.path || !Array.isArray(selectedPlan.path) || selectedPlan.path.length === 0) {
      return () => window.clearTimeout(fallbackTimeout);
    }

    if (!featureLayerRef.current || !mapView) {
      return () => window.clearTimeout(fallbackTimeout);
    }

    if (!mapView.map.layers.includes(featureLayerRef.current)) {
      return () => window.clearTimeout(fallbackTimeout);
    }

    // Condition 3 (soft): if points layer is available, prefer waiting for graphics.
    // If points are not expected/available yet, still allow loader to close.
    const checkPoints = () => {
      const expectedPointsCount = Array.isArray(selectedPlan.points_data)
        ? selectedPlan.points_data.length
        : 0;

      if (!pointsGraphicsLayer || expectedPointsCount === 0) {
        setLoadingPath(false);
        return;
      }

      const graphicsCount = pointsGraphicsLayer.graphics.length;
      if (graphicsCount >= expectedPointsCount) {
        setLoadingPath(false);
      }
    };

    // Use requestAnimationFrame to ensure DOM/graphics are updated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        checkPoints();
      });
    });

    return () => window.clearTimeout(fallbackTimeout);
  }, [
    loadingPath,
    finishedPlanLoading,
    selectedPlan?.path,
    selectedPlan?.points_data,
    mapView,
    pointsGraphicsLayer,
  ]);

  return { loadingPath };
}
