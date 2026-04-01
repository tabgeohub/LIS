import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaMapMarkedAlt } from "react-icons/fa";
import { LuWaypoints } from "react-icons/lu";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  sortPlansNewestFirst,
  removeTimesliderHighlights,
  drawSelectedPlansYellowHighlights,
} from "@helpers/timeslider";

export default function FlightPlansListCheckbox() {
  const { user } = useAuth();
  const { yellowGraphicsLayer } = useMapViewState();
  const {
    dateFrom,
    dateTo,
    plans,
    setPlans,
    setSelectedPlanIds,
    selectedPlanIds,
    togglePlan,
  } = useTimesliderState();
  const [loading, setLoading] = useState(false);
  const selectedIds = new Set(selectedPlanIds);

  useEffect(() => {
    if (!dateFrom || !dateTo || !user?.role) {
      setPlans([]);
      setSelectedPlanIds([]);
      return;
    }
    const fromStr = dayjs(dateFrom).format("YYYY-MM-DD");
    const toStr = dayjs(dateTo).format("YYYY-MM-DD");
    setLoading(true);
    axios
      .get<FinishedFlightPlanType[]>(
        `${getBackEndUrl()}/api/timeslider/getFinishedPlansTimeslider`,
        {
          params: { regio_id: user.role, from: fromStr, to: toStr },
        }
      )
      .then((res) => setPlans(sortPlansNewestFirst(res.data || [])))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo, user?.role, setPlans, setSelectedPlanIds]);

  useEffect(() => {
    if (!yellowGraphicsLayer) return;

    removeTimesliderHighlights(yellowGraphicsLayer);

    if (selectedPlanIds.length === 0 || plans.length === 0) return;

    drawSelectedPlansYellowHighlights(
      yellowGraphicsLayer,
      plans,
      selectedPlanIds
    );
  }, [plans, selectedPlanIds, yellowGraphicsLayer]);

  const hasRange = !!dateFrom && !!dateTo;

  return (
    <div className="h-full overflow-auto">
      {!hasRange && (
        <p className="text-[12px] text-gray-400 px-2 py-2">
          Selecteer een periode met de timeslider.
        </p>
      )}
      {hasRange && loading && (
        <p className="text-[12px] text-gray-400 px-2 py-2">Laden...</p>
      )}
      {hasRange && !loading && plans.length === 0 && (
        <p className="text-[12px] text-gray-400 px-2 py-2">
          Er zijn geen vluchtplannen in deze periode.
        </p>
      )}
      {hasRange && !loading && plans.length > 0 && (
        <div className="divide-y-2">
          {plans.map((plan) => (
            <label
              key={plan.id}
              className="p-2 hover:bg-gray-100 transition-all relative flex items-start gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(plan.id)}
                onChange={() => togglePlan(plan.id)}
                className="mt-1.5 shrink-0"
              />
              <div className="flex-1 min-w-0 relative">
                <div className="flex items-center gap-x-2">
                  <FaMapMarkedAlt className="size-6 text-blue-500 shrink-0" />
                  <p className="text-[12px]">{plan.vluchtnummer}</p>
                </div>
                <div className="text-[10px] text-gray-500 mt-2">
                  <p>Omschrijving: {plan.omschrijving}</p>
                  <p>Doel en hoofdthema: {plan.hoofdthema}</p>
                  <p>Aanvullende informatie: {plan.aanvullende}</p>
                  <p>
                    Inspectiedatum: {dayjs(plan.datum).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="absolute mt-4 bottom-0 right-4">
                  <LuWaypoints className="size-4 text-gray-500" />
                  <span className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
                    {(plan.points_data?.length || 0) +
                      (plan.geometries?.length || 0)}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
