import { useState } from "react";
import type { SelectedListItem } from "@helpers/timeslider";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { FinishedGeometryType, FinishedPointType } from "Types/finished_plans";
import SelectedPlanGeometryAccordionPlaceholder from "./SelectedPlanGeometryAccordionPlaceholder";
import SelectedPlanGeometryRow from "./SelectedPlanGeometryRow";
import SelectedPlanPointImagesPanel from "./SelectedPlanPointImagesPanel";
import SelectedPlanPointRow from "./SelectedPlanPointRow";
import SelectedPlanRowAccordionPanel from "./SelectedPlanRowAccordionPanel";

export default function SelectedPlansPointsListBody({
  items,
  onPointEnter,
  onGeometryEnter,
  onLeave,
  onGoToPoint,
  onGoToGeometry,
}: {
  items: SelectedListItem[];
  onPointEnter: (point: FinishedPointType) => void;
  onGeometryEnter: (geometry: FinishedGeometryType) => void;
  onLeave: () => void;
  onGoToPoint: (point: FinishedPointType) => void;
  onGoToGeometry: (geometry: FinishedGeometryType) => void;
}) {
  const { user } = useAuth();
  const { selectedPlanIds } = useTimesliderState();
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
                onGoTo={() => onGoToPoint(item.point)}
                onDropdownClick={() => toggleAccordion(item.key)}
                accordionOpen={isOpen}
              />
            ) : (
              <SelectedPlanGeometryRow
                geometry={item.geometry}
                geometryLabel={item.geometryLabel}
                vluchtnummers={item.vluchtnummers}
                onGoTo={() => onGoToGeometry(item.geometry)}
                onDropdownClick={() => toggleAccordion(item.key)}
                accordionOpen={isOpen}
              />
            )}
            <SelectedPlanRowAccordionPanel open={isOpen}>
              {item.type === "point" ? (
                <SelectedPlanPointImagesPanel
                  pointId={item.point.id}
                  planIds={selectedPlanIds}
                  regioId={
                    user.role ? String(user.role) : undefined
                  }
                  isOpen={isOpen}
                />
              ) : (
                <SelectedPlanGeometryAccordionPlaceholder />
              )}
            </SelectedPlanRowAccordionPanel>
          </div>
        );
      })}
    </div>
  );
}
