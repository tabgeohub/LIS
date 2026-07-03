/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { useRenderLocalGeometries } from "hooks/features/useRenderLocalGeometries";
import { useHoverPointsAndGeometries } from "hooks/features/useHoverPointsAndGeometries";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";
import PointsList from "../Common/PointsList";
import GeometriesList from "../../FlightPlan/Common/GeometriesList";
import Header from "../Common/Header";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";
import Filter from "../Common/Filter";
import {
  filterDisplayedGeometries,
  filterDisplayedPoints,
  filterPointsForStepContent,
  matchesHerhalenValue,
} from "./stepContentFilters";

interface StepContentProps {
  herhalen: boolean;
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  filteredPoints: any[];
  setFilteredPoints: (value: any[]) => void;
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
  selectedPlan: any;
  buttons: React.ReactNode;
}

export default function StepContent({
  herhalen,
  selectedPoints,
  setSelectedPoints,
  filteredPoints,
  setFilteredPoints,
  openFilter,
  setOpenFilter,
  selectedPlan,
  buttons,
}: StepContentProps) {
  const { setPoints, dbPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const { mapView, pointsGraphicsLayer } = useMapViewState();

  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGeometries, setSelectedGeometries] = useState<number[]>([]);
  const [filteredGeometries, setFilteredGeometries] = useState<Geometry[]>([]);
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  const selectedPlanPointIds = useMemo(
    () => selectedPlan?.points?.map((p: { id: number }) => p.id) ?? [],
    [selectedPlan?.points]
  );

  const displayedPoints = useMemo(
    () =>
      filterDisplayedPoints({
        points: filteredPoints,
        filterTerm,
        selectedPlanPointIds,
      }),
    [filteredPoints, filterTerm, selectedPlanPointIds]
  );

  const displayedGeometries = useMemo(
    () => filterDisplayedGeometries(filteredGeometries, filterTerm),
    [filteredGeometries, filterTerm]
  );

  useEffect(() => {
    const availablePoints = filterPointsForStepContent({
      dbPoints,
      herhalen,
      selectedPlanPointIds,
    });
    setPoints(availablePoints);
    setFilteredPoints(availablePoints);

    const nextGeometries = dbGeometries.filter((geometry) =>
      matchesHerhalenValue(geometry.herhalen, herhalen)
    );
    setGeometries(nextGeometries);
    setFilteredGeometries(nextGeometries);
  }, []);

  useEffect(() => {
    if (mapView && blueGraphicsRef.current.length) {
      try {
        mapView.graphics.removeMany(blueGraphicsRef.current);
      } catch {
        /* ignore */
      }
      blueGraphicsRef.current = [];
    }
    pointsGraphicsLayer?.removeAll();

    if (!displayedPoints.length) return;

    const graphics = createPointGraphics(displayedPoints, {
      symbolOptions: {
        color: "blue",
        size: 10,
        style: "circle",
        outlineColor: "white",
        outlineWidth: 1,
      },
      transformCoordinates: true,
    });

    if (!graphics.length) return;

    if (pointsGraphicsLayer) {
      pointsGraphicsLayer.addMany(graphics as __esri.Graphic[]);
    } else if (mapView) {
      mapView.graphics.addMany(graphics as __esri.Graphic[]);
      blueGraphicsRef.current = graphics;
    }
  }, [displayedPoints, mapView, pointsGraphicsLayer]);

  useRenderLocalGeometries(displayedGeometries);
  useHoverPointsAndGeometries({ checkMapContainer: true });

  useEffect(() => {
    return () => {
      pointsGraphicsLayer?.removeAll();
      if (mapView && blueGraphicsRef.current.length) {
        try {
          mapView.graphics.removeMany(blueGraphicsRef.current);
        } catch {
          /* ignore */
        }
        blueGraphicsRef.current = [];
      }
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer]);

  return (
    <div className="p-1.5 h-full">
      {!openFilter && (
        <>
          <Header
            herhalen={herhalen}
            filterTerm={filterTerm}
            setFilterTerm={setFilterTerm}
            selectedGeometries={selectedGeometries}
            setSelectedGeometries={setSelectedGeometries}
            filteredGeometries={filteredGeometries}
          />

          <ScrollButtonsLayout buttons={buttons}>
            <GeometriesList
              selectedGeometries={selectedGeometries}
              setSelectedGeometries={setSelectedGeometries}
              geometries={displayedGeometries}
            />
            <PointsList
              selectedPoints={selectedPoints}
              setSelectedPoints={setSelectedPoints}
              points={displayedPoints}
            />
          </ScrollButtonsLayout>
        </>
      )}

      {openFilter && (
        <Filter
          herhalen={herhalen}
          setOpenFilter={setOpenFilter}
          setFilteredPoints={setFilteredPoints}
        />
      )}
    </div>
  );
}
