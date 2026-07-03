/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useRenderLocalGeometries } from "hooks/features/useRenderLocalGeometries";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { useUpdateData } from "utils/useUpdateData";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import PointsList from "./PointsList";
import GeometriesList from "../../../FlightPlan/Common/GeometriesList";
import {
  useAddPointToPlanBluePoints,
  useAddPointToPlanPins,
} from "./useAddPointToPlanMapEffects";

export default function AddPointToPlan() {
  const { dbPoints } = usePointsStore();
  const { dbGeometries } = useGeometriesStore();
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
    [dbPoints, selectedPlan]
  );

  const filteredGeometries = useMemo(
    () =>
      dbGeometries.filter(
        (geometry) =>
          !selectedPlan?.geometries?.some((g) => g.id === geometry.id)
      ),
    [dbGeometries, selectedPlan]
  );

  useAddPointToPlanBluePoints(filteredPoints);
  useRenderLocalGeometries(filteredGeometries);
  useAddPointToPlanPins(selectedPointIds, dbPoints);

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
