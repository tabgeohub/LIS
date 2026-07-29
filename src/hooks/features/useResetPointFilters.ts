import { useFilterState } from "hooks/zustand/ui/filterState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useResetFeatures } from "./useResetFeatures";

export function useResetPointFilters() {
  const {
    setNaamAandachtspunt,
    setActiviteit,
    setOrganisatie,
    setVan,
    setTot,
    setHerhalen,
  } = useFilterState();
  const { setSelectedTab } = useTabState();
  const { resetFeatures } = useResetFeatures();

  function resetPointFilters() {
    setNaamAandachtspunt("");
    setActiviteit("");
    setOrganisatie("");
    setVan("");
    setTot("");
    setHerhalen("");
    resetFeatures();
    setSelectedTab("none");
  }

  return { resetPointFilters };
}
