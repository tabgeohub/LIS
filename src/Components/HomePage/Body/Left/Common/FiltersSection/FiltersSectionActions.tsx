import { useFilterState } from "hooks/zustand/ui/filterState";
import { useContent } from "hooks/useContent";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useResetPointFilters } from "hooks/features/useResetPointFilters";

export function FiltersSectionActions() {
  const { fetchPoints } = usePointsStore();
  const { resetPointFilters } = useResetPointFilters();
  const content = useContent();
  const f = useFilterState();

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6">
      <button
        onClick={() =>
          fetchPoints({
            naamAandachtspunt: f.naamAandachtspunt,
            activiteit: f.activiteit,
            organisatie: f.organisatie,
            van: f.van,
            tot: f.tot,
            herhalen: f.herhalen,
            regio: f.regio,
          })
        }
        className="gray-button"
      >
        {content.common.filteren}
      </button>
      <button onClick={resetPointFilters} className="gray-button">
        {content.common.annuleren}
      </button>
    </div>
  );
}
