/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "hooks/zustand/ui";
import SinglePlan from "./SinglePlan";
import Buttons from "./Buttons";
import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import {
  syncHoverQuadrantGraphics,
  syncSelectedQuadrantGraphics,
} from "./syncQuadrantGraphics";
import type { FlightPlanType } from "Types";

function syncHoverIfReady(input: {
  mapView: __esri.MapView | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  hoveredPoints: ReturnType<typeof useHoveredPlanState>["hoveredPoints"];
}) {
  if (!input.mapView || !input.graphicsLayerHover) return;
  syncHoverQuadrantGraphics({
    graphicsLayerHover: input.graphicsLayerHover,
    hoveredPoints: input.hoveredPoints,
  });
}

function syncSelectedIfReady(input: {
  selectedIndex: number;
  mapView: __esri.MapView | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  hoveredPoints: ReturnType<typeof useHoveredPlanState>["hoveredPoints"];
}) {
  if (input.selectedIndex <= 0 || !input.mapView || !input.graphicsLayerHover) {
    return;
  }
  syncSelectedQuadrantGraphics({
    graphicsLayer: input.graphicsLayer,
    graphicsLayerHover: input.graphicsLayerHover,
    hoveredPoints: input.hoveredPoints,
  });
}

function ViewPlanPlansList({
  filteredPlans,
}: {
  filteredPlans: FlightPlanType[] | null | undefined;
}) {
  if (!filteredPlans?.length) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-center text-gray-400 text-[12px]">
          Er zijn geen vluchtplannen om te bekijken.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y-2">
      {filteredPlans.map((plan, index) => (
        <SinglePlan key={index} index={index} plan={plan} />
      ))}
    </div>
  );
}

export default function Step1({
  handleCancel,
  setVluchtnummer,
}: {
  handleCancel: () => void;
  setVluchtnummer: (value: string) => void;
}) {
  const { hoveredPoints } = useHoveredPlanState();
  const { mapView, graphicsLayer, graphicsLayerHover } = useMapViewState();

  const { setFilterInput, filteredPlans, selectedIndex } = useViewPlanState();

  useEffect(() => {
    syncHoverIfReady({ mapView, graphicsLayerHover, hoveredPoints });
  }, [hoveredPoints, mapView]);

  useEffect(() => {
    syncSelectedIfReady({
      selectedIndex,
      mapView,
      graphicsLayer,
      graphicsLayerHover,
      hoveredPoints,
    });
  }, [selectedIndex]);

  return (
    <ScrollButtonsLayout
      buttons={
        <Buttons
          handleCancel={handleCancel}
          setVluchtnummer={setVluchtnummer}
        />
      }
      className="h-full"
      setFilterTerm={setFilterInput}
    >
      <div className="divide-y-2">
        <ViewPlanPlansList filteredPlans={filteredPlans} />
      </div>
    </ScrollButtonsLayout>
  );
}
