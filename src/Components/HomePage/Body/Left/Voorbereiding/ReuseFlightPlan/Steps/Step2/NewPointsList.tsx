import createYellowBorder from "@helpers/ArcGISHelpers/createYellowBorder";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import usePointClick from "hooks/hover-click-handlers/usePointClick";
import { useContent } from "hooks/useContent";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useEffect } from "react";

export default function NewPointsList() {
  const { selectedPlan, newPoints, setNewPoints } = useReuseFlightPlan();
  const { graphicsLayer } = useMapViewState();
  const { dbPoints } = usePointsStore();

  usePointClick(dbPoints.filter((point) => newPoints.includes(point.id)));

  const herhalenPoints = dbPoints?.filter((point) => point.herhalen);

  function handlePointChange(id: number) {
    if (newPoints.includes(id)) {
      setNewPoints(newPoints.filter((p) => p !== id));
    } else {
      setNewPoints([...newPoints, id]);
    }
  }

  useEffect(() => {
    const pointsToCircle = herhalenPoints?.filter(
      (point) => !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
    );

    if (pointsToCircle && graphicsLayer) {
      graphicsLayer.graphics.removeAll();

      pointsToCircle.forEach((point) => {
        const outerGraphic = createYellowBorder(point);

        graphicsLayer.add(outerGraphic);
      });
    }
  }, [herhalenPoints, selectedPlan, graphicsLayer]);

  const content = useContent();

  return (
    <>
      <p className="text-[12px] text-gray-700">
        {content.voorbereiding.vluchtplanHergebruiken.step2.text3}
      </p>

      <div className="pr-2 mt-2 mb-4 pl-10">
        <div className="mt-2 border w-full border-gray-300 overflow-y-scroll">
          {herhalenPoints
            ?.filter(
              (point) =>
                !selectedPlan?.points.flatMap((p) => p.id).includes(point.id)
            )
            ?.map((point) => (
              <div
                key={point.id}
                onClick={() => handlePointChange(point.id)}
                className={`flex cursor-pointer items-center gap-x-2 px-1.5 pt-0.5 ${
                  newPoints.includes(point.id) ? "bg-gray-200" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="size-3 cursor-pointer"
                  checked={newPoints.includes(point.id)}
                  onChange={() => handlePointChange(point.id)}
                />

                <label className="text-[12px] cursor-pointer">
                  {point.omschrijving}
                </label>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
