/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Buttons from "./Buttons";
import PointsList from "../Common/PointsList";
import GeometriesList from "../../FlightPlan/Common/GeometriesList";
import Filter from "../Common/Filter";
import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import Header from "../Common/Header";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import Graphic from "@arcgis/core/Graphic";
import EsriPoint from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { useRenderLocalGeometries } from "hooks/features/useRenderLocalGeometries";
import { useHoverPointsAndGeometries } from "hooks/features/useHoverPointsAndGeometries";

dayjs.extend(isBetween);

export default function Step2() {
  const { setPoints, dbPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const { mapView, pointsGraphicsLayer } = useMapViewState();

  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGeometries, setSelectedGeometries] = useState<number[]>([]);
  const [filteredGeometries, setFilteredGeometries] = useState<Geometry[]>([]);

  const {
    selectedPoints,
    setSelectedPoints,
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
        .filter((point) => point.herhalen === 1)
        .filter(
          (point) =>
            !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
        )
    );

    setFilteredPoints(
      dbPoints
        .filter((point) => point.herhalen === 1)
        .filter(
          (point) =>
            !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
        )
    );

    const herhalenGeometries = dbGeometries.filter((geometry) => {
      const herhalenValue =
        typeof geometry.herhalen === "number"
          ? geometry.herhalen === 1
          : typeof geometry.herhalen === "string"
            ? geometry.herhalen === "1"
            : geometry.herhalen === true;
      return herhalenValue;
    });

    setGeometries(herhalenGeometries);
    setFilteredGeometries(herhalenGeometries);
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

    const blueSymbol = new SimpleMarkerSymbol({
      color: "blue",
      size: 10,
      style: "circle",
      outline: { color: "white", width: 1 },
    });

    const graphics: __esri.Graphic[] = [];
    displayedPoints.forEach((pt) => {
      let lon: number | undefined = (pt as any).longitude;
      let lat: number | undefined = (pt as any).latitude;
      if (
        (typeof lon !== "number" || typeof lat !== "number") &&
        typeof (pt as any).xcoordinaat_rd === "number" &&
        typeof (pt as any).ycoordinaat_rd === "number"
      ) {
        const wgs = getTransformedCoordinates(
          "RD",
          "WGS84",
          (pt as any).xcoordinaat_rd,
          (pt as any).ycoordinaat_rd
        );
        lon = wgs.x;
        lat = wgs.y;
      }
      if (typeof lon !== "number" || typeof lat !== "number") return;

      graphics.push(
        new Graphic({
          geometry: new EsriPoint({
            longitude: lon,
            latitude: lat,
            spatialReference: { wkid: 4326 },
          }),
          symbol: blueSymbol,
          attributes: { id: pt.id, omschrijving: pt.omschrijving },
        })
      );
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
            herhalen={true}
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
              selectedPoints={selectedPoints}
              setSelectedPoints={setSelectedPoints}
              points={displayedPoints}
            />
          </ScrollButtonsLayout>
        </>
      )}

      {openFilter && (
        <Filter
          herhalen={true}
          setOpenFilter={setOpenFilter}
          setFilteredPoints={setFilteredPoints}
        />
      )}
    </div>
  );
}
