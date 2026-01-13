import { HiChevronRight, HiOutlineMap, HiOutlineShare } from "react-icons/hi";
import { useViewPlanState } from "../../../helpers/useViewPlanState";
import { useState } from "react";
import { useContent } from "hooks/useContent";

type Point = { id: number; omschrijving: string };
type ItemModel = { id: number; title: string; points: Point[] };

export default function PlansList({
  items,
  onSelect,
}: {
  items: ItemModel[];
  onSelect: (id: number) => void;
}) {
  const { selectedPlan } = useViewPlanState();
  const content = useContent();

  const [filter, setFilter] = useState("");

  return (
    <div className="space-y-1">
      <div className="pl-1.5">
        <input
          type="text"
          placeholder={
            content.voorbereiding.addPointsFromPlan.placeholders.filterPlans
          }
          className="inputClass mb-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {items
        .filter((item) => item.id !== selectedPlan?.id)
        .filter((item) =>
          item.title.toLowerCase().includes(filter.toLowerCase())
        )
        .map((item) => (
          <button
            key={item.id}
            type="button"
            className="w-full px-3 py-1.5 bg-white hover:bg-gray-50 border-b border-gray-200 text-left"
            onClick={() => onSelect(item.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <HiOutlineMap className="text-blue-500 mt-0.5" size={20} />
                <div>
                  <div className="text-gray-800 font-medium">{item.title}</div>
                  <div className="text-gray-500 text-sm flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <HiOutlineShare className="text-gray-400" />
                      {item.points.length}{" "}
                      {item.points.length === 1 ? "Punt" : "Punten"}
                    </span>
                  </div>
                </div>
              </div>
              <HiChevronRight className="text-gray-400" />
            </div>
          </button>
        ))}
    </div>
  );
}
