/* eslint-disable react-hooks/exhaustive-deps */
import { useContent } from "hooks/useContent";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useEffect } from "react";

export default function CurrentPointsList() {
  const { selectedPlan, currentPoints, setCurrentPoints } =
    useReuseFlightPlan();

  useEffect(() => {
    if (!selectedPlan) return;

    setCurrentPoints(selectedPlan?.points.flatMap((p) => p.id));
  }, [selectedPlan]);

  function handlePointChange(id: number) {
    if (currentPoints.includes(id)) {
      setCurrentPoints(currentPoints.filter((p) => p !== id));
    } else {
      setCurrentPoints([...currentPoints, id]);
    }
  }

  const content = useContent();

  return (
    <div>
      <p className="text-[12px] text-gray-700 pt-1.5">
        {content.voorbereiding.vluchtplanHergebruiken.step2.text1}
      </p>

      <p className="text-[12px] text-gray-700 pt-2">
        {content.voorbereiding.vluchtplanHergebruiken.step2.text2}
      </p>

      <div className="pr-2 mt-2 mb-4 pl-10">
        <div className="mt-2 border w-full border-gray-300 overflow-y-scroll">
          {selectedPlan?.points.map((point) => (
            <div
              key={point.id}
              onClick={() => handlePointChange(point.id)}
              className={`flex items-center cursor-pointer gap-x-2 px-1.5 pt-0.5 ${
                currentPoints.includes(point.id) ? "bg-gray-200" : ""
              }`}
            >
              <input
                type="checkbox"
                className="size-3 cursor-pointer"
                checked={currentPoints.includes(point.id)}
                onChange={() => handlePointChange(point.id)}
              />
              <label className="text-[12px] cursor-pointer">
                {point.omschrijving}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
