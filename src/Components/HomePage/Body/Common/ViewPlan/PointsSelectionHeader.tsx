import { useContent } from "hooks/useContent";

export default function PointsSelectionHeader({
  onSelectAll,
  onDeselectAll,
  filter,
  setFilter,
}: {
  onSelectAll: () => void;
  onDeselectAll: () => void;
  filter: string;
  setFilter: (value: string) => void;
}) {
  const content = useContent();

  return (
    <>
      <div className="flex gap-x-2 pl-2">
        <button
          type="button"
          className="text-primary text-xs font-semibold"
          onClick={onSelectAll}
        >
          Selecteer alle
        </button>

        <span className="text-gray-500 text-xs font-semibold">|</span>

        <button
          type="button"
          className="text-primary text-xs font-semibold"
          onClick={onDeselectAll}
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
