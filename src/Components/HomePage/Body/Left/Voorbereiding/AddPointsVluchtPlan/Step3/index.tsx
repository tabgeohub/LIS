/* eslint-disable react-hooks/exhaustive-deps */
import PointsList from "../Common/PointsList";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Buttons from "./Buttons";
import Filter from "../Common/Filter";
import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import Header from "../Common/Header";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import Graphic from "@arcgis/core/Graphic";
import EsriPoint from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

dayjs.extend(isBetween);

export default function Step3() {
  const { setPoints, dbPoints } = usePointsStore();
  const { mapView, pointsGraphicsLayer } = useMapViewState();

  const [filterTerm, setFilterTerm] = useState("");

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
  }, []);

  // Draw blue points for filtered list
  useEffect(() => {
    if (mapView && blueGraphicsRef.current.length) {
      try {
        mapView.graphics.removeMany(blueGraphicsRef.current);
      } catch {}
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

  // Hover handler for blue points on map only
  useEffect(() => {
    if (!mapView) return;
    const { setHovered } = useHoveredGraphicState.getState();

    const handle = mapView.on("pointer-move", async (event) => {
      // Check if the event target is within the map view container
      const target = event.native.target as HTMLElement;
      const mapContainer = mapView.container;
      if (!mapContainer || !mapContainer.contains(target)) {
        return; // Mouse is not over the map, don't interfere with list hover
      }

      const hit: any = await mapView.hitTest(event);
      const res: any[] = hit?.results || [];
      const g: any = res.find((r: any) => {
        const gr = r?.graphic;
        if (!gr?.attributes) return false;
        const isBluePoint =
          !!pointsGraphicsLayer && gr.layer === pointsGraphicsLayer;
        return isBluePoint;
      })?.graphic;

      if (g) {
        setHovered({
          id: g.attributes.id,
          label: g.attributes.omschrijving || "",
        });
      } else {
        // Only clear if mouse is actually over map and not over a graphic
        setHovered(null);
      }
    });

    return () => {
      handle.remove();
    };
  }, [mapView, pointsGraphicsLayer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pointsGraphicsLayer?.removeAll();
      if (mapView && blueGraphicsRef.current.length) {
        try {
          mapView.graphics.removeMany(blueGraphicsRef.current);
        } catch {}
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
          />

          <ScrollButtonsLayout buttons={<Buttons />}>
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
