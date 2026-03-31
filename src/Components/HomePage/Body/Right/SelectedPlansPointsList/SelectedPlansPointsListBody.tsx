import type { SelectedListItem } from "@helpers/timeslider";
import { FinishedGeometryType, FinishedPointType } from "Types/finished_plans";
import SelectedPlanGeometryRow from "./SelectedPlanGeometryRow";
import SelectedPlanPointRow from "./SelectedPlanPointRow";

export default function SelectedPlansPointsListBody({
  items,
  onPointEnter,
  onGeometryEnter,
  onLeave,
  onGoToPoint,
  onGoToGeometry,
  onRowDropdown,
}: {
  items: SelectedListItem[];
  onPointEnter: (point: FinishedPointType) => void;
  onGeometryEnter: (geometry: FinishedGeometryType) => void;
  onLeave: () => void;
  onGoToPoint: (point: FinishedPointType) => void;
  onGoToGeometry: (geometry: FinishedGeometryType) => void;
  onRowDropdown?: (item: SelectedListItem) => void;
}) {
  return (
    <div className="divide-y">
      {items.map((item) =>
        item.type === "point" ? (
          <SelectedPlanPointRow
            key={item.key}
            point={item.point}
            vluchtnummers={item.vluchtnummers}
            onMouseEnter={() => onPointEnter(item.point)}
            onMouseLeave={onLeave}
            onGoTo={() => onGoToPoint(item.point)}
            onDropdownClick={
              onRowDropdown ? () => onRowDropdown(item) : undefined
            }
          />
        ) : (
          <SelectedPlanGeometryRow
            key={item.key}
            geometry={item.geometry}
            geometryLabel={item.geometryLabel}
            vluchtnummers={item.vluchtnummers}
            onMouseEnter={() => onGeometryEnter(item.geometry)}
            onMouseLeave={onLeave}
            onGoTo={() => onGoToGeometry(item.geometry)}
            onDropdownClick={
              onRowDropdown ? () => onRowDropdown(item) : undefined
            }
          />
        )
      )}
    </div>
  );
}
