import { LuWaypoints } from "react-icons/lu";

export default function SelectedPlansPointsListHeader({
  count,
}: {
  count: number;
}) {
  return (
    <div className="shrink-0 border-b bg-gray-50 px-3 py-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <LuWaypoints className="size-4 text-primary" />
        Points and Geometries ({count})
      </h3>
    </div>
  );
}
