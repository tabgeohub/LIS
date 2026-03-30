import { useMemo } from "react";
import { LuWaypoints } from "react-icons/lu";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { TbPolygon, TbLine } from "react-icons/tb";
import { FaMapPin } from "react-icons/fa";
import {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";

type PointWithSource = {
  point: FinishedPointType;
  vluchtnummer: string;
  source: "point" | "geometry";
  geometryLabel?: string;
};

function collectPointsFromPlans(
  plans: FinishedFlightPlanType[],
  selectedIds: number[]
): PointWithSource[] {
  const result: PointWithSource[] = [];
  const selectedSet = new Set(selectedIds);
  for (const plan of plans) {
    if (!selectedSet.has(plan.id)) continue;
    const vn = plan.vluchtnummer || `Plan ${plan.id}`;
    for (const p of plan.points_data || []) {
      result.push({ point: p, vluchtnummer: vn, source: "point" });
    }
    for (const g of plan.geometries || []) {
      const label =
        g.geometry_omschrijving ||
        g.geometry_type ||
        `Geometrie ${g.id}`;
      for (const p of g.points || []) {
        result.push({
          point: p,
          vluchtnummer: vn,
          source: "geometry",
          geometryLabel: label,
        });
      }
    }
  }
  return result;
}

export default function SelectedPlansPointsList() {
  const { plans, selectedPlanIds } = useTimesliderState();
  const pointsWithSource = useMemo(
    () => collectPointsFromPlans(plans, selectedPlanIds),
    [plans, selectedPlanIds]
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b bg-gray-50 shrink-0">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <LuWaypoints className="size-4 text-primary" />
          Aandachtspunten ({pointsWithSource.length})
        </h3>
      </div>
      <div className="flex-1 overflow-auto">
        {pointsWithSource.length === 0 ? (
          <p className="text-[12px] text-gray-400 px-3 py-4">
            Selecteer vluchtplannen om de aandachtspunten te tonen.
          </p>
        ) : (
          <div className="divide-y">
            {pointsWithSource.map(({ point, vluchtnummer, source, geometryLabel }, idx) => (
              <div
                key={`${point.id}-${idx}`}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  {source === "point" ? (
                    <FaMapPin className="size-4 text-primary mt-0.5 shrink-0" />
                  ) : (
                    geometryLabel?.toLowerCase().includes("polygon") ? (
                      <TbPolygon className="size-4 text-yellow-500 mt-0.5 shrink-0" />
                    ) : (
                      <TbLine className="size-4 text-green-500 mt-0.5 shrink-0" />
                    )
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-gray-800 truncate">
                      {point.omschrijving || `Punt ${point.id}`}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {vluchtnummer}
                      {geometryLabel && ` • ${geometryLabel}`}
                    </p>
                    {(point.xcoordinaat_rd != null || point.latitude != null) && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {point.xcoordinaat_rd != null
                          ? `RD: ${point.xcoordinaat_rd.toFixed(0)} / ${point.ycoordinaat_rd?.toFixed(0) ?? "-"}`
                          : `WGS84: ${point.latitude?.toFixed(4) ?? "-"} / ${point.longitude?.toFixed(4) ?? "-"}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
