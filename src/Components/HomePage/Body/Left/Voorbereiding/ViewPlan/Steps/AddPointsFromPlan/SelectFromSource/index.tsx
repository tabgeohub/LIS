/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import { useTemplateFlights } from "api-hooks/templateFlights";
import { useContent } from "hooks/useContent";
import { useViewPlanState } from "../../../helpers/useViewPlanState";
import PlansList from "./PlansList";
import PointsList from "./PointsList";
import { FlightPlanType } from "Types";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { useUpdateData } from "utils/useUpdateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { usePointsStore } from "hooks/features/usePointsStore";
import Point from "@arcgis/core/geometry/Point";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";

type Source = "flightPlans" | "templates";

type ItemPoint = {
  id: number;
  omschrijving: string;
  longitude?: number;
  latitude?: number;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
};
type ItemModel = { id: number; title: string; points: ItemPoint[] };

type TemplatePoint = { id: number; omschrijving: string };
type Template = { id: number; name: string; points: TemplatePoint[] };

export default function SelectFromSource({ source }: { source: Source }) {
  const { user } = useAuth();

  const { selectedPlan } = useViewPlanState();
  const { dbPoints } = usePointsStore();
  const { data: flightPlansData, isPending: flightPlansPending } =
    useFlightPlansList(user.role, user.user_id, source === "flightPlans");

  const flightPlans = flightPlansData ?? EMPTY_FLIGHT_PLANS;

  const { data: templateData, isPending: templatePending } = useTemplateFlights(
    user.role,
    user.user_id,
    source === "templates"
  );

  const data =
    source === "flightPlans"
      ? (flightPlans as FlightPlanType[] | Template[])
      : templateData;
  const dataLoading =
    source === "flightPlans" ? flightPlansPending : templatePending;

  const items: ItemModel[] = useMemo(() => {
    if (!data) return [];
    if (source === "flightPlans") {
      const list = data as FlightPlanType[];

      return list.map((p) => ({
        id: p.id,
        title: p.vluchtnummer,
        points:
          (p.pointsObjects?.length ? p.pointsObjects : p.points)?.map((pt) => ({
            id: pt.id,
            omschrijving: pt.omschrijving,
            longitude: pt.longitude,
            latitude: pt.latitude,
            xcoordinaat_rd: pt.xcoordinaat_rd,
            ycoordinaat_rd: pt.ycoordinaat_rd,
          })) || [],
      }));
    }
    const list = data as Template[];
    return list.map((t) => ({
      id: t.id,
      title: t.name,
      points:
        (t.points || []).map((pt) => ({
          id: pt.id,
          omschrijving: pt.omschrijving,
          // templates may not include WGS84; RD may be available in some contexts
          // keep as-is; we'll transform if RD present
          // @ts-ignore optional fields
          xcoordinaat_rd: (pt as any).xcoordinaat_rd,
          // @ts-ignore
          ycoordinaat_rd: (pt as any).ycoordinaat_rd,
          // @ts-ignore
          longitude: (pt as any).longitude,
          // @ts-ignore
          latitude: (pt as any).latitude,
        })) || [],
    }));
  }, [data, source]);

  const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);
  const [selectedPointIds, setSelectedPointIds] = useState<number[]>([]);

  useEffect(() => {
    if (!selectedItem) {
      setSelectedPointIds([]);
      return;
    }

    const uncommonPoints = selectedItem.points.filter(
      (pt) => !selectedPlan?.points.some((p) => p.id === pt.id)
    );

    setSelectedPointIds(uncommonPoints.map((p) => p.id));
  }, [selectedItem, selectedPlan?.points]);

  const { pointsGraphicsLayer, mapView } = useMapViewState();

  const pinRefs = useRef<
    Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>
  >(new Map());
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  // Global cleanup on unmount (e.g., when changing tabs)
  useEffect(() => {
    return () => {
      try {
        pointsGraphicsLayer?.removeAll();
      } catch { }
      const blueToRemove = [...blueGraphicsRef.current];
      if (mapView && blueToRemove.length) {
        try {
          mapView.graphics.removeMany(blueToRemove);
        } catch { }
        blueGraphicsRef.current = [];
      }
      const pinSnapshot = new Map(pinRefs.current);
      if (mapView && pinSnapshot.size) {
        try {
          pinSnapshot.forEach(({ outerGraphic, pinGraphic }) => {
            mapView.graphics.removeMany([outerGraphic, pinGraphic]);
          });
        } catch { }
        pinRefs.current.clear();
      }
      const { setHovered } = useHoveredGraphicState.getState();
      setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer]);

  // Clear layer and all existing pins when changing selection or going back
  useEffect(() => {
    // remove previously drawn blue point graphics (from either target)
    if (mapView && blueGraphicsRef.current.length) {
      try {
        mapView.graphics.removeMany(blueGraphicsRef.current);
      } catch { }
      blueGraphicsRef.current = [];
    }
    pointsGraphicsLayer?.removeAll();
    if (!mapView) return;
    // remove any existing pins
    pinRefs.current.forEach(({ outerGraphic, pinGraphic }) => {
      mapView.graphics.removeMany([outerGraphic, pinGraphic]);
    });
    pinRefs.current.clear();
  }, [selectedItem, mapView, pointsGraphicsLayer]);

  // Draw blue points for current selected item
  useEffect(() => {
    // clear previous blue points
    if (mapView && blueGraphicsRef.current.length) {
      try {
        mapView.graphics.removeMany(blueGraphicsRef.current);
      } catch { }
      blueGraphicsRef.current = [];
    }
    pointsGraphicsLayer?.removeAll();

    if (!selectedItem) return;

    const uncommonPoints = selectedItem.points.filter(
      (pt) => !selectedPlan?.points.some((p) => p.id === pt.id)
    );

    const graphics = createPointGraphics(uncommonPoints, {
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
  }, [selectedItem, pointsGraphicsLayer, mapView]);

  // Sync pins with selected checkboxes
  useEffect(() => {
    if (!mapView || !selectedItem) return;

    const currentIds = new Set(selectedPointIds);
    // remove pins that are no longer selected
    pinRefs.current.forEach((value, key) => {
      if (!currentIds.has(key)) {
        mapView.graphics.removeMany([value.outerGraphic, value.pinGraphic]);
        pinRefs.current.delete(key);
      }
    });

    // add pins for newly selected - enrich with full point data from dbPoints
    selectedItem.points.forEach((pt) => {
      if (!currentIds.has(pt.id) || pinRefs.current.has(pt.id)) return;

      // Get full point data from dbPoints to ensure we have coordinates
      const fullPoint = dbPoints.find((dbPt) => dbPt.id === pt.id);
      if (!fullPoint) return;

      const coords = getPointCoordinates(fullPoint);
      if (coords) {
        const fakePoint: any = {
          id: fullPoint.id,
          longitude: coords.longitude,
          latitude: coords.latitude,
        };
        const res = createPin(fakePoint, mapView, fullPoint.omschrijving);
        pinRefs.current.set(fullPoint.id, res);
      }
    });
  }, [selectedPointIds, selectedItem, mapView, dbPoints]);

  // Hover listener to show point name (custom popup)
  useEffect(() => {
    if (!mapView || !selectedItem) return;

    const { setHovered } = useHoveredGraphicState.getState();

    const handle = mapView.on("pointer-move", async (event) => {
      const hit: any = await mapView.hitTest(event);

      const res: any[] = hit?.results || [];

      const g: any = res.find((r: any) => {
        const gr = r?.graphic;
        if (!gr?.attributes) return false;
        const id = gr.attributes.id;
        const isPin = typeof id === "number" && pinRefs.current.has(id);
        const isBluePoint =
          !!pointsGraphicsLayer && gr.layer === pointsGraphicsLayer;
        return isPin || isBluePoint;
      })?.graphic;

      if (g) {
        setHovered({
          id: g.attributes.id,
          label: g.attributes.label || g.attributes.omschrijving || "",
        });
      } else {
        setHovered(null);
      }
    });

    return () => {
      handle.remove();
      const { setHovered } = useHoveredGraphicState.getState();
      setHovered(null);
    };
  }, [mapView, selectedItem, pointsGraphicsLayer]);

  const { update, loading } = useUpdateData(`/flightPlans/vluchtplans/points`);

  return (
    <ScrollButtonsLayout
      className="pt-16"
      buttons={
        <Buttons
          loading={loading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          selectedPointIds={selectedPointIds}
          update={update}
        />
      }
    >
      <Loading loading={dataLoading || loading} />

      {!dataLoading && !loading && !selectedItem && (
        <PlansList
          items={items}
          onSelect={(id) => {
            const item = items.find((i) => i.id === id) || null;

            if (!item) return;

            const uncommonPoints = item.points.filter(
              (pt) => !selectedPlan?.points.some((p) => p.id === pt.id)
            );

            setSelectedItem({
              id: item?.id || 0,
              title: item?.title || "",
              points: uncommonPoints,
            });
          }}
        />
      )}

      {!dataLoading && !loading && selectedItem && (
        <PointsList
          selectedItem={selectedItem}
          selectedPointIds={selectedPointIds}
          setSelectedPointIds={setSelectedPointIds}
        />
      )}
    </ScrollButtonsLayout>
  );
}

function Loading({ loading }: { loading: boolean }) {
  return (
    <>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full ">
          <div className="relative h-full w-full">
            <div className="absolute top-0 left-0 h-full w-full bg-gray-500/20 bg-opacity-50 z-10" />

            <div className="absolute top-[30%] left-[50%] translate-x-[-50%] z-20">
              <LoadingBars />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Buttons({
  loading,
  selectedItem,
  setSelectedItem,
  selectedPointIds,
  update,
}: {
  loading: boolean;
  selectedItem: ItemModel | null;
  setSelectedItem: (item: ItemModel | null) => void;
  selectedPointIds: number[];
  update: any;
}) {
  const content = useContent();
  const {
    selectedPlan,
    setSelectedPlan,
    setStep,
    filteredPlans,
    setFilteredPlans,
  } = useViewPlanState();
  const { dbPoints } = usePointsStore();
  const { yellowGraphicsLayer } = useMapViewState();
  const { setPointsTable, setGeometriesTable } = useOpenTable();

  function handleSubmit() {
    if (!selectedPlan) return;

    const checkedPoints = selectedItem?.points.filter((pt) =>
      selectedPointIds.includes(pt.id)
    );

    const mergedPointsIds = [
      ...(selectedPlan.points.flatMap((p) => p.id) || []),
      ...(checkedPoints?.flatMap((p) => p.id) || []),
    ];
    const uniqueIds = Array.from(new Set(mergedPointsIds));

    update(
      {
        points: uniqueIds,
        id: selectedPlan?.id,
      },
      () => {
        const updatedPoints = dbPoints.filter((p) => uniqueIds.includes(p.id));

        setSelectedPlan({
          ...selectedPlan,
          points: updatedPoints,
          pointsObjects: updatedPoints,
        });

        setPointsTable(updatedPoints);
        setGeometriesTable(selectedPlan.geometries || []);

        // Add yellow points to the map from checkedPoints array
        checkedPoints?.forEach((selectedPoint) => {
          const yellow = new SimpleMarkerSymbol({
            color: "yellow",
            size: 12,
            style: "circle",
            outline: {
              color: "white",
              width: 1,
            },
          });

          // Prefer WGS84 if available; otherwise convert RD -> WGS84
          const coords = getPointCoordinates(selectedPoint as any);
          if (!coords) return;

          const geometry = new Point({
            longitude: coords.longitude,
            latitude: coords.latitude,
            spatialReference: { wkid: 4326 },
          });

          const graphic = new Graphic({
            geometry,
            symbol: yellow,
            attributes: selectedPoint,
          });

          yellowGraphicsLayer?.add(graphic);
        });

        // Update only plan with id === selectedPlan?.id inside filteredPlans
        setFilteredPlans(
          filteredPlans.map((p) => ({
            ...p,
            points: p.id === selectedPlan?.id ? updatedPoints : p.points,
            pointsObjects:
              p.id === selectedPlan?.id ? updatedPoints : p.pointsObjects,
          }))
        );

        setSelectedItem(null);
        setStep(2);
      }
    );
  }

  return (
    <>
      {!loading && !selectedItem && (
        <button className="gray-button" onClick={() => setStep(2)}>
          {content.common.vorige}
        </button>
      )}

      {!loading && selectedItem && (
        <>
          <button className="gray-button" onClick={() => setSelectedItem(null)}>
            {content.common.vorige}
          </button>
          <button className="gray-button" onClick={handleSubmit}>
            {content.common.opslaan}
          </button>
        </>
      )}
    </>
  );
}
