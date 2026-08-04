import { useFilterState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
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
