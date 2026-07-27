/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import SinglePlan from "./SinglePlan";
import Buttons from "./Buttons";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import {
  syncHoverQuadrantGraphics,
  syncSelectedQuadrantGraphics,
} from "./syncQuadrantGraphics";

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
    if (!mapView || !graphicsLayerHover) return;
    syncHoverQuadrantGraphics({ graphicsLayerHover, hoveredPoints });
  }, [hoveredPoints, mapView]);

  useEffect(() => {
    if (selectedIndex <= 0 || !mapView || !graphicsLayerHover) return;
    syncSelectedQuadrantGraphics({ graphicsLayer, graphicsLayerHover, hoveredPoints });
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
        {!filteredPlans || filteredPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-center text-gray-400 text-[12px]">
              Er zijn geen vluchtplannen om te bekijken.
            </p>
          </div>
        ) : (
          <div className="divide-y-2">
            {filteredPlans?.map((plan, index) => (
              <SinglePlan key={index} index={index} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </ScrollButtonsLayout>
  );
}
