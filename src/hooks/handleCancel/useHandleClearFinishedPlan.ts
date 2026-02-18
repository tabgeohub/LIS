import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { usePointsStore } from "hooks/features/usePointsStore";

export function useHandleClearFinishedPlan() {
  const { setOpenFilter, setSelectedPlan, setDateFrom, setDateTo, setPeriode } =
    useFinishedPlansState();
  const { dbPoints, setPoints } = usePointsStore();

  return () => {
    setOpenFilter(false);
    setSelectedPlan(null);

    setDateFrom("");
    setDateTo("");
    setPeriode("");

    setPoints(dbPoints);
  };
}
