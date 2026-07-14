import { useFilterState } from "@helpers/ZustandStates/filterState";
import { useTabState } from "@helpers/ZustandStates/tabState";
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
