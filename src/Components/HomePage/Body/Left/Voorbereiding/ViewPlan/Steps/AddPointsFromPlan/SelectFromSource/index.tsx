/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import { useTemplateFlights } from "api-hooks/templateFlights";
import { useContent } from "hooks/useContent";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import PlansList from "./PlansList";
import PointsList from "./PointsList";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { useUpdateData } from "utils/useUpdateData";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import {
  buildPlanPointIdSet,
  filterPointsNotInPlan,
  mapSourceToItems,
  SelectFromSourceItem,
} from "./helpers/mapSourceItems";
import {
  buildSubmitSelectedPointsResult,
  findHoverableGraphic,
  PinRefMap,
  removeAllPins,
  removeBlueGraphics,
  syncPinsForSelection,
} from "./helpers/selectFromSourceGraphics";

type Source = "flightPlans" | "templates";

export default function SelectFromSource({ source }: { source: Source }) {
  const { user } = useAuth();
  const { selectedPlan } = useViewPlanState();
  const { dbPoints } = usePointsStore();
  const { data: flightPlansData, isPending: flightPlansPending } =
    useFlightPlansList(user.role, user.user_id, source === "flightPlans");
  const { data: templateData, isPending: templatePending } = useTemplateFlights(
    user.role,
    user.user_id,
    source === "templates"
  );

  const data = source === "flightPlans" ? flightPlansData ?? EMPTY_FLIGHT_PLANS : templateData;
  const dataLoading = source === "flightPlans" ? flightPlansPending : templatePending;

  const items = useMemo(() => mapSourceToItems(source, data), [data, source]);
  const planPointIds = useMemo(
    () => buildPlanPointIdSet(selectedPlan?.points),
    [selectedPlan?.points]
  );

  const [selectedItem, setSelectedItem] = useState<SelectFromSourceItem | null>(null);
  const [selectedPointIds, setSelectedPointIds] = useState<number[]>([]);

  useEffect(() => {
    if (!selectedItem) {
      setSelectedPointIds([]);
      return;
    }
    setSelectedPointIds(
      filterPointsNotInPlan(selectedItem.points, planPointIds).map((p) => p.id)
    );
  }, [selectedItem, planPointIds]);

  const { pointsGraphicsLayer, mapView } = useMapViewState();
  const pinRefs = useRef<PinRefMap>(new Map());
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  useEffect(() => {
    return () => {
      try {
        pointsGraphicsLayer?.removeAll();
      } catch {
        /* ignore */
      }
      blueGraphicsRef.current = removeBlueGraphics(mapView, blueGraphicsRef.current);
      removeAllPins(mapView, pinRefs.current);
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer]);

  useEffect(() => {
    blueGraphicsRef.current = removeBlueGraphics(mapView, blueGraphicsRef.current);
    pointsGraphicsLayer?.removeAll();
    removeAllPins(mapView, pinRefs.current);
  }, [selectedItem, mapView, pointsGraphicsLayer]);

  useEffect(() => {
    blueGraphicsRef.current = removeBlueGraphics(mapView, blueGraphicsRef.current);
    pointsGraphicsLayer?.removeAll();
    if (!selectedItem) return;

    const uncommonPoints = filterPointsNotInPlan(selectedItem.points, planPointIds);
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

    if (!graphics.length) return;

    if (pointsGraphicsLayer) {
      pointsGraphicsLayer.addMany(graphics as __esri.Graphic[]);
      return;
    }

    if (mapView) {
      mapView.graphics.addMany(graphics as __esri.Graphic[]);
      blueGraphicsRef.current = graphics;
    }
  }, [selectedItem, planPointIds, pointsGraphicsLayer, mapView]);

  useEffect(() => {
    if (!mapView || !selectedItem) return;
    syncPinsForSelection({
      mapView,
      selectedPointIds,
      itemPoints: selectedItem.points,
      dbPoints,
      pinRefs: pinRefs.current,
    });
  }, [selectedPointIds, selectedItem, mapView, dbPoints]);

  useEffect(() => {
    if (!mapView || !selectedItem) return;

    const handle = mapView.on("pointer-move", async (event) => {
      const hit = await mapView.hitTest(event);
      const graphic = findHoverableGraphic({
        hitResults: hit.results,
        pinRefs: pinRefs.current,
        pointsGraphicsLayer,
      });

      const { setHovered } = useHoveredGraphicState.getState();
      if (!graphic) {
        setHovered(null);
        return;
      }

      setHovered({
        id: graphic.attributes.id,
        label: graphic.attributes.label || graphic.attributes.omschrijving || "",
      });
    });

    return () => {
      handle.remove();
      useHoveredGraphicState.getState().setHovered(null);
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
      <WizardLoadingOverlay show={dataLoading || loading} variant="stacked" />

      {!dataLoading && !loading && !selectedItem && (
        <PlansList
          items={items}
          onSelect={(id) => {
            const item = items.find((i) => i.id === id);
            if (!item) return;

            setSelectedItem({
              id: item.id,
              title: item.title,
              points: filterPointsNotInPlan(item.points, planPointIds),
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

function Buttons({
  loading,
  selectedItem,
  setSelectedItem,
  selectedPointIds,
  update,
}: {
  loading: boolean;
  selectedItem: SelectFromSourceItem | null;
  setSelectedItem: (item: SelectFromSourceItem | null) => void;
  selectedPointIds: number[];
  update: ReturnType<typeof useUpdateData>["update"];
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
    if (!selectedPlan || !selectedItem) return;

    const checkedPoints = selectedItem.points.filter((pt) =>
      selectedPointIds.includes(pt.id)
    );

    const result = buildSubmitSelectedPointsResult({
      selectedPlan,
      checkedPoints,
      dbPoints,
      filteredPlans,
      yellowGraphicsLayer,
    });

    update(result.payload, () => {
      setSelectedPlan(result.updatedPlan);
      setPointsTable(result.updatedPoints);
      setGeometriesTable(selectedPlan.geometries || []);
      setFilteredPlans(result.updatedFilteredPlans);
      setSelectedItem(null);
      setStep(2);
    });
  }

  if (loading) return null;

  if (!selectedItem) {
    return (
      <WizardButtonBar
        className=""
        buttons={[{ label: content.common.vorige, onClick: () => setStep(2) }]}
      />
    );
  }

  return (
    <WizardButtonBar
      className=""
      buttons={[
        { label: content.common.vorige, onClick: () => setSelectedItem(null) },
        { label: content.common.opslaan, onClick: handleSubmit },
      ]}
    />
  );
}
