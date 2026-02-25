/* eslint-disable react-hooks/exhaustive-deps */
import PointsList from "../Common/PointsList";
import GeometriesList from "../../FlightPlan/Common/GeometriesList";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Buttons from "./Buttons";
import Filter from "../Common/Filter";
import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import Header from "../Common/Header";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { useRenderLocalGeometries } from "hooks/features/useRenderLocalGeometries";
import { useHoverPointsAndGeometries } from "hooks/features/useHoverPointsAndGeometries";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";

dayjs.extend(isBetween);

export default function Step3() {
  const { setPoints, dbPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const { mapView, pointsGraphicsLayer } = useMapViewState();

  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGeometries, setSelectedGeometries] = useState<number[]>([]);
  const [filteredGeometries, setFilteredGeometries] = useState<Geometry[]>([]);

  const {
    selectedPoints2,
    setSelectedPoints2,
    openFilter,
    setOpenFilter,
    filteredPoints,
    setFilteredPoints,
    selectedPlan,
  } = useAddPointStates();

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
    setPoints(
      dbPoints
        .filter((point) => point.herhalen === 0)
        .filter(
          (point) =>
            !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
        )
    );

    setFilteredPoints(
      dbPoints
        .filter((point) => point.herhalen === 0)
        .filter(
          (point) =>
            !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
        )
    );

    const notHerhalenGeometries = dbGeometries.filter((geometry) => {
      const herhalenValue =
        typeof geometry.herhalen === "number"
          ? geometry.herhalen === 0
          : typeof geometry.herhalen === "string"
            ? geometry.herhalen === "0"
            : geometry.herhalen === false;
      return herhalenValue;
    });

    setGeometries(notHerhalenGeometries);
    setFilteredGeometries(notHerhalenGeometries);
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
            herhalen={false}
            filterTerm={filterTerm}
            setFilterTerm={setFilterTerm}
            selectedGeometries={selectedGeometries}
            setSelectedGeometries={setSelectedGeometries}
            filteredGeometries={filteredGeometries}
          />

          <ScrollButtonsLayout buttons={<Buttons />}>
            <GeometriesList
              selectedGeometries={selectedGeometries}
              setSelectedGeometries={setSelectedGeometries}
              geometries={displayedGeometries}
            />
            <PointsList
              selectedPoints={selectedPoints2}
              setSelectedPoints={setSelectedPoints2}
              points={displayedPoints}
            />
          </ScrollButtonsLayout>
        </>
      )}

      {openFilter && (
        <Filter
          herhalen={false}
          setOpenFilter={setOpenFilter}
          setFilteredPoints={setFilteredPoints}
        />
      )}
    </div>
  );
}
