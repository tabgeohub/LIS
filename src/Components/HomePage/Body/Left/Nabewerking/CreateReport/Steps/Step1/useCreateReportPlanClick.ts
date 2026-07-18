import useLogAction from "hooks/useLogAction";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlanMapHighlight } from "hooks/hover-click-handlers/useFinishedPlanMapHighlight";
import { createReportPlanClickLogData } from "./createReportPlanClickLogData";

export function useCreateReportPlanClick(
  plan: FinishedFlightPlanType,
  setSelectedPlan: (plan: FinishedFlightPlanType | null) => void
) {
  const { handleClick } = useFinishedPlanMapHighlight("createReport");
  const logAction = useLogAction();

  return () => {
    handleClick(plan, setSelectedPlan);
    logAction({
      message: "User clicked on a flight plan",
      step: "First step",
      newData: createReportPlanClickLogData(plan),
    });
  };
}
