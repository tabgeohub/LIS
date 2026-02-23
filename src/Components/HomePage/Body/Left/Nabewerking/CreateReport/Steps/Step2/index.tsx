/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useReadData } from "utils/useReadData";
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";
import { useRenderPoints } from "./hooks/useRenderPoints";
import { useRenderGeometries } from "./hooks/useRenderGeometries";
import Points from "./Points";
import Geometries from "./Geometries";

export default function Step2() {
  const {
    selectedPlan,
    selectedPoints,
    setSelectedPoints,
    selectedGeometries,
    setSelectedGeometries,
    setSelectedPlan,
  } = useCreateReportState();

  const { points, setPoints } = usePointsStore();

  const { data: finishedPlan } = useReadData<FinishedFlightPlanType>(
    "/finished_plans/getSingleFinishedFlightPlan/" + selectedPlan?.id
  );

  // Filter points to only show plan points
  useEffect(() => {
    const planPointsIds = selectedPlan?.points_data.flatMap(
      (point) => point.id
    );

    const filteredPoints = points.filter((point) =>
      planPointsIds?.includes(point.id)
    );

    setPoints(filteredPoints);
  }, []);

  // Render points on map
  useRenderPoints(selectedPlan, selectedPoints);

  // Render geometries on map
  useRenderGeometries(selectedPlan, selectedGeometries);

  // Draw yellow markers for selected points
  useDrawYellowMarkers({
    selectedPointIds: selectedPoints,
    points: selectedPlan?.points_data || [],
  });

  // Update selected plan when finished plan data is loaded
  useEffect(() => {
    if (!finishedPlan) return;
    setSelectedPlan(finishedPlan);
  }, [finishedPlan, setSelectedPlan]);

  if (!selectedPlan) return null;

  function handleSelectPoint(point: { id: number }) {
    if (selectedPoints.includes(point.id)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== point.id));
    } else {
      setSelectedPoints([...selectedPoints, point.id]);
    }
  }

  function handleSelectGeometry(geometry: { id: number }) {
    if (selectedGeometries.includes(geometry.id)) {
      setSelectedGeometries(
        selectedGeometries.filter((g) => g !== geometry.id)
      );
    } else {
      setSelectedGeometries([...selectedGeometries, geometry.id]);
    }
  }

  function handleSelectAll() {
    setSelectedPoints(
      selectedPlan?.points_data.flatMap((point) => point.id) as number[]
    );
    setSelectedGeometries(
      selectedPlan?.geometries?.flatMap((geometry) => geometry.id) || []
    );
  }

  function handleSelectNone() {
    setSelectedPoints([]);
    setSelectedGeometries([]);
  }

  return (
    <div className="space-y-[1px]">
      <div className="text-[13px] ml-4 flex text-blue-500 items-center gap-x-2 mt-2 font-medium">
        <button onClick={handleSelectAll}>Selecteer alle</button>

        <div className="h-[16px] w-[1px] bg-blue-300" />

        <button onClick={handleSelectNone}>Selecteer geen</button>
      </div>

      {/* Points */}
      <Points
        points={selectedPlan.points_data}
        selectedPoints={selectedPoints}
        onSelectPoint={handleSelectPoint}
        onFocusPoint={(pointId) => setSelectedPoints([pointId])}
      />

      {/* Geometries */}
      <Geometries
        geometries={selectedPlan.geometries || []}
        selectedGeometries={selectedGeometries}
        onSelectGeometry={handleSelectGeometry}
        onFocusGeometry={(geometryId) => setSelectedGeometries([geometryId])}
      />
    </div>
  );
}
