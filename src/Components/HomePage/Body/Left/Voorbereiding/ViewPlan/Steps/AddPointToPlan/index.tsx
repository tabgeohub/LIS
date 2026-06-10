/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import {
  useGeometriesStore,
  Geometry,
} from "hooks/features/useGeometriesStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { useRenderLocalGeometries } from "hooks/features/useRenderLocalGeometries";
import { useHoverPointsAndGeometries } from "hooks/features/useHoverPointsAndGeometries";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { useUpdateData } from "utils/useUpdateData";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import PointsList from "./PointsList";
import GeometriesList from "../../../FlightPlan/Common/GeometriesList";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

export default function AddPointToPlan() {
  const { dbPoints } = usePointsStore();
  const { dbGeometries } = useGeometriesStore();
  const { mapView, pointsGraphicsLayer } = useMapViewState();

  const [filter, setFilter] = useState("");
  const [selectedPointIds, setSelectedPointIds] = useState<number[]>([]);
  const [selectedGeometryIds, setSelectedGeometryIds] = useState<number[]>([]);
  const { selectedPlan } = useViewPlanState();

  const { update, loading } = useUpdateData(`/flightPlans/vluchtplans/points`);

  const filteredPoints = useMemo(
    () =>
      dbPoints.filter(
        (dbPoint) => !selectedPlan?.points.some((p) => p.id === dbPoint.id)
      ),
    [dbPoints, filter]
  );

  const filteredGeometries = useMemo(
    () =>
      dbGeometries.filter(
        (geometry) =>
          !selectedPlan?.geometries?.some((g) => g.id === geometry.id)
      ),
    [dbGeometries, selectedPlan]
  );

  // Manage created pins for cleanup and toggle
  const pinRefs = useRef<
    Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>
  >(new Map());
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  // Draw blue points for filtered list (like in AddPointsFromPlan)
  useEffect(() => {
    // clear previous blue points
    if (mapView && blueGraphicsRef.current.length) {
      try {
        mapView.graphics.removeMany(blueGraphicsRef.current);
      } catch {}
      blueGraphicsRef.current = [];
    }
    pointsGraphicsLayer?.removeAll();

    if (!filteredPoints.length) return;

    const graphics = createPointGraphics(filteredPoints, {
      symbolOptions: {
        color: "blue",
        size: 10,
        style: "circle",
        outlineColor: "white",
        outlineWidth: 1,
      },
      transformCoordinates: true,
    });

    if (graphics.length) {
      if (pointsGraphicsLayer) {
        pointsGraphicsLayer.addMany(graphics as any);
      } else if (mapView) {
        mapView.graphics.addMany(graphics as any);
        blueGraphicsRef.current = graphics;
      }
    }
  }, [filteredPoints, mapView, pointsGraphicsLayer]);

  // Render geometries on the map
  useRenderLocalGeometries(filteredGeometries);

  // Sync pins with selection
  useEffect(() => {
    if (!validateMapView(mapView)) return;

    const currentIds = new Set(selectedPointIds);

    // Remove pins that are no longer selected
    pinRefs.current.forEach((value, key) => {
      if (!currentIds.has(key)) {
        mapView?.graphics.removeMany([value.outerGraphic, value.pinGraphic]);
        pinRefs.current.delete(key);
      }
    });

    // Add pins for newly selected
    dbPoints.forEach((pt) => {
      if (!currentIds.has(pt.id) || pinRefs.current.has(pt.id)) return;
      const res = createPin(pt as any, mapView as any, pt.omschrijving);
      pinRefs.current.set(pt.id, res);
    });
  }, [selectedPointIds, mapView, dbPoints]);

  // Hover handler (pins, blue points, and geometries)
  useHoverPointsAndGeometries({ pinRefs });

  // Cleanup all pins on unmount
  useEffect(() => {
    return () => {
      if (!mapView) return;
      const snapshot = new Map(pinRefs.current);
      snapshot.forEach(({ outerGraphic, pinGraphic }) => {
        mapView.graphics.removeMany([outerGraphic, pinGraphic]);
      });
      pinRefs.current.clear();
    };
  }, [mapView]);

  return (
    <ScrollButtonsLayout
      buttons={
        <Buttons
          selectedPointIds={selectedPointIds}
          selectedGeometryIds={selectedGeometryIds}
          update={update}
        />
      }
    >
      <WizardLoadingOverlay show={loading} variant="stacked" />

      <Header
        setSelectedPointIds={setSelectedPointIds}
        filteredPoints={filteredPoints}
        filter={filter}
        setFilter={setFilter}
      />

      <GeometriesList
        selectedGeometries={selectedGeometryIds}
        setSelectedGeometries={setSelectedGeometryIds}
        geometries={filteredGeometries}
      />

      <PointsList
        filteredPoints={filteredPoints}
        filter={filter}
        selectedPointIds={selectedPointIds}
        setSelectedPointIds={setSelectedPointIds}
      />
    </ScrollButtonsLayout>
  );
}
