import { useState } from "react";
import type { SelectedListItem } from "@helpers/timeslider";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { FinishedGeometryType, FinishedPointType } from "Types/finished_plans";
import { buildTimesliderItemDetailHref } from "../Common/buildTimesliderItemDetailHref";
import SelectedPlanGeometryImagesPanel from "../Images/SelectedPlanGeometryImagesPanel";
import SelectedPlanPointImagesPanel from "../Images/SelectedPlanPointImagesPanel";
import SelectedPlanGeometryRow from "../Rows/SelectedPlanGeometryRow";
import SelectedPlanPointRow from "../Rows/SelectedPlanPointRow";
import SelectedPlanRowAccordionPanel from "../Rows/SelectedPlanRowAccordionPanel";

export default function SelectedPlansPointsListBody({
  items,
  onPointEnter,
  onGeometryEnter,
  onLeave,
}: {
  items: SelectedListItem[];
  onPointEnter: (point: FinishedPointType) => void;
  onGeometryEnter: (geometry: FinishedGeometryType) => void;
  onLeave: () => void;
}) {
  const { user } = useAuth();
  const { dateFrom, dateTo } = useTimesliderState();
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setExpandedRowKey((current) => (current === key ? null : key));
  };

  return (
    <div className="divide-y divide-gray-200">
      {items.map((item) => {
        const isOpen = expandedRowKey === item.key;

        return (
          <div
            key={item.key}
            onMouseEnter={() =>
              item.type === "point"
                ? onPointEnter(item.point)
                : onGeometryEnter(item.geometry)
            }
            onMouseLeave={onLeave}
          >
            {item.type === "point" ? (
              <SelectedPlanPointRow
                point={item.point}
                vluchtnummers={item.vluchtnummers}
                detailHref={buildTimesliderItemDetailHref({
                  kind: "point",
                  id: item.point.id,
                  dateFrom,
                  dateTo,
                  planId: item.planId,
                })}
                onDropdownClick={() => toggleAccordion(item.key)}
                accordionOpen={isOpen}
              />
            ) : (
              <SelectedPlanGeometryRow
                geometry={item.geometry}
                geometryLabel={item.geometryLabel}
                vluchtnummers={item.vluchtnummers}
                detailHref={buildTimesliderItemDetailHref({
                  kind: "geometry",
                  id: item.geometry.id,
                  dateFrom,
                  dateTo,
                  planId: item.planId,
                })}
                onDropdownClick={() => toggleAccordion(item.key)}
                accordionOpen={isOpen}
              />
            )}
            <SelectedPlanRowAccordionPanel open={isOpen}>
              {item.type === "point" ? (
                <SelectedPlanPointImagesPanel
                  pointId={item.point.id}
                  planIds={[item.planId]}
                  regioId={
                    user.role ? String(user.role) : undefined
                  }
                  isOpen={isOpen}
                />
              ) : (
                <SelectedPlanGeometryImagesPanel
                  geometryId={item.geometry.id}
                  planIds={[item.planId]}
                  regioId={
                    user.role ? String(user.role) : undefined
                  }
                  isOpen={isOpen}
                />
              )}
            </SelectedPlanRowAccordionPanel>
          </div>
        );
      })}
    </div>
  );
}
