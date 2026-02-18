import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useResetFeatures } from "hooks/features/useResetFeatures";

export function useHandleClearFinishedPlan() {
  const { setOpenFilter, setSelectedPlan, setDateFrom, setDateTo, setPeriode } =
    useFinishedPlansState();
  const { resetFeatures } = useResetFeatures();

  return () => {
    setOpenFilter(false);
    setSelectedPlan(null);

    setDateFrom("");
    setDateTo("");
    setPeriode("");

    resetFeatures();
  };
}
