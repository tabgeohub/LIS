import React from "react";
import { EnrichedPointType } from "Types";
import { useContent } from "hooks/useContent";

export default function Header({
  setSelectedPointIds,
  filteredPoints,
  filter,
  setFilter,
}: {
  setSelectedPointIds: (value: number[]) => void;
  filteredPoints: EnrichedPointType[];
  filter: string;
  setFilter: (value: string) => void;
}) {
  const content = useContent();

  return (
    <>
      <div className="flex gap-x-2 pl-2">
        <button
          className="text-primary text-xs font-semibold"
          onClick={() => setSelectedPointIds(filteredPoints.map((pt) => pt.id))}
        >
          Selecteer alle
        </button>

        <span className="text-gray-500 text-xs font-semibold">|</span>

        <button
          className="text-primary text-xs font-semibold"
          onClick={() => setSelectedPointIds([])}
        >
          Deselecteer alle
        </button>
      </div>

      <div className="px-1.5 mt-1 mb-2">
        <input
          type="text"
          placeholder={
            content.voorbereiding.addPointsFromPlan.placeholders.filterPoints
          }
          className="inputClass"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
    </>
  );
}
