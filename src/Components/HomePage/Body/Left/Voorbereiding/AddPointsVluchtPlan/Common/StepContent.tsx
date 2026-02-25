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

  const displayedPoints = useMemo(
    () =>
      filteredPoints
        .filter((point) =>
          point.omschrijving.toLowerCase().includes(filterTerm.toLowerCase())
        )
        .filter(
          (point) =>
            !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
        ),
    [filteredPoints, filterTerm, selectedPlan]
  );

  const displayedGeometries = useMemo(
    () =>
      filteredGeometries
        .filter((geometry) =>
          geometry.omschrijving.toLowerCase().includes(filterTerm.toLowerCase())
        ),
    [filteredGeometries, filterTerm]
  );

  useEffect(() => {
    const herhalenValue = herhalen ? 1 : 0;

    setPoints(
      dbPoints
        .filter((point) => point.herhalen === herhalenValue)
        .filter(
          (point) =>
            !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
        )
    );

    setFilteredPoints(
      dbPoints
        .filter((point) => point.herhalen === herhalenValue)
        .filter(
          (point) =>
            !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
        )
    );

    const filteredGeometries = dbGeometries.filter((geometry) => {
      const geometryHerhalen =
        typeof geometry.herhalen === "number"
          ? geometry.herhalen === herhalenValue
          : typeof geometry.herhalen === "string"
            ? geometry.herhalen === String(herhalenValue)
            : geometry.herhalen === herhalen;
      return geometryHerhalen;
    });

    setGeometries(filteredGeometries);
    setFilteredGeometries(filteredGeometries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw blue points for filtered list
  useEffect(() => {
    if (mapView && blueGraphicsRef.current.length) {
      try {
        mapView.graphics.removeMany(blueGraphicsRef.current);
      } catch { }
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

    if (graphics.length) {
      if (pointsGraphicsLayer) {
        pointsGraphicsLayer.addMany(graphics as any);
      } else if (mapView) {
        mapView.graphics.addMany(graphics as any);
        blueGraphicsRef.current = graphics;
      }
    }
  }, [displayedPoints, mapView, pointsGraphicsLayer]);

  // Render geometries on the map
  useRenderLocalGeometries(displayedGeometries);

  // Hover handler for blue points and geometries on map only
  useHoverPointsAndGeometries({ checkMapContainer: true });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pointsGraphicsLayer?.removeAll();
      if (mapView && blueGraphicsRef.current.length) {
        try {
          mapView.graphics.removeMany(blueGraphicsRef.current);
        } catch { }
        blueGraphicsRef.current = [];
      }
      const { setHovered } = useHoveredGraphicState.getState();
      setHovered(null);
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

