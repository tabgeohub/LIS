import { useFilterState } from "@helpers/ZustandStates/filterState";
import { usePointsStore } from "hooks/zustand/usePointsStore";

export function useHandleFilterTab() {
  const { fetchPoints } = usePointsStore();

  const {
    naamAandachtspunt,
    activiteit,
    organisatie,
    van,
    tot,
    herhalen,
    regio,
  } = useFilterState();

  return function handleFilter() {
    fetchPoints({
      naamAandachtspunt,
      activiteit,
      organisatie,
      van,
      tot,
      herhalen,
      regio,
    });
  };
}
