import { LuWaypoints } from "react-icons/lu";
import FlightPlanSummary from "Components/HomePage/Body/Left/Common/FlightPlanSummary";
import { useTimesliderFlightPlans } from "./useTimesliderFlightPlans";

export default function FlightPlansListCheckbox() {
  const state = useTimesliderFlightPlans();
  const selectedIds = new Set(state.selectedPlanIds);

  if (!state.hasRange) {
    return <StatusMessage text="Selecteer een periode met de timeslider." />;
  }
  if (state.loading) return <StatusMessage text="Laden..." />;
  if (!state.plans.length) {
    return <StatusMessage text="Er zijn geen vluchtplannen in deze periode." />;
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex gap-x-2 pl-2 pt-2">
        <button
          type="button"
          className="text-primary text-xs font-semibold"
          onClick={() => state.setSelectedPlanIds(state.plans.map((plan) => plan.id))}
        >
          Selecteer alle
        </button>
        <span className="text-gray-500 text-xs font-semibold">|</span>
        <button
          type="button"
          className="text-primary text-xs font-semibold"
          onClick={() => state.setSelectedPlanIds([])}
        >
          Deselecteer alle
        </button>
      </div>
      <div className="divide-y-2 border-t border-gray-200 mt-1">
        {state.plans.map((plan) => (
          <label
            key={plan.id}
            className="p-2 hover:bg-gray-100 transition-all relative flex items-start gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.has(plan.id)}
              onChange={() => state.togglePlan(plan.id)}
              className="mt-1.5 shrink-0"
            />
            <div className="flex-1 min-w-0 relative">
              <FlightPlanSummary
                plan={plan}
                dateFormat="DD/MM/YYYY"
                trailing={
                  <div className="absolute mt-4 bottom-0 right-4">
                    <LuWaypoints className="size-4 text-gray-500" />
                    <span className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
                      {(plan.points_data?.length || 0) + (plan.geometries?.length || 0)}
                    </span>
                  </div>
                }
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function StatusMessage({ text }: { text: string }) {
  return (
    <div className="h-full overflow-auto">
      <p className="text-[12px] text-gray-400 px-2 py-2">{text}</p>
    </div>
  );
}
