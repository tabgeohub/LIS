/* eslint-disable react-hooks/exhaustive-deps */
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { useReadData } from "utils/useReadData";

export default function Step2() {
  const logAction = useLogAction();

  const { mapView } = useMapViewState();
  const { selectedPlan, selectedPoints, setSelectedPoints, setSelectedPlan } =
    useCreateReportState();

  const { points, setPoints } = usePointsStore();

  const { data: finishedPlan } = useReadData<FinishedFlightPlanType>(
    "/finished_plans/getSingleFinishedFlightPlan/" + selectedPlan?.id
  );

  useEffect(() => {
    const planPointsIds = selectedPlan?.points_data.flatMap(
      (point) => point.id
    );

    const filteredPoints = points.filter((point) =>
      planPointsIds?.includes(point.id)
    );

    setPoints(filteredPoints);
  }, []);

  function handleHoveredPoint(point: FinishedPointType) {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes.label === "hovered-point")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    createPin(point, mapView!, "hovered-point");
  }

  function handleRemoveHoverePoint() {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes.label === "hovered-point")

      .forEach((graphic) => mapView.graphics.remove(graphic));
  }

  function handleSelectPoint(point: FinishedPointType) {
    if (!mapView) return;

    if (selectedPoints.includes(point.id)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== point.id));
    } else {
      setSelectedPoints([...selectedPoints, point.id]);
    }
  }

  useDrawYellowMarkers({
    selectedPointIds: selectedPoints,
    points: selectedPlan?.points_data || [],
  });

  useEffect(() => {
    if (!mapView || !selectedPlan) return;

    mapView.graphics.removeAll();

    if (selectedPoints.length > 0) {
      selectedPlan.points_data
        .filter((point) => selectedPoints.includes(point.id))
        .forEach((point) => {
          createPin(point, mapView);
        });
    }

    logAction({
      message: "User selected points",
      step: "First step",
      newData: {
        points: selectedPoints,
      },
    });
  }, [selectedPoints]);

  useEffect(() => {
    if (!finishedPlan) return;

    setSelectedPlan(finishedPlan);
  }, [finishedPlan]);

  if (!selectedPlan) return;

  function handleSelectAll() {
    setSelectedPoints(
      selectedPlan?.points_data.flatMap((point) => point.id) as number[]
    );
  }

  function handleSelectNone() {
    setSelectedPoints([]);
  }

  return (
    <div className="space-y-[1px]">
      <div className="text-[13px] ml-4 flex text-blue-500 items-center gap-x-2 mt-2 font-medium">
        <button onClick={handleSelectAll}>Selecteer alle</button>

        <div className="h-[16px] w-[1px] bg-blue-300" />

        <button onClick={handleSelectNone}>Selecteer geen</button>
      </div>

      {selectedPlan.points_data.map((point) => (
        <div
          className={`flex items-center space-x-3 p-2 py-1 hover:bg-gray-100 transition-all duration-300 ${
            selectedPoints.includes(point.id) && "bg-gray-200"
          }`}
          key={point.id}
          onMouseEnter={() => handleHoveredPoint(point)}
          onMouseLeave={handleRemoveHoverePoint}
        >
          <input
            type="checkbox"
            className="h-[12px] w-[12px] cursor-pointer"
            onClick={() => handleSelectPoint(point)}
            checked={selectedPoints.includes(point.id)}
          />
          <div
            onClick={() => setSelectedPoints([point.id])}
            className="flex items-center space-x-1 w-full cursor-pointer"
          >
            <FaMapMarkedAlt className="size-4 text-blue-500" />
            <p>{point.omschrijving}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
